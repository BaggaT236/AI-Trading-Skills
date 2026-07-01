import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/;
const FIELD_PATTERN = /^(\w+):\s*(.+)$/gm;

export function parseFrontmatter(content: string): Record<string, string> {
  const match = FRONTMATTER_PATTERN.exec(content);
  if (!match?.[1]) {
    return {};
  }
  const fields: Record<string, string> = {};
  for (const [, key, value] of match[1].matchAll(FIELD_PATTERN)) {
    if (key && value) {
      fields[key] = value.trim();
    }
  }
  return fields;
}

export function getSkillNames(skillsDir: string): string[] {
  if (!existsSync(skillsDir)) {
    return [];
  }

  return readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function readSkillFrontmatter(skillsDir: string, skillName: string): Record<string, string> {
  const skillFile = join(skillsDir, skillName, "SKILL.md");
  if (!existsSync(skillFile)) {
    return {};
  }
  return parseFrontmatter(readFileSync(skillFile, "utf8"));
}
