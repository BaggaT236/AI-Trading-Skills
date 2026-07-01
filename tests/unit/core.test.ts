import { describe, expect, it, beforeEach } from "vitest";

import { parseArgs, getBooleanArg, getStringArg, splitCsv } from "../../src/lib/cli/parse-args";
import { loadConfig, resetConfigCache } from "../../src/config/index";
import { parseFrontmatter, getSkillNames } from "../../src/skills/frontmatter";
import { validateSkills } from "../../src/skills/validate";
import { validateSkillsIndex, loadSkillsIndex } from "../../src/skills/index-validator";
import { listWorkflows, getWorkflowById } from "../../src/workflows/loader";
import { buildCacheKey } from "../../src/lib/redis/cache";

describe("parseArgs", () => {
  it("parses positional and flag arguments", () => {
    const args = parseArgs(["workflow", "market-regime-daily", "--strict-workflows"]);
    expect(args._).toEqual(["workflow", "market-regime-daily"]);
    expect(getBooleanArg(args, "strict-workflows")).toBe(true);
  });
});

describe("config", () => {
  beforeEach(() => {
    resetConfigCache();
  });

  it("loads defaults", () => {
    const config = loadConfig({ NODE_ENV: "test", LOG_LEVEL: "error" });
    expect(config.SKILLS_DIR).toBe("skills");
    expect(config.REDIS_KEY_PREFIX).toBe("cts:");
    expect(config.REDIS_ENABLED).toBe(true);
  });
});

describe("frontmatter", () => {
  it("parses YAML frontmatter", () => {
    const fm = parseFrontmatter(`---\nname: test-skill\ndescription: When testing\n---\n# Body`);
    expect(fm.name).toBe("test-skill");
  });
});

describe("skills validate", () => {
  it("validates repository skills without critical errors", () => {
    const report = validateSkills("skills");
    expect(report.issues).toBe(0);
    expect(report.passed).toBeGreaterThan(50);
  });

  it("discovers skill directories", () => {
    const names = getSkillNames("skills");
    expect(names.length).toBeGreaterThan(50);
  });
});

describe("skills index", () => {
  it("loads skills-index.yaml", () => {
    const doc = loadSkillsIndex("skills-index.yaml");
    expect(doc.skills.length).toBeGreaterThan(50);
  });

  it("validates index without errors", () => {
    const report = validateSkillsIndex({ strictWorkflows: true });
    expect(report.passed).toBe(true);
    expect(report.errors).toBe(0);
  });
});

describe("workflows", () => {
  it("lists operational workflows", () => {
    const workflows = listWorkflows();
    expect(workflows.length).toBeGreaterThan(5);
    expect(workflows.some((w) => w.id === "market-regime-daily")).toBe(true);
  });

  it("loads workflow by id", () => {
    const wf = getWorkflowById("market-regime-daily");
    expect(wf?.id).toBe("market-regime-daily");
    expect(wf?.steps?.length).toBeGreaterThan(0);
  });
});

describe("helpers", () => {
  it("splits csv values", () => {
    expect(splitCsv("a, b , c")).toEqual(["a", "b", "c"]);
  });

  it("reads string args safely", () => {
    const args = parseArgs(["x", "--name", "value"]);
    expect(getStringArg(args, "name")).toBe("value");
    expect(getStringArg(args, "missing")).toBeUndefined();
  });

  it("builds cache keys", () => {
    const key = buildCacheKey("workflows:list", {});
    expect(key).toMatch(/^workflows:list:[a-f0-9]{16}$/);
  });
});
