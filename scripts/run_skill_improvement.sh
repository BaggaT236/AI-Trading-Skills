#!/bin/bash
# Thin launcher for launchd → run_skill_improvement_loop.py
#
# Install as launchd agent:
#   cp launchd/com.trade-analysis.skill-improvement.plist ~/Library/LaunchAgents/
#   launchctl load ~/Library/LaunchAgents/com.trade-analysis.skill-improvement.plist
#   launchctl list | grep skill-improvement
#
# Manual dry-run test:
#   launchctl start com.trade-analysis.skill-improvement
#   # or: bash scripts/run_skill_improvement.sh --dry-run

export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:${HOME}/.local/bin:/usr/local/bin:$PATH"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}/.." || exit 1

command -v python3 >/dev/null 2>&1 || { echo "python3 not found" >&2; exit 1; }

# Load project-level .envrc (sets GH_TOKEN for the correct GitHub account)
if command -v direnv &>/dev/null && [ -f .envrc ]; then
    eval "$(direnv export bash 2>/dev/null)"
fi

python3 scripts/run_skill_improvement_loop.py "$@"
