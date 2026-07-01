# Development Guide

## Quick Start

```bash
npm install
cp .env.example .env
npm run validate
```

Set `REDIS_ENABLED=false` in `.env` if you do not have a local Redis instance.

## TypeScript Platform

| Command | Purpose |
|---------|---------|
| `npm run dev` | Watch mode (tsup) |
| `npm run typecheck` | Strict TypeScript check |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run validate` | Full pipeline |

## Python Skill Scripts

```bash
pip install -e ".[dev]"
pytest
python scripts/validate_skills_index.py --strict-workflows
```

## CLI Commands

```bash
npx trading-skills list
npx trading-skills workflows
npx trading-skills validate-index --strict-workflows
```

## Adding a New Skill

1. Create `skills/<skill-id>/SKILL.md` with YAML frontmatter.
2. Add entry to `skills-index.yaml`.
3. Run `npm run validate-skills` and `npm run validate-index`.
4. Package with `python scripts/package_skills.py --skill <skill-id>`.

## Redis Keys

| Pattern | Purpose |
|---------|---------|
| `cts:skills:list:*` | Cached skill catalog |
| `cts:workflows:list:*` | Cached workflow summaries |
| `cts:workflow:session:*` | Workflow session state |
