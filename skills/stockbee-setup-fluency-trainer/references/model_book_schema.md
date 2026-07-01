# Stockbee Setup Model Book Schema

The model book is a JSONL file. Each line is one study record for one setup candidate on one setup date.

Default path:

```text
state/stockbee/model_book.jsonl
```

## Record Identity

```json
{
  "schema_version": "1.0",
  "record_id": "stockbee_mb:TEST:2026-06-20:4pct_breakout",
  "source_skill": "stockbee-momentum-burst-screener",
  "source_report": "reports/stockbee_momentum_burst_2026-06-20_174954.json",
  "symbol": "TEST",
  "setup_date": "2026-06-20",
  "setup_type": "stockbee_momentum_burst",
  "primary_trigger": "4pct_breakout"
}
```

`record_id` is deterministic so repeated ingest runs update the same record instead of duplicating it.

## Setup Quality Fields

```json
{
  "rating": "A-",
  "setup_score": 84,
  "state_at_ingest": "ACTIONABLE_DAY1",
  "trigger_tags": ["4pct_breakout", "range_expansion"],
  "setup_tags": ["close_near_high", "tight_base", "compact_risk"],
  "entry_reference": 52.4,
  "stop_reference": 50.9,
  "risk_pct_to_stop": 2.86,
  "day_gain_pct": 5.22,
  "volume_ratio_1d": 2.99,
  "close_location_pct": 86.0,
  "prior_base_days": 8,
  "base_width_pct": 4.8
}
```

The `setup_tags` field is the core of the fluency loop. It turns subjective chart-review features into analyzable cohorts.

## Human Review Fields

```json
{
  "human_label": "A-",
  "human_decision": "entered",
  "human_notes": "Clean 8-day base, high close, theme support."
}
```

The script initializes these fields but does not overwrite human edits during re-ingest.

## Outcome Fields

```json
{
  "outcomes": {
    "3d": {
      "matured": true,
      "close_date": "2026-06-25",
      "forward_return_pct": 6.42,
      "mfe_pct": 8.15,
      "mae_pct": -1.20,
      "stop_hit": false,
      "outcome_tag": "WORKED"
    },
    "5d": {
      "matured": true,
      "close_date": "2026-06-29",
      "forward_return_pct": 9.11,
      "mfe_pct": 12.40,
      "mae_pct": -1.20,
      "stop_hit": false,
      "outcome_tag": "STRONG_WINNER"
    }
  },
  "overall_outcome": "STRONG_WINNER",
  "matured": true
}
```

The primary summary outcome uses the longest requested horizon, usually 5 trading days.

## Lifecycle

```text
PENDING_OUTCOME
  Ingested, but not enough future bars exist yet.

MATURED_OUTCOME
  3-day and/or 5-day windows have enough data.

REVIEWED_BY_HUMAN
  Trader has inspected the chart and added human_label / human_notes.
```

The current script uses `matured: true/false`; human review status can be inferred from `human_label` and `human_notes`.
