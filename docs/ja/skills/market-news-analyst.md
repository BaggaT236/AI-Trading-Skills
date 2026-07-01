---
layout: default
title: Market News Analyst
grand_parent: 日本語
parent: スキルガイド
nav_order: 9
lang_peer: /en/skills/market-news-analyst/
permalink: /ja/skills/market-news-analyst/
---

# Market News Analyst
{: .no_toc }

過去10日間のマーケットニュースを自動収集し、インパクトスコアでランク付けした分析レポートを生成するスキルです。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/market-news-analyst.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/market-news-analyst){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

Market News Analystは、過去10日間のマーケットムービングイベントをWebSearch/WebFetchで自動収集し、独自のインパクトスコアリングで重要度をランク付けした英語レポートを生成するスキルです。

**主な特徴:**
- WebSearch/WebFetchによる自動ニュース収集（6カテゴリ並行検索）
- 3次元インパクトスコア: Price Impact x Breadth x Forward-Looking Significance
- マルチアセット反応分析（株式、債券、コモディティ、通貨、デリバティブ）
- 信頼性4階層のニュースソース評価フレームワーク
- 地政学イベントとコモディティの相関分析

**解決する問題:**
- 過去10日間の膨大なニュースから真に市場を動かしたイベントだけを特定します
- 各イベントの市場インパクトを定量的に評価し、主観に頼らない重要度判定を提供します
- マルチアセット間の連鎖反応を体系的に追跡し、因果関係と相関を区別します

---

## 2. 前提条件

| 項目 | 要否 | 説明 |
|------|------|------|
| APIキー | 不要 | WebSearch/WebFetchでデータ収集するため外部APIは不要 |
| Python | 不要 | スクリプトなし（WebSearchベースの対話型スキル） |
| WebSearch | 必須 | Claude CodeまたはWeb版でWebSearch/WebFetch機能が利用可能であること |

> 出力レポートは英語で生成されます。これはグローバル市場の分析精度を保つための仕様です。プロンプトは日本語でも英語でも指示できます。
{: .tip }

---

## 3. クイックスタート

Claudeに以下のように指示するだけで使えます：

```
過去10日間のマーケットニュースを分析して
```

Claudeが以下の流れで処理します：
1. 6カテゴリのWebSearch並行実行（金融政策、経済指標、メガキャップ決算、地政学、コモディティ、コーポレート）
2. 参照ファイル読み込み（市場イベントパターン、ソース信頼性ガイド等）
3. インパクトスコアで各イベントをランク付け
4. マルチアセット反応を分析
5. 構造化レポートを生成

**特定トピックに焦点を当てる場合：**

```
直近のFOMC決定と市場の反応を詳しく分析してください
```

---

## 4. 仕組み

### 6ステップ分析ワークフロー

```
ニュース収集 → ナレッジベース参照 → インパクト評価 → 市場反応分析 → 相関分析 → レポート生成
```

**Step 1: ニュース収集（WebSearch並行検索）**

6カテゴリで並行して検索を実行します：

| カテゴリ | 検索キーワード例 | 対象 |
|---------|----------------|------|
| 金融政策 | FOMC, Federal Reserve, ECB, BOJ | 中央銀行の決定、フォワードガイダンス |
| 経済指標 | CPI, NFP, GDP, PPI | 主要経済データのリリースとサプライズ |
| メガキャップ決算 | Apple earnings, NVIDIA earnings | Magnificent 7を中心とした決算結果 |
| 地政学 | Middle East conflict, trade war, tariffs | 紛争、制裁、貿易摩擦 |
| コモディティ | oil prices, gold, OPEC | 供給ショック、需要変動 |
| コーポレート | M&A, bankruptcy, credit rating | メガキャップ以外の重要企業イベント |

**Step 2: ナレッジベース参照**

収集ニュースのタイプに応じて参照ファイルを条件的に読み込みます：
- 金融政策ニュース → `market_event_patterns.md`（中央銀行セクション）
- 地政学ニュース → `geopolitical_commodity_correlations.md`
- メガキャップ決算 → `corporate_news_impact.md`
- 全タイプ共通 → `trusted_news_sources.md`

**Step 3: インパクトスコア計算**

各イベントを3次元で評価し、スコアを算出します：

```
Impact Score = (Price Impact Score x Breadth Multiplier) x Forward-Looking Modifier
```

| 次元 | 評価基準 | スコア/乗数 |
|------|---------|-----------|
| Price Impact | Severe(±2%+指数) | 10点 |
| | Major(±1-2%) | 7点 |
| | Moderate(±0.5-1%) | 4点 |
| | Minor(±0.2-0.5%) | 2点 |
| Breadth | Systemic（全アセットクラス） | 3x |
| | Cross-Asset（2アセット以上） | 2x |
| | Sector-Wide（セクター全体） | 1.5x |
| | Stock-Specific（個別銘柄） | 1x |
| Forward | Regime Change（構造転換） | +50% |
| | Trend Confirmation（トレンド確認） | +25% |
| | Isolated（単発） | 0% |
| | Contrary Signal（逆シグナル） | -25% |

**Step 4-5: 市場反応分析 & 相関分析**
- イベントごとにEquities、Bonds、Commodities、Currencies、VIXの反応を追跡
- 過去パターンとの比較（Consistent/Amplified/Dampened/Inverse）
- 複数イベント間の相互作用（Reinforcing/Offsetting/Sequential）を評価

**Step 6: レポート生成**
- インパクトスコア降順でランク付けされた構造化レポートを出力
- ファイル名: `market_news_analysis_YYYY-MM-DD_to_YYYY-MM-DD.md`

---

## 5. 使用例

### 例1: 過去10日のマーケットニュース分析（デフォルト）

**プロンプト:**
```
過去10日間の主要なマーケットニュースを分析して、インパクト順にランク付けしてください
```

**Claudeの動作:**
- 6カテゴリの並行WebSearch実行
- 全イベントのインパクトスコアを算出
- ランキングテーブル + 各イベントの詳細分析を生成
- Thematic Synthesis（支配的なマーケットナラティブ）を導出

**なぜ有用か:** 週次のマーケットレビューとして、ノイズを除去した「真に重要なイベント」だけを効率的に把握できます。

---

### 例2: FOMC決定分析

**プロンプト:**
```
直近のFOMC決定を詳しく分析してください。利上げ/据え置きの決定内容、
ドットプロットの変化、市場の反応を含めて。
```

**Claudeの動作:**
- FederalReserve.gov等からFOMCステートメントの内容を収集
- 金利決定、ドットプロット、パウエル議長の記者会見の要点を整理
- 株式、債券（2Y/10Y利回り）、ドル指数、ゴールドへの即時反応を分析
- 過去のFOMC反応パターンと比較（Amplified/Dampened/Inverse等）

**なぜ有用か:** FOMC決定の全貌と市場への波及効果を一つのレポートで把握できます。フォワードガイダンスの変化が次回会合への期待にどう影響するかも分析します。

---

### 例3: 決算シーズンカバレッジ（メガキャップ）

**プロンプト:**
```
直近の決算シーズンでMagnificent 7の決算結果と市場反応をまとめてください
```

**Claudeの動作:**
- AAPL、MSFT、GOOGL、AMZN、META、NVDA、TSLAの決算結果を収集
- 各社のEPS Beat/Miss、ガイダンス変更、主要KPIを整理
- 個別株反応 + セクター波及（セミコンダクター、クラウド等）を分析
- `corporate_news_impact.md` のMagnificent 7セクションを参照して歴史的パターンと比較

**なぜ有用か:** メガキャップ決算の結果をコンパクトにまとめ、セクター全体へのコンテイジョン効果を可視化します。

---

### 例4: 地政学的イベントのインパクト分析

**プロンプト:**
```
中東情勢の最新動向と原油・金への影響を分析してください
```

**Claudeの動作:**
- 中東関連の地政学ニュースをWebSearchで収集
- `geopolitical_commodity_correlations.md` のEnergy CommoditiesとPrecious Metalsセクションを参照
- 原油（WTI/Brent）、金、天然ガスの価格変動を追跡
- 供給途絶リスクの評価（実際の供給影響 vs 恐怖プレミアム）
- 過去の類似事例との比較（一時的スパイク vs 持続的上昇）

**なぜ有用か:** 地政学リスクとコモディティ価格の因果関係を、歴史的パターンと照合しながら体系的に評価できます。

---

### 例5: 経済指標分析（CPI、NFP）

**プロンプト:**
```
直近のCPIとNFPの結果を分析して、市場への影響とFed政策への示唆を教えて
```

**Claudeの動作:**
- BLS等の公式ソースからCPIとNFPのデータを収集
- コンセンサス予想との乖離（サプライズファクター）を計算
- 債券市場（利回り曲線）、株式市場、ドル指数への反応を分析
- Fed政策への示唆（利下げ/据え置き確率の変化）を評価
- `market_event_patterns.md` のInflation/Employmentセクションで過去パターンと比較

**なぜ有用か:** 経済指標の「数字そのもの」ではなく「サプライズの程度」と「市場反応」に焦点を当て、次のFed決定への示唆を導き出します。

---

### 例6: コモディティ相関分析

**プロンプト:**
```
原油、金、銅の直近10日間の動きを分析して、マクロ環境との相関を教えて
```

**Claudeの動作:**
- 3コモディティの価格変動と主要ドライバーを収集
- 原油: OPEC動向、地政学リスク、在庫データ
- 金: リスクオフ/オンフロー、実質金利、ドル強弱
- 銅: 中国経済指標、グローバル製造業PMI、需要シグナル
- `geopolitical_commodity_correlations.md` の各セクションを参照
- クロスアセット相関（ドル高→金安→銅安の連鎖等）を分析

**なぜ有用か:** コモディティ市場をマクロ経済の「体温計」として活用し、リスクオン/オフの判定材料を提供します。

---

### 例7: 市場レジーム検出（リスクオン/オフ）

**プロンプト:**
```
直近10日間の市場データから、現在のマーケットレジーム（リスクオン/オフ）を判定してください
```

**Claudeの動作:**
- セクターパフォーマンス（グロース vs バリュー、シクリカル vs ディフェンシブ）を収集
- VIX水準と変化、Put/Call比率を確認
- セーフヘイブン（国債、金、円、スイスフラン）のフローを分析
- クレジットスプレッド（IG、HY）の変動を確認
- 複数のシグナルを統合してレジームを判定

**なぜ有用か:** 個別イベントではなく市場全体の「空気」を定量的に把握し、ポートフォリオのポジショニング調整に活用できます。

---

## 6. 出力の読み方

### レポート構造

出力レポートは以下の主要セクションで構成されます：

| セクション | 内容 | 注目ポイント |
|-----------|------|-------------|
| Executive Summary | 期間、イベント数、支配的テーマ | 最初に読んで全体像を把握 |
| Market Impact Rankings | インパクトスコア順のランキングテーブル | スコアの絶対値と相対的な差に注目 |
| Detailed Event Analysis | 各イベントの詳細（反応、パターン比較） | Pattern Comparison（Expected vs Actual）が重要 |
| Thematic Synthesis | 支配的ナラティブ、レジーム判定 | ポジショニングへの示唆 |
| Commodity Deep Dive | コモディティ個別分析 | 地政学リスクプレミアムの評価 |
| Forward-Looking Implications | リスクシナリオ、今後のカタリスト | 来週のポジション管理に直結 |

### インパクトスコアの目安

| スコア範囲 | 重要度 | 例 |
|-----------|--------|-----|
| 30+ | 極めて重大（レジーム変化級） | FOMCサプライズ、金融危機 |
| 15-30 | 重大（マルチアセット影響） | メガキャップ決算、地政学ショック |
| 7-15 | 中程度（セクター影響） | セクター決算クラスター、コモディティイベント |
| <7 | 限定的（個別銘柄） | 非メガキャップの個別イベント |

### Pattern Comparison の読み方

| 判定 | 意味 | トレード示唆 |
|------|------|-------------|
| Consistent | 過去パターン通りの反応 | 通常のフォロースルーを期待 |
| Amplified | 過去パターンより過大な反応 | ポジショニングの偏り、センチメント極端を示唆 |
| Dampened | 過去パターンより抑制された反応 | 「織り込み済み」の可能性 |
| Inverse | 過去パターンと逆の反応 | 市場レジーム変化のシグナル（要注意） |

---

## 7. Tips & ベストプラクティス

### 効果的な使い方

- **週次ルーティンとして活用:** 毎週末に「過去10日の分析」を依頼し、来週の注目ポイントを把握
- **特定イベント前の予習:** 「来週のFOMCに向けて、直近の経済指標をまとめて」のように事前準備
- **レジーム判定からのアクション:** リスクオン/オフの判定結果をポートフォリオの防御的/攻撃的スタンスに反映

### 分析品質を高めるコツ

- **時期を具体的に指定:** 「3月15日から3月25日の間」のように期間を明示すると精度が上がる
- **フォーカスを絞る:** 「金融政策とコモディティに焦点を当てて」と指定すると、該当領域がより深く分析される
- **公式ソースへの誘導:** 「FederalReserve.govのFOMCステートメントを確認して」のように信頼性の高いソースを指定

---

## 8. 他スキルとの連携

### Market News Analyst → Sector Analyst

ニュース分析でセクターローテーションを検出したら、チャートで確認：

```
1. Market News Analyst: セクターパフォーマンスの偏りを検出
2. Sector Analyst: セクターチャート画像でローテーションパターンを視覚確認
3. 判断: ローテーション先のセクターへのエクスポージャー調整
```

### Market News Analyst → Breadth Chart Analyst

市場全体の健全性をニュースとブレッドスの両面から評価：

```
1. Market News Analyst: リスクオン/オフのレジーム判定
2. Breadth Chart Analyst: A/D Line、新高値/新安値比率で市場参加度を確認
3. 統合判断: ニュースのポジティブ + ブレッドス悪化 = 警戒シグナル
```

### Market News Analyst → Economic Calendar Fetcher

過去のイベント分析と今後のイベント予定を統合：

```
1. Market News Analyst: 直近のCPI結果と市場反応を分析
2. Economic Calendar Fetcher: 来週の経済指標スケジュールを取得
3. 戦略: CPI結果を踏まえた次回FOMC期待と、今後のデータポイントのウォッチ
```

---

## 9. トラブルシューティング

### ニュースが十分に収集されない

**原因:** WebSearchの結果がペイウォール記事ばかりで詳細が取得できない場合がある

**対処:**
- 「CNBC、MarketWatch、Reutersのフリーコンテンツを優先して検索して」と指示
- 公式ソース（FederalReserve.gov、BLS.gov等）への直接アクセスを指示

### インパクトスコアが直感と異なる

**原因:** 3次元評価の乗数効果により、Breadthの高いイベントがスコア上位になりやすい

**対処:**
- スコアの内訳（Price Impact、Breadth、Forward）を確認して評価の妥当性を検証
- 特定のイベントに焦点を当てた再分析を依頼

### 分析期間が10日に限定される

**原因:** スキルのデフォルト設計が過去10日間

**対処:**
- 「過去30日間のマーケットニュースを分析して」と期間を明示的に変更
- ただし期間が長いほどWebSearchの精度が低下する可能性がある

### レポートが英語で出力される

**原因:** グローバル市場分析の精度を保つため、出力は英語が仕様

**対処:**
- 英語レポートのまま活用するのが推奨（金融用語の誤訳を防止）
- 「日本語で要約してください」と追加プロンプトで日本語サマリーを別途生成

---

## 10. リファレンス

### ニュースソース信頼性階層

| 階層 | ソース例 | 用途 |
|------|---------|------|
| Tier 1（公式） | FederalReserve.gov, SEC.gov, BLS.gov | 事実、データ、公式政策 |
| Tier 2（大手金融） | Bloomberg, Reuters, WSJ, FT, CNBC | 速報、幅広いカバレッジ |
| Tier 3（専門） | S&P Global Platts, The Information, Caixin | ドメイン特化の深掘り |
| Tier 4（分析） | BCA Research, Brookings, CFR | 解釈、コンテキスト |

### 参照ファイル一覧

| ファイル | 説明 |
|----------|------|
| `skills/market-news-analyst/SKILL.md` | スキル定義（6ステップワークフロー） |
| `skills/market-news-analyst/references/market_event_patterns.md` | 市場イベントの歴史的反応パターン（中央銀行、インフレ、雇用、決算、地政学等） |
| `skills/market-news-analyst/references/trusted_news_sources.md` | ニュースソースの信頼性評価と検索戦略 |
| `skills/market-news-analyst/references/geopolitical_commodity_correlations.md` | 地政学イベントとコモディティ価格の相関フレームワーク |
| `skills/market-news-analyst/references/corporate_news_impact.md` | メガキャップ企業ニュースのインパクト分析フレームワーク |
