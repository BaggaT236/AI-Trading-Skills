---
layout: default
title: "Dual Axis Skill Reviewer"
grand_parent: 日本語
parent: スキルガイド
nav_order: 14
lang_peer: /en/skills/dual-axis-skill-reviewer/
permalink: /ja/skills/dual-axis-skill-reviewer/
---

# Dual Axis Skill Reviewer
{: .no_toc }

デュアルアクシス方式でスキルをレビューします：(1) 決定論的コードベースチェック（構造、スクリプト、テスト、実行安全性）と (2) LLMディープレビュー。`skills/*/SKILL.md` の再現可能な品質スコアリング、スコア閾値（例：90以上）でのマージゲート、低スコアスキルの具体的な改善項目が必要な場合に使用します。`--project-root` を通じてプロジェクト横断で動作します。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/dual-axis-skill-reviewer.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/dual-axis-skill-reviewer){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

デュアルアクシス（2軸）方式でスキルの品質をレビューするスキルです。決定論的な自動チェック軸と、LLMによる定性的レビュー軸の2つを組み合わせて、再現可能な品質スコアを提供します。

---

## 2. 使用タイミング

- `skills/*/SKILL.md` に対する再現可能なスコアリングが必要な場合
- 最終スコアが90未満のスキルの改善項目が必要な場合
- 決定論的チェックと定性的なLLMコード/コンテンツレビューの両方が必要な場合
- **別のプロジェクト**のスキルをコマンドラインからレビューする必要がある場合

---

## 3. 前提条件

- Python 3.9+
- `uv`（推奨 -- インラインメタデータで `pyyaml` 依存を自動解決）
- テスト用: ターゲットプロジェクトで `uv sync --extra dev` または同等のもの
- LLM軸のマージ用: LLMレビュースキーマに準拠したJSONファイル（リソース参照）

---

## 4. クイックスタート

```bash
# 同じプロジェクトからレビューする場合:
REVIEWER=skills/dual-axis-skill-reviewer/scripts/run_dual_axis_review.py

# 別のプロジェクトをレビューする場合（グローバルインストール）:
REVIEWER=~/.claude/skills/dual-axis-skill-reviewer/scripts/run_dual_axis_review.py
```

---

## 5. ワークフロー

コンテキストに基づいて正しいスクリプトパスを決定します：

- **同じプロジェクト**: `skills/dual-axis-skill-reviewer/scripts/run_dual_axis_review.py`
- **グローバルインストール**: `~/.claude/skills/dual-axis-skill-reviewer/scripts/run_dual_axis_review.py`

以下の例では `REVIEWER` をプレースホルダーとして使用します。一度設定してください：

```bash
# 同じプロジェクトからレビューする場合:
REVIEWER=skills/dual-axis-skill-reviewer/scripts/run_dual_axis_review.py

# 別のプロジェクトをレビューする場合（グローバルインストール）:
REVIEWER=~/.claude/skills/dual-axis-skill-reviewer/scripts/run_dual_axis_review.py
```

### ステップ1: 自動軸の実行 + LLMプロンプトの生成

```bash
uv run "$REVIEWER" \
  --project-root . \
  --emit-llm-prompt \
  --output-dir reports/
```

別のプロジェクトをレビューする場合、`--project-root` を指定します：

```bash
uv run "$REVIEWER" \
  --project-root /path/to/other/project \
  --emit-llm-prompt \
  --output-dir reports/
```

### ステップ2: LLMレビューの実行
- `reports/skill_review_prompt_<skill>_<timestamp>.md` に生成されたプロンプトファイルを使用
- LLMに厳密なJSON出力を返すよう依頼
- Claude Code内で実行する場合、Claudeをオーケストレーターとして活用：生成されたプロンプトを読み取り、LLMレビューJSONを生成し、マージステップ用に保存

### ステップ3: 自動 + LLM軸のマージ

```bash
uv run "$REVIEWER" \
  --project-root . \
  --skill <skill-name> \
  --llm-review-json <path-to-llm-review.json> \
  --auto-weight 0.5 \
  --llm-weight 0.5 \
  --output-dir reports/
```

### ステップ4: オプション制御

- 再現性のための選択固定: `--skill <name>` または `--seed <int>`
- 全スキルの一括レビュー: `--all`
- クイックトリアージのためのテストスキップ: `--skip-tests`
- レポート出力先の変更: `--output-dir <dir>`
- より厳格な決定論的ゲートのために `--auto-weight` を増加
- 定性的/コードレビューの深さを優先する場合に `--llm-weight` を増加

---

## 6. リソース

**リファレンス:**

- `skills/dual-axis-skill-reviewer/references/llm_review_schema.md`
- `skills/dual-axis-skill-reviewer/references/scoring_rubric.md`

**スクリプト:**

- `skills/dual-axis-skill-reviewer/scripts/run_dual_axis_review.py`
