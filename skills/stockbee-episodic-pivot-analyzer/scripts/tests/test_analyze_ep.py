import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPT_DIR))

from analyze_ep import (  # noqa: E402
    FMPClient,
    analyze_candidate,
    classify_catalyst,
    events_from_earnings_json,
    events_from_events_json,
    load_prices_json,
    price_stats_from_bars,
    sort_results,
)


def make_bars(symbol_move=True):
    bars = []
    close = 50.0
    for i in range(55):
        day = f"2026-03-{i + 1:02d}" if i < 31 else f"2026-04-{i - 30:02d}"
        bars.append(
            {
                "date": day,
                "open": close - 0.2,
                "high": close + 0.5,
                "low": close - 0.5,
                "close": close,
                "volume": 300000,
            }
        )
        close += 0.05
    # Event bar after a quiet prior run.
    bars.append(
        {
            "date": "2026-04-25",
            "open": 54.0,
            "high": 58.0,
            "low": 53.0,
            "close": 57.6,
            "volume": 3500000,
        }
    )
    return bars


def test_classify_guidance_keyword():
    catalyst, reasons = classify_catalyst(
        {"headline": "Company raises FY guidance after record demand"}
    )
    assert catalyst == "guidance_raise"
    assert reasons


def test_events_from_earnings_json_converts_results():
    data = {
        "schema_version": "1.0",
        "results": [{"symbol": "ABC", "earnings_date": "2026-04-25", "gap_pct": 7.5, "grade": "A"}],
    }
    events = events_from_earnings_json(data)
    assert len(events) == 1
    assert events[0]["symbol"] == "ABC"
    assert events[0]["catalyst_type"] == "earnings"
    assert events[0]["source_grade"] == "A"


def test_price_stats_compute_gap_volume_and_risk():
    bars = make_bars()
    stats = price_stats_from_bars("ABC", bars, "2026-04-25")
    assert stats.day_gain_pct and stats.day_gain_pct > 4
    assert stats.volume_ratio_50 and stats.volume_ratio_50 > 5
    assert stats.close_location_pct and stats.close_location_pct > 80
    assert stats.risk_pct_to_low and stats.risk_pct_to_low < 10


def test_fmp_historical_prices_keep_latest_stable_bars(monkeypatch):
    class FakeResponse:
        status_code = 200

        def json(self):
            return [
                {
                    "date": f"2026-01-{day:02d}",
                    "open": day,
                    "high": day,
                    "low": day,
                    "close": day,
                    "volume": day * 1000,
                }
                for day in range(1, 11)
            ]

    class FakeSession:
        headers = {}

        def get(self, url, params, timeout):  # noqa: ARG002
            return FakeResponse()

    monkeypatch.setenv("FMP_API_KEY", "test-key")
    client = FMPClient(api_key=None, max_api_calls=10)
    client.session = FakeSession()

    bars = client.get_historical_prices("ABC", days=3)

    assert [bar["date"] for bar in bars] == ["2026-01-08", "2026-01-09", "2026-01-10"]


def test_high_quality_ep_is_actionable_day1():
    bars = make_bars()
    event = {
        "symbol": "ABC",
        "event_date": "2026-04-25",
        "headline": "ABC raises guidance after record demand",
        "catalyst_type": "guidance_raise",
        "market_cap": 5_000_000_000,
    }
    result = analyze_candidate(event, {"ABC": bars}, {}, None, max_risk_pct=10.0)
    assert result["state"] == "ACTIONABLE_DAY1"
    assert result["rating"] in {"A", "A-"}
    assert result["ep_type"] == "GUIDANCE_EP"
    assert result["momentum_handoff"] is True


def test_wide_risk_high_score_goes_to_delayed_watch():
    bars = make_bars()
    bars[-1]["low"] = 45.0  # makes EP-day-low risk too wide
    event = {
        "symbol": "WIDE",
        "event_date": "2026-04-25",
        "headline": "WIDE receives FDA approval for breakthrough therapy",
        "catalyst_type": "fda_approval",
        "market_cap": 3_000_000_000,
    }
    result = analyze_candidate(event, {"WIDE": bars}, {}, None, max_risk_pct=10.0)
    assert result["state"] == "DELAYED_EP_WATCH"
    assert result["delayed_ep_watch"] is True
    assert "risk_too_wide_for_day1" in result["state_reasons"]


def test_unconfirmed_catalyst_is_watch_not_actionable():
    bars = make_bars()
    bars[-1]["open"] = 51.0
    bars[-1]["high"] = 52.0
    bars[-1]["low"] = 50.5
    bars[-1]["close"] = 51.2
    bars[-1]["volume"] = 300000
    event = {
        "symbol": "FDA",
        "event_date": "2026-04-25",
        "headline": "FDA approves new treatment",
        "catalyst_type": "fda_approval",
    }
    result = analyze_candidate(event, {"FDA": bars}, {}, None, max_risk_pct=10.0)
    assert result["state"] in {"CATALYST_WATCH", "REJECT"}
    assert result["state"] != "ACTIONABLE_DAY1"


def test_events_json_and_prices_json_roundtrip(tmp_path):
    events_path = tmp_path / "events.json"
    prices_path = tmp_path / "prices.json"
    events_path.write_text(
        json.dumps(
            {
                "events": [
                    {"symbol": "ABC", "event_date": "2026-04-25", "headline": "ABC raises guidance"}
                ]
            }
        ),
        encoding="utf-8",
    )
    prices_path.write_text(json.dumps({"prices": {"ABC": make_bars()}}), encoding="utf-8")
    events = events_from_events_json(json.loads(events_path.read_text()))
    prices = load_prices_json(str(prices_path))
    assert events[0]["catalyst_type"] == "guidance_raise"
    assert "ABC" in prices


def test_sort_results_prioritizes_actionable_over_score():
    rows = [
        {"symbol": "B", "state": "DELAYED_EP_WATCH", "composite_score": 99},
        {"symbol": "A", "state": "ACTIONABLE_DAY1", "composite_score": 80},
    ]
    assert sort_results(rows)[0]["symbol"] == "A"
