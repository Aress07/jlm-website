/**
 * Fails the build when a physical CSS property or Tailwind utility sneaks in,
 * since those break mirroring in Arabic (RTL). See docs/DECISIONS.md.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

function walk(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full, exts));
    } else if (exts.includes(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

const FORBIDDEN: { pattern: RegExp; hint: string }[] = [
  { pattern: /\bml-\d/g, hint: "use ms- instead of ml-" },
  { pattern: /\bmr-\d/g, hint: "use me- instead of mr-" },
  { pattern: /\bpl-\d/g, hint: "use ps- instead of pl-" },
  { pattern: /\bpr-\d/g, hint: "use pe- instead of pr-" },
  { pattern: /\bleft-\d/g, hint: "use start- instead of left-" },
  { pattern: /\bright-\d/g, hint: "use end- instead of right-" },
  { pattern: /\btext-left\b/g, hint: "use text-start instead of text-left" },
  { pattern: /\btext-right\b/g, hint: "use text-end instead of text-right" },
  { pattern: /margin-left\s*:/g, hint: "use margin-inline-start" },
  { pattern: /margin-right\s*:/g, hint: "use margin-inline-end" },
  { pattern: /padding-left\s*:/g, hint: "use padding-inline-start" },
  { pattern: /padding-right\s*:/g, hint: "use padding-inline-end" },
];

const files = walk("src", [".ts", ".tsx", ".css"]);

let failed = false;

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, i) => {
    for (const { pattern, hint } of FORBIDDEN) {
      if (pattern.test(line)) {
        failed = true;
        console.error(
          `${path.normalize(file)}:${i + 1}: forbidden physical property (${hint})`,
        );
        console.error(`  ${line.trim()}`);
      }
      pattern.lastIndex = 0;
    }
  });
}

if (failed) {
  console.error(
    "\nLogical-property check failed. Use logical CSS/Tailwind utilities (ms-, me-, ps-, pe-, start-, end-) so RTL mirrors correctly.",
  );
  process.exit(1);
}

console.log(`Logical-property check passed (${files.length} files scanned).`);
