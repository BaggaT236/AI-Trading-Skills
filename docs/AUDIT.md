# Repository Audit — Claude Trading Skills

Internal engineering audit performed before the TypeScript platform migration.

## Current Architecture

| Layer | Technology | Role |
|-------|------------|------|
| Skill content | Markdown (`SKILL.md`) + YAML frontmatter | Claude Skills consumed by web app / Claude Code |
| Skill scripts | Python 3.9+ (~565 files) | Screeners, calculators, report generators |
| Metadata SSoT | `skills-index.yaml` | Canonical skill registry (62 skills) |
| Workflows | `workflows/*.yaml` | Declarative multi-skill operational manifests |
| Automation | Python scripts in `scripts/` | Validation, packaging, doc generation |
| Quality gates | Ruff, pytest, Bandit, pre-commit | Lint, test, security, drift prevention |

## Major Weaknesses

1. **No unified runtime platform** — Python validators and bash test runners; no cross-platform Node CLI.
2. **Optional dependencies undeclared** — `bs4`, `statsmodels`, `pandas` required by some skills but absent from `pyproject.toml`.
3. **Vendored FMP client duplication** — Nine generated copies maintained via codegen.
4. **macOS-centric automation** — `launchd` plists and bash scripts limit Windows contributor experience.
5. **No persistent cache layer** — Workflow artifacts and skill metadata re-read from disk each session.
6. **Low coverage floor (40%)** — Several skills excluded from CI due to pre-existing failures.
7. **No static type checking on platform code** — Python codebase lacks mypy/pyright.

## Recommended Improvements

1. Add a **TypeScript platform layer** with strict mode, ESLint, Vitest, and tsup bundling.
2. Integrate **Redis persistence** for skill metadata cache and workflow session state.
3. Provide **cross-platform CLI** (`trading-skills`) for validation, workflow listing, and navigation.
4. Centralize **environment configuration** with Zod-validated env vars.
5. Add **structured logging** for operational visibility.
6. Update **`.gitignore`** to exclude build artifacts and lockfiles.
7. Redesign **README** with architecture diagrams and professional onboarding docs.
8. Preserve Python skill scripts — they remain the core analytical functionality.
