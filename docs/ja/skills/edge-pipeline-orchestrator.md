---
layout: default
title: "Edge Pipeline Orchestrator"
grand_parent: 日本語
parent: スキルガイド
nav_order: 21
lang_peer: /en/skills/edge-pipeline-orchestrator/
permalink: /ja/skills/edge-pipeline-orchestrator/
---

# Edge Pipeline Orchestrator
{: .no_toc }

候補検出から戦略設計、レビュー、リビジョン、エクスポートまでのエッジリサーチパイプライン全体をオーケストレーションします。マルチステージのエッジリサーチワークフローをエンドツーエンドで調整する場合に使用します。
{: .fs-6 .fw-300 }

<span class="badge badge-free">API不要</span>

[スキルパッケージをダウンロード (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/edge-pipeline-orchestrator.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[GitHubでソースを見る](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/edge-pipeline-orchestrator){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>目次</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. 概要

エッジリサーチパイプライン全体のオーケストレーターです。候補検出から戦略設計、レビュー、リビジョン、エクスポートまでを一貫して管理します。

---

## 2. 使用タイミング

- チケット（またはOHLCV）からエクスポート済み戦略までのフルエッジパイプラインを実行する場合
- ドラフトステージから部分的に完了したパイプラインを再開する場合
- フィードバックループで既存の戦略ドラフトをレビュー・リビジョンする場合
- エクスポートなしでパイプラインの結果をプレビューするドライランを実行する場合

---

## 3. 前提条件

- サブプロセスを通じてローカルのエッジスキルをオーケストレーション
- Python 3.9+ 推奨

---

## 4. クイックスタート

```bash
# チケットからのフルパイプライン
python3 skills/edge-pipeline-orchestrator/scripts/orchestrate_edge_pipeline.py \
  --tickets-dir /path/to/tickets/ \
  --market-summary /path/to/market_summary.json \
  --anomalies /path/to/anomalies.json \
  --output-dir reports/edge_pipeline/

# 既存ドラフトでのレビューのみモード
python3 skills/edge-pipeline-orchestrator/scripts/orchestrate_edge_pipeline.py \
  --review-only \
  --drafts-dir reports/edge_strategy_drafts/ \
  --output-dir reports/edge_pipeline/

# ドライラン（エクスポートなし）
python3 skills/edge-pipeline-orchestrator/scripts/orchestrate_edge_pipeline.py \
  --tickets-dir /path/to/tickets/ \
  --output-dir reports/edge_pipeline/ --dry-run
```

---

## 5. ワークフロー

1. CLI引数からパイプライン設定を読み込み
2. `--from-ohlcv` が指定された場合、auto_detectステージを実行（生のOHLCVデータからチケットを生成）
3. ヒントステージを実行し、市場サマリーとアノマリーからエッジヒントを抽出
4. コンセプトステージを実行し、チケットとヒントから抽象的なエッジコンセプトを合成
5. ドラフトステージを実行し、コンセプトから戦略ドラフトを設計
6. レビュー・リビジョンのフィードバックループを実行：
   - すべてのドラフトをレビュー（最大2回のイテレーション）
   - PASS判定を蓄積、REJECT判定を蓄積
   - REVISE判定はリビジョン適用と再レビューをトリガー
   - 最大イテレーション後に残ったREVISEはresearch_probeにダウングレード
7. エクスポート適格ドラフトを出力（PASS + export_ready_v1 + エクスポート可能なentry_family）
8. 完全な実行トレースを含む pipeline_run_manifest.json を書き出し

---

## 6. リソース

**リファレンス:**

- `skills/edge-pipeline-orchestrator/references/pipeline_flow.md`
- `skills/edge-pipeline-orchestrator/references/revision_loop_rules.md`

**スクリプト:**

- `skills/edge-pipeline-orchestrator/scripts/orchestrate_edge_pipeline.py`
