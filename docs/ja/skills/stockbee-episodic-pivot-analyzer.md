---
layout: default
title: "Stockbee Episodic Pivot Analyzer"
grand_parent: 日本語
parent: スキルガイド
nav_order: 49
lang_peer: /en/skills/stockbee-episodic-pivot-analyzer/
permalink: /ja/skills/stockbee-episodic-pivot-analyzer/
generated: false
---

# Stockbee Episodic Pivot Analyzer
{: .no_toc }

決算、ガイダンス引き上げ、M&A、FDA 承認、大型契約、テーマニュースなどを材料に、Stockbee 型の Day 1 Episodic Pivot 候補を評価するスキルです。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span> <span class="badge badge-optional">FMP任意</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/stockbee-episodic-pivot-analyzer.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/stockbee-episodic-pivot-analyzer){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

Episodic Pivot は、企業価値の見直しにつながるニュースと、価格・出来高の強い反応が同時に出る Day 1 セットアップです。このスキルは、材料の質、ギャップ、レンジ拡大、出来高ショック、終値位置、流動性、EP day low までのリスクを合わせて候補を分類します。

分類例:

- `ACTIONABLE_DAY1`
- `DAY1_WATCH`
- `DELAYED_EP_WATCH`
- `CATALYST_WATCH`
- `REJECT`

---

## 2. 使う場面

- Stockbee / Pradeep Bonde 型の EP 候補を評価したい
- 決算やガイダンス引き上げ後の Day 1 反応を整理したい
- ニュースは強いが追いかけるべきか、pullback 待ちかを分けたい
- `pead-screener` へ渡す earnings/guidance EP を選びたい
- `stockbee-momentum-burst-screener` の価格・出来高情報を材料評価に重ねたい

---

## 3. 前提条件

入力は次のいずれかです。

- catalyst/events JSON
- `earnings-trade-analyzer` の JSON
- catalyst JSON + `stockbee-momentum-burst-screener` の JSON
- 任意で日足 OHLCV JSON
- 任意で FMP API キー

このスキルはニュースを自動発見しません。材料の事実確認は別途行ってください。

---

## 4. クイックスタート

```bash
python3 skills/stockbee-episodic-pivot-analyzer/scripts/analyze_ep.py \
  --events-json data/catalysts.json \
  --prices-json data/daily_ohlcv.json \
  --output-dir reports/
```

FMP enrichment を使う場合:

```bash
export FMP_API_KEY=your_key
python3 skills/stockbee-episodic-pivot-analyzer/scripts/analyze_ep.py \
  --events-json data/catalysts.json \
  --max-api-calls 200 \
  --output-dir reports/
```

---

## 5. 評価観点

| 観点 | 見る内容 |
|---|---|
| catalyst quality | 決算、ガイダンス、FDA、M&A など本質的な再評価材料か |
| price confirmation | ギャップ、当日上昇率、レンジ拡大 |
| volume shock | 通常出来高に対して十分な増加があるか |
| close location | 高値近くで引けたか |
| risk to EP low | EP day low を stop にした場合の距離 |
| liquidity | 売買可能な流動性があるか |

---

## 6. 出力の使い方

- `ACTIONABLE_DAY1`: すぐ売買するのではなく、`technical-analyst` と `position-sizer` で確認します。
- `DAY1_WATCH`: 翌日以降の継続確認候補です。
- `DELAYED_EP_WATCH`: Day 1 は追わず、pullback や新しいレンジ形成を待ちます。
- `CATALYST_WATCH`: 材料はあるが価格・出来高確認が弱い状態です。
- `REJECT`: この情報源からは取引対象にしません。

---

## 7. 注意点

- analyst-only や story-only の EP は、価格・出来高確認が特に重要です。
- EP day low までの距離が広すぎる場合は、Day 1 で追わず delayed watch に回します。
- 材料の真偽やニュースの重要度は人間が確認してください。
- 出力は候補品質の分析であり、売買推奨ではありません。
