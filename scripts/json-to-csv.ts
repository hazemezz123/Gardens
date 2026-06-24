import { readFileSync, writeFileSync } from "fs";

interface AssertionResult {
  ancestorTitles: string[];
  fullName: string;
  status: string;
  title: string;
  duration: number;
}

interface TestFileResult {
  name: string;
  assertionResults: AssertionResult[];
}

interface VitestReport {
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  testResults: TestFileResult[];
}

const resultsPath = "./src/__tests__/test-results.json";
const outPath = "./test-report.csv";

const raw = readFileSync(resultsPath, "utf-8");
const report: VitestReport = JSON.parse(raw);

const rows: string[][] = [
  ["File", "Suite", "Test", "Status", "Duration (ms)"],
];

for (const file of report.testResults) {
  for (const t of file.assertionResults) {
    const suite = t.ancestorTitles[0] || "";
    rows.push([
      file.name.replace(/\\/g, "/").split("/").pop() || file.name,
      suite,
      t.title,
      t.status === "passed" ? "PASS" : "FAIL",
      String(Math.round(t.duration)),
    ]);
  }
}

const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
writeFileSync(outPath, csv, "utf-8");

const passed = report.numPassedTests;
const failed = report.numFailedTests;
const total = report.numTotalTests;

console.log(`\nCSV report -> ${outPath}`);
console.log(`Results: ${passed}/${total} passed, ${failed} failed`);
