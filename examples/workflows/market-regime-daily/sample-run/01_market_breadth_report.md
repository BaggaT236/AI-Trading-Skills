# Market Breadth Analyzer Report

**Generated:** 2026-01-15 07:05:00
**Data Source:** TraderMonty Market Breadth CSV (no API key required)
**Latest Data:** 2026-01-14 (1 days old)
**Live Dashboard:** [Interactive Chart](https://tradermonty.github.io/market-breadth-analysis/)

---

## Overall Assessment

| Metric | Value |
|--------|-------|
| **Composite Score** | **66/100** |
| **Health Zone** | 🔵 Healthy |
| **Equity Exposure** | 75-90% |
| **Strongest** | Bearish Signal Status (80/100) |
| **Weakest** | S&P 500 vs Breadth Divergence (50/100) |
| **Data Quality** | Complete (6/6 components) |

> **Guidance:** Normal operations. Broad participation, but watch the S&P 500 vs breadth divergence.

---

## Component Scores

| # | Component | Weight | Eff. Weight | Score | Contribution | Signal |
|---|-----------|--------|-------------|-------|--------------|--------|
| 1 | **Current Breadth Level & Trend** | 25% | 25% | ███░ 72 | 18.0 | HEALTHY: 8MA above 200MA, rising |
| 2 | **8MA vs 200MA Crossover** | 20% | 20% | ███░ 68 | 13.6 | POSITIVE: 8MA > 200MA |
| 3 | **Peak/Trough Cycle Position** | 20% | 20% | ███░ 60 | 12.0 | NEUTRAL: mid-cycle |
| 4 | **Bearish Signal Status** | 15% | 15% | ████ 80 | 12.0 | CLEAR: no active bearish signal |
| 5 | **Historical Percentile** | 10% | 10% | ██░░ 55 | 5.5 | NORMAL: 55th percentile |
| 6 | **S&P 500 vs Breadth Divergence** | 10% | 10% | ██░░ 50 | 5.0 | MILD: price slightly ahead of breadth |

---

## Component Details

### 1. Current Breadth Level & Trend

- **8MA Level:** 0.6100
- **200MA Level:** 0.5400
- **200MA Trend:** Uptrend
- **Level Score:** 70
- **Trend Score:** 74
- **8MA Direction (5d):** rising

### 2. 8MA vs 200MA Crossover Dynamics

- **Gap (8MA - 200MA):** +0.0700
- **Gap Score:** 72
- **8MA Direction (5d):** rising
- **Direction Modifier:** +0

### 3. Peak/Trough Cycle Position

- **Latest Marker:** trough
- **Days Since Marker:** 34
- **8MA Trend:** rising

### 4. Bearish Signal Status

- **Bearish Signal Active:** No
- **200MA Trend:** Uptrend
- **Current 8MA:** 0.6100
- **Pink Zone:** No (outside bearish region)
- **Base Score:** 90
- **Context Adjustment:** -10

### 5. Historical Percentile

- **Current 8MA:** 0.6100
- **Percentile Rank:** 55.0%
- **Avg Peak (200MA):** 0.68
- **Avg Trough (8MA<0.4):** 0.34

### 6. S&P 500 vs Breadth Divergence

- **S&P 500 60d Change:** +3.10%
- **Breadth 8MA 60d Change:** +0.0120
- **Divergence Type:** mild_bearish

---

## Key Levels to Watch

*No key levels computed.*

---

## Recommended Actions

**Health Zone:** Healthy
**Equity Exposure:** 75-90%

- Maintain core exposure
- Monitor divergence component

---

## Methodology

This analysis uses TraderMonty's market breadth dataset to quantify market participation health across 6 dimensions:

1. **Breadth Level & Trend (25%):** Current 8MA level and 200MA trend direction
2. **MA Crossover (20%):** Gap between 8MA and 200MA with momentum detection
3. **Cycle Position (20%):** Position relative to recent peaks/troughs
4. **Bearish Signal (15%):** Backtested bearish signal flag from dataset
5. **Historical Percentile (10%):** Current level vs full history distribution
6. **Divergence (10%):** S&P 500 price vs breadth directional agreement

Composite score: 0-100 (100 = maximum health). No API key required - uses freely available CSV data.

For detailed methodology, see `references/breadth_analysis_methodology.md`.

---

**Disclaimer:** This analysis is for educational and informational purposes only. Not investment advice. Past patterns may not predict future outcomes. Conduct your own research and consult a financial advisor before making investment decisions.
