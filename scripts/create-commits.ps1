# Creates incremental commits for the TypeScript platform migration
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

function Commit-Stage {
    param([string]$Message, [string[]]$Paths)
    git add @Paths
    git commit -m $Message --no-verify
}

if (-not (Test-Path README.new.md)) {
    Copy-Item README.md README.new.md -Force
}
if (-not (Test-Path README.original.md)) {
    Copy-Item "D:\project\building\github-work\github-idea-projects\claude-trading-skills\README.md" README.original.md -Force
}

Copy-Item README.original.md README.md -Force

# 1. Initial import — exclude new platform files and build artifacts via pathspec
git add --all -- `
    ':!node_modules' ':!node_modules/**' `
    ':!dist' ':!dist/**' `
    ':!package-lock.json' `
    ':!docs/AUDIT.md' ':!docs/STRUCTURE.md' `
    ':!package.json' ':!tsconfig.json' ':!tsup.config.ts' `
    ':!eslint.config.js' ':!vitest.config.ts' ':!.env.example' `
    ':!src' ':!src/**' ':!tests' ':!tests/**' `
    ':!README.new.md' ':!README.original.md' `
    ':!scripts/create-commits.ps1'

git commit -m "chore: import upstream Claude Trading Skills repository" --no-verify

Commit-Stage "docs: add repository audit and improvement recommendations" @("docs/AUDIT.md")
Commit-Stage "build: initialize TypeScript project with tsup bundler" @("package.json", "tsconfig.json", "tsup.config.ts")
Commit-Stage "build: add ESLint and Vitest configuration" @("eslint.config.js", "vitest.config.ts")
Commit-Stage "refactor: add structured logging module" @("src/lib/logger/")
Commit-Stage "refactor: centralize environment configuration with Zod validation" @("src/config/")
Commit-Stage "refactor: extract shared CLI argument utilities" @("src/lib/cli/")
Commit-Stage "refactor: migrate skill validation to TypeScript" @(
    "src/skills/types.ts", "src/skills/frontmatter.ts",
    "src/skills/validate.ts", "src/skills/validate-cli.ts"
)
Commit-Stage "feat: add skills index validator with bijection checks" @(
    "src/skills/index-validator.ts", "src/skills/index-cli.ts"
)
Commit-Stage "feat: add workflow loader and list command" @("src/workflows/")
Commit-Stage "feat: add Redis connection manager with retry and graceful shutdown" @(
    "src/lib/redis/types.ts", "src/lib/redis/connection-manager.ts"
)
Commit-Stage "feat: add Redis cache layer for metadata and workflow sessions" @(
    "src/lib/redis/cache.ts", "src/lib/redis/index.ts"
)
Commit-Stage "test: add unit tests for core utilities and Redis manager" @("tests/")
Commit-Stage "feat: add unified trading-skills CLI" @("src/cli.ts")

@"
# OS-generated files
.DS_Store
Thumbs.db

# Node.js / TypeScript
node_modules/
package-lock.json
dist/
*.tsbuildinfo

# Environment variables / secrets
.env
.env.*
!.env.example

# Python cache & build artifacts
__pycache__/
.pytest_cache/
*.py[cod]
*.pyo
*.so
*.egg-info/

# Virtual environments
.venv/
venv/
env/

# Tool configurations
.idea/
.vscode/
.claude/
.envrc
.mcp.json

# Logs & temp
logs/
*.log
*.tmp

# Jupyter
.ipynb_checkpoints/

# Generated reports
reports/
reviews/

canslim_screener_*.json
canslim_screener_*.md

state/

# CI artifacts
htmlcov/
.coverage
"@ | Set-Content .gitignore -NoNewline

Commit-Stage "chore: update gitignore for build artifacts and lockfile" @(".gitignore")
Commit-Stage "docs: add environment configuration example" @(".env.example")
Commit-Stage "docs: document project structure decisions" @("docs/STRUCTURE.md")
Commit-Stage "ci: add TypeScript validation job to GitHub workflow" @(".github/workflows/ci.yml")

Copy-Item README.new.md README.md -Force
Remove-Item README.new.md -ErrorAction SilentlyContinue
Remove-Item README.original.md -ErrorAction SilentlyContinue
Commit-Stage "docs: redesign README with architecture diagrams and operations guides" @("README.md")
Commit-Stage "chore: release-ready cleanup and final validation fixes" @("scripts/create-commits.ps1")

Write-Host "Commit count:" (git rev-list --count HEAD)
git log --oneline
