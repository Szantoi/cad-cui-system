# CAD CUI System

Reusable React component kit for a compact, stable CAD workspace: command
surfaces, drawing-space chrome, palettes and neutral CAD controls. The package
does not implement a CAD engine, renderer or docking manager; it gives each
application composable UI parts while the host owns drawing data and behavior.

## Architecture

The public API deliberately has two independent layers:

- **CUI runtime** — a serializable command registry, shortcuts, persistence,
  capability filtering and React Router intent handling.
- **CAD workspace primitives** — controlled or standalone presentational
  components for tabs, tools, palettes, status readouts and inspectors. They
  are router- and renderer-independent.

This separation makes it possible to use the component kit with Canvas, SVG,
Three.js, WebGL, a custom docking system, or a desktop shell without locking
the package to one CAD implementation.

## Project tracking

- [Project memory](PROJECT_MEMORY.md) records durable architecture and product
  decisions for future development sessions.
- [Project state](PROJECT_STATE.md) records the latest completed increment and
  verification result.
- [TODO](TODO.md) contains the focused next-work list.

## Interaction guarantees

The shared workspace primitives own the small but critical CAD interaction
details, so each consuming screen behaves the same way:

- `CadSplitPane` supports pointer and keyboard resizing, ignores non-primary
  pointers and always clears an interrupted drag.
- `CadDialog` traps focus, restores the initiating control on close and makes
  the safe action the first focus target for destructive confirmations.
- `CadMenuBar` and `CadPopover` close on `Escape` or outside interaction and
  return focus to their invoking control. Generic popovers are `region`s;
  pass `contentRole="dialog"` only for an actual dialog-like overlay.
- `CadDockTabs` can use compact, icon-first captions without losing meaning:
  its canonical item `label` remains the tab's accessible name and tooltip.
  `CadWorkspaceDockZone` exposes that presentation option as `compactTabs`.
  Ordinary counts and close buttons stay out of a dock tab strip by default;
  use an explicit warning/danger `attention` item only for actionable state.

These contracts are intentionally independent of the host router, docking
engine and drawing renderer.

Import the stylesheet once in the consuming application:

```js
import '@szantoi/cad-cui-system/styles.css';
```

## Command runtime

```jsx
import {
  CadCuiProvider,
  CadCuiRibbon,
  CadCuiQuickAccess,
  CadCuiCommandPalette,
  defineCadCuiSystem
} from '@szantoi/cad-cui-system';

const registry = defineCadCuiSystem({
  id: 'my-workspace',
  tabs: [{ id: 'view', label: 'VIEW' }],
  commands: [/* serializable command declarations */]
});

<CadCuiProvider registry={registry} handlers={{
  'panel.open': ({ intent }) => openPanel(intent.panelId)
}}>
  <CadCuiRibbon iconMap={icons} />
  <CadCuiQuickAccess iconMap={icons} />
  <CadCuiCommandPalette iconMap={icons} />
</CadCuiProvider>
```

### Grouped commands and host state

Command groups are opt-in, so existing registries keep the original flat
ribbon markup. Add `groups` plus a placement `groupId` when a workspace wants
the more familiar DRAW / MODIFY / VIEW structure. The host can supply
non-serializable, live state separately through `commandStates`; it is shared
by the ribbon, quick access, context menus and command palette.

```jsx
const registry = defineCadCuiSystem({
  id: 'model-space',
  tabs: [{ id: 'home', label: 'HOME', tone: 'cyan' }],
  groups: [
    { id: 'draw', label: 'DRAW', tab: 'home', control: 'toggle', order: 10 },
    { id: 'modify', label: 'MODIFY', tab: 'home', order: 20 }
  ],
  commands: [
    {
      id: 'line', label: 'LINE', intent: { type: 'draw.line' },
      placements: [{ surface: 'ribbon', tab: 'home', groupId: 'draw', control: 'toggle' }]
    }
  ]
});

<CadCuiProvider
  registry={registry}
  commandStates={{
    line: { active: activeTool === 'line', badge: pendingPointCount },
    'modify.move': { disabled: selectionCount === 0 }
  }}
  handlers={{ 'draw.line': startLine }}
>
  <CadCuiRibbon />
</CadCuiProvider>
```

Each state record accepts `visible`, `disabled` (or `enabled: false`), `active`
and `badge`; `commandStates` may be an object, `Map`, or a resolver function.
Handlers keep receiving the immutable registry record as `event.command`; the
additive `event.resolvedCommand` includes the live effective state.

### Selection-aware commands

Use the same registry for contextual CAD actions. The host passes a transient
selection snapshot to `CadCuiProvider`; command declarations then state exactly
which count, entity types, and aggregate traits they support. A rule mismatch
is hidden by default, so the toolbar and context menu do not fill up with
disabled operations. The selection is never written into CUI preferences or a
workspace preset.

```jsx
import {
  CadCuiProvider,
  CadGripToolbar,
  useCadSelectionActions,
  defineCadCuiSystem
} from '@szantoi/cad-cui-system';

const registry = defineCadCuiSystem({
  id: 'model-space',
  commands: [{
    id: 'modify.explode',
    label: 'EXPLODE',
    shortcut: 'X',
    intent: { type: 'modify.explode' },
    selection: {
      count: 'one',
      entityTypes: ['block'],
      traits: ['editable']
    },
    placements: [
      { surface: 'ribbon', tab: 'home', groupId: 'selection' },
      { surface: 'selection-toolbar', order: 20 },
      { surface: 'context', menu: 'selection', order: 20 }
    ]
  }]
});

function SelectionToolbar() {
  const { selection, actions, execute } = useCadSelectionActions();
  return <CadGripToolbar
    selectionCount={selection.ids.length}
    tools={actions}
    onAction={action => execute(action)}
  />;
}

<CadCuiProvider
  registry={registry}
  selection={{
    ids: selectedIds,
    entityTypes: selectedTypes,
    // For multi-selection, expose a trait only if all selected entities share it.
    traits: sharedTraits,
    source: 'canvas'
  }}
  handlers={{ 'modify.explode': ({ selection }) => explode(selection.ids) }}
>
  <CadCuiRibbon />
  <SelectionToolbar />
</CadCuiProvider>
```

`CadSelectionRule` supports `count: 'none' | 'one' | 'many' | 'any'`,
`entityTypes`, `typeMatch`, `traits`, and `traitMatch`. Type matching defaults
to `all`, preventing a mixed selection from being offered a geometry-specific
operation. A `commandStates` resolver receives the same normalized selection in
its second argument: `(command, { selection, state, capabilities, placement,
surface }) => state`.

## Renderer-agnostic workspace ribbon

`CadWorkspaceRibbon` is a self-contained Model Space ribbon surface: it does
not depend on `CadCuiProvider`, React Router, a docking manager, or a drawing
engine. The host supplies its tabs, visible command records, icon mapping and
callbacks. This makes it suitable for a graph, Canvas/SVG, WebGL or desktop
CAD workspace without sharing host-specific chrome.

Commands may use either plain UI fields (`tabId`, `groupId`, `groupLabel`,
`order`) or the `placement` fields created by `defineCadCuiSystem`. Use
`groupCadWorkspaceRibbonCommands` when the host keeps commands as one flat
list; pass `groups` directly when it already owns the group layout.

```jsx
import { useEffect, useMemo, useState } from 'react';
import {
  CadWorkspaceRibbon,
  groupCadWorkspaceRibbonCommands
} from '@szantoi/cad-cui-system';

const tabs = [
  { id: 'view', label: 'VIEW', tone: 'cyan', color: '#53c9ff' },
  { id: 'edit', label: 'EDIT', tone: 'magenta', color: '#f08cff' }
];

const visibleCommands = [
  { id: 'layers', label: 'LAYERS', icon: 'layers', badge: 3,
    placement: { tab: 'view', group: 'DISPLAY', order: 10 } },
  { id: 'connect', label: 'CONNECT', icon: 'link', tone: 'magenta',
    placement: { tab: 'edit', group: 'RELATIONS', order: 10 } }
];

function WorkspaceRibbon() {
  const [activeTab, setActiveTab] = useState('view');
  const [minimized, setMinimized] = useState(false);
  const commandGroups = groupCadWorkspaceRibbonCommands(visibleCommands, { tabId: activeTab });

  return <CadWorkspaceRibbon
    tabs={tabs}
    activeTab={activeTab}
    onActiveTabChange={(id) => setActiveTab(id)}
    groups={commandGroups}
    minimized={minimized}
    onMinimizedChange={setMinimized}
    identity={<>◈ <strong>MODEL</strong></>}
    status={<span>3 ACTIVE LAYERS · SNAP ON</span>}
    renderIcon={(command) => {
      const Icon = iconMap[command.icon];
      return Icon ? <Icon size={15} /> : null;
    }}
    onCommand={(command) => runWorkspaceCommand(command.id)}
  />;
}
```

The public interaction contract is intentionally small:

- `onActiveTabChange(id, tab, event)` and `onMinimizedChange(value, event)`
  support controlled or standalone state.
- `compact` is visual density only. When durable `minimized` state is true, an
  enabled tab opens its transient command flyout on pointer entry or keyboard
  focus (and on click for touch use) without calling `onMinimizedChange`. The
  flyout overlays Model Space and stays available while pointer or focus is in
  the shared Ribbon surface; `ArrowDown` moves into its first focusable command
  and `Escape` closes it and returns focus to the active tab. Hover/focus tab
  selection also calls `onActiveTabChange`, so hosts that only log deliberate
  selection can inspect `event.type`.
- `onCommand(command, context, event)` emits the original command record;
  `context` includes the active tab, group and `source: 'workspace-ribbon'`.
- `renderIcon(command, context)` and `renderCommand(command, context)` are
  escape hatches for host icon libraries and exceptional commands. The latter
  receives `context.execute` and accessible `context.buttonProps`; a custom
  trigger should call `context.execute(event)` so it still emits through the
  normal `onCommand` pipeline.
- `identity`, `renderIdentity`, `status`, `renderStatus`, `endSlot`, and
  `renderMinimizeControl` are slots rather than application-specific props.

## Customizable workspace panels

`CadWorkspacePanelManager` is the shared CAD-style flyout for choosing which
workspace panels are visible and whether each is **docked** or **floating**.
It is intentionally *not* a Dockview adapter or a docking manager. The host
keeps the serializable preference map and decides how to render an open panel:
as a Dockview panel, an absolute overlay, a native window, or any other
surface.

```jsx
import { useState } from 'react';
import {
  CadWorkspacePanelManager,
  createCadWorkspacePanelPreferencesKey
} from '@szantoi/cad-cui-system';

const workspacePanels = [
  {
    id: 'content-browser',
    label: 'Content browser',
    description: 'Folders, saved searches and sources',
    defaultOpen: true,
    defaultPlacement: 'dock'
  },
  {
    id: 'element-inspector',
    label: 'Element inspector',
    defaultOpen: true,
    defaultPlacement: 'dock'
  },
  {
    id: 'display-controls',
    label: 'Display controls',
    defaultOpen: false,
    defaultPlacement: 'float'
  }
];

function WorkspaceSettings({ isAdmin }) {
  const scope = isAdmin ? 'admin' : 'public';
  const storageKey = useMemo(() => createCadWorkspacePanelPreferencesKey({
    namespace: 'knowledge-graph',
    scope
  }), [scope]); // "knowledge-graph:admin:panels" or "knowledge-graph:public:panels"
  const readPreferences = () => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(window.localStorage.getItem(storageKey) || '{}'); }
    catch { return {}; }
  };
  const [panelPreferences, setPanelPreferences] = useState(readPreferences);

  useEffect(() => {
    setPanelPreferences(readPreferences());
  }, [storageKey]);

  const persistPreferences = nextPreferences => {
    setPanelPreferences(nextPreferences);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, JSON.stringify(nextPreferences));
    }
  };

  return <CadWorkspacePanelManager
    panels={workspacePanels}
    value={panelPreferences}
    onChange={persistPreferences}
    scope={scope}
    triggerLabel="Configure workspace"
  />;
}
```

The persisted contract stays compact and portable:

```js
{
  'content-browser': { open: true, placement: 'dock' },
  'display-controls': { open: false, placement: 'float' }
}
```

`placement` accepts `dock` / `float` and common `docked` / `floating` aliases
when reading state. The manager exposes `onPanelOpen`, `onPanelClose`,
`onPanelDock`, `onPanelFloat`, `onPanelChange`, and `onResetAll`; every action
also flows through `onChange(nextValue, change, event)`. The `change` record
contains the original panel declaration, previous/next preference and an
intent such as `open`, `close`, `dock`, `float`, or `reset-all`.
When the host also owns physical dock visibility, consume `onResetAll` to
re-open any edge that receives a restored docked panel.

Panels that may move between physical dock zones can declare their supported
locations. The preference remains serializable and retains the last selected
zone while a panel is floating:

```js
const workspacePanels = [{
  id: 'layers',
  label: 'Layers',
  defaultDockZone: 'left',
  dockZones: ['left', 'right', 'bottom']
}];

// Host-persisted intent
{ layers: { open: true, placement: 'dock', dockZone: 'bottom' } }
```

`CadWorkspacePanelManager` presents those declared locations and emits
`onPanelDockZone` plus the `dock-zone` action through `onChange`. Use
`CAD_WORKSPACE_PANEL_DOCK_ZONES`,
`normalizeCadWorkspacePanelDockZone`, or
`CAD_WORKSPACE_PANEL_ACTIONS.SET_DOCK_ZONE` for a headless integration.

### Large panel lists

For more than six configured panels, `CadWorkspacePanelManager` shows a
search field by default. It matches a panel's label and description, plus its
current visible/open or hidden/closed state, placement, and declared dock
zone. The query is presentation state only: use `filter` with
`onFilterChange` for controlled state, or `defaultFilter` for standalone
state. `filterable`, the labels, the empty-result copy, and the clear action
are configurable; the manager also reports how many panels are currently
shown. The bundled fourteen-panel **Panel layout** flyout therefore remains
quick to scan without changing the saved panel preferences.

For headless integrations, use the same pure helpers without rendering the
flyout: `normalizeCadWorkspacePanels`,
`normalizeCadWorkspacePanelPreferences`,
`updateCadWorkspacePanelPreference`,
`resetCadWorkspacePanelPreferences`,
`getCadWorkspacePanelPreference`, and
`useCadWorkspacePanelPreferences`. `groupCadWorkspacePanelsByDockZone` turns
the visible, docked declarations into `{ left, right, bottom }` arrays for a
host's `CadWorkspaceDockZone` or docking adapter.
`createCadWorkspacePanelPreferencesKey` only creates a scope-aware storage
key; it never reads or writes browser storage itself.

The bundled sandbox exposes the same contract in its **WORKSPACE / PANELS**
Ribbon tab for fourteen independently managed panels:

- **Left:** Tool Palette, Object Snaps, Constraints, Layers
- **Right:** Properties, Blocks, Object Data, Selection, Selection Sets, View /
  Scale
- **Bottom:** Command, Activity, Layouts, Drafting Modes

Each can be shown, hidden, or moved to the left, right, or bottom dock without
coupling the library to a docking engine. The sandbox uses icon-first compact
dock tabs so long panel names are not repeated across the workspace chrome;
the full name remains available through the tab's accessible label and hover
tooltip.

## Workspace presets

`CadWorkspacePreset.js` provides a small, renderer-independent, versioned JSON
envelope for saving a workspace arrangement. Use
`createCadWorkspacePresetSnapshot` for a current in-memory snapshot,
`exportCadWorkspacePreset` for portable JSON, and
`importCadWorkspacePreset` for strict schema/version validation before a host
applies an imported file. The helpers are pure: they do not read browser
storage, open a file picker, or make assumptions about a docking engine.

```jsx
import {
  CadWorkspacePresetManager,
  createCadWorkspacePresetSnapshot,
  exportCadWorkspacePreset,
  importCadWorkspacePreset,
  normalizeCadWorkspacePanelPreferences
} from '@szantoi/cad-cui-system';

const presetOptions = {
  panels: workspacePanels,
  normalizePanelPreferences: normalizeCadWorkspacePanelPreferences
};

const snapshot = createCadWorkspacePresetSnapshot({
  id: 'focused-drafting',
  name: 'Focused drafting',
  panelPreferences,
  settings: {
    docks: { left: { mode: 'rail', size: 288 } },
    commandLineHeight: 144,
    ribbonTab: 'draft',
    quickProperties: { open: true, pinned: false },
    profiles: { items: workspaceProfiles, activeId: activeProfileId }
  }
}, presetOptions);

const exported = exportCadWorkspacePreset(snapshot, presetOptions);
const imported = importCadWorkspacePreset(fileText, presetOptions);

<CadWorkspacePresetManager
  presets={presets}
  selectedPresetId={selectedPresetId}
  draftName={draftName}
  onSaveAs={() => saveSnapshot(snapshot)}
  onLoad={({ preset }) => applyPreset(preset)}
  onOverwrite={({ preset }) => replaceSnapshot(preset.id, snapshot)}
  onDelete={({ preset }) => removeSnapshot(preset.id)}
  onExport={({ preset }) => downloadPreset(preset)}
  onImport={() => inputRef.current?.click()}
/>
```

The portable v1 snapshot is deliberately limited to durable interface intent:
panel visibility, placement and dock zone; dock modes, dimensions and active
tabs; command-area height; active Ribbon tab; Quick Properties state; and
workspace-profile UI state. A host may add its own serializable UI settings
under `settings`, then normalize them before applying a preset.

The bundled playground uses that host-owned `settings.layout` extension for
the navigation, selection-summary, and viewport command-console overlays. Each stores
only `{ position: { x, y }, collapsed }`; selected entities and temporary
coordinate values remain outside the preset.

It deliberately does **not** capture a CAD engine, drawing entities, geometry,
layer/domain records, current selection/selection-set contents, transient dialogs, command
history/events, hover rail peeks, minimized Ribbon flyouts, pending input, or
focus-mode state. Those
values either belong to the host's drawing domain or are momentary presentation
state. Treat an imported preset as untrusted input and apply it atomically only
after `importCadWorkspacePreset(...).ok` is true.

`CadWorkspacePresetManager` is a controlled, storage-agnostic UI surface for
selecting, saving, loading, overwriting, deleting, exporting, and importing
named presets. The bundled playground wires it into **WORKSPACE / PRESETS**:
it saves the current workspace automatically to browser `localStorage`,
restores that current workspace on the next visit, and keeps named presets in
the same local browser store. Its JSON import/export remains explicit and
portable; production hosts can replace the storage callbacks with a server,
desktop shell, or user-profile service.

When `presets` is empty, the manager presents a compact, accessible first-save
checklist: name the current workspace, save it, then load it later from the
saved list. The guide is display-only and disappears after the first preset;
it never creates or persists data itself. Hosts can localize it with
`emptyStateGuideLabel` and `emptyStateGuideSteps` while retaining the same
controlled preset contract.

## Engine-free viewport context

`CadNavigationBar`, `CadMovableOverlay`, `CadViewportControls`,
`CadVisualStylePicker`, `CadViewportScalePicker`, and `CadSelectionSetPanel`
are deliberately UI-only.
They expose controlled or uncontrolled values and report serializable user
intent; pan, zoom, rendering, selection storage and named-set management stay
in the host application. `CadMovableOverlay` is positioned by its host and
adds a bounded pointer/keyboard drag tab plus an explicit collapsed state; it
does not create a viewport, a docking engine, or a persistence policy.
`CadViewportControls` remains host-positioned and non-draggable; opt into
`collapsible` when a fixed ViewCube should collapse to a compact hover/focus
rail. Its durable `collapsed` value is deliberately separate from the
temporary `peekOpen` presentation state.

The same edge-aware `CadMovableOverlay` composition can wrap a live selection
summary or compact command console: the grip remains the sole drag/collapse
target, while the wrapped status output or form keeps its own semantics and
keyboard interaction. Pass a decorative `handleIcon` to make adjacent overlay
grips recognizable without changing their accessible label. If a workspace
also has its main command area visible, give the compact `CadCommandLine` a
different `label` so the two regions remain distinguishable to assistive
technology.

```jsx
<CadNavigationBar
  activeId={navigationMode}
  onActiveChange={setNavigationMode}
  onZoomIn={() => setViewportZoom(zoom => zoom + 0.1)}
  onZoomExtents={fitViewport}
/>
<CadMovableOverlay
  label="Viewport navigation"
  edge="top"
  position={navigationOverlay.position}
  onPositionChange={position => setNavigationOverlay(current => ({ ...current, position }))}
  collapsed={navigationOverlay.collapsed}
  onCollapsedChange={collapsed => setNavigationOverlay(current => ({ ...current, collapsed }))}
>
  <CadNavigationBar activeId={navigationMode} onActiveChange={setNavigationMode} />
</CadMovableOverlay>
<CadViewportControls
  collapsible
  collapsed={viewCubeCollapsed}
  onCollapsedChange={setViewCubeCollapsed}
  peekOnHover
  peekOnFocus
  onViewChange={setView}
  onZoomExtents={fitViewport}
/>
<CadVisualStylePicker value={visualStyle} onChange={setVisualStyle} />
<CadViewportScalePicker value={viewportScale} onChange={setViewportScale} />
<CadSelectionSetPanel
  sets={namedSelectionSets}
  activeId={activeSetId}
  onChange={setActiveSetId}
  onApply={(set) => applySelectionIds(set.entityIds)}
  onCreate={createSelectionSet}
/>
```

## CAD workspace catalog

| Family | Components |
| --- | --- |
| Drawing workspace | `CadSplitPane`, `CadDrawingSpaceTabs` (`CadLayoutTabs` / `CadDocumentTabs` aliases), `CadWorkspaceProfileTabs`, workspace-profile helpers, `CadWorkspacePanelManager` (`CadWorkspacePanelPreferences` alias), workspace-panel preference helpers, `CadWorkspacePresetManager` (`CadWorkspacePresetPanel` alias), `createCadWorkspacePresetSnapshot`, `exportCadWorkspacePreset`, `importCadWorkspacePreset`, `CadWorkspaceFocusToggle`, `CadWorkspaceChromeControls`, `CadWorkspaceDockModeControl`, `CadWorkspaceDockResizeHandle`, `CadWorkspaceDockRail`, `useCadWorkspaceDock`, `useCadWorkspaceDockRail`, `CadWorkspaceDockZone`, `CadDockTabs`, `CadDockPanel`, `CadStatusBar`, `CadStatusToggle`, `CadCommandLine`, `CadCommandHistory`, `CadCommandOptions` |
| Tools and menus | `CadWorkspaceRibbon`, `CadCompactWorkspaceRibbon`, `groupCadWorkspaceRibbonCommands`, `resolveCadCompactWorkspaceRibbonGroups`, `CadToolbar`, `CadToolbarGroup`, `CadToolPalette`, `CadToolButton`, `CadToggleButton`, `CadSplitButton`, `CadShortcutHint`, `CadMenu`, `CadMenuItem`, `CadMenuSeparator`, `CadOverflowMenu`, `CadMenuBar`, `CadSubmenu` |
| Precision input and style | `CadNumericInput`, `CadUnitInput`, `CadAngleInput`, `CadCoordinateInput`, `CadColorSwatch`, `CadLinetypePreview`, `CadLineweightPreview`, `CadColorPicker`, `CadColorPickerButton`, `CadLinetypePicker`, `CadLineweightPicker` |
| Drafting overlays | `CadDynamicInput`, `CadObjectSnapMenu`, `CadGripToolbar`, `CadConstraintBar`, `CadAnnotationScalePicker`, `CadViewPresetPicker`, `CadPolarTracker`, `CadObjectSnapMarker`, `CadSelectionGrip` |
| Viewport feedback and navigation | `CadViewCube`, `CadUcsIndicator`, `CadViewportControls`, `CadNavigationBar`, `CadMovableOverlay`, `CadVisualStylePicker`, `CadViewportScalePicker`, `CadSelectionSummary`, `CadMeasureReadout` |
| Inspector and catalog palettes | `CadFilterBar`, `CadPropertyGrid`, `CadPropertySection`, `CadPropertyRow`, `CadPropertyField`, `CadLayerPicker`, `CadLayerPanel`, `CadLayerRow`, `CadObjectTree`, `CadTaskProgress`, `CadReferenceList`, `CadBlockPalette`, `CadBlockTile`, `CadBlockInsertOptions`, `CadQuickProperties` |
| Data and selection | `CadDataGrid`, `CadSelectionFilter`, `CadSelectionCycler`, `CadSelectionSetPanel`, `CadSelectionSnapshot`, `CadSelectionRule`, `normalizeCadSelection`, `matchesCadSelection`, `useCadSelectionActions` |
| Dialogs and feedback | `CadDialog`, `CadConfirmDialog`, `CadToast`, `CadToastStack`, `CadPopover`, `CadTooltip`, `CadShortcutReference`, `CadCommandPrompt` |

All workspace components use the `.cad-*` CSS namespace and inherit the host
tokens such as `--cad-ui-accent`, `--cad-ui-text`, and
`--cad-ui-workspace-bg`. The default treatment is graphite and deliberate,
while applications can retain the package's existing cyber-HUD panel style.

## Modular workspace and CAD style models

`CadSplitPane` is an intentionally small, keyboard-accessible resizable
layout primitive rather than a docking manager. It keeps the workspace stable
while the host still owns panel placement and persistence.

```jsx
<CadSplitPane
  orientation="horizontal"
  defaultSize={24}
  primary={<CadBlockPalette blocks={blocks} onInsert={insertBlock} />}
  secondary={<DrawingViewport />}
  onSizeChange={(size) => savePaletteWidth(size)}
/>
```

The color picker uses a serializable CAD-friendly model, so a property can
represent `ByLayer`, `ByBlock` and explicit RGB values without UI-only state:

```js
{ mode: 'by-layer' }
{ mode: 'by-block' }
{ mode: 'rgb', value: '#ff0000', index: 1 }
```

Use a `CadPropertyField` type of `cad-color`, `linetype`, `lineweight`, or
`scale` to embed the matching picker in `CadPropertyGrid`.

## Model/layout strip

`CadDrawingSpaceTabs` is a dedicated CAD component, rather than an overloaded
segmented control. It matches the familiar Model / Layout / + workflow and
supports dirty documents, close buttons, horizontal overflow, context menus,
renaming and keyboard navigation.

```jsx
import { CadDrawingSpaceTabs } from '@szantoi/cad-cui-system';

<CadDrawingSpaceTabs
  activeId={activeSpaceId}
  onChange={(nextId) => setActiveSpaceId(nextId)}
  onCreate={() => createLayout()}
  onClose={(space) => closeLayout(space.id)}
  onContextMenu={(space, event) => openSpaceMenu(space, event.clientX, event.clientY)}
  items={[
    { id: 'model', label: 'Model', kind: 'model', pinned: true },
    { id: 'layout-1', label: 'Layout1', kind: 'layout', closable: true },
    { id: 'layout-2', label: 'Layout2', kind: 'layout', dirty: true, closable: true }
  ]}
/>
```

For applications that persist an entire workspace per tab (for example a
docking layout, viewport state or graph filters), use `CadWorkspaceProfileTabs`
and the profile helpers. The package only normalizes identities and tab
semantics; the host keeps its snapshots and decides how to restore them.

```jsx
import {
  CadWorkspaceProfileTabs,
  createCadWorkspaceProfile,
  removeCadWorkspaceProfile
} from '@szantoi/cad-cui-system';

<CadWorkspaceProfileTabs
  profiles={workspaceProfiles}
  activeId={activeProfileId}
  onChange={(id) => switchWorkspace(id)}
  onCreate={() => setWorkspaceProfiles(current => createCadWorkspaceProfile(current))}
  onClose={(id) => setWorkspaceState(current => removeCadWorkspaceProfile(current.profiles, id, current.activeId))}
/>
```

## A complete workspace composition

```jsx
import { useState } from 'react';
import {
  CadCommandLine,
  CadDrawingSpaceTabs,
  CadLayerPanel,
  CadPropertyGrid,
  CadStatusBar,
  CadToolPalette,
  CadViewportControls
} from '@szantoi/cad-cui-system';

function DrawingWorkspace() {
  const [commandHeight, setCommandHeight] = useState(144);

  return <main className="drawing-workspace">
    <CadToolPalette layout="auto" items={drawTools} onAction={(tool) => runTool(tool.id)} />
    <CadViewportControls onZoomExtents={zoomExtents} onViewChange={setView} />
    <CadLayerPanel layers={layers} activeLayerId={activeLayerId} onActiveLayerChange={setActiveLayerId} onLayerChange={updateLayer} />
    <CadPropertyGrid sections={propertySections} onValueChange={updateProperty} />
    <CadCommandLine
      height={commandHeight}
      minHeight={72}
      maxHeight={360}
      onHeightChange={setCommandHeight}
      onSubmit={runCommand}
      suggestions={commandSuggestions}
      history={commandHistory}
    />
    <CadDrawingSpaceTabs items={spaces} activeId={activeSpaceId} onChange={setActiveSpaceId} onCreate={createLayout} />
    <CadStatusBar coordinates={cursor} units="mm" scale="1:50" modes={draftingModes} onModeChange={toggleDraftingMode} />
  </main>;
}
```

### Panel-local responsive layouts

A dock can be narrow on a wide display, so responsive workspace controls react
to their own available inline size rather than only to the browser viewport.
Use the explicit layout modes for action-dense primitives; their interaction
semantics and accessible names remain unchanged.

```jsx
<CadToolPalette layout="auto" items={drawTools} />
<CadConstraintBar layout="auto" constraints={constraints} />
<CadStatusBar layout="tiles" coordinates={cursor} modes={draftingModes} />
<CadSelectionCycler layout="auto" candidates={selectionCandidates} />
<CadDataGrid layout="auto" columns={columns} rows={rows} />
```

`CadAnnotationScalePicker` keeps its label above the select by default for
panel forms. Use `layout="inline"` in dense Ribbon or titlebar chrome to keep
the same labelled native field on one compact row:

```jsx
<CadAnnotationScalePicker layout="inline" label="Scale" value={scale} onChange={setScale} />
```

`auto` lets tool, constraint, selection, and status controls wrap into usable
tiles as their dock narrows. `CadDataGrid layout="auto"` remains a conventional
table when space permits, then changes to labelled record cards below its own
narrow-panel threshold; `layout="cards"` requests that card presentation at
every width. Object snaps, layers, blocks, Quick Properties, selection filters,
and selection-set actions have built-in container-query adaptations: labels and
fields reflow, dense layer rows become stacked records, and action groups form
tiles. Long logs, command history, and Model/Layout strips retain deliberate
scrolling because hiding or compressing their sequential content would be less
usable than an explicit scroll region.

### Fixed-height command area

`CadCommandLine` is resizable by pointer or keyboard and accepts a controlled
pixel `height`, or `defaultHeight` for standalone use. `minHeight`,
`maxHeight`, `resizeStep`, and `onHeightChange` let the host keep the selected
command-area height. Command history and options scroll inside that area, so
new command rows do not consume Model Space. Set `resizable={false}` when the
host supplies its own dock resize control.

### Clean Screen focus mode

`CadWorkspaceFocusToggle` is a small controlled/uncontrolled trigger for a
host-owned focus boolean. It deliberately does not call the browser Fullscreen
API or install a document keyboard listener: the embedding application decides
which chrome to hide, how to preserve dock state, and when a shortcut is safe
to route.

```jsx
import { useState } from 'react';
import { CadWorkspaceFocusToggle } from '@szantoi/cad-cui-system';

function DrawingWorkspace() {
  const [focusMode, setFocusMode] = useState(false);

  return <>
    <CadWorkspaceFocusToggle
      active={focusMode}
      onActiveChange={setFocusMode}
      shortcut="Ctrl+0"
    />
    <main data-focus-mode={focusMode}>
      {/* Host CSS makes this Model Space fill the client area when focused. */}
    </main>
  </>;
}
```

The bundled playground uses the CAD-style Clean Screen convention: `Ctrl+0`
toggles focus and `Escape` exits it. Its host listener ignores text fields,
comboboxes and open dialogs, then restores the invoking control after exit.
The existing panel and command-dock modes remain unchanged while focus mode is
active.

### Dock visibility and dimensions

`CadWorkspaceDockModeControl` gives a dock the three durable CAD states
`open`, `rail`, and `closed`. `CadWorkspaceDockResizeHandle` controls one
pixel dimension; it is deliberately only a semantic separator, leaving CSS
Grid, Flexbox, a docking library, and persistence under host control.

```jsx
import { useState } from 'react';
import {
  CadWorkspaceDockModeControl,
  CadWorkspaceDockResizeHandle,
  CadWorkspaceDockRail,
  CadWorkspaceDockZone
} from '@szantoi/cad-cui-system';

function ToolsDock() {
  const [mode, setMode] = useState('open');
  const [width, setWidth] = useState(288);
  const [activePanelId, setActivePanelId] = useState('tools');
  const panels = [
    { id: 'tools', label: 'Tools', content: <ToolPalette /> },
    { id: 'layers', label: 'Layers', content: <LayerBrowser /> }
  ];
  const dock = <CadWorkspaceDockZone
    edge="left"
    label="Tools dock panels"
    panels={panels}
    activeId={activePanelId}
    onActiveChange={setActivePanelId}
  />;

  return <>
    <CadWorkspaceDockModeControl
      label="Tools panel"
      mode={mode}
      onModeChange={setMode}
    />
    {mode === 'open' && <CadWorkspaceDockResizeHandle
      edge="left"
      label="Tools panel"
      controls="tools-dock"
      size={width}
      minSize={192}
      maxSize={520}
      onSizeChange={setWidth}
    />}
    {mode === 'open' && <aside id="tools-dock">{dock}</aside>}
    {mode === 'rail' && <CadWorkspaceDockRail
      edge="left"
      label="Tools panel"
      onExpand={() => setMode('open')}
    >{dock}</CadWorkspaceDockRail>}
  </>;
}
```

`edge` describes the dock's anchored side, so a `right` or `bottom` dock grows
when its separator travels left or up. The separator supports pointer dragging,
the matching arrow keys, `Home`/`End`, and `PageUp`/`PageDown`. Keep the pixel
value when switching to `rail` or `closed`; reopening can then restore the
operator's chosen geometry.

`CadWorkspaceDockRail` keeps its preview open while the pointer or keyboard
focus remains anywhere in the rail/preview region. It closes on leaving that
shared region or `Escape`; its preview content remains mounted between short
peeks, so tab and form state is preserved. Clicking the label calls
`onExpand`, allowing the host to switch the durable dock mode to `open`.
Keep host CSS physically continuous at the label/preview boundary (the sandbox
uses a 1px overlap) so an operator never crosses a pointer-sized gap while
entering the preview.

Static rail children remain mounted by default. For an expensive inspector or
graph panel, pass a `renderPreview` function (or a function child) to mount it
only while the rail is active, or request the same behaviour for static
children with `previewMount="when-open"`. The render callback receives
`active`, `peekOpen`, `edge`, `label`, `previewId`, `controls`, and `disabled`.
`CadWorkspaceDockZone` places multiple panels in a conventional accessible
tab strip for `left`, `right`, or `bottom` dock edges without imposing a
docking engine or persistence policy. Pass `compactTabs` when a dense CAD dock
should show each panel's larger icon without repeating its full caption. A
panel can provide `tabLabel` (or `shortLabel`) for that compact caption; its
regular `label` remains the accessible tab name and `title`. Do not use an
ordinary count as a dock-tab status badge: pass
`attention: { tone: 'warning' | 'danger', label: '…' }` only when the operator
needs to act. It adds a small high-signal indicator and the warning/danger text
to the accessible tab name. Close buttons are opt-in too: a
`CadWorkspaceDockZone` shows them only when its host explicitly supplies
`onPanelClose`.

### Titlebar workspace chrome

`CadWorkspaceChromeControls` is a compact, icon-first group for host-owned
workspace actions such as Focus Mode and left/bottom/right dock toggles. It
does not implement docking, persistence, or shortcut routing; each item is a
declarative record with an accessible label, optional active/mode state, and
an `onClick` callback.

`CadMenuBar` accepts an `endSlot` and `endSlotLabel` so this group can sit at
the visual right of File / Edit / View without becoming part of the ARIA
`menubar`. That keeps menu arrow-key navigation scoped to menus and leaves
titlebar controls as ordinary buttons.

```jsx
<CadMenuBar
  items={appMenus}
  endSlotLabel="Workspace layout controls"
  endSlot={<CadWorkspaceChromeControls
    label="Quick workspace controls"
    items={[
      { id: 'focus', label: 'Enter Focus Mode', icon: '⌖', onClick: enterFocus },
      { id: 'tools', label: 'Toggle Tools panel', icon: '◧', active: toolsOpen, onClick: toggleTools },
      { id: 'command', label: 'Toggle Command bar', icon: '▱', active: commandOpen, onClick: toggleCommand }
    ]}
  />}
/>
```

For three-state docks, expose explicit `Open`, `Rail`, and `Hide` choices in a
secondary layout popover or command rather than silently cycling an icon
button through the states. The playground follows this pattern: its compact
header toggles panels open/hidden, while its Workspace layout popover makes
the durable Rail choice and reset action explicit.

## Interactive playground

The repository includes an engine-free, interactive CAD workspace sandbox. It
uses controlled React state to demonstrate the component contracts: a drawing
surface is deliberately only an SVG mockup, while tabs, split panes, drafting
modes, inspectors, style pickers, block insertion, dialogs, event logging and
tables are all usable. Its `WORKSPACE / PANELS` Ribbon command manages the
fourteen standalone panels listed above, including their visibility and
left/right/bottom placement; its large-list search filters panel names,
descriptions, visibility and dock placement. **WORKSPACE / PRESETS** adds
named save/load, overwrite, delete and JSON import/export for durable UI
arrangements, with a guided first save when the local list is empty; the
current arrangement is restored from browser `localStorage` on the next visit.
Its compact scale chrome is profile-aware: Model Space exposes annotation
scale, while a Layout exposes paper-space viewport scale, so two similar
ratios never compete in the same dense header.

```bash
npm install
npm run demo
```

Open the local URL printed by Vite (normally `http://127.0.0.1:4173`). This is
a development aid for the cloned repository; consuming applications should
compose the exported components with their own CAD engine and renderer.

For a production-style sandbox bundle, run `npm run demo:build`.

## Verification

```bash
npm run check
npm run typecheck
npm run test:coverage
npm run check:package
```

The source, playground, and tests are TypeScript (`.ts` / `.tsx`). `npm run
typecheck` validates all three, while `npm run build` also emits the published
`.d.ts` declarations to `dist/`. The deliberately host-extensible component
props are represented by the exported `CadAnyProps` compatibility type and can
be narrowed incrementally without breaking integrations.

`npm run check` combines linting, TypeScript validation, the full test suite,
library and demo builds, and a whitespace diff check. `test:coverage` writes V8
coverage reports to the ignored `coverage/` directory. GitHub Actions runs the
same quality gates on pushes and pull requests, including a check that committed
`dist/` is current.
