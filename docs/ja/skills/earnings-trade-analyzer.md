---
layout: default
title: "Earnings Trade Analyzer"
grand_parent: 日本語
parent: スキルガイド
nav_order: 16
lang_peer: /en/skills/earnings-trade-analyzer/
permalink: /ja/skills/earnings-trade-analyzer/
---

# Earnings Trade Analyzer
{: .no_toc }

5ファクタースコアリングシステム（ギャップサイズ、決算前トレンド、出来高トレンド、MA200ポジション、MA50ポジション）を使用して、直近の決算後銘柄を分析します。各銘柄を0〜100でスコアリングし、A/B/C/Dグレードを付与します。ユーザーが決算トレード分析、決算後モメンタムスクリーニング、決算ギャップスコアリング、または最良の直近決算リアクションの検索を求めた場合に使用します。
{: .fs-6 .fw-300 }

<span class="badge badge-api">FMP必須</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/earnings-trade-analyzer.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/earnings-trade-analyzer){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

決算後の5ファクタースコアリングによるトレード分析スキルです。直近の決算発表後の株価リアクションを、ギャップサイズ、決算前のトレンド、出来高トレンド、200日移動平均線との位置関係、50日移動平均線との位置関係の5つの要素で総合的に評価します。

---

## 2. 使用タイミング

- ユーザーが決算後のトレード分析や決算ギャップスクリーニングを求めた場合
- ユーザーが最良の直近決算リアクションを見つけたい場合
- ユーザーが決算モメンタムのスコアリングやグレーディングを要求した場合
- ユーザーが決算後アキュムレーションデー（PEAD）の候補について質問した場合

---

## 3. 前提条件

- FMP APIキー（`FMP_API_KEY` 環境変数を設定するか `--api-key` を渡す）
- 無料枠（250コール/日）はデフォルトのスクリーニング（ルックバック2日、トップ20）に十分
- より大きなルックバック期間やフルスクリーニングには有料枠を推奨

---

## 4. クイックスタート

```bash
# デフォルト: 2日間のルックバック、トップ20の結果
python3 skills/earnings-trade-analyzer/scripts/analyze_earnings_trades.py \
  --output-dir reports/

# カスタムパラメータ（エントリー品質フィルター付き）
python3 skills/earnings-trade-analyzer/scripts/analyze_earnings_trades.py \
  --lookback-days 3 --top 10 --max-api-calls 200 \
  --apply-entry-filter --output-dir reports/
```

---

## 5. ワークフロー

### ステップ1: Earnings Trade Analyzerの実行

分析スクリプトを実行します：

```bash
# デフォルト: 過去2日間の決算、トップ20の結果
python3 skills/earnings-trade-analyzer/scripts/analyze_earnings_trades.py --output-dir reports/

# カスタムのルックバックと時価総額フィルター
python3 skills/earnings-trade-analyzer/scripts/analyze_earnings_trades.py \
  --lookback-days 5 \
  --min-market-cap 1000000000 \
  --top 30 \
  --output-dir reports/

# エントリー品質フィルター付き
python3 skills/earnings-trade-analyzer/scripts/analyze_earnings_trades.py \
  --apply-entry-filter \
  --output-dir reports/
```

### ステップ2: 結果のレビュー

1. 生成されたJSONおよびマークダウンレポートを読む
2. スコアリングの解釈コンテキストとして `references/scoring_methodology.md` を読み込む
3. アクション可能なセットアップとしてグレードAおよびBの銘柄に注目

### ステップ3: 分析の提示

各トップ候補について以下を提示：
- 総合スコアとレターグレード（A/B/C/D）
- 決算ギャップのサイズと方向
- 決算前20日間のトレンド
- 出来高比率（20日平均 vs 60日平均）
- 200日および50日移動平均線との相対位置
- 最弱および最強のスコアリングコンポーネント

### ステップ4: アクション可能なガイダンスの提供

グレードに基づく判断：
- **グレードA (85+):** 機関投資家のアキュムレーションを伴う強い決算リアクション - エントリーを検討
- **グレードB (70-84):** 監視に値する良好な決算リアクション - 押し目または確認を待つ
- **グレードC (55-69):** 混在するシグナル - 注意を払い、追加分析が必要
- **グレードD (<55):** 弱いセットアップ - 回避するか、より良い条件を待つ

---

## 6. リソース

**リファレンス:**

- `skills/earnings-trade-analyzer/references/scoring_methodology.md`

**スクリプト:**

- `skills/earnings-trade-analyzer/scripts/analyze_earnings_trades.py`
- `skills/earnings-trade-analyzer/scripts/fmp_client.py`
- `skills/earnings-trade-analyzer/scripts/report_generator.py`
- `skills/earnings-trade-analyzer/scripts/scorer.py`
