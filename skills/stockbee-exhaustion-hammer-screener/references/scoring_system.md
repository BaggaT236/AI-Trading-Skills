# Stockbee Exhaustion Hammer Scoring System

The composite score ranges from 0 to 100.

| Component | Max Points | Meaning |
|---|---:|---|
| Quality / liquidity | 20 | Price, 20-day average dollar volume, market cap, optional fund/institutional-holder metadata |
| Prior momentum | 15 | A recent high within the lookback, 20/60-day strength, and constructive location versus the 50-day average |
| Pullback exhaustion | 20 | Controlled pullback depth, short-term undercut/reclaim, recent selling pressure, and volume confirmation |
| Hammer geometry | 25 | Long lower wick, small body, strong close-location, recovery from low, and limited upper wick |
| Risk distance | 15 | Distance from entry reference to day-low stop plus buffer |
| Market gate | 5 | Rewards alignment with a permissive market regime |

## Ratings

| Score | Rating | State |
|---:|---|---|
| 90-100 | A | `ACTIONABLE_CLOSE_BUY` after chart/news/risk review |
| 82-89 | A- | `ACTIONABLE_CLOSE_BUY` after chart/news/risk review |
| 70-81 | B | `MANUAL_REVIEW` or next-day confirmation |
| 55-69 | Watch | `WATCH_TOMORROW` |
| <55 | Reject | `REJECTED` |

## Hard Rejection Rules

A candidate is rejected before actionability if any of these are true:

- Insufficient OHLCV history
- Current price or current volume is below the configured floor
- 20-day average dollar volume is below the configured floor
- Known market cap is below the configured floor
- Hammer geometry fails lower-wick, body-size, close-location, wick/body, or recovery-from-low thresholds
- Pullback from the recent high is too shallow or too deep
- Recent high is too close or too stale
- `--require-undercut-reclaim` is set and the current low did not undercut/reclaim the short-term prior low
- Risk to stop exceeds the configured maximum

## Soft Failure Tags

These do not automatically reject unless the hard filters or total score fail:

- `no_undercut_reclaim`
- `deep_pullback`
- `stale_high`
- `weak_volume_confirmation`
- `moderate_close_location`
- `still_down_big_on_day`
- `wide_risk`

## Market Gate

Use `--market-gate allowed`, `neutral`, or `restrictive`.

- `allowed`: normal scoring; adds full market-gate points
- `neutral`: modest market-gate score; report remains usable but conservative
- `restrictive`: high-scoring candidates are marked manual-review-only and the market component is zero
