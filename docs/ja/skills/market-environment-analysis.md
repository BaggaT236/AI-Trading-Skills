---
layout: default
title: "Market Environment Analysis"
grand_parent: 日本語
parent: スキルガイド
nav_order: 30
lang_peer: /en/skills/market-environment-analysis/
permalink: /ja/skills/market-environment-analysis/
---

# Market Environment Analysis
{: .no_toc }

包括的な市場環境分析・レポートツールです。米国、欧州、アジア市場、為替、コモディティ、経済指標を含むグローバル市場を分析します。リスクオン/リスクオフ評価、セクター分析、テクニカル指標の解釈を提供します。market analysis, market environment, global markets, trading environment, market conditions, investment climate, market sentiment, forex analysis, stock market analysis, 相場環境, 市場分析, マーケット状況, 投資環境などのキーワードでトリガーされます。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/market-environment-analysis.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/market-environment-analysis){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

グローバル市場の包括的な環境分析とレポート生成を行うスキルです。

---

## 2. 前提条件

- **APIキー:** 不要
- **Python 3.9+** 推奨

---

## 3. クイックスタート

```bash
1. Executive Summary (3-5 key points)
2. Global Market Overview
   - US Markets
   - Asian Markets
   - European Markets
3. Forex & Commodities Trends
4. Key Events & Economic Indicators
5. Risk Factor Analysis
6. Investment Strategy Implications
```

---

## 4. ワークフロー

### 1. 初期データ収集
web_searchツールを使用して最新の市場データを収集:
1. 主要株価指数（S&P 500、NASDAQ、ダウ、日経225、上海総合、ハンセン）
2. 為替レート（USD/JPY、EUR/USD、主要通貨ペア）
3. コモディティ価格（WTI原油、金、銀）
4. 米国債利回り（2年、10年、30年）
5. VIX指数（恐怖指数）
6. 市場の取引状態（開場/閉場/現在値）

### 2. 市場環境評価
収集したデータから以下を評価:
- **トレンド方向**: 上昇トレンド/下降トレンド/レンジ相場
- **リスクセンチメント**: リスクオン/リスクオフ
- **ボラティリティ状態**: VIXから市場の不安レベル
- **セクターローテーション**: 資金がどこに流れているか

### 3. レポート構成

#### 標準レポートフォーマット:
```
1. Executive Summary (3-5 key points)
2. Global Market Overview
   - US Markets
   - Asian Markets
   - European Markets
3. Forex & Commodities Trends
4. Key Events & Economic Indicators
5. Risk Factor Analysis
6. Investment Strategy Implications
```

---

## 5. リソース

**リファレンス:**

- `skills/market-environment-analysis/references/analysis_patterns.md`
- `skills/market-environment-analysis/references/indicators.md`

**スクリプト:**

- `skills/market-environment-analysis/scripts/market_utils.py`
