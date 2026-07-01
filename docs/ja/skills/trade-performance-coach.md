---
layout: default
title: "Trade Performance Coach"
grand_parent: 日本語
parent: スキルガイド
nav_order: 55
lang_peer: /en/skills/trade-performance-coach/
permalink: /ja/skills/trade-performance-coach/
generated: false
---

# Trade Performance Coach
{: .no_toc }

クローズ済みトレード、部分利確、月次集計をもとに、プロセス遵守、リスク規律、執行品質、行動パターンをレビューするスキルです。売買助言、心理療法、ブローカー操作は行いません。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/trade-performance-coach.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/trade-performance-coach){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

Trade Performance Coach は、記録済みのトレード結果とジャーナル証拠を使って、人間のトレーダーが意思決定プロセスを改善するためのレビューを作成します。

対象にする観点:

- プロセス遵守
- リスク規律
- 執行品質
- 繰り返し出ている可能性のある行動パターン
- 次のセッションで使う一時的な運用ルール
- 振り返りのためのコーチング質問

このスキルは、リスクマネージャー、デスク責任者、トレーディングコーチのような支援役を想定しています。特定銘柄の買い、売り、空売り、保有、サイズ変更を勧めることはありません。

---

## 2. 使う場面

- トレードをクローズし、事後レビューをしたい
- 部分利確や部分撤退のあとに、サイズ、ストップ、出口判断を検証したい
- `trader-memory-core` の thesis record と `signal-postmortem` の所見を次回ルールへ変換したい
- 月次でプロセス、リスク、執行、行動パターンを振り返りたい
- 自分の記録済みトレードをリスクマネージャー目線でレビューしたい
- 損失がプロセス違反、執行ミス、市場環境、通常のばらつきのどれに近いか整理したい
- FOMO、revenge trade、overconfidence、hesitation、stop moving、size creep などの兆候を証拠付きで見たい

---

## 3. 前提条件

推奨される入力:

- `trader-memory-core` の closed thesis record または journal entry
- `signal-postmortem` の事後分析結果
- 元の売買計画または trade ticket
- 実際の entry / exit / partial close の記録
- ユーザー定義の risk plan
- 任意: `market-regime-daily` / `exposure-coach` の文脈

有料 API キーは不要です。決定論的なスクリプトがローカルの JSON / YAML 風レコードからレビューを生成します。

---

## 4. クイックスタート

```bash
python3 skills/trade-performance-coach/scripts/review_trade_performance.py \
  --input reports/trade_memory/closed_thesis_EXMPL.json \
  --output-dir reports/trade-performance-coach
```

---

## 5. ワークフロー

### Step 1: ソース記録を集める

直近のクローズ済みトレード、postmortem、risk plan、journal notes を集めます。

```bash
python3 skills/trade-performance-coach/scripts/review_trade_performance.py \
  --input reports/trade_memory/closed_thesis_EXMPL.json \
  --output-dir reports/trade-performance-coach
```

### Step 2: プロセス遵守を評価する

実際の行動を、事前に書いた計画やルールと比較します。

- entry 前の thesis が欠けていないか
- setup confirmation を飛ばしていないか
- market-regime gate に逆らっていないか
- 事前ルールなしに stop を動かしていないか
- exit / partial close が計画と矛盾していないか
- 記録品質が不十分でないか

### Step 3: リスク規律を評価する

実際の risk と heat を risk plan と比較します。

- 1トレードあたりのリスクが上限を超えていないか
- portfolio heat が上限を超えていないか
- 週次損失や連敗後の縮小ルールを守っているか
- 勝ち負けの直後にサイズが過大化していないか
- 相関エクスポージャーが提供されている場合、集中しすぎていないか

### Step 4: 執行品質を評価する

entry、stop、exit、add、trim、review の行動を分類します。損失そのものと執行ミスを分け、プロセスが良かった負けも明示します。

### Step 5: 行動パターン候補を検出する

journal notes と action flags から、繰り返し出ている可能性のある行動パターンをタグ付けします。タグは必ず証拠と結びつけ、診断的な表現は避けます。

対応タグ:

- `fomo_entry`
- `revenge_trade`
- `premature_exit`
- `overconfidence_after_winner`
- `stop_moved`
- `size_creep`
- `hesitation`
- `rule_drift`
- `no_pattern_detected`

### Step 6: 次回セッションの運用ルールへ変換する

所見を、一時的で具体的なガードレールに変換します。

- 次の entry 前に thesis record とスクリーンショットを必須にする
- ルール違反後の次 2 トレードは 0.5R までに制限する
- revenge trade の証拠が続く場合は review-only mode に切り替える
- 逃した entry は追いかけず、次の有効セットアップまで watchlist に戻す

### Step 7: 人間の判断ゲートで終える

すべてのレポートは human decision gate で終えます。デフォルトは `journal_only` です。

許可される action:

```text
accept_rules / modify_rules / defer / journal_only
```

---

## 6. リソース

参照資料:

- `skills/trade-performance-coach/references/behavior-tags.md`
- `skills/trade-performance-coach/references/hermes-integration.md`
- `skills/trade-performance-coach/references/output-contract.md`
- `skills/trade-performance-coach/references/review-framework.md`
- `skills/trade-performance-coach/references/risk-review-checklist.md`

スクリプト:

- `skills/trade-performance-coach/scripts/review_trade_performance.py`
