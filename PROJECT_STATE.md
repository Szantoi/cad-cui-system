# Project State

Updated: 2026-08-23  
Package version: `0.4.0`  
Lifecycle: active development — stable, engine-free UI layer
Latest implementation commit: `042e828 feat: add configurable CAD workspace surfaces`

## Latest completed increment

The modular CAD workspace expansion is integrated and documented.

- Added a grouped, renderer-independent `CadWorkspaceRibbon` with HOME / VIEW
  / DRAFT support in the playground.
- Extended the declarative CUI runtime with optional registry `groups`,
  placement `groupId` / `control`, `commandStates`, and shared command-state
  resolution across ribbon, quick access, context menu and palette.
- Added `CadNavigationBar`, `CadVisualStylePicker`,
  `CadViewportScalePicker`, and `CadSelectionSetPanel`.
- Connected the new elements to the engine-free SVG playground with host-owned
  React state, event logging and a Selection Sets inspector tab.
- Stabilized Vite development reloads by reusing the playground React root.
- Updated the public exports, CSS contract, README and tracked distribution
  files.

## Verified state

| Check | Result |
| --- | --- |
| Unit/integration tests | `9` files, `50/50` tests passed |
| Library build | passed (`npm run build`) |
| Playground build | passed (`npm run demo:build`) |
| Package dry-run | passed (`npm pack --dry-run`) |
| Diff whitespace check | passed (`git diff --check`) |

## Current runnable entry point

```bash
npm run demo
```

Vite normally exposes the sandbox at `http://127.0.0.1:4173/`.

## Working-tree note

The 0.4.0 implementation is recorded in the latest project commit. The project
tracking files introduced alongside this state record may remain as separate
working-tree changes until their content is reviewed and committed.
