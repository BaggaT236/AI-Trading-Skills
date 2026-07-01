---
layout: default
title: "Stockbee Setup Fluency Trainer"
grand_parent: 日本語
parent: スキルガイド
nav_order: 51
lang_peer: /en/skills/stockbee-setup-fluency-trainer/
permalink: /ja/skills/stockbee-setup-fluency-trainer/
generated: false
---

# Stockbee Setup Fluency Trainer
{: .no_toc }

Momentum Burst スクリーナーの候補から Stockbee スタイルのモデルブックを作り、3日後・5日後の MFE / MAE、ストップ到達、結果タグ、コホート統計を更新する学習用スキルです。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span> <span class="badge badge-optional">FMP任意</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/stockbee-setup-fluency-trainer.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/stockbee-setup-fluency-trainer){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

Stockbee Setup Fluency Trainer は、Momentum Burst 候補を「売買するかどうか」ではなく「セットアップ認識を上達させる教材」として蓄積するためのスキルです。

主な役割:

- `stockbee-momentum-burst-screener` の JSON からモデルブックを作成
- 候補ごとに 3日後・5日後のリターン、MFE、MAE、ストップ到達を記録
- `STRONG_WINNER`、`WORKED`、`FAILED_STOP`、`FAILED_FADE`、`CHOPPY_FAILURE`、`NEUTRAL` などの結果タグを付与
- rating、primary_trigger、setup_tags などでコホート集計
- どのタグを昇格、降格、除外候補にするかを検討する材料を作る

これは即時の売買シグナルを作るスキルではありません。サンプル数が増えるまで、出力は学習とルール改善の証拠として扱います。

---

## 2. 使う場面

- Stockbee Momentum Burst の成功例・失敗例を体系的に学びたい
- スクリーナー出力をモデルブックに変換したい
- 見逃した候補、失敗候補、A / B セットアップの違いを復習したい
- 3日後・5日後の成績、MFE、MAE、ストップ到達率を確認したい
- ポジションサイズを上げる前にセットアップ認識の精度を上げたい
- どのタグを重視し、どのタグをフィルターすべきかを検討したい

---

## 3. 前提条件

- Python 3.10+
- `stockbee-momentum-burst-screener` の JSON レポート、または互換形式の候補 JSON
- 任意: FMP API キー。ローカル OHLCV JSON を使わずに outcome update を行う場合に必要
- 推奨 state パス: `state/stockbee/model_book.jsonl`

API なしでも、ローカルの OHLCV JSON を渡せば outcome update まで実行できます。

---

## 4. クイックスタート

```bash
python3 skills/stockbee-setup-fluency-trainer/scripts/build_model_book.py ingest \
  --screener-json reports/stockbee_momentum_burst_YYYY-MM-DD_HHMMSS.json \
  --model-book state/stockbee/model_book.jsonl \
  --output-dir reports/
```

---

## 5. ワークフロー

### Step 1: Momentum Burst 候補を取り込む

Momentum Burst screener の JSON レポートを使ってモデルブックへ追加します。

```bash
python3 skills/stockbee-setup-fluency-trainer/scripts/build_model_book.py ingest \
  --screener-json reports/stockbee_momentum_burst_YYYY-MM-DD_HHMMSS.json \
  --model-book state/stockbee/model_book.jsonl \
  --output-dir reports/
```

通常は rejected 候補を除外します。失敗例セットを意図的に作る場合だけ `--include-rejects` を使います。`date` など学習に必要な最低限の情報がない skeleton reject はモデルブック記録ではなく skip 件数として扱います。

### Step 2: 3日後・5日後の outcome を更新する

FMP を使う場合:

```bash
python3 skills/stockbee-setup-fluency-trainer/scripts/build_model_book.py update \
  --model-book state/stockbee/model_book.jsonl \
  --horizons 3,5 \
  --output-dir reports/
```

ローカル OHLCV JSON を使う場合:

```bash
python3 skills/stockbee-setup-fluency-trainer/scripts/build_model_book.py update \
  --model-book state/stockbee/model_book.jsonl \
  --prices-json data/daily_ohlcv.json \
  --horizons 3,5 \
  --output-dir reports/
```

更新ステップでは、各 horizon について forward close return、MFE、MAE、stop-hit status、最初の stop-hit date、outcome tag を記録します。

### Step 3: コホートを集計する

```bash
python3 skills/stockbee-setup-fluency-trainer/scripts/build_model_book.py summarize \
  --model-book state/stockbee/model_book.jsonl \
  --group-by rating,primary_trigger,setup_tags \
  --min-sample 5 \
  --output-dir reports/
```

生成される Markdown / JSON を確認します。`rule_candidates` は自動ルール変更ではなく、手動レビューのための証拠候補として扱います。

### Step 4: 学習内容を運用へ戻す

十分なサンプルがあるコホートでは、次を確認します。

- 勝率、5日期待値、平均 MAE が良いタグを昇格候補にする
- 期待値が弱い、stop hit が多い、fade failure が多いタグを降格・除外候補にする
- 代表チャートを手動確認してからルールを変更する
- 採用した学びを `trader-memory-core` や月次レビューに記録する

---

## 6. リソース

参照資料:

- `skills/stockbee-setup-fluency-trainer/references/model_book_schema.md`
- `skills/stockbee-setup-fluency-trainer/references/outcome_tags.md`
- `skills/stockbee-setup-fluency-trainer/references/review_workflow.md`

スクリプト:

- `skills/stockbee-setup-fluency-trainer/scripts/build_model_book.py`
