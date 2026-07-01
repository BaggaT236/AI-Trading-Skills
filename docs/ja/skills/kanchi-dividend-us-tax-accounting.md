---
layout: default
title: "Kanchi Dividend US Tax Accounting"
grand_parent: 日本語
parent: スキルガイド
nav_order: 28
lang_peer: /en/skills/kanchi-dividend-us-tax-accounting/
permalink: /ja/skills/kanchi-dividend-us-tax-accounting/
---

# Kanchi Dividend US Tax Accounting
{: .no_toc }

かんち式インカムポートフォリオ向けの米国配当税務および口座配置ワークフローを提供します。適格配当 vs 普通配当、1099-DIVの解釈、REIT/BDCの分配金処理、保有期間チェック、または配当資産の課税口座 vs IRA口座配置判断について聞かれた際に使用します。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/kanchi-dividend-us-tax-accounting.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/kanchi-dividend-us-tax-accounting){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

配当投資家向けの実用的な米国税務ワークフローを適用し、判断を監査可能に保ちます。
法的/税務アドバイスの代替ではなく、口座配置と分類に焦点を当てます。

---

## 2. 使用タイミング

以下が必要な場合にこのスキルを使用します:
- 米国配当税分類プランニング（適格 vs 普通の想定）。
- 年末タックスプランニング前の保有期間チェック。
- 株式/REIT/BDC/MLPインカム保有の口座配置判断。
- 標準化された年次配当税務メモフォーマット。

---

## 3. 前提条件

保有銘柄レベルの入力を準備:
- `ticker`
- `instrument_type`
- `account_type`
- `hold_days_in_window`（利用可能な場合）

確定的な出力アーティファクトには、JSON入力を提供して以下を実行:

```bash
python3 skills/kanchi-dividend-us-tax-accounting/scripts/build_tax_planning_sheet.py \
  --input /path/to/tax_input.json \
  --output-dir reports/
```

---

## 4. クイックスタート

### 1) 各分配ストリームの分類

各保有銘柄について、想定されるキャッシュフローを以下に分類:
- 適格配当の可能性。
- 普通配当/非適格分配。
- 該当する場合、REIT/BDC固有の分配金コンポーネント。

---

## 5. ワークフロー

### 1) 各分配ストリームの分類

各保有銘柄について、想定されるキャッシュフローを以下に分類:
- 適格配当の可能性。
- 普通配当/非適格分配。
- 該当する場合、REIT/BDC固有の分配金コンポーネント。

保有期間と分類チェックには `references/qualified-dividend-checklist.md` を使用。

### 2) 保有期間適格性の想定を検証

適格扱いの可能性がある場合:
- 権利落ち日ウィンドウを確認。
- 測定ウィンドウ内の必要最低保有日数を確認。
- 保有期間要件を満たさないリスクがあるポジションをフラグ。

データが不完全な場合、ステータスを `ASSUMPTION-REQUIRED` とマーク。

### 3) 報告フィールドへのマッピング

プランニングの想定を予想される税務フォームのバケットにマッピング:
- 普通配当合計。
- 適格配当サブセット。
- 個別に報告される場合のREIT関連コンポーネント。

フォームの用語を一貫して使用し、年末の照合が容易になるようにする。

### 4) 口座配置推奨の構築

`references/account-location-matrix.md` を使用して
税務プロファイル別に資産を配置:
- 適格配当が中心の保有は課税口座。
- 普通所得型の分配が多い保有は税制優遇口座。

制約が矛盾する場合（流動性、戦略、集中度）、トレードオフを明示的に説明。

### 5) 年次プランニングメモの作成

`references/annual-tax-memo-template.md` を使用し、以下を含める:
- 使用した想定事項。
- 分配金分類サマリー。
- 実行した配置アクション。
- CPA/税務アドバイザーレビュー向けの未解決事項。

---

## 6. リソース

**リファレンス:**

- `skills/kanchi-dividend-us-tax-accounting/references/account-location-matrix.md`
- `skills/kanchi-dividend-us-tax-accounting/references/annual-tax-memo-template.md`
- `skills/kanchi-dividend-us-tax-accounting/references/qualified-dividend-checklist.md`

**スクリプト:**

- `skills/kanchi-dividend-us-tax-accounting/scripts/build_tax_planning_sheet.py`
