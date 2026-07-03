// readme.ts — pure transforms for the public patches README ledger.
//
// Two tables, split by merge status:
//   ## Open    — PRs still in review.  Columns: Package | Version | Fix | PR
//   ## Merged  — merged PRs.           Columns: Package | Was | Fix | Fixed in
//
// A merged PR's "Fixed in" is `unreleased` until the fix ships in a published version, then the
// release version. Version-less fixes (CI, docs) render bare markers instead of a version.

// Version-less markers render bare; real versions get backticks.
export function fmtVersion(version: string): string {
  return version === "merged" || version === "n/a" || version === "unreleased" ? version : `\`${version}\``;
}

// A "## <header>" block up to the next "## " header or end of file. The EOF branch keeps the last
// section's rows (today "## Usage" trails "## Merged", but that ordering shouldn't be load-bearing).
const sectionRe = (header: string) =>
  new RegExp(`^## ${header}\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m");

export function moveOpenRowToMerged(
  readme: string,
  prNumber: number,
  version: string,
  owner?: string,
  repo?: string,
): string | null {
  const openMatch = readme.match(sectionRe("Open"));
  const mergedMatch = readme.match(sectionRe("Merged"));
  if (!openMatch || !mergedMatch) return null;

  // Already in Merged? Never append a duplicate, even if a stale Open row for the same PR lingers.
  if (mergedMatch[1].split("\n").some(l => rowMatchesPr(l, prNumber, owner, repo))) return readme;

  const openSection = openMatch[1];
  const lines = openSection.split("\n");

  // Locate the row whose last (PR) cell carries this PR
  const rowIdx = lines.findIndex(l => rowMatchesPr(l, prNumber, owner, repo));
  if (rowIdx === -1) return null;

  const cells = parseTableRow(lines[rowIdx]);
  if (cells.length !== 4) return null;
  const [pkgCell, wasCell, fixCell, prCell] = cells;

  // Build Merged row: Package | Was | Fix | Fixed in. A version-less fix (CI, docs) ships with
  // the merge and has no release to wait for, so it reads "merged" rather than "unreleased".
  const marker = version === "unreleased" && wasCell.trim() === "n/a" ? "merged" : version;
  const fixedInCell = `${fmtVersion(marker)} (${prCell.trim()})`;
  const newRow = `| ${pkgCell.trim()} | ${wasCell.trim()} | ${fixCell.trim()} | ${fixedInCell} |`;

  // Remove the row from Open
  const newOpenSection = lines.filter((_, i) => i !== rowIdx).join("\n");

  // Insert newRow at the top of Merged (after the header separator)
  const mergedLines = mergedMatch[1].split("\n");
  const sepIdx = mergedLines.findIndex(l => /^\|\s*:?-+/.test(l));
  if (sepIdx === -1) return null;
  const newMergedSection = [...mergedLines.slice(0, sepIdx + 1), newRow, ...mergedLines.slice(sepIdx + 1)].join("\n");

  // Replace via functions so a `$` in row text isn't read as a replacement pattern.
  return readme
    .replace(openSection, () => newOpenSection)
    .replace(mergedMatch[1], () => newMergedSection);
}

// Rewrite the "Fixed in" version of a row already in Merged. Updates when the row is still
// unreleased, or when force is set (correcting one real version to another). No-op when the
// version already matches, or when it differs and force is false. Pass owner/repo so a bare PR
// number reused by another repo can't select the wrong row.
export function updateMergedRowVersion(
  readme: string,
  prNumber: number,
  version: string,
  force: boolean,
  owner?: string,
  repo?: string,
): string {
  const mergedMatch = readme.match(sectionRe("Merged"));
  if (!mergedMatch) return readme;
  const lines = mergedMatch[1].split("\n");
  const idx = lines.findIndex(l => rowMatchesPr(l, prNumber, owner, repo));
  if (idx === -1) return readme;
  const cells = parseTableRow(lines[idx]);
  if (cells.length !== 4) return readme;
  const [pkgCell, wasCell, fixCell, fixedInCell] = cells;
  const cell = fixedInCell.trim();
  const parenIdx = cell.indexOf("("); // splits "<version> ([repo#NN](url))"
  if (parenIdx === -1) return readme;
  const ref = cell.slice(parenIdx); // keep the trailing ([repo#NN](url)) reference
  const current = cell.slice(0, parenIdx).trim().replace(/`/g, "");
  if (current === version) return readme; // already at this version
  if (current !== "unreleased" && !force) return readme; // a real version needs --force to change
  const newRow = `| ${pkgCell.trim()} | ${wasCell.trim()} | ${fixCell.trim()} | ${fmtVersion(version)} ${ref} |`;
  if (newRow === lines[idx]) return readme;
  const newMerged = [...lines.slice(0, idx), newRow, ...lines.slice(idx + 1)].join("\n");
  return readme.replace(mergedMatch[1], () => newMerged);
}

// Split a table row into cells on unescaped pipes outside a `code span`. A Fix cell can hold a TS
// union (`string | number`) or a shell pipe in backticks, or an escaped \| — neither ends a cell.
export function parseTableRow(row: string): string[] {
  const trimmed = row.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return [];
  const inner = trimmed.slice(1, -1);
  const cells: string[] = [];
  let cur = "";
  let inTick = false;
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (ch === "\\" && i + 1 < inner.length) {
      cur += ch + inner[i + 1]; // keep the escape verbatim so the cell round-trips
      i++;
      continue;
    }
    if (ch === "`") inTick = !inTick;
    if (ch === "|" && !inTick) {
      cells.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  cells.push(cur);
  return cells;
}

// Match a row by its PR ref in the LAST cell only (PR column / "Fixed in"), never the
// description, so a row that cites another PR (e.g. "Supersedes #22") isn't false-matched. With
// owner/repo, demand the exact /OWNER/REPO/pull/N link so a bare #N reused by another repo (PR
// numbers reset per repo) can't match.
export function rowMatchesPr(line: string, prNumber: number, owner?: string, repo?: string): boolean {
  const cells = parseTableRow(line);
  if (cells.length !== 4) return false;
  const last = cells[3];
  if (owner && repo) return last.includes(`/${owner}/${repo}/pull/${prNumber})`);
  return [`/pull/${prNumber})`, `#${prNumber})`, `#${prNumber}]`].some(p => last.includes(p));
}

// Compact +/- line diff for dry-run previews.
export function diffSummary(before: string, after: string): string {
  const bLines = before.split("\n");
  const aLines = after.split("\n");
  const out: string[] = [];
  const max = Math.max(bLines.length, aLines.length);
  let i = 0, j = 0;
  while (i < max || j < max) {
    if (bLines[i] === aLines[j]) { i++; j++; continue; }
    if (bLines[i] !== undefined && !aLines.includes(bLines[i])) {
      out.push(`- ${bLines[i]}`);
      i++;
      continue;
    }
    if (aLines[j] !== undefined && !bLines.includes(aLines[j])) {
      out.push(`+ ${aLines[j]}`);
      j++;
      continue;
    }
    i++; j++;
  }
  return out.slice(0, 20).join("\n");
}

// ---------- readers for the reconciler ----------

type Pr = { owner: string; repo: string; number: number; url: string };

// Pull the last github.com/OWNER/REPO/pull/N link out of a cell. A row can cite other PRs in
// prose, so the caller passes only the cell that owns the row's own PR (the PR or Fixed-in cell).
function parsePrLink(cell: string): Pr | null {
  const all = [...cell.matchAll(/https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/pull\/(\d+)/g)];
  if (!all.length) return null;
  const [, owner, repo, num] = all[all.length - 1];
  return { owner, repo, number: Number(num), url: `https://github.com/${owner}/${repo}/pull/${num}` };
}

// The data rows of a "## <header>" section: lines that carry a [`pkg`](path) package cell.
function sectionRows(readme: string, header: "Open" | "Merged"): string[][] {
  const m = readme.match(sectionRe(header));
  if (!m) return [];
  const rows: string[][] = [];
  for (const line of m[1].split("\n")) {
    const cells = parseTableRow(line);
    if (cells.length === 4 && /\[`[^`]+`\]/.test(cells[0])) rows.push(cells);
  }
  return rows;
}

const pkgName = (cell: string): string => cell.match(/\[`([^`]+)`\]/)![1];

// Parse the "## Open" table. pkg is the first-cell backtick name, version the second cell without
// backticks, pr the /pull/N link in the last (PR) cell (null when the row has no link yet).
export function parseOpenRows(
  readme: string,
): { pkg: string; version: string; pr: Pr | null }[] {
  return sectionRows(readme, "Open").map(cells => ({
    pkg: pkgName(cells[0]),
    version: cells[1].trim().replace(/`/g, ""),
    pr: parsePrLink(cells[3]),
  }));
}

// Parse the "## Merged" table. marker is the token before " (" in the Fixed-in cell without
// backticks ("unreleased" | "merged" | "n/a" | a version), pr the trailing /pull/N link.
export function parseMergedRows(
  readme: string,
): { pkg: string; was: string; marker: string; pr: Pr | null }[] {
  return sectionRows(readme, "Merged").map(cells => {
    const fixedIn = cells[3].trim();
    const paren = fixedIn.indexOf(" (");
    const marker = (paren === -1 ? fixedIn : fixedIn.slice(0, paren)).trim().replace(/`/g, "");
    return {
      pkg: pkgName(cells[0]),
      was: cells[1].trim().replace(/`/g, ""),
      marker,
      pr: parsePrLink(cells[3]),
    };
  });
}

// The published version whose CHANGELOG section cites this PR. Changelogs run newest-first, so a
// PR named again in a later section (a follow-up, a revert, a "supersedes #N" cross-reference)
// must not win. Walk every version header, skip Unpublished/Unreleased, and keep the LAST (oldest,
// so the actual ship) citing section. Pass `major` to scope to one release line, so a backport
// cited on two SDK lines stamps the version on the row's own line, not the other. Recognizes bare,
// `v`-prefixed, and keep-a-changelog `[x.y.z]` headers. null when nothing cites it.
export function firstReleasedVersionForPr(
  changelog: string,
  prNumber: number,
  major: string | null = null,
): string | null {
  const lines = changelog.split("\n");
  const cite = new RegExp(`(?:#|/pull/)${prNumber}\\b`);
  const versionHeader = /^#{1,3}\s+\[?v?(\d[\w.+-]*)/;
  const boundary = /^#{1,3}\s+\[?v?(?:\d|Unpublished|Unreleased)/i;

  const bounds: number[] = [];
  for (let i = 0; i < lines.length; i++) if (boundary.test(lines[i])) bounds.push(i);

  let shipped: string | null = null;
  for (let b = 0; b < bounds.length; b++) {
    const header = lines[bounds[b]].match(versionHeader);
    if (!header) continue; // an Unpublished/Unreleased block, never a shipped version
    const version = header[1];
    if (major && pickWasMajor(version) !== major) continue; // a different release line
    const end = bounds[b + 1] ?? lines.length;
    const body = lines.slice(bounds[b] + 1, end).join("\n");
    if (cite.test(body)) shipped = version; // keep overwriting: the last match is the oldest ship
  }
  return shipped;
}

// Major prefix of a "Was" version, for scoping which npm major to scan: "57.0.2" -> "57",
// "56.0.0-canary-x" -> "56", "v0.85.3" -> "0". null when it isn't semver-ish (e.g. "n/a").
export function pickWasMajor(was: string): string | null {
  return was.match(/^v?(\d+)(?:[.-]|$)/)?.[1] ?? null;
}
