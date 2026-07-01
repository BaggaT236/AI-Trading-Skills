# Stockbee Exhaustion Hammer Methodology

This skill screens for a specific reversal context, not generic hammer candles.

The target pattern is:

1. A liquid, high-quality stock with prior momentum or institutional sponsorship.
2. A recent high followed by several days or weeks of selling.
3. A final push lower that shakes out weak holders, ideally undercutting a short-term low.
4. Buyers appearing before the close, leaving a long lower wick and a close in the upper part of the daily range.
5. A nearby day-low stop that makes risk definable.

## Why not screen every hammer?

A hammer in a structurally weak stock is often just a pause in a downtrend. The edge being modeled here is narrower: strong or widely watched stocks can attract buyers after selling pressure exhausts itself. That is why the script combines quality/liquidity, prior momentum, pullback context, undercut/reclaim, volume, and risk distance.

## Intended Timing

The primary operational use is a near-close scan, roughly two minutes before the regular session close. The latest bar can be:

- A provisional daily OHLCV bar from a live/near-live data provider
- A FMP quote-derived best-effort bar via `--use-quote-latest`
- A post-close daily bar for after-close review and model-book building

## Manual Review Requirements

Before treating any candidate as actionable, review:

- Weekly chart context and Stage 2 / broader trend quality
- Whether the pullback is orderly or caused by a thesis-breaking event
- Earnings date, guidance/news risk, and gap-risk exposure
- Risk from entry reference to stop reference
- Portfolio heat and current market-regime gate

## Non-goals

This skill does not:

- Place orders
- Recommend automatic execution
- Verify real-time quote freshness
- Discover catalysts/news by itself
- Replace chart review or risk sizing
