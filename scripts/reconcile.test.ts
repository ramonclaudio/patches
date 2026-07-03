import { expect, test } from "bun:test";
import {
  firstReleasedVersionForPr,
  moveOpenRowToMerged,
  parseMergedRows,
  parseOpenRows,
  parseTableRow,
  pickWasMajor,
  updateMergedRowVersion,
} from "./readme.ts";

// One Open PR with a link, one with an issue link in the Fix cell plus its own pull link, one
// with no link yet. One unreleased Merged row, one versioned, one version-less "merged".
const README = `# patches

## Open

PRs still open upstream.

| Package | Version | Fix | PR |
| :--- | :--- | :--- | :--- |
| [\`expo-router\`](packages/expo-router/) | \`57.0.3\` | Add testID prop. | [expo/expo#47472](https://github.com/expo/expo/pull/47472) |
| [\`hermes\`](packages/hermes/) | n/a | Cherry-pick fix. Root cause [facebook/hermes#1761](https://github.com/facebook/hermes/issues/1761). | [facebook/hermes#2046](https://github.com/facebook/hermes/pull/2046) |
| [\`localonly\`](packages/localonly/) | \`1.0.0\` | A fix with no PR link yet. | draft |

## Merged

Merged upstream.

| Package | Was | Fix | Fixed in |
| :--- | :--- | :--- | :--- |
| [\`@expo/ui\`](packages/@expo/ui/) | \`57.0.2\` | Add strokeBorder. | unreleased ([expo/expo#47426](https://github.com/expo/expo/pull/47426)) |
| [\`better-auth\`](packages/better-auth/) | \`1.6.2\` | Add atomListeners. Same family as [#9072](https://github.com/better-auth/better-auth/pull/9072). | \`1.6.5\` ([better-auth/better-auth#9087](https://github.com/better-auth/better-auth/pull/9087)) |
| [\`hermes\`](packages/hermes/) | n/a | Swap hardcoded dir. | merged ([facebook/hermes#2047](https://github.com/facebook/hermes/pull/2047)) |

## Usage

end.
`;

const CHANGELOG = `# Changelog

## Unpublished

### 🐛 Bug fixes

- Something not shipped yet ([#99999](https://github.com/expo/expo/pull/99999))

## 57.0.3 — 2026-06-01

### 🎉 New features

- Add strokeBorder modifier ([#47426](https://github.com/expo/expo/pull/47426))

### 🐛 Bug fixes

- Fix something else ([#47000](https://github.com/expo/expo/pull/47000))

## 57.0.2 — 2026-05-01

### 🐛 Bug fixes

- Older fix ([#40000](https://github.com/expo/expo/pull/40000))
`;

test("parseOpenRows extracts pkg, version, and pr", () => {
  const rows = parseOpenRows(README);
  expect(rows.length).toBe(3);
  expect(rows[0]).toEqual({
    pkg: "expo-router",
    version: "57.0.3",
    pr: { owner: "expo", repo: "expo", number: 47472, url: "https://github.com/expo/expo/pull/47472" },
  });
});

test("parseOpenRows returns null pr when the row has no link", () => {
  const rows = parseOpenRows(README);
  expect(rows[2].pkg).toBe("localonly");
  expect(rows[2].pr).toBeNull();
});

test("parseOpenRows reads the PR cell, not an issue link in the Fix cell", () => {
  const hermes = parseOpenRows(README)[1];
  expect(hermes.pkg).toBe("hermes");
  expect(hermes.version).toBe("n/a");
  expect(hermes.pr?.number).toBe(2046);
});

test("parseMergedRows extracts pkg, was, and pr", () => {
  const rows = parseMergedRows(README);
  expect(rows.length).toBe(3);
  expect(rows[0].pkg).toBe("@expo/ui");
  expect(rows[0].was).toBe("57.0.2");
  expect(rows[0].pr?.number).toBe(47426);
});

test("parseMergedRows reads an unreleased marker", () => {
  expect(parseMergedRows(README)[0].marker).toBe("unreleased");
});

test("parseMergedRows strips backticks off a version marker", () => {
  const row = parseMergedRows(README)[1];
  expect(row.marker).toBe("1.6.5");
  // the row's own PR is the trailing Fixed-in link, not the #9072 cited in the Fix cell
  expect(row.pr?.number).toBe(9087);
});

test("parseMergedRows reads a version-less merged marker", () => {
  const row = parseMergedRows(README)[2];
  expect(row.was).toBe("n/a");
  expect(row.marker).toBe("merged");
});

test("firstReleasedVersionForPr finds the citing version", () => {
  expect(firstReleasedVersionForPr(CHANGELOG, 47426)).toBe("57.0.3");
  expect(firstReleasedVersionForPr(CHANGELOG, 40000)).toBe("57.0.2");
});

test("firstReleasedVersionForPr skips the Unpublished block", () => {
  expect(firstReleasedVersionForPr(CHANGELOG, 99999)).toBeNull();
});

test("firstReleasedVersionForPr returns null when nothing cites the PR", () => {
  expect(firstReleasedVersionForPr(CHANGELOG, 12345)).toBeNull();
});

test("firstReleasedVersionForPr matches whole PR numbers only", () => {
  // 4742 is a prefix of 47426 in the changelog, must not match
  expect(firstReleasedVersionForPr(CHANGELOG, 4742)).toBeNull();
});

test("pickWasMajor pulls the major or null", () => {
  expect(pickWasMajor("57.0.2")).toBe("57");
  expect(pickWasMajor("56.0.0-canary-20260506-964f25d")).toBe("56");
  expect(pickWasMajor("0.85.3")).toBe("0");
  expect(pickWasMajor("n/a")).toBeNull();
});

test("moveOpenRowToMerged moves an open PR to merged as unreleased", () => {
  const out = moveOpenRowToMerged(README, 47472, "unreleased")!;
  expect(out).not.toBe(README);
  expect(parseOpenRows(out).length).toBe(2);
  const moved = parseMergedRows(out).find(r => r.pr?.number === 47472);
  expect(moved?.marker).toBe("unreleased");
});

test("moveOpenRowToMerged renders a version-less n/a row as merged", () => {
  const out = moveOpenRowToMerged(README, 2046, "unreleased")!;
  const moved = parseMergedRows(out).find(r => r.pr?.number === 2046);
  expect(moved?.was).toBe("n/a");
  expect(moved?.marker).toBe("merged");
});

test("updateMergedRowVersion stamps an unreleased row with a version", () => {
  const out = updateMergedRowVersion(README, 47426, "57.0.3", false);
  expect(out).not.toBe(README);
  expect(parseMergedRows(out).find(r => r.pr?.number === 47426)?.marker).toBe("57.0.3");
});

test("updateMergedRowVersion needs force to change a real version", () => {
  const noop = updateMergedRowVersion(README, 9087, "1.6.6", false);
  expect(noop).toBe(README);
  const forced = updateMergedRowVersion(README, 9087, "1.6.6", true);
  expect(parseMergedRows(forced).find(r => r.pr?.number === 9087)?.marker).toBe("1.6.6");
});

// A PR cited again in a NEWER section (follow-up, revert, cross-reference) must not win: the
// changelog is newest-first, so the fix shipped in the oldest citing section.
const FOLLOWUP_CHANGELOG = `# Changelog

## 57.0.5

- Follow-up hardening for strokeBorder ([#47426](https://github.com/expo/expo/pull/47426))

## 57.0.3

- Add strokeBorder modifier ([#47426](https://github.com/expo/expo/pull/47426))
`;

test("firstReleasedVersionForPr returns the ship version, not a newer follow-up", () => {
  expect(firstReleasedVersionForPr(FOLLOWUP_CHANGELOG, 47426)).toBe("57.0.3");
});

// One interleaved changelog carrying two release lines: a backport puts the same PR on both.
const INTERLEAVED_CHANGELOG = `# Changelog

## 56.0.0

- Add scaleEffect ([#43954](https://github.com/expo/expo/pull/43954))

## 55.0.6

- Unrelated ([#40000](https://github.com/expo/expo/pull/40000))

## 55.0.3

- Backport scaleEffect ([#43954](https://github.com/expo/expo/pull/43954))
`;

test("firstReleasedVersionForPr scopes to the row's release line when major is given", () => {
  expect(firstReleasedVersionForPr(INTERLEAVED_CHANGELOG, 43954, "56")).toBe("56.0.0");
  expect(firstReleasedVersionForPr(INTERLEAVED_CHANGELOG, 43954, "55")).toBe("55.0.3");
  // no major: the oldest citing section across all lines
  expect(firstReleasedVersionForPr(INTERLEAVED_CHANGELOG, 43954)).toBe("55.0.3");
});

// keep-a-changelog bracketed headers with a leading [Unreleased] block.
const BRACKETED_CHANGELOG = `# Changelog

## [Unreleased]

- Not shipped ([#99999](https://github.com/better-auth/better-auth/pull/99999))

## [1.6.5] - 2026-06-01

### Added

- Add atomListeners ([#9087](https://github.com/better-auth/better-auth/pull/9087))
`;

test("firstReleasedVersionForPr recognizes bracketed keep-a-changelog headers", () => {
  expect(firstReleasedVersionForPr(BRACKETED_CHANGELOG, 9087)).toBe("1.6.5");
  expect(firstReleasedVersionForPr(BRACKETED_CHANGELOG, 99999)).toBeNull();
});

test("pickWasMajor strips a leading v", () => {
  expect(pickWasMajor("v57.0.2")).toBe("57");
  expect(pickWasMajor("v0.85.3")).toBe("0");
});

test("parseTableRow keeps a pipe inside a code span in one cell", () => {
  const row = "| [`pkg`](packages/pkg/) | `1.0.0` | Narrow `string | number` union. | [o/r#1234](https://github.com/o/r/pull/1234) |";
  const cells = parseTableRow(row);
  expect(cells.length).toBe(4);
  expect(cells[2].trim()).toBe("Narrow `string | number` union.");
});

test("parseOpenRows keeps a row whose Fix cell has a pipe in a code span", () => {
  const doc = `# patches

## Open

| Package | Version | Fix | PR |
| :--- | :--- | :--- | :--- |
| [\`a\`](packages/a/) | \`1.0.0\` | Plain fix. | [o/r#1](https://github.com/o/r/pull/1) |
| [\`b\`](packages/b/) | \`2.0.0\` | Narrow \`string | number\` union. | [o/r#2](https://github.com/o/r/pull/2) |

## Merged

| Package | Was | Fix | Fixed in |
| :--- | :--- | :--- | :--- |

## Usage
`;
  const rows = parseOpenRows(doc);
  expect(rows.length).toBe(2);
  expect(rows[1]).toEqual({
    pkg: "b",
    version: "2.0.0",
    pr: { owner: "o", repo: "r", number: 2, url: "https://github.com/o/r/pull/2" },
  });
});

test("moveOpenRowToMerged no-ops instead of duplicating when the PR is already merged", () => {
  const doc = `# patches

## Open

| Package | Version | Fix | PR |
| :--- | :--- | :--- | :--- |
| [\`dup\`](packages/dup/) | \`1.0.0\` | Stale open row. | [o/r#7](https://github.com/o/r/pull/7) |

## Merged

| Package | Was | Fix | Fixed in |
| :--- | :--- | :--- | :--- |
| [\`dup\`](packages/dup/) | \`1.0.0\` | Stale open row. | unreleased ([o/r#7](https://github.com/o/r/pull/7)) |

## Usage
`;
  const out = moveOpenRowToMerged(doc, 7, "unreleased", "o", "r");
  expect(out).toBe(doc); // no-op, not a second Merged row
  expect(parseMergedRows(out!).filter(r => r.pr?.number === 7).length).toBe(1);
});

test("updateMergedRowVersion scopes by repo so a cross-repo PR twin is not stamped", () => {
  const doc = `# patches

## Merged

| Package | Was | Fix | Fixed in |
| :--- | :--- | :--- | :--- |
| [\`foo\`](packages/foo/) | \`1.0.0\` | a. | unreleased ([acme/foo#218](https://github.com/acme/foo/pull/218)) |
| [\`bar\`](packages/bar/) | \`2.0.0\` | b. | unreleased ([get-convex/bar#218](https://github.com/get-convex/bar/pull/218)) |

## Usage
`;
  const out = updateMergedRowVersion(doc, 218, "2.5.0", false, "get-convex", "bar");
  const rows = parseMergedRows(out);
  expect(rows.find(r => r.pkg === "foo")?.marker).toBe("unreleased"); // untouched
  expect(rows.find(r => r.pkg === "bar")?.marker).toBe("2.5.0"); // the right repo's row
});
