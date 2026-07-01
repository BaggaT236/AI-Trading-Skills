import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPT_DIR))

from build_model_book import (  # noqa: E402
    Bar,
    classify_outcome,
    load_model_book,
    load_prices_json,
    load_screener_candidates,
    make_record,
    make_studyable_records,
    save_model_book,
    summarize_model_book,
    update_record_outcomes,
    upsert_records,
)


def candidate(symbol="TEST", date="2026-06-20", rating="A"):
    return {
        "symbol": symbol,
        "date": date,
        "state": "ACTIONABLE_DAY1",
        "rating": rating,
        "setup_score": 93,
        "primary_trigger": "4pct_breakout",
        "trigger_tags": ["4pct_breakout", "dollar_breakout", "range_expansion"],
        "entry_reference": 104.5,
        "stop_reference": 101.0,
        "risk_pct_to_stop": 3.35,
        "day_gain_pct": 4.5,
        "volume_ratio_1d": 5.0,
        "volume_ratio_20d": 3.63,
        "close_location_pct": 87.5,
        "prior_base_days": 8,
        "base_width_pct": 3.2,
        "volume_dry_up": True,
        "recent_4pct_breakdown": False,
        "prior_up_streak": 1,
    }


def test_make_record_derives_model_book_fields_and_tags():
    record = make_record(candidate())

    assert record["record_id"] == "stockbee_mb:TEST:2026-06-20:4pct_breakout"
    assert record["overall_outcome"] == "PENDING"
    assert record["matured"] is False
    assert "close_near_high" in record["setup_tags"]
    assert "high_volume_expansion" in record["setup_tags"]
    assert "tight_base" in record["setup_tags"]
    assert "controlled_3_to_20_day_base" in record["setup_tags"]
    assert "volume_dry_up" in record["setup_tags"]


def test_include_rejects_skips_skeleton_rejects_without_date(tmp_path):
    path = tmp_path / "screener.json"
    path.write_text(
        json.dumps(
            {
                "metadata": {"source": "test"},
                "candidates": [
                    candidate(),
                    {
                        "symbol": "SKEL",
                        "state": "REJECT",
                        "reject_reasons": ["insufficient_history"],
                    },
                ],
            }
        ),
        encoding="utf-8",
    )

    candidates = load_screener_candidates([path], include_rejects=True)
    records, stats = make_studyable_records(candidates)

    assert len(candidates) == 2
    assert len(records) == 1
    assert stats["studyable"] == 1
    assert stats["skipped"] == 1
    assert stats["skipped_missing_setup_date"] == 1


def test_update_outcomes_calculates_forward_return_mfe_mae_and_strong_winner():
    record = make_record(candidate())
    bars = [
        Bar("2026-06-20", 100, 105, 101, 104.5, 600000),
        Bar("2026-06-23", 105, 109, 104, 108, 700000),
        Bar("2026-06-24", 108, 112, 107, 111, 800000),
        Bar("2026-06-25", 111, 118, 110, 116, 900000),
        Bar("2026-06-26", 116, 119, 114, 118, 850000),
        Bar("2026-06-29", 118, 121, 117, 120, 900000),
    ]

    records, stats = update_record_outcomes([record], {"TEST": bars}, horizons=(3, 5))
    updated = records[0]

    assert stats["updated"] == 1
    assert stats["matured"] == 1
    assert updated["matured"] is True
    assert updated["overall_outcome"] == "STRONG_WINNER"
    assert updated["outcomes"]["3d"]["forward_return_pct"] == 11.0
    assert updated["outcomes"]["5d"]["mfe_pct"] == 15.79
    assert updated["outcomes"]["5d"]["mae_pct"] == -0.48


def test_update_outcomes_marks_stop_failure():
    record = make_record(candidate())
    bars = [
        Bar("2026-06-20", 100, 105, 101, 104.5, 600000),
        Bar("2026-06-23", 104, 105, 100.5, 101.5, 700000),
        Bar("2026-06-24", 101, 102, 98, 99, 800000),
        Bar("2026-06-25", 99, 100, 96, 97, 900000),
        Bar("2026-06-26", 97, 98, 95, 96, 850000),
        Bar("2026-06-29", 96, 97, 94, 95, 900000),
    ]

    records, _ = update_record_outcomes([record], {"TEST": bars}, horizons=(3, 5))
    updated = records[0]

    assert updated["outcomes"]["3d"]["stop_hit"] is True
    assert updated["outcomes"]["3d"]["stop_hit_date"] == "2026-06-23"
    assert updated["overall_outcome"] == "FAILED_STOP"


def test_classify_outcome_handles_neutral_and_worked():
    assert classify_outcome(4.2, 6.1, -1.0, stop_hit=False) == "WORKED"
    assert classify_outcome(0.5, 2.0, -1.0, stop_hit=False) == "NEUTRAL"
    assert classify_outcome(-2.5, 1.0, -4.0, stop_hit=False) == "FAILED_FADE"


def test_upsert_records_preserves_existing_outcome_fields():
    record = make_record(candidate())
    record["outcomes"] = {"5d": {"matured": True, "outcome_tag": "WORKED"}}
    record["overall_outcome"] = "WORKED"
    record["matured"] = True
    fresh = make_record(candidate())
    fresh["setup_score"] = 95

    records, stats = upsert_records([record], [fresh])

    assert stats == {"inserted": 0, "updated": 1, "total": 1}
    assert records[0]["setup_score"] == 95
    assert records[0]["overall_outcome"] == "WORKED"
    assert records[0]["matured"] is True


def test_load_prices_json_supports_prices_mapping(tmp_path):
    path = tmp_path / "prices.json"
    payload = {
        "prices": {
            "TEST": [
                {"date": "2026-06-24", "open": 108, "high": 112, "low": 107, "close": 111},
                {"date": "2026-06-23", "open": 105, "high": 109, "low": 104, "close": 108},
            ]
        }
    }
    path.write_text(json.dumps(payload), encoding="utf-8")

    prices = load_prices_json(path)

    assert list(prices) == ["TEST"]
    assert [b.date for b in prices["TEST"]] == ["2026-06-23", "2026-06-24"]


def test_save_and_load_model_book_jsonl(tmp_path):
    path = tmp_path / "model_book.jsonl"
    record = make_record(candidate())
    save_model_book(path, [record])

    loaded = load_model_book(path)

    assert loaded[0]["record_id"] == record["record_id"]


def test_summarize_model_book_groups_by_tags():
    records = []
    for i in range(6):
        r = make_record(candidate(symbol=f"T{i}", rating="A"))
        r["matured"] = True
        r["overall_outcome"] = "WORKED" if i < 5 else "NEUTRAL"
        r["outcomes"] = {
            "3d": {"forward_return_pct": 3.0, "matured": True},
            "5d": {
                "forward_return_pct": 4.0 if i < 5 else 0.5,
                "mfe_pct": 7.0,
                "mae_pct": -2.0,
                "stop_hit": False,
                "matured": True,
            },
        }
        records.append(r)

    summary = summarize_model_book(records, group_by_fields=["rating", "setup_tags"], min_sample=3)

    assert summary["matured_records"] == 6
    assert summary["groups"]["rating"][0]["group"] == "A"
    assert summary["groups"]["rating"][0]["win_rate_pct"] == 83.3
    assert any(rule["action"] == "promote" for rule in summary["rule_candidates"])
