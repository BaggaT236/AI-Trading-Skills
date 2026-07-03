import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  check_allocations,
  check_dates,
  check_notation,
  check_price_scale,
  check_units,
  generate_report,
  infer_year,
  main,
  run_checks,
} from "../check_data_quality";

describe("check_price_scale", () => {
  it("flags GLD with futures-scale price", () => {
    const findings = check_price_scale("GLD: $2,800");
    expect(findings.some((f) => f.severity === "WARNING" && f.message.includes("GLD"))).toBe(true);
  });

  it("does not flag consistent GLD/SPY prices", () => {
    const findings = check_price_scale("GLD: $268\nSPY: $580");
    expect(findings).toHaveLength(0);
  });
});

describe("check_notation", () => {
  it("flags mixed notation", () => {
    const findings = check_notation("Gold is higher. GLD reached $268. 金は上昇中。");
    expect(findings.some((f) => f.category === "notation")).toBe(true);
  });
});

describe("check_dates", () => {
  it("flags weekday mismatch for English date with year", () => {
    const findings = check_dates("January 1, 2026 (Monday)");
    expect(findings.some((f) => f.severity === "ERROR" && f.category === "dates")).toBe(true);
  });

  it("uses as-of date for year inference", () => {
    const findings = check_dates("Jan 1 (Thu)", new Date(2026, 0, 15));
    expect(findings).toHaveLength(0);
  });

  it("extracts year from filename when present", () => {
    const year = infer_year(1, 1, undefined, "no year here", "/reports/2025-03-15-weekly.md");
    expect(year).toBe(2025);
  });
});

describe("check_allocations", () => {
  it("flags sum over 100 in allocation table", () => {
    const content =
      "| Asset | Allocation |\n|---|---|\n| Stocks | 60% |\n| Bonds | 30% |\n| Cash | 20% |\n";
    const findings = check_allocations(content);
    expect(findings.some((f) => f.category === "allocations")).toBe(true);
  });

  it("ignores non-allocation percentages", () => {
    const findings = check_allocations("The probability is 35% and momentum at 20%.");
    expect(findings).toHaveLength(0);
  });
});

describe("check_units", () => {
  it("flags missing unit near instrument movement", () => {
    const findings = check_units("Gold moved 50 today");
    expect(findings.some((f) => f.category === "units" && f.severity === "WARNING")).toBe(true);
  });
});

describe("run_checks and report", () => {
  it("sorts by severity", () => {
    const content = "January 1, 2026 (Monday)\nGLD: $2,800\nyield rose 25bp. rate increased 0.25%";
    const findings = run_checks(content);
    expect(findings[0].severity).toBe("ERROR");
  });

  it("generates markdown report", () => {
    const report = generate_report(
      [
        { severity: "ERROR", category: "dates", message: "Date mismatch", line_number: 5 },
        { severity: "WARNING", category: "price_scale", message: "Price issue" },
      ],
      "test.md",
    );
    expect(report).toContain("# Data Quality Report");
    expect(report).toContain("**Source:** test.md");
  });
});

describe("CLI main", () => {
  it("writes report files in advisory mode", () => {
    const root = mkdtempSync(join(tmpdir(), "dq-check-"));
    const inputPath = join(root, "input.md");
    const outputPath = join(root, "reports");
    writeFileSync(inputPath, "GLD: $2,800\n", "utf-8");
    expect(() => main(["--file", inputPath, "--output-dir", outputPath])).not.toThrow();
    rmSync(root, { recursive: true, force: true });
  });
});
