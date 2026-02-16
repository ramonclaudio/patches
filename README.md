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

Copy the patch into your project's `patches/` dir.

**Bun**

```jsonc
// package.json
{
  "patchedDependencies": {
    "@convex-dev/better-auth@0.10.10": "patches/@convex-dev+better-auth+0.10.10.patch"
  }
}
```

**npm / pnpm** ([patch-package](https://github.com/ds300/patch-package))

```bash
npx patch-package
```

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
