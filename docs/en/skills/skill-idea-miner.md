---
layout: default
title: "Skill Idea Miner"
grand_parent: English
parent: Skill Guides
nav_order: 39
lang_peer: /ja/skills/skill-idea-miner/
permalink: /en/skills/skill-idea-miner/
---

# Skill Idea Miner
{: .no_toc }

Mine Claude Code session logs for skill idea candidates. Use when running the weekly skill generation pipeline to extract, score, and backlog new skill ideas from recent coding sessions.
{: .fs-6 .fw-300 }

<span class="badge badge-free">No API</span>

[Download Skill Package (.skill)](https://github.com/tradermonty/claude-trading-skills/raw/main/skill-packages/skill-idea-miner.skill){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[View Source on GitHub](https://github.com/tradermonty/claude-trading-skills/tree/main/skills/skill-idea-miner){: .btn .fs-5 .mb-4 .mb-md-0 }

<details open markdown="block">
  <summary>Table of Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. Overview

# Skill Idea Miner

---

## 2. When to Use

- Weekly automated pipeline run (Saturday 06:00 via launchd)
- Manual backlog refresh: `python3 scripts/run_skill_generation_pipeline.py --mode weekly`
- Dry-run to preview candidates without LLM scoring

---

## 3. Prerequisites

- **API Key:** None required
- **Python 3.9+** recommended

---

## 4. Quick Start

### Stage 1: Session Log Mining

1. Enumerate session logs from allowlist projects in `~/.claude/projects/`
2. Filter to past 7 days by file mtime, confirm with `timestamp` field
3. Extract user messages (`type: "user"`, `userType: "external"`)
4. Extract tool usage patterns from assistant messages
5. Run deterministic signal detection:
   - Skill usage frequency (`skills/*/` path references)
   - Error patterns (non-zero exit codes, `is_error` flags, exception keywords)
   - Repetitive tool sequences (3+ tools repeated 3+ times)

---

## 5. Workflow

### Stage 1: Session Log Mining

1. Enumerate session logs from allowlist projects in `~/.claude/projects/`
2. Filter to past 7 days by file mtime, confirm with `timestamp` field
3. Extract user messages (`type: "user"`, `userType: "external"`)
4. Extract tool usage patterns from assistant messages
5. Run deterministic signal detection:
   - Skill usage frequency (`skills/*/` path references)
   - Error patterns (non-zero exit codes, `is_error` flags, exception keywords)
   - Repetitive tool sequences (3+ tools repeated 3+ times)
   - Automation request keywords (English and Japanese)
   - Unresolved requests (5+ minute gap after user message)
6. Invoke Claude CLI headless for idea abstraction
7. Output `raw_candidates.yaml`

### Stage 2: Scoring and Deduplication

1. Load existing skills from `skills/*/SKILL.md` frontmatter
2. Deduplicate via Jaccard similarity (threshold > 0.5) against:
   - Existing skill names and descriptions
   - Existing backlog ideas
3. Score non-duplicate candidates with Claude CLI:
   - Novelty (0-100): differentiation from existing skills
   - Feasibility (0-100): technical implementability
   - Trading Value (0-100): practical value for investors/traders
   - Composite = 0.3 * Novelty + 0.3 * Feasibility + 0.4 * Trading Value
4. Merge scored candidates into `logs/.skill_generation_backlog.yaml`

---

## 6. Resources

**References:**

- `skills/skill-idea-miner/references/idea_extraction_rubric.md`

**Scripts:**

- `skills/skill-idea-miner/scripts/__init__.py`
- `skills/skill-idea-miner/scripts/mine_session_logs.py`
- `skills/skill-idea-miner/scripts/score_ideas.py`
