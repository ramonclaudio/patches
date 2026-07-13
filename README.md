# patches

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Talk is cheap, send patches.
>
> [@FFmpeg](https://x.com/FFmpeg/status/1762805900035686805)

Every time I open a PR upstream I write a patch and use it locally so I'm not blocked while the PR sits in review. The patch lands here too. Drop it into your project and keep moving. Once the fix ships in a release, delete the patch and bump the dep.

This is me sending patches.

## Open

Still open upstream, so the fix could change. Every row has a patch in `packages/` you can drop in.

| Package                                  | Version  | Fix                                                                                                                                                                                                                                                  | PR                                                                                   |
| :--------------------------------------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| [`expo`](packages/expo/)                 | n/a      | Exit 1 when docs API data generation fails for any package and run the `expotools` test suite in CI, so dead mapping entries stop shipping silently.                                                                                                 | [expo/expo#47691](https://github.com/expo/expo/pull/47691)                           |
| [`expo-updates`](packages/expo-updates/) | `57.0.6` | Fix the Xcode 14+ warning about `EXUpdates.podspec`'s updates-resources script phase on every clean build.                                                                                                                                           | [expo/expo#47622](https://github.com/expo/expo/pull/47622)                           |
| [`hermes`](packages/hermes/)             | n/a      | Cherry-pick `1e94fbe0eb` onto `250829098.0.0-stable`. A class declared in a `finally` block miscompiles ([facebook/hermes#1761](https://github.com/facebook/hermes/issues/1761)).                                                                    | [facebook/hermes#2046](https://github.com/facebook/hermes/pull/2046)                 |
| [`hermes`](packages/hermes/)             | n/a      | Cherry-pick `18a9634659` onto the `250829098.0.0-stable` branch React Native 0.85 ships. `super.x` in an object-literal getter or setter crashed `hermesc` at compile time ([facebook/hermes#1761](https://github.com/facebook/hermes/issues/1761)). | [facebook/hermes#2045](https://github.com/facebook/hermes/pull/2045)                 |
| [`react-native`](packages/react-native/) | `0.85.3` | Fix the Xcode 14+ warning about `hermes-engine.podspec`'s Hermes-replace script phase on every clean build.                                                                                                                                          | [react/react-native#56912](https://github.com/react/react-native/pull/56912)         |
| [`bun`](packages/oven-sh/bun/)           | `1.3.14` | Fix `bun add X@version` being silently ignored when `X` is also a same-name `peerDependency`, leaving `bun.lock` and `node_modules` pinned to the peer's version. Rust port of [#29804](https://github.com/oven-sh/bun/pull/29804).                  | [oven-sh/bun#30855](https://github.com/oven-sh/bun/pull/30855)                       |
| [`better-auth`](packages/better-auth/)   | `1.6.11` | Preserve the caller's session on `/change-password` with `revokeOtherSessions: true`.                                                                                                                                                                | [better-auth/better-auth#9345](https://github.com/better-auth/better-auth/pull/9345) |
| [`shadcn`](packages/shadcn/)             | `4.7.0`  | Strip control characters from `prompts` text input so Cmd+Delete on macOS stops creating directories like `\x15my-app`.                                                                                                                              | [shadcn-ui/ui#10364](https://github.com/shadcn-ui/ui/pull/10364)                     |
| [`bun`](packages/oven-sh/bun/)           | `1.3.13` | Fix invalid YAML in `update-root-certs` workflow `labels` field.                                                                                                                                                                                     | [oven-sh/bun#27086](https://github.com/oven-sh/bun/pull/27086)                       |

## Merged

Merged upstream. `Fixed in` is the version to bump to, then delete the patch. Several versions means the fix shipped on several release lines, so bump to the one on yours. `unreleased` means the fix merged but isn't in a published version yet, so keep the patch until it lands.

| Package                                                        | Was                              | Fix                                                                                                                                                                                                                                                                                                    | Fixed in                                                                                                                           |
| :------------------------------------------------------------- | :------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| [`expo`](packages/expo/)                                       | n/a                              | Guard the `RCTDevMenu.devMenuEnabled` and `keyboardShortcutsEnabled` writes with `#if !os(macOS)` so `expo-dev-menu` compiles against react-native-macos again.                                                                                                                                        | merged ([expo/expo#47693](https://github.com/expo/expo/pull/47693))                                                                |
| [`expo`](packages/expo/)                                       | n/a                              | Wrap the `RCTBundleURLProviderAllowPackagerServerAccess` call sites in React Native's exact declaration guard so `expo-dev-launcher` compiles in Release again.                                                                                                                                        | merged ([expo/expo#47688](https://github.com/expo/expo/pull/47688))                                                                |
| [`expo`](packages/expo/)                                       | n/a                              | Fix two dead docs data mapping entries and report every generation failure by package instead of only the first rejection.                                                                                                                                                                             | merged ([expo/expo#47670](https://github.com/expo/expo/pull/47670))                                                                |
| [`expo`](packages/expo/)                                       | n/a                              | Regenerate 32 drifted unversioned docs API data files so local docs and single-package regen PRs stop inheriting stale content.                                                                                                                                                                        | merged ([expo/expo#47663](https://github.com/expo/expo/pull/47663))                                                                |
| [`expo-router`](packages/expo-router/)                         | `57.0.3`                         | Add `testID` and `accessibilityLabel` props to `NativeTabs.Trigger`, so UI-testing tools can target tabs and screen readers get a label.                                                                                                                                                               | unreleased ([expo/expo#47472](https://github.com/expo/expo/pull/47472))                                                            |
| [`@expo/ui`](packages/@expo/ui/)                               | `57.0.2`                         | Add iOS `strokeBorder` modifier. Strokes an inset border that follows the view's shape, so it can be dashed or dotted and hug rounded corners.                                                                                                                                                         | `56.0.20`, `57.0.3` ([expo/expo#47426](https://github.com/expo/expo/pull/47426))                                                   |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.19`                        | Add iOS `accessibilityAddTraits` and `accessibilityRemoveTraits` modifiers. Tag a view with semantic traits for VoiceOver or strip inherited ones.                                                                                                                                                     | `56.0.20`, `57.0.3` ([expo/expo#47387](https://github.com/expo/expo/pull/47387))                                                   |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.18`                        | Add iOS `redacted`, `unredacted`, `privacySensitive`, and `invalidatableContent` modifiers. `redacted('placeholder')` swaps a view's subtree for skeleton placeholders.                                                                                                                                | `56.0.19`, `57.0.1` ([expo/expo#47269](https://github.com/expo/expo/pull/47269))                                                   |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.18`                        | Add iOS `accessibilityElement` modifier. Collapses a subtree into one accessibility element so VoiceOver reads grouped children as a single element.                                                                                                                                                   | `56.0.19`, `57.0.0` ([expo/expo#47156](https://github.com/expo/expo/pull/47156))                                                   |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.16`                        | Add iOS `imageScale` modifier. Scales SF Symbols relative to the surrounding text.                                                                                                                                                                                                                     | `56.0.17` ([expo/expo#46774](https://github.com/expo/expo/pull/46774))                                                             |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.16`                        | Fix `font`, `dynamicTypeSize`, and `resizable` modifiers being ignored on the `Image` component, so SF Symbols scale with Dynamic Type.                                                                                                                                                                | `56.0.17` ([expo/expo#46714](https://github.com/expo/expo/pull/46714))                                                             |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.16`                        | Add iOS `accessibilityInputLabels` modifier. Sets the alternative phrases Voice Control listens for, so a control with a terse visible label like "End" answers to "Hang up" or "End call".                                                                                                            | `56.0.17` ([expo/expo#46661](https://github.com/expo/expo/pull/46661))                                                             |
| [`hermes`](packages/hermes/)                                   | n/a                              | Swap the hardcoded `hermes` source dir for `${{ github.event.repository.name }}` in the `test-linux-armv7` job. `actions/checkout@v1` names the checkout dir after the repo ([actions/checkout#334](https://github.com/actions/checkout/issues/334)), so the job fails on any fork not named `hermes`. | merged ([facebook/hermes#2047](https://github.com/facebook/hermes/pull/2047))                                                      |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.15`                        | Add iOS `accessibilityHidden` modifier. Hides decorative views from VoiceOver.                                                                                                                                                                                                                         | `56.0.16` ([expo/expo#46579](https://github.com/expo/expo/pull/46579))                                                             |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.15`                        | Add iOS `accessibilityIdentifier` modifier. Sets a stable, machine-readable id that UI-testing tools like XCUITest read to locate a view.                                                                                                                                                              | `56.0.16` ([expo/expo#46556](https://github.com/expo/expo/pull/46556))                                                             |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.15`                        | Add iOS `dynamicTypeSize` modifier to set or clamp Dynamic Type within a view. Caps how far text grows at the largest accessibility sizes so layouts stay safe.                                                                                                                                        | `56.0.16` ([expo/expo#46540](https://github.com/expo/expo/pull/46540))                                                             |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.15`                        | Resolve the `font` modifier on the Text-concatenation path. A `<Text>` nested in another `<Text>` dropped Dynamic Type and `weight`, so `font({ textStyle, weight })` scaled standalone but lost both once concatenated.                                                                               | `56.0.16` ([expo/expo#46509](https://github.com/expo/expo/pull/46509))                                                             |
| [`expo`](packages/expo/)                                       | n/a                              | Gate 15 more workflows on `github.repository == 'expo/expo'` so fork CI stops red-checking on org-only nightly jobs, issue crons, and Slack-notify steps.                                                                                                                                              | merged ([expo/expo#46050](https://github.com/expo/expo/pull/46050))                                                                |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.9`                         | Add iOS `font({ textStyle })` modifier. Text scales with the user's preferred content size (Dynamic Type).                                                                                                                                                                                             | `56.0.10` ([expo/expo#46007](https://github.com/expo/expo/pull/46007))                                                             |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.8`                         | Apply `modifiers` on `<Host>` on iOS. Every modifier set on `Host` was silently a no-op.                                                                                                                                                                                                               | `56.0.10` ([expo/expo#45872](https://github.com/expo/expo/pull/45872))                                                             |
| [`expo`](packages/expo/)                                       | n/a                              | Gate `pull_request_target`, `issues`, and label-event workflows on `github.repository == 'expo/expo'` so fork PRs stop red-checking on secret-gated jobs that can't run.                                                                                                                               | merged ([expo/expo#45859](https://github.com/expo/expo/pull/45859))                                                                |
| [`expo`](packages/expo/)                                       | n/a                              | Make five auto-firing scheduled workflows fork-safe by gating them on `github.repository == 'expo/expo'`. Drops failing checks and 120-minute fork CI burns.                                                                                                                                           | merged ([expo/expo#45782](https://github.com/expo/expo/pull/45782))                                                                |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.0-canary-20260506-03817f5` | Add SwiftUI `Alert` component with `Alert.Trigger`, `Alert.Actions`, and optional `Alert.Message` slots.                                                                                                                                                                                               | `55.0.17`, `56.0.8` ([expo/expo#45700](https://github.com/expo/expo/pull/45700))                                                   |
| [`expo`](packages/expo/)                                       | n/a                              | Resolve `workspace:*` peer deps for scoped packages whose dir name differs from the package name (`@expo/ui`, `@expo/app-integrity`). Same root cause as [#44412](https://github.com/expo/expo/pull/44412), different call site.                                                                       | `@expo/ui@56.0.0-canary-20260506-964f25d` ([expo/expo#45403](https://github.com/expo/expo/pull/45403))                             |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.0-canary-20260212-4f61309` | Add iOS 17 `scrollPosition` binding and change callback for tracking and programmatically setting scroll offset.                                                                                                                                                                                       | `56.0.0-canary-20260505-d2856c3` ([expo/expo#44652](https://github.com/expo/expo/pull/44652))                                      |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.11.5`                         | Migrate to `better-auth` 1.6.9 (peer pinned `>=1.6.9 <1.7.0`), picking up [GHSA-xr8f-h2gw-9xh6](https://github.com/better-auth/better-auth/security/advisories/GHSA-xr8f-h2gw-9xh6) in `@better-auth/oauth-provider`.                                                                                  | `0.12.0` ([get-convex/better-auth#323](https://github.com/get-convex/better-auth/pull/323))                                        |
| [`better-auth`](packages/better-auth/)                         | n/a                              | Add `./instrumentation` subpath with `browser` and `edge` noop conditions so Convex V8 isolate stops crashing on `@opentelemetry/api` resolve.                                                                                                                                                         | `1.6.7` ([better-auth/better-auth#9281](https://github.com/better-auth/better-auth/pull/9281))                                     |
| [`shadcn/ui`](packages/shadcn-ui/)                             | n/a                              | Add `notFoundComponent` to `start-app` and `start-monorepo` root routes so favicon and DevTools probes stop printing `notFoundError` on first load.                                                                                                                                                    | merged ([shadcn-ui/ui#10369](https://github.com/shadcn-ui/ui/pull/10369))                                                          |
| [`shadcn/ui`](packages/shadcn-ui/)                             | n/a                              | Add TanStack Start dark mode guide with the `ScriptOnce` and Context pattern.                                                                                                                                                                                                                          | merged ([shadcn-ui/ui#10396](https://github.com/shadcn-ui/ui/pull/10396))                                                          |
| [`@astrojs/compiler-rs`](packages/withastro/compiler-rs/)      | `0.1.7`                          | Switch linux-gnu builds from zigbuild `-x` to `--use-napi-cross`, dropping glibc baseline from 2.30 and 2.35 to 2.16 and 2.17. Fixes Vercel, Amazon Linux 2023, AWS Lambda, RHEL and CentOS 7, Debian 10. Supersedes [#22](https://github.com/withastro/compiler-rs/pull/22).                          | `0.1.8` ([withastro/compiler-rs#25](https://github.com/withastro/compiler-rs/pull/25))                                             |
| [`better-auth`](packages/better-auth/)                         | `1.6.2`                          | Add `/change-password` and `/revoke-other-sessions` to default `atomListeners` so `useSession()` updates after session-rotating endpoints.                                                                                                                                                             | `1.6.5` ([better-auth/better-auth#9087](https://github.com/better-auth/better-auth/pull/9087))                                     |
| [`better-auth`](packages/better-auth/)                         | n/a                              | Fix `operationId` on password reset callback endpoint.                                                                                                                                                                                                                                                 | `1.6.3` ([better-auth/better-auth#9072](https://github.com/better-auth/better-auth/pull/9072))                                     |
| [`shadcn/ui`](packages/shadcn-ui/)                             | n/a                              | Fix `llms.txt` 404 and missing routes.                                                                                                                                                                                                                                                                 | merged ([shadcn-ui/ui#10337](https://github.com/shadcn-ui/ui/pull/10337))                                                          |
| [`shadcn/ui`](packages/shadcn-ui/)                             | n/a                              | Strip raw `<ComponentsList>` tag from copy-to-markdown output.                                                                                                                                                                                                                                         | merged ([shadcn-ui/ui#9484](https://github.com/shadcn-ui/ui/pull/9484))                                                            |
| [`@astrojs/compiler-rs`](packages/withastro/compiler-rs/)      | n/a                              | Add `-x` to `x86_64-unknown-linux-gnu` build for glibc compat. Superseded by [#25](https://github.com/withastro/compiler-rs/pull/25).                                                                                                                                                                  | `0.1.7` ([withastro/compiler-rs#22](https://github.com/withastro/compiler-rs/pull/22))                                             |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.0-canary-20260212-4f61309` | Add iOS `textContentType` modifier for SwiftUI text inputs.                                                                                                                                                                                                                                            | `55.0.2`, `56.0.0-canary-20260409-6fc2991` ([expo/expo#44548](https://github.com/expo/expo/pull/44548))                            |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.0-canary-20260212-4f61309` | Add iOS `textInputAutocapitalization` modifier.                                                                                                                                                                                                                                                        | `55.0.2`, `56.0.0-canary-20260409-6fc2991` ([expo/expo#44547](https://github.com/expo/expo/pull/44547))                            |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.0-canary-20260212-4f61309` | Add iOS `scrollTargetBehavior` and `scrollTargetLayout` modifiers.                                                                                                                                                                                                                                     | `55.0.2`, `56.0.0-canary-20260409-6fc2991` ([expo/expo#43955](https://github.com/expo/expo/pull/43955))                            |
| [`@napi-rs/cli`](packages/napi-rs/)                            | n/a                              | Respect `--cross-compile` when host arch matches target arch.                                                                                                                                                                                                                                          | `3.6.1` ([napi-rs/napi-rs#3189](https://github.com/napi-rs/napi-rs/pull/3189))                                                     |
| [`shadcn/ui`](packages/shadcn-ui/)                             | n/a                              | Add `@ramonclaudio-coderabbit` to the registry directory.                                                                                                                                                                                                                                              | merged ([shadcn-ui/ui#9331](https://github.com/shadcn-ui/ui/pull/9331))                                                            |
| [`expo-modules-core`](packages/expo-modules-core/)             | `56.0.0-canary-20260212-4f61309` | Serialize `PersistentFileLog.readEntries` on the dispatch queue to fix a race.                                                                                                                                                                                                                         | `55.0.18`, `56.0.0-canary-20260402-87c5ce2` ([expo/expo#43958](https://github.com/expo/expo/pull/43958))                           |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.0-canary-20260212-4f61309` | Add iOS `defaultScrollAnchorForRole` modifier, and `null` support on `defaultScrollAnchor`.                                                                                                                                                                                                            | `55.0.2`, `56.0.0-canary-20260401-5e87ef7` ([expo/expo#43923](https://github.com/expo/expo/pull/43923))                            |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.0-canary-20260212-4f61309` | Add iOS `defaultScrollAnchor` modifier.                                                                                                                                                                                                                                                                | `55.0.2`, `56.0.0-canary-20260401-5e87ef7` ([expo/expo#43914](https://github.com/expo/expo/pull/43914))                            |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.12`                        | Remove stray `react-dom` peer dep.                                                                                                                                                                                                                                                                     | `0.10.13` ([get-convex/better-auth#278](https://github.com/get-convex/better-auth/pull/278))                                       |
| [`app-store-connect-cli`](packages/rorkai/)                    | n/a                              | Add macOS app screen capture and Mac App Store canvas framing to `shots` command.                                                                                                                                                                                                                      | `0.35.0` ([rorkai/App-Store-Connect-CLI#784](https://github.com/rorkai/App-Store-Connect-CLI/pull/784))                            |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.11`                        | Deduplicate concurrent `fetchAccessToken` calls.                                                                                                                                                                                                                                                       | `0.10.12` ([get-convex/better-auth#267](https://github.com/get-convex/better-auth/pull/267))                                       |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.0-canary-20260212-4f61309` | Add per-axis `scaleEffect({ x, y })` for view modifiers.                                                                                                                                                                                                                                               | `55.0.0-preview.7`, `56.0.0-canary-20260305-5163746` ([expo/expo#43228](https://github.com/expo/expo/pull/43228))                  |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10`                        | Widen `better-auth` peer from `1.4.9` to `>=1.4.9 <1.5.0`.                                                                                                                                                                                                                                             | `0.10.11` ([get-convex/better-auth#245](https://github.com/get-convex/better-auth/pull/245))                                       |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10`                        | Fix string-compared cookie expiry, null-cached sessions, and wrong `isAuthenticated` field check.                                                                                                                                                                                                      | `0.10.11` ([get-convex/better-auth#218](https://github.com/get-convex/better-auth/pull/218))                                       |
| [`@expo/ui`](packages/@expo/ui/)                               | `56.0.0-canary-20260212-4f61309` | Add `capsule` and `ellipse` shapes to `clipShape` and `mask`.                                                                                                                                                                                                                                          | `55.0.0-preview.6`, `56.0.0-canary-20260305-5163746` ([expo/expo#43158](https://github.com/expo/expo/pull/43158))                  |
| [`convex`](packages/convex/)                                   | `1.31.3`                         | Guard `WebSocketManager` against environments where `window` exists but `addEventListener` doesn't.                                                                                                                                                                                                    | `1.31.4` ([get-convex/convex-js@baafbf5](https://github.com/get-convex/convex-js/commit/baafbf5bb200d6db81804558fbd01ccce77355fc)) |
| [`bun`](packages/oven-sh/bun/)                                 | `1.2.20`                         | Add `decompress` option to `fetch()` TypeScript types.                                                                                                                                                                                                                                                 | `1.2.21` ([oven-sh/bun#21855](https://github.com/oven-sh/bun/pull/21855))                                                          |
| [`create-fumadocs-app`](packages/create-fumadocs-app/)         | `15.6.4`                         | Fix Prettier formatting in `tanstack-start` template's `NotFound.tsx`.                                                                                                                                                                                                                                 | `15.6.5` ([fuma-nama/fumadocs#2095](https://github.com/fuma-nama/fumadocs/pull/2095))                                              |
| [`create-fumadocs-app`](packages/create-fumadocs-app/)         | `15.6.4`                         | Fix Vite and TanStack Router config warnings in `tanstack-start` template.                                                                                                                                                                                                                             | `15.6.5` ([fuma-nama/fumadocs#2092](https://github.com/fuma-nama/fumadocs/pull/2092))                                              |
| [`@tanstack/db`](packages/tanstack/)                           | n/a                              | Fix example todo app path in README.                                                                                                                                                                                                                                                                   | merged ([TanStack/db#17](https://github.com/TanStack/db/pull/17))                                                                  |
| [`jose`](packages/jose/)                                       | `6.0.3`                          | Guard `process.getBuiltinModule` against Edge Runtime and Next.js middleware where it isn't defined.                                                                                                                                                                                                   | `6.0.4` ([panva/jose@v6.0.4](https://github.com/panva/jose/releases/tag/v6.0.4))                                                   |

## Usage

Most patches drop straight into `bun`, `pnpm`, or Yarn Berry. `npm` and Yarn classic apply them via `patch-package`. Source-only patches (CI, docs, non-npm code) apply with `git apply` against a clone of the upstream repo.

Copy the patch into your `patches/` dir and strip the `-prXXX` suffix so the filename matches what your package manager expects.

> [!IMPORTANT]
> Patches are NOT drop-in across package managers. Two things differ:
>
> **Filename.** Each tool uses a different separator for scoped packages:
>
> | Tool                                 | Format                       |
> | :----------------------------------- | :--------------------------- |
> | Bun                                  | `@scope%2Fpkg@version.patch` |
> | npm and Yarn classic (patch-package) | `@scope+pkg+version.patch`   |
> | pnpm and Yarn Berry                  | `@scope__pkg@version.patch`  |
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
    "@expo/ui@56.0.0-canary-20260212-4f61309": "patches/@expo%2Fui@56.0.0-canary-20260212-4f61309.patch",
  },
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
    "postinstall": "patch-package",
  },
  "devDependencies": {
    "patch-package": "^8.0.1",
  },
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
    "postinstall": "patch-package",
  },
  "devDependencies": {
    "patch-package": "^8.0.1",
  },
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
    "@convex-dev/[email protected]": "patch:@convex-dev/better-auth@npm:0.10.10#./.yarn/patches/@convex-dev__better-auth@0.10.10.patch",
  },
}
```

</details>

## Multiple patches for the same package

One patch file per PR in this repo. But most package managers only support **one patch per `package@version`**.

| Tool                                     | Multiple? | Details                                                                                     |
| :--------------------------------------- | :-------- | :------------------------------------------------------------------------------------------ |
| **Bun**                                  | No        | One entry per `package@version` in `patchedDependencies`. Combine into one `.patch`.        |
| **pnpm**                                 | No        | One entry per exact version in `patchedDependencies`. Combine into one `.patch`.            |
| **Yarn Berry**                           | No        | One entry per package in `resolutions`. Combine into one `.patch`.                          |
| **npm and Yarn classic** (patch-package) | Yes       | Use `--append` for sequenced patches: `pkg+ver+001+fix-a.patch`, `pkg+ver+002+fix-b.patch`. |

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

Source-only patches (CI, docs, non-npm code) skip the per-manager split and live as a single `git apply` diff at `packages/<repo>/<repo>-prXXX.patch`, e.g. `packages/hermes/hermes-pr2045.patch` or `packages/expo/expo-pr46050.patch`.

The `-prXXX` suffix (e.g. `@expo%2Fui@56.0.0-canary-20260212-4f61309-pr43228.patch`) traces back to the upstream PR. Strip it when copying to your project.

## License

[MIT](LICENSE)
