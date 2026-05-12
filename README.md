# patches

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Talk is cheap, send patches.
>
> [@FFmpeg](https://x.com/FFmpeg/status/1762805900035686805)

Every time I open a PR upstream I write a patch and use it locally so I'm not blocked while the PR sits in review. Then I publish the patch here so you can drop it into your project and keep iterating without waiting for the PR to merge.

Once the PR merges, drop the patch and bump the dep like you normally would.

This is me sending patches.

## Open

PRs still in flight. Every row has a patch in `packages/` you can drop into your project. Indented rows (`↳`) are sibling patches from the same PR, apply them together.

| Package | Version | Fix | PR |
| :--- | :--- | :--- | :--- |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260506-03817f5` | Add SwiftUI `Alert` component wrapping iOS 15 `.alert(_:isPresented:actions:message:)`, with `Alert.Trigger`, `Alert.Actions`, and optional `Alert.Message` slots. Mirrors `ConfirmationDialog`'s shape so `isPresented` bindings and `Button` actions compose the same way. | [expo/expo#45700](https://github.com/expo/expo/pull/45700) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.12.2` | Wrap `fetchAccessToken` in `new Promise()` so `useConvexAuth().isAuthenticated` flips after sign-in on Hermes V1. The Expo SDK 56 canary dropped `@babel/plugin-transform-async-to-generator` from its Hermes V1 preset ([expo/expo#45345](https://github.com/expo/expo/pull/45345)), exposing a bridge race the transform's extra tick was hiding. | [get-convex/better-auth#368](https://github.com/get-convex/better-auth/pull/368) |
| [`better-auth`](packages/better-auth/) | `1.6.9` | Preserve the caller's session on `/change-password` with `revokeOtherSessions: true`. Same family as [#9087](https://github.com/better-auth/better-auth/pull/9087). | [better-auth/better-auth#9345](https://github.com/better-auth/better-auth/pull/9345) |
| [`@hugeicons/react`](packages/@hugeicons/react/) | `1.1.6` | Ship subpath types for `@hugeicons/core-free-icons/*` so TS finds them under `node16`, `nodenext`, and `bundler` resolution. Vite dev stops pre-bundling the 6.2 MB barrel for the 33 KB you actually use. | [hugeicons/react#5](https://github.com/hugeicons/react/pull/5) |
| [`shadcn`](packages/shadcn/) | `4.7.0` | Strip C0 (`0x00`-`0x1F`) and DEL (`0x7F`) control chars from `prompts` text input so Cmd+Delete on macOS stops creating directories like `\x15my-app`. | [shadcn-ui/ui#10364](https://github.com/shadcn-ui/ui/pull/10364) |
| [`bun`](packages/oven-sh/bun/) | `1.3.13` | Fix invalid YAML in `update-root-certs` workflow `labels` field. | [oven-sh/bun#27086](https://github.com/oven-sh/bun/pull/27086) |
| [`bun`](packages/oven-sh/bun/) | `1.3.13` | Use `includePrerelease` semver semantics for peer dep validation so prereleases stop warning on `bun install`. | [oven-sh/bun#27085](https://github.com/oven-sh/bun/pull/27085) |

## Released

Merged upstream. Bump the dep (or wait for the next canary), then delete the patch.

| Package | Was | Fix | Fixed in |
| :--- | :--- | :--- | :--- |
| [`expo`](packages/expo/) | n/a | Resolve `workspace:*` peer deps for scoped packages whose dir name differs from the package name (`@expo/ui`, `@expo/app-integrity`). Same root cause as [#44412](https://github.com/expo/expo/pull/44412), different call site. | `56.0.0-canary-20260506-964f25d` ([expo/expo#45403](https://github.com/expo/expo/pull/45403)) |
| [`better-auth`](packages/better-auth/) | n/a | Add `./instrumentation` subpath with `browser` and `edge` noop conditions so Convex V8 isolate stops crashing on `@opentelemetry/api` resolve. Pairs with [#9340](https://github.com/better-auth/better-auth/pull/9340). | `1.6.7` ([better-auth/better-auth#9281](https://github.com/better-auth/better-auth/pull/9281)) |
| [`@astrojs/compiler-rs`](packages/withastro/compiler-rs/) | `0.1.7` | Switch linux-gnu builds from zigbuild `-x` to `--use-napi-cross`, dropping glibc baseline from 2.30 and 2.35 to 2.16 and 2.17. Fixes Vercel, Amazon Linux 2023, AWS Lambda, RHEL and CentOS 7, Debian 10. Supersedes [#22](https://github.com/withastro/compiler-rs/pull/22). | `0.1.8` ([withastro/compiler-rs#25](https://github.com/withastro/compiler-rs/pull/25)) |
| [`shadcn/ui`](packages/shadcn-ui/) | n/a | Add TanStack Start dark mode guide with the `ScriptOnce` and Context pattern. | merged ([shadcn-ui/ui#10396](https://github.com/shadcn-ui/ui/pull/10396)) |
| [`shadcn/ui`](packages/shadcn-ui/) | n/a | Add `notFoundComponent` to `start-app` and `start-monorepo` root routes so favicon and DevTools probes stop printing `notFoundError` on first load. | merged ([shadcn-ui/ui#10369](https://github.com/shadcn-ui/ui/pull/10369)) |
| [`better-auth`](packages/better-auth/) | `1.6.2` | Add `/change-password` and `/revoke-other-sessions` to default `atomListeners` so `useSession()` updates after session-rotating endpoints. | `1.6.5` ([better-auth/better-auth#9087](https://github.com/better-auth/better-auth/pull/9087)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add iOS 17 `scrollPosition(id:anchor:)` binding, `scrollPositionAnchor` prop, `onScrollPositionChangeSync` worklet callback, and `id(string)` view modifier. | `56.0.0-canary-20260505-d2856c3` ([expo/expo#44652](https://github.com/expo/expo/pull/44652)) |
| [`better-auth`](packages/better-auth/) | n/a | Fix `operationId` on password reset callback endpoint. | merged ([better-auth/better-auth#9072](https://github.com/better-auth/better-auth/pull/9072)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.11.5` | Migrate to `better-auth` 1.6.9 (peer pinned `>=1.6.9 <1.7.0`). Adapter validators accept `Where.mode` case-folding. Pass `asResponse: false` at 7 plugin endpoints. Delegate cross-domain `parseSetCookieHeader` to `better-auth/cookies`. Add `twoFactor.verified` schema, expose `version` field, pick up [GHSA-xr8f-h2gw-9xh6](https://github.com/better-auth/better-auth/security/advisories/GHSA-xr8f-h2gw-9xh6) in `@better-auth/oauth-provider`. | `0.12.0` ([get-convex/better-auth#323](https://github.com/get-convex/better-auth/pull/323)) |
| [`shadcn/ui`](packages/shadcn-ui/) | n/a | Fix `llms.txt` 404 and missing routes. | merged ([shadcn-ui/ui#10337](https://github.com/shadcn-ui/ui/pull/10337)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add iOS `textContentType` modifier for SwiftUI text inputs. | `56.0.0-canary-20260409-6fc2991` ([expo/expo#44548](https://github.com/expo/expo/pull/44548)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add iOS `textInputAutocapitalization` modifier. | `56.0.0-canary-20260409-6fc2991` ([expo/expo#44547](https://github.com/expo/expo/pull/44547)) |
| [`@astrojs/compiler-rs`](packages/withastro/compiler-rs/) | n/a | Add `-x` to `x86_64-unknown-linux-gnu` build for glibc compat. Superseded by [#25](https://github.com/withastro/compiler-rs/pull/25). | merged ([withastro/compiler-rs#22](https://github.com/withastro/compiler-rs/pull/22)) |
| [`@napi-rs/cli`](packages/napi-rs/) | n/a | Respect `--cross-compile` when host arch matches target arch. | merged ([napi-rs/napi-rs#3189](https://github.com/napi-rs/napi-rs/pull/3189)) |
| [`expo-modules-core`](packages/expo-modules-core/) | `56.0.0-canary-20260212-4f61309` | Serialize `PersistentFileLog.readEntries` on the dispatch queue to fix a race. | `56.0.0-canary-20260402-87c5ce2` ([expo/expo#43958](https://github.com/expo/expo/pull/43958)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add iOS `scrollTargetBehavior` and `scrollTargetLayout` modifiers. | `56.0.0-canary-20260409-6fc2991` ([expo/expo#43955](https://github.com/expo/expo/pull/43955)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add iOS `defaultScrollAnchorForRole` modifier. Add `null` support and macOS platform tag to `defaultScrollAnchor`. | `56.0.0-canary-20260401-5e87ef7` ([expo/expo#43923](https://github.com/expo/expo/pull/43923)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add iOS `defaultScrollAnchor` modifier. | `56.0.0-canary-20260401-5e87ef7` ([expo/expo#43914](https://github.com/expo/expo/pull/43914)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.12` | Remove stray `react-dom` peer dep. | `0.10.13` ([get-convex/better-auth#278](https://github.com/get-convex/better-auth/pull/278)) |
| [`app-store-connect-cli`](packages/rorkai/) | n/a | Add macOS app screen capture and Mac App Store canvas framing to `shots` command. | merged ([rorkai/App-Store-Connect-CLI#784](https://github.com/rorkai/App-Store-Connect-CLI/pull/784)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.11` | Deduplicate concurrent `fetchAccessToken` calls with `pendingTokenRef`. | `0.10.12` ([get-convex/better-auth#267](https://github.com/get-convex/better-auth/pull/267)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add per-axis `scaleEffect({ x, y })` for view modifiers. | `56.0.0-canary-20260305-5163746` ([expo/expo#43228](https://github.com/expo/expo/pull/43228)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add `capsule` and `ellipse` shapes to `clipShape` and `mask` via a `ShapeType` enum. | `56.0.0-canary-20260305-5163746` ([expo/expo#43158](https://github.com/expo/expo/pull/43158)) |
| [`shadcn/ui`](packages/shadcn-ui/) | n/a | Strip raw `<ComponentsList>` tag from copy-to-markdown output. | merged ([shadcn-ui/ui#9484](https://github.com/shadcn-ui/ui/pull/9484)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | Widen `better-auth` peer from `1.4.9` to `>=1.4.9 <1.5.0`. | `0.10.11` ([get-convex/better-auth#245](https://github.com/get-convex/better-auth/pull/245)) |
| [`shadcn/ui`](packages/shadcn-ui/) | n/a | Add `@ramonclaudio-coderabbit` to the registry directory. | merged ([shadcn-ui/ui#9331](https://github.com/shadcn-ui/ui/pull/9331)) |
| [`convex`](packages/convex/) | `1.31.3` | Guard `WebSocketManager` against environments where `window` exists but `addEventListener` doesn't. | `1.31.4` ([get-convex/convex-js@baafbf5](https://github.com/get-convex/convex-js/commit/baafbf5bb200d6db81804558fbd01ccce77355fc)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | Fix string-compared cookie expiry, null-cached sessions, and wrong `isAuthenticated` field check. | `0.10.11` ([get-convex/better-auth#218](https://github.com/get-convex/better-auth/pull/218)) |
| [`bun`](packages/oven-sh/bun/) | `1.2.20` | Add `decompress` option to `fetch()` TypeScript types. | `1.2.21` ([oven-sh/bun#21855](https://github.com/oven-sh/bun/pull/21855)) |
| [`create-fumadocs-app`](packages/create-fumadocs-app/) | `15.6.4` | Fix Prettier formatting in `tanstack-start` template's `NotFound.tsx`. | `15.6.5` ([fuma-nama/fumadocs#2095](https://github.com/fuma-nama/fumadocs/pull/2095)) |
| [`create-fumadocs-app`](packages/create-fumadocs-app/) | `15.6.4` | Fix Vite and TanStack Router config warnings in `tanstack-start` template. | `15.6.5` ([fuma-nama/fumadocs#2092](https://github.com/fuma-nama/fumadocs/pull/2092)) |
| [`@tanstack/db`](packages/tanstack/) | n/a | Fix example todo app path in README. | merged ([TanStack/db#17](https://github.com/TanStack/db/pull/17)) |

## Filed

<details>
<summary>Issues I tracked down. All got fixed, by the maintainer or by my own follow-up PR.</summary>

| Issue | Package | Status | Notes |
| :--- | :--- | :--- | :--- |
| [get-convex/better-auth#345](https://github.com/get-convex/better-auth/issues/345) | `@convex-dev/better-auth` | fixed (my PR) | `better-auth` 1.6.6 dynamic `@opentelemetry/api` import crashed Convex V8 isolate on every auth request. Fixed in `0.12.0` via [#323](https://github.com/get-convex/better-auth/pull/323) after [#9281](https://github.com/better-auth/better-auth/pull/9281) shipped the noop in `1.6.7`. |
| [anthropics/claude-code#18181](https://github.com/anthropics/claude-code/issues/18181) | `claude` | fixed (my report) | Manual update wasn't fixing the symlink with `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` set. [@bcherny](https://github.com/bcherny) replied "Fix incoming" and closed it. |
| [get-convex/better-auth#219](https://github.com/get-convex/better-auth/issues/219) | `@convex-dev/better-auth` | fixed (my PR) | Concurrent `fetchAccessToken` calls racing to `/token`. Fixed in [#267](https://github.com/get-convex/better-auth/pull/267). |
| [shadcn-ui/ui#8892](https://github.com/shadcn-ui/ui/issues/8892) | `shadcn/ui` | fixed (my PR) | Registry directory submission for CodeRabbit. [@shadcn](https://github.com/shadcn) asked for a PR. Shipped [#9331](https://github.com/shadcn-ui/ui/pull/9331). |
| [panva/jose#752](https://github.com/panva/jose/issues/752) | [`jose`](packages/jose/) | fixed (my report) | `process.getBuiltinModule` broke Edge Runtime and Next.js middleware. Fixed in [`v6.0.4`](https://github.com/panva/jose/releases/tag/v6.0.4). [@panva](https://github.com/panva) thanked me on close. |

</details>

## Usage

Most patches are ready to drop into `bun`, `npm` (via `patch-package`), or `pnpm`. Source-only patches (CI, docs, non-npm code) get applied with `git apply` against a clone of the upstream repo.

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
>
> **Diff paths.** Bun and pnpm use paths relative to the package root. patch-package prefixes with `node_modules/@scope/pkg/`. To convert:
>
> ```bash
> # patch-package -> Bun/pnpm
> sed 's|node_modules/@scope/pkg/||g' old.patch > new.patch
>
> # Bun/pnpm -> patch-package
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

## Multiple patches for the same package

One patch file per PR in this repo. But most package managers only support **one patch per `package@version`**.

| Tool | Multiple? | Details |
| :--- | :--- | :--- |
| **Bun** | No | One entry per `package@version` in `patchedDependencies`. Combine into one `.patch`. |
| **pnpm** | No | One entry per exact version in `patchedDependencies`. Combine into one `.patch`. |
| **npm** (patch-package) | Yes | Use `--append` for sequenced patches: `pkg+ver+001+fix-a.patch`, `pkg+ver+002+fix-b.patch`. |

<details>
<summary>Combining patches (Bun, pnpm)</summary>

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
> If any file appears in both patches, use the `bun patch` or `pnpm patch-commit` workflow above.

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
```

One dir per package manager. Not every package has patches for every manager.

Filenames have a `-prXXX` suffix (e.g. `@expo%2Fui@56.0.0-canary-20260212-4f61309-pr43228.patch`) so you can trace back to the upstream PR. Strip it when copying to your project.

## License

[MIT](LICENSE)
