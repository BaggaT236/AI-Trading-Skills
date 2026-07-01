# Prompt — `trade-memory-loop` (required-only)

Paste the following to Claude (with the `trader-memory-core` and
`signal-postmortem` skills available). Replace `<repo>` with your checkout
path and `$PROJECT_DIR` with your thesis state directory.

---

> I just closed a position. Run the **trade-memory-loop** workflow (required
> steps only — skip the optional backtest-expert step).
>
> 1. Use **trader-memory-core** to record the closed trade outcome: update the
>    thesis to `CLOSED` with the exit price/date, realized P&L, MAE/MFE, and
>    final status history. State dir: `$PROJECT_DIR/state/theses/`.
> 2. Use **signal-postmortem** to consume the closed thesis and classify the
>    outcome (TRUE_POSITIVE / FALSE_POSITIVE / REGIME_MISMATCH / NEUTRAL),
>    with the root-cause read: was it thesis quality, execution, market
>    environment, or randomness?
> 3. Use **trader-memory-core** again to append the lessons to my journal.
>
> Be honest about whether the win was thesis-driven or luck. Don't rationalize
> randomness as skill.

Trade details for this sample run: ticker **EXMPL**, LONG, entered
2026-01-08 @ 142.10 (70 sh, 1% risk, stop 134.50), exited 2026-02-27 @
168.40 (`target_hit`), origin `vcp-screener` grade A.

---

## What to expect

This is the **required-only** path: the optional **backtest-expert**
re-validation (step 3) is **not** run. The postmortem still fully classifies
the outcome and the lessons are still journaled — a backtest would only add an
extra statistical cross-check, noted as a follow-up in the journal entry.

> ⚠️ Illustrative sample — fictional ticker `EXMPL`, **not investment
> advice**.
