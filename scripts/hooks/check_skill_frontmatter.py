#!/usr/bin/env python3
"""Pre-commit hook: validate SKILL.md YAML frontmatter.

Ensures every skills/*/SKILL.md has:
  - A `name` field matching its parent directory name
  - A non-empty `description` field
"""

import re
import sys
from pathlib import Path

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---", re.DOTALL)
FIELD_RE = re.compile(r"^(\w+):\s*(.+)$", re.MULTILINE)


def parse_frontmatter(text: str) -> dict[str, str]:
    """Extract YAML frontmatter key-value pairs (simple flat YAML only)."""
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}
    return dict(FIELD_RE.findall(match.group(1)))


def check_skill_md(filepath: str) -> list[str]:
    """Validate a single SKILL.md file. Return list of error messages."""
    errors = []
    path = Path(filepath)

    # Only check files matching skills/*/SKILL.md
    if path.name != "SKILL.md" or path.parent.parent.name != "skills":
        return []

    expected_name = path.parent.name

    try:
        text = path.read_text(encoding="utf-8")
    except OSError as e:
        return [f"  {filepath}: cannot read file: {e}"]

    fm = parse_frontmatter(text)

    if not fm:
        errors.append(f"  {filepath}: missing YAML frontmatter (---)")
        return errors

    name = fm.get("name", "").strip().strip("'\"")
    if not name:
        errors.append(f"  {filepath}: missing 'name' field in frontmatter")
    elif name != expected_name:
        errors.append(f"  {filepath}: name '{name}' does not match directory '{expected_name}'")

    desc = fm.get("description", "").strip().strip("'\"")
    if not desc:
        errors.append(f"  {filepath}: missing or empty 'description' field")

    return errors


def main() -> int:
    filenames = sys.argv[1:]
    all_errors: list[str] = []

    for filepath in filenames:
        all_errors.extend(check_skill_md(filepath))

    if all_errors:
        print("ERROR: SKILL.md frontmatter validation failed:")
        print("\n".join(all_errors))
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
