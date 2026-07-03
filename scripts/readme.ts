export function fmtVersion(version: string): string {
  return version === "merged" || version === "n/a" || version === "unreleased" ? version : `\`${version}\``;
}

// A ## section body, up to the next ## header or end of file.
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

  // Never append a duplicate when a stale Open row lingers for an already-merged PR.
  if (mergedMatch[1].split("\n").some(l => rowMatchesPr(l, prNumber, owner, repo))) return readme;

  const openSection = openMatch[1];
  const lines = openSection.split("\n");
  const rowIdx = lines.findIndex(l => rowMatchesPr(l, prNumber, owner, repo));
  if (rowIdx === -1) return null;

  const cells = parseTableRow(lines[rowIdx]);
  if (cells.length !== 4) return null;
  const [pkgCell, wasCell, fixCell, prCell] = cells;

  // A version-less fix (CI, docs) ships with the merge, so it reads "merged", not "unreleased".
  const marker = version === "unreleased" && wasCell.trim() === "n/a" ? "merged" : version;
  const fixedInCell = `${fmtVersion(marker)} (${prCell.trim()})`;
  const newRow = `| ${pkgCell.trim()} | ${wasCell.trim()} | ${fixCell.trim()} | ${fixedInCell} |`;

  const newOpenSection = lines.filter((_, i) => i !== rowIdx).join("\n");
  const mergedLines = mergedMatch[1].split("\n");
  const sepIdx = mergedLines.findIndex(l => /^\|\s*:?-+/.test(l));
  if (sepIdx === -1) return null;
  const newMergedSection = [...mergedLines.slice(0, sepIdx + 1), newRow, ...mergedLines.slice(sepIdx + 1)].join("\n");

  // Replace via functions so a `$` in row text isn't read as a replacement pattern.
  return readme
    .replace(openSection, () => newOpenSection)
    .replace(mergedMatch[1], () => newMergedSection);
}

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
  const parenIdx = cell.indexOf("(");
  if (parenIdx === -1) return readme;
  const ref = cell.slice(parenIdx);
  const current = cell.slice(0, parenIdx).trim().replace(/`/g, "");
  if (current === version) return readme;
  if (current !== "unreleased" && !force) return readme; // a real version only changes under --force
  const newRow = `| ${pkgCell.trim()} | ${wasCell.trim()} | ${fixCell.trim()} | ${fmtVersion(version)} ${ref} |`;
  if (newRow === lines[idx]) return readme;
  const newMerged = [...lines.slice(0, idx), newRow, ...lines.slice(idx + 1)].join("\n");
  return readme.replace(mergedMatch[1], () => newMerged);
}

// Split on unescaped pipes outside `code spans`, so a `string | number` union in a Fix cell holds.
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
      cur += ch + inner[i + 1];
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

// Match on the last cell only, and on the full /OWNER/REPO/pull/N link when given, so a bare #N
// reused by another repo (PR numbers reset per repo) can't false-match.
export function rowMatchesPr(line: string, prNumber: number, owner?: string, repo?: string): boolean {
  const cells = parseTableRow(line);
  if (cells.length !== 4) return false;
  const last = cells[3];
  if (owner && repo) return last.includes(`/${owner}/${repo}/pull/${prNumber})`);
  return [`/pull/${prNumber})`, `#${prNumber})`, `#${prNumber}]`].some(p => last.includes(p));
}

type Pr = { owner: string; repo: string; number: number; url: string };

// The last /pull/N link in a cell; callers pass only the cell that owns the row's PR.
function parsePrLink(cell: string): Pr | null {
  const all = [...cell.matchAll(/https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/pull\/(\d+)/g)];
  if (!all.length) return null;
  const [, owner, repo, num] = all[all.length - 1];
  return { owner, repo, number: Number(num), url: `https://github.com/${owner}/${repo}/pull/${num}` };
}

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

export function parseOpenRows(
  readme: string,
): { pkg: string; version: string; pr: Pr | null }[] {
  return sectionRows(readme, "Open").map(cells => ({
    pkg: pkgName(cells[0]),
    version: cells[1].trim().replace(/`/g, ""),
    pr: parsePrLink(cells[3]),
  }));
}

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

// Changelogs run newest-first and a PR can be named again in a later section (follow-up, revert,
// "supersedes #N"), so keep the LAST (oldest, actual-ship) citing section. `major` scopes to one
// release line so a backport stamps the row's own line.
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
    if (!header) continue; // an Unpublished/Unreleased block
    const version = header[1];
    if (major && pickWasMajor(version) !== major) continue;
    const end = bounds[b + 1] ?? lines.length;
    const body = lines.slice(bounds[b] + 1, end).join("\n");
    if (cite.test(body)) shipped = version;
  }
  return shipped;
}

export function pickWasMajor(was: string): string | null {
  return was.match(/^v?(\d+)(?:[.-]|$)/)?.[1] ?? null;
}
