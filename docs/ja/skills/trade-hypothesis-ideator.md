---
layout: default
title: "Trade Hypothesis Ideator"
grand_parent: 日本語
parent: スキルガイド
nav_order: 11
lang_peer: /en/skills/trade-hypothesis-ideator/
permalink: /ja/skills/trade-hypothesis-ideator/
---

# Trade Hypothesis Ideator
{: .no_toc }

マーケットデータ、トレードログ、ジャーナルスニペットから反証可能なトレード戦略仮説を生成するスキルです。構造化された入力バンドルから、実験デザイン・キル基準付きのランク付き仮説カードを生成し、オプションでedge-finder-candidate/v1互換のstrategy.yamlとしてエクスポートできます。

{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/trade-hypothesis-ideator.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/trade-hypothesis-ideator){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

マーケットデータ、トレードログ、ジャーナルスニペットを入力として、反証可能で検証可能なトレード戦略仮説を自動生成します。2パスのアプローチ（生成 + 批評）で品質を確保し、各仮説には実験デザイン、キル基準、信頼度スコアが付与されます。

---

## 2. 使用タイミング

- 構造化された入力バンドル（マーケットデータ・トレードログ・ジャーナル）がある場合
- ランク付けされた仮説カードが必要な場合
- 実験デザインとキル基準を含む仮説が必要な場合
- edge-finder-candidate/v1互換のstrategy.yamlエクスポートが必要な場合

---

## 3. 前提条件

- **APIキー：** 不要
- **Python 3.9+** 推奨

---

## 4. クイックスタート

1. 入力JSONバンドルを受信
2. パス1: 正規化 + エビデンス抽出を実行
3. プロンプトを使用して仮説を生成：
   - `prompts/system_prompt.md`
   - `prompts/developer_prompt_template.md`（`{{evidence_summary}}` を注入）
4. `prompts/critique_prompt_template.md` で仮説を批評
5. パス2: ランキング + 出力フォーマッティング + ガードレールを実行
6. オプションで `pursue` 仮説をステップHのストラテジーエクスポーターでエクスポート

---

## 5. ワークフロー

1. 入力JSONバンドルを受信
2. パス1: 正規化 + エビデンス抽出を実行
3. プロンプトを使用して仮説を生成：
   - `prompts/system_prompt.md`
   - `prompts/developer_prompt_template.md`（`{{evidence_summary}}` を注入）
4. `prompts/critique_prompt_template.md` で仮説を批評
5. パス2: ランキング + 出力フォーマッティング + ガードレールを実行
6. オプションで `pursue` 仮説をステップHのストラテジーエクスポーターでエクスポート

---

## 6. リソース

**リファレンス：**

- `skills/trade-hypothesis-ideator/references/evidence_quality_guide.md`
- `skills/trade-hypothesis-ideator/references/hypothesis_types.md`

**スクリプト：**

- `skills/trade-hypothesis-ideator/scripts/run_hypothesis_ideator.py`
