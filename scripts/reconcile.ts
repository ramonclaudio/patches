#!/usr/bin/env bun
// Keep the README ledger in sync with GitHub (merge state) and npm (release versions).
// Audit by default (exit 1 on drift), --fix applies, --json emits the machine-readable
// action list that `prw pulse` consumes. The row transforms in readme.ts stay pure.

import { $ } from "bun";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { detectImportMerge } from "./merge.ts";
import {
  firstReleasedVersionForPr,
  moveOpenRowToMerged,
  parseMergedRows,
  parseOpenRows,
  pickWasMajor,
  updateMergedRowVersion,
} from "./readme.ts";
import { cmpVer, latestOnLine, lineActive, releaseLines } from "./versions.ts";

const readmeFlag = process.argv.indexOf("--readme");
const README =
  readmeFlag !== -1 && process.argv[readmeFlag + 1]
    ? process.argv[readmeFlag + 1]
    : (process.env.PATCHES_README ?? join(import.meta.dir, "..", "README.md"));
const fix = process.argv.includes("--fix");
const json = process.argv.includes("--json");

const readme = readFileSync(README, "utf8");
// This tool is the ledger's only writer; a renamed section must fail loud, not no-op.
if (!/^## Open\b/m.test(readme) || !/^## Merged\b/m.test(readme)) {
  console.error(`reconcile: ${README} is missing the "## Open" or "## Merged" section`);
  process.exit(1);
}
let next = readme;

type Action =
  | { type: "move"; pkg: string; owner: string; repo: string; number: number; via: string | null }
  | { type: "stamp"; pkg: string; owner: string; repo: string; number: number; version: string };
const actions: Action[] = [];
const warnings: string[] = [];
const err = (e: unknown) => (e instanceof Error ? e.message : String(e));

const describe = (a: Action) =>
  a.type === "move"
    ? `move ${a.pkg} ${a.owner}/${a.repo}#${a.number} to merged (unreleased)${a.via ? ` via ${a.via}` : ""}`
    : `stamp ${a.pkg} ${a.owner}/${a.repo}#${a.number} shipped in ${a.version}`;

// ---------- merge pass ----------

for (const row of parseOpenRows(next)) {
  const pr = row.pr;
  if (!pr) continue;
  let merged = false;
  let via: string | null = null;
  try {
    const info = (await $`gh pr view ${pr.url} --json state,mergedAt,labels,comments`
      .quiet()
      .json()) as {
      state: string;
      mergedAt: string | null;
      labels: { name: string }[];
      comments: { author: { login: string }; body: string }[];
    };
    // Meta codesync merges report CLOSED with mergedAt null; the shared detector catches those.
    const imported =
      info.state === "CLOSED" && !info.mergedAt
        ? detectImportMerge(
            info.comments,
            info.labels.map((l) => l.name),
          )
        : null;
    merged = info.state === "MERGED" || !!info.mergedAt || !!imported;
    via = imported?.ref ?? null;
  } catch (e) {
    warnings.push(`gh pr view ${pr.url} failed: ${err(e)}`);
    continue;
  }
  if (!merged) continue;
  const moved = moveOpenRowToMerged(next, pr.number, "unreleased", pr.owner, pr.repo);
  if (moved && moved !== next) {
    next = moved;
    actions.push({
      type: "move",
      pkg: row.pkg,
      owner: pr.owner,
      repo: pr.repo,
      number: pr.number,
      via,
    });
  }
}

// ---------- release pass ----------

// A fix can ship on several release lines (backports below the Was pin
// included), so every row derives one version per still-active line and lists
// them all. Already-stamped rows are revisited only for lines they don't carry
// yet, so `56.0.19` grows to `56.0.19, 57.0.1` on its own (additive, no
// --force) and fully-stamped rows cost nothing. Failures are never cached: a
// transient npm outage must stay visible to the next caller that can warn.
const LINE_WINDOW_MS = 183 * 86_400_000; // a line is live if it published within ~6 months
type Registry = { versions: string[]; time: Record<string, string> };
const registryCache = new Map<string, Registry>();
const changelogCache = new Map<string, string>();

async function npmMeta(pkg: string, warn: boolean): Promise<Registry | null> {
  const hit = registryCache.get(pkg);
  if (hit) return hit;
  try {
    const res = await fetch(`https://registry.npmjs.org/${pkg.replace(/\//g, "%2F")}`);
    if (!res.ok) {
      if (warn) warnings.push(`npm registry ${pkg}: ${res.status}`);
      return null;
    }
    const json = (await res.json()) as {
      versions?: Record<string, unknown>;
      time?: Record<string, string>;
    };
    const meta = { versions: Object.keys(json.versions ?? {}), time: json.time ?? {} };
    registryCache.set(pkg, meta);
    return meta;
  } catch (e) {
    if (warn) warnings.push(`npm registry ${pkg} failed: ${err(e)}`);
    return null;
  }
}

async function changelogOf(pkg: string, version: string, warn: boolean): Promise<string | null> {
  const key = `${pkg}@${version}`;
  const hit = changelogCache.get(key);
  if (hit !== undefined) return hit;
  try {
    const res = await fetch(`https://unpkg.com/${key}/CHANGELOG.md`);
    if (!res.ok) {
      // 404s collapse to one warning per package (the Set dedupes), since a
      // package without changelogs 404s once per release line every run
      if (warn)
        warnings.push(
          res.status === 404
            ? `no CHANGELOG.md in ${pkg} tarballs on npm`
            : `unpkg CHANGELOG ${key}: ${res.status}`,
        );
      return null;
    }
    const changelog = await res.text();
    changelogCache.set(key, changelog);
    return changelog;
  } catch (e) {
    if (warn) warnings.push(`unpkg CHANGELOG ${key} failed: ${err(e)}`);
    return null;
  }
}

const now = Date.now();
for (const row of parseMergedRows(next)) {
  const pr = row.pr;
  if (row.marker === "merged" || row.was === "n/a" || !pr) continue;
  if (!pickWasMajor(row.was)) continue;
  // Fetch failures only warn for unreleased rows; stamped rows revisit quietly.
  const warn = row.marker === "unreleased";

  const current =
    row.marker === "unreleased"
      ? []
      : row.marker
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
  const stampedLines = new Set(current.map((v) => pickWasMajor(v)));

  const meta = await npmMeta(row.pkg, warn);
  if (!meta) continue;

  const hits: string[] = [];
  for (const major of releaseLines(meta.versions)) {
    if (stampedLines.has(major)) continue; // that line already carries its version
    if (!lineActive(meta.versions, meta.time, major, now, LINE_WINDOW_MS)) continue;
    const latest = latestOnLine(meta.versions, major);
    if (!latest) continue;
    const changelog = await changelogOf(row.pkg, latest, warn);
    if (!changelog) continue;
    const ver = firstReleasedVersionForPr(changelog, pr.number, major);
    if (ver) hits.push(ver);
  }
  if (hits.length === 0) continue;

  const desired = [...new Set([...current, ...hits])].sort(cmpVer).join(", ");
  const updated = updateMergedRowVersion(next, pr.number, desired, false, pr.owner, pr.repo);
  if (updated !== next) {
    next = updated;
    actions.push({
      type: "stamp",
      pkg: row.pkg,
      owner: pr.owner,
      repo: pr.repo,
      number: pr.number,
      version: desired,
    });
  }
}

// ---------- report ----------

const printWarnings = () => {
  for (const w of new Set(warnings)) console.log(`warn: ${w}`);
};
const emitJson = (applied: boolean) =>
  console.log(
    JSON.stringify({
      fix,
      applied,
      actions: actions.map((a) => ({ ...a, description: describe(a) })),
      warnings: [...new Set(warnings)],
    }),
  );

if (!fix) {
  if (json) emitJson(false);
  else {
    for (const a of actions) console.log(`would: ${describe(a)}`);
    printWarnings();
    if (actions.length === 0) console.log("ledger in sync with GitHub + npm");
  }
  process.exit(actions.length ? 1 : 0);
}

if (next !== readme) writeFileSync(README, next);
if (json) {
  emitJson(next !== readme);
} else if (next !== readme) {
  for (const a of actions) console.log(`applied: ${describe(a)}`);
  printWarnings();
} else {
  printWarnings();
  console.log("nothing to reconcile");
}
process.exit(0);
