import { existsSync, readFileSync, readdirSync } from "node:fs";

import { parse as parseYaml } from "yaml";

import { loadConfig } from "../config/index.js";
import { getSkillNames } from "./frontmatter.js";
import type { IndexValidationFinding, IndexValidationReport, SkillsIndexDocument } from "./types.js";

const VALID_CATEGORIES = new Set([
  "market-regime",
  "core-portfolio",
  "swing-opportunity",
  "trade-planning",
  "trade-memory",
  "strategy-research",
  "advanced-satellite",
  "meta",
]);

const VALID_STATUSES = new Set(["production", "beta", "experimental", "deprecated"]);

export interface IndexValidatorOptions {
  indexPath?: string;
  skillsDir?: string;
  workflowsDir?: string;
  strictWorkflows?: boolean;
}

function finding(
  code: string,
  severity: "error" | "warning",
  location: string,
  message: string,
): IndexValidationFinding {
  return { code, severity, location, message };
}

export function loadSkillsIndex(indexPath: string): SkillsIndexDocument {
  const raw = readFileSync(indexPath, "utf8");
  const doc = parseYaml(raw) as SkillsIndexDocument;
  if (!doc || !Array.isArray(doc.skills)) {
    throw new Error("Invalid skills-index.yaml: missing skills array");
  }
  return doc;
}

export function validateSkillsIndex(options: IndexValidatorOptions = {}): IndexValidationReport {
  const config = loadConfig();
  const indexPath = options.indexPath ?? config.SKILLS_INDEX_PATH;
  const skillsDir = options.skillsDir ?? config.SKILLS_DIR;
  const workflowsDir = options.workflowsDir ?? config.WORKFLOWS_DIR;
  const strictWorkflows = options.strictWorkflows ?? false;

  const findings: IndexValidationFinding[] = [];

  if (!existsSync(indexPath)) {
    return {
      passed: false,
      errors: 1,
      warnings: 0,
      findings: [finding("IDX001", "error", indexPath, "skills-index.yaml not found")],
    };
  }

  let doc: SkillsIndexDocument;
  try {
    doc = loadSkillsIndex(indexPath);
  } catch (error) {
    return {
      passed: false,
      errors: 1,
      warnings: 0,
      findings: [
        finding(
          "IDX002",
          "error",
          indexPath,
          error instanceof Error ? error.message : String(error),
        ),
      ],
    };
  }

  const folderNames = new Set(getSkillNames(skillsDir));
  const indexIds = new Set<string>();

  for (const skill of doc.skills) {
    const location = `skills-index.yaml:${skill.id}`;

    if (!skill.id) {
      findings.push(finding("IDX003", "error", indexPath, "Skill entry missing id"));
      continue;
    }

    if (indexIds.has(skill.id)) {
      findings.push(finding("IDX004", "error", location, `Duplicate skill id '${skill.id}'`));
    }
    indexIds.add(skill.id);

    if (!folderNames.has(skill.id)) {
      findings.push(
        finding("IDX005", "error", location, `No matching folder skills/${skill.id}/`),
      );
    }

    if (skill.category && !VALID_CATEGORIES.has(skill.category)) {
      findings.push(
        finding("IDX006", "warning", location, `Unknown category '${skill.category}'`),
      );
    }

    if (skill.status && !VALID_STATUSES.has(skill.status)) {
      findings.push(finding("IDX007", "warning", location, `Unknown status '${skill.status}'`));
    }

    if (!skill.display_name) {
      findings.push(finding("IDX008", "warning", location, "Missing display_name"));
    }

    if (!skill.summary) {
      findings.push(finding("IDX009", "warning", location, "Missing summary"));
    }
  }

  for (const folder of folderNames) {
    if (!indexIds.has(folder)) {
      findings.push(
        finding(
          "IDX010",
          "error",
          `skills/${folder}`,
          `Folder exists but '${folder}' is not in skills-index.yaml`,
        ),
      );
    }
  }

  if (strictWorkflows && existsSync(workflowsDir)) {
    const workflowIds = new Set(
      readdirSync(workflowsDir)
        .filter((f) => f.endsWith(".yaml"))
        .map((f) => f.replace(/\.yaml$/, "")),
    );

    for (const skill of doc.skills) {
      for (const wf of skill.workflows ?? []) {
        if (!workflowIds.has(wf)) {
          findings.push(
            finding(
              "WF001",
              "error",
              `skills-index.yaml:${skill.id}`,
              `Workflow '${wf}' referenced but not found in workflows/`,
            ),
          );
        }
      }
    }
  }

  const errors = findings.filter((f) => f.severity === "error").length;
  const warnings = findings.filter((f) => f.severity === "warning").length;

  return {
    passed: errors === 0,
    errors,
    warnings,
    findings,
  };
}
