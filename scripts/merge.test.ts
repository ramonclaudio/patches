import { expect, test } from "bun:test";
import { detectImportMerge } from "./merge.ts";
import { cmpVer, latestOnLine, lineActive, releaseLines } from "./versions.ts";

test("detects a codesync comment carrying owner/repo@sha from any author", () => {
  const comments = [
    { author: { login: "tmikov" }, body: "@tmikov has **imported** this pull request." },
    {
      author: { login: "tmikov" },
      body: "@tmikov merged this pull request in facebook/hermes@bc5ef9b111ce3e68f508d6cc2387261688a07b52.",
    },
  ];
  expect(detectImportMerge(comments)).toEqual({
    sha: "bc5ef9b111ce3e68f508d6cc2387261688a07b52",
    ref: "facebook/hermes@bc5ef9b111ce3e68f508d6cc2387261688a07b52",
  });
});

test("trusts a known import bot with a bare sha", () => {
  const comments = [
    { author: { login: "facebook-github-bot" }, body: "merged this pull request in abc1234def." },
  ];
  expect(detectImportMerge(comments)).toEqual({ sha: "abc1234def", ref: null });
});

test("rejects a bare sha from an unknown author", () => {
  const comments = [
    { author: { login: "somebody" }, body: "merged this pull request in abc1234def." },
  ];
  expect(detectImportMerge(comments)).toBeNull();
});

test("falls back to the Merged label when no comment matches", () => {
  expect(
    detectImportMerge([{ author: { login: "x" }, body: "LGTM" }], ["CLA Signed", "Merged"]),
  ).toEqual({
    sha: null,
    ref: null,
  });
});

test("ignores unrelated comments and labels", () => {
  const comments = [
    { author: { login: "a" }, body: "Can you rebase onto main?" },
    {
      author: { login: "b" },
      body: "This references facebook/hermes#2047 but is not a merge notice.",
    },
  ];
  expect(detectImportMerge(comments, ["CLA Signed"])).toBeNull();
});

test("rejects a sha too short to be a commit", () => {
  expect(
    detectImportMerge([
      { author: { login: "meta-codesync" }, body: "merged this pull request in abc12." },
    ]),
  ).toBeNull();
});

test("handles empty and missing input", () => {
  expect(detectImportMerge([])).toBeNull();
  expect(detectImportMerge(undefined)).toBeNull();
  expect(detectImportMerge([{}])).toBeNull();
});

test("cmpVer orders stable versions and dated canaries", () => {
  expect(cmpVer("57.0.3", "57.0.10")).toBeLessThan(0);
  expect(cmpVer("57.1.0", "57.0.9")).toBeGreaterThan(0);
  expect(cmpVer("57.0.0-canary-20260101", "57.0.0-canary-20260201")).toBeLessThan(0);
});

test("latestOnLine prefers stable versions on the scoped line", () => {
  const versions = ["56.0.18", "56.0.19", "57.0.0-canary-1", "57.0.0", "57.0.1"];
  expect(latestOnLine(versions, "56")).toBe("56.0.19");
  expect(latestOnLine(versions, "57")).toBe("57.0.1");
  expect(latestOnLine(versions, null)).toBe("57.0.1");
  expect(latestOnLine(versions, "58")).toBeUndefined();
});

test("latestOnLine falls back to prereleases on a prerelease-only line", () => {
  expect(latestOnLine(["57.0.1", "58.0.0-canary-1", "58.0.0-canary-2"], "58")).toBe(
    "58.0.0-canary-2",
  );
});

test("releaseLines lists every line on npm, oldest first", () => {
  const versions = ["55.0.9", "56.0.18", "56.0.19", "57.0.0", "57.0.1", "58.0.0-canary-1"];
  expect(releaseLines(versions)).toEqual(["55", "56", "57", "58"]);
  expect(releaseLines(["0.9.0", "1.6.5"])).toEqual(["0", "1"]);
  expect(releaseLines([])).toEqual([]);
});

test("lineActive keeps lines that published within the window, drops dead ones", () => {
  const now = Date.parse("2026-07-03T00:00:00Z");
  const windowMs = 183 * 86_400_000;
  const versions = ["55.0.9", "56.0.19", "57.0.1"];
  const time = {
    "55.0.9": "2025-06-01T00:00:00Z", // dead: over a year quiet
    "56.0.19": "2026-07-01T00:00:00Z",
    "57.0.1": "2026-06-27T00:00:00Z",
  };
  expect(lineActive(versions, time, "55", now, windowMs)).toBe(false);
  expect(lineActive(versions, time, "56", now, windowMs)).toBe(true);
  expect(lineActive(versions, time, "57", now, windowMs)).toBe(true);
  // unknown line or missing time data reads as inactive
  expect(lineActive(versions, time, "58", now, windowMs)).toBe(false);
  expect(lineActive(versions, {}, "56", now, windowMs)).toBe(false);
});
