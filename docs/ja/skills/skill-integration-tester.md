---
layout: default
title: "Skill Integration Tester"
grand_parent: 日本語
parent: スキルガイド
nav_order: 11
lang_peer: /en/skills/skill-integration-tester/
permalink: /ja/skills/skill-integration-tester/
---

# Skill Integration Tester
{: .no_toc }

CLAUDE.mdに定義されたマルチスキルワークフローを検証するスキルです。スキルの存在確認、スキル間データコントラクト（JSONスキーマ互換性）、ファイル命名規則、ハンドオフの整合性をチェックします。新しいワークフローの追加、スキル出力の変更、リリース前のパイプライン健全性の確認時に使用します。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/skill-integration-tester.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/skill-integration-tester){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

CLAUDE.mdに定義されたマルチスキルワークフロー（Daily Market Monitoring、Weekly Strategy Review、Earnings Momentum Tradingなど）を、各ステップを順次実行して検証します。ステップN出力とステップN+1入力間のJSONスキーマ互換性をチェックし、ファイル命名規則を検証し、壊れたハンドオフを報告します。合成フィクスチャを使用したドライランモードに対応しています。

---

## 2. 使用タイミング

- CLAUDE.mdにマルチスキルワークフローを追加・変更した後
- スキルの出力フォーマット（JSONスキーマ、ファイル命名）を変更した後
- 新しいスキルをリリースする前のパイプライン互換性確認
- 連続するワークフローステップ間の壊れたハンドオフのデバッグ時
- スキルスクリプトに変更を加えるPRのCIプリチェックとして

---

## 3. 前提条件

- Python 3.9+
- APIキー不要
- サードパーティPythonパッケージ不要（標準ライブラリのみ使用）

---

## 4. クイックスタート

```bash
python3 skills/skill-integration-tester/scripts/validate_workflows.py \
  --output-dir reports/
```

---

## 5. ワークフロー

### ステップ1: 統合バリデーションの実行

プロジェクトのCLAUDE.mdに対してバリデーションスクリプトを実行：

```bash
python3 skills/skill-integration-tester/scripts/validate_workflows.py \
  --output-dir reports/
```

Multi-Skill Workflowsセクションのすべての `**Workflow Name:**` ブロックをパースし、各ステップの表示名をスキルディレクトリに解決して、存在確認・コントラクト・命名規則を検証します。

### ステップ2: 特定のワークフローを検証

名前の部分一致で単一のワークフローを対象に指定：

```bash
python3 skills/skill-integration-tester/scripts/validate_workflows.py \
  --workflow "Earnings Momentum" \
  --output-dir reports/
```

### ステップ3: 合成フィクスチャによるドライラン

各スキルの期待される出力に対する合成フィクスチャJSONファイルを作成し、実データなしでコントラクト互換性を検証：

```bash
python3 skills/skill-integration-tester/scripts/validate_workflows.py \
  --dry-run \
  --output-dir reports/
```

フィクスチャファイルは `reports/fixtures/` に `_fixture` フラグ付きで書き込まれます。

### ステップ4: 結果の確認

人間が読みやすいサマリーとして生成されたMarkdownレポートを確認するか、プログラム的な処理にはJSONレポートをパース。各ワークフローについて以下を表示：
- ステップごとのスキル存在確認
- ハンドオフコントラクトの検証（PASS / FAIL / N/A）
- ファイル命名規則の違反
- ワークフロー全体のステータス（valid / broken / warning）

### ステップ5: 壊れたハンドオフの修正

各 `FAIL` ハンドオフについて、以下を確認：
1. プロデューサースキルの出力に必要なフィールドがすべて含まれているか
2. コンシューマースキルの入力パラメータがプロデューサーの出力フォーマットを受け入れるか
3. プロデューサー出力とコンシューマー入力間のファイル命名パターンが一致しているか

---

## 6. リソース

**リファレンス：**

- `skills/skill-integration-tester/references/workflow_contracts.md`

**スクリプト：**

- `skills/skill-integration-tester/scripts/validate_workflows.py`
