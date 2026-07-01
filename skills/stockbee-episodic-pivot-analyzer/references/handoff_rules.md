# Handoff Rules

## To Technical Analyst

Send `ACTIONABLE_DAY1` and high-quality `DAY1_WATCH` names to `technical-analyst` for chart validation. The chart review should reject candidates with:

- Long upper wick / intraday fade
- Obvious overhead supply
- Chaotic low-liquidity price action
- Already extended multi-day move before the catalyst
- Stop distance too wide for the account's risk model

## To Position Sizer

For Stockbee EPs, the default stop reference is the EP-day low. Use:

```text
risk_per_share = entry_reference - ep_day_low
shares = account_risk_dollars / risk_per_share
```

If the EP-day low is too far away, do not force the trade. Keep it in `DELAYED_EP_WATCH` and wait for a controlled pullback or secondary range.

## To PEAD Screener

Send earnings/guidance candidates with `pead_handoff=true` to `pead-screener` when:

- The Day 1 move is strong but too extended to chase
- The candidate needs a weekly red-candle / delayed reaction setup
- The trader wants a 1-5 week post-earnings monitoring process

## To Stockbee Momentum Burst Screener

Use `stockbee-momentum-burst-screener` to confirm whether the EP also has:

- 4% breakout
- Dollar breakout
- Range expansion
- Volume expansion
- Close near high

The best candidates often show both catalyst quality and momentum-burst confirmation.

## To Trader Memory Core

Record only candidates that pass manual review or are intentionally kept on a delayed EP watchlist. Do not pollute the thesis store with every low-grade headline. For broad learning on rejected candidates, use a separate model-book or research log.
