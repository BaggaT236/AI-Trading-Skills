import { listWorkflows } from "./loader.js";
import { logger } from "../lib/logger/index.js";

const workflows = listWorkflows();
console.log(JSON.stringify({ count: workflows.length, workflows }, null, 2));
logger.info("Listed workflows", { count: workflows.length });
