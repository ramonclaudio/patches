// Meta's codesync (hermes, react-native) merges a PR by landing the commit
// internally and closing it: GitHub reports CLOSED with mergedAt null even
// though it merged. The bot comments "merged this pull request in
// <owner/repo@>sha" and applies a "Merged" label. This is the one detector for
// every consumer of that signal (prw sync, reconcile.ts, the site's stats.ts).

export const IMPORT_BOTS = new Set(["meta-codesync", "facebook-github-bot"]);

const LANDED_RE = /merged this pull request in (?:([\w.-]+\/[\w.-]+)@)?([0-9a-f]{7,40})\b/i;

export type ImportMerge = {
  sha: string | null; // landed commit when a comment carries one
  ref: string | null; // owner/repo@sha when the comment names the repo
};

export function detectImportMerge(
  comments: Array<{ author?: { login?: string } | null; body?: string }> | undefined,
  labels: string[] = [],
): ImportMerge | null {
  for (const c of comments ?? []) {
    const m = (c.body ?? "").match(LANDED_RE);
    if (!m) continue;
    const [, repo, sha] = m;
    // A known import bot is trusted with a bare sha; anyone else must name the repo.
    if (repo || IMPORT_BOTS.has(c.author?.login ?? "")) {
      return { sha, ref: repo ? `${repo}@${sha}` : null };
    }
  }
  return labels.includes("Merged") ? { sha: null, ref: null } : null;
}
