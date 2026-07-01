export interface SkillValidationIssue {
  skill: string;
  errors: string[];
  warnings: string[];
}

export interface SkillValidationReport {
  passed: number;
  warnings: number;
  issues: number;
  results: SkillValidationIssue[];
}

export interface IndexValidationFinding {
  code: string;
  severity: "error" | "warning";
  location: string;
  message: string;
}

export interface IndexValidationReport {
  passed: boolean;
  errors: number;
  warnings: number;
  findings: IndexValidationFinding[];
}

export interface SkillIndexEntry {
  id: string;
  display_name?: string;
  category?: string;
  status?: string;
  summary?: string;
  workflows?: string[];
}

export interface SkillsIndexDocument {
  schema_version?: number;
  categories?: string[];
  skills: SkillIndexEntry[];
}

export interface WorkflowStep {
  step: number;
  name?: string;
  skill?: string;
  produces?: string[];
  decision_gate?: boolean;
}

export interface WorkflowDocument {
  schema_version?: number;
  id: string;
  display_name?: string;
  cadence?: string;
  estimated_minutes?: number;
  api_profile?: string;
  required_skills?: string[];
  optional_skills?: string[];
  steps?: WorkflowStep[];
}

export interface WorkflowSummary {
  id: string;
  displayName: string;
  cadence: string;
  estimatedMinutes: number;
  apiProfile: string;
  stepCount: number;
  requiredSkills: string[];
}
