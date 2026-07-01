---
layout: default
title: "Breakout Trade Planner"
grand_parent: 日本語
parent: スキルガイド
nav_order: 11
lang_peer: /en/skills/breakout-trade-planner/
permalink: /ja/skills/breakout-trade-planner/
generated: false
---

# Breakout Trade Planner
{: .no_toc }

VCP スクリーナーの候補を、実際に検討できるブレイクアウト売買計画へ変換するスキルです。エントリー、損切り、目標値、最悪約定価格でのリスク、ポートフォリオ全体のヒートをまとめて確認できます。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/breakout-trade-planner.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/breakout-trade-planner){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

Breakout Trade Planner は、`vcp-screener` が見つけた VCP 候補を「何株を、どの価格で、どこにストップを置いて検討するか」という実務的な計画に落とし込むためのスキルです。

主な役割:

- VCP 候補の pivot、現在値、contraction low から entry/stop/target を算出
- 楽観的な signal price ではなく、stop-limit の limit price を使って最悪ケースのリスクを計算
- 1トレードのリスク、最大ポジション比率、セクター集中、総 portfolio heat を確認
- Alpaca 互換の bracket order テンプレートを生成
- 候補を `actionable`、`revalidation`、`watchlist`、`rejected` などに分類

このスキルは注文実行エンジンではありません。出力は人間が確認するための売買計画です。

---

## 2. 使う場面

- VCP Screener の JSON 出力をもとに具体的な売買計画を作りたい
- pivot 上抜けの entry、stop、target、R 倍率を整理したい
- 最悪約定価格で見たときのリスクが許容範囲か確認したい
- 既存ポジションを含めた portfolio heat を見たい
- Alpaca に転記しやすい注文テンプレートを作りたい

使わない場面:

- VCP 候補そのものを探す段階。先に `vcp-screener` を使います。
- 市場環境の可否判定。先に `market-regime-daily` や `exposure-coach` を確認します。
- 自動発注。注文は必ず人間が確認して行います。

---

## 3. 前提条件

- Python 3.9+
- `vcp-screener` の JSON 出力
- 口座サイズ、1トレードあたりのリスク許容率
- API キーは不要

任意で、既存保有ポジションを `--current-exposure-json` として渡すと、セクター集中や総ヒートの判定がより現実に近くなります。

---

## 4. クイックスタート

```bash
python3 skills/breakout-trade-planner/scripts/plan_breakout_trades.py \
  --input reports/vcp_screener_YYYY-MM-DD.json \
  --account-size 100000 \
  --risk-pct 0.5 \
  --output-dir reports/
```

Claude に依頼する場合:

```text
最新の VCP screener 結果から、口座10万ドル・1トレード0.5%リスクでブレイクアウト計画を作って
```

---

## 5. 判定ロジック

Minervini 型のブレイクアウト計画として、次の条件を重視します。

| 項目 | 意味 |
|---|---|
| `valid_vcp` | VCP として成立しているか |
| `rating_band` | setup quality が good/strong/textbook か |
| `risk_pct_worst` | worst entry から stop までのリスクが原則 8% 以下か |
| `breakout_volume` | breakout 済み候補では出来高確認があるか |
| `distance_from_pivot` | pivot から追いかけすぎていないか |
| portfolio heat | 複数候補を同時に取った場合の総リスク |

出力は「買うべき銘柄リスト」ではなく、どの候補が検討可能で、どの候補が保留または却下かを明確にするものです。

---

## 6. 出力の読み方

Markdown レポートでは、次のグループを確認します。

- **Actionable Orders:** 事前に stop-limit を置ける可能性がある候補
- **Revalidation:** すでに動いたため、5分足などで再確認が必要な候補
- **Watchlist:** まだ発火前で監視に残す候補
- **Rejected / Deferred / Constrained:** リスク、流動性、heat、追いかけすぎなどで見送る候補

各候補について、entry、worst entry、stop、target、position size、想定損失額、R 倍率を必ず確認してください。

---

## 7. 注意点

- pivot から大きく上に離れた候補を無理に追いかけないでください。
- worst entry で計算したリスクが許容範囲を超える場合は見送ります。
- 市場環境が risk-off のときは、このスキルの出力だけで新規リスクを取らないでください。
- Alpaca テンプレートは転記用です。実際の注文前に価格、株数、口座状況を確認してください。
