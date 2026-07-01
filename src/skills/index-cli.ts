import { getBooleanArg, parseArgs } from "../lib/cli/parse-args.js";
import { logger } from "../lib/logger/index.js";
import { validateSkillsIndex } from "./index-validator.js";

const args = parseArgs(process.argv.slice(2));
const strictWorkflows = getBooleanArg(args, "strict-workflows");

const report = validateSkillsIndex({ strictWorkflows });

for (const finding of report.findings) {
  const payload = { code: finding.code, location: finding.location, message: finding.message };
  if (finding.severity === "error") {
    logger.error("Index validation", payload);
  } else {
    logger.warn("Index validation", payload);
  }
}

logger.info("Index validation summary", {
  passed: report.passed,
  errors: report.errors,
  warnings: report.warnings,
});

process.exit(report.passed ? 0 : 1);
