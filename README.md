# patches

Fixes for package bugs that haven't landed upstream yet.

> [!NOTE]
> These patches track open upstream PRs. Once a PR merges and you update the package, remove the corresponding patch.

## Patches

| Package | Version | What it fixes |
| :--- | :--- | :--- |
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Missing `capsule` + `ellipse` shapes in `clipShape`/`mask`, broken `foregroundStyle` hierarchical handling <br> PR: [expo/expo#43158](https://github.com/expo/expo/pull/43158) |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | Cookie expiry comparison bug, null session cache, wrong `isAuthenticated` check <br> PR: [get-convex/better-auth#218](https://github.com/get-convex/better-auth/pull/218) |

## Usage

Copy the patch into your project's `patches/` dir. File naming differs by package manager.

### Bun

Patches use `%2F` scope encoding and `@` version separator.

```jsonc
// package.json
{
  "patchedDependencies": {
    "@expo/ui@56.0.0-canary-20260212-4f61309": "patches/@expo%2Fui@56.0.0-canary-20260212-4f61309.patch"
  }
}
```

Bun applies patches automatically on install.

### npm / pnpm

Patches use `+` separators. Requires [patch-package](https://github.com/ds300/patch-package) as a dev dep with a `postinstall` script.

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

> [!IMPORTANT]
> Bun and patch-package use different file naming conventions. A patch named `@scope%2Fpkg@version.patch` (Bun) won't work with patch-package. Rename it to `@scope+pkg+version.patch` for npm/pnpm, or vice versa.

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
