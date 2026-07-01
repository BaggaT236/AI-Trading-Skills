---
layout: default
title: "Edge Hint Extractor"
grand_parent: 日本語
parent: スキルガイド
nav_order: 20
lang_peer: /en/skills/edge-hint-extractor/
permalink: /ja/skills/edge-hint-extractor/
---

# Edge Hint Extractor
{: .no_toc }

日々の市場観測やニュースリアクションからエッジヒントを抽出し、オプションのLLMアイデーションを加えて、下流のコンセプト合成や自動検出向けの正規化された hints.yaml を出力します。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/edge-hint-extractor.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/edge-hint-extractor){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

生の観測シグナル（`market_summary`、`anomalies`、`news reactions`）を構造化されたエッジヒントに変換します。
このスキルは分割ワークフローの最初のステージです：`観測 -> 抽象化 -> 設計 -> パイプライン`。

---

## 2. 使用タイミング

- 日々の市場観測を再利用可能なヒントオブジェクトに変換したい場合
- 現在のアノマリー/ニューコンテキストに制約されたLLM生成アイデアが欲しい場合
- コンセプト合成や自動検出用のクリーンな `hints.yaml` 入力が必要な場合

---

## 3. 前提条件

- Python 3.9+
- `PyYAML`
- 検出器実行からのオプション入力：
  - `market_summary.json`
  - `anomalies.json`
  - `news_reactions.csv` または `news_reactions.json`

---

## 4. クイックスタート

1. 観測ファイル（`market_summary`、`anomalies`、オプションのニュースリアクション）を収集
2. `scripts/build_hints.py` を実行して決定論的ヒントを生成
3. オプションでLLMアイデアによりヒントを拡充（2つの方法のいずれか）：
   - a. `--llm-ideas-cmd` -- 外部LLM CLIにデータをパイプ（サブプロセス）
   - b. `--llm-ideas-file PATH` -- YAMLファイルから事前作成のヒントを読み込み（Claude Codeワークフローで Claude 自身がヒントを生成する場合）
4. `hints.yaml` をコンセプト合成または自動検出に渡す

---

## 5. ワークフロー

1. 観測ファイル（`market_summary`、`anomalies`、オプションのニュースリアクション）を収集
2. `scripts/build_hints.py` を実行して決定論的ヒントを生成
3. オプションでLLMアイデアによりヒントを拡充（2つの方法のいずれか）：
   - a. `--llm-ideas-cmd` -- 外部LLM CLIにデータをパイプ（サブプロセス）
   - b. `--llm-ideas-file PATH` -- YAMLファイルから事前作成のヒントを読み込み（Claude Codeワークフローで Claude 自身がヒントを生成する場合）
4. `hints.yaml` をコンセプト合成または自動検出に渡す

注意: `--llm-ideas-cmd` と `--llm-ideas-file` は相互排他的です。

---

## 6. リソース

**リファレンス:**

- `skills/edge-hint-extractor/references/hints_schema.md`

**スクリプト:**

- `skills/edge-hint-extractor/scripts/build_hints.py`
