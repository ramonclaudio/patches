# patches

Fixes for package bugs waiting on upstream merges.

> [!NOTE]
> Once a PR lands and you bump the dep, drop the patch.

## Active

| Package | Version | Format | Fix | PR |
| :--- | :--- | :--- | :--- | :--- |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun | Missing `capsule` + `ellipse` shapes in `clipShape`/`mask`, broken `foregroundStyle` hierarchical handling | [expo/expo#43158](https://github.com/expo/expo/pull/43158) |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun | Add `inverted` prop to `List` for bottom-anchored chat-style scrolling | [expo/expo#43228](https://github.com/expo/expo/pull/43228) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | patch-package, Bun | Cookie expiry string comparison, null session cache, wrong `isAuthenticated` check | [get-convex/better-auth#218](https://github.com/get-convex/better-auth/pull/218) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | Bun, patch-package | Pinned `better-auth` peer dep `1.4.9` blocks newer 1.4.x versions | [get-convex/better-auth#245](https://github.com/get-convex/better-auth/pull/245) |
| [`@tobilu/qmd`](packages/@tobilu/qmd/) | `1.0.6` | patch-package, Bun | `typescript` in `peerDependencies` instead of `devDependencies`, missing `tsc` in `prepare` script | [tobi/qmd#197](https://github.com/tobi/qmd/pull/197) |
| [`@shopify/mini-oxygen`](packages/@shopify/mini-oxygen/) | `4.0.0` | Bun, patch-package, pnpm | Vite 7 breaks `mini-oxygen` with `ReferenceError: __vite_ssr_exportName__ is not defined` — adds missing 6th SSR key, handles `getBuiltins()`, fixes `fetchModule` importer bug, removes deprecated `root` option, updates `vite` peer dep to `^7.0.0` | [Shopify/hydrogen#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| [`@shopify/hydrogen`](packages/@shopify/hydrogen/) | `2026.1.0` | Bun, patch-package, pnpm | Update `vite` peer dep from `^5.1.0 \|\| ^6.2.1` to `^7.0.0` | [Shopify/hydrogen#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| [`@shopify/hydrogen-react`](packages/@shopify/hydrogen-react/) | `2026.1.0` | Bun, patch-package, pnpm | Widen `vite` peer dep to `^5.1.0 \|\| ^6.2.1 \|\| ^7.0.0` | [Shopify/hydrogen#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| [`@shopify/cli-hydrogen`](packages/@shopify/cli-hydrogen/) | `11.1.9` | Bun, patch-package, pnpm | Update `vite` peer dep from `^5.1.0 \|\| ^6.2.0` to `^7.0.0` | [Shopify/hydrogen#3493](https://github.com/Shopify/hydrogen/pull/3493) |
| [`bun`](packages/oven-sh/bun/) | `1.3.9` | Bun | `includePrerelease` semantics for peer dep semver validation | [oven-sh/bun#27085](https://github.com/oven-sh/bun/pull/27085) |
| [`bun`](packages/oven-sh/bun/) | `1.3.9` | Bun | Invalid YAML sequence in `update-root-certs` workflow `labels` field | [oven-sh/bun#27086](https://github.com/oven-sh/bun/pull/27086) |

## Resolved

Kept for reference. Bump the dep instead.

| Package | Was | Format | Fix | Fixed in |
| :--- | :--- | :--- | :--- | :--- |
| [`convex`](packages/convex/) | `1.31.3` | patch-package | `WebSocketManager` crashes where `window` exists but `addEventListener` doesn't | [`1.31.4`](https://github.com/get-convex/convex-backend/pull/44935) |

## Usage

Copy the patch into your project's `patches/` dir.

### Bun (1.2+)

Applied on `bun install`.

```jsonc
// package.json
{
  "patchedDependencies": {
    "@expo/ui@56.0.0-canary-20260212-4f61309": "patches/@expo%2Fui@56.0.0-canary-20260212-4f61309.patch"
  }
}
```

### npm

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

### pnpm (10.7+)

[`pnpm patch`](https://pnpm.io/cli/patch). Config goes in `pnpm-workspace.yaml`.

```yaml
# pnpm-workspace.yaml
patchedDependencies:
  "@convex-dev/better-auth@0.10.10": "patches/@convex-dev__better-auth@0.10.10.patch"
```

### Yarn (v2+)

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
> # patch-package -> Bun/pnpm/Yarn (strip the node_modules prefix)
> sed 's|node_modules/@scope/pkg/||g' old.patch > new.patch
>
> # Bun/pnpm/Yarn -> patch-package (add the node_modules prefix)
> sed -e '/^diff --git /s|a/|a/node_modules/@scope/pkg/|' \
>     -e '/^diff --git /s|b/|b/node_modules/@scope/pkg/|' \
>     -e 's|^--- a/|--- a/node_modules/@scope/pkg/|' \
>     -e 's|^+++ b/|+++ b/node_modules/@scope/pkg/|' \
>     old.patch > new.patch
> ```

## Multiple patches for the same package

This repo stores one patch file per PR so each fix is easy to track. But most package managers only support **one patch per package@version**. You can't point two `.patch` files at the same dep.

| Tool | Multiple? | Details |
| :--- | :--- | :--- |
| **Bun** | No | One entry per `package@version` in `patchedDependencies`. Combine into one `.patch`. |
| **pnpm** | No | One entry per exact version in `patchedDependencies`. Combine into one `.patch`. |
| **Yarn** | No | One `patch:` resolution per package. Combine into one `.patch`. |
| **npm** (patch-package) | Yes | Use `--append 'name'` for sequenced patches: `pkg+ver+001+initial.patch`, `pkg+ver+002+name.patch`. |

### Combining patches (Bun / pnpm / Yarn)

If you need multiple fixes for the same package@version (e.g. both `@expo/ui` patches), apply all changes to `node_modules` and let the tool generate one combined diff:

```bash
# 1. prep the package
bun patch @expo/ui

# 2. apply each patch from this repo
git apply --directory=node_modules/@expo/ui patches/fix-a.patch
git apply --directory=node_modules/@expo/ui patches/fix-b.patch

# 3. generate one combined patch
bun patch --commit @expo/ui
```

> [!TIP]
> If the patches touch completely different files (no overlap), you can just `cat` them together:
>
> ```bash
> cat patches/fix-a.patch patches/fix-b.patch > patches/@expo%2Fui@56.0.0-canary-20260212-4f61309.patch
> ```
>
> If any file shows up in both patches, use the `bun patch` / `pnpm patch-commit` / `yarn patch-commit -s` workflow above.

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

One dir per package manager format. Not every package has patches for every manager.

Filenames in this repo have a `-prXXX` suffix (e.g. `@expo%2Fui@56.0.0-canary-20260212-4f61309-pr43228.patch`) so you know which upstream PR it's from. Strip the suffix when you copy it into your project so the filename matches what the package manager expects.

## Contributing

Include the patch, what it fixes, and the package version.

## License

[MIT](LICENSE)
