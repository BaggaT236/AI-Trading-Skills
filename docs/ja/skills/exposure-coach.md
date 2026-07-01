---
layout: default
title: "Exposure Coach"
grand_parent: 日本語
parent: スキルガイド
nav_order: 11
lang_peer: /en/skills/exposure-coach/
permalink: /ja/skills/exposure-coach/
generated: false
---

# Exposure Coach
{: .no_toc }

市場ブレッドス、上昇参加率、マクロレジーム、トップリスク、テーマ、セクター、機関投資家フローを統合し、株式への許容エクスポージャー上限と新規リスク可否をまとめるスキルです。
{: .fs-6 .fw-300 }

<span class="badge badge-optional">FMP任意</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/exposure-coach.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/exposure-coach){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

Exposure Coach は、個別銘柄を分析する前に「今、株式リスクをどれだけ取ってよいか」を決めるための制御盤です。複数の市場環境スキルの出力を統合し、次のような Market Posture を作ります。

- net exposure ceiling
- growth vs value bias
- breadth / participation assessment
- `NEW_ENTRY_ALLOWED`、`REDUCE_ONLY`、`CASH_PRIORITY`
- 入力の揃い具合に基づく confidence

---

## 2. 使う場面

- 新しいスイングトレード候補を検討する前
- 週初にポートフォリオのリスク上限を決めるとき
- ブレッドス、レジーム、テーマ、トップリスクのシグナルが食い違うとき
- 大きなマクロイベント後に株式比率を見直すとき
- cash priority か新規 entry allowed かを明文化したいとき

---

## 3. 前提条件

推奨される上流出力:

- `market-breadth-analyzer`
- `uptrend-analyzer`
- `macro-regime-detector`
- `market-top-detector`
- `ftd-detector`
- `theme-detector`
- `sector-analyst`
- `institutional-flow-tracker`

一部の入力が欠けていても実行できます。ただし、欠けた入力が多いほど confidence は下がります。FMP は一部の上流スキルで必要になる場合があります。

---

## 4. クイックスタート

```bash
python3 skills/exposure-coach/scripts/calculate_exposure.py \
  --breadth reports/breadth_latest.json \
  --uptrend reports/uptrend_latest.json \
  --regime reports/regime_latest.json \
  --top-risk reports/top_risk_latest.json \
  --ftd reports/ftd_latest.json \
  --theme reports/theme_latest.json \
  --sector reports/sector_latest.json \
  --institutional reports/institutional_latest.json \
  --output-dir reports/
```

---

## 5. 確認する出力

| 出力 | 意味 |
|---|---|
| exposure ceiling | 株式に割り当てる上限の目安 |
| action recommendation | 新規リスク可否 |
| growth/value bias | グロース寄りかバリュー寄りか |
| participation breadth | 上昇が広いか狭いか |
| confidence | 入力の充足度とシグナル一致度 |

`inputs_provided` と `inputs_missing` は必ず確認します。CLI に渡したファイルが `inputs_missing` に残っている場合、そのシグナルは計算に入っていません。

---

## 6. 運用ルール

- `NEW_ENTRY_ALLOWED`: 通常の候補選別へ進めます。ただし position sizing は別途確認します。
- `REDUCE_ONLY`: 新規 entry より既存ポジションの管理を優先します。
- `CASH_PRIORITY`: 新規リスクを避け、watchlist と検証に留めます。

Exposure Coach は個別銘柄の買い推奨ではありません。市場環境に応じたリスク上限を定めるための補助です。

---

## 7. 注意点

- theme detector の JSON が認識されない場合、テーマ要因を手動で exposure ceiling に混ぜないでください。
- 入力が少ないときは、結論より confidence と missing input を重視してください。
- 実際の発注前には `technical-analyst` と `position-sizer` で個別確認します。
