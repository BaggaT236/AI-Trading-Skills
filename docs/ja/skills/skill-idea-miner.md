---
layout: default
title: "Skill Idea Miner"
grand_parent: 日本語
parent: スキルガイド
nav_order: 39
lang_peer: /en/skills/skill-idea-miner/
permalink: /ja/skills/skill-idea-miner/
---

# Skill Idea Miner
{: .no_toc }

Claude Codeのセッションログからスキルアイデア候補を発掘するスキルです。週次スキル生成パイプラインの実行時に、最近のコーディングセッションから新しいスキルアイデアを抽出・スコアリング・バックログ登録します。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/skill-idea-miner.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/skill-idea-miner){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

Claude Codeのセッションログをマイニングし、新しいスキルのアイデア候補を自動的に発見します。セッション中のユーザーリクエスト、ツール使用パターン、エラーパターン、繰り返しシーケンスなどのシグナルを検出し、スキル化の可能性があるワークフローを特定します。

---

## 2. 使用タイミング

- 週次の自動パイプライン実行（土曜06:00、launchd経由）
- 手動でのバックログ更新: `python3 scripts/run_skill_generation_pipeline.py --mode weekly`
- LLMスコアリングなしの候補プレビュー（ドライラン）

---

## 3. 前提条件

- **APIキー：** 不要
- **Python 3.9+** 推奨

---

## 4. クイックスタート

### ステージ1: セッションログマイニング

1. `~/.claude/projects/` のアローリストプロジェクトからセッションログを列挙
2. ファイルのmtimeで過去7日間にフィルタ、`timestamp` フィールドで確認
3. ユーザーメッセージを抽出（`type: "user"`, `userType: "external"`）
4. アシスタントメッセージからツール使用パターンを抽出
5. 決定論的シグナル検出を実行：
   - スキル使用頻度（`skills/*/` パス参照）
   - エラーパターン（非ゼロ終了コード、`is_error` フラグ、例外キーワード）
   - 繰り返しツールシーケンス（3つ以上のツールが3回以上繰り返し）

---

## 5. ワークフロー

### ステージ1: セッションログマイニング

1. `~/.claude/projects/` のアローリストプロジェクトからセッションログを列挙
2. ファイルのmtimeで過去7日間にフィルタ、`timestamp` フィールドで確認
3. ユーザーメッセージを抽出（`type: "user"`, `userType: "external"`）
4. アシスタントメッセージからツール使用パターンを抽出
5. 決定論的シグナル検出を実行：
   - スキル使用頻度（`skills/*/` パス参照）
   - エラーパターン（非ゼロ終了コード、`is_error` フラグ、例外キーワード）
   - 繰り返しツールシーケンス（3つ以上のツールが3回以上繰り返し）
   - 自動化リクエストキーワード（英語・日本語）
   - 未解決リクエスト（ユーザーメッセージ後5分以上の空白）
6. Claude CLIヘッドレスでアイデア抽象化を実行
7. `raw_candidates.yaml` を出力

### ステージ2: スコアリングと重複排除

1. `skills/*/SKILL.md` フロントマターから既存スキルを読み込み
2. Jaccard類似度（閾値 > 0.5）で重複排除：
   - 既存スキルの名前と説明に対して
   - 既存バックログアイデアに対して
3. 非重複候補をClaude CLIでスコアリング：
   - 新規性（0-100）: 既存スキルとの差別化
   - 実現可能性（0-100）: 技術的な実装可能性
   - トレーディング価値（0-100）: 投資家・トレーダーにとっての実用的価値
   - 複合スコア = 0.3 * 新規性 + 0.3 * 実現可能性 + 0.4 * トレーディング価値
4. スコア付き候補を `logs/.skill_generation_backlog.yaml` にマージ

---

## 6. リソース

**リファレンス：**

- `skills/skill-idea-miner/references/idea_extraction_rubric.md`

**スクリプト：**

- `skills/skill-idea-miner/scripts/__init__.py`
- `skills/skill-idea-miner/scripts/mine_session_logs.py`
- `skills/skill-idea-miner/scripts/score_ideas.py`
