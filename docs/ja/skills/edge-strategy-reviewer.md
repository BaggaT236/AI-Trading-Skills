---
layout: default
title: "Edge Strategy Reviewer"
grand_parent: 日本語
parent: スキルガイド
nav_order: 23
lang_peer: /en/skills/edge-strategy-reviewer/
permalink: /ja/skills/edge-strategy-reviewer/
---

# Edge Strategy Reviewer
{: .no_toc }

edge-strategy-designerが生成した戦略ドラフトを、エッジの妥当性、オーバーフィッティングリスク、サンプルサイズの十分性、実行の現実性について批判的にレビューします。strategy_drafts/*.yamlが存在し、パイプラインエクスポート前に品質ゲートが必要な場合に使用します。信頼度スコア付きのPASS/REVISE/REJECT判定を出力します。

{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/edge-strategy-reviewer.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/edge-strategy-reviewer){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

edge-strategy-designerが生成した戦略ドラフトを批判的にレビューするスキルです。

---

## 2. 使用タイミング

- `edge-strategy-designer` が `strategy_drafts/*.yaml` を生成した後
- パイプライン経由で `edge-candidate-agent` にドラフトをエクスポートする前
- ドラフト戦略のエッジ妥当性を手動で検証する場合

---

## 3. 前提条件

- 戦略ドラフト YAML ファイル（`edge-strategy-designer` の出力）
- Python 3.10+ と PyYAML

---

## 4. クイックスタート

```bash
# ディレクトリ内の全ドラフトをレビュー
python3 skills/edge-strategy-reviewer/scripts/review_strategy_drafts.py \
  --drafts-dir reports/edge_strategy_drafts/ \
  --output-dir reports/

# 単一ドラフトのレビュー（JSON出力とMarkdownサマリー付き）
python3 skills/edge-strategy-reviewer/scripts/review_strategy_drafts.py \
  --draft reports/edge_strategy_drafts/draft_xxx.yaml \
  --output-dir reports/ --format json --markdown-summary
```

---

## 5. ワークフロー

1. `--drafts-dir` または単一の `--draft` ファイルからドラフト YAML ファイルを読み込む
2. 各ドラフトを 8 つの基準（C1-C8）に対して重み付きスコアリングで評価
3. 信頼度スコア（全基準の加重平均）を算出
4. 判定を決定: PASS / REVISE / REJECT
5. エクスポート適格性を評価（PASS + export_ready_v1 + エクスポート可能なファミリー）
6. レビュー出力（YAML または JSON）とオプションの Markdown サマリーを書き出す

---

## 6. リソース

**リファレンス:**

- `skills/edge-strategy-reviewer/references/overfitting_checklist.md`
- `skills/edge-strategy-reviewer/references/review_criteria.md`

**スクリプト:**

- `skills/edge-strategy-reviewer/scripts/review_strategy_drafts.py`
