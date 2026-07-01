---
layout: default
title: US Market Bubble Detector
grand_parent: English
parent: Skill Guides
nav_order: 10
lang_peer: /ja/skills/us-market-bubble-detector/
permalink: /en/skills/us-market-bubble-detector/
---

# US Market Bubble Detector
{: .no_toc }

Evaluate market bubble risk through a data-driven Minsky/Kindleberger v2.1 framework with two-phase scoring: 6 quantitative indicators (0-12 points) plus 3 strict qualitative adjustments (0-3 points) for a total 0-15 scale.
{: .fs-6 .fw-300 }

[Download Skill Package (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/us-market-bubble-detector.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[View Source on GitHub](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/us-market-bubble-detector){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>Table of Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. Overview

US Market Bubble Detector applies a structured, quantitative framework to answer the question "Is the market in a bubble?" Instead of relying on gut feeling or media narratives, it mechanically scores six measurable indicators and applies three strictly controlled qualitative adjustments with built-in confirmation bias prevention.

<span class="badge badge-free">No API</span>

**What it solves:**
- Replaces subjective "it feels bubbly" assessments with measurable, reproducible scores
- Prevents confirmation bias through explicit checklists and evidence requirements
- Provides actionable risk budget recommendations at each bubble phase
- Includes short-selling timing criteria with composite condition requirements
- Maps scores to the Minsky/Kindleberger 5-stage bubble progression model

**v2.1 framework (key improvements over v2.0):**

| Feature | v2.0 | v2.1 |
|---------|------|------|
| Qualitative adjustment cap | +5 max | +3 max |
| Score range | 0-16 | 0-15 |
| Risk phases | 4 (Normal, Caution, Euphoria, Critical) | 5 (added **Elevated Risk** at 8-9 points) |
| Evidence requirement | Loose | Strict -- measurable data required for every qualitative point |
| Bias prevention | None | Explicit confirmation bias checklist |

**Five risk phases:**

| Phase | Score | Risk Budget |
|-------|-------|-------------|
| Normal | 0-4 | 100% |
| Caution | 5-7 | 70-80% |
| Elevated Risk | 8-9 | 50-70% |
| Euphoria | 10-12 | 40-50% |
| Critical | 13-15 | 20-30% |

---

## 2. Prerequisites

- **API Key:** None required for the conversational workflow
- **Data sources:** Claude uses WebSearch to collect Put/Call ratio, VIX, margin debt, breadth, and IPO data from CBOE, Yahoo Finance, FINRA, and Renaissance Capital
- **Python 3.9+:** Optional -- a `bubble_scorer.py` script is available for programmatic scoring via JSON input
- **No additional Python dependencies** -- the script uses only the standard library

> The primary workflow is conversational: describe your market observations and Claude collects the quantitative data, scores each indicator, and generates a structured evaluation report. The Python script provides an alternative for batch scoring or integration with other tools.
{: .tip }

---

## 3. Quick Start

Tell Claude:

```
Run a bubble check on the US market -- collect Put/Call, VIX, margin debt, breadth, and IPO data
```

Claude searches for current values of all six quantitative indicators, scores them mechanically against defined thresholds, applies any applicable qualitative adjustments (only with measurable evidence), and generates an evaluation report with risk budget recommendation. That is all you need to get started.

For a programmatic approach:

```bash
python3 skills/us-market-bubble-detector/scripts/bubble_scorer.py \
  --scores '{"mass_penetration":0,"media_saturation":1,"new_accounts":0,"new_issuance":1,"leverage":1,"price_acceleration":1,"valuation_disconnect":0,"breadth_expansion":1}' \
  --output text
```

---

## 4. How It Works

The evaluation follows a strict 4-phase process:

1. **Phase 1: Mandatory data collection** -- Before any scoring begins, Claude collects current values for all quantitative indicators: Put/Call ratio (5-day MA from CBOE), VIX level and percentile, FINRA margin debt (latest month and YoY change), market breadth (% of S&P 500 above 50-day MA), IPO count and first-day returns, and 3-month price return percentile.
2. **Phase 2: Quantitative scoring** -- Each of the 6 indicators is scored mechanically (0, 1, or 2 points) against specific numerical thresholds. No judgment involved -- if Put/Call < 0.70, it scores 2 points regardless of narrative. Phase 2 maximum: 12 points.
3. **Phase 3: Qualitative adjustment** -- Three adjustments of 0-1 point each, with strict evidence requirements. Social penetration requires 3+ direct user reports with dates and names. Media/search trends requires measured Google Trends showing 5x+ YoY increase. Valuation disconnect requires P/E >25 AND documented media quotes explicitly ignoring fundamentals. A confirmation bias prevention checklist must be completed before adding any qualitative points. Phase 3 maximum: +3 points.
4. **Phase 4: Final judgment** -- Total score (0-15) maps to one of five risk phases with corresponding risk budget, ATR stop-loss coefficient, and short-selling guidance. The Minsky/Kindleberger stage is estimated from the pattern of individual indicator scores.

---

## 5. Usage Examples

### Example 1: Daily Bubble Check

**Prompt:**
```
Quick bubble check -- what are Put/Call, VIX, and margin debt saying right now?
```

**What you get:** Current values for the three most responsive indicators (Put/Call ratio, VIX level, margin debt YoY change), their individual scores, and whether the combined signal suggests Normal, Caution, or elevated risk levels.

**Why useful:** A 5-minute morning check that flags whether to adjust position sizing or tighten stops before market open.

---

### Example 2: Fed Pivot Assessment

**Prompt:**
```
The Fed just pivoted to cutting -- run a full bubble assessment with emphasis on leverage and price acceleration indicators
```

**What you get:** Complete 6-indicator quantitative scoring, with detailed analysis of margin debt trends and 3-month price return percentile in the context of a new easing cycle. Historical comparison to past Fed pivot periods (2019, 2001) and whether current conditions match the Displacement stage of the Minsky model.

**Why useful:** Fed pivots are classic bubble Displacement triggers. This assessment provides an early warning framework for monitoring whether the rate-cut rally transitions from rational repricing to speculative excess.

---

### Example 3: Retail Penetration Analysis

**Prompt:**
```
My barber asked about NVDA, my dentist mentioned AI stocks, and my Uber driver discussed crypto.
Should I be worried about a bubble?
```

**What you get:** Qualitative Adjustment A (Social Penetration) analysis applying the strict v2.1 criteria: three independent non-investor sources with specific contexts. If all three criteria are met, +1 qualitative point is added. Full quantitative indicators are also collected to provide the complete score. The report includes the confirmation bias checklist showing whether the qualitative adjustment is justified.

**Why useful:** The "taxi driver" signal is the most famous bubble indicator, but v2.1 prevents over-scoring from vague impressions. This example meets the strict criteria (3 independent sources with specific details), making it a valid +1 point.

---

### Example 4: Google Trends Confirmation

**Prompt:**
```
Check Google Trends for "AI stocks" -- is search volume elevated enough to add a media saturation point?
```

**What you get:** Measured Google Trends data for the specified search term with YoY multiplier calculation. The v2.1 framework requires 5x+ YoY increase AND confirmed mainstream media coverage (Time covers, TV specials with specific dates) to award +1 point. If the data shows 3x increase, the score remains 0 regardless of narrative.

**Why useful:** Prevents the common error of adding qualitative points based on "it seems like everyone is talking about AI." The 5x threshold is deliberately high to filter normal media cycles from genuine mania-level saturation.

---

### Example 5: Valuation Disconnect Check

**Prompt:**
```
S&P 500 P/E is at 28 -- does that trigger the valuation disconnect adjustment?
```

**What you get:** Analysis of whether the valuation disconnect qualitative point (+1) is warranted. The v2.1 framework checks three criteria: P/E >25 (met), fundamentals actively ignored in mainstream discourse (requires specific media quotes like "earnings don't matter"), and "this time is different" documented in major media. Critically, the self-check prevents double-counting if P/E is already captured in the quantitative price acceleration indicator.

**Why useful:** Valuation alone does not equal a bubble. The v2.1 framework distinguishes "expensive but fundamentally supported" (0 points) from "expensive and fundamentals explicitly dismissed" (+1 point). This prevents the over-scoring that plagued v2.0.

---

### Example 6: IPO Flood Detection

**Prompt:**
```
There have been a lot of IPOs lately. Check IPO market data and score the new issuance indicator.
```

**What you get:** Current quarter IPO count compared to the 5-year quarterly average, median first-day return data from Renaissance Capital, and mechanical scoring: 2 points if count >2x average AND median first-day return >+20%, 1 point if count >1.5x average, 0 points at normal levels.

**Why useful:** IPO floods -- especially when low-quality companies go public and still pop on day one -- are one of the most reliable late-stage bubble indicators. The quantitative threshold prevents scoring based on anecdotal "there seem to be a lot of IPOs."

---

### Example 7: Short-Selling Readiness

**Prompt:**
```
Bubble score is at 11 -- check the 7 composite conditions for short-selling readiness
```

**What you get:** Evaluation of all 7 composite conditions for short-selling: (1) weekly chart lower highs, (2) volume peaked out, (3) margin debt declining sharply, (4) media/search trends peaked, (5) weak stocks breaking down first, (6) VIX surge above 20, (7) Fed/policy shift signals. At Euphoria phase (10-12), minimum 3/7 conditions must be confirmed before considering shorts. Report includes position sizing guidance (20-25% of normal) and stop-loss requirements (defined risk only).

**Why useful:** Prevents the most common short-selling mistake: shorting too early based on valuation alone. The composite conditions framework ensures you wait for technical confirmation of a top before taking the highest-risk trade in finance.

---

## 6. Understanding the Output

The evaluation report follows a structured template:

1. **Overall Assessment** -- Final score (X/15), risk phase (Normal through Critical), risk level, and evaluation date.
2. **Quantitative Evaluation (Phase 2)** -- Table with all 6 indicators: measured value, score (0-2), and rationale for each. Phase 2 total out of 12.
3. **Qualitative Adjustment (Phase 3)** -- Confirmation bias checklist (all items must be checked), then three adjustments (Social Penetration, Media/Search Trends, Valuation Disconnect) with required evidence and justification. Phase 3 total out of 3.
4. **Recommended Actions** -- Risk budget percentage, ATR stop-loss coefficient, position sizing guidance, and short-selling status with composite conditions count.
5. **Minsky Phase Estimate** -- Assessment of where the market sits in the Displacement-Boom-Euphoria-Profit Taking-Panic progression.

---

## 7. Tips & Best Practices

- **Run the full assessment weekly, quick checks daily.** The 3-indicator quick check (Put/Call, VIX, margin debt) takes 5 minutes and flags emerging risks. The full 6-indicator + qualitative assessment provides the comprehensive view.
- **Never skip Phase 1 data collection.** The most common error is scoring based on impressions before collecting actual data. If you cannot find current margin debt data, document it as "data unavailable" rather than guessing.
- **Use the confirmation bias checklist honestly.** Before adding any qualitative point, ask: "Would an independent observer with no market position reach the same conclusion?" If the answer is uncertain, score 0.
- **Track scores over time.** A rising trend from 4 to 6 to 8 over several weeks is more significant than a single reading of 8. The trajectory reveals the phase transition in progress.
- **Distinguish "expensive" from "bubble."** A high P/E ratio by itself is not a bubble signal. The v2.1 framework explicitly prevents this error through the double-counting check and fundamental backing test.
- **Respect the composite conditions for shorts.** Even at Euphoria phase (10-12), shorts require 3/7 conditions confirmed. Markets can remain irrational longer than you can remain solvent.

---

## 8. Combining with Other Skills

| Workflow | How to Combine |
|----------|---------------|
| **Weekly risk assessment** | Bubble Detector for structural risk score, then Market News Analyst for recent catalysts that could shift the score, then Breadth Chart Analyst for visual confirmation of narrowing or broadening participation |
| **Profit-taking triggers** | Bubble score reaches Caution (5-7), then Portfolio Manager to review holdings, then Position Sizer to calculate reduced position sizes based on the new risk budget |
| **Short-selling pipeline** | Bubble score reaches Euphoria (10-12), then check composite conditions, then Technical Analyst for chart confirmation of distribution patterns, then FinViz Screener to identify weakest stocks in the leading sector |
| **Regime monitoring** | Bubble Detector for structural score, then Sector Analyst for rotation patterns, then Market News Analyst for whether recent news is accelerating or moderating the bubble dynamics |
| **Earnings season context** | Run bubble assessment before major earnings to calibrate expectations -- are markets priced for perfection (high bubble score) or pessimism (low score)? |

---

## 9. Troubleshooting

### Margin debt data is delayed

**Cause:** FINRA margin debt statistics are released monthly with a 1-2 month lag.

**Fix:** Use the most recent available data and note the date. Supplement with brokerage-reported margin data if available (e.g., Interactive Brokers publishes more current data). If no data is available within 3 months, mark the indicator as "data unavailable" and note the reduced maximum score.

### Qualitative scores keep coming out 0

**Cause:** The v2.1 framework is deliberately strict. Most market conditions do not warrant qualitative additions.

**Fix:** This is working as intended. Qualitative points are reserved for extreme conditions (barber recommending stocks, Google Trends 5x+ spike). In normal or early-stage bubble conditions, 0 qualitative points is the correct assessment. If the score feels too low, re-examine the quantitative indicators rather than loosening qualitative standards.

### Score seems inconsistent with "feel"

**Cause:** Confirmation bias -- the most common error in bubble assessment. Media coverage of "overheated markets" creates an impression that the data may not support.

**Fix:** Trust the data. Complete the confirmation bias checklist. The v2.1 framework was specifically revised to prevent this exact problem. If the data says Normal (0-4) but your gut says Euphoria, document the discrepancy but follow the data-driven score for risk management decisions.

### bubble_scorer.py shows different phases than SKILL.md

**Cause:** The Python script uses the older 8-indicator scoring (0-16 scale) while SKILL.md v2.1 uses the revised 6-indicator quantitative + 3 qualitative framework (0-15 scale).

**Fix:** Use the SKILL.md v2.1 framework as the authoritative reference. The script provides a useful quick-scoring tool but should be interpreted within the updated phase thresholds documented in the SKILL.md.

---

## 10. Reference

### Quantitative Indicators (Phase 2)

| Indicator | 0 Points | 1 Point | 2 Points | Data Source |
|-----------|----------|---------|----------|-------------|
| **Put/Call Ratio** | P/C > 0.85 | P/C 0.70-0.85 | P/C < 0.70 | CBOE |
| **Volatility + Highs** | VIX > 15 or >10% from highs | VIX 12-15 near highs | VIX < 12 AND within 5% of 52W high | Yahoo Finance (^VIX) |
| **Leverage (Margin Debt)** | YoY +10% or negative | YoY +10-20% | YoY +20%+ AND all-time high | FINRA |
| **IPO Overheating** | Normal levels | Count >1.5x 5Y avg | Count >2x 5Y avg AND median 1st-day return +20%+ | Renaissance Capital |
| **Breadth Anomaly** | >60% above 50DMA | 45-60% above 50DMA | New high AND <45% above 50DMA | Barchart |
| **Price Acceleration** | Below 85th percentile | 85-95th percentile | Above 95th percentile (10Y) | Historical returns data |

### Qualitative Adjustments (Phase 3)

| Adjustment | Criteria for +1 Point | Invalid Examples |
|-----------|----------------------|------------------|
| **Social Penetration** | ALL: direct user report + specific names/dates + 3+ independent sources | "AI narrative is prevalent," "Everyone is talking about stocks" |
| **Media/Search Trends** | BOTH: Google Trends 5x+ YoY (measured) + mainstream coverage with dates | "Elevated narrative" without data |
| **Valuation Disconnect** | ALL: P/E >25 + fundamentals explicitly ignored + "this time is different" in media | P/E >25 but companies have real earnings |

### CLI Arguments (bubble_scorer.py)

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| `--manual` | No | -- | Interactive manual assessment mode (prompts for each indicator) |
| `--scores` | No | -- | JSON string of indicator scores (e.g., `'{"mass_penetration":1,...}'`) |
| `--output` | No | `text` | Output format: `text` or `json` |

### Risk Phase Actions

| Phase | Risk Budget | New Entries | Stop Coefficient | Short-Selling |
|-------|-------------|-------------|-----------------|---------------|
| Normal (0-4) | 100% | Normal | 2.0 ATR | Not allowed |
| Caution (5-7) | 70-80% | 50% reduced | 1.8 ATR | Not recommended |
| Elevated Risk (8-9) | 50-70% | Selective only | 1.6 ATR | Consider with 2/7 conditions |
| Euphoria (10-12) | 40-50% | No new longs | 1.5 ATR | Active with 3/7 conditions |
| Critical (13-15) | 20-30% | Cash preservation | 1.2 ATR | Recommended with 5/7 conditions |
