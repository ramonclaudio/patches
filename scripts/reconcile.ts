#!/usr/bin/env bun
// reconcile.ts — keep the README ledger in sync with GitHub + npm.
//
//   bun scripts/reconcile.ts        audit: report drift, exit 1 when any
//   bun scripts/reconcile.ts --fix  apply: move merged PRs, stamp shipped versions
//
// GitHub is the truth for merge state. npm plus the package CHANGELOG are the truth for which
// release a merged fix shipped in. The README ledger is the data file. All I/O lives here; the
// row transforms in readme.ts stay pure.

import { $ } from "bun";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  firstReleasedVersionForPr,
  moveOpenRowToMerged,
  parseMergedRows,
  parseOpenRows,
  pickWasMajor,
  updateMergedRowVersion,
} from "./readme.ts";

const readmeFlag = process.argv.indexOf("--readme");
const README =
  readmeFlag !== -1 && process.argv[readmeFlag + 1]
    ? process.argv[readmeFlag + 1]
    : process.env.PATCHES_README ?? join(import.meta.dir, "..", "README.md");
const fix = process.argv.includes("--fix");

const readme = readFileSync(README, "utf8");
let next = readme;
const actions: string[] = [];
const warnings: string[] = [];
const err = (e: unknown) => (e instanceof Error ? e.message : String(e));

// Highest semver wins. Prerelease tokens (canary) parse to NaN and get skipped, so this only
// orders stable versions cleanly, which is all we sort.
function cmpVer(a: string, b: string): number {
  const pa = a.split(/[.+-]/).map(Number);
  const pb = b.split(/[.+-]/).map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (Number.isNaN(x) || Number.isNaN(y)) continue;
    if (x !== y) return x - y;
  }
  return 0;
}

// ---------- merge pass: an Open PR merged on GitHub moves to the Merged table ----------

const merges: { owner: string; repo: string; number: number; url: string; pkg: string }[] = [];
for (const row of parseOpenRows(next)) {
  const pr = row.pr;
  if (!pr) continue;
  try {
    const info = (await $`gh pr view ${pr.url} --json state,mergedAt`.quiet().json()) as {
      state: string;
      mergedAt: string | null;
    };
    if (info.state === "MERGED" || info.mergedAt) merges.push({ ...pr, pkg: row.pkg });
  } catch (e) {
    warnings.push(`gh pr view ${pr.url} failed: ${err(e)}`);
  }
}
for (const m of merges) {
  const moved = moveOpenRowToMerged(next, m.number, "unreleased", m.owner, m.repo);
  if (moved && moved !== next) {
    next = moved;
    actions.push(`move ${m.pkg} ${m.owner}/${m.repo}#${m.number} to merged (unreleased)`);
  }
}

// ---------- release pass: an unreleased merged fix that shipped in an npm version ----------

for (const row of parseMergedRows(next)) {
  const pr = row.pr;
  if (row.marker !== "unreleased" || row.was === "n/a" || !pr) continue;
  const major = pickWasMajor(row.was);
  if (!major) continue;

  let versions: string[];
  try {
    const res = await fetch(`https://registry.npmjs.org/${row.pkg.replace(/\//g, "%2F")}`);
    if (!res.ok) {
      warnings.push(`npm registry ${row.pkg}: ${res.status}`);
      continue;
    }
    versions = Object.keys(((await res.json()) as { versions?: Record<string, unknown> }).versions ?? {});
  } catch (e) {
    warnings.push(`npm registry ${row.pkg} failed: ${err(e)}`);
    continue;
  }

  const inMajor = versions.filter(v => pickWasMajor(v) === major);
  const stable = inMajor.filter(v => !v.includes("-"));
  const pool = (stable.length ? stable : inMajor).sort(cmpVer);
  const latestOnLine = pool.at(-1);
  if (!latestOnLine) {
    warnings.push(`no ${major}.x version of ${row.pkg} on npm`);
    continue;
  }

  let changelog: string;
  try {
    const res = await fetch(`https://unpkg.com/${row.pkg}@${latestOnLine}/CHANGELOG.md`);
    if (!res.ok) {
      warnings.push(`unpkg CHANGELOG ${row.pkg}@${latestOnLine}: ${res.status}`);
      continue;
    }
    changelog = await res.text();
  } catch (e) {
    warnings.push(`unpkg CHANGELOG ${row.pkg}@${latestOnLine} failed: ${err(e)}`);
    continue;
  }

  const ver = firstReleasedVersionForPr(changelog, pr.number, major);
  if (!ver) continue;
  const updated = updateMergedRowVersion(next, pr.number, ver, false, pr.owner, pr.repo);
  if (updated !== next) {
    next = updated;
    actions.push(`stamp ${row.pkg} ${pr.owner}/${pr.repo}#${pr.number} shipped in ${ver}`);
  }
}

// ---------- report ----------

const printWarnings = () => {
  for (const w of warnings) console.log(`warn: ${w}`);
};

if (!fix) {
  if (actions.length) {
    for (const a of actions) console.log(`would: ${a}`);
    printWarnings();
    process.exit(1);
  }
  printWarnings();
  console.log("ledger in sync with GitHub + npm");
  process.exit(0);
}

if (next !== readme) {
  writeFileSync(README, next);
  for (const a of actions) console.log(`applied: ${a}`);
  printWarnings();
} else {
  printWarnings();
  console.log("nothing to reconcile");
}
process.exit(0);
