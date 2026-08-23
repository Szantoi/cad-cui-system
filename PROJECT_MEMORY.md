# Project Memory — CAD CUI System

Durable context for maintainers and future development sessions. Update this
file only when an architectural contract or a durable product decision changes.

## Product boundary

`@szantoi/cad-cui-system` is a reusable React CAD interface kit. It supplies
command surfaces, workspace chrome, inspectors, drafting overlays and viewport
controls. It intentionally does **not** implement a CAD engine, a drawing
renderer, geometry storage, a docking manager or authorization.

The host application owns all domain behavior. Components emit declarative
commands or controlled values so they can sit above Canvas, SVG, WebGL,
Three.js, desktop shells or a custom renderer.

## Stable architectural rules

- Keep the CUI registry serializable. Commands contain IDs, labels, placements,
  capabilities and intents; executable callbacks belong in `CadCuiProvider`
  handlers.
- Keep transient application state outside the registry. Pass it through
  `commandStates` so ribbon, quick access, context menu and palette resolve the
  same `visible`, `disabled`, `active` and `badge` state.
- Preserve backward compatibility for command handlers: `event.command` is the
  immutable registry declaration; `event.resolvedCommand` is the additive,
  host-resolved state.
- Registry command groups are opt-in. A registry without `groups` keeps the
  original flat ribbon output.
- Workspace primitives must remain renderer- and router-independent unless a
  component explicitly belongs to the CUI runtime.
- Prefer controlled/uncontrolled pairs with callbacks over hidden internal
  application state.

## Current modular surface

- `CadWorkspaceRibbon` provides a renderer-independent, tabbed and grouped
  AutoCAD-style command ribbon.
- `CadCuiRuntime` adds declarative command grouping plus live command-state
  resolution for all standard CUI surfaces.
- `CadNavigationBar`, `CadVisualStylePicker`, `CadViewportScalePicker` and
  `CadSelectionSetPanel` are engine-free viewport/context primitives.
- The Vite sandbox demonstrates all of the above with host-owned React state;
  its SVG drawing is deliberately a neutral visual stand-in, not a CAD engine.

## Visual language

Use compact graphite workspace chrome, restrained cyan/amber/green accents,
strong grouped hierarchy and functional labels. Avoid decorative dashboard
patterns, gradients that obscure information, or app-specific branding in the
shared component library.

## Quality contract

After source changes, run:

```bash
npm test
npm run build
npm run demo:build
npm pack --dry-run
git diff --check
```

The package checks `dist/` into source control. Rebuild it whenever public
source or shared CSS changes.
