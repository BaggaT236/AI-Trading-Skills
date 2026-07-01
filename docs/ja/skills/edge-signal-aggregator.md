---
layout: default
title: "Edge Signal Aggregator"
grand_parent: 日本語
parent: スキルガイド
nav_order: 11
lang_peer: /en/skills/edge-signal-aggregator/
permalink: /ja/skills/edge-signal-aggregator/
---

# Edge Signal Aggregator
{: .no_toc }

複数のエッジ検出スキル（edge-candidate-agent、theme-detector、sector-analyst、institutional-flow-tracker）からのシグナルを集約・ランク付けし、加重スコアリング、重複排除、矛盾検出を備えた優先順位付きコンビクションダッシュボードを生成します。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/edge-signal-aggregator.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/edge-signal-aggregator){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

複数の上流エッジ検出スキルからの出力を、単一の加重コンビクションダッシュボードに統合します。このスキルは設定可能なシグナルウェイトを適用し、重複するテーマを排除し、スキル間の矛盾をフラグし、複合的なエッジアイデアを集約信頼度スコアでランク付けします。結果として、各寄与スキルへのプロヴェナンスリンク付きの優先順位付けされたエッジショートリストが得られます。

---

## 2. 使用タイミング

- 複数のエッジ検出スキルを実行後、統一的なビューが欲しい場合
- edge-candidate-agent、theme-detector、sector-analyst、institutional-flow-trackerからのシグナルを統合する場合
- 複数のシグナルソースに基づいてポートフォリオ配分の意思決定を行う前
- 異なる分析アプローチ間の矛盾を特定する場合
- どのエッジアイデアがより深いリサーチに値するかを優先順位付けする場合

---

## 3. 前提条件

- Python 3.9+
- APIキー不要（他のスキルからのローカルJSON/YAMLファイルを処理）
- 依存関係: `pyyaml`（ほとんどの環境で標準）

---

## 4. クイックスタート

```bash
python3 skills/edge-signal-aggregator/scripts/aggregate_signals.py \
  --edge-candidates reports/edge_candidate_agent_*.json \
  --edge-concepts reports/edge_concepts_*.yaml \
  --themes reports/theme_detector_*.json \
  --sectors reports/sector_analyst_*.json \
  --institutional reports/institutional_flow_*.json \
  --hints reports/edge_hints_*.yaml \
  --output-dir reports/
```

---

## 5. ワークフロー

### ステップ1: 上流スキル出力の収集

集約したい上流スキルからの出力ファイルを収集します：
- `reports/edge_candidate_*.json` （edge-candidate-agentから）
- `reports/edge_concepts_*.yaml` （edge-concept-synthesizerから）
- `reports/theme_detector_*.json` （theme-detectorから）
- `reports/sector_analyst_*.json` （sector-analystから）
- `reports/institutional_flow_*.json` （institutional-flow-trackerから）
- `reports/edge_hints_*.yaml` （edge-hint-extractorから）

### ステップ2: シグナル集約の実行

上流出力へのパスを指定してアグリゲータースクリプトを実行します：

```bash
python3 skills/edge-signal-aggregator/scripts/aggregate_signals.py \
  --edge-candidates reports/edge_candidate_agent_*.json \
  --edge-concepts reports/edge_concepts_*.yaml \
  --themes reports/theme_detector_*.json \
  --sectors reports/sector_analyst_*.json \
  --institutional reports/institutional_flow_*.json \
  --hints reports/edge_hints_*.yaml \
  --output-dir reports/
```

オプション: カスタムウェイト設定を使用：

```bash
python3 skills/edge-signal-aggregator/scripts/aggregate_signals.py \
  --edge-candidates reports/edge_candidate_agent_*.json \
  --weights-config skills/edge-signal-aggregator/assets/custom_weights.yaml \
  --output-dir reports/
```

### ステップ3: 集約ダッシュボードのレビュー

生成されたレポートを開いてレビューします：
1. **ランク付けされたエッジアイデア** - 複合コンビクションスコアでソート
2. **シグナルプロヴェナンス** - 各アイデアに寄与したスキル
3. **矛盾** - 手動レビュー用にフラグされた相反するシグナル
4. **重複排除ログ** - マージされた重複テーマ

### ステップ4: 高コンビクションシグナルへの対応

最小コンビクション閾値でショートリストをフィルタリング：

```bash
python3 skills/edge-signal-aggregator/scripts/aggregate_signals.py \
  --edge-candidates reports/edge_candidate_agent_*.json \
  --min-conviction 0.7 \
  --output-dir reports/
```

---

## 6. リソース

**リファレンス:**

- `skills/edge-signal-aggregator/references/signal-weighting-framework.md`

**スクリプト:**

- `skills/edge-signal-aggregator/scripts/aggregate_signals.py`
