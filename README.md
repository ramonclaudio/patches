# patches

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

I live on canary versions of half my stack (Bun, Expo, Convex, Hydrogen). Stuff breaks. I file the PR upstream, then patch my own apps so I'm not blocked while it sits in review. This repo is where I keep those patches so I can grab them across machines, share them with people hitting the same bugs, and trace each one back to its upstream PR.

Most are ready to drop into `bun`, `npm` (via `patch-package`), or `pnpm`. Source-only patches (CI, docs, non-npm code) are applied with `git apply` in a clone of the upstream repo.

> Talk is cheap, send patches.
>
> [@FFmpeg](https://x.com/FFmpeg/status/1762805900035686805)

> [!NOTE]
> Patches move Open -> Merged -> Released as PRs land and versions ship. Once released, bump the dep and drop the patch.

## Open

PRs still in flight. Every row has a patch in `packages/` you can drop into your project. Indented rows (`↳`) are sibling patches from the same PR, apply them together.

| Package | Version | Format | Fix | PR |
| :--- | :--- | :--- | :--- | :--- |
| [`shadcn`](packages/shadcn/) | `4.7.0` | Bun, npm (patch-package), pnpm | Hit Cmd+Delete on macOS to clear the default in `npx shadcn add` and you end up with a directory called `\x15my-app`. Cmd+Delete sends Ctrl+U, which `prompts` happily writes through as a NAK byte. Patch strips C0 (`0x00`-`0x1F`) and DEL (`0x7F`) before they reach the input. | [shadcn-ui/ui#10364](https://github.com/shadcn-ui/ui/pull/10364) |
| [`bun`](packages/oven-sh/bun/) | `1.3.13` | Bun | Bad YAML in the `update-root-certs` workflow. `labels` was a sequence, the action wanted a multiline string. | [oven-sh/bun#27086](https://github.com/oven-sh/bun/pull/27086) |
| [`bun`](packages/oven-sh/bun/) | `1.3.13` | Bun | Peer dep semver validation was ignoring `includePrerelease`, so valid prereleases triggered noisy warnings on `bun install`. Patch ports the `satisfiesIncludePrerelease` path through to peer dep checks. | [oven-sh/bun#27085](https://github.com/oven-sh/bun/pull/27085) |
| [`better-auth`](packages/better-auth/) | `1.6.9` | Bun, npm (patch-package), pnpm | Calling `/change-password` with `revokeOtherSessions: true` was wiping out the caller's own session along with everyone else's. JSDoc says "revoke all sessions that are not the current one". Code did the opposite. Convex and other JWT consumers held a token pointing at a deleted row for half a second to a second and a half. Patch copies the filter from `/revoke-other-sessions`, so siblings die but the caller survives. Same family as [#9087](https://github.com/better-auth/better-auth/pull/9087). | [better-auth/better-auth#9345](https://github.com/better-auth/better-auth/pull/9345) |
| [`@hugeicons/react`](packages/@hugeicons/react/) | `1.1.6` | Bun, npm (patch-package), pnpm | `@hugeicons/core-free-icons` ships 5,100+ per-icon JS files but only a barrel `index.d.ts`. Subpath imports (`@hugeicons/core-free-icons/Heart`) work at runtime, but TypeScript can't find their types under `node16`, `nodenext`, or `bundler` resolution, so Vite dev pre-bundles the whole barrel. 6.2 MB instead of the 33 KB you actually use. PR ships `dist/types/core-free-icons.d.ts` (a script with `declare module '@hugeicons/core-free-icons/*'` and the `IconSvgObject` union the barrel exports: `[string, { [key: string]: string \| number }][] \| readonly (readonly [string, { readonly [key: string]: string \| number }])[]`) and prepends `/// <reference path="./core-free-icons.d.ts" />` to `dist/types/index.d.ts`, so the ambient declaration is global. (Script `.d.ts` triple-slash-loaded from a module entry is the only shape TS accepts. Inline a `declare module` block into a file with top-level `export` and TS treats it as a module augmentation, scoped to that module, not a global ambient.) npm and pnpm patches mirror the PR exactly. The bun patch ships the script `.d.ts` at `dist/core-free-icons.d.ts` instead and adjusts the triple-slash to `../core-free-icons.d.ts` so `bun patchedDependencies` can apply it without tripping [`oven-sh/bun#13330`](https://github.com/oven-sh/bun/issues/13330). Single-subdir new files apply fine, nested ones fail. | [hugeicons/react#5](https://github.com/hugeicons/react/pull/5) |
| [`expo`](packages/expo/) | n/a | Source (git apply) | Tried installing `@expo/ui` after upgrading to canary expo per the docs and `bun add @expo/ui@canary` errored with `Workspace dependency "expo" not found`. Canary tarballs were shipping `peerDependencies.expo: "workspace:*"` literal, never substituted. `getPackageByName` does a path lookup at `packages/<name>/package.json`, which misses for `@expo/ui` (lives at `packages/expo-ui/`) and `@expo/app-integrity` (at `packages/expo-app-integrity/`). On a miss, `Workspace.getInfoAsync` records empty peer deps, so `updateWorkspaceProjects` never rewrites `workspace:*`. Patch adds a name-based fallback that scans `cachedPackages` when the path lookup misses. Same root cause as [#44412](https://github.com/expo/expo/pull/44412), different call site. | [expo/expo#45403](https://github.com/expo/expo/pull/45403) |

## Released

Merged upstream. Bump the dep (or wait for the next canary), then delete the patch.

| Package | Was | Format | Fix | Fixed in |
| :--- | :--- | :--- | :--- | :--- |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | iOS 17 `scrollPosition(id:anchor:)` binding, `scrollPositionAnchor` prop, `onScrollPositionChangeSync` worklet callback, and the `id(string)` view modifier so SwiftUI can find scroll targets. | `56.0.0-canary-20260505-d2856c3` ([expo/expo#44652](https://github.com/expo/expo/pull/44652)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.11.5` | Bun, npm (patch-package), pnpm | Migrate to `better-auth` 1.6.9. Pin peer to `>=1.6.9 <1.7.0` because 1.6.7 and 1.6.8 crashed the Convex V8 isolate on every `/api/auth/*` call. (`@better-auth/core`'s adapter factory had a bare `@opentelemetry/api` import that blew up at resolve time. [better-auth/better-auth#9340](https://github.com/better-auth/better-auth/pull/9340) routed it through a self-reference so `browser` and `edge` export conditions could resolve to a noop.) Adapter validators now accept `Where.mode` with case-folding, so `api.adapter.findOne` stops throwing `ArgumentValidationError` on insensitive clauses. Pass `asResponse: false` at 7 internal plugin endpoint sites because 1.6 flipped the `shouldReturnResponse` default and was turning `{ token }` responses into `undefined`. Delegate cross-domain `parseSetCookieHeader` to `better-auth/cookies` so cookies with RFC-1123 `Expires` dates stop shattering ([#8301](https://github.com/better-auth/better-auth/pull/8301) postdated my local copy). Adds `twoFactor.verified` schema, exposes `version` on convex and cross-domain plugins, suppresses the `@better-auth/oidc-provider` deprecation warning, picks up [GHSA-xr8f-h2gw-9xh6](https://github.com/better-auth/better-auth/security/advisories/GHSA-xr8f-h2gw-9xh6) in `@better-auth/oauth-provider`. | `0.12.0` ([get-convex/better-auth#323](https://github.com/get-convex/better-auth/pull/323)) |
| [`better-auth`](packages/better-auth/) | n/a | Source (git apply) | Adds a `./instrumentation` subpath with `browser` and `edge` export conditions pointing at `pure.index.mjs` (noop), so runtimes that reject bare specifiers at resolve time (Convex V8 isolate, where `deno_core::resolve_import` throws synchronously) can resolve instrumentation without ever loading `@opentelemetry/api`. Pairs with [#9340](https://github.com/better-auth/better-auth/pull/9340), which swaps the adapter factory from a relative `./instrumentation` import to the package self-reference so the conditions actually fire. Chain completed in `1.6.9`. | `1.6.7` ([better-auth/better-auth#9281](https://github.com/better-auth/better-auth/pull/9281)) |
| [`shadcn/ui`](packages/shadcn-ui/) | n/a | Source (git apply) | Spinning up `start-app` or `start-monorepo` printed `A notFoundError was encountered on the route with ID "__root__"` on first load. Phantom requests (`/favicon.ico`, Chrome DevTools `/.well-known/appspecific/com.chrome.devtools.json`) hit routes that don't exist and the templates didn't configure a `notFoundComponent`. Patch adds a 404 handler to both root routes, matching the `ErrorBoundary` 404 in `react-router-app` (same `container mx-auto p-4 pt-16` wrapper, same copy). | merged ([shadcn-ui/ui#10369](https://github.com/shadcn-ui/ui/pull/10369)) |
| [`shadcn/ui`](packages/shadcn-ui/) | n/a | Source (git apply) | Adds TanStack Start as a fifth dark mode guide alongside Next.js, Vite, Astro, and Remix. New MDX guide with the `ScriptOnce` and Context pattern (SSR-safe `useState`, `suppressHydrationWarning`, `colorScheme`, OS preference listener), index card with the TanStack logo, `meta.json` entry. | merged ([shadcn-ui/ui#10396](https://github.com/shadcn-ui/ui/pull/10396)) |
| [`better-auth`](packages/better-auth/) | `1.6.2` | Bun, npm (patch-package), pnpm | Adds `/change-password` and `/revoke-other-sessions` to the default `atomListeners` matcher so `$sessionSignal` fires after session-rotating endpoints. Without it, `useSession()` returned the stale session until reload. | `1.6.5` ([better-auth/better-auth#9087](https://github.com/better-auth/better-auth/pull/9087)) |
| [`better-auth`](packages/better-auth/) | n/a | Source (git apply) | Wrong `operationId` on the password reset callback endpoint. Fixed it and cleaned up `forget` to `forgot` across demo apps and tests. | merged ([better-auth/better-auth#9072](https://github.com/better-auth/better-auth/pull/9072)) |
| [`shadcn/ui`](packages/shadcn-ui/) | n/a | Source (git apply) | `llms.txt` was 404ing and a few routes were missing from it. | merged ([shadcn-ui/ui#10337](https://github.com/shadcn-ui/ui/pull/10337)) |
| [`@astrojs/compiler-rs`](packages/withastro/compiler-rs/) | `0.1.7` | Source (git apply) | Switches `x86_64-unknown-linux-gnu` and `aarch64-unknown-linux-gnu` from `-x` (zigbuild) to `--use-napi-cross`. Zig's per-arch glibc baseline was pinning the shipped binaries to `GLIBC_2.35` on x64 and `GLIBC_2.30` on arm64, which broke Vercel (glibc 2.34), Amazon Linux 2023, AWS Lambda, RHEL and CentOS 7, and Debian 10. `--use-napi-cross` drops both to `GLIBC_2.16` and `GLIBC_2.17`. Supersedes [#22](https://github.com/withastro/compiler-rs/pull/22). | `0.1.8` ([withastro/compiler-rs#25](https://github.com/withastro/compiler-rs/pull/25)) |
| [`@astrojs/compiler-rs`](packages/withastro/compiler-rs/) | n/a | Source (git apply) | Added `-x` to the `x86_64-unknown-linux-gnu` build for glibc compat. Insufficient on its own, superseded by [#25](https://github.com/withastro/compiler-rs/pull/25). | merged ([withastro/compiler-rs#22](https://github.com/withastro/compiler-rs/pull/22)) |
| [`shadcn/ui`](packages/shadcn-ui/) | n/a | Source (git apply) | Raw `<ComponentsList>` tag was leaking into the copy-to-markdown output. | merged ([shadcn-ui/ui#9484](https://github.com/shadcn-ui/ui/pull/9484)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | iOS: `textContentType` modifier for SwiftUI text inputs. | `56.0.0-canary-20260409-6fc2991` ([expo/expo#44548](https://github.com/expo/expo/pull/44548)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | iOS: `textInputAutocapitalization` modifier. | `56.0.0-canary-20260409-6fc2991` ([expo/expo#44547](https://github.com/expo/expo/pull/44547)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | iOS: `scrollTargetBehavior` and `scrollTargetLayout` modifiers. | `56.0.0-canary-20260409-6fc2991` ([expo/expo#43955](https://github.com/expo/expo/pull/43955)) |
| [`@napi-rs/cli`](packages/napi-rs/) | n/a | Source (git apply) | `--cross-compile` was being ignored when host arch matched target arch. | merged ([napi-rs/napi-rs#3189](https://github.com/napi-rs/napi-rs/pull/3189)) |
| [`shadcn/ui`](packages/shadcn-ui/) | n/a | Source (git apply) | Adds `@ramonclaudio-coderabbit` to the registry directory. | merged ([shadcn-ui/ui#9331](https://github.com/shadcn-ui/ui/pull/9331)) |
| [`expo-modules-core`](packages/expo-modules-core/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | iOS: serialize `PersistentFileLog.readEntries` on the dispatch queue to fix a race. | `56.0.0-canary-20260402-87c5ce2` ([expo/expo#43958](https://github.com/expo/expo/pull/43958)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | iOS: `defaultScrollAnchorForRole` modifier. Adds `null` support and a macOS platform tag to `defaultScrollAnchor`, extracts a shared `UnitPointValue` type. | `56.0.0-canary-20260401-5e87ef7` ([expo/expo#43923](https://github.com/expo/expo/pull/43923)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | iOS: `defaultScrollAnchor` modifier. | `56.0.0-canary-20260401-5e87ef7` ([expo/expo#43914](https://github.com/expo/expo/pull/43914)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.12` | Bun, npm (patch-package), pnpm | Removed a stray `react-dom` peer dep. | `0.10.13` ([get-convex/better-auth#278](https://github.com/get-convex/better-auth/pull/278)) |
| [`app-store-connect-cli`](packages/rorkai/) | n/a | Source (git apply) | macOS app screen capture and Mac App Store canvas framing for the `shots` command. | merged ([rorkai/App-Store-Connect-CLI#784](https://github.com/rorkai/App-Store-Connect-CLI/pull/784)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.11` | Bun, npm (patch-package), pnpm | Concurrent `fetchAccessToken` calls were racing to `/token`. `pendingTokenRef` now deduplicates in-flight requests. | `0.10.12` ([get-convex/better-auth#267](https://github.com/get-convex/better-auth/pull/267)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | Per-axis `scaleEffect({ x, y })` for view modifiers. | `56.0.0-canary-20260305-5163746` ([expo/expo#43228](https://github.com/expo/expo/pull/43228)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | Bun, npm (patch-package), pnpm | The pinned `better-auth` peer at `1.4.9` was blocking newer 1.4.x versions. | `0.10.11` ([get-convex/better-auth#245](https://github.com/get-convex/better-auth/pull/245)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | Bun, npm (patch-package), pnpm | Cookie expiry was being compared as a string, the session cache was caching nulls, and `isAuthenticated` was checking the wrong field. | `0.10.11` ([get-convex/better-auth#218](https://github.com/get-convex/better-auth/pull/218)) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | `clipShape` and `mask` were missing the `capsule` and `ellipse` shapes. Switched from a raw `String` to a `ShapeType` enum with exhaustive case handling. | `56.0.0-canary-20260305-5163746` ([expo/expo#43158](https://github.com/expo/expo/pull/43158)) |
| [`convex`](packages/convex/) | `1.31.3` | Bun, npm (patch-package), pnpm | `WebSocketManager` was crashing in environments where `window` exists but `addEventListener` doesn't. | `1.31.4` ([get-convex/convex-js@baafbf5](https://github.com/get-convex/convex-js/commit/baafbf5bb200d6db81804558fbd01ccce77355fc)) |
| [`bun`](packages/oven-sh/bun/) | `1.2.20` | Bun | `decompress` was missing from `fetch()`'s TypeScript types. | `1.2.21` ([oven-sh/bun#21855](https://github.com/oven-sh/bun/pull/21855)) |
| [`create-fumadocs-app`](packages/create-fumadocs-app/) | `15.6.4` | Bun, npm (patch-package), pnpm | Prettier formatting in the `tanstack-start` template's `NotFound.tsx`. | `15.6.5` ([fuma-nama/fumadocs#2095](https://github.com/fuma-nama/fumadocs/pull/2095)) |
| [`create-fumadocs-app`](packages/create-fumadocs-app/) | `15.6.4` | Bun, npm (patch-package), pnpm | Vite and TanStack Router config warnings in the `tanstack-start` template. | `15.6.5` ([fuma-nama/fumadocs#2092](https://github.com/fuma-nama/fumadocs/pull/2092)) |
| [`@tanstack/db`](packages/tanstack/) | n/a | Source (git apply) | Wrong example todo app path in the README. | merged ([TanStack/db#17](https://github.com/TanStack/db/pull/17)) |

## Closed

<details>
<summary>PRs that didn't merge as filed but catalyzed an upstream fix or got rebuilt by the maintainer.</summary>

| Package | Was | Format | Fix | Status |
| :--- | :--- | :--- | :--- | :--- |
| [`@shopify/mini-oxygen`](packages/@shopify/mini-oxygen/) | `4.0.0` | Bun, npm (patch-package), pnpm | Vite 7 was throwing `ReferenceError: __vite_ssr_exportName__ is not defined` on every dev request. Missing 6th SSR key, no `getBuiltins()` support, broken `fetchModule` importer, deprecated `root`, peer pinned at Vite 5 and 6. Patch fixed all five and bumped peer to `^7.0.0`. | next release in [Shopify/hydrogen#3617](https://github.com/Shopify/hydrogen/pull/3617). [@frandiox](https://github.com/frandiox) closed mine and rebuilt with the Vite Environment API for 6, 7, and 8 backward compat |
| ↳ [`@shopify/hydrogen`](packages/@shopify/hydrogen/) | `2026.1.0` | Bun, npm (patch-package), pnpm | `vite` peer `^5.1.0 \|\| ^6.2.1` replaced with `^7.0.0`. Vite 5 and 6 dropped. | sibling of [#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| ↳ [`@shopify/hydrogen-react`](packages/@shopify/hydrogen-react/) | `2026.1.0` | Bun, npm (patch-package), pnpm | `vite` peer widened to `^5.1.0 \|\| ^6.2.1 \|\| ^7.0.0`. | sibling of [#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| ↳ [`@shopify/cli-hydrogen`](packages/@shopify/cli-hydrogen/) | `11.1.9` | Bun, npm (patch-package), pnpm | `vite` peer `^5.1.0 \|\| ^6.2.0` replaced with `^7.0.0`. Vite 5 and 6 dropped. | sibling of [#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| [`react-native-view-shot`](packages/react-native-view-shot/) | `4.0.3` | Bun, npm (patch-package), pnpm | RN 0.84 with the new arch dropped `RCTScrollView`. The `snapshotContentContainer` check was looking for it and silently bailing. Switched to `UIScrollView`. | `5.0.0-alpha.2` in [gre/react-native-view-shot#587](https://github.com/gre/react-native-view-shot/pull/587). Didn't file a PR, upstream landed the same fix independently |
| [`@tanstack/start-server-core`](packages/@tanstack/start-server-core/) | `1.167.10` | Bun, npm (patch-package), pnpm | `start-plugin-core@1.167.19` shipped referencing `pluginAdapters` from `start-server-core`'s `VIRTUAL_MODULES`, but `start-server-core` hadn't released a matching version yet. `vite dev` crashed on every fresh install. Patch added the missing export. | `1.167.11`, [TanStack/router#7146](https://github.com/TanStack/router/pull/7146). Closed mine after Tanner synced the versions manually in `e61c49ce31` |
| [`@tobilu/qmd`](packages/@tobilu/qmd/) | `1.0.7` | Bun, npm (patch-package), pnpm | `dist/` was gitignored and not committed at release time, so `npm install github:tobi/qmd#vX.Y.Z` failed. No compiled output in the tag. | `1.1.0+`, [tobi/qmd#197](https://github.com/tobi/qmd/pull/197). Closed mine after upstream rebuilt the fix differently |
| [`@astrojs/compiler`](packages/withastro/compiler-rs/) | n/a | Source (git apply) | Added `-x` to the `x86_64-unknown-linux-gnu` build for glibc compat. First take. | closed [withastro/compiler-rs#21](https://github.com/withastro/compiler-rs/pull/21). Refiled as [#22](https://github.com/withastro/compiler-rs/pull/22), which merged |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.11.4` | Bun, npm (patch-package), pnpm | On session rotation (`changePassword({ revokeOtherSessions: true })`, cross-domain handoff, custom plugin endpoints), the Convex client was holding a JWT bound to the dead session. `fetchAccessToken` rebuilds on `[sessionId]` but the cached token state was only cleared in the logout-only effect. So when `sessionId` flipped with `session` still truthy, the rebuilt closure read the same stale token and Convex's `setConfig` short-circuited on it. Patch clears `cachedToken` and `pendingTokenRef` on `sessionId` change. | closed mine, [get-convex/better-auth#329](https://github.com/get-convex/better-auth/pull/329). Superseded by [better-auth/better-auth#9345](https://github.com/better-auth/better-auth/pull/9345), which fixes the upstream root cause instead of patching the symptom client-side |

</details>

## Filed

<details>
<summary>Issues I tracked down. All got fixed, by the maintainer or by my own follow-up PR.</summary>

| Issue | Package | Status | Notes |
| :--- | :--- | :--- | :--- |
| [panva/jose#752](https://github.com/panva/jose/issues/752) | [`jose`](packages/jose/) | fixed (my report) | `process.getBuiltinModule` was breaking Edge Runtime and Next.js middleware. Took a few back-and-forths before [@panva](https://github.com/panva) saw the trace. Shipped in [`v6.0.4`](https://github.com/panva/jose/releases/tag/v6.0.4). He thanked me on close. |
| [shadcn-ui/ui#8892](https://github.com/shadcn-ui/ui/issues/8892) | `shadcn/ui` | fixed (my PR) | Registry directory submission for CodeRabbit. [@shadcn](https://github.com/shadcn) asked me to send a PR. Shipped [#9331](https://github.com/shadcn-ui/ui/pull/9331), which auto-closed this on merge. |
| [anthropics/claude-code#18181](https://github.com/anthropics/claude-code/issues/18181) | `claude` | fixed (my report) | Manual update wasn't fixing the symlink when `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` was set. [@bcherny](https://github.com/bcherny) replied "Fix incoming" and closed it. |
| [Shopify/hydrogen#3263](https://github.com/Shopify/hydrogen/issues/3263) | `@shopify/mini-oxygen` | fixed | Vite 7 support in `@shopify/mini-oxygen`. Closed mine after [@frandiox](https://github.com/frandiox) shipped Vite Environment API in [#3617](https://github.com/Shopify/hydrogen/pull/3617), which supersedes my rebase in [#3493](https://github.com/Shopify/hydrogen/pull/3493). |
| [get-convex/better-auth#345](https://github.com/get-convex/better-auth/issues/345) | `@convex-dev/better-auth` | fixed (my PR) | `better-auth` 1.6.6's dynamic `@opentelemetry/api` import was throwing synchronously on every Convex auth request inside the V8 isolate (`deno_core::resolve_import` rejects bare specifiers at resolve time, not at the import promise). Fixed by my own PR [#323](https://github.com/get-convex/better-auth/pull/323), released as `0.12.0` after [better-auth/better-auth#9281](https://github.com/better-auth/better-auth/pull/9281) shipped the noop instrumentation entry in `1.6.7`. |
| [get-convex/better-auth#219](https://github.com/get-convex/better-auth/issues/219) | `@convex-dev/better-auth` | fixed (my PR) | Concurrent `fetchAccessToken` calls were racing to `/token`. Fixed by my own PR [#267](https://github.com/get-convex/better-auth/pull/267). |
| [cursor/cursor#3182](https://github.com/cursor/cursor/issues/3182) | `cursor` | fixed | Couldn't update the spending limit or toggle usage-based pricing on the main dashboard. Fixed upstream. (Cursor later disabled their issue tracker.) |

</details>

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
> Yarn auto-generates filenames with hashes. Use `yarn patch` and `yarn patch-commit -s`. Don't copy `.patch` files from this repo into `.yarn/patches/` directly.

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
<summary>Combining patches (Bun, pnpm, Yarn)</summary>

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
> If any file appears in both patches, use the `bun patch`, `pnpm patch-commit`, or `yarn patch-commit -s` workflow above.

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
