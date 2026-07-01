---
layout: default
title: "Stanley Druckenmiller Investment"
grand_parent: 日本語
parent: スキルガイド
nav_order: 40
lang_peer: /en/skills/stanley-druckenmiller-investment/
permalink: /ja/skills/stanley-druckenmiller-investment/
---

# Stanley Druckenmiller Investment
{: .no_toc }

Druckenmiller戦略シンセサイザー - 8つの上流スキル出力（Market Breadth、Uptrend Analysis、Market Top、Macro Regime、FTD Detector、VCP Screener、Theme Detector、CANSLIM Screener）を統合し、統一された確信度スコア（0-100）、パターン分類、配分推奨を生成します。総合的な市場確信度、ポートフォリオポジショニング、資産配分、戦略統合、ドラッケンミラー式分析のリクエスト時に使用します。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/stanley-druckenmiller-investment.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/stanley-druckenmiller-investment){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

Druckenmiller戦略シンセサイザーは、複数の上流スキルの出力を統合し、統一された確信度スコア・パターン分類・配分推奨を生成するスキルです。5つの必須スキルJSONレポートを読み込み、7つのコンポーネントスコアを計算し、4つのドラッケンミラーパターンの1つに分類して、具体的なポジションサイジングとターゲット配分を出力します。

---

## 2. 使用タイミング

**英語：**
- 「What's my overall conviction?」「How should I be positioned?」
- ブレッドス、アップトレンド、天井リスク、マクロ、FTDシグナルの統合判断
- ドラッケンミラー式のポートフォリオポジショニング
- 個別スキル実行後の戦略統合レポート
- 「Should I increase or decrease exposure?」
- パターン分類（policy pivot、distortion、contrarian、wait）

**日本語：**
- 「総合的な市場判断は？」「今のポジショニングは？」
- ブレッドス、アップトレンド、天井リスク、マクロの統合判断
- 「エクスポージャーを増やすべき？減らすべき？」
- 「ドラッケンミラー分析を実行して」
- 個別スキル実行後の戦略統合レポート

---

## 3. 前提条件

- **APIキー：** 不要
- **Python 3.9+** 推奨

---

## 4. クイックスタート

```bash
python3 skills/stanley-druckenmiller-investment/scripts/strategy_synthesizer.py \
  --reports-dir reports/ \
  --output-dir reports/ \
  --max-age 72
```

---

## 5. ワークフロー

### Phase 1: 前提条件の確認

5つの必須スキルJSONレポートが `reports/` に存在し、最新であること（72時間以内）を確認。不足がある場合は、対応するスキルを先に実行してください。

### Phase 2: 戦略シンセサイザーの実行

```bash
python3 skills/stanley-druckenmiller-investment/scripts/strategy_synthesizer.py \
  --reports-dir reports/ \
  --output-dir reports/ \
  --max-age 72
```

スクリプトの動作：
1. すべての上流スキルJSONレポートを読み込み・検証
2. 各スキルから正規化されたシグナルを抽出
3. 7つのコンポーネントスコア（重み付き0-100）を計算
4. 複合確信度スコアを算出
5. 4つのドラッケンミラーパターンの1つに分類
6. ターゲット配分とポジションサイジングを生成
7. JSONとMarkdownレポートを出力

### Phase 3: 結果の提示

生成されたMarkdownレポートをユーザーに提示。以下をハイライト：
- 確信度スコアとゾーン
- 検出されたパターンとマッチ強度
- 最も強い/弱いコンポーネント
- ターゲット配分（株式/債券/オルタナティブ/現金）
- ポジションサイジングパラメータ
- 関連するドラッケンミラーの原則

### Phase 4: ドラッケンミラーのコンテキスト提供

適切なリファレンスドキュメントを読み込み、哲学的なコンテキストを提供：
- **高確信度:** 集中投資と「fat pitch」の原則を強調
- **低確信度:** 資本保全と忍耐を強調
- **パターン固有:** `references/case-studies.md` の関連ケーススタディを適用

---

## 6. リソース

**リファレンス：**

- `skills/stanley-druckenmiller-investment/references/case-studies.md`
- `skills/stanley-druckenmiller-investment/references/conviction_matrix.md`
- `skills/stanley-druckenmiller-investment/references/investment-philosophy.md`
- `skills/stanley-druckenmiller-investment/references/market-analysis-guide.md`

**スクリプト：**

- `skills/stanley-druckenmiller-investment/scripts/allocation_engine.py`
- `skills/stanley-druckenmiller-investment/scripts/report_generator.py`
- `skills/stanley-druckenmiller-investment/scripts/report_loader.py`
- `skills/stanley-druckenmiller-investment/scripts/scorer.py`
- `skills/stanley-druckenmiller-investment/scripts/strategy_synthesizer.py`
