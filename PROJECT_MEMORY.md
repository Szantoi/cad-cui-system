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
- `CadWorkspaceRibbon` supports selective command rendering: a
  `renderCommand` result of `undefined` or `null` falls back to the native
  ribbon tool, so a host can embed one specialised control without duplicating
  ordinary commands. A specialised trigger should still call
  `context.execute(event)` to preserve the shared `onCommand` pathway.
- Workspace primitives must remain renderer- and router-independent unless a
  component explicitly belongs to the CUI runtime.
- Prefer controlled/uncontrolled pairs with callbacks over hidden internal
  application state.
- Treat workspace layout as host-owned state. In particular, hosts can retain
  a `CadCommandLine` height and dock visibility modes; command transcripts
  scroll inside the fixed command area rather than changing drawing-space
  allocation.
- Treat workspace focus as host-owned state too. `CadWorkspaceFocusToggle`
  only exposes a controlled/uncontrolled boolean trigger; it intentionally
  does not use the browser Fullscreen API or capture document shortcuts. The
  host decides its Clean Screen layout, safe `Ctrl+0`/`Escape` routing and
  focus restoration.
- Keep unified-header workspace controls outside an ARIA `menubar`. The
  sandbox uses a stable left-to-right arrangement of menus and application
  identity, an independently centered transient search field, then status and
  workspace controls. `CadMenuBar` still provides `endSlot`/`endSlotLabel` as
  a sibling control group, while `CadWorkspaceChromeControls` remains a
  presentation-only declarative button group. A compact titlebar toggle should
  use an unambiguous open/hidden action; expose durable `Open`/`Rail`/`Hide`
  selection separately instead of silently cycling an icon through three
  states.
- Treat dock geometry as host-owned state. A dock's serializable `open`,
  `rail`, or `closed` mode must not discard its pixel size; a host should keep
  that dimension so reopening restores the operator's layout. The reusable
  resize handle only reports a safe, edge-aware pixel intent.
- Treat a rail peek as transient presentation state, separate from the durable
  dock mode. `CadWorkspaceDockRail` must never promote a hover into a saved
  `open` layout; it keeps its preview mounted while hidden so short peeks do
  not reset a panel's tab, form, or scroll state. Host CSS must keep the rail
  label and its preview physically contiguous (prefer a 1px overlap), because
  a visual/pointer gap breaks the shared hover region before the preview can
  receive the cursor.
- Treat a minimized Ribbon flyout as transient presentation state, separate
  from the durable `minimized` choice. `CadWorkspaceRibbon` opens it on an
  enabled tab's hover or focus without expanding the Ribbon or changing saved
  state; its tab strip and flyout must be one contiguous pointer/focus region.
  Keep command content mounted but hidden between peeks so custom controls
  preserve their local state. `ArrowDown` enters the first focusable command and
  `Escape` closes the flyout while restoring the active tab focus.
- A workspace panel's physical dock position is declarative host state when
  needed: `{ open, placement, dockZone? }`. Only panels that explicitly
  declare `dockZones` receive a canonical `left`, `right`, or `bottom` zone;
  existing `{ open, placement }` preferences remain valid and compact.
- Panel-list filtering is ephemeral manager UI state, never a mutation of a
  panel preference. `CadWorkspacePanelManager` exposes it as controlled
  `filter`/`onFilterChange` or standalone `defaultFilter`, and its matching
  scope remains panel label, description, current visibility, placement, and
  dock zone. It appears by default only for more than six configured panels.
- Dense CAD docks should prefer icon-first tabs over repeated panel-path or
  caption text. `CadDockTabs` keeps the declaration's canonical `label` as
  the accessible name and tooltip when `compact` rendering uses `tabLabel` or
  `shortLabel`; `CadWorkspaceDockZone` forwards that choice as `compactTabs`.
  Do not fill a dense dock strip with routine number badges or close targets.
  Use explicit `attention`/`alert` data only for actionable `warning` or
  `danger` states, and show a close control only when a host supplies an
  `onPanelClose` callback.
- A movable panel must respond to its own usable dock width, not merely the
  browser viewport. Use CSS container queries for content-only reflow, and
  explicit `layout="auto"` / `layout="tiles"` props where the component's
  arrangement changes materially. Preserve the existing `strip`/`table`
  defaults so ordinary standalone use remains backward compatible.
- `CadAnnotationScalePicker` keeps the familiar stacked label by default.
  Dense toolbar hosts may request `layout="inline"`; it remains a native,
  labelled select and keeps an optional Manage action on that same row.
- Compact workspace chrome must not place annotation and paper-space viewport
  scale controls side by side without context. Derive the visible scale from
  the active workspace profile: Model Space exposes annotation scale, while a
  Layout exposes viewport scale. Both values may remain host-owned and
  persistable, but that contextual visibility is derived UI state, not another
  preference to save.
- Prefer tiles for short independent actions, labelled cards for dense records
  at narrow widths, and normal vertical flow for field editors. Keep explicit
  scroll regions for sequential command history, logs, and Model/Layout tabs;
  forcing these into small tiles loses sequence and context. `CadDataGrid`
  retains semantic table markup in `auto` mode and only changes its visual
  treatment to cards when its own container is narrow.
- Workspace presets are versioned, JSON-safe UI snapshots. The reusable codec
  (`createCadWorkspacePresetSnapshot`, `exportCadWorkspacePreset`, and
  `importCadWorkspacePreset`) must remain storage-, renderer-, and
  docking-engine-agnostic; a host supplies its panel declarations and applies
  a validated snapshot atomically.
- Persist durable UI intent only: panel preferences, dock modes/sizes/active
  panels, command-line height, Ribbon tab, Quick Properties state,
  workspace-profile UI state, host-approved viewport-overlay layouts (for
  example navigation, selection-summary, and viewport command-console)
  `{ position: { x, y }, collapsed }` state, a fixed ViewCube's
  `{ collapsed }` intent, and other explicitly host-approved UI fields.
  Never include CAD engine or drawing data, geometry, layer/domain records,
  selections, selection-set contents, transient dialogs, events/history,
  pending input (including a unified-header search query), hover rail previews,
  minimized Ribbon flyouts, or focus-mode state in a workspace preset.
- `CadWorkspacePresetManager` is controlled and persistence-agnostic. It emits
  save/load/overwrite/delete/export/import intent; file transport, local
  storage, server sync, permissions, conflict policy, and user feedback stay
  with the host. The Vite sandbox is only a reference host: it uses
  `localStorage` to restore the current UI workspace and to retain named
  presets locally. Its empty-list first-save checklist is presentation-only,
  localizable copy; it must never synthesize or persist a preset on behalf of
  the host.

## Current modular surface

- `CadWorkspaceRibbon` provides a renderer-independent, tabbed and grouped
  AutoCAD-style command ribbon. Its optional minimized form keeps the tab row
  compact while hover/focus exposes command groups in a temporary overlay.
- `CadCuiRuntime` adds declarative command grouping plus live command-state
  resolution for all standard CUI surfaces.
- `CadNavigationBar`, `CadMovableOverlay`, `CadViewportControls`,
  `CadVisualStylePicker`, `CadViewportScalePicker` and `CadSelectionSetPanel`
  are engine-free viewport/context primitives. `CadMovableOverlay` is
  host-anchored, clamps its pixel translation to the immediate viewport
  boundary when measurable, uses its ribbed tab as the only drag target, and
  keeps collapse explicit: click toggles it while arrow keys provide a
  keyboard move alternative. Its `edge` may be `top`, `right`, `bottom`, or
  `left`; the playground keeps the tall navigation rail on its short `top`
  edge and puts selection-summary and command-console grips on their short
  `left` edge: this is the fixed collapse base, while their content opens
  rightward. Each grip has a host-supplied decorative icon while its
  accessible label stays descriptive. `CadViewportControls` stays
  host-positioned and non-draggable;
  its opt-in `collapsible` mode keeps a durable `collapsed` setting separate
  from the transient hover/focus `peekOpen`, so its navigation remains usable
  while the pointer or focus is inside the shared control surface.
- `CadCommandLine` has a pixel-height, accessible resize contract and keeps
  command history and options in an internal scroll region.
- `CadWorkspacePanelManager` is a renderer- and docking-library-agnostic
  workspace flyout. It emits compact `{ open, placement, dockZone? }`
  preferences, while the host owns persistence, authorization, and the actual
  dock or float operation. `groupCadWorkspacePanelsByDockZone` is the pure
  bridge from those preferences to left/right/bottom host render lists. When a
  workspace has more than six panels, its optional controlled/uncontrolled
  query filters panel label, description, visibility, placement, and dock zone
  without changing those durable preferences.
- `CadPopover` moves focus into non-modal `dialog` content on open (preferring
  a `data-autofocus` action) and restores focus to its trigger on close; the
  panel manager marks its Close action as the initial target.
- `CadWorkspaceFocusToggle` and `useCadWorkspaceFocus` provide a compact,
  accessible entry/exit surface for a full Model Space layout without coupling
  it to a rendering engine or application shell.
- `CadWorkspaceChromeControls` provides compact, icon-first titlebar controls
  with declarative active/mode data and host callbacks. `CadMenuBar` can place
  them at its visual right with `endSlot`, without placing ordinary buttons in
  `role="menubar"` or changing menu keyboard navigation.
- `CadWorkspaceDockModeControl`, `CadWorkspaceDockResizeHandle`, and
  `useCadWorkspaceDock` provide renderer-independent dock intent: Open/Rail/
  Hide controls plus pointer- and keyboard-operable pixel resizing.
- `CadWorkspaceDockRail` and `useCadWorkspaceDockRail` provide the temporary,
  hover/focus-held preview behavior for left, right, and bottom rails.
  `CadWorkspaceDockZone` groups multiple docked panels into an accessible tab
  strip without imposing a docking engine; it can request compact icon-first
  tabs without degrading the tab's accessible label.
- `CadWorkspacePresetManager` is the compact controlled manager for named
  workspace snapshots. `CadWorkspacePreset.js` provides its safe, portable v1
  schema helpers and validates JSON imports before the host restores a layout.
  An empty preset list gets a short first-save guide that disappears once the
  host supplies a preset.
- `CadToolPalette`, `CadConstraintBar`, `CadStatusBar`, and
  `CadSelectionCycler` support explicit adaptive layouts. `CadDataGrid`
  supports `table` (default), `auto`, and `cards`; the workspace stylesheet
  also reflows Object Snaps, Layers, Blocks, Quick Properties, filters, and
  selection-set controls within their own containers.
- The Vite sandbox demonstrates all of the above with host-owned React state.
  Its `WORKSPACE / PANELS` Ribbon tab manages fourteen independently dockable
  panels: Tool Palette, Object Snaps, Constraints and Layers (left);
  Properties, Blocks, Object Data, Selection, Selection Sets and View / Scale
  (right); Command, Activity, Layouts and Drafting Modes (bottom). All share
  the same host-owned visibility and physical-zone preference contract; its
  SVG drawing remains a neutral visual stand-in, not a CAD engine. Its
  `WORKSPACE / PRESETS` command demonstrates automatic current-workspace
  restore plus named local save/load/overwrite/delete and portable JSON
  import/export; an empty named-preset list guides the operator through its
  first save.

## Visual language

Use compact graphite workspace chrome, restrained cyan/amber/green accents,
strong grouped hierarchy and functional labels. Avoid decorative dashboard
patterns, gradients that obscure information, or app-specific branding in the
shared component library.

## Quality contract

After source changes, run:

```bash
npm run check
npm run typecheck
npm run test:coverage
npm run check:package
```

The codebase, playground, and tests use TypeScript. `npm run typecheck` covers
all of them; the library build also emits public `.d.ts` declarations to
`dist/`. `CadAnyProps` is the intentional compatibility type for the current
host-extensible component surface, to be narrowed incrementally without a
breaking API change.

`npm run check` is the fast local gate: ESLint (with stable Rules of Hooks and
dependency checks), TypeScript validation, the full Vitest suite, both
production builds, and the whitespace diff check. Coverage is reported with
Vitest V8 but deliberately has no threshold until the recorded baseline has had
time to stabilize. GitHub Actions repeats lint, types, coverage, both builds,
and verifies that committed `dist/` matches the source build. Rebuild `dist/`
whenever public source or shared CSS changes.
