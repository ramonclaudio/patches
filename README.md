# patches

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

I live on canary versions of half my stack (Bun, Expo, Convex, Hydrogen). Stuff breaks. I file the PR upstream, then patch my own apps so I'm not blocked while it sits in review. This repo is where I keep those patches so I can grab them across machines, share them with people hitting the same bugs, and trace each one back to its upstream PR.

Most are ready to drop into `bun`, `npm` (via `patch-package`), or `pnpm`. A few rows have no patch because the fix is in CI, docs, or a binary, but I track them here anyway so I have one place to look.

> Talk is cheap, send patches.
>
> [@FFmpeg](https://x.com/FFmpeg/status/1762805900035686805)

> [!NOTE]
> Patches move Open -> Merged -> Released as PRs land and versions ship. Once released, bump the dep and drop the patch.

## Open

PR not yet merged. Most rows have a patch ready in `packages/`. Rows marked `no patch: ...` are tracked for completeness when the upstream change can't be applied locally (CI, docs site, etc). Indented rows (`↳`) are sibling patches from the same upstream PR. Apply them together.

| Package | Version | Format | Fix | PR |
| :--- | :--- | :--- | :--- | :--- |
| [`expo-router`](packages/expo-router/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | `Stack.Toolbar` infinite render loop on stateful screens; fix for issue [expo/expo#44561](https://github.com/expo/expo/issues/44561) | [expo/expo#44563](https://github.com/expo/expo/pull/44563) |
| `@astrojs/compiler` | n/a | no patch: CI workflow fix, not runtime code | Add `-x` to `x86_64-unknown-linux-gnu` build for glibc compat | [withastro/compiler-rs#22](https://github.com/withastro/compiler-rs/pull/22) |
| [`@shopify/mini-oxygen`](packages/@shopify/mini-oxygen/) | `4.0.0` | Bun, npm (patch-package), pnpm | Vite 7 `ReferenceError: __vite_ssr_exportName__ is not defined`; missing 6th SSR key, `getBuiltins()` support, `fetchModule` importer fix, removes deprecated `root`, bumps `vite` peer dep to `^7.0.0` | [Shopify/hydrogen#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| ↳ [`@shopify/hydrogen`](packages/@shopify/hydrogen/) | `2026.1.0` | Bun, npm (patch-package), pnpm | `vite` peer dep `^5.1.0 \|\| ^6.2.1` widened to include `^7.0.0` so it accepts the patched mini-oxygen | sibling of [#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| ↳ [`@shopify/hydrogen-react`](packages/@shopify/hydrogen-react/) | `2026.1.0` | Bun, npm (patch-package), pnpm | `vite` peer dep widened to `^5.1.0 \|\| ^6.2.1 \|\| ^7.0.0` | sibling of [#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| ↳ [`@shopify/cli-hydrogen`](packages/@shopify/cli-hydrogen/) | `11.1.9` | Bun, npm (patch-package), pnpm | `vite` peer dep `^5.1.0 \|\| ^6.2.0` widened to include `^7.0.0` | sibling of [#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| [`bun`](packages/oven-sh/bun/) | `1.3.9` | Bun | Invalid YAML sequence in `update-root-certs` workflow `labels` field | [oven-sh/bun#27086](https://github.com/oven-sh/bun/pull/27086) |
| [`bun`](packages/oven-sh/bun/) | `1.3.9` | Bun | `includePrerelease` semantics wrong for peer dep semver validation | [oven-sh/bun#27085](https://github.com/oven-sh/bun/pull/27085) |
| `shadcn/ui` | n/a | no patch: docs website feature (copy-to-markdown), not runtime code | Raw `<ComponentsList>` tag leaking into copy-to-markdown output | [shadcn-ui/ui#9484](https://github.com/shadcn-ui/ui/pull/9484) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.11.4` | Bun, npm (patch-package), pnpm | Migrate to `better-auth` 1.6: bumps peer to `>=1.6.0 <1.7.0`; accepts the new `Where.mode` field in adapter validators so `api.adapter.findOne` stops throwing `ArgumentValidationError`; passes `asResponse: false` at 7 internal plugin endpoint call sites (convex + cross-domain) so 1.6's flipped `shouldReturnResponse` default doesn't turn `{ token }` into `undefined` (JWT cookies becoming the literal string `"undefined"`) or crash `setSessionCookie` on cross-domain; silences `oidcProvider` deprecation warning with `__skipDeprecationWarning` | [get-convex/better-auth#323](https://github.com/get-convex/better-auth/pull/323) |

## Released

PR merged. Bump the dep (or wait for the next canary) to drop the patch.

| Package | Was | Format | Fix | Fixed in |
| :--- | :--- | :--- | :--- | :--- |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | iOS: `textContentType` modifier for SwiftUI text inputs | awaiting canary ([expo/expo#44548](https://github.com/expo/expo/pull/44548)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | iOS: `textInputAutocapitalization` modifier | awaiting canary ([expo/expo#44547](https://github.com/expo/expo/pull/44547)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | iOS: `scrollTargetBehavior` and `scrollTargetLayout` modifiers | awaiting canary ([expo/expo#43955](https://github.com/expo/expo/pull/43955)) |
| `@napi-rs/cli` | n/a | no patch: bundles to `dist/index.cjs`, `src/` ships but isn't loaded at runtime | `--cross-compile` ignored when host matches target | merged ([napi-rs/napi-rs#3189](https://github.com/napi-rs/napi-rs/pull/3189)) |
| `shadcn/ui` | n/a | no patch: registry directory JSON in the docs site, not runtime code | Add `@ramonclaudio-coderabbit` to the registry directory | merged ([shadcn-ui/ui#9331](https://github.com/shadcn-ui/ui/pull/9331)) |
| [`expo-modules-core`](packages/expo-modules-core/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | iOS: serialize `PersistentFileLog.readEntries` on the dispatch queue to fix race condition | `56.0.0-canary-20260401-5e87ef7` ([expo/expo#43958](https://github.com/expo/expo/pull/43958)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | iOS: `defaultScrollAnchorForRole` modifier | `56.0.0-canary-20260401-5e87ef7` ([expo/expo#43923](https://github.com/expo/expo/pull/43923)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | iOS: `defaultScrollAnchor` modifier | `56.0.0-canary-20260401-5e87ef7` ([expo/expo#43914](https://github.com/expo/expo/pull/43914)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.12` | Bun, npm (patch-package), pnpm | Stray `react-dom` peer dep removed | `0.10.13` ([get-convex/better-auth#278](https://github.com/get-convex/better-auth/pull/278)) |
| `app-store-connect-cli` | n/a | no patch: Swift CLI binary distributed via Homebrew, no npm package | macOS app screen capture + Mac App Store canvas framing for `shots` command | merged ([rudrankriyam/App-Store-Connect-CLI#784](https://github.com/rudrankriyam/App-Store-Connect-CLI/pull/784)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.11` | Bun, npm (patch-package), pnpm | Concurrent `fetchAccessToken` calls race to `/token`; `pendingTokenRef` deduplicates in-flight requests | `0.10.12` ([get-convex/better-auth#267](https://github.com/get-convex/better-auth/pull/267)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | Per-axis `scaleEffect({ x, y })` missing from view modifiers; adds `inverted` prop to `List` for bottom-anchored scrolling | `56.0.0-canary-20260305-5163746` ([expo/expo#43228](https://github.com/expo/expo/pull/43228)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | Bun, npm (patch-package), pnpm | Pinned `better-auth` peer dep `1.4.9` blocks newer 1.4.x versions | `0.10.11` ([get-convex/better-auth#245](https://github.com/get-convex/better-auth/pull/245)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | Bun, npm (patch-package), pnpm | Cookie expiry string comparison, null session cache, wrong `isAuthenticated` check | `0.10.11` ([get-convex/better-auth#218](https://github.com/get-convex/better-auth/pull/218)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | Missing `capsule` + `ellipse` shapes in `clipShape`/`mask`; broken `foregroundStyle` hierarchical handling | `56.0.0-canary-20260305-5163746` ([expo/expo#43158](https://github.com/expo/expo/pull/43158)) |
| [`convex`](packages/convex/) | `1.31.3` | Bun, npm (patch-package), pnpm | `WebSocketManager` crashes where `window` exists but `addEventListener` doesn't | `1.31.4` ([get-convex/convex-js@baafbf5](https://github.com/get-convex/convex-js/commit/baafbf5bb200d6db81804558fbd01ccce77355fc)) |
| [`bun`](packages/oven-sh/bun/) | `1.2.20` | Bun | `decompress` option missing from `fetch()` TypeScript types | `1.2.21` ([oven-sh/bun#21855](https://github.com/oven-sh/bun/pull/21855)) |
| [`create-fumadocs-app`](packages/create-fumadocs-app/) | `15.6.4` | Bun, npm (patch-package), pnpm | Fix Prettier formatting in `tanstack-start` template `NotFound.tsx` | `15.6.5` ([fuma-nama/fumadocs#2095](https://github.com/fuma-nama/fumadocs/pull/2095)) |
| [`create-fumadocs-app`](packages/create-fumadocs-app/) | `15.6.4` | Bun, npm (patch-package), pnpm | Fix Vite and TanStack Router configuration warnings in `tanstack-start` template | `15.6.5` ([fuma-nama/fumadocs#2092](https://github.com/fuma-nama/fumadocs/pull/2092)) |
| `@tanstack/db` | n/a | no patch: `README` docs only, not runtime code | Incorrect example todo app path | merged ([TanStack/db#17](https://github.com/TanStack/db/pull/17)) |

## Closed

PRs I closed without merge (or never filed). Some were rebuilt upstream with a different approach, others are still stale.

| Package | Was | Format | Fix | Status |
| :--- | :--- | :--- | :--- | :--- |
| `@tobilu/qmd` | n/a | no patch: `docs/mcp-setup.md` only, not runtime code | Tool name, param names, and ghost params in `mcp-setup.md` out of sync with `inputSchema` in `src/mcp.ts` | still stale ([tobi/qmd#95](https://github.com/tobi/qmd/pull/95) closed by me; corrections documented in the PR body) |
| [`@tobilu/qmd`](packages/@tobilu/qmd/) | `1.0.7` | Bun, npm (patch-package), pnpm | `typescript` in `peerDependencies` instead of `devDependencies`; missing `tsc` in `prepare` script | `1.1.0+` ([tobi/qmd#197](https://github.com/tobi/qmd/pull/197) closed by me after upstream rebuilt the fix differently) |
| [`react-native-view-shot`](packages/react-native-view-shot/) | `4.0.3` | Bun, npm (patch-package), pnpm | RN 0.84 / new arch: `RCTScrollView` removed; switch `snapshotContentContainer` check to `UIScrollView` | `5.0.0-alpha.2` ([gre/react-native-view-shot#587](https://github.com/gre/react-native-view-shot/pull/587); no PR filed, upstream adopted the same approach) |

## Filed

Issues I reported.

| Issue | Package | Status | Notes |
| :--- | :--- | :--- | :--- |
| [anthropics/claude-code#18075](https://github.com/anthropics/claude-code/issues/18075) | `claude` | open | Feature request: env var for custom Chromium browser path |
| [Shopify/hydrogen#3263](https://github.com/Shopify/hydrogen/issues/3263) | `@shopify/mini-oxygen` | open | Add support for Vite 7 in `@shopify/mini-oxygen`; tracked by PR [#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| [shadcn-ui/ui#8892](https://github.com/shadcn-ui/ui/issues/8892) | `shadcn/ui` | fixed (my PR) | Registry directory submission for CodeRabbit; [@shadcn](https://github.com/shadcn) asked me to send a PR, I shipped [#9331](https://github.com/shadcn-ui/ui/pull/9331) which auto-closed this issue on merge |
| [anthropics/claude-code#20664](https://github.com/anthropics/claude-code/issues/20664) | `claude` | stale | `--fork-session` doesn't inherit `CLAUDE_CODE_TASK_LIST_ID` from parent session; auto-closed by `github-actions` for inactivity, no human ever responded in the thread |
| [tobi/qmd#198](https://github.com/tobi/qmd/issues/198) | `@tobilu/qmd` | closed by me | `bun install -g` requires manual `bun pm trust better-sqlite3`; closed by me, known runtime limitation, no upstream fix |
| [get-convex/better-auth#219](https://github.com/get-convex/better-auth/issues/219) | `@convex-dev/better-auth` | fixed (my PR) | Potential duplicate token requests during concurrent `fetchAccessToken` calls; fixed by my own PR [#267](https://github.com/get-convex/better-auth/pull/267) |
| [anthropics/claude-code#18181](https://github.com/anthropics/claude-code/issues/18181) | `claude` | fixed (my report) | Manual update doesn't fix symlink when `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` is set; [@bcherny](https://github.com/bcherny) replied "Fix incoming" and closed the issue |
| [Textualize/textual#5980](https://github.com/Textualize/textual/issues/5980) | `textual` | closed by me | Emoji with variation selectors cause button layout misalignment in Ghostty; closed by me after the discussion concluded the fix belongs in terminal emulators via mode 2027, not in `textual` |
| [panva/jose#752](https://github.com/panva/jose/issues/752) | `jose` | fixed (my report) | `process.getBuiltinModule` misuse breaks Edge Runtime / Next.js middleware; fixed in [`v6.0.4`](https://github.com/panva/jose/releases/tag/v6.0.4) after my traces convinced [@panva](https://github.com/panva) the bug was real (he thanked me on close) |
| [cursor/cursor#3182](https://github.com/cursor/cursor/issues/3182) | `cursor` | fixed | Unable to update spending limit or toggle usage-based pricing on main dashboard; fixed upstream (cursor later disabled their issue tracker) |

## Usage

Copy the patch file into your `patches/` dir. Strip the `-prXXX` suffix from the filename so it matches what your package manager expects.

> [!IMPORTANT]
> Patches are NOT drop-in across package managers. Two things differ:
>
> **Filename.** Each tool uses a different separator for scoped packages:
>
> | Tool | Format |
> | :--- | :--- |
> | Bun | `@scope%2Fpkg@version.patch` |
> | npm (patch-package) | `@scope+pkg+version.patch` |
> | pnpm | `@scope__pkg@version.patch` |
> | Yarn | `@scope-pkg-npm-version-hash.patch` (auto-generated) |
>
> **Diff paths.** Bun, pnpm, and Yarn use paths relative to the package root. patch-package prefixes with `node_modules/@scope/pkg/`. To convert:
>
> ```bash
> # patch-package -> Bun/pnpm/Yarn
> sed 's|node_modules/@scope/pkg/||g' old.patch > new.patch
>
> # Bun/pnpm/Yarn -> patch-package
> sed -e '/^diff --git /s|a/|a/node_modules/@scope/pkg/|' \
>     -e '/^diff --git /s|b/|b/node_modules/@scope/pkg/|' \
>     -e 's|^--- a/|--- a/node_modules/@scope/pkg/|' \
>     -e 's|^+++ b/|+++ b/node_modules/@scope/pkg/|' \
>     old.patch > new.patch
> ```

<details>
<summary>Bun (1.2+)</summary>

Applied automatically on `bun install`.

```jsonc
// package.json
{
  "patchedDependencies": {
    "@expo/ui@56.0.0-canary-20260212-4f61309": "patches/@expo%2Fui@56.0.0-canary-20260212-4f61309.patch"
  }
}
```

</details>

<details>
<summary>npm (patch-package)</summary>

No native patching. Uses [patch-package](https://github.com/ds300/patch-package) via `postinstall`.

```jsonc
// package.json
{
  "scripts": {
    "postinstall": "patch-package"
  },
  "devDependencies": {
    "patch-package": "^8.0.1"
  }
}
```

</details>

<details>
<summary>pnpm (10.7+)</summary>

[`pnpm patch`](https://pnpm.io/cli/patch). Config goes in `pnpm-workspace.yaml`.

```yaml
# pnpm-workspace.yaml
patchedDependencies:
  "@convex-dev/better-auth@0.10.10": "patches/@convex-dev__better-auth@0.10.10.patch"
```

</details>

<details>
<summary>Yarn (v2+)</summary>

[`yarn patch`](https://yarnpkg.com/cli/patch). Uses the `patch:` protocol in `resolutions`.

```jsonc
// package.json
{
  "resolutions": {
    "@expo/ui@56.0.0-canary-20260212-4f61309": "patch:@expo/ui@npm%3A56.0.0-canary-20260212-4f61309#~/.yarn/patches/@expo-ui-npm-56.0.0-canary-20260212-4f61309-abc123.patch"
  }
}
```

> [!NOTE]
> Yarn auto-generates filenames with hashes. Use `yarn patch` / `yarn patch-commit -s`. Don't copy `.patch` files from this repo into `.yarn/patches/` directly.

</details>

## Multiple patches for the same package

One patch file per PR in this repo. But most package managers only support **one patch per `package@version`**.

| Tool | Multiple? | Details |
| :--- | :--- | :--- |
| **Bun** | No | One entry per `package@version` in `patchedDependencies`. Combine into one `.patch`. |
| **pnpm** | No | One entry per exact version in `patchedDependencies`. Combine into one `.patch`. |
| **Yarn** | No | One `patch:` resolution per package. Combine into one `.patch`. |
| **npm** (patch-package) | Yes | Use `--append` for sequenced patches: `pkg+ver+001+fix-a.patch`, `pkg+ver+002+fix-b.patch`. |

<details>
<summary>Combining patches (Bun / pnpm / Yarn)</summary>

Apply all changes to `node_modules` and let the tool generate one combined diff:

```bash
# 1. prep the package
bun patch @expo/ui

# 2. apply each patch from this repo
git apply --directory=node_modules/@expo/ui patches/fix-a.patch
git apply --directory=node_modules/@expo/ui patches/fix-b.patch

# 3. commit as one combined patch
bun patch --commit @expo/ui
```

> [!TIP]
> If the patches touch completely different files, `cat` them together instead:
>
> ```bash
> cat patches/fix-a.patch patches/fix-b.patch > patches/@expo%2Fui@56.0.0-canary-20260212-4f61309.patch
> ```
>
> If any file appears in both patches, use the `bun patch` / `pnpm patch-commit` / `yarn patch-commit -s` workflow above.

</details>

## Structure

```text
packages/
  @<scope>/
    <package>/
      bun/
        <patch-file>.patch
      npm/
        <patch-file>.patch
      pnpm/
        <patch-file>.patch
      yarn/
        <patch-file>.patch
```

One dir per package manager. Not every package has patches for every manager.

Filenames have a `-prXXX` suffix (e.g. `@expo%2Fui@56.0.0-canary-20260212-4f61309-pr43228.patch`) so you can trace back to the upstream PR. Strip it when copying to your project.

## License

[MIT](LICENSE)
