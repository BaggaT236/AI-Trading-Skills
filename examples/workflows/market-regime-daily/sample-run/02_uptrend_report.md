# Uptrend Analyzer Report

**Generated:** 2026-01-15 07:06:00
**Data Source:** Monty's Uptrend Ratio Dashboard (GitHub CSV)
**API Key Required:** No

---

## Overall Assessment

| Metric | Value |
|--------|-------|
| **Composite Score** | **72/100** |
| **Zone** | 🟢 Bull |
| **Zone Detail** | Bull-Upper |
| **Exposure Guidance** | Normal Exposure (80-100%) |
| **Warning Penalty** | -3 (raw: 75/100) |
| **Active Warnings** | 1: Momentum Cooling |
| **Strongest Component** | Market Breadth (85/100) |
| **Weakest Component** | Sector Rotation (66/100) |
| **Data Quality** | Good |
| **Confidence** | Medium (n=2390, good regime coverage) |

> **Guidance:** Breadth participation is healthy; momentum is cooling but not negative.
>
> Note: Score is in the Bull zone, but 1 warning(s) are active.
> Exposure guidance has been tightened. See Active Warnings below.

---

## Active Warnings

### Momentum Cooling
> Ratio still rising but slope is flattening.

- Watch momentum component
- Tighten trailing stops

---

## Current Market Snapshot

| Metric | Value |
|--------|-------|
| Uptrend Ratio | 58.0% |
| 10-Day MA | 55.5% |
| Trend | Up |
| Slope | +0.0014 |
| Distance from 37% (Overbought) | +21.0pp |
| Distance from 9.7% (Oversold) | +48.0pp |
| Date | 2026-01-14 |

---

## Component Scores

| # | Component | Weight | Score | Contribution | Signal |
|---|-----------|--------|-------|--------------|--------|
| 1 | **Market Breadth** | 30% | ████ 85 | 25.5 | HEALTHY: 58% of stocks in an uptrend, above the 10-day MA |
| 2 | **Sector Participation** | 25% | ███░ 74 | 18.5 | BROAD: 8 of 11 sectors participating |
| 3 | **Sector Rotation** | 15% | ███░ 66 | 9.9 | CONSTRUCTIVE: cyclicals leading defensives |
| 4 | **Momentum** | 20% | ███░ 68 | 13.6 | COOLING: still positive but slope flattening |
| 5 | **Historical Context** | 10% | ███░ 72 | 7.2 | NORMAL: 68th percentile vs full history |

---

## Component Details

### 1. Market Breadth (Overall)

- **Uptrend Ratio:** 58.0%
- **10-Day MA:** 55.5%
- **Trend:** Up
- **Slope:** +0.0014
- **Trend Adjustment:** +2

### 2. Sector Participation

- **Uptrending Sectors:** 8/11
- **Count Score:** 73/100
- **Spread:** 24.0% (score: 75/100)
- **Overbought (>37%):** 1 sectors (Technology)
- **Oversold (<9.7%):** 0 sectors ()

### 3. Sector Rotation

- **Cyclical Avg:** 61.0%
- **Defensive Avg:** 49.0%
- **Commodity Avg:** 52.0%
- **Cyclical-Defensive Gap:** 12.0pp

### 4. Momentum

- **Raw Slope:** +0.0009
- **Smoothed Slope (EMA(3)):** +0.0008 (score: 64/100)
- **Acceleration (10v10):** -0.0002 (Cooling, score: 55/100)
- **Sector Slope Breadth:** 7/11 positive (score: 64/100)

### 5. Historical Context

- **Current Ratio:** 58.0%
- **Percentile Rank:** 68th
- **Historical Range:** 4.0% - 79.0%
- **Historical Median:** 47.0%
- **30-Day Avg:** 55.0%
- **90-Day Avg:** 51.0%
- **Data Points:** 2390 (2016-2026)
- **Confidence:** Medium (sample: n=2390, regime: good, recency: recent)

---

## Sector Heatmap

| Rank | Sector | Ratio | Count/Total | 10MA | Trend | Slope | Status |
|------|--------|-------|-------------|------|-------|-------|--------|
| 1 | Technology | 41.0% | 58/70 | 39.0% | Up | +0.0021 | Overbought |
| 2 | Industrials | 33.0% | 22/34 | 31.0% | Up | +0.0015 | Normal |
| 3 | Financials | 31.0% | 20/33 | 29.0% | Up | +0.0012 | Normal |
| 4 | Consumer Discretionary | 30.0% | 17/30 | 28.0% | Up | +0.0011 | Normal |
| 5 | Communication Services | 29.0% | 7/12 | 27.0% | Up | +0.0010 | Normal |
| 6 | Materials | 27.0% | 8/17 | 26.0% | Up | +0.0008 | Normal |
| 7 | Energy | 26.0% | 6/12 | 25.0% | Up | +0.0007 | Normal |
| 8 | Health Care | 24.0% | 14/30 | 24.0% | Up | +0.0005 | Normal |
| 9 | Consumer Staples | 19.0% | 6/17 | 21.0% | Down | -0.0004 | Normal |
| 10 | Utilities | 17.0% | 5/16 | 19.0% | Down | -0.0006 | Normal |
| 11 | Real Estate | 16.0% | 4/15 | 18.0% | Down | -0.0007 | Normal |

---

## Recommended Actions

**Zone:** Bull (Bull-Upper)
**Exposure Guidance:** Normal Exposure (80-100%)

- Maintain positions
- Watch momentum

---

## Methodology

This analysis uses Monty's Uptrend Ratio Dashboard data to assess market breadth health.
The dashboard tracks ~2,800 US stocks across 11 sectors, measuring the percentage in uptrends.

**5-Component Scoring System (0-100, higher = healthier):**

1. **Market Breadth (30%):** Overall uptrend ratio level and trend direction
2. **Sector Participation (25%):** Number of uptrending sectors and spread uniformity
3. **Sector Rotation (15%):** Cyclical vs Defensive vs Commodity balance
4. **Momentum (20%):** Slope direction, acceleration, and sector slope breadth
5. **Historical Context (10%):** Percentile rank in historical distribution

**Key Thresholds (Monty's Dashboard):** Overbought = 37%, Oversold = 9.7%

For detailed methodology, see `references/uptrend_methodology.md`.

---

**Disclaimer:** This analysis is for educational and informational purposes only. Not investment advice. Past patterns may not predict future outcomes. Conduct your own research and consult a financial advisor before making investment decisions.
