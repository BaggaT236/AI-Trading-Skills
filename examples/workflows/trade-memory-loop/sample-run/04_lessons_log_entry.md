<!-- Illustrative sample — fictional ticker EXMPL. Not investment advice. -->
<!-- Step 4 (trader-memory-core): lessons appended to the trader journal.   -->
<!-- Rendering mirrors trader-memory-core assets/postmortem_template.md.    -->
# Postmortem: th_EXMPL_growth_20260108_a1b2

**Ticker:** EXMPL
**Type:** growth_momentum
**Status:** CLOSED

## Thesis

EXMPL completed a tight 7-week VCP base after a Q4 earnings beat; a breakout
through the 142.50 pivot on expanding volume should resolve into a momentum
advance toward the 165-170 measured-move zone.

## Timeline

| Event | Date | Price |
|-------|------|-------|
| Created | 2026-01-05T13:00:00+00:00 | — |
| Entry | 2026-01-08T14:35:00+00:00 | 142.10 |
| Exit | 2026-02-27T15:50:00+00:00 | 168.40 |

## Outcome

| Metric | Value |
|--------|-------|
| P&L ($) | 1841.00 |
| P&L (%) | 18.5 |
| Holding Days | 50 |
| Exit Reason | target_hit |
| MAE (%) | -4.2 |
| MFE (%) | 21.0 |

## Position

| Metric | Value |
|--------|-------|
| Shares | 70 |
| Position Value | 9947.00 |
| Risk ($) | 532.00 |

## Evidence at Entry

- VCP base with three contractions, final contraction < 8%
- Q4 revenue +24% YoY, raised FY guidance
- Relative strength line at new high ahead of price
- Accumulation: 4 up-weeks on volume vs 1 down-week

## Kill Criteria

- Close back below the 134.50 stop (base failure)
- Two distribution weeks in the first 10 sessions post-breakout
- Guidance walk-back or negative pre-announcement

## Lessons Learned

Thesis-driven winner (postmortem classified `TRUE_POSITIVE`). The initial 2R
target (157.30) was reached on 2026-02-10; trailing the stop under the rising
10-EMA captured an extra ~7% before the trail triggered at 168.40. MAE stayed
shallow (-4.2%), confirming the breakout was well-timed. **Repeatable:** keep
the "trail under 10-EMA after 2R" rule for clean VCP breakouts in RISK_ON
regimes. The optional `backtest-expert` re-validation step was **skipped** in
this required-only sample — a backtest of the trail rule would be the natural
next refinement.
