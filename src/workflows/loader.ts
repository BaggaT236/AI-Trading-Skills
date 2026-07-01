import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { parse as parseYaml } from "yaml";

import { loadConfig } from "../config/index.js";
import type { WorkflowDocument, WorkflowSummary } from "../skills/types.js";

export function loadWorkflow(filePath: string): WorkflowDocument {
  const raw = readFileSync(filePath, "utf8");
  const doc = parseYaml(raw) as WorkflowDocument;
  if (!doc?.id) {
    throw new Error(`Invalid workflow file: ${filePath}`);
  }
  return doc;
}

export function listWorkflows(workflowsDir?: string): WorkflowSummary[] {
  const dir = workflowsDir ?? loadConfig().WORKFLOWS_DIR;
  if (!existsSync(dir)) {
    return [];
  }

  const summaries: WorkflowSummary[] = [];

  for (const file of readdirSync(dir).filter((f) => f.endsWith(".yaml"))) {
    const doc = loadWorkflow(join(dir, file));
    summaries.push({
      id: doc.id,
      displayName: doc.display_name ?? doc.id,
      cadence: doc.cadence ?? "unknown",
      estimatedMinutes: doc.estimated_minutes ?? 0,
      apiProfile: doc.api_profile ?? "unknown",
      stepCount: doc.steps?.length ?? 0,
      requiredSkills: doc.required_skills ?? [],
    });
  }

  return summaries.sort((a, b) => a.id.localeCompare(b.id));
}

export function getWorkflowById(workflowId: string, workflowsDir?: string): WorkflowDocument | null {
  const dir = workflowsDir ?? loadConfig().WORKFLOWS_DIR;
  const filePath = join(dir, `${workflowId}.yaml`);
  if (!existsSync(filePath)) {
    return null;
  }
  return loadWorkflow(filePath);
}
