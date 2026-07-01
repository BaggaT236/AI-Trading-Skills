---
layout: default
title: "FTD Detector"
grand_parent: 日本語
parent: スキルガイド
nav_order: 24
lang_peer: /en/skills/ftd-detector/
permalink: /ja/skills/ftd-detector/
---

# FTD Detector
{: .no_toc }

William O'Neilの手法に基づくフォロースルーデー（FTD）シグナル検出スキル。S&P 500とNASDAQ/QQQのデュアルインデックス追跡により、ラリーアテンプト、FTD判定、FTD後の健全性モニタリングをステートマシンで実行します。Market Top Detector（防御的）と対になる、攻撃的（底打ち確認）スキルです。
{: .fs-6 .fw-300 }

<span class="badge badge-api">FMP必須</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/ftd-detector.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/ftd-detector){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

FTD Detectorは、市場の調整局面からの底打ちシグナルを検出するスキルです。O'Neilのフォロースルーデー手法をステートマシンとして実装し、S&P 500とNASDAQ/QQQの2指数を同時追跡します。

```
NO_SIGNAL → CORRECTION → RALLY_ATTEMPT → FTD_WINDOW → FTD_CONFIRMED
                 ↑              ↓               ↓            ↓
                 └── RALLY_FAILED ←─────────────┘    FTD_INVALIDATED
```

**解決する課題:**
- 調整後の買い戻しタイミングの客観的判断
- 感覚ではなくルールベースの底打ち確認
- FTD後の健全性モニタリング（ディストリビューションデー、パワートレンド）
- 品質スコア（0-100）によるエクスポージャーガイダンス

**主要機能:**
- デュアルインデックス追跡（片方のFTDでもシグナル発動、両方ならより強い確認）
- 6ステータスのステートマシン（前進限定 + 無効化経路）
- FTD品質スコア（ベーススコア + ゲインボーナス + 出来高 + デュアル確認 + FTD後健全性）
- FTD無効化検知（FTDデーの安値割れ）
- ポストFTDディストリビューションデーカウント
- パワートレンド検出（21EMA > 50SMA、価格 > 21EMA）

---

## 2. 使用タイミング

- 「底打ちした？」「買い戻して良い？」と判断したいとき
- 調整局面（3%以上の下落）からの**エントリータイミング**を知りたいとき
- **フォロースルーデー**やラリーアテンプトの状態を確認したいとき
- 直近の反発が**持続可能か評価**したいとき
- 調整後の**エクスポージャー拡大**の判断材料が欲しいとき
- Market Top Detectorが高リスク表示 → その後の底打ちシグナルを確認したいとき

**トリガーフレーズ:** 「底打ちシグナル」「フォロースルーデー」「ラリーアテンプト」「買い増しタイミング」「エクスポージャー拡大」「FTD確認」

---

## 3. 前提条件

- **FMP API キー:** 必須。環境変数 `FMP_API_KEY` を設定するか、`--api-key` フラグで渡してください
- **Python 3.9+:** `requests` ライブラリが必要（プロジェクト依存に含まれます）
- **API使用量:** 1回の実行で約4コール（FMP無料枠 250コール/日の範囲内）

> FMP APIキーはS&P 500/QQQの価格データとクォート取得に使用されます。無料枠で十分対応できます。
{: .api_required }

---

## 4. クイックスタート

```bash
# 基本実行
python3 skills/ftd-detector/scripts/ftd_detector.py --api-key $FMP_API_KEY

# 出力先を指定
python3 skills/ftd-detector/scripts/ftd_detector.py \
  --api-key $FMP_API_KEY --output-dir reports/
```

---

## 5. ワークフロー

### Phase 1: スクリプト実行

FTD Detectorスクリプトを実行します:

```bash
python3 skills/ftd-detector/scripts/ftd_detector.py --api-key $FMP_API_KEY
```

スクリプトの処理内容:
1. FMP APIからS&P 500とQQQの過去60営業日分のデータを取得
2. 両指数の現在クォートを取得
3. デュアルインデックスのステートマシンを実行（調整 → ラリー → FTD検出）
4. FTD後の健全性評価（ディストリビューションデー、無効化チェック、パワートレンド）
5. 品質スコア（0-100）を算出
6. JSONとMarkdownレポートを生成

### Phase 2: 結果の確認

生成されたMarkdownレポートの主要ポイント:

| 項目 | 内容 |
|------|------|
| **現在の市場状態** | CORRECTION / RALLY_ATTEMPT / FTD_WINDOW / FTD_CONFIRMED / FTD_INVALIDATED |
| **品質スコア** | 0-100（ベース + ゲイン + 出来高 + デュアル確認 + FTD後健全性） |
| **シグナル強度** | Strong FTD / Moderate FTD / Weak FTD / Failed |
| **推奨エクスポージャー** | 0-25% / 25-50% / 50-75% / 75-100% |
| **キーウォッチレベル** | スイングロー、FTDデーの安値（無効化判定基準） |
| **FTD後の健全性** | ディストリビューションデー数、パワートレンド有無 |

### Phase 3: 状態別ガイダンス

**FTD確認済み（スコア60+）の場合:**
- 適切なベースを形成しているリーダー株に注目
- CANSLIMスクリーナーで候補銘柄を検索
- ポジションサイズとストップの設定を忘れずに

**ラリーアテンプト中（Day 1-3）の場合:**
- FTD前に買いを入れないこと
- ウォッチリストの構築に集中

**調整なし / NO_SIGNALの場合:**
- FTD分析は上昇トレンド中は適用外
- Market Top Detectorで防御シグナルを確認

---

## 6. リソース

**リファレンス:**
- `skills/ftd-detector/references/ftd_methodology.md` -- FTD手法の詳細（O'Neilルール）
- `skills/ftd-detector/references/post_ftd_guide.md` -- FTD後の健全性評価ガイド

**スクリプト:**
- `skills/ftd-detector/scripts/ftd_detector.py` -- メインCLIエントリーポイント
- `skills/ftd-detector/scripts/rally_tracker.py` -- ステートマシン（スイングロー検出、ラリー追跡、FTD判定）
- `skills/ftd-detector/scripts/post_ftd_monitor.py` -- FTD後の健全性評価、品質スコア算出
- `skills/ftd-detector/scripts/report_generator.py` -- Markdown/JSONレポート生成
- `skills/ftd-detector/scripts/fmp_client.py` -- FMP APIクライアント（レート制限、キャッシュ付き）
