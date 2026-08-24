# Project State

Updated: 2026-08-24 · Package version: `0.5.0` · Lifecycle: active development — stable, engine-free UI layer
Latest committed baseline: `98414a0 docs: add project tracking memory`

## Current working-tree increment

The Model Space-first workspace, fixed-height command area and reusable panel
customization surface are implemented and verified in the working tree.

- Added controlled/uncontrolled pixel-height support to `CadCommandLine`, with
  pointer and keyboard resizing, bounds, and an internal scrolling transcript.
- Reworked the sandbox into a full-window, Model Space-first grid. Left, right
  and lower docks each support `open`, narrow `rail`, and `closed` modes.
- Removed automatic event toasts from the sandbox; actions remain available in
  the Host Event Log, while purposeful confirmation dialogs remain.
- Added `CadWorkspacePanelManager` with serializable visibility and
  dock/floating preferences, controlled or standalone state, scope-aware key
  generation, callback hooks, and pure helper functions for non-visual hosts.
- Documented the command-area API and refreshed the tracked distribution files.

## Verified state

| Check | Result |
| --- | --- |
| Unit/integration tests | `10` files, `56/56` tests passed |
| Library build | passed (`npm run build`) |
| Playground build | passed (`npm run demo:build`) |
| Package dry-run | passed (`npm pack --dry-run`) |
| Diff whitespace check | passed (`git diff --check`) |
| Browser layout QA | passed: fixed-height command transcript; full-width Model Space with all three docks closed; no narrow-view horizontal scroll |

## Current runnable entry point

```bash
npm run demo
```

Vite normally exposes the sandbox at `http://127.0.0.1:4173/`.

## Working-tree note

This release is prepared for publishing after the listed checks are rerun on
the final versioned files.
