# patches

Fixes for package bugs that haven't landed upstream yet.

> [!NOTE]
> These patches track open upstream PRs. Once a PR merges and you update the dep, drop the patch.

## Patches

| Package | Version | What it fixes |
| :--- | :--- | :--- |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Missing `capsule` + `ellipse` shapes in `clipShape`/`mask`, broken `foregroundStyle` hierarchical handling <br> PR: [expo/expo#43158](https://github.com/expo/expo/pull/43158) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | Cookie expiry comparison bug, null session cache, wrong `isAuthenticated` check <br> PR: [get-convex/better-auth#218](https://github.com/get-convex/better-auth/pull/218) |

## Usage

Copy the patch into your project's `patches/` dir. Naming differs by package manager -- rename to match yours.

### Bun

Native patching. Applied on `bun install`.

```jsonc
// package.json
{
  "patchedDependencies": {
    "@expo/ui@56.0.0-canary-20260212-4f61309": "patches/@expo%2Fui@56.0.0-canary-20260212-4f61309.patch"
  }
}
```

### npm

No native patching. Uses [patch-package](https://github.com/ds300/patch-package) with a `postinstall` script.

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

### pnpm

Native patching via [`pnpm patch`](https://pnpm.io/cli/patch). Config goes in the `pnpm` key.

```jsonc
// package.json
{
  "pnpm": {
    "patchedDependencies": {
      "@convex-dev/better-auth@0.10.10": "patches/@convex-dev__better-auth@0.10.10.patch"
    }
  }
}
```

> [!IMPORTANT]
> Scoped package file naming differs per tool:
>
> | Tool | Example filename |
> | :--- | :--- |
> | Bun | `@scope%2Fpkg@version.patch` |
> | npm (patch-package) | `@scope+pkg+version.patch` |
> | pnpm | `@scope__pkg@version.patch` |
>
> Rename to match your package manager.

## Structure

```text
packages/
  @<scope>/
    <package>/
      <patch-file>.patch
```

## Contributing

PRs welcome. Include the patch file, what it fixes, and the package version.

## License

[MIT](LICENSE)
