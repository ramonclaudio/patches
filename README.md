# patches

Patch files for packages and dependencies. Drop-in fixes for bugs, missing features, and type errors that haven't been merged upstream yet.

## Usage

Copy the patch file into your project's `patches/` directory and apply it with your package manager's patch mechanism:

**Bun** (automatic — uses `patch:` protocol in `package.json`):

```jsonc
// package.json
{
  "patchedDependencies": {
    "@convex-dev/better-auth@0.10.10": "patches/@convex-dev+better-auth+0.10.10.patch"
  }
}
```

**npm / pnpm** (via [patch-package](https://github.com/ds300/patch-package)):

```bash
npx patch-package # auto-applies patches from patches/ on install
```

## Patches

| Package | Version | Description |
|---------|---------|-------------|
| [`@expo/ui`](packages/@expo/ui/) | `56.0.0-canary-20260212-4f61309` | Add `capsule` and `ellipse` to `clipShape` and `mask` shape types, fix `foregroundStyle` hierarchical handling |
| [`@convex-dev/better-auth`](packages/@convex-dev/better-auth/) | `0.10.10` | Fix cookie expiry comparison, null session cache handling, and `isAuthenticated` check |

## Structure

```
packages/
  @<scope>/
    <package>/
      <patch-file>.patch
```

## Contributing

Found a bug in a dependency? PRs welcome. Include:

1. The patch file
2. A brief description of what it fixes
3. The affected package version

## License

[MIT](LICENSE)
