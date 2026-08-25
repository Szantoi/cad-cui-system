# Project State

Updated: 2026-08-25 · Package version: `0.5.1` · Lifecycle: active development — stable, engine-free UI layer
Latest committed baseline: `1e58401 fix: support forwarded workspace panel icons`

## Current working-tree increment

This increment extends the Model Space-first workspace with resizable docks,
hover-held rail previews, multi-panel zones, portable workspace presets,
compact titlebar layout controls, and panel-local responsive composition.

- Added public focus, dock sizing, rail-preview, and dock-zone primitives:
  `CadWorkspaceFocusToggle`, `useCadWorkspaceFocus`,
  `CadWorkspaceDockModeControl`, `CadWorkspaceDockResizeHandle`,
  `useCadWorkspaceDock`, `CadWorkspaceDockRail`,
  `useCadWorkspaceDockRail`, and `CadWorkspaceDockZone`.
- A rail is now a true temporary peek: hovering or focusing its label opens an
  overlay without reflowing Model Space, it stays open across the shared
  rail/preview area, preserves mounted child state, and closes on leave or
  `Escape`. Clicking still requests the durable `open` mode. The sandbox rail
  preview now overlaps its label by 1px on every edge, removing the former
  4–5px pointer gap that could close a peek while moving into it.
- Side and bottom dock zones reuse accessible `CadDockTabs`, so each physical
  zone can host multiple panels. The sandbox now declares fourteen independent
  panel targets: Tool Palette, Object Snaps, Constraints and Layers (left);
  Properties, Blocks, Object Data, Selection, Selection Sets and View / Scale
  (right); Command, Activity, Layouts and Drafting Modes (bottom).
- `CadDockTabs` and `CadWorkspaceDockZone` now support a compact icon-first
  tab presentation. A compact `tabLabel`/`shortLabel` is visual-only: the
  canonical panel label remains the tab's accessible name and hover tooltip,
  avoiding repeated long panel captions in dense workspace chrome. Routine
  number badges and default close targets have been removed from the sandbox;
  `attention`/`alert` only renders a warning or danger indicator, and close is
  available only to a host that explicitly supplies `onPanelClose`.
- `CadWorkspacePanelManager` now supports optional serializable
  `{ open, placement, dockZone }` preferences for declared left/right/bottom
  panel targets; `groupCadWorkspacePanelsByDockZone` maps the visible docked
  records to host render lists, while existing `{ open, placement }` records
  remain compatible.
- The new `WORKSPACE / PANELS` Ribbon tab embeds the Panel layout flyout. It
  controls all fourteen panels' visibility and left/right/bottom target
  without a modal, external docking engine, or notification toast. Properties,
  blocks, object data, selection, selection sets, view/scale, command,
  activity, layouts and drafting modes therefore receive the same independent
  panel behavior as the original four palettes.
- Large panel collections now get a compact Panel layout search field. It
  appears automatically above six configured panels (including the sandbox's
  fourteen), matches label, description, current visibility, placement, and
  dock zone, and supports host-controlled `filter`/`onFilterChange` or an
  internal `defaultFilter` without changing persisted panel preferences.
- Restoring the panel layout also reopens every physical dock that receives a
  restored panel, so a left/right/bottom dock cannot remain accidentally in
  rail or closed state after its preferences reset.
- The non-modal panel-layout dialog moves keyboard focus to its Close action
  when opened, then returns focus to its Ribbon trigger when closed.
- The sandbox keeps its adjustable command-area height independent from the
  bottom-dock height, removes automatic notification toasts, and provides a
  true Clean Screen Model Space via `Ctrl+0` / `Escape`.
- Added `CadWorkspaceChromeControls`, an engine-free icon-first control group
  for host-owned titlebar actions. `CadMenuBar` now accepts an `endSlot` and
  `endSlotLabel`, rendering the group beside File/Edit/View as a semantic
  sibling rather than mixing ordinary buttons into the ARIA menubar.
- The sandbox moves Focus, Tools, Command bar and Inspector quick toggles to
  the right end of the unified header. Its compact Workspace layout popover
  keeps explicit `Open` / `Rail` / `Hide` selection and reset available
  without covering Model Space with a duplicate control strip.
- The titlebar and File/Edit row are now one VS-Code-style header. Menus and
  CAD CUI identity are grouped on the left, a real labelled workspace-search
  field remains centered, and engine status plus workspace controls stay in a
  fixed right group. Search is intentionally transient: it can be submitted
  to the Activity log without an automatic popup or workspace-preset write.
- A minimized Ribbon is now a real, transient flyout rather than a dead tab
  row: hovering, focusing, or touching an enabled tab shows its command groups
  as an absolute Model Space overlay without changing durable `minimized`
  state. The shared tab/flyout region stays open for pointer or keyboard focus;
  `ArrowDown` enters the first command and `Escape` hides the flyout while
  returning focus to its active tab. The panel remains mounted while hidden,
  and the sandbox suppresses hover/focus-only Activity-log noise.
- Added the public `CadWorkspacePreset.js` v1 codec:
  `createCadWorkspacePresetSnapshot` creates a canonical JSON-safe snapshot,
  `exportCadWorkspacePreset` produces portable JSON, and
  `importCadWorkspacePreset` strictly checks schema/version and unsafe input
  before a host restores it. The codec is pure and remains independent of
  local storage, file handling, a CAD engine, and any docking implementation.
- Added `CadWorkspacePresetManager`, a controlled **WORKSPACE / PRESETS**
  surface for named save/load, overwrite, delete, export, and import actions.
  The playground host retains its named presets and automatically restores its
  current UI workspace from browser `localStorage`. When no named preset
  exists, it now shows an accessible, localizable first-save checklist that
  disappears once the host provides the first preset.
- A preset captures durable UI settings only: panel placement and visibility,
  dock modes/sizes/active tabs, command-line height, Ribbon tab, Quick
  Properties, workspace-profile UI state, approved viewport navigation,
  selection-summary, and command-console position/collapse state, and a ViewCube
  collapsed state. It explicitly
  excludes drawing data/CAD engine state, dialogs, events, command history,
  selections and selection-set contents, pending interaction state, hover rail
  peeks, minimized Ribbon flyouts, ViewCube peeks, and focus mode.
- Added panel-local responsive layouts driven by each component's own inline
  container rather than browser-wide media queries. The component API exposes
  opt-in `layout="auto"` or `layout="tiles"` for `CadToolPalette`,
  `CadConstraintBar`, `CadStatusBar`, and `CadSelectionCycler`; the original
  strip behavior stays the default for existing consumers.
- `CadAnnotationScalePicker` now also offers `layout="inline"`: its default
  remains a panel-friendly stacked label, while dense Ribbon chrome can keep
  the native labelled select (and optional Manage action) on one row. The
  sandbox applies this contextually: Model Space exposes only `ANNO SCALE`,
  while a Layout exposes only `VIEW SCALE`; the detailed View / Scale panel,
  Properties list, status readouts, and SVG mock metadata follow the same
  Model-versus-paper-space distinction. No new preset field is needed because
  both existing values and the active profile already persist.
- `CadDataGrid layout="auto"` preserves its semantic table while wide, then
  renders labelled record cards once its own panel becomes narrow;
  `layout="cards"` requests that card treatment at every width. Object Snaps,
  Layers, Block Palette, Quick Properties, selection filters, and selection-set
  actions use container-query reflow without a host API change. Sequential
  command/history/layout content keeps intentional scrolling instead of being
  squeezed into unreadable tiles.
- The playground enables the adaptive modes in its fourteen-panel dock
  catalogue. Tool and constraint actions form tiles, drafting modes become a
  responsive status grid, object-data records become cards, and inspector
  controls, properties, layers, selection, snaps, blocks and named sets adapt
  to the actual left/right/bottom dock width.
- Added `CadMovableOverlay`, a host-anchored, viewport-bounded overlay
  primitive with a single ribbed tab: drag it to reposition, click it to
  collapse or expand, and use arrows/Home/End as a keyboard alternative. The
  playground puts its tall navigation rail on a `top` tab and the wide
  selection summary plus viewport command console on their fixed `left` tabs,
  so their content consistently opens rightward without moving the grip. Each
  grip has a distinct decorative icon. All three save only `{ position: { x,
  y }, collapsed }` layout state with the current and named workspace presets;
  selection contents and draft coordinates remain outside the preset boundary.
- The former multi-field dynamic-input overlay is now a compact, real
  `CadCommandLine` console: `MOVE: 10,30,50` runs on Enter, updates the
  host-owned point readout when coordinates are valid, and clears its own
  transient draft. Its measured width lives on the inner console rather than
  the movable host, so a collapsed handle no longer retains a large hitbox or
  percentage translation at the Model Space boundary.
- Added a fixed, non-draggable ViewCube control surface. `CadViewportControls`
  now has opt-in `collapsible` mode with controlled/uncontrolled durable
  `collapsed` intent and a separate transient hover/focus `peekOpen` state.
  In rail mode, the compact ViewCube handle expands across one shared
  pointer/focus region, so moving onto the Cube, zoom buttons, or UCS cannot
  close it mid-navigation. The sandbox pins it to the Model Space top-right
  corner above movable overlays, exposes an explicit Open/Collapse toggle in
  the `VIEW` Ribbon, and saves only `layout.viewCube.collapsed` with current
  and named workspace presets.

## Delivered workspace foundation

- Workspace primitives remain renderer- and docking-library-independent; hosts
  own the layout engine, persistence, drawings, and actual dock operations.
- Rail peeks and minimized Ribbon flyouts are intentionally transient while
  dock mode, geometry, and the Ribbon's durable minimization choice remain
  host-owned state.
- The Ribbon supports selective custom commands with default-button fallback,
  allowing the Panel layout and Workspace presets flyouts to live in normal
  Ribbon tool groups.
- Workspace persistence is now split cleanly: the portable, versioned preset
  codec and controlled manager ship in the library; the demo owns its
  `localStorage` adapter, file picker, download, and restoration policy.
- Panel filtering and the empty-preset checklist are intentionally
  presentation-only: the former never changes a panel preference, and the
  latter never creates a preset without an explicit host save action.
- The README and durable memory now reflect the expanded fourteen-panel,
  multi-zone contract, compact dock-tab presentation, panel search, guided
  first save, preset boundary, top-grip viewport overlays, and titlebar chrome
  semantics; TODO retains only follow-on product work.

## Verified state

| Check | Result |
| --- | --- |
| Preset codec / manager tests | `8/8` focused tests passed |
| Unit/integration tests | `16` files, `117/117` tests passed |
| Focused overlay / playground tests | `2` files, `29/29` tests passed |
| Library build | passed (`npm run build`) |
| Playground build | passed (`npm run demo:build`) |
| Package dry-run | passed (`npm pack --dry-run`) |
| Diff whitespace check | passed (`git diff --check`) |
| ViewCube interaction / persistence | passed: fixed-host DOM contract, shared hover/focus rail, Cube/zoom callbacks, Ribbon toggle, named-preset and current-workspace restore |
| Selection / command-console overlay persistence | passed: edge-aware icon grips, keyboard movement, collapse semantics, named-preset load, and current-workspace restore without serializing selected entities or draft coordinates |
| Minimized Ribbon interaction | passed: focus/hover/touch flyout opening, shared pointer-or-focus hold, Escape focus restoration, mounted hidden panel, and custom focusable command entry |
| Contextual scale controls | passed: Model-only annotation scale, Layout-only viewport scale, independent values, matching View / Scale panel, and contextual mock viewport metadata |
| Browser layout QA | passed: compact titlebar controls are outside the menubar, direct dock toggles work, the Workspace layout popover explicitly selects Rail/Open/Hide and reset, all 14 compact dock tabs have icon wrappers with zero routine badges or close targets, the narrowest supported side docks reflow constraint/tool controls into tiles and Object Data into labelled cards with no horizontal overflow, and the movable viewport-navigation overlay is inside Model Space without intersecting the View Cube controls |

## Current runnable entry point

```bash
npm run demo
```

Vite normally exposes the sandbox at `http://127.0.0.1:4173/`.

## Working-tree note

The workspace increment is ready for review and versioning. Its rebuilt
`dist/` artifacts are intentionally retained with the public source change.
