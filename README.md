# patches

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Talk is cheap, send patches.
>
> [@FFmpeg](https://x.com/FFmpeg/status/1762805900035686805)

Every time I open a PR upstream I write a patch and use it locally so I'm not blocked while the PR sits in review. Then I publish the patch here so you can drop it into your project and keep iterating without waiting for the PR to merge.

Once the PR merges, drop the patch and bump the dep like you normally would.

This is me sending patches.

## Open

PRs still in flight. Every row has a patch in `packages/` you can drop into your project.

| Package | Version | Fix | PR |
| :--- | :--- | :--- | :--- |
| [`hermes`](packages/hermes/) | n/a | Cherry-pick `18a9634659` onto the `250829098.0.0-stable` branch React Native 0.85 ships. `genObjectExpr` passed `nullptr` as the home object when generating an object-literal getter or setter, so `super.x` inside an accessor compiled against a null home object and SIGSEGV'd `hermesc` at compile time. Makes accessors consistent with the regular-method path, which already passes `capturedObj`. Source fix for one of the three Hermes V1 codegen bugs `babel-preset-expo` works around ([expo/expo#45601](https://github.com/expo/expo/pull/45601)). Root cause [facebook/hermes#1761](https://github.com/facebook/hermes/issues/1761). | [facebook/hermes#2045](https://github.com/facebook/hermes/pull/2045) |
| [`react-native`](packages/react-native/) | `0.85.3` | Set `:always_out_of_date => "1"` on `hermes-engine.podspec`'s `[Hermes] Replace Hermes for the right configuration, if needed` script_phase. The phase had no declared outputs (overwrites the prebuilt Hermes binary in place per `$CONFIGURATION`), so Xcode 14+ was warning about it on every clean build of every project on the default prebuilt-release-tarball Hermes path. Matches the family pattern from `React-Core-prebuilt.podspec` ([#52133](https://github.com/facebook/react-native/pull/52133)) and `ReactNativeDependencies.podspec` ([#49812](https://github.com/facebook/react-native/pull/49812)). | [facebook/react-native#56912](https://github.com/facebook/react-native/pull/56912) |
| [`bun`](packages/oven-sh/bun/) | `1.3.14` | Drop the order-dependent peer-dep early-match block from `get_or_put_resolved_package` so `bun.lock` stops varying run to run. The block bound peers to whichever same-name resolution `package_index` held first, and `package_index` fills in thread-pool-completion order. Dedup and the "incorrect peer dependency" warning move into `Tree::hoist_dependency` where placement is deterministic. Rust port of Dylan's [#29804](https://github.com/oven-sh/bun/pull/29804). | [oven-sh/bun#30855](https://github.com/oven-sh/bun/pull/30855) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.12.2` | Wrap `fetchAccessToken` in `new Promise()` so `useConvexAuth().isAuthenticated` flips after sign-in on Hermes V1. The Expo SDK 56 canary dropped `@babel/plugin-transform-async-to-generator` from its Hermes V1 preset ([expo/expo#45345](https://github.com/expo/expo/pull/45345)), exposing a bridge race the transform's extra tick was hiding. Babel-layer root fix in [facebook/react-native#56816](https://github.com/facebook/react-native/pull/56816). | [get-convex/better-auth#368](https://github.com/get-convex/better-auth/pull/368) |
| [`better-auth`](packages/better-auth/) | `1.6.11` | Preserve the caller's session on `/change-password` with `revokeOtherSessions: true`. Same family as [#9087](https://github.com/better-auth/better-auth/pull/9087). | [better-auth/better-auth#9345](https://github.com/better-auth/better-auth/pull/9345) |
| [`@hugeicons/react`](packages/@hugeicons/react/) | `1.1.6` | Ship subpath types for `@hugeicons/core-free-icons/*` so TS finds them under `node16`, `nodenext`, and `bundler` resolution. Vite dev stops pre-bundling the 6.2 MB barrel for the 33 KB you actually use. | [hugeicons/react#5](https://github.com/hugeicons/react/pull/5) |
| [`shadcn`](packages/shadcn/) | `4.7.0` | Strip C0 (`0x00`-`0x1F`) and DEL (`0x7F`) control chars from `prompts` text input so Cmd+Delete on macOS stops creating directories like `\x15my-app`. | [shadcn-ui/ui#10364](https://github.com/shadcn-ui/ui/pull/10364) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.12.2` | Drop the cached JWT when `authClient.useSession().session.id` changes. The React hook returned the stale token until logout, so `convex/react`'s `useConvexAuth` held a JWT whose `sub` pointed at a deleted session for the half-second between `/change-password` rotating sessions and the next `forceRefreshToken`. Track `sessionId` in a ref, compare on every `fetchAccessToken`, clear both `cachedToken` and `pendingTokenRef` on rotation. Pairs with [better-auth/better-auth#9345](https://github.com/better-auth/better-auth/pull/9345). | [get-convex/better-auth#329](https://github.com/get-convex/better-auth/pull/329) |
| [`bun`](packages/oven-sh/bun/) | `1.3.13` | Fix invalid YAML in `update-root-certs` workflow `labels` field. | [oven-sh/bun#27086](https://github.com/oven-sh/bun/pull/27086) |

## Released

Merged upstream. Bump the dep (or wait for the next canary), then delete the patch.

| Package | Was | Fix | Fixed in |
| :--- | :--- | :--- | :--- |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.15` | Add iOS `dynamicTypeSize` modifier to set or clamp Dynamic Type within a view. Pass a single size to pin it, or `{ min, max }` to bound the range (either end optional). Caps how far text grows at the largest accessibility sizes for layout safety while still honoring Dynamic Type. Bounds the `textStyle` scaling from [#46007](https://github.com/expo/expo/pull/46007). Set it on `<Host>` to cascade to descendants. Accepts the 12 `DynamicTypeSize` cases, `xSmall` through `accessibility5`. | merged ([expo/expo#46540](https://github.com/expo/expo/pull/46540)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.15` | Resolve the `font` modifier on the Text-concatenation path. A `<Text>` nested in another `<Text>` built a fixed-size `Font.custom` that dropped `relativeTo` (Dynamic Type) and `weight`, so `font({ textStyle, weight })` scaled standalone but lost both once concatenated. Makes `FontModifier.resolveFont()` non-private and calls it from both paths, so concatenated runs resolve the identical `Font`. Completes [#46007](https://github.com/expo/expo/pull/46007). | merged ([expo/expo#46509](https://github.com/expo/expo/pull/46509)) |
| [`expo`](packages/expo/) | n/a | Close the fork-safety sweep started by [#45782](https://github.com/expo/expo/pull/45782) and [#45859](https://github.com/expo/expo/pull/45859). Gate 15 more workflows on `github.repository == 'expo/expo'` so fork CI stops red-checking on nightly jobs against org-published artifacts, hourly issue maintenance crons, the GCP publish path in `ios-prebuild-external-xcframeworks`, and Slack-notify steps that reference org-only webhooks. Covers `test-react-native-nightly`, `test-suite-nightly`, `lock`, `issue-stale`, `cli`, `create-expo-app`, `create-expo-module`, `fingerprint`, `sdk`, `ios-static-frameworks`, `ios-prebuild-external-xcframeworks`, `bare-diffs`, `native-component-list`, `test-suite`, `test-suite-macos`. Drops a redundant step-level repo check in `development-client-latest-e2e`. | merged ([expo/expo#46050](https://github.com/expo/expo/pull/46050)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.9` | Add iOS `font({ textStyle })` for Dynamic Type. Wires `textStyle` through to SwiftUI's `Font.system(_:design:)` and `Font.custom(_:size:relativeTo:)` so text scales with the user's preferred content size, the SwiftUI-native path for the Larger Text Accessibility Nutrition Label. Accepts all 11 `Font.TextStyle` cases. `extraLargeTitle` and `extraLargeTitle2` available on iOS 17+. | `56.0.10` ([expo/expo#46007](https://github.com/expo/expo/pull/46007)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.8` | Apply `<Host modifiers={...}>` on iOS. `HostProps` extends `CommonViewModifierProps` and `Host/index.tsx` already forwards `modifiers` to the native view, but `HostViewProps` (Swift) never declared the field, so every typechecked modifier on `Host` was a no-op. Adding the field plus one `.applyModifiers(...)` chain in `HostView.body` restores the entire registered modifier surface to `Host` in one shot. | `56.0.10` ([expo/expo#45872](https://github.com/expo/expo/pull/45872)) |
| [`expo`](packages/expo/) | n/a | Gate `pull_request_target`, `issues`, and label-event workflows on `github.repository == 'expo/expo'` so fork PRs stop red-checking on secret-gated jobs that can't run. Covers 18 workflows including `code-review`, `commentator`, `docs-pr`, `issue-triage`, and `sync-template`. Sibling to [#45782](https://github.com/expo/expo/pull/45782). | merged ([expo/expo#45859](https://github.com/expo/expo/pull/45859)) |
| [`expo`](packages/expo/) | n/a | Make five auto-firing scheduled workflows fork-safe. Swap `../expo/` (breaks on forks named anything but `expo`) for `${{ github.workspace }}`. Gate `validate-npm-owners`, `check-issues-nightly`, `publish-canaries`, and both `development-client-e2e` matrices on `github.repository == 'expo/expo'`. Drops failing checks and 120-minute fork CI burns. | merged ([expo/expo#45782](https://github.com/expo/expo/pull/45782)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260506-03817f5` | Add SwiftUI `Alert` component wrapping iOS 15 `.alert(_:isPresented:actions:message:)`, with `Alert.Trigger`, `Alert.Actions`, and optional `Alert.Message` slots. Mirrors `ConfirmationDialog`'s shape so `isPresented` bindings and `Button` actions compose the same way. | `56.0.8` ([expo/expo#45700](https://github.com/expo/expo/pull/45700)) |
| [`expo`](packages/expo/) | n/a | Resolve `workspace:*` peer deps for scoped packages whose dir name differs from the package name (`@expo/ui`, `@expo/app-integrity`). Same root cause as [#44412](https://github.com/expo/expo/pull/44412), different call site. Fix is in monorepo tooling, so the user-visible effect ships in the next canary of the affected packages. | `@expo/ui@56.0.0-canary-20260506-964f25d` ([expo/expo#45403](https://github.com/expo/expo/pull/45403)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add iOS 17 `scrollPosition(id:anchor:)` binding, `scrollPositionAnchor` prop, `onScrollPositionChangeSync` worklet callback, and `id(string)` view modifier. | `56.0.0-canary-20260505-d2856c3` ([expo/expo#44652](https://github.com/expo/expo/pull/44652)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.11.5` | Migrate to `better-auth` 1.6.9 (peer pinned `>=1.6.9 <1.7.0`). Adapter validators accept `Where.mode` case-folding. Pass `asResponse: false` at 7 plugin endpoints. Delegate cross-domain `parseSetCookieHeader` to `better-auth/cookies`. Add `twoFactor.verified` schema, expose `version` field, pick up [GHSA-xr8f-h2gw-9xh6](https://github.com/better-auth/better-auth/security/advisories/GHSA-xr8f-h2gw-9xh6) in `@better-auth/oauth-provider`. | `0.12.0` ([get-convex/better-auth#323](https://github.com/get-convex/better-auth/pull/323)) |
| [`better-auth`](packages/better-auth/) | n/a | Add `./instrumentation` subpath with `browser` and `edge` noop conditions so Convex V8 isolate stops crashing on `@opentelemetry/api` resolve. Pairs with [#9340](https://github.com/better-auth/better-auth/pull/9340). | `1.6.7` ([better-auth/better-auth#9281](https://github.com/better-auth/better-auth/pull/9281)) |
| [`shadcn/ui`](packages/shadcn-ui/) | n/a | Add `notFoundComponent` to `start-app` and `start-monorepo` root routes so favicon and DevTools probes stop printing `notFoundError` on first load. | merged ([shadcn-ui/ui#10369](https://github.com/shadcn-ui/ui/pull/10369)) |
| [`shadcn/ui`](packages/shadcn-ui/) | n/a | Add TanStack Start dark mode guide with the `ScriptOnce` and Context pattern. | merged ([shadcn-ui/ui#10396](https://github.com/shadcn-ui/ui/pull/10396)) |
| [`@astrojs/compiler-rs`](packages/withastro/compiler-rs/) | `0.1.7` | Switch linux-gnu builds from zigbuild `-x` to `--use-napi-cross`, dropping glibc baseline from 2.30 and 2.35 to 2.16 and 2.17. Fixes Vercel, Amazon Linux 2023, AWS Lambda, RHEL and CentOS 7, Debian 10. Supersedes [#22](https://github.com/withastro/compiler-rs/pull/22). | `0.1.8` ([withastro/compiler-rs#25](https://github.com/withastro/compiler-rs/pull/25)) |
| [`better-auth`](packages/better-auth/) | `1.6.2` | Add `/change-password` and `/revoke-other-sessions` to default `atomListeners` so `useSession()` updates after session-rotating endpoints. | `1.6.5` ([better-auth/better-auth#9087](https://github.com/better-auth/better-auth/pull/9087)) |
| [`better-auth`](packages/better-auth/) | n/a | Fix `operationId` on password reset callback endpoint. | `1.6.3` ([better-auth/better-auth#9072](https://github.com/better-auth/better-auth/pull/9072)) |
| [`shadcn/ui`](packages/shadcn-ui/) | n/a | Fix `llms.txt` 404 and missing routes. | merged ([shadcn-ui/ui#10337](https://github.com/shadcn-ui/ui/pull/10337)) |
| [`shadcn/ui`](packages/shadcn-ui/) | n/a | Strip raw `<ComponentsList>` tag from copy-to-markdown output. | merged ([shadcn-ui/ui#9484](https://github.com/shadcn-ui/ui/pull/9484)) |
| [`@astrojs/compiler-rs`](packages/withastro/compiler-rs/) | n/a | Add `-x` to `x86_64-unknown-linux-gnu` build for glibc compat. Superseded by [#25](https://github.com/withastro/compiler-rs/pull/25). | `0.1.7` ([withastro/compiler-rs#22](https://github.com/withastro/compiler-rs/pull/22)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add iOS `textContentType` modifier for SwiftUI text inputs. | `56.0.0-canary-20260409-6fc2991` ([expo/expo#44548](https://github.com/expo/expo/pull/44548)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add iOS `textInputAutocapitalization` modifier. | `56.0.0-canary-20260409-6fc2991` ([expo/expo#44547](https://github.com/expo/expo/pull/44547)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add iOS `scrollTargetBehavior` and `scrollTargetLayout` modifiers. | `56.0.0-canary-20260409-6fc2991` ([expo/expo#43955](https://github.com/expo/expo/pull/43955)) |
| [`@napi-rs/cli`](packages/napi-rs/) | n/a | Respect `--cross-compile` when host arch matches target arch. | `3.6.1` ([napi-rs/napi-rs#3189](https://github.com/napi-rs/napi-rs/pull/3189)) |
| [`shadcn/ui`](packages/shadcn-ui/) | n/a | Add `@ramonclaudio-coderabbit` to the registry directory. | merged ([shadcn-ui/ui#9331](https://github.com/shadcn-ui/ui/pull/9331)) |
| [`expo-modules-core`](packages/expo-modules-core/) | `56.0.0-canary-20260212-4f61309` | Serialize `PersistentFileLog.readEntries` on the dispatch queue to fix a race. | `56.0.0-canary-20260402-87c5ce2` ([expo/expo#43958](https://github.com/expo/expo/pull/43958)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add iOS `defaultScrollAnchorForRole` modifier. Add `null` support and macOS platform tag to `defaultScrollAnchor`. | `56.0.0-canary-20260401-5e87ef7` ([expo/expo#43923](https://github.com/expo/expo/pull/43923)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add iOS `defaultScrollAnchor` modifier. | `56.0.0-canary-20260401-5e87ef7` ([expo/expo#43914](https://github.com/expo/expo/pull/43914)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.12` | Remove stray `react-dom` peer dep. | `0.10.13` ([get-convex/better-auth#278](https://github.com/get-convex/better-auth/pull/278)) |
| [`app-store-connect-cli`](packages/rorkai/) | n/a | Add macOS app screen capture and Mac App Store canvas framing to `shots` command. | `0.35.0` ([rorkai/App-Store-Connect-CLI#784](https://github.com/rorkai/App-Store-Connect-CLI/pull/784)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.11` | Deduplicate concurrent `fetchAccessToken` calls with `pendingTokenRef`. | `0.10.12` ([get-convex/better-auth#267](https://github.com/get-convex/better-auth/pull/267)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add per-axis `scaleEffect({ x, y })` for view modifiers. | `56.0.0-canary-20260305-5163746` ([expo/expo#43228](https://github.com/expo/expo/pull/43228)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | Widen `better-auth` peer from `1.4.9` to `>=1.4.9 <1.5.0`. | `0.10.11` ([get-convex/better-auth#245](https://github.com/get-convex/better-auth/pull/245)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | Fix string-compared cookie expiry, null-cached sessions, and wrong `isAuthenticated` field check. | `0.10.11` ([get-convex/better-auth#218](https://github.com/get-convex/better-auth/pull/218)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add `capsule` and `ellipse` shapes to `clipShape` and `mask` via a `ShapeType` enum. | `56.0.0-canary-20260305-5163746` ([expo/expo#43158](https://github.com/expo/expo/pull/43158)) |
| [`convex`](packages/convex/) | `1.31.3` | Guard `WebSocketManager` against environments where `window` exists but `addEventListener` doesn't. | `1.31.4` ([get-convex/convex-js@baafbf5](https://github.com/get-convex/convex-js/commit/baafbf5bb200d6db81804558fbd01ccce77355fc)) |
| [`bun`](packages/oven-sh/bun/) | `1.2.20` | Add `decompress` option to `fetch()` TypeScript types. | `1.2.21` ([oven-sh/bun#21855](https://github.com/oven-sh/bun/pull/21855)) |
| [`create-fumadocs-app`](packages/create-fumadocs-app/) | `15.6.4` | Fix Prettier formatting in `tanstack-start` template's `NotFound.tsx`. | `15.6.5` ([fuma-nama/fumadocs#2095](https://github.com/fuma-nama/fumadocs/pull/2095)) |
| [`create-fumadocs-app`](packages/create-fumadocs-app/) | `15.6.4` | Fix Vite and TanStack Router config warnings in `tanstack-start` template. | `15.6.5` ([fuma-nama/fumadocs#2092](https://github.com/fuma-nama/fumadocs/pull/2092)) |
| [`@tanstack/db`](packages/tanstack/) | n/a | Fix example todo app path in README. | merged ([TanStack/db#17](https://github.com/TanStack/db/pull/17)) |
| [`jose`](packages/jose/) | `6.0.3` | Guard `process.getBuiltinModule` against Edge Runtime and Next.js middleware where it isn't defined. | `6.0.4` ([panva/jose@v6.0.4](https://github.com/panva/jose/releases/tag/v6.0.4)) |

## Usage

Most patches drop straight into `bun`, `pnpm`, or Yarn Berry. `npm` and Yarn classic apply them via `patch-package`. Source-only patches (CI, docs, non-npm code) get applied with `git apply` against a clone of the upstream repo.

Copy the patch file into your `patches/` dir. Strip the `-prXXX` suffix from the filename so it matches what your package manager expects.

> [!IMPORTANT]
> Patches are NOT drop-in across package managers. Two things differ:
>
> **Filename.** Each tool uses a different separator for scoped packages:
>
> | Tool | Format |
> | :--- | :--- |
> | Bun | `@scope%2Fpkg@version.patch` |
> | npm and Yarn classic (patch-package) | `@scope+pkg+version.patch` |
> | pnpm and Yarn Berry | `@scope__pkg@version.patch` |
>
> **Diff paths.** Bun, pnpm, and Yarn Berry use paths relative to the package root. patch-package prefixes with `node_modules/@scope/pkg/`. To convert:
>
> ```bash
> # Strip node_modules prefix (Bun, pnpm, Yarn Berry)
> sed 's|node_modules/@scope/pkg/||g' old.patch > new.patch
>
> # Add node_modules prefix (patch-package)
> sed -e '/^diff --git /s|a/|a/node_modules/@scope/pkg/|' \
>     -e '/^diff --git /s|b/|b/node_modules/@scope/pkg/|' \
>     -e 's|^--- a/|--- a/node_modules/@scope/pkg/|' \
>     -e 's|^+++ b/|+++ b/node_modules/@scope/pkg/|' \
>     old.patch > new.patch
> ```

<details>
<summary>Bun (1.3+)</summary>

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
<summary>npm (11+)</summary>

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
<summary>pnpm (11+)</summary>

[`pnpm patch`](https://pnpm.io/cli/patch). Config goes in `pnpm-workspace.yaml`.

```yaml
# pnpm-workspace.yaml
patchedDependencies:
  "@convex-dev/better-auth@0.10.10": "patches/@convex-dev__better-auth@0.10.10.patch"
```

</details>

<details>
<summary>Yarn classic (1.22+)</summary>

No native patching. Same setup as npm: [patch-package](https://github.com/ds300/patch-package) via `postinstall`. The `packages/*/npm/` patches work as-is. Copy into `patches/` and strip the `-prXXX` suffix.

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
<summary>Yarn Berry (2+, 3+, 4+)</summary>

Native [`yarn patch`](https://yarnpkg.com/cli/patch) with the `patch:` protocol. The `packages/*/pnpm/` patches work as-is (same diff format, same filename). Copy into `.yarn/patches/` and add a `resolutions` entry.

```jsonc
// package.json
{
  "resolutions": {
    "@convex-dev/[email protected]": "patch:@convex-dev/better-auth@npm:0.10.10#./.yarn/patches/@convex-dev__better-auth@0.10.10.patch"
  }
}
```

</details>

## Multiple patches for the same package

One patch file per PR in this repo. But most package managers only support **one patch per `package@version`**.

| Tool | Multiple? | Details |
| :--- | :--- | :--- |
| **Bun** | No | One entry per `package@version` in `patchedDependencies`. Combine into one `.patch`. |
| **pnpm** | No | One entry per exact version in `patchedDependencies`. Combine into one `.patch`. |
| **Yarn Berry** | No | One entry per package in `resolutions`. Combine into one `.patch`. |
| **npm and Yarn classic** (patch-package) | Yes | Use `--append` for sequenced patches: `pkg+ver+001+fix-a.patch`, `pkg+ver+002+fix-b.patch`. |

<details>
<summary>Combining patches (Bun, pnpm, Yarn Berry)</summary>

Apply all changes to `node_modules` and let the tool generate one combined diff. Bun:

```bash
bun patch @expo/ui
git apply --directory=node_modules/@expo/ui patches/fix-a.patch
git apply --directory=node_modules/@expo/ui patches/fix-b.patch
bun patch --commit @expo/ui
```

pnpm and Yarn Berry follow the same shape. `pnpm patch <pkg>` and `yarn patch <pkg>` each print a temp dir to edit, then commit with `pnpm patch-commit <dir>` or `yarn patch-commit -s <dir>`.

If the patches touch completely different files, `cat` works:

```bash
cat patches/fix-a.patch patches/fix-b.patch > patches/@expo%2Fui@56.0.0-canary-20260212-4f61309.patch
```

If patches touch the same file, use the `patch` workflow above instead.

</details>

<details>
<summary>Sequenced patches (npm, Yarn classic)</summary>

patch-package applies multiple patches per package in sequence. No combining needed.

When you grab two patches from this repo for the same `package@version`, rename them with sequence numbers:

```text
patches/
  @expo+ui+56.0.0+001+fix-a.patch
  @expo+ui+56.0.0+002+fix-b.patch
```

For your own edits in `node_modules`, `--append` generates a sequenced patch:

```bash
npx patch-package @expo/ui --append fix-name
```

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
