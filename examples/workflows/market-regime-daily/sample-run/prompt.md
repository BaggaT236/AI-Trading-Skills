# Prompt — `market-regime-daily` (required-only)

Paste the following to Claude (Claude Code or the web app, with the
`market-breadth-analyzer`, `uptrend-analyzer`, and `exposure-coach` skills
available). Replace `<repo>` with your checkout path.

---

> Run the **market-regime-daily** workflow for me (required steps only — skip
> the optional market-top-detector step today).
>
> 1. Use **market-breadth-analyzer** to score current market breadth from the
>    public TraderMonty CSV. Save the JSON + Markdown to
>    `<repo>/reports/`.
> 2. Use **uptrend-analyzer** to score uptrend participation from Monty's
>    public Uptrend Ratio Dashboard CSV. Save to `<repo>/reports/`.
> 3. Hand the breadth and uptrend scores to **exposure-coach** and produce a
>    one-page market posture (exposure ceiling, bias, participation,
>    new-entry-allowed vs cash-priority).
>
> Then tell me: is new swing-trade risk **allowed**, **restricted**, or
> **cash-priority** today, and why. Treat the output as a posture, not a
> buy/sell signal.

---

## What to expect

This is the **required-only** path: `macro-regime-detector` and
`market-top-detector` are **not** run. `exposure-coach` treats `regime` and
`top_risk` as *critical* inputs, so with both absent it applies a fixed
confidence haircut. In this sample that yields **REDUCE_ONLY / LOW
confidence** even though breadth (66) and uptrend (72) are individually
healthy — see [`../README.md`](../README.md) for why this is the correct,
code-faithful behavior and how adding the optional satellites changes it.

> ⚠️ Illustrative sample — fictional market snapshot, **not investment
> advice**.
