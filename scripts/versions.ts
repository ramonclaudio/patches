import { pickWasMajor } from "./readme.ts";

// Prerelease tokens (canary) parse to NaN and get skipped, so this orders stable versions only.
export function cmpVer(a: string, b: string): number {
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

// Newest version on a release line: stable preferred, prerelease-only lines fall
// back to prereleases, the whole registry when major is null.
export function latestOnLine(versions: string[], major: string | null): string | undefined {
  const line = major ? versions.filter((v) => pickWasMajor(v) === major) : versions;
  const stable = line.filter((v) => !v.includes("-"));
  return (stable.length ? stable : line).sort(cmpVer).at(-1);
}

// Every release line on npm, oldest first. A fix can ship on several lines
// (backports below the Was pin included); rows list one version per line.
export function releaseLines(versions: string[]): string[] {
  const majors = new Set<number>();
  for (const v of versions) {
    const m = pickWasMajor(v);
    if (m !== null) majors.add(Number(m));
  }
  return [...majors].sort((a, b) => a - b).map(String);
}

// A line still receiving releases: its newest publish is within the window.
// Dead lines can never ship a fix, so scanning them would never converge.
export function lineActive(
  versions: string[],
  time: Record<string, string>,
  major: string,
  now: number,
  windowMs: number,
): boolean {
  let newest = 0;
  for (const v of versions) {
    if (pickWasMajor(v) !== major) continue;
    const t = Date.parse(time[v] ?? "");
    if (!Number.isNaN(t) && t > newest) newest = t;
  }
  return newest > 0 && now - newest <= windowMs;
}
