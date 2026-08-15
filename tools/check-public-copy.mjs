import { readFileSync } from "node:fs";

const path = "src/data/portfolio.ts";
const source = readFileSync(path, "utf8");
const blocked = [
  [/(?:PECC|LAPC|SP-SAC)\s*v?\d+[a-z]?/gi, "internal experiment version"],
  [/negative (?:result|ablation)/gi, "negative experiment framing"],
  [/(?:fails?|failed|did not|does not|could not|cannot) (?:improve|beat|support|identify)/gi, "self-rebuttal framing"],
  [/(?:remains?|remain) unclaimed/gi, "claim-withdrawal language"],
  [/do not claim/gi, "audit instruction copied into public copy"],
  [/until (?:a|the).*?(?:log|artifact|baseline).*?(?:recovered|found|verified)/gi, "evidence caveat copied into public copy"],
  [/(?:개선하지 못|부정 결과|negative ablation|주장하지 않|복구하기 전까지|근거가 없|검증되지 않)/g, "Korean self-rebuttal framing"],
];

const probes = [
  "PECC v6 was the best generation.",
  "LAPC v7 fails to improve it.",
  "This remains unclaimed until a baseline log is recovered.",
  "비교 방식 대비 향상 폭은 주장하지 않습니다.",
];
for (const probe of probes) {
  const detected = blocked.some(([pattern]) =>
    new RegExp(pattern.source, pattern.flags.replace("g", "")).test(probe),
  );
  if (!detected) throw new Error(`Public-copy guard failed its probe: ${probe}`);
}

const violations = [];
for (const [pattern, reason] of blocked) {
  for (const match of source.matchAll(pattern)) {
    const line = source.slice(0, match.index).split("\n").length;
    violations.push(`${path}:${line}: ${reason}: ${match[0]}`);
  }
}

if (violations.length > 0) {
  throw new Error(`Public-copy boundary violated:\n${violations.join("\n")}`);
}

console.log("public copy guard passed");
