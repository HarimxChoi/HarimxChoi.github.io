import { readFileSync } from "node:fs";

const targets = ["README.md", "README.ko.md", "src/data/portfolio.ts"];
const blocked = [
  /exhaustive portfolio/i,
  /complete portfolio/i,
  /all (?:projects|work) (?:are|is) complete/i,
  /모든 (?:프로젝트|작업)(?:이|가)? (?:완료|완성)/,
  /완전한 포트폴리오/,
];

const violations = [];
for (const path of targets) {
  const source = readFileSync(path, "utf8");
  for (const pattern of blocked) {
    if (pattern.test(source)) violations.push(`${path}: ${pattern}`);
  }
}

if (violations.length > 0) {
  throw new Error(`Premature-closure language found:\n${violations.join("\n")}`);
}

console.log("portfolio expansion guard passed");
