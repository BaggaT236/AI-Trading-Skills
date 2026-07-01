# Project Structure

This document explains the repository layout after the TypeScript platform migration.

## Design Principles

1. **Content vs runtime separation** — Skill definitions and Python scripts remain portable; the Node.js platform lives under `src/`.
2. **Single source of truth** — `skills-index.yaml` is canonical for skill metadata; validators enforce bijection with `skills/` folders.
3. **Optional persistence** — Redis is disabled via `REDIS_ENABLED=false` for local development without infrastructure.
4. **Progressive enhancement** — Python skill scripts work standalone; the TypeScript CLI adds validation, caching, and workflow navigation.

## Directory Layout

```
claude-trading-skills/
├── src/                      # TypeScript platform (strict mode)
│   ├── cli.ts                # Unified trading-skills CLI
│   ├── config/               # Zod-validated environment config
│   ├── lib/
│   │   ├── cli/              # Argument parsing utilities
│   │   ├── logger/           # Structured logging
│   │   └── redis/            # Connection manager, cache, workflow sessions
│   ├── skills/               # SKILL.md + index validation
│   └── workflows/            # Workflow loader and list CLI
├── skills/                   # 62 Claude Skills (SKILL.md + Python scripts)
├── workflows/                # Operational workflow manifests (YAML)
├── skillsets/                # Install bundles for major goals
├── skills-index.yaml         # Canonical skill registry
├── scripts/                  # Python repo automation (packaging, codegen)
├── docs/                     # Documentation site + engineering docs
├── tests/                    # Vitest unit tests for TypeScript platform
├── pyproject.toml            # Python dependencies for skill scripts
└── dist/                     # Build output (gitignored)
```

## What Lives Where

| Concern | Location | Language |
|---------|----------|----------|
| Skill instructions | `skills/*/SKILL.md` | Markdown |
| Screeners & calculators | `skills/*/scripts/` | Python |
| Skill metadata | `skills-index.yaml` | YAML |
| Workflow orchestration | `workflows/*.yaml` | YAML |
| Cross-platform CLI | `src/cli.ts` | TypeScript |
| Response caching | `src/lib/redis/` | TypeScript |
| Python test suites | `skills/*/scripts/tests/` | Python |

## Migration Notes

- Python skill scripts are **unchanged** — they remain the analytical core.
- The TypeScript layer replaces bash-only validation for cross-platform contributor experience.
- Redis caches skill lists, workflow metadata, and optional workflow session state.
