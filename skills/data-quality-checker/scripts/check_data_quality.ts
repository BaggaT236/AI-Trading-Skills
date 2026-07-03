import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const SEVERITY_ORDER: Record<string, number> = { ERROR: 0, WARNING: 1, INFO: 2 };

export type Severity = "ERROR" | "WARNING" | "INFO";
export type Category =
  | "price_scale"
  | "notation"
  | "dates"
  | "allocations"
  | "units";

export interface Finding {
  severity: Severity;
  category: Category;
  message: string;
  line_number?: number;
  context?: string;
}

const INSTRUMENT_DIGIT_HINTS: Record<string, [number, number]> = {
  GLD: [2, 3],
  GC: [3, 4],
  SPY: [2, 3],
  SPX: [4, 5],
  VIX: [1, 2],
  TLT: [2, 3],
  SLV: [2, 2],
  SI: [2, 2],
  USO: [2, 2],
  CL: [2, 3],
};

const SCALE_RATIOS: Record<string, number> = {
  "GLD|GC": 15,
  "SLV|SI": 2.3,
  "USO|CL": 0.85,
  "SPY|SPX": 10,
};

const NOTATION_GROUPS: Record<string, string[]> = {
  gold: ["Gold", "GLD", "GC", "金", "金先物", "ゴールド"],
  sp500: ["S&P 500", "S&P500", "SPX", "SPY", "SP500"],
  oil: ["WTI", "Crude", "CL", "USO", "原油"],
  silver: ["Silver", "SLV", "SI", "銀"],
  bonds: ["TLT", "10Y", "10年債", "米国債"],
  vix: ["VIX", "恐怖指数"],
};

const WEEKDAY_MAP_EN: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
};

const WEEKDAY_MAP_JA: Record<string, number> = {
  月: 0,
  火: 1,
  水: 2,
  木: 3,
  金: 4,
  土: 5,
  日: 6,
};

const MONTH_MAP: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

const ALLOCATION_HEADING_KEYWORDS = [
  "配分",
  "アロケーション",
  "allocation",
  "セクター配分",
  "asset allocation",
];
const ALLOCATION_TABLE_KEYWORDS = [
  "配分",
  "allocation",
  "ウェイト",
  "weight",
  "比率",
  "ratio",
  "目安比率",
];

const INSTRUMENT_WORDS =
  /\b(Gold|Silver|Oil|Crude|WTI|SPY|SPX|VIX|GLD|GC|TLT|SLV|USO|CL|SI)\b/i;
const MOVEMENT_WORDS =
  /\b(moved|rose|fell|dropped|gained|lost|up|down|changed|increased|decreased)\b/i;
const BARE_NUMBER = /\b(\d+(?:\.\d+)?)\b/;
const HAS_UNIT = /(\$\d|\d\s*%|\d\s*bp|\d\s*bps)/i;

function sortFindings(findings: Finding[]): Finding[] {
  return findings.sort((a, b) => {
    const aSeverity = SEVERITY_ORDER[a.severity] ?? 99;
    const bSeverity = SEVERITY_ORDER[b.severity] ?? 99;
    if (aSeverity !== bSeverity) return aSeverity - bSeverity;
    return (a.line_number ?? 0) - (b.line_number ?? 0);
  });
}

function lineNumberAt(content: string, offset: number): number {
  return content.slice(0, offset).split("\n").length;
}

function extractInstrumentPrices(content: string): Record<string, [number, number][]> {
  const mentions: Record<string, [number, number][]> = {};
  const tickers = Object.keys(INSTRUMENT_DIGIT_HINTS).sort((a, b) => b.length - a.length);
  const tickerPat = new RegExp(
    `(?:^|[\\s(])(${tickers.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?:[)\\s:,])`,
    "g",
  );

  for (const match of content.matchAll(tickerPat)) {
    const instrument = match[1];
    const idx = match.index ?? 0;
    const end = idx + match[0].length;
    const rest = content.slice(Math.max(0, end - 1), end + 80);
    const priceMatch = /\$([0-9,]+(?:\.[0-9]+)?)/.exec(rest);
    if (!priceMatch) continue;
    const price = Number.parseFloat(priceMatch[1].replaceAll(",", ""));
    if (!Number.isFinite(price) || price <= 0) continue;
    const line = lineNumberAt(content, idx);
    mentions[instrument] ??= [];
    mentions[instrument].push([price, line]);
  }
  return mentions;
}

export function check_price_scale(content: string): Finding[] {
  const findings: Finding[] = [];
  const mentions = extractInstrumentPrices(content);

  for (const [instrument, priceList] of Object.entries(mentions)) {
    const [minDigits, maxDigits] = INSTRUMENT_DIGIT_HINTS[instrument];
    for (const [price, lineNumber] of priceList) {
      const digitCount = `${Math.trunc(price)}`.length;
      if (digitCount < minDigits || digitCount > maxDigits) {
        findings.push({
          severity: "WARNING",
          category: "price_scale",
          message: `${instrument}: $${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} has ${digitCount} digits (expected ${minDigits}-${maxDigits} digits)`,
          line_number: lineNumber,
        });
      }
    }
  }

  for (const [pair, expectedRatio] of Object.entries(SCALE_RATIOS)) {
    const [etf, futures] = pair.split("|");
    if (!mentions[etf] || !mentions[futures]) continue;
    for (const [etfPrice, etfLine] of mentions[etf]) {
      if (etfPrice <= 0) continue;
      for (const [futuresPrice, futuresLine] of mentions[futures]) {
        const actualRatio = futuresPrice / etfPrice;
        if (Math.abs(actualRatio - expectedRatio) / expectedRatio > 0.5) {
          findings.push({
            severity: "WARNING",
            category: "price_scale",
            message: `Price scale ratio mismatch: ${futures}/$${etf} = ${actualRatio.toFixed(1)}x (expected ~${expectedRatio}x). Possible ETF/futures price mix-up.`,
            line_number: Math.min(etfLine, futuresLine),
          });
        }
      }
    }
  }

  return findings;
}

export function check_notation(content: string): Finding[] {
  const findings: Finding[] = [];
  for (const [groupName, variants] of Object.entries(NOTATION_GROUPS)) {
    const found: string[] = [];
    for (const variant of variants) {
      const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(?<!\\w)${escaped}(?!\\w)`, variant.length > 3 ? "i" : "");
      if (regex.test(content)) found.push(variant);
    }
    if (found.length > 1) {
      findings.push({
        severity: "WARNING",
        category: "notation",
        message: `Mixed notation for ${groupName}: ${found.join(", ")}. Consider using a consistent term.`,
      });
    }
  }
  return findings;
}

function resolveEnglishWeekday(weekday: string): number | undefined {
  const lower = weekday.toLowerCase();
  if (lower in WEEKDAY_MAP_EN) return WEEKDAY_MAP_EN[lower];
  return WEEKDAY_MAP_EN[lower.slice(0, 3)];
}

function inferYearWithAsOf(month: number, asOf: Date): number {
  const diffMonths = month - (asOf.getMonth() + 1);
  if (diffMonths < -6) return asOf.getFullYear() + 1;
  if (diffMonths > 6) return asOf.getFullYear() - 1;
  return asOf.getFullYear();
}

export function infer_year(
  month: number,
  _day: number,
  asOf: Date | undefined,
  content: string,
  filepath?: string,
): number {
  if (asOf) return inferYearWithAsOf(month, asOf);
  const contentMatch = /(?:^|\D)(20[2-3]\d)(?:\D|$)/.exec(content);
  if (contentMatch) return Number.parseInt(contentMatch[1], 10);
  if (filepath) {
    const fileMatch = /(20[2-3]\d)-\d{2}-\d{2}/.exec(filepath);
    if (fileMatch) return Number.parseInt(fileMatch[1], 10);
  }
  return new Date().getFullYear();
}

function weekdayNameEn(weekdayIndex: number): string {
  return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][
    weekdayIndex
  ];
}

export function check_dates(content: string, asOf?: Date, filepath?: string): Finding[] {
  const findings: Finding[] = [];
  const enYearSpans: [number, number][] = [];

  const enWithYear = /(\w+)\s+(\d{1,2}),?\s+(\d{4})\s*\((\w+)\)/gi;
  for (const match of content.matchAll(enWithYear)) {
    const month = MONTH_MAP[match[1].toLowerCase()];
    if (!month) continue;
    const day = Number.parseInt(match[2], 10);
    const year = Number.parseInt(match[3], 10);
    const stated = resolveEnglishWeekday(match[4]);
    const date = new Date(year, month - 1, day);
    if (Number.isNaN(date.getTime()) || date.getDate() !== day) continue;
    const line = lineNumberAt(content, match.index ?? 0);
    enYearSpans.push([match.index ?? 0, (match.index ?? 0) + match[0].length]);
    const actual = (date.getDay() + 6) % 7;
    if (stated !== undefined && stated !== actual) {
      findings.push({
        severity: "ERROR",
        category: "dates",
        message: `Date-weekday mismatch: ${match[0].trim()} -- actual weekday is ${weekdayNameEn(actual)}`,
        line_number: line,
      });
    }
  }

  const enNoYear = /(\w+)\s+(\d{1,2})\s*\((\w+)\)/gi;
  for (const match of content.matchAll(enNoYear)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    const overlaps = enYearSpans.some(([ys, ye]) => !(end <= ys || start >= ye));
    if (overlaps) continue;
    const month = MONTH_MAP[match[1].toLowerCase()];
    if (!month) continue;
    const before = content.slice(Math.max(0, start - 10), start);
    if (/\d{4}\s*$/.test(before)) continue;
    const day = Number.parseInt(match[2], 10);
    const inferredYear = infer_year(month, day, asOf, content, filepath);
    const date = new Date(inferredYear, month - 1, day);
    if (Number.isNaN(date.getTime()) || date.getDate() !== day) continue;
    const actual = (date.getDay() + 6) % 7;
    const stated = resolveEnglishWeekday(match[3]);
    if (stated !== undefined && stated !== actual) {
      findings.push({
        severity: "ERROR",
        category: "dates",
        message: `Date-weekday mismatch: ${match[0].trim()} -- actual weekday is ${weekdayNameEn(actual)} (inferred year: ${inferredYear})`,
        line_number: lineNumberAt(content, start),
      });
    }
  }

  const jaDate = /(\d{1,2})月(\d{1,2})日[（(]([月火水木金土日])(?:曜日)?[）)]/g;
  for (const match of content.matchAll(jaDate)) {
    const month = Number.parseInt(match[1], 10);
    const day = Number.parseInt(match[2], 10);
    const year = infer_year(month, day, asOf, content, filepath);
    const date = new Date(year, month - 1, day);
    if (Number.isNaN(date.getTime()) || date.getDate() !== day) continue;
    const actual = (date.getDay() + 6) % 7;
    const stated = WEEKDAY_MAP_JA[match[3]];
    if (stated !== undefined && stated !== actual) {
      const jaNames = ["月", "火", "水", "木", "金", "土", "日"];
      findings.push({
        severity: "WARNING",
        category: "dates",
        message: `Date-weekday mismatch: ${match[0]} -- actual weekday is ${jaNames[actual]} (inferred year: ${year})`,
        line_number: lineNumberAt(content, match.index ?? 0),
      });
    }
  }

  const jaSlash = /(\d{1,2})\/(\d{1,2})[（(]([月火水木金土日])[）)]/g;
  for (const match of content.matchAll(jaSlash)) {
    const month = Number.parseInt(match[1], 10);
    const day = Number.parseInt(match[2], 10);
    const year = infer_year(month, day, asOf, content, filepath);
    const date = new Date(year, month - 1, day);
    if (Number.isNaN(date.getTime()) || date.getDate() !== day) continue;
    const actual = (date.getDay() + 6) % 7;
    const stated = WEEKDAY_MAP_JA[match[3]];
    if (stated !== undefined && stated !== actual) {
      const jaNames = ["月", "火", "水", "木", "金", "土", "日"];
      findings.push({
        severity: "WARNING",
        category: "dates",
        message: `Date-weekday mismatch: ${match[0]} -- actual weekday is ${jaNames[actual]} (inferred year: ${year})`,
        line_number: lineNumberAt(content, match.index ?? 0),
      });
    }
  }

  return findings;
}

function find_allocation_sections(content: string): string[] {
  const sections: string[] = [];
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!/^#{1,6}\s/.test(line)) continue;
    const heading = line.replace(/^#{1,6}\s+/, "").trim().toLowerCase();
    if (heading.includes("ポジション") && !heading.includes("配分")) continue;
    if (ALLOCATION_HEADING_KEYWORDS.some((kw) => heading.includes(kw.toLowerCase()))) {
      const sectionLines: string[] = [];
      for (let j = i + 1; j < lines.length; j += 1) {
        if (/^#{1,6}\s/.test(lines[j])) break;
        sectionLines.push(lines[j]);
      }
      sections.push(sectionLines.join("\n"));
    }
  }

  let inTable = false;
  let headerLine = "";
  let tableLines: string[] = [];
  for (const line of lines) {
    const stripped = line.trim();
    if (stripped.includes("|") && !inTable) {
      inTable = true;
      headerLine = stripped;
      tableLines = [stripped];
    } else if (stripped.includes("|") && inTable) {
      tableLines.push(stripped);
    } else if (inTable) {
      if (ALLOCATION_TABLE_KEYWORDS.some((kw) => headerLine.toLowerCase().includes(kw.toLowerCase()))) {
        sections.push(tableLines.join("\n"));
      }
      inTable = false;
      headerLine = "";
      tableLines = [];
    }
  }
  if (inTable && ALLOCATION_TABLE_KEYWORDS.some((kw) => headerLine.toLowerCase().includes(kw.toLowerCase()))) {
    sections.push(tableLines.join("\n"));
  }
  return sections;
}

function extract_percentage_values(section: string): [number, number][] {
  const values: [number, number][] = [];
  const normalized = section
    .replaceAll("\uff05", "%")
    .replaceAll("\u301c", "~")
    .replaceAll("\u2013", "-")
    .replaceAll("\u2014", "-");
  const rangePat = /(\d+(?:\.\d+)?)\s*[-~]\s*(\d+(?:\.\d+)?)\s*%/g;
  const singlePat = /(\d+(?:\.\d+)?)\s*%/g;

  const spans: [number, number][] = [];
  for (const match of normalized.matchAll(rangePat)) {
    values.push([Number.parseFloat(match[1]), Number.parseFloat(match[2])]);
    spans.push([match.index ?? 0, (match.index ?? 0) + match[0].length]);
  }
  for (const match of normalized.matchAll(singlePat)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    const overlaps = spans.some(([s, e]) => (s <= start && start < e) || (s < end && end <= e));
    if (!overlaps) {
      const v = Number.parseFloat(match[1]);
      values.push([v, v]);
    }
  }
  return values;
}

export function check_allocations(content: string): Finding[] {
  const findings: Finding[] = [];
  for (const section of find_allocation_sections(content)) {
    const values = extract_percentage_values(section);
    if (values.length < 2) continue;
    const sumMins = values.reduce((acc, [min]) => acc + min, 0);
    const sumMaxs = values.reduce((acc, [, max]) => acc + max, 0);
    if (Math.abs(sumMins - sumMaxs) < 0.01) {
      if (Math.abs(sumMins - 100) > 0.5) {
        findings.push({
          severity: "WARNING",
          category: "allocations",
          message: `Allocation total: ${sumMins}% (expected ~100%)`,
        });
      }
    } else if (sumMins > 100.5 || sumMaxs < 99.5) {
      findings.push({
        severity: "WARNING",
        category: "allocations",
        message: `Allocation range [${sumMins}%-${sumMaxs}%] does not contain 100%`,
      });
    }
  }
  return findings;
}

export function check_units(content: string): Finding[] {
  const findings: Finding[] = [];
  const hasBp = /\d+\s*bp/i.test(content);
  const hasPctRate = /(?:yield|rate|利回り|金利).*?\d+(?:\.\d+)?%/i.test(content);
  if (hasBp && hasPctRate) {
    findings.push({
      severity: "INFO",
      category: "units",
      message: "Mixed use of basis points (bp) and percentage (%) for rates/yields",
    });
  }
  content.split("\n").forEach((line, index) => {
    if (INSTRUMENT_WORDS.test(line) && MOVEMENT_WORDS.test(line) && BARE_NUMBER.test(line) && !HAS_UNIT.test(line)) {
      findings.push({
        severity: "WARNING",
        category: "units",
        message: `Possible missing unit in: ${JSON.stringify(line.trim())}`,
        line_number: index + 1,
      });
    }
  });
  return findings;
}

type CheckName = "price_scale" | "notation" | "dates" | "allocations" | "units";
const ALL_CHECKS: Record<CheckName, (content: string, asOf?: Date, filepath?: string) => Finding[]> = {
  price_scale: (content) => check_price_scale(content),
  notation: (content) => check_notation(content),
  dates: (content, asOf, filepath) => check_dates(content, asOf, filepath),
  allocations: (content) => check_allocations(content),
  units: (content) => check_units(content),
};

export function run_checks(
  content: string,
  checks?: string[],
  asOf?: Date,
  filepath?: string,
): Finding[] {
  const checkList = checks ?? Object.keys(ALL_CHECKS);
  const findings: Finding[] = [];
  for (const checkName of checkList) {
    const checker = ALL_CHECKS[checkName as CheckName];
    if (checker) findings.push(...checker(content, asOf, filepath));
  }
  return sortFindings(findings);
}

function nowString(): string {
  const d = new Date();
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function timestampString(): string {
  const d = new Date();
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export function generate_report(findings: Finding[], sourceFile: string): string {
  const lines = [
    "# Data Quality Report",
    `**Source:** ${sourceFile}`,
    `**Generated:** ${nowString()}`,
    `**Total findings:** ${findings.length}`,
    "",
  ];
  if (findings.length === 0) return `${lines.join("\n")}No issues found.\n`;
  for (const severity of ["ERROR", "WARNING", "INFO"] as const) {
    const grouped = findings.filter((f) => f.severity === severity);
    if (grouped.length === 0) continue;
    lines.push(`## ${severity} (${grouped.length})`);
    for (const finding of grouped) {
      const loc = finding.line_number ? ` (line ${finding.line_number})` : "";
      lines.push(`- **[${finding.category}]**${loc}: ${finding.message}`);
      if (finding.context) lines.push(`  > \`${finding.context}\``);
    }
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

interface CliArgs {
  file?: string;
  checks?: string;
  outputDir: string;
  asOf?: string;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { outputDir: "reports/" };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--file") args.file = argv[i + 1];
    if (token === "--checks") args.checks = argv[i + 1];
    if (token === "--output-dir") args.outputDir = argv[i + 1];
    if (token === "--as-of") args.asOf = argv[i + 1];
  }
  return args;
}

function printUsageAndExit(): never {
  // eslint-disable-next-line no-console
  console.error("Usage: check_data_quality.ts --file <path> [--checks a,b,c] [--output-dir reports/] [--as-of YYYY-MM-DD]");
  process.exit(1);
}

function parseIsoDate(input: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  if (!match) return undefined;
  const y = Number.parseInt(match[1], 10);
  const m = Number.parseInt(match[2], 10);
  const d = Number.parseInt(match[3], 10);
  const parsed = new Date(y, m - 1, d);
  if (parsed.getFullYear() !== y || parsed.getMonth() !== m - 1 || parsed.getDate() !== d) {
    return undefined;
  }
  return parsed;
}

export function main(argv = process.argv.slice(2)): void {
  const args = parseArgs(argv);
  if (!args.file) printUsageAndExit();
  if (!existsSync(args.file)) {
    // eslint-disable-next-line no-console
    console.error(`Error: File not found: ${args.file}`);
    process.exit(1);
  }
  const content = readFileSync(args.file, "utf-8");
  const checks = args.checks?.split(",").map((c) => c.trim());
  let asOf: Date | undefined;
  if (args.asOf) {
    asOf = parseIsoDate(args.asOf);
    if (!asOf) {
      // eslint-disable-next-line no-console
      console.error(`Error: Invalid date format: ${args.asOf}`);
      process.exit(1);
    }
  }

  const findings = run_checks(content, checks, asOf, args.file);
  mkdirSync(args.outputDir, { recursive: true });
  const ts = timestampString();
  const jsonPath = join(args.outputDir, `data_quality_${ts}.json`);
  const mdPath = join(args.outputDir, `data_quality_${ts}.md`);
  writeFileSync(jsonPath, `${JSON.stringify(findings, null, 2)}\n`, "utf-8");
  writeFileSync(mdPath, generate_report(findings, args.file), "utf-8");

  // eslint-disable-next-line no-console
  console.log(`JSON report: ${jsonPath}`);
  // eslint-disable-next-line no-console
  console.log(`Markdown report: ${mdPath}`);
  if (findings.length > 0) {
    const errors = findings.filter((f) => f.severity === "ERROR").length;
    const warnings = findings.filter((f) => f.severity === "WARNING").length;
    const infos = findings.filter((f) => f.severity === "INFO").length;
    // eslint-disable-next-line no-console
    console.log(`\nFindings: ${errors} errors, ${warnings} warnings, ${infos} info`);
  } else {
    // eslint-disable-next-line no-console
    console.log("\nNo issues found.");
  }
}

if (process.argv[1] && basename(process.argv[1]).startsWith("check_data_quality")) {
  main();
}
