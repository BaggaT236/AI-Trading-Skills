---
layout: default
title: "Edge Strategy Designer"
grand_parent: 日本語
parent: スキルガイド
nav_order: 22
lang_peer: /en/skills/edge-strategy-designer/
permalink: /ja/skills/edge-strategy-designer/
---

# Edge Strategy Designer
{: .no_toc }

抽象的なエッジコンセプトを戦略ドラフトバリアントに変換し、オプションでedge-candidate-agentのエクスポート/検証用チケットYAMLを生成します。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/edge-strategy-designer.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/edge-strategy-designer){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

コンセプトレベルの仮説を具体的な戦略ドラフト仕様に変換します。
このスキルはコンセプト合成の後、パイプラインエクスポート検証の前に位置します。

---

## 2. 使用タイミング

- `edge_concepts.yaml` があり、戦略候補が必要な場合。
- コンセプトごとに複数のバリアント（core/conservative/research-probe）を生成したい場合。
- インターフェース v1 ファミリー向けのエクスポート可能なチケットファイルが必要な場合。

---

## 3. 前提条件

- Python 3.9+
- `PyYAML`
- コンセプト合成で生成された `edge_concepts.yaml`

---

## 4. クイックスタート

1. `edge_concepts.yaml` を読み込む。
2. リスクプロファイルを選択（`conservative`, `balanced`, `aggressive`）。
3. 仮説タイプ別のエグジットキャリブレーション付きでコンセプトごとのバリアントを生成。
4. `HYPOTHESIS_EXIT_OVERRIDES` を適用して、仮説タイプ（breakout, earnings_drift, panic_reversal 等）ごとにストップロス、リワード/リスク比、タイムストップ、トレーリングストップを調整。
5. C5 レビュー失敗を防ぐため、リワード/リスク比を `RR_FLOOR=1.5` でクランプ。
6. 該当する場合に v1 対応チケット YAML をエクスポート。
7. エクスポート可能なチケットを `skills/edge-candidate-agent/scripts/export_candidate.py` に引き渡す。

---

## 5. ワークフロー

1. `edge_concepts.yaml` を読み込む。
2. リスクプロファイルを選択（`conservative`, `balanced`, `aggressive`）。
3. 仮説タイプ別のエグジットキャリブレーション付きでコンセプトごとのバリアントを生成。
4. `HYPOTHESIS_EXIT_OVERRIDES` を適用して、仮説タイプ（breakout, earnings_drift, panic_reversal 等）ごとにストップロス、リワード/リスク比、タイムストップ、トレーリングストップを調整。
5. C5 レビュー失敗を防ぐため、リワード/リスク比を `RR_FLOOR=1.5` でクランプ。
6. 該当する場合に v1 対応チケット YAML をエクスポート。
7. エクスポート可能なチケットを `skills/edge-candidate-agent/scripts/export_candidate.py` に引き渡す。

---

## 6. リソース

**リファレンス:**

- `skills/edge-strategy-designer/references/strategy_draft_schema.md`

**スクリプト:**

- `skills/edge-strategy-designer/scripts/design_strategy_drafts.py`
