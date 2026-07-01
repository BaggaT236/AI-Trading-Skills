---
layout: default
title: "Uptrend Analyzer"
grand_parent: 日本語
parent: スキルガイド
nav_order: 43
lang_peer: /en/skills/uptrend-analyzer/
permalink: /ja/skills/uptrend-analyzer/
---

# Uptrend Analyzer
{: .no_toc }

Montyのアップトレンド比率ダッシュボードのデータを使用してマーケットブレッドスを分析し、現在の市場環境を診断するスキルです。5つのコンポーネント（ブレッドス、セクター参加率、ローテーション、モメンタム、ヒストリカルコンテキスト）から0-100の複合スコアを生成します。マーケットブレッドス、アップトレンド比率、市場環境が株式エクスポージャーを支持するかどうかの質問時に使用します。APIキー不要。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/uptrend-analyzer.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/uptrend-analyzer){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

MontyのアップトレンドダッシュボードのCSVデータを取得し、マーケットブレッドスと市場環境を診断するスキルです。5つのコンポーネントスコアと複合スコア（0-100）を計算し、エクスポージャーガイダンス（Full/Normal/Reduced/Defensive/Preservation）を提供します。

---

## 2. 使用タイミング

**英語：**
- 「Is the market breadth healthy?」「How broad is the rally?」
- セクター別アップトレンド比率の確認
- 市場参加率やブレッドス状況の診断
- ブレッドス分析に基づくエクスポージャーガイダンス
- MontyのアップトレンドダッシュボードやUptrend Ratioについての質問

**日本語：**
- 「市場のブレッドスは健全？」「上昇の裾野は広い？」
- セクター別のアップトレンド比率を確認したい
- 相場参加率・ブレッドス状況を診断したい
- ブレッドス分析に基づくエクスポージャーガイダンスが欲しい
- Montyのアップトレンドダッシュボードについて質問

---

## 3. 前提条件

- **APIキー：** 不要
- **Python 3.9+** 推奨

---

## 4. クイックスタート

```bash
python3 skills/uptrend-analyzer/scripts/uptrend_analyzer.py
```

---

## 5. ワークフロー

### Phase 1: Pythonスクリプトの実行

分析スクリプトを実行（APIキー不要）：

```bash
python3 skills/uptrend-analyzer/scripts/uptrend_analyzer.py
```

スクリプトの動作：
1. MontyのGitHubリポジトリからCSVデータをダウンロード
2. 5つのコンポーネントスコアを計算
3. 複合スコアとレポートを生成

### Phase 2: 結果の提示

生成されたMarkdownレポートをユーザーに提示。以下をハイライト：
- 複合スコアとゾーン分類
- エクスポージャーガイダンス（Full/Normal/Reduced/Defensive/Preservation）
- 最も強い/弱いセクターを示すセクターヒートマップ
- 主要なモメンタムとローテーションのシグナル

---

## 6. リソース

**リファレンス：**

- `skills/uptrend-analyzer/references/uptrend_methodology.md`

**スクリプト：**

- `skills/uptrend-analyzer/scripts/data_fetcher.py`
- `skills/uptrend-analyzer/scripts/report_generator.py`
- `skills/uptrend-analyzer/scripts/scorer.py`
- `skills/uptrend-analyzer/scripts/uptrend_analyzer.py`
