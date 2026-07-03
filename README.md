# Claude Trading Skills

Build disciplined, repeatable trading workflows with a modern TypeScript platform.

This repository gives you:
- a strict TypeScript CLI for workflow execution and metadata validation,
- a large skill catalog for market analysis, screening, and review loops,
- optional Redis-backed state caching for faster repeated runs.

Designed for discretionary traders who want better process quality, not "black-box" auto trading.

> Educational use only. Not financial advice.

---

## Why This Repo Stands Out

- **TypeScript-first runtime:** strongly typed CLI, validators, config, and tooling.
- **Skill-rich ecosystem:** reusable modules for regime analysis, idea generation, sizing, and postmortems.
- **Workflow orchestration:** YAML-driven playbooks with clear decision gates.
- **Production hygiene:** strict lint/typecheck/test pipeline and deterministic builds.
- **Flexible operation:** runs locally with or without Redis.

---

## Quick Start (3 Minutes)

```bash
git clone https://github.com/tradermonty/claude-trading-skills.git
cd claude-trading-skills
npm install
cp .env.example .env
npm run validate
```

If validation passes, you are ready.

---

## First Commands To Run

```bash
npx trading-skills list
npx trading-skills workflows
npx trading-skills workflow market-regime-daily
npx trading-skills validate
npx trading-skills validate-index --strict-workflows
```

---

## Project Layout

```text
claude-trading-skills/
├── src/                  # TypeScript runtime, CLI, config, validators
├── tests/                # Vitest suites
├── skills/               # Skill content and execution assets
├── workflows/            # YAML workflow definitions
├── skillsets/            # Installable bundles by use-case
├── skills-index.yaml     # Canonical skill registry
├── docs/                 # Architecture and contributor docs
└── package.json          # Build/test/lint scripts
```

---

## TypeScript Development

```bash
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
npm run validate
```

`npm run validate` is the canonical local gate before pushing.

---

## Environment Configuration

Copy `.env.example` to `.env` and adjust:

- `LOG_LEVEL` (`info`, `debug`, `error`)
- `REDIS_ENABLED` (`true` or `false`)
- `REDIS_URL` (defaults to local Redis)
- `REDIS_KEY_PREFIX`
- `REDIS_CACHE_TTL_SECONDS`
- `SKILLS_DIR`
- `SKILLS_INDEX_PATH`
- `WORKFLOWS_DIR`

No Redis? Set `REDIS_ENABLED=false` and continue.

---

## Recommended Workflows

- **Daily market posture:** `market-regime-daily`
- **Swing scan routine:** `swing-opportunity-daily`
- **Weekly portfolio review:** `core-portfolio-weekly`
- **Trade journaling loop:** `trade-memory-loop`
- **Monthly performance review:** `monthly-performance-review`

Workflow truth source lives in `workflows/` and `skills-index.yaml`.

---

## Troubleshooting

- **Type errors after pulling:** run `npm install` then `npm run typecheck`.
- **Lint failures:** run `npm run lint` and fix reported files.
- **Workflow validation errors:** run `npx trading-skills validate-index --strict-workflows`.
- **Redis unavailable:** set `REDIS_ENABLED=false` in `.env`.

---

## Contributing

1. Create a feature branch.
2. Make focused changes.
3. Run `npm run validate`.
4. Update relevant docs when behavior changes.
5. Open a PR with clear test evidence.

For deeper architecture context, see `docs/STRUCTURE.md` and `docs/AUDIT.md`.

---

## FAQ

**Is this an autonomous trading bot?**  
No. It structures analysis and decision quality; humans remain in control.

**Can I run without Redis?**  
Yes. Redis is optional.

**What is the canonical registry?**  
`skills-index.yaml`.

---

## License

MIT. See `LICENSE`.
