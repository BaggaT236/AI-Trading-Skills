---
name: stockbee-setup-fluency-trainer
description: Build a Stockbee-style setup model book from momentum-burst screener candidates, then update 3-day and 5-day forward outcomes with MFE/MAE, stop-hit status, outcome tags, and cohort statistics. Use when the user wants to study Stockbee Momentum Burst examples, track failed candidates, build setup fluency, review A/B setup quality, or convert screener outputs into a learning loop rather than immediate trade signals.
---

# Stockbee Setup Fluency Trainer

Build and maintain a model book for Stockbee-style Momentum Burst setups. This skill turns daily screener candidates into structured study records, updates them after the 3-day and 5-day windows mature, and summarizes which setup features are working or failing.

## When to Use

- User wants to study Stockbee Momentum Burst setups systematically
- User asks to build a model book from `stockbee-momentum-burst-screener` output
- User wants to review failed candidates, missed trades, or A/B setup quality
- User wants 3-day / 5-day forward returns, MFE, MAE, and stop-hit outcomes
- User wants to improve setup recognition before increasing position size
- User asks which Stockbee tags should be promoted, downgraded, or filtered

## Prerequisites

- Python 3.10+
- A `stockbee-momentum-burst-screener` JSON report, or compatible candidate JSON
- Optional: FMP API key for outcome updates when offline OHLCV JSON is not supplied
- Recommended local state path: `state/stockbee/model_book.jsonl`

## Workflow

### Step 1: Ingest Momentum Burst Candidates

Run after the Stockbee Momentum Burst screener has produced a JSON report.

```bash
python3 skills/stockbee-setup-fluency-trainer/scripts/build_model_book.py ingest \
  --screener-json reports/stockbee_momentum_burst_YYYY-MM-DD_HHMMSS.json \
  --model-book state/stockbee/model_book.jsonl \
  --output-dir reports/
```

Use `--include-rejects` when intentionally building a negative-example set. Otherwise rejected candidates are skipped.

### Step 2: Update 3-Day and 5-Day Outcomes

Use FMP:

```bash
python3 skills/stockbee-setup-fluency-trainer/scripts/build_model_book.py update \
  --model-book state/stockbee/model_book.jsonl \
  --horizons 3,5 \
  --output-dir reports/
```

Use offline OHLCV JSON:

```bash
python3 skills/stockbee-setup-fluency-trainer/scripts/build_model_book.py update \
  --model-book state/stockbee/model_book.jsonl \
  --prices-json data/daily_ohlcv.json \
  --horizons 3,5 \
  --output-dir reports/
```

The update step records:

- Forward close return for each horizon
- MFE and MAE over each horizon
- Stop-hit status and first stop-hit date
- Outcome tags such as `STRONG_WINNER`, `WORKED`, `FAILED_STOP`, `FAILED_FADE`, `CHOPPY_FAILURE`, or `NEUTRAL`

### Step 3: Summarize Cohorts

```bash
python3 skills/stockbee-setup-fluency-trainer/scripts/build_model_book.py summarize \
  --model-book state/stockbee/model_book.jsonl \
  --group-by rating,primary_trigger,setup_tags \
  --min-sample 5 \
  --output-dir reports/
```

Review the generated Markdown and JSON reports. Treat `rule_candidates` as evidence prompts, not automatic rule changes.

### Step 4: Convert Evidence Into Practice

For cohorts with enough examples:

- Promote tags with high win rate, positive 5-day expectancy, and acceptable average MAE
- Downgrade or filter tags with weak 5-day expectancy, frequent stop hits, or repeated fade failures
- Inspect representative charts manually before changing trade rules
- Log accepted lessons in `trader-memory-core` or the monthly review process

## Model Book Fields

Each JSONL record includes:

- `record_id`, `symbol`, `setup_date`, `primary_trigger`
- `rating`, `setup_score`, `setup_tags`
- `entry_reference`, `stop_reference`, `risk_pct_to_stop`
- `human_label`, `human_decision`, `human_notes`
- `outcomes.3d` and `outcomes.5d`
- `overall_outcome`, `matured`, `raw_candidate`

## Interpretation Rules

- `STRONG_WINNER`: 5-day close return >= 8% or MFE >= 12%, with no stop hit
- `WORKED`: 5-day close return >= 4% or MFE >= 6%, with no stop hit
- `FAILED_STOP`: Stop was touched within the horizon
- `FAILED_FADE`: Forward return <= -2% without a recorded stop hit
- `CHOPPY_FAILURE`: Adverse excursion was large and forward progress was poor
- `NEUTRAL`: No decisive follow-through or failure
- `PENDING`: Not enough future bars yet

## Output

- `state/stockbee/model_book.jsonl` - Durable setup model book
- `stockbee_setup_fluency_ingest_YYYY-MM-DD_HHMMSS.json/md`
- `stockbee_setup_fluency_update_YYYY-MM-DD_HHMMSS.json/md`
- `stockbee_setup_fluency_summary_YYYY-MM-DD_HHMMSS.json/md`

## Resources

- `references/model_book_schema.md` - JSONL schema and lifecycle states
- `references/outcome_tags.md` - Outcome classification and tag definitions
- `references/review_workflow.md` - Daily, 3-day, 5-day, and monthly review routine
