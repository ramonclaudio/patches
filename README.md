# patches

Fixes for package bugs waiting on upstream merges.

> [!NOTE]
> Once an upstream PR lands and you bump the dep, drop the patch.

## Active

| Package | Version | Format | Fix | PR |
| :--- | :--- | :--- | :--- | :--- |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Bun | Missing `capsule` + `ellipse` shapes in `clipShape`/`mask`, broken `foregroundStyle` hierarchical handling | [expo/expo#43158](https://github.com/expo/expo/pull/43158) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | patch-package | Cookie expiry string comparison, null session cache, wrong `isAuthenticated` check | [get-convex/better-auth#218](https://github.com/get-convex/better-auth/pull/218) |
| [`@tobilu/qmd`](packages/@tobilu/qmd/) | `1.0.6` | patch-package | `typescript` in `peerDependencies` instead of `devDependencies`, missing `tsc` in `prepare` script | [tobi/qmd#197](https://github.com/tobi/qmd/pull/197) |

## Resolved

Kept for reference. Update the dep instead.

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

> [!IMPORTANT]
> Patches aren't drop-in across package managers. Two things differ:
>
> **Filename** — each tool uses a different separator for scoped packages:
>
> | Tool | Format |
> | :--- | :--- |
> | Bun | `@scope%2Fpkg@version.patch` |
> | npm (patch-package) | `@scope+pkg+version.patch` |
> | pnpm | `@scope__pkg@version.patch` |
>
> **Diff paths** — Bun and pnpm use paths relative to the package root. patch-package prefixes paths with `node_modules/@scope/pkg/`. To convert:
>
> ```bash
> # patch-package → Bun/pnpm (strip the node_modules prefix)
> sed 's|node_modules/@scope/pkg/||g' old.patch > new.patch
>
> # Bun/pnpm → patch-package (add the node_modules prefix)
> sed -e '/^diff --git /s|a/|a/node_modules/@scope/pkg/|' \
>     -e '/^diff --git /s|b/|b/node_modules/@scope/pkg/|' \
>     -e 's|^--- a/|--- a/node_modules/@scope/pkg/|' \
>     -e 's|^+++ b/|+++ b/node_modules/@scope/pkg/|' \
>     old.patch > new.patch
> ```

## Structure

```text
packages/
  @<scope>/
    <package>/
      <patch-file>.patch
```

## Contributing

Include the patch, what it fixes, and the package version.

## License

[MIT](LICENSE)
