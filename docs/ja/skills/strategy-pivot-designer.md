---
layout: default
title: "Strategy Pivot Designer"
grand_parent: 日本語
parent: スキルガイド
nav_order: 41
lang_peer: /en/skills/strategy-pivot-designer/
permalink: /ja/skills/strategy-pivot-designer/
---

# Strategy Pivot Designer
{: .no_toc }

バックテストの反復が停滞した際に検出し、パラメータチューニングが局所最適に達した場合に構造的に異なる戦略ピボット提案を生成するスキルです。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/strategy-pivot-designer.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/strategy-pivot-designer){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

戦略のバックテスト反復ループが停滞した場合を検出し、構造的に異なる戦略アーキテクチャを提案します。Edgeパイプライン（hint-extractor -> concept-synthesizer -> strategy-designer -> candidate-agent）のフィードバックループとして機能し、パラメータの微調整ではなく戦略の骨格を再設計することで局所最適から脱出します。

---

## 2. 使用タイミング

- 複数回のリファインメント反復にもかかわらず、バックテストスコアが横ばいになった場合
- 戦略が過学習の兆候を示している場合（イン・サンプルは高いがロバスト性が低い）
- 取引コストが戦略の薄いエッジを打ち消す場合
- テールリスクやドローダウンが許容閾値を超える場合
- 同じ市場仮説に対して根本的に異なる戦略アーキテクチャを探索したい場合

---

## 3. 前提条件

- Python 3.9+
- `PyYAML`
- 反復履歴JSON（蓄積されたbacktest-expert評価結果）
- ソース戦略ドラフトYAML（edge-strategy-designerの出力）

---

## 4. クイックスタート

1. `--append-eval` を使用してバックテスト評価結果を反復履歴ファイルに蓄積
2. 履歴に対して停滞検出を実行し、トリガーを特定（横ばい、過学習、コスト敗北、テールリスク）
3. 停滞が検出された場合、3つの技法でピボット提案を生成：仮定の反転、アーキタイプの切替、目的関数の再定義
4. ランク付けされた提案をレビュー（品質ポテンシャル + 新規性でスコアリング）
5. エクスポート可能な提案はedge-candidate-agentパイプライン用のチケットYAMLとして利用可能
6. research_onlyの提案はパイプライン統合前に手動での戦略設計が必要
7. 選択したピボットドラフトをbacktest-expertに投入し、次の反復サイクルを開始

---

## 5. ワークフロー

1. `--append-eval` を使用してバックテスト評価結果を反復履歴ファイルに蓄積
2. 履歴に対して停滞検出を実行し、トリガーを特定（横ばい、過学習、コスト敗北、テールリスク）
3. 停滞が検出された場合、3つの技法でピボット提案を生成：仮定の反転、アーキタイプの切替、目的関数の再定義
4. ランク付けされた提案をレビュー（品質ポテンシャル + 新規性でスコアリング）
5. エクスポート可能な提案はedge-candidate-agentパイプライン用のチケットYAMLとして利用可能
6. research_onlyの提案はパイプライン統合前に手動での戦略設計が必要
7. 選択したピボットドラフトをbacktest-expertに投入し、次の反復サイクルを開始

---

## 6. リソース

**リファレンス：**

- `skills/strategy-pivot-designer/references/pivot_proposal_schema.md`
- `skills/strategy-pivot-designer/references/pivot_techniques.md`
- `skills/strategy-pivot-designer/references/stagnation_triggers.md`
- `skills/strategy-pivot-designer/references/strategy_archetypes.md`

**スクリプト：**

- `skills/strategy-pivot-designer/scripts/detect_stagnation.py`
- `skills/strategy-pivot-designer/scripts/generate_pivots.py`
