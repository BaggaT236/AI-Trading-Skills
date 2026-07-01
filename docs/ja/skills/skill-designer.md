---
layout: default
title: "Skill Designer"
grand_parent: 日本語
parent: スキルガイド
nav_order: 38
lang_peer: /en/skills/skill-designer/
permalink: /ja/skills/skill-designer/
---

# Skill Designer
{: .no_toc }

構造化されたアイデア仕様から新しいClaudeスキルを設計するスキルです。スキル自動生成パイプラインが、リポジトリの規約に従った完全なスキルディレクトリ（SKILL.md、リファレンス、スクリプト、テスト）を作成するClaude CLIプロンプトを生成する際に使用します。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/skill-designer.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/skill-designer){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

構造化されたスキルアイデア仕様から、包括的なClaude CLIプロンプトを生成します。このプロンプトにより、Claudeがリポジトリの規約に従った完全なスキルディレクトリを作成します：YAMLフロントマター付きのSKILL.md、リファレンスドキュメント、ヘルパースクリプト、テストスキャフォールディングを含みます。

---

## 2. 使用タイミング

- スキル自動生成パイプラインがバックログからアイデアを選択し、`claude -p` 用のデザインプロンプトが必要な場合
- 開発者がJSONアイデア仕様から新しいスキルをブートストラップしたい場合
- 生成されたスキルの品質レビューにスコアリング基準の理解が必要な場合

---

## 3. 前提条件

- Python 3.9+
- 外部APIキー不要
- リファレンスファイルが `skills/skill-designer/references/` に存在すること

---

## 4. クイックスタート

```bash
python3 skills/skill-designer/scripts/build_design_prompt.py \
  --idea-json /tmp/idea.json \
  --skill-name "my-new-skill" \
  --project-root .
```

---

## 5. ワークフロー

### ステップ1: アイデア仕様の準備

JSONファイル（`--idea-json`）を用意。含まれる内容：
- `title`: 人間が読めるアイデア名
- `description`: スキルの機能説明
- `category`: スキルカテゴリ（例: trading-analysis、developer-tooling）

正規化されたスキル名（`--skill-name`）を用意。ディレクトリ名およびYAMLフロントマターの `name:` フィールドとして使用されます。

### ステップ2: デザインプロンプトの構築

プロンプトビルダーを実行：

```bash
python3 skills/skill-designer/scripts/build_design_prompt.py \
  --idea-json /tmp/idea.json \
  --skill-name "my-new-skill" \
  --project-root .
```

スクリプトの動作：
1. アイデアJSONを読み込み
2. 3つのリファレンスファイル（構造ガイド、品質チェックリスト、テンプレート）を読み込み
3. 既存スキル一覧（最大20件）を取得して重複を防止
4. 完全なプロンプトをstdoutに出力

### ステップ3: Claude CLIにプロンプトを投入

呼び出し側パイプラインがプロンプトを `claude -p` にパイプ：

```bash
python3 skills/skill-designer/scripts/build_design_prompt.py \
  --idea-json /tmp/idea.json \
  --skill-name "my-new-skill" \
  --project-root . \
| claude -p --allowedTools Read,Edit,Write,Glob,Grep
```

### ステップ4: 出力の検証

Claudeがスキルを作成した後、以下を確認：
- `skills/<skill-name>/SKILL.md` が正しいフロントマターで存在すること
- ディレクトリ構造が規約に準拠していること
- dual-axis-skill-reviewerのスコアが閾値を満たしていること

---

## 6. リソース

**リファレンス：**

- `skills/skill-designer/references/quality-checklist.md`
- `skills/skill-designer/references/skill-structure-guide.md`
- `skills/skill-designer/references/skill-template.md`

**スクリプト：**

- `skills/skill-designer/scripts/build_design_prompt.py`
