# Stockbee Momentum Burst Scoring System

The composite score ranges from 0 to 100.

| Component | Max Points | Meaning |
|---|---:|---|
| Trigger strength | 20 | 4% breakout, dollar breakout, range expansion, and 9M+ volume tag |
| Volume expansion | 15 | Volume relative to previous day and 20-day average |
| Setup quality | 25 | Prior base length, base width, prior-day narrow/down behavior, volume dry-up |
| Close quality | 10 | Close location within the daily range |
| Risk distance | 15 | Distance from entry reference to trigger-day low |
| Failure filters | 10 | Penalizes recent 4% breakdowns, three-day run-ups, and wide/loose action |
| Market gate | 5 | Rewards alignment with a permissive market regime |

## Ratings

| Score | Rating | State |
|---:|---|---|
| 90-100 | A | `ACTIONABLE_DAY1` after chart review |
| 80-89 | A- | `ACTIONABLE_DAY1` after chart review |
| 70-79 | B | `MANUAL_REVIEW` or reduced-size planning |
| 55-69 | Watch | `WATCH_ONLY` |
| <55 | Reject | `REJECTED` |

## Hard Rejection Rules

A candidate is rejected before scoring if any of these are true:

- Insufficient OHLCV history
- Current volume is below the configured minimum
- Price is below the configured minimum
- No trigger family is matched
- Risk to trigger-day low exceeds the configured maximum

## Soft Failure Filters

These reduce the score but do not automatically reject unless they make the score too low:

- Three consecutive up closes before the trigger day
- Recent 4% breakdown within the lookback window
- Prior base is too wide
- Close is in the lower half of the daily range
- Volume expands but not enough to confirm broad interest

## Market Gate

Use `--market-gate allowed`, `neutral`, or `restrictive`.

- `allowed`: normal scoring; adds full market-gate points
- `neutral`: modest market-gate score; report remains usable but conservative
- `restrictive`: output is marked as manual-review-only and the market component is zero
