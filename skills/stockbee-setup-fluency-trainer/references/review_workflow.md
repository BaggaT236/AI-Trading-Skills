# Stockbee Setup Fluency Review Workflow

This workflow separates candidate generation from learning. The goal is to build procedural recognition of A-quality setups by repeatedly comparing what the setup looked like on day 1 with what happened over the next 3 to 5 trading days.

## Daily After-Close Routine

1. Run `stockbee-momentum-burst-screener`.
2. Ingest the JSON report into the model book.
3. Add human notes for any A/A- setups reviewed manually.
4. Do not change trading rules from one day of examples.

```bash
python3 skills/stockbee-setup-fluency-trainer/scripts/build_model_book.py ingest \
  --screener-json reports/stockbee_momentum_burst_*.json \
  --model-book state/stockbee/model_book.jsonl \
  --output-dir reports/
```

## 3-Day / 5-Day Outcome Routine

Run the update command daily or a few times per week. Matured records will receive forward returns, MFE, MAE, and outcome tags.

```bash
python3 skills/stockbee-setup-fluency-trainer/scripts/build_model_book.py update \
  --model-book state/stockbee/model_book.jsonl \
  --horizons 3,5 \
  --output-dir reports/
```

## Weekly Review

Run a summary with a small sample threshold to see early patterns.

```bash
python3 skills/stockbee-setup-fluency-trainer/scripts/build_model_book.py summarize \
  --model-book state/stockbee/model_book.jsonl \
  --min-sample 3 \
  --output-dir reports/
```

Review:

- Best A/A- winners
- Worst failed-stop examples
- False positives with weak close quality
- Any `wide_risk`, `wide_base`, or `three_days_up_before_trigger` clusters

## Monthly Review

Use a higher sample threshold before changing rules.

```bash
python3 skills/stockbee-setup-fluency-trainer/scripts/build_model_book.py summarize \
  --model-book state/stockbee/model_book.jsonl \
  --min-sample 10 \
  --output-dir reports/
```

Possible actions:

- Promote tags that repeatedly produce positive 5-day expectancy
- Downgrade tags with high stop-hit or fade failure rates
- Add manual chart examples to a separate visual model book
- Feed accepted lessons into `trader-memory-core` or the monthly review process

## Review Discipline

Do not overfit to a tiny sample. Treat `rule_candidates` as prompts for chart review. A rule change should normally require enough examples, plausible market logic, and manual inspection of representative charts.
