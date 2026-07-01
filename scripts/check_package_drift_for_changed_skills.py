#!/usr/bin/env python3
"""Check package drift only for packaged skills touched by changed files."""

from __future__ import annotations

import sys
from collections.abc import Iterable, Sequence
from pathlib import Path

from package_skills import DEFAULT_OUTPUT_DIR, DEFAULT_SKILLS_DIR, PROJECT_ROOT, check_skill
from package_skills import should_include as package_should_include


def _relative_changed_path(raw_path: str, project_root: Path) -> Path | None:
    path = Path(raw_path)
    if path.is_absolute():
        try:
            path = path.resolve().relative_to(project_root.resolve())
        except ValueError:
            return None
    if not path.parts:
        return None
    return Path(*path.parts)


def _changed_source_skill(relative_path: Path) -> str | None:
    parts = relative_path.parts
    if len(parts) < 3 or parts[0] != "skills":
        return None

    skill = parts[1]
    skill_relative_path = Path(*parts[2:])

    if not package_should_include(skill_relative_path):
        return None
    return skill


def _changed_archive_skill(relative_path: Path) -> str | None:
    parts = relative_path.parts
    if len(parts) != 2 or parts[0] != "skill-packages":
        return None
    archive = Path(parts[1])
    if archive.suffix != ".skill":
        return None
    return archive.stem


def packaged_skills_for_changed_paths(
    changed_paths: Iterable[str],
    *,
    skills_dir: Path = DEFAULT_SKILLS_DIR,
    output_dir: Path = DEFAULT_OUTPUT_DIR,
    project_root: Path = PROJECT_ROOT,
) -> list[str]:
    """Return packaged skill names affected by changed repository paths."""
    skills_dir = skills_dir.resolve()
    output_dir = output_dir.resolve()
    project_root = project_root.resolve()

    candidate_skills: set[str] = set()
    for raw_path in changed_paths:
        relative_path = _relative_changed_path(raw_path, project_root)
        if relative_path is None:
            continue

        skill = _changed_source_skill(relative_path) or _changed_archive_skill(relative_path)
        if skill is None:
            continue

        archive_path = output_dir / f"{skill}.skill"
        if archive_path.is_file() and (skills_dir / skill / "SKILL.md").is_file():
            candidate_skills.add(skill)

    return sorted(candidate_skills)


def check_changed_package_drift(
    changed_paths: Iterable[str],
    *,
    skills_dir: Path = DEFAULT_SKILLS_DIR,
    output_dir: Path = DEFAULT_OUTPUT_DIR,
    project_root: Path = PROJECT_ROOT,
) -> int:
    """Check changed packaged skills and return a process-style exit code."""
    skill_names = packaged_skills_for_changed_paths(
        changed_paths,
        skills_dir=skills_dir,
        output_dir=output_dir,
        project_root=project_root,
    )
    if not skill_names:
        return 0

    drift = False
    for skill_name in skill_names:
        skill_dir = skills_dir / skill_name
        archive_path = output_dir / f"{skill_name}.skill"
        display_archive = f"skill-packages/{archive_path.name}"
        if check_skill(skill_dir, output_dir):
            print(f"OK: {display_archive} matches source")
        else:
            print(
                f"DRIFT: {display_archive} is stale; "
                f"re-run python3 scripts/package_skills.py --skill {skill_name}"
            )
            drift = True

    return 1 if drift else 0


def main(argv: Sequence[str] | None = None) -> int:
    changed_paths = sys.argv[1:] if argv is None else list(argv)
    return check_changed_package_drift(changed_paths)


if __name__ == "__main__":
    raise SystemExit(main())
