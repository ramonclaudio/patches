# patches

Patches for open upstream PRs. Drop them when the release ships.

> Talk is cheap, send patches.
>
> [@FFmpeg](https://x.com/FFmpeg/status/1762805900035686805)

> [!NOTE]
> Patches move Open → Merged → Released as PRs land and versions ship. Once released, bump the dep and drop the patch.

## Open

Patch is needed. PR not yet merged.

| Package | Version | Format | Fix | PR |
| :--- | :--- | :--- | :--- | :--- |
| [`@tobilu/qmd`](packages/@tobilu/qmd/) | `1.0.6` | Bun, npm (patch-package), pnpm | `typescript` in `peerDependencies` instead of `devDependencies`; missing `tsc` in `prepare` script | [tobi/qmd#197](https://github.com/tobi/qmd/pull/197) |
| [`@shopify/mini-oxygen`](packages/@shopify/mini-oxygen/) | `4.0.0` | Bun, npm (patch-package), pnpm | Vite 7 `ReferenceError: __vite_ssr_exportName__ is not defined`; missing 6th SSR key, `getBuiltins()` support, `fetchModule` importer fix, removes deprecated `root`, bumps `vite` peer dep to `^7.0.0` | [Shopify/hydrogen#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| [`@shopify/hydrogen`](packages/@shopify/hydrogen/) | `2026.1.0` | Bun, npm (patch-package), pnpm | `vite` peer dep `^5.1.0 \|\| ^6.2.1` updated to `^7.0.0` | [Shopify/hydrogen#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| [`@shopify/hydrogen-react`](packages/@shopify/hydrogen-react/) | `2026.1.0` | Bun, npm (patch-package), pnpm | `vite` peer dep widened to `^5.1.0 \|\| ^6.2.1 \|\| ^7.0.0` | [Shopify/hydrogen#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| [`@shopify/cli-hydrogen`](packages/@shopify/cli-hydrogen/) | `11.1.9` | Bun, npm (patch-package), pnpm | `vite` peer dep `^5.1.0 \|\| ^6.2.0` updated to `^7.0.0` | [Shopify/hydrogen#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| [`bun`](packages/oven-sh/bun/) | `1.3.9` | Bun | `includePrerelease` semantics wrong for peer dep semver validation | [oven-sh/bun#27085](https://github.com/oven-sh/bun/pull/27085) |
| [`bun`](packages/oven-sh/bun/) | `1.3.9` | Bun | Invalid YAML sequence in `update-root-certs` workflow `labels` field | [oven-sh/bun#27086](https://github.com/oven-sh/bun/pull/27086) |

## Merged

Patch is needed. PR merged but no release yet.

| Package | Version | Format | Fix | PR |
| :--- | :--- | :--- | :--- | :--- |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | Missing `capsule` + `ellipse` shapes in `clipShape`/`mask`; broken `foregroundStyle` hierarchical handling | [expo/expo#43158](https://github.com/expo/expo/pull/43158) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun, npm (patch-package), pnpm | Per-axis `scaleEffect({ x, y })` missing from view modifiers; adds `inverted` prop to `List` for bottom-anchored scrolling | [expo/expo#43228](https://github.com/expo/expo/pull/43228) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.11` | Bun, npm (patch-package), pnpm | Concurrent `fetchAccessToken` calls race to `/token`; `pendingTokenRef` deduplicates in-flight requests | [get-convex/better-auth#267](https://github.com/get-convex/better-auth/pull/267) |

## Released

Bump the dep instead.

| Package | Was | Format | Fix | Fixed in |
| :--- | :--- | :--- | :--- | :--- |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | Bun, npm (patch-package), pnpm | Cookie expiry string comparison, null session cache, wrong `isAuthenticated` check | `0.10.11` ([get-convex/better-auth#218](https://github.com/get-convex/better-auth/pull/218)) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | Bun, npm (patch-package), pnpm | Pinned `better-auth` peer dep `1.4.9` blocks newer 1.4.x versions | `0.10.11` ([get-convex/better-auth#245](https://github.com/get-convex/better-auth/pull/245)) |
| [`convex`](packages/convex/) | `1.31.3` | Bun, npm (patch-package), pnpm | `WebSocketManager` crashes where `window` exists but `addEventListener` doesn't | `1.31.4` ([get-convex/convex-backend#44935](https://github.com/get-convex/convex-backend/pull/44935)) |
| [`bun`](packages/oven-sh/bun/) | `1.2.20` | Bun | `decompress` option missing from `fetch()` TypeScript types | `1.2.21` ([oven-sh/bun#21855](https://github.com/oven-sh/bun/pull/21855)) |

## Filed

Bugs I reported that were fixed upstream without a patch.

| Issue | Package | Notes |
| :--- | :--- | :--- |
| [panva/jose#752](https://github.com/panva/jose/issues/752) | `jose` | `process.getBuiltinModule` misuse breaks Edge Runtime / Next.js middleware; fixed in [`v6.0.4`](https://github.com/panva/jose/releases/tag/v6.0.4) |
| [anthropics/claude-code#18181](https://github.com/anthropics/claude-code/issues/18181) | `claude` | Manual update doesn't fix symlink when `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` is set; fixed upstream |
| [TanStack/db#17](https://github.com/TanStack/db/pull/17) | `@tanstack/db` | Incorrect example todo app path in README; docs only, no npm change |

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
