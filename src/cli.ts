import { parseArgs, getBooleanArg, getStringArg } from "./lib/cli/parse-args.js";
import { buildCacheKey, getCached, setCached, shutdownRedis } from "./lib/redis/cache.js";
import { logger } from "./lib/logger/index.js";
import { validateSkills } from "./skills/validate.js";
import { validateSkillsIndex } from "./skills/index-validator.js";
import { listWorkflows, getWorkflowById } from "./workflows/loader.js";
import { loadSkillsIndex } from "./skills/index-validator.js";
import { loadConfig } from "./config/index.js";

const args = parseArgs(process.argv.slice(2));
const [command, ...rest] = args._;

async function main(): Promise<void> {
  if (!command || command === "help" || command === "--help") {
    console.log(
      JSON.stringify(
        {
          usage: "trading-skills <command> [options]",
          commands: {
            list: "List all skills from skills-index.yaml",
            workflows: "List operational workflows",
            workflow: "Show workflow details by id",
            validate: "Validate SKILL.md files",
            "validate-index": "Validate skills-index.yaml",
            status: "Show platform status",
          },
          examples: [
            "trading-skills list",
            "trading-skills workflows",
            "trading-skills workflow market-regime-daily",
            "trading-skills validate",
            "trading-skills validate-index --strict-workflows",
          ],
        },
        null,
        2,
      ),
    );
    return;
  }

  const skipCache = getBooleanArg(args, "no-cache");

  if (command === "list") {
    const cacheKey = buildCacheKey("skills:list", {});
    if (!skipCache) {
      const cached = await getCached<unknown>(cacheKey);
      if (cached) {
        console.log(JSON.stringify({ ...cached, _cached: true }, null, 2));
        return;
      }
    }

    const config = loadConfig();
    const index = loadSkillsIndex(config.SKILLS_INDEX_PATH);
    const payload = {
      count: index.skills.length,
      categories: index.categories ?? [],
      skills: index.skills.map((s) => ({
        id: s.id,
        displayName: s.display_name,
        category: s.category,
        status: s.status,
      })),
    };

    if (!skipCache) {
      await setCached(cacheKey, payload);
    }
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  if (command === "workflows") {
    const cacheKey = buildCacheKey("workflows:list", {});
    if (!skipCache) {
      const cached = await getCached<unknown>(cacheKey);
      if (cached) {
        console.log(JSON.stringify({ ...cached, _cached: true }, null, 2));
        return;
      }
    }

    const workflows = listWorkflows();
    const payload = { count: workflows.length, workflows };
    if (!skipCache) {
      await setCached(cacheKey, payload);
    }
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  if (command === "workflow") {
    const workflowId = rest[0] ?? getStringArg(args, "id");
    if (!workflowId) {
      console.error(JSON.stringify({ error: "Workflow id required" }));
      process.exit(1);
    }

    const workflow = getWorkflowById(workflowId);
    if (!workflow) {
      console.error(JSON.stringify({ error: `Workflow not found: ${workflowId}` }));
      process.exit(1);
    }
    console.log(JSON.stringify(workflow, null, 2));
    return;
  }

  if (command === "validate") {
    const report = validateSkills();
    console.log(JSON.stringify(report, null, 2));
    if (report.issues > 0) {
      process.exit(1);
    }
    return;
  }

  if (command === "validate-index") {
    const report = validateSkillsIndex({ strictWorkflows: getBooleanArg(args, "strict-workflows") });
    console.log(JSON.stringify(report, null, 2));
    if (!report.passed) {
      process.exit(1);
    }
    return;
  }

  if (command === "status") {
    const config = loadConfig();
    const { getRedisManager } = await import("./lib/redis/cache.js");
    const redis = getRedisManager();
    console.log(
      JSON.stringify(
        {
          nodeEnv: config.NODE_ENV,
          skillsDir: config.SKILLS_DIR,
          redisEnabled: config.REDIS_ENABLED,
          redisStatus: redis.getStatus(),
        },
        null,
        2,
      ),
    );
    return;
  }

  console.error(JSON.stringify({ error: `Unknown command: ${command}` }));
  process.exit(1);
}

main()
  .catch((error) => {
    logger.error("CLI failed", { error: error instanceof Error ? error.message : String(error) });
    process.exit(1);
  })
  .finally(async () => {
    await shutdownRedis();
  });
