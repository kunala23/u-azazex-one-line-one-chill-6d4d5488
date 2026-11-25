// One Line, One Chill — u-azazex-one-line-one-chill-6d4d5488
// A single-sentence horror line, written to /output/entry.txt.
// The gate requires UTF-8 text of 1-200 characters, not only whitespace.

// The line: a hospice log, a dead mother, and handwriting the narrator
// does not remember writing. Concrete (log, 3 a.m., handwriting), one
// sentence, dread that outlasts the line — and the last word lands it.
const LINE =
  "The night nurse logged my mother's last words at 3 AM, but my mother died in 2019, and the handwriting in the log is mine.";

const OUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// The gate counts characters; count Unicode code points, not UTF-16 units,
// so the check matches what a reader (and the scorer) sees.
function charCount(text: string): number {
  return [...text].length;
}

function validate(line: string): void {
  const trimmed = line.trim();
  if (trimmed.length === 0) fail("line is empty or whitespace only");
  if (charCount(trimmed) !== charCount(line)) {
    fail("line has leading or trailing whitespace");
  }
  if (charCount(line) > MAX_CHARS) {
    fail(`line is ${charCount(line)} characters, over the 200 limit`);
  }
  // Exactly one sentence: a single terminal period, no other sentence ends.
  const terminators = (line.match(/[.!?]/g) ?? []).length;
  if (terminators !== 1 || !line.endsWith(".")) {
    fail("line must be exactly one sentence ending with a period");
  }
  if (line.includes("\n") || line.includes("\r")) {
    fail("line must be a single line");
  }
}

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

function main(): void {
  validate(LINE);

  // /output may not exist in the grading sandbox; create it first.
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, LINE, "utf8");

  // Read back and re-check, so a silent write failure cannot pass.
  const written = readFileSync(OUT_PATH, "utf8");
  if (written !== LINE) fail("read-back does not match the line");
  validate(written);

  console.log(`wrote ${charCount(written)} characters to ${OUT_PATH}`);
  console.log(written);
}

main();
