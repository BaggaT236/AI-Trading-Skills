#!/usr/bin/env python3
"""Pre-commit hook: detect absolute paths containing usernames.

Public repository must not contain paths like /Users/username/... or
/home/username/... as they leak personal information and break portability.

Suppress false positives with an inline comment: # noqa: absolute-path
"""

import re
import sys

# Matches /Users/<name>/ or /home/<name>/ with at least one path segment
ABSOLUTE_PATH_RE = re.compile(r"/(Users|home)/[^/\s]+/")

# Inline suppression marker
NOQA_RE = re.compile(r"#\s*noqa:\s*absolute-path")

# Lines that reference the pattern itself (regex definitions, documentation)
META_PATTERNS = [
    re.compile(r"re\.compile\(.*/(Users|home)/"),
    re.compile(r"e\.g\.,?\s*[`\"']/Users/"),
]


def check_file(filepath: str) -> list[str]:
    """Return list of violation messages for a single file."""
    violations = []
    try:
        with open(filepath, encoding="utf-8", errors="replace") as f:
            for lineno, line in enumerate(f, 1):
                if not ABSOLUTE_PATH_RE.search(line):
                    continue
                if NOQA_RE.search(line):
                    continue
                if any(p.search(line) for p in META_PATTERNS):
                    continue
                violations.append(f"  {filepath}:{lineno}: {line.rstrip()}")
    except (OSError, UnicodeDecodeError):
        pass
    return violations


def main() -> int:
    filenames = sys.argv[1:]
    all_violations: list[str] = []

    for filepath in filenames:
        all_violations.extend(check_file(filepath))

    if all_violations:
        print("ERROR: Absolute paths with usernames detected (public repo leak risk):")
        print("\n".join(all_violations))
        print("\nUse relative paths or dynamic resolution (e.g. Path(__file__).parents[N]).")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
