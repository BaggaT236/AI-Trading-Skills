---
layout: default
title: "Scenario Analyzer"
grand_parent: 日本語
parent: スキルガイド
nav_order: 42
lang_peer: /en/skills/scenario-analyzer/
permalink: /ja/skills/scenario-analyzer/
generated: false
---

# Scenario Analyzer
{: .no_toc }

ニュース見出しから 18か月程度の中長期シナリオを作り、一次・二次・三次影響、セクター影響、関連銘柄、反対意見を整理するスキルです。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/scenario-analyzer.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/scenario-analyzer){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

Scenario Analyzer は、単一のニュース見出しを起点に、中長期の投資シナリオを構造化します。主分析を行う `scenario-analyst` と、批判的な二次レビューを行う `strategy-reviewer` を組み合わせ、過度に一方向へ寄った結論を避けます。

出力には次を含めます。

- 18か月の base / bull / bear シナリオ
- 1st order、2nd order、3rd order impact
- 影響を受けるセクターと銘柄候補
- 確信度、主要な不確実性、反証条件
- セカンドオピニオンによる弱点レビュー

---

## 2. 使う場面

- 大きなニュースの中長期影響を整理したい
- 金利、関税、地政学、資源、規制、技術革新などの波及効果を見たい
- 関連セクターや二次受益銘柄を洗い出したい
- 1つの見方だけでなく、反対シナリオも含めたい
- 投資テーマの初期仮説を作りたい

例:

```text
/scenario-analyzer "Fed raises interest rates by 50bp, signals more hikes ahead"
/scenario-analyzer "OPEC+ agrees to cut oil production by 2 million barrels per day"
```

---

## 3. 前提条件

- API キー不要
- WebSearch / WebFetch を使える環境
- `scenario-analyst` と `strategy-reviewer` エージェントを呼び出せること
- 見出し、または分析対象イベントの短い説明

---

## 4. ワークフロー

1. 見出しから主体、地域、数値、政策・企業アクションを抽出する
2. イベント種別を分類する
3. 参照資料を読み、類似パターンやセクター感応度を確認する
4. primary analysis で 18か月シナリオを作る
5. strategy review で仮説の弱点、過剰推論、見落としを指摘する
6. 統合レポートとして Markdown にまとめる

---

## 5. 出力の読み方

| セクション | 見るポイント |
|---|---|
| Event summary | 何が起きたか、どの前提で分析したか |
| Scenario set | base / bull / bear の分岐 |
| Impact layers | 直接影響、波及影響、長期テーマ |
| Stock ideas | あくまで調査候補であり、売買推奨ではない |
| Critical review | 反証条件、弱い前提、逆方向リスク |

銘柄候補はそのまま注文に使わず、`technical-analyst`、`us-stock-analysis`、`position-sizer` などで追加確認します。

---

## 6. 注意点

- ニュースが新しい場合、事実関係の確認を優先してください。
- 18か月シナリオは仮説であり、短期売買シグナルではありません。
- 推奨銘柄は「調査候補」です。価格、バリュエーション、チャート、リスク許容度を別途確認します。
- セカンドオピニオンの指摘を必ず読み、片側のストーリーに寄りすぎないようにします。
