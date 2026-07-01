---
layout: default
title: Market News Analyst
grand_parent: English
parent: Skill Guides
nav_order: 9
lang_peer: /ja/skills/market-news-analyst/
permalink: /en/skills/market-news-analyst/
---

# Market News Analyst
{: .no_toc }

Analyze recent market-moving news events from the past 10 days, rank them by quantitative impact score, and assess multi-asset reactions across equities, bonds, commodities, and currencies.
{: .fs-6 .fw-300 }

[Download Skill Package (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/market-news-analyst.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[View Source on GitHub](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/market-news-analyst){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>Table of Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. Overview

Market News Analyst automatically collects and analyzes major market-moving news from the past 10 days using WebSearch and WebFetch. Each event is scored with a quantitative Impact Score formula, ranked from highest to lowest impact, and analyzed across multiple asset classes.

<span class="badge badge-free">No API</span>

**What it solves:**
- Systematically identifies the most important market events from the past 10 days
- Replaces subjective "feel" with a quantitative impact scoring formula
- Analyzes reactions across equities, bonds, commodities, and currencies in a single report
- Compares actual market reactions against historical patterns to identify anomalies
- Distinguishes correlation from causation when attributing market moves to news events

**Impact Score formula:**

```
Impact Score = (Price Impact Score x Breadth Multiplier) x Forward-Looking Modifier
```

| Component | Values | Description |
|-----------|--------|-------------|
| **Price Impact** | 1-10 points | Severity of asset price movement (Negligible=1, Minor=2, Moderate=4, Major=7, Severe=10) |
| **Breadth Multiplier** | 1x-3x | How many markets affected (Stock-Specific=1x, Sector-Wide=1.5x, Cross-Asset=2x, Systemic=3x) |
| **Forward Modifier** | 0.75x-1.5x | Future significance (Contrary=-25%, Isolated=0%, Trend Confirm=+25%, Regime Change=+50%) |

**Example calculation:**

A surprise FOMC 75bps rate hike with hawkish tone:
- Price Impact: S&P 500 -2.5% = Severe (10 points)
- Breadth: Equities, bonds, USD, commodities all moved = Systemic (3x)
- Forward: Ongoing tightening cycle = Trend Confirmation (1.25x)
- **Impact Score: (10 x 3) x 1.25 = 37.5**

---

## 2. Prerequisites

- **API Key:** None required
- **Data source:** Claude uses WebSearch and WebFetch to collect news from trusted financial sources (Bloomberg, Reuters, WSJ, FT, CNBC, official government sources)
- **No Python dependencies** -- this is a purely conversational skill with no CLI script

> Market News Analyst works entirely through natural language prompts. Claude automatically searches trusted news sources across monetary policy, earnings, geopolitics, and commodities.
{: .tip }

---

## 3. Quick Start

Tell Claude:

```
Analyze the major market news from the past 10 days
```

Claude executes parallel web searches across six news categories (monetary policy, economic data, mega-cap earnings, geopolitical events, commodity markets, corporate news), scores each event, and generates a ranked report. That is all you need to get started.

For a focused analysis:

```
How did the latest FOMC decision impact the market? Full multi-asset analysis.
```

---

## 4. How It Works

The skill follows a structured 6-step workflow:

1. **News collection** -- Parallel WebSearch queries cover monetary policy (FOMC, ECB, BOJ), economic data (CPI, NFP, GDP), mega-cap earnings (Magnificent 7), geopolitical events, commodity markets, and corporate news. Sources are prioritized by credibility tier.
2. **Knowledge base loading** -- Reference files load based on collected news types: `market_event_patterns.md` for historical reaction patterns, `geopolitical_commodity_correlations.md` for conflict-to-commodity analysis, `corporate_news_impact.md` for mega-cap earnings frameworks, and `trusted_news_sources.md` for source credibility assessment.
3. **Impact magnitude assessment** -- Each event is scored across three dimensions (Price Impact, Breadth, Forward Significance) using specific numerical criteria. Events are ranked from highest to lowest Impact Score.
4. **Market reaction analysis** -- For each significant event (Impact Score >5), actual market reactions are analyzed across equities, bonds, commodities, currencies, and derivatives. Reactions are compared against historical patterns to classify as Consistent, Amplified, Dampened, or Inverse.
5. **Correlation and causation assessment** -- When multiple events occurred in the period, interactions are analyzed: reinforcing events, offsetting events, sequential dependencies, and coincidental timing.
6. **Report generation** -- A structured Markdown report is generated with executive summary, impact rankings table, detailed event analysis, thematic synthesis, commodity deep dive, and forward-looking implications.

---

## 5. Usage Examples

### Example 1: Full 10-Day Analysis (Default)

**Prompt:**
```
Analyze the major market news from the past 10 days
```

**What you get:** A comprehensive report covering all significant events, ranked by Impact Score, with multi-asset reaction analysis, thematic synthesis identifying the dominant market narrative, and forward-looking risk scenarios.

**Why useful:** The standard weekly research workflow that keeps you current on everything that moved markets, not just the headlines you happened to see.

---

### Example 2: FOMC Decision Analysis

**Prompt:**
```
Analyze the latest Fed decision -- rate action, dot plot, market reaction across all asset classes
```

**What you get:** Detailed FOMC analysis including the rate decision, vote count, dot plot changes, Powell press conference highlights, and full multi-asset reaction: equities (index-level and sector rotation), Treasury yields (2Y/10Y/30Y curve shape), USD (DXY and major pairs), commodities (gold, oil), and VIX. Comparison against historical reaction patterns for similar Fed actions.

**Why useful:** FOMC decisions typically produce the highest Impact Scores (systemic breadth, potential regime change). This focused analysis captures all transmission channels from a single policy event.

---

### Example 3: Earnings Season Coverage

**Prompt:**
```
Review mega-cap earnings from the past 10 days and their market impact
```

**What you get:** Analysis of recent Magnificent 7 and other mega-cap earnings: beat/miss magnitude versus consensus, guidance changes, revenue growth trends, market reaction (gap, follow-through), sector contagion (did the earnings report lift or drag the entire sector?), and index-level impact weighted by market cap.

**Why useful:** Mega-cap earnings often drive sector-wide moves and can shift market sentiment. Understanding the contagion pattern (Apple misses and tech sells off, or Apple misses but tech recovers) reveals market positioning.

---

### Example 4: Geopolitical Event Impact

**Prompt:**
```
Analyze recent geopolitical events and their impact on commodities and equity markets
```

**What you get:** Assessment of conflicts, sanctions, or trade tensions with specific commodity price impacts (oil, gold, base metals, agricultural), equity sector impacts (energy, defense, airlines), currency safe-haven flows (JPY, CHF, gold), and comparison against the geopolitical-commodity correlation framework from the knowledge base. Includes expected duration assessment (temporary spike vs sustained elevation).

**Why useful:** Geopolitical events often produce cross-asset moves that the standard equity-focused analysis misses. The commodity correlation framework helps distinguish fear-driven spikes from fundamental supply disruptions.

---

### Example 5: Economic Indicator Analysis

**Prompt:**
```
CPI came in hot -- analyze the inflation data and market reaction
```

**What you get:** Breakdown of headline vs core CPI, comparison to consensus and prior month, component analysis (shelter, energy, food, services), implications for Fed policy path, and market reaction across all asset classes. The surprise factor is quantified (e.g., "+0.3% above consensus is a Major surprise") and compared to historical inflation print reactions.

**Why useful:** Inflation data directly impacts rate expectations, which ripple through every asset class. Understanding the magnitude of the surprise relative to history prevents overreacting to normal variance or underreacting to genuine shifts.

---

### Example 6: Commodity Correlation Analysis

**Prompt:**
```
Oil prices spiked 8% this week -- what drove it and what are the knock-on effects?
```

**What you get:** Supply-side analysis (OPEC decisions, geopolitical supply risk, inventory data), demand-side factors (economic data, seasonal patterns), and knock-on effects: energy sector equities, airlines, consumer discretionary, inflation expectations (TIPS breakevens), central bank policy implications, and currency impacts on oil-importing nations.

**Why useful:** Commodity moves are often the clearest expression of real-world supply/demand dynamics. Tracing the transmission mechanism from commodity prices through to equity sectors and policy expectations reveals trading opportunities beyond the commodity itself.

---

### Example 7: Market Regime Detection

**Prompt:**
```
Is the market in risk-on or risk-off mode? What's the evidence from the past 10 days?
```

**What you get:** Risk appetite assessment based on multiple indicators: sector rotation (cyclicals vs defensives, growth vs value), credit spreads (IG and HY), safe haven flows (Treasuries, gold, JPY), VIX level and trend, equity breadth (large vs small cap divergence), and fund flow data. Dominant market narrative identified, with anomalies flagged (e.g., "gold rallying alongside equities suggests inflation hedging, not risk-off").

**Why useful:** Understanding the current market regime determines whether to lean into momentum or adopt defensive positioning. The multi-indicator approach prevents false signals from any single metric.

---

## 6. Understanding the Output

The report follows a structured template:

1. **Executive Summary** -- 3-4 sentences covering the analysis period, number of significant events, dominant theme, and top 1-2 highest-impact events.
2. **Market Impact Rankings** -- Table sorted by Impact Score with event name, date, score, affected asset classes, and brief reaction summary.
3. **Detailed Event Analysis** -- For each ranked event: event summary, multi-asset market reaction (equities, bonds, commodities, currencies, volatility), pattern comparison (expected vs actual), impact score calculation breakdown, and sector-specific impacts.
4. **Thematic Synthesis** -- Dominant market narrative, interconnected events, market regime assessment (risk-on/risk-off with evidence), and anomalies/surprises.
5. **Commodity Market Deep Dive** -- Dedicated section for energy, precious metals, base metals, and agricultural commodities with geopolitical correlation analysis.
6. **Forward-Looking Implications** -- Market positioning insights, upcoming catalysts, and 3-5 risk scenarios with probability and potential impact.
7. **Data Sources and Methodology** -- Sources consulted by tier, analysis period, and knowledge base references used.

Reports are saved to the `reports/` directory with the naming convention `market_news_analysis_[START]_to_[END].md`.

---

## 7. Tips & Best Practices

- **Run weekly for consistent market awareness.** The 10-day default window makes this ideal as a weekly ritual. Running it every Monday morning gives you a structured view of what happened while markets were moving.
- **Use focused prompts for deeper analysis.** The full 10-day scan is broad. When a specific event dominates (FOMC, major earnings), a focused prompt produces more detailed analysis of that single event's transmission mechanisms.
- **Pay attention to pattern deviations.** The most actionable insights come from events where actual market reactions differed from historical patterns (Dampened or Inverse reactions). These anomalies often signal positioning changes or regime shifts.
- **Cross-reference with other skills.** After the news analysis identifies sector-level impacts, use Sector Analyst for detailed chart reading or FinViz Screener to find individual stocks within affected sectors.
- **Watch the Forward-Looking section.** The risk scenarios section identifies upcoming catalysts that the recent news has set up. These are the events most likely to produce the next significant market moves.
- **Verify source quality.** The report includes source tiers. Events sourced from Tier 1 (official government/central bank) are most reliable. Events sourced only from Tier 3-4 should be treated with more caution.

---

## 8. Combining with Other Skills

| Workflow | How to Combine |
|----------|---------------|
| **Daily market monitoring** | Market News Analyst for macro context, then Economic Calendar Fetcher for upcoming events, then Breadth Chart Analyst for market health visualization |
| **Sector rotation trading** | News analysis identifies which sectors are under pressure or gaining momentum, then Sector Analyst provides detailed chart-based confirmation |
| **Earnings-driven research** | News analysis covers mega-cap earnings reactions, then US Stock Analysis for deep dives on individual stocks that reported, then Earnings Trade Analyzer for scoring entry setups |
| **Risk management** | News analysis identifies regime shifts (risk-on/risk-off), then US Market Bubble Detector for structural risk assessment, then Portfolio Manager for position adjustment |
| **Commodity-linked equities** | Geopolitical-commodity analysis from news skill, then FinViz Screener to find energy/mining stocks positioned to benefit from commodity moves |

---

## 9. Troubleshooting

### News collection seems incomplete

**Cause:** WebSearch may not surface all relevant events, especially those behind paywalls (Bloomberg Terminal, WSJ subscriber content).

**Fix:** If you know a specific event occurred, prompt Claude directly: "Include the ECB rate decision from March 6 in the analysis." You can also provide specific URLs via WebFetch for paywalled content you have access to.

### Impact scores seem too high or too low

**Cause:** The scoring framework requires judgment calls on breadth multipliers and forward significance that depend on available data quality.

**Fix:** The detailed score breakdown shows exactly how each component was calculated. Challenge specific components: "I think the breadth multiplier should be 1.5x (sector-wide) not 2x (cross-asset) because bonds didn't move." Claude will recalculate.

### Geopolitical-commodity analysis missing

**Cause:** The geopolitical correlation reference only loads when geopolitical events are detected in the news collection phase.

**Fix:** Explicitly request it: "Include geopolitical-commodity correlation analysis in the report." This forces the reference file to load even if the automated detection missed a relevant event.

### Report is too long

**Cause:** A 10-day period with many significant events (earnings season, FOMC week) can produce lengthy reports.

**Fix:** Request a focused scope: "Analyze only the top 3 market-moving events from the past week" or "Focus only on monetary policy and its market impact."

---

## 10. Reference

### Impact Score Thresholds

| Price Impact Level | Equity (Index) | Equity (Sector) | Commodities (Oil) | Gold | Bonds (10Y) | Points |
|-------------------|----------------|-----------------|-------------------|------|-------------|--------|
| **Severe** | +/-2%+ | +/-5%+ | +/-5%+ | +/-3%+ | +/-20bps+ | 10 |
| **Major** | +/-1-2% | +/-3-5% | +/-3-5% | +/-1.5-3% | +/-10-20bps | 7 |
| **Moderate** | +/-0.5-1% | +/-1-3% | +/-1-3% | +/-0.5-1.5% | +/-5-10bps | 4 |
| **Minor** | +/-0.2-0.5% | <1% | -- | -- | -- | 2 |
| **Negligible** | <0.2% | -- | -- | -- | -- | 1 |

### Breadth Multipliers

| Scope | Multiplier | Example |
|-------|-----------|---------|
| Systemic | 3x | FOMC surprise, banking crisis, major war |
| Cross-Asset | 2x | Inflation surprise affecting equities + bonds |
| Sector-Wide | 1.5x | Tech earnings cluster, energy policy change |
| Stock-Specific | 1x | Single company earnings (unless mega-cap) |

### Reference Knowledge Base

| File | When Loaded | Content |
|------|------------|---------|
| `references/market_event_patterns.md` | Always | Historical reaction patterns for central banks, inflation, earnings, geopolitics; case studies (2008, COVID, 2022) |
| `references/trusted_news_sources.md` | Always | 4-tier source credibility guide, search strategies, source selection by news type |
| `references/geopolitical_commodity_correlations.md` | When geopolitical events detected | Energy, precious metals, base metals, agriculture correlations; regional frameworks |
| `references/corporate_news_impact.md` | When mega-cap earnings detected | Magnificent 7 analysis frameworks, sector contagion patterns, M&A impact |

### News Category Search Targets

| Category | Search Topics | Priority Sources |
|----------|--------------|-----------------|
| Monetary Policy | FOMC, ECB, BOJ, rate decisions | FederalReserve.gov, WSJ, Reuters |
| Economic Data | CPI, NFP, GDP, PPI | BLS.gov, BEA.gov, Bloomberg |
| Mega-Cap Earnings | Magnificent 7, banks, healthcare | Company IR pages, SEC EDGAR |
| Geopolitical | Conflicts, sanctions, trade disputes | Reuters, FT, Bloomberg |
| Commodities | Oil, gold, OPEC, supply disruptions | S&P Global Platts, Reuters |
| Corporate | M&A, bankruptcies, credit downgrades | Bloomberg, WSJ, SEC |
