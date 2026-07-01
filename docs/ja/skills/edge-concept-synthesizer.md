---
layout: default
title: "Edge Concept Synthesizer"
grand_parent: 日本語
parent: スキルガイド
nav_order: 19
lang_peer: /en/skills/edge-concept-synthesizer/
permalink: /ja/skills/edge-concept-synthesizer/
---

# Edge Concept Synthesizer
{: .no_toc }

検出器のチケットとヒントを、テーシス、無効化シグナル、戦略プレイブックを備えた再利用可能なエッジコンセプトに抽象化します。戦略の設計/エクスポートの前段階で使用します。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/edge-concept-synthesizer.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/edge-concept-synthesizer){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

検出と戦略実装の間に抽象化レイヤーを作成します。
このスキルはチケットのエビデンスをクラスタリングし、繰り返し発生する条件を要約し、明示的なテーシスと無効化ロジックを含む `edge_concepts.yaml` を出力します。

---

## 2. 使用タイミング

- 多数の生チケットがあり、メカニズムレベルの構造化が必要な場合
- チケットから戦略への直接変換によるオーバーフィッティングを回避したい場合
- 戦略ドラフト作成前にコンセプトレベルのレビューが必要な場合

---

## 3. 前提条件

- Python 3.9+
- `PyYAML`
- 検出器出力からのチケットYAMLディレクトリ（`tickets/exportable`、`tickets/research_only`）
- オプションの `hints.yaml`

---

## 4. クイックスタート

1. 自動検出出力からチケットYAMLファイルを収集
2. オプションで `hints.yaml` をコンテキストマッチング用に提供
3. `scripts/synthesize_edge_concepts.py` を実行
4. コンセプトの重複排除：同一仮説で重複する条件を持つコンセプトをマージ（包含率 > 閾値）
5. コンセプトをレビューし、高サポートのコンセプトのみを戦略ドラフト作成に昇格

---

## 5. ワークフロー

1. 自動検出出力からチケットYAMLファイルを収集
2. オプションで `hints.yaml` をコンテキストマッチング用に提供
3. `scripts/synthesize_edge_concepts.py` を実行
4. コンセプトの重複排除：同一仮説で重複する条件を持つコンセプトをマージ（包含率 > 閾値）
5. コンセプトをレビューし、高サポートのコンセプトのみを戦略ドラフト作成に昇格

---

## 6. リソース

**リファレンス:**

- `skills/edge-concept-synthesizer/references/concept_schema.md`

**スクリプト:**

- `skills/edge-concept-synthesizer/scripts/synthesize_edge_concepts.py`
