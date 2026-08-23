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
import { useState } from 'react';
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
- `onCommand(command, context, event)` emits the original command record;
  `context` includes the active tab, group and `source: 'workspace-ribbon'`.
- `renderIcon(command, context)` and `renderCommand(command, context)` are
  escape hatches for host icon libraries and exceptional commands. The latter
  receives `context.execute` and accessible `context.buttonProps`.
- `identity`, `renderIdentity`, `status`, `renderStatus`, `endSlot`, and
  `renderMinimizeControl` are slots rather than application-specific props.

## Engine-free viewport context

`CadNavigationBar`, `CadVisualStylePicker`, `CadViewportScalePicker`, and
`CadSelectionSetPanel` are deliberately UI-only. They expose controlled or
uncontrolled values and report serializable user intent; pan, zoom, rendering,
selection storage and named-set management stay in the host application.

```jsx
<CadNavigationBar
  activeId={navigationMode}
  onActiveChange={setNavigationMode}
  onZoomIn={() => setViewportZoom(zoom => zoom + 0.1)}
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
| Drawing workspace | `CadSplitPane`, `CadDrawingSpaceTabs` (`CadLayoutTabs` / `CadDocumentTabs` aliases), `CadWorkspaceProfileTabs`, workspace-profile helpers, `CadDockTabs`, `CadDockPanel`, `CadStatusBar`, `CadStatusToggle`, `CadCommandLine`, `CadCommandHistory`, `CadCommandOptions` |
| Tools and menus | `CadWorkspaceRibbon`, `groupCadWorkspaceRibbonCommands`, `CadToolbar`, `CadToolbarGroup`, `CadToolPalette`, `CadToolButton`, `CadToggleButton`, `CadSplitButton`, `CadShortcutHint`, `CadMenu`, `CadMenuItem`, `CadMenuSeparator`, `CadOverflowMenu`, `CadMenuBar`, `CadSubmenu` |
| Precision input and style | `CadNumericInput`, `CadUnitInput`, `CadAngleInput`, `CadCoordinateInput`, `CadColorSwatch`, `CadLinetypePreview`, `CadLineweightPreview`, `CadColorPicker`, `CadColorPickerButton`, `CadLinetypePicker`, `CadLineweightPicker` |
| Drafting overlays | `CadDynamicInput`, `CadObjectSnapMenu`, `CadGripToolbar`, `CadConstraintBar`, `CadAnnotationScalePicker`, `CadViewPresetPicker`, `CadPolarTracker`, `CadObjectSnapMarker`, `CadSelectionGrip` |
| Viewport feedback and navigation | `CadViewCube`, `CadUcsIndicator`, `CadViewportControls`, `CadNavigationBar`, `CadVisualStylePicker`, `CadViewportScalePicker`, `CadSelectionSummary`, `CadMeasureReadout` |
| Inspector and catalog palettes | `CadFilterBar`, `CadPropertyGrid`, `CadPropertySection`, `CadPropertyRow`, `CadPropertyField`, `CadLayerPicker`, `CadLayerPanel`, `CadLayerRow`, `CadObjectTree`, `CadTaskProgress`, `CadReferenceList`, `CadBlockPalette`, `CadBlockTile`, `CadBlockInsertOptions`, `CadQuickProperties` |
| Data and selection | `CadDataGrid`, `CadSelectionFilter`, `CadSelectionCycler`, `CadSelectionSetPanel` |
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
  return <main className="drawing-workspace">
    <CadToolPalette items={drawTools} onAction={(tool) => runTool(tool.id)} />
    <CadViewportControls onZoomExtents={zoomExtents} onViewChange={setView} />
    <CadLayerPanel layers={layers} activeLayerId={activeLayerId} onActiveLayerChange={setActiveLayerId} onLayerChange={updateLayer} />
    <CadPropertyGrid sections={propertySections} onValueChange={updateProperty} />
    <CadCommandLine onSubmit={runCommand} suggestions={commandSuggestions} history={commandHistory} />
    <CadDrawingSpaceTabs items={spaces} activeId={activeSpaceId} onChange={setActiveSpaceId} onCreate={createLayout} />
    <CadStatusBar coordinates={cursor} units="mm" scale="1:50" modes={draftingModes} onModeChange={toggleDraftingMode} />
  </main>;
}
```

## Interactive playground

The repository includes an engine-free, interactive CAD workspace sandbox. It
uses controlled React state to demonstrate the component contracts: a drawing
surface is deliberately only an SVG mockup, while tabs, split panes, drafting
modes, inspectors, style pickers, block insertion, dialogs, notifications and
tables are all usable.

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
npm test
npm run build
npm pack --dry-run
```

The package checks its built `dist/` artifacts into source control, so run the
build after making source changes before publishing or consuming the local
package.
