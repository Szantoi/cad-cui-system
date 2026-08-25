import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { CadAnyProps } from '../../src/cad-types';
import {
  CadAnnotationScalePicker,
  CadBlockInsertOptions,
  CadBlockPalette,
  CadColorPickerButton,
  CadCommandLine,
  CadConfirmDialog,
  CadConstraintBar,
  CadContextMenuPopup,
  CadRadialMenu,
  CadDataGrid,
  CadDialog,
  CadDockPanel,
  CadGripToolbar,
  CadLayerPanel,
  CadLineweightPicker,
  CadLinetypePicker,
  CadMeasureReadout,
  CadMenuBar,
  CadMovableOverlay,
  CadNavigationBar,
  CadObjectSnapMarker,
  CadObjectSnapMenu,
  CadPolarTracker,
  CadPopover,
  CadQuickProperties,
  CadSelectionCycler,
  CadSelectionFilter,
  CadSelectionGrip,
  CadSelectionSetPanel,
  CadSelectionSummary,
  CadShortcutReference,
  CadStatusBar,
  CadToolPalette,
  CadTooltip,
  CadViewportControls,
  CadViewportScalePicker,
  CadWorkspaceChromeControls,
  CAD_WORKSPACE_MODEL_ID,
  CadWorkspaceFocusToggle,
  CadWorkspaceDockModeControl,
  CadWorkspaceDockResizeHandle,
  CadWorkspaceDockRail,
  CadWorkspaceDockZone,
  CadWorkspacePanelManager,
  CadWorkspacePresetManager,
  CadVisualStylePicker,
  CadWorkspaceRibbon,
  CadWorkspaceProfileTabs,
  createCadWorkspacePresetSnapshot,
  createCadWorkspaceProfile,
  defineCadCuiSystem,
  exportCadWorkspacePreset,
  groupCadWorkspacePanelsByDockZone,
  importCadWorkspacePreset,
  normalizeCadWorkspacePanelPreferences,
  normalizeCadWorkspaceProfiles,
  removeCadWorkspaceProfile,
  selectCadCuiCommands,
  shouldHandleCadShortcut
} from '../../src/entry';
import './playground.css';

const INITIAL_PROFILES = [
  { id: CAD_WORKSPACE_MODEL_ID, name: 'Model', system: true },
  { id: 'layout-1', name: 'Layout1', dirty: true },
  { id: 'layout-2', name: 'Layout2' }
];

const INITIAL_LAYERS = [
  { id: 'wall', label: 'A-WALL', color: '#73d7ff', linetype: 'continuous', lineweight: 0.35, visible: true },
  { id: 'door', label: 'A-DOOR', color: '#ffc261', linetype: 'continuous', lineweight: 0.25, visible: true },
  { id: 'dimension', label: 'A-DIM', color: '#ef97ff', linetype: 'dashed', lineweight: 0.18, visible: true },
  { id: 'reference', label: 'X-REF', color: '#9aa8b2', linetype: 'dotted', lineweight: 0.13, visible: true, locked: true }
];

const BLOCKS = [
  { id: 'door-900', label: 'Door 900', category: 'Architecture' },
  { id: 'window-1200', label: 'Window 1200', category: 'Architecture' },
  { id: 'desk-1600', label: 'Desk 1600', category: 'Furniture' },
  { id: 'north-arrow', label: 'North arrow', category: 'Annotation' },
  { id: 'section-marker', label: 'Section marker', category: 'Annotation' },
  { id: 'plant-01', label: 'Plant 01', category: 'Furniture' }
];

const OBJECT_ROWS = [
  { id: 'line-01', entity: 'Line', layer: 'A-WALL', length: '4200 mm', status: 'Selected' },
  { id: 'arc-02', entity: 'Arc', layer: 'A-DOOR', length: '1414 mm', status: 'Ready' },
  { id: 'block-03', entity: 'Block reference', layer: 'A-FURN', length: '—', status: 'Ready' },
  { id: 'dim-04', entity: 'Aligned dimension', layer: 'A-DIM', length: '2400 mm', status: 'Locked' }
];

// The drawing engine never enters the UI library. The host exposes only the
// selection capabilities needed for command availability.
const OBJECT_SELECTION_METADATA = Object.freeze({
  'line-01': { entityType: 'line', traits: ['editable', 'curve', 'planar'] },
  'arc-02': { entityType: 'arc', traits: ['editable', 'curve', 'planar'] },
  'block-03': { entityType: 'block', traits: ['editable', 'transformable', 'block'] },
  'dim-04': { entityType: 'dimension', traits: ['locked', 'annotation'] }
});

const SELECTION_ACTION_GLYPHS = Object.freeze({
  'selection.move': '↗',
  'selection.copy': '⧉',
  'selection.trim': '✂',
  'selection.offset': '⇆',
  'selection.rotate': '⟳',
  'selection.explode': '⊞',
  'selection.edit-block': '✎',
  'selection.edit-dimension': '↕',
  'selection.properties': '▤',
  'selection.delete': '⌫'
});

// CAD aliases remain useful in the command line even when the same action has
// a one-key desktop shortcut. They deliberately stay host-side: the registry
// only describes commands, while the host decides how textual input is parsed.
const SELECTION_ACTION_ALIASES = Object.freeze({
  'selection.move': ['m', 'move'],
  'selection.copy': ['co', 'copy'],
  'selection.trim': ['tr', 'trim'],
  'selection.offset': ['o', 'offset'],
  'selection.rotate': ['r', 'rotate'],
  'selection.explode': ['x', 'explode'],
  'selection.edit-block': ['be', 'editblock', 'edit block'],
  'selection.edit-dimension': ['dde', 'editdim', 'edit dimension'],
  'selection.properties': ['pr', 'prop', 'properties'],
  'selection.delete': ['del', 'delete', 'erase']
});

const normaliseCadAlias = value => String(value || '').trim().toLocaleLowerCase('en').replace(/\s+/g, ' ');
const selectionActionForAlias = (commands, input) => {
  const alias = normaliseCadAlias(String(input || '').split(':', 1)[0]);
  if (!alias) return null;
  return commands.find(command => [
    ...(SELECTION_ACTION_ALIASES[command?.id] || []),
    command?.intent?.action,
    command?.label,
    command?.shortcut
  ].some(candidate => normaliseCadAlias(candidate) === alias)) || null;
};

// One serializable registry powers the contextual ribbon group, viewport
// toolbar, right-click menu and keyboard resolver. A real host can reuse it
// with CadCuiProvider too.
const DEMO_SELECTION_ACTIONS = defineCadCuiSystem({
  id: 'playground-selection-actions',
  commands: [
    { id: 'selection.move', label: 'MOVE', detail: 'Move the current selection', shortcut: 'M', tone: 'cyan', intent: { type: 'selection.action', action: 'move' }, selection: { count: 'any', traits: ['editable'] }, placements: [{ surface: 'selection-toolbar', order: 10 }, { surface: 'ribbon', tab: 'home', group: 'SELECTION', order: 10 }, { surface: 'context', menu: 'selection', order: 10 }] },
    { id: 'selection.copy', label: 'COPY', detail: 'Copy the current selection', shortcut: 'Ctrl+C', tone: 'cyan', intent: { type: 'selection.action', action: 'copy' }, selection: { count: 'any', traits: ['editable'] }, placements: [{ surface: 'selection-toolbar', order: 20 }, { surface: 'ribbon', tab: 'home', group: 'SELECTION', order: 20 }, { surface: 'context', menu: 'selection', order: 20 }] },
    { id: 'selection.trim', label: 'TRIM', detail: 'Trim selected curves', shortcut: 'TR', tone: 'cyan', intent: { type: 'selection.action', action: 'trim' }, selection: { count: 'any', entityTypes: ['line', 'arc'], typeMatch: 'all', traits: ['editable'] }, placements: [{ surface: 'selection-toolbar', order: 30 }, { surface: 'ribbon', tab: 'home', group: 'SELECTION', order: 30 }, { surface: 'context', menu: 'selection', order: 30 }] },
    { id: 'selection.offset', label: 'OFFSET', detail: 'Offset selected curves', shortcut: 'O', tone: 'cyan', intent: { type: 'selection.action', action: 'offset' }, selection: { count: 'any', entityTypes: ['line', 'arc'], typeMatch: 'all', traits: ['editable'] }, placements: [{ surface: 'selection-toolbar', order: 40 }, { surface: 'ribbon', tab: 'home', group: 'SELECTION', order: 40 }, { surface: 'context', menu: 'selection', order: 40 }] },
    { id: 'selection.rotate', label: 'ROTATE', detail: 'Rotate selected blocks', shortcut: 'R', tone: 'cyan', intent: { type: 'selection.action', action: 'rotate' }, selection: { count: 'any', entityTypes: ['block'], typeMatch: 'all', traits: ['editable'] }, placements: [{ surface: 'selection-toolbar', order: 30 }, { surface: 'ribbon', tab: 'home', group: 'SELECTION', order: 30 }, { surface: 'context', menu: 'selection', order: 30 }] },
    { id: 'selection.explode', label: 'EXPLODE', detail: 'Explode one block reference', shortcut: 'X', tone: 'cyan', intent: { type: 'selection.action', action: 'explode' }, selection: { count: 'one', entityTypes: ['block'], traits: ['editable'] }, placements: [{ surface: 'selection-toolbar', order: 40 }, { surface: 'ribbon', tab: 'home', group: 'SELECTION', order: 40 }, { surface: 'context', menu: 'selection', order: 40 }] },
    { id: 'selection.edit-block', label: 'EDIT BLOCK', detail: 'Edit the selected block definition', shortcut: 'BE', tone: 'cyan', intent: { type: 'selection.action', action: 'edit-block' }, selection: { count: 'one', entityTypes: ['block'], traits: ['editable'] }, placements: [{ surface: 'ribbon', tab: 'home', group: 'SELECTION', order: 50 }, { surface: 'context', menu: 'selection', order: 50 }] },
    { id: 'selection.edit-dimension', label: 'EDIT DIM', detail: 'Edit the selected dimension', shortcut: 'DDE', tone: 'cyan', intent: { type: 'selection.action', action: 'edit-dimension' }, selection: { count: 'one', entityTypes: ['dimension'], traits: ['editable'] }, placements: [{ surface: 'selection-toolbar', order: 30 }, { surface: 'ribbon', tab: 'home', group: 'SELECTION', order: 30 }, { surface: 'context', menu: 'selection', order: 30 }] },
    { id: 'selection.properties', label: 'PROPERTIES', detail: 'Inspect the selection properties', shortcut: 'Ctrl+1', tone: 'cyan', intent: { type: 'selection.action', action: 'properties' }, selection: { count: 'any' }, placements: [{ surface: 'selection-toolbar', order: 60 }, { surface: 'ribbon', tab: 'home', group: 'SELECTION', order: 60 }, { surface: 'context', menu: 'selection', order: 60 }] },
    { id: 'selection.delete', label: 'DELETE', detail: 'Delete the current selection', shortcut: 'Delete', tone: 'danger', intent: { type: 'selection.action', action: 'delete' }, selection: { count: 'any', traits: ['editable'] }, placements: [{ surface: 'ribbon', tab: 'home', group: 'SELECTION', order: 70 }, { surface: 'context', menu: 'selection', order: 70 }] }
  ]
});

const INITIAL_SELECTION_SETS = [
  { id: 'primary-shell', label: 'Primary shell', description: 'External walls and core', group: 'Architecture', count: 18 },
  { id: 'openings', label: 'Doors + windows', description: 'Openings in the active floor', group: 'Architecture', count: 12 },
  { id: 'annotations', label: 'Dimension review', description: 'Dimensions and markers', group: 'Annotation', count: 9 },
  { id: 'xref-review', label: 'XREF review', description: 'Protected reference geometry', group: 'Reference', count: 4, locked: true }
];

const VIEWPORT_SCALE_FACTORS = {
  '1:1': 1.14,
  '1:2': 1.1,
  '1:4': 1.07,
  '1:5': 1.05,
  '1:10': 1.03,
  '1:20': 1.01,
  '1:25': 1,
  '1:50': 0.97,
  '1:100': 0.91
};

const SHORTCUTS = [
  { id: 'line', group: 'Draw', label: 'Line', shortcut: 'L' },
  { id: 'circle', group: 'Draw', label: 'Circle', shortcut: 'C' },
  { id: 'move', group: 'Modify', label: 'Move', shortcut: 'M' },
  { id: 'selection-menu', group: 'Selection', label: 'Selection menu', shortcut: 'Shift+F10' },
  { id: 'selection-radial', group: 'Selection', label: 'Selection radial menu', shortcut: 'Q' },
  { id: 'properties', group: 'Workspace', label: 'Properties', shortcut: 'Ctrl+1' },
  { id: 'palette', group: 'Workspace', label: 'Command palette', shortcut: 'Ctrl+P' }
];

const formatPoint = point => `${point.x ?? 0}, ${point.y ?? 0}, ${point.z ?? 0}`;
const parseCadPointArgument = command => {
  const source = String(command ?? '');
  const separator = source.indexOf(':');
  if (separator < 1) return null;
  const coordinates = source.slice(separator + 1).split(',').map(value => Number(value.trim()));
  if ((coordinates.length !== 2 && coordinates.length !== 3) || coordinates.some(value => !Number.isFinite(value))) return null;
  return { x: coordinates[0], y: coordinates[1], z: coordinates[2] ?? 0 };
};

const DEFAULT_DOCK_LAYOUT = Object.freeze({
  leftWidth: 288,
  rightWidth: 352,
  bottomHeight: 248
});

const DEFAULT_VIEWPORT_NAVIGATION_OVERLAY = Object.freeze({
  position: Object.freeze({ x: 0, y: 0 }),
  collapsed: false
});

const DEFAULT_VIEWPORT_SELECTION_SUMMARY_OVERLAY = Object.freeze({
  position: Object.freeze({ x: 0, y: 0 }),
  collapsed: false
});

const DEFAULT_VIEWPORT_DYNAMIC_INPUT_OVERLAY = Object.freeze({
  position: Object.freeze({ x: 0, y: 0 }),
  collapsed: false
});

const DEFAULT_VIEW_CUBE = Object.freeze({
  collapsed: false
});

const DOCK_SIZE_LIMITS = Object.freeze({
  left: { min: 192, max: 520 },
  right: { min: 256, max: 620 },
  bottom: { min: 176, max: 560 }
});

const WORKSPACE_PANEL_DOCK_ZONES = Object.freeze(['left', 'right', 'bottom']);

const ToolPalettePanelIcon = () => <span aria-hidden="true">▦</span>;
const ObjectSnapsPanelIcon = () => <span aria-hidden="true">⌖</span>;
const ConstraintsPanelIcon = () => <span aria-hidden="true">⟂</span>;
const LayersPanelIcon = () => <span aria-hidden="true">☷</span>;
const PropertiesPanelIcon = () => <span aria-hidden="true">▤</span>;
const BlocksPanelIcon = () => <span aria-hidden="true">⊞</span>;
const ObjectDataPanelIcon = () => <span aria-hidden="true">▦</span>;
const SelectionPanelIcon = () => <span aria-hidden="true">◇</span>;
const SelectionSetsPanelIcon = () => <span aria-hidden="true">◫</span>;
const ViewScalePanelIcon = () => <span aria-hidden="true">◈</span>;
const CommandPanelIcon = () => <span aria-hidden="true">⌨</span>;
const ActivityPanelIcon = () => <span aria-hidden="true">◷</span>;
const LayoutsPanelIcon = () => <span aria-hidden="true">▱</span>;
const DraftingModesPanelIcon = () => <span aria-hidden="true">∠</span>;

const WORKSPACE_PANEL_DECLARATIONS = Object.freeze([
  {
    id: 'tool-palette',
    label: 'Tool Palette',
    description: 'Draw and modify commands',
    icon: ToolPalettePanelIcon,
    tabLabel: '',
    defaultOpen: true,
    defaultPlacement: 'dock',
    defaultDockZone: 'left',
    dockZones: WORKSPACE_PANEL_DOCK_ZONES,
    floatable: false
  },
  {
    id: 'object-snaps',
    label: 'Object Snaps',
    description: 'Precision snap filters',
    icon: ObjectSnapsPanelIcon,
    tabLabel: '',
    defaultOpen: true,
    defaultPlacement: 'dock',
    defaultDockZone: 'left',
    dockZones: WORKSPACE_PANEL_DOCK_ZONES,
    floatable: false
  },
  {
    id: 'constraints',
    label: 'Constraints',
    description: 'Geometric constraint modes',
    icon: ConstraintsPanelIcon,
    tabLabel: '',
    defaultOpen: true,
    defaultPlacement: 'dock',
    defaultDockZone: 'left',
    dockZones: WORKSPACE_PANEL_DOCK_ZONES,
    floatable: false
  },
  {
    id: 'layers',
    label: 'Layers',
    description: 'Current drawing layer controls',
    icon: LayersPanelIcon,
    tabLabel: '',
    defaultOpen: true,
    defaultPlacement: 'dock',
    defaultDockZone: 'left',
    dockZones: WORKSPACE_PANEL_DOCK_ZONES,
    floatable: false
  },
  {
    id: 'properties',
    label: 'Properties',
    description: 'Current object properties',
    icon: PropertiesPanelIcon,
    tabLabel: '',
    defaultOpen: true,
    defaultPlacement: 'dock',
    defaultDockZone: 'right',
    dockZones: WORKSPACE_PANEL_DOCK_ZONES,
    floatable: false
  },
  {
    id: 'blocks',
    label: 'Blocks',
    description: 'Block library and insertion',
    icon: BlocksPanelIcon,
    tabLabel: '',
    defaultOpen: true,
    defaultPlacement: 'dock',
    defaultDockZone: 'right',
    dockZones: WORKSPACE_PANEL_DOCK_ZONES,
    floatable: false
  },
  {
    id: 'object-data',
    label: 'Object Data',
    description: 'Extracted drawing object data',
    icon: ObjectDataPanelIcon,
    tabLabel: '',
    defaultOpen: true,
    defaultPlacement: 'dock',
    defaultDockZone: 'right',
    dockZones: WORKSPACE_PANEL_DOCK_ZONES,
    floatable: false
  },
  {
    id: 'selection',
    label: 'Selection',
    description: 'Filter, inspect and cycle selection',
    icon: SelectionPanelIcon,
    tabLabel: '',
    defaultOpen: true,
    defaultPlacement: 'dock',
    defaultDockZone: 'right',
    dockZones: WORKSPACE_PANEL_DOCK_ZONES,
    floatable: false
  },
  {
    id: 'selection-sets',
    label: 'Selection Sets',
    description: 'Named drawing selections',
    icon: SelectionSetsPanelIcon,
    tabLabel: '',
    defaultOpen: true,
    defaultPlacement: 'dock',
    defaultDockZone: 'right',
    dockZones: WORKSPACE_PANEL_DOCK_ZONES,
    floatable: false
  },
  {
    id: 'view-scale',
    label: 'View / Scale',
    description: 'Viewport display and annotation scale',
    icon: ViewScalePanelIcon,
    tabLabel: '',
    defaultOpen: true,
    defaultPlacement: 'dock',
    defaultDockZone: 'right',
    dockZones: WORKSPACE_PANEL_DOCK_ZONES,
    floatable: false
  },
  {
    id: 'command',
    label: 'Command',
    description: 'Command line and history',
    icon: CommandPanelIcon,
    tabLabel: '',
    defaultOpen: true,
    defaultPlacement: 'dock',
    defaultDockZone: 'bottom',
    dockZones: WORKSPACE_PANEL_DOCK_ZONES,
    floatable: false
  },
  {
    id: 'activity',
    label: 'Activity',
    description: 'Host and command event log',
    icon: ActivityPanelIcon,
    tabLabel: '',
    defaultOpen: true,
    defaultPlacement: 'dock',
    defaultDockZone: 'bottom',
    dockZones: WORKSPACE_PANEL_DOCK_ZONES,
    floatable: false
  },
  {
    id: 'layouts',
    label: 'Layouts',
    description: 'Model and layout tabs',
    icon: LayoutsPanelIcon,
    tabLabel: '',
    defaultOpen: true,
    defaultPlacement: 'dock',
    defaultDockZone: 'bottom',
    dockZones: WORKSPACE_PANEL_DOCK_ZONES,
    floatable: false
  },
  {
    id: 'drafting-modes',
    label: 'Drafting Modes',
    description: 'Grid, snap, ortho, polar and object snaps',
    icon: DraftingModesPanelIcon,
    tabLabel: '',
    defaultOpen: true,
    defaultPlacement: 'dock',
    defaultDockZone: 'bottom',
    dockZones: WORKSPACE_PANEL_DOCK_ZONES,
    floatable: false
  }
]);

const INITIAL_WORKSPACE_PANEL_PREFERENCES = Object.freeze({
  'tool-palette': { open: true, placement: 'dock', dockZone: 'left' },
  'object-snaps': { open: true, placement: 'dock', dockZone: 'left' },
  constraints: { open: true, placement: 'dock', dockZone: 'left' },
  layers: { open: true, placement: 'dock', dockZone: 'left' },
  properties: { open: true, placement: 'dock', dockZone: 'right' },
  blocks: { open: true, placement: 'dock', dockZone: 'right' },
  'object-data': { open: true, placement: 'dock', dockZone: 'right' },
  selection: { open: true, placement: 'dock', dockZone: 'right' },
  'selection-sets': { open: true, placement: 'dock', dockZone: 'right' },
  'view-scale': { open: true, placement: 'dock', dockZone: 'right' },
  command: { open: true, placement: 'dock', dockZone: 'bottom' },
  activity: { open: true, placement: 'dock', dockZone: 'bottom' },
  layouts: { open: true, placement: 'dock', dockZone: 'bottom' },
  'drafting-modes': { open: true, placement: 'dock', dockZone: 'bottom' }
});

const DEFAULT_DRAFTING = Object.freeze({ grid: true, snap: true, ortho: false, polar: true, osnap: true });
const DEFAULT_PROPERTY_STATE = Object.freeze({
  layer: 'wall',
  color: { mode: 'by-layer' },
  linetype: 'continuous',
  lineweight: '0.35',
  annotationScale: '1:50',
  length: 4200,
  locked: false
});
const DEFAULT_INSERT_OPTIONS = Object.freeze({ scale: 1, rotation: 0, uniform: true, specifyOnScreen: true, explode: false });
const COMMAND_LINE_HEIGHT_LIMITS = Object.freeze({ min: 72, max: 360 });
const WORKSPACE_PRESET_STORAGE_KEY = 'cad-cui-system:playground:workspace-presets:v1';
const WORKSPACE_CURRENT_WORKSPACE_STORAGE_KEY = 'cad-cui-system:playground:current-workspace:v1';
const WORKSPACE_PRESET_CATALOG_VERSION = 1;
const WORKSPACE_PRESET_MAX_COUNT = 16;
const WORKSPACE_PRESET_OPTIONS = Object.freeze({
  panels: WORKSPACE_PANEL_DECLARATIONS,
  normalizePanelPreferences: normalizeCadWorkspacePanelPreferences,
  defaultName: 'Workspace'
});

const text = value => String(value ?? '').trim();
const isRecord = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const uniqueValues = values => [...new Set(values)];
const validValue = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;
const finiteValue = (value, fallback, min = -Infinity, max = Infinity) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(min, Math.min(max, numeric)) : fallback;
};
const normalizeMovableOverlayLayout = (value, defaults) => {
  const overlay = isRecord(value) ? value : {};
  const position = isRecord(overlay.position) ? overlay.position : {};
  return {
    position: {
      x: finiteValue(position.x, defaults.position.x, -10000, 10000),
      y: finiteValue(position.y, defaults.position.y, -10000, 10000)
    },
    collapsed: typeof overlay.collapsed === 'boolean' ? overlay.collapsed : defaults.collapsed
  };
};
const selectedValues = (value, allowed, fallback) => Array.isArray(value)
  ? uniqueValues(value.filter(candidate => allowed.includes(candidate)))
  : fallback;
const normalizedBooleanRecord = (value, defaults) => Object.keys(defaults).reduce((result, key) => {
  result[key] = typeof value?.[key] === 'boolean' ? value[key] : defaults[key];
  return result;
}, {});
const workspacePresetSlug = value => text(value)
  .toLocaleLowerCase()
  .replace(/[^a-z0-9._-]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 64) || 'workspace';

const workspacePresetId = (name, presets = []) => {
  const usedIds = new Set(presets.map(preset => text(preset?.id)).filter(Boolean));
  const base = workspacePresetSlug(name);
  let id = base;
  let suffix = 2;
  while (usedIds.has(id)) {
    id = `${base}-${suffix}`.slice(0, 80);
    suffix += 1;
  }
  return id;
};

const workspacePresetName = (name, presets = []) => {
  const base = text(name).replace(/\s+/g, ' ').slice(0, 64) || 'Workspace';
  const usedNames = new Set(presets.map(preset => text(preset?.name).toLocaleLowerCase()).filter(Boolean));
  if (!usedNames.has(base.toLocaleLowerCase())) return base;
  let suffix = 2;
  let candidate = base;
  while (usedNames.has(candidate.toLocaleLowerCase())) {
    candidate = `${base.slice(0, Math.max(1, 61 - String(suffix).length))} (${suffix})`;
    suffix += 1;
  }
  return candidate;
};

const readWorkspaceStorage = key => {
  if (typeof window === 'undefined') return '';
  try {
    const storage = window.localStorage;
    return storage ? storage.getItem(key) || '' : '';
  } catch {
    return '';
  }
};

const writeWorkspaceStorage = (key, value) => {
  if (typeof window === 'undefined') return false;
  try {
    const storage = window.localStorage;
    if (!storage) return false;
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const normalizeWorkspacePresetCatalog = value => {
  const candidates = Array.isArray(value) ? value : Array.isArray(value?.presets) ? value.presets : [];
  const usedIds = new Set();
  return candidates.reduce((presets, candidate, index) => {
    const imported = importCadWorkspacePreset(candidate, WORKSPACE_PRESET_OPTIONS);
    if (!imported.ok || presets.length >= WORKSPACE_PRESET_MAX_COUNT) return presets;

    const source = imported.preset;
    const baseId = text(source.id) || `preset-${index + 1}`;
    let id = baseId;
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${baseId}-${suffix}`.slice(0, 80);
      suffix += 1;
    }
    usedIds.add(id);
    presets.push({ ...source, id });
    return presets;
  }, []);
};

const loadWorkspacePresetCatalog = () => {
  const raw = readWorkspaceStorage(WORKSPACE_PRESET_STORAGE_KEY);
  if (!raw) return [];
  try {
    return normalizeWorkspacePresetCatalog(JSON.parse(raw));
  } catch {
    return [];
  }
};

const persistWorkspacePresetCatalog = presets => {
  const normalized = normalizeWorkspacePresetCatalog(presets);
  return writeWorkspaceStorage(WORKSPACE_PRESET_STORAGE_KEY, JSON.stringify({
    version: WORKSPACE_PRESET_CATALOG_VERSION,
    presets: normalized
  }));
};

const loadCurrentWorkspacePreset = () => {
  const raw = readWorkspaceStorage(WORKSPACE_CURRENT_WORKSPACE_STORAGE_KEY);
  if (!raw) return undefined;
  const imported = importCadWorkspacePreset(raw, WORKSPACE_PRESET_OPTIONS);
  return imported.ok ? imported.preset : undefined;
};

const persistCurrentWorkspacePreset = preset => {
  const exported = exportCadWorkspacePreset(preset, WORKSPACE_PRESET_OPTIONS);
  return exported.ok && writeWorkspaceStorage(WORKSPACE_CURRENT_WORKSPACE_STORAGE_KEY, exported.json);
};

const downloadWorkspacePreset = (name, json) => {
  if (typeof document === 'undefined' || typeof window === 'undefined' || typeof Blob === 'undefined' || typeof window.URL?.createObjectURL !== 'function') return false;
  const url = window.URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${workspacePresetSlug(name)}.cad-workspace.json`;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => window.URL.revokeObjectURL?.(url), 0);
  return true;
};

const readWorkspacePresetFile = (file: File): Promise<string> => {
  if (typeof file?.text === 'function') return file.text();
  return new Promise((resolve, reject) => {
    if (typeof FileReader === 'undefined') {
      reject(new Error('File reading is unavailable in this host.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error('The preset file could not be read.'));
    reader.onload = () => resolve(String(reader.result || ''));
    reader.readAsText(file);
  });
};

const clampDockSize = (value, { min, max }, fallback) => {
  const numeric = Math.round(Number(value));
  return Math.max(min, Math.min(max, Number.isFinite(numeric) ? numeric : fallback));
};

const panelWidth = (mode, openWidth) => mode === 'open' ? `${openWidth}px` : mode === 'rail' ? '2.65rem' : '0px';

const dockModeCaption = mode => ({ open: 'OPEN', rail: 'RAIL', closed: 'HIDDEN' }[mode] || 'HIDDEN');

const activeDockPanelId = (panels, requestedId) => panels.some(panel => panel.id === requestedId)
  ? requestedId
  : panels.find(panel => !panel.disabled)?.id;

const isEditingShortcutTarget = target => {
  if (typeof Element === 'undefined' || !(target instanceof Element)) return false;
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"], [role="combobox"], [role="listbox"]'));
};

const hasOpenModal = () => typeof document !== 'undefined' && Boolean(document.querySelector('[role="dialog"], [role="alertdialog"]'));

const normaliseKeyboardShortcut = shortcut => String(shortcut || '')
  .toUpperCase()
  .replace(/CMD|COMMAND/g, 'CTRL')
  .replace(/\s+/g, '')
  .replace(/(^|\+)DEL(?=$|\+)/g, '$1DELETE');

const keyboardShortcutForEvent = event => {
  const key = String(event?.key || '').toUpperCase();
  if (!key || ['CONTROL', 'ALT', 'SHIFT', 'META'].includes(key)) return '';
  const modifiers = [event.ctrlKey || event.metaKey ? 'CTRL' : '', event.altKey ? 'ALT' : '', event.shiftKey ? 'SHIFT' : ''].filter(Boolean);
  return normaliseKeyboardShortcut([...modifiers, key].join('+'));
};

const isViewportInteractiveTarget = target => {
  if (typeof Element === 'undefined' || !(target instanceof Element)) return false;
  return Boolean(target.closest('button, input, textarea, select, a[href], [contenteditable="true"], [role="button"], [role="menu"], [role="menuitem"], [role="toolbar"], [role="tab"]'));
};

const normalizeWorkspacePresetForPlayground = (preset: CadAnyProps, availableLayers: readonly CadAnyProps[] = INITIAL_LAYERS): CadAnyProps => {
  const settings = isRecord(preset?.settings) ? preset.settings : {};
  const layout = isRecord(settings.layout) ? settings.layout : {};
  const controls = isRecord(settings.controls) ? settings.controls : {};
  const profileSettings = isRecord(settings.profiles) ? settings.profiles : {};
  const preferences = normalizeCadWorkspacePanelPreferences(WORKSPACE_PANEL_DECLARATIONS, preset?.panels);
  const panelsByDock = groupCadWorkspacePanelsByDockZone(WORKSPACE_PANEL_DECLARATIONS, preferences);
  const leftDock = isRecord(layout.left) ? layout.left : {};
  const rightDock = isRecord(layout.right) ? layout.right : {};
  const bottomDock = isRecord(layout.bottom) ? layout.bottom : {};
  const viewportNavigation = normalizeMovableOverlayLayout(layout.viewportNavigation, DEFAULT_VIEWPORT_NAVIGATION_OVERLAY);
  const selectionSummary = normalizeMovableOverlayLayout(layout.selectionSummary, DEFAULT_VIEWPORT_SELECTION_SUMMARY_OVERLAY);
  const dynamicInput = normalizeMovableOverlayLayout(layout.dynamicInput, DEFAULT_VIEWPORT_DYNAMIC_INPUT_OVERLAY);
  const viewCube = isRecord(layout.viewCube) ? layout.viewCube : {};
  const layerIds = availableLayers.map(layer => layer.id);
  const profiles = normalizeCadWorkspaceProfiles(profileSettings.items ?? profileSettings.profiles);
  const requestedProfileId = text(profileSettings.activeId);
  const property = isRecord(controls.propertyState) ? controls.propertyState : {};
  const color = isRecord(property.color) ? property.color : {};
  const colorMode = text(color.mode);
  const normalizedColor = colorMode === 'by-layer' || colorMode === 'by-block'
    ? { mode: colorMode }
    : colorMode === 'rgb' && /^#[0-9a-f]{6}$/i.test(text(color.value))
      ? { mode: 'rgb', value: text(color.value).toLowerCase() }
      : { ...DEFAULT_PROPERTY_STATE.color };
  const normalizedCommandLineHeight = clampDockSize(
    layout.commandLineHeight,
    COMMAND_LINE_HEIGHT_LIMITS,
    144
  );

  return {
    panels: preferences,
    layout: {
      leftPanelMode: validValue(text(leftDock.mode), ['open', 'rail', 'closed'], 'open'),
      rightPanelMode: validValue(text(rightDock.mode), ['open', 'rail', 'closed'], 'open'),
      bottomPanelMode: validValue(text(bottomDock.mode), ['open', 'rail', 'closed'], 'open'),
      leftDockTab: activeDockPanelId(panelsByDock.left, text(leftDock.activePanelId)) || '',
      activeInspectorTab: activeDockPanelId(panelsByDock.right, text(rightDock.activePanelId)) || '',
      bottomDockTab: activeDockPanelId(panelsByDock.bottom, text(bottomDock.activePanelId)) || '',
      leftDockWidth: clampDockSize(leftDock.width, DOCK_SIZE_LIMITS.left, DEFAULT_DOCK_LAYOUT.leftWidth),
      rightDockWidth: clampDockSize(rightDock.width, DOCK_SIZE_LIMITS.right, DEFAULT_DOCK_LAYOUT.rightWidth),
      bottomDockHeight: clampDockSize(
        bottomDock.height,
        { ...DOCK_SIZE_LIMITS.bottom, min: Math.max(DOCK_SIZE_LIMITS.bottom.min, normalizedCommandLineHeight + 76) },
        DEFAULT_DOCK_LAYOUT.bottomHeight
      ),
      commandLineHeight: normalizedCommandLineHeight,
      ribbonTab: validValue(text(layout.ribbonTab), ['home', 'view', 'draft', 'workspace'], 'home'),
      quickPropertiesOpen: typeof layout.quickProperties?.open === 'boolean' ? layout.quickProperties.open : true,
      quickPropertiesPinned: typeof layout.quickProperties?.pinned === 'boolean' ? layout.quickProperties.pinned : false,
      viewportNavigation,
      selectionSummary,
      dynamicInput,
      viewCubeCollapsed: typeof viewCube.collapsed === 'boolean'
        ? viewCube.collapsed
        : DEFAULT_VIEW_CUBE.collapsed
    },
    controls: {
      activeTool: validValue(text(controls.activeTool), ['line', 'circle', 'arc', 'move', 'trim', 'offset', 'measure', 'insert'], 'line'),
      activeView: validValue(text(controls.activeView), ['top', 'iso', 'front', 'right'], 'top'),
      zoom: finiteValue(controls.zoom, 1, 0.7, 1.35),
      navigationMode: validValue(text(controls.navigationMode), ['', 'pan', 'orbit'], ''),
      visualStyle: validValue(text(controls.visualStyle), ['2d-wireframe', 'hidden', 'conceptual', 'realistic', 'shaded', 'shaded-with-edges', 'x-ray'], '2d-wireframe'),
      viewportScale: validValue(text(controls.viewportScale), Object.keys(VIEWPORT_SCALE_FACTORS), '1:50'),
      activeLayerId: validValue(text(controls.activeLayerId), layerIds, 'wall'),
      snapIds: selectedValues(controls.snapIds, ['endpoint', 'midpoint', 'center', 'node', 'quadrant', 'intersection', 'extension', 'insertion', 'perpendicular', 'tangent', 'nearest', 'apparent-intersection'], ['endpoint', 'midpoint', 'intersection']),
      constraintIds: selectedValues(controls.constraintIds, ['horizontal', 'vertical', 'parallel', 'perpendicular', 'concentric', 'tangent', 'coincident', 'equal', 'fix'], ['horizontal', 'perpendicular']),
      selectionFilterIds: selectedValues(controls.selectionFilterIds, ['line', 'polyline', 'arc', 'circle', 'text', 'block', 'dimension', 'hatch'], ['line', 'arc', 'block']),
      drafting: normalizedBooleanRecord(controls.drafting, DEFAULT_DRAFTING),
      propertyState: {
        layer: validValue(text(property.layer), layerIds, 'wall'),
        color: normalizedColor,
        linetype: validValue(text(property.linetype), ['continuous', 'dashed', 'dotted', 'dashdot'], 'continuous'),
        lineweight: validValue(text(property.lineweight), ['default', '0.18', '0.25', '0.35', '0.50', '0.70', '1.00'], '0.35'),
        annotationScale: validValue(text(property.annotationScale), Object.keys(VIEWPORT_SCALE_FACTORS), '1:50'),
        length: finiteValue(property.length, 4200, 0, 1000000000),
        locked: typeof property.locked === 'boolean' ? property.locked : false
      },
      selectedBlockId: validValue(text(controls.selectedBlockId), BLOCKS.map(block => block.id), 'door-900'),
      insertOptions: {
        scale: finiteValue(controls.insertOptions?.scale, 1, 0.01, 1000),
        rotation: finiteValue(controls.insertOptions?.rotation, 0, -360000, 360000),
        uniform: typeof controls.insertOptions?.uniform === 'boolean' ? controls.insertOptions.uniform : true,
        specifyOnScreen: typeof controls.insertOptions?.specifyOnScreen === 'boolean' ? controls.insertOptions.specifyOnScreen : true,
        explode: typeof controls.insertOptions?.explode === 'boolean' ? controls.insertOptions.explode : false
      }
    },
    profiles: {
      items: profiles,
      activeId: profiles.some(profile => profile.id === requestedProfileId) ? requestedProfileId : CAD_WORKSPACE_MODEL_ID
    }
  };
};

function Playground() {
  const idSequence = useRef(0);
  const focusExitRef = useRef<HTMLButtonElement | null>(null);
  const focusRestoreRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLElement | null>(null);
  const selectionContextMenuRef = useRef<HTMLElement | null>(null);
  const selectionRadialMenuRef = useRef<HTMLElement | null>(null);
  const presetImportRef = useRef<HTMLInputElement | null>(null);
  const persistenceReadyRef = useRef(false);
  const hasRestoredWorkspaceRef = useRef(false);
  const skipInitialWorkspacePersistenceRef = useRef(true);
  const [profiles, setProfiles] = useState<CadAnyProps[]>(() => Array.from(INITIAL_PROFILES));
  const [activeProfileId, setActiveProfileId] = useState(CAD_WORKSPACE_MODEL_ID);
  const [focusMode, setFocusMode] = useState(false);
  const [leftPanelMode, setLeftPanelMode] = useState<'open' | 'rail' | 'closed'>('open');
  const [rightPanelMode, setRightPanelMode] = useState<'open' | 'rail' | 'closed'>('open');
  const [bottomPanelMode, setBottomPanelMode] = useState<'open' | 'rail' | 'closed'>('open');
  const [leftDockTab, setLeftDockTab] = useState('tool-palette');
  const [leftDockWidth, setLeftDockWidth] = useState<number>(DEFAULT_DOCK_LAYOUT.leftWidth);
  const [rightDockWidth, setRightDockWidth] = useState<number>(DEFAULT_DOCK_LAYOUT.rightWidth);
  const [bottomDockHeight, setBottomDockHeight] = useState<number>(DEFAULT_DOCK_LAYOUT.bottomHeight);
  const [bottomDockTab, setBottomDockTab] = useState('command');
  const [workspacePanelPreferences, setWorkspacePanelPreferences] = useState<CadAnyProps>(INITIAL_WORKSPACE_PANEL_PREFERENCES);
  const [commandLineHeight, setCommandLineHeight] = useState<number>(144);
  const [workspacePresets, setWorkspacePresets] = useState<CadAnyProps[]>(loadWorkspacePresetCatalog);
  const [selectedWorkspacePresetId, setSelectedWorkspacePresetId] = useState('');
  const [workspacePresetDraftName, setWorkspacePresetDraftName] = useState('');
  const [workspacePresetStatus, setWorkspacePresetStatus] = useState<{ message: string; tone: string }>({ message: '', tone: 'neutral' });
  const [activeInspectorTab, setActiveInspectorTab] = useState('properties');
  const [activeTool, setActiveTool] = useState('line');
  const [activeView, setActiveView] = useState('top');
  const [zoom, setZoom] = useState(1);
  const [ribbonTab, setRibbonTab] = useState('home');
  const [navigationMode, setNavigationMode] = useState('');
  const [navigationOverlayPosition, setNavigationOverlayPosition] = useState<CadAnyProps>(DEFAULT_VIEWPORT_NAVIGATION_OVERLAY.position);
  const [navigationOverlayCollapsed, setNavigationOverlayCollapsed] = useState<boolean>(DEFAULT_VIEWPORT_NAVIGATION_OVERLAY.collapsed);
  const [selectionSummaryOverlayPosition, setSelectionSummaryOverlayPosition] = useState<CadAnyProps>(DEFAULT_VIEWPORT_SELECTION_SUMMARY_OVERLAY.position);
  const [selectionSummaryOverlayCollapsed, setSelectionSummaryOverlayCollapsed] = useState<boolean>(DEFAULT_VIEWPORT_SELECTION_SUMMARY_OVERLAY.collapsed);
  const [dynamicInputOverlayPosition, setDynamicInputOverlayPosition] = useState<CadAnyProps>(DEFAULT_VIEWPORT_DYNAMIC_INPUT_OVERLAY.position);
  const [dynamicInputOverlayCollapsed, setDynamicInputOverlayCollapsed] = useState<boolean>(DEFAULT_VIEWPORT_DYNAMIC_INPUT_OVERLAY.collapsed);
  const [viewCubeCollapsed, setViewCubeCollapsed] = useState<boolean>(DEFAULT_VIEW_CUBE.collapsed);
  const [visualStyle, setVisualStyle] = useState('2d-wireframe');
  const [viewportScale, setViewportScale] = useState('1:50');
  const [layers, setLayers] = useState<CadAnyProps[]>(() => Array.from(INITIAL_LAYERS));
  const [activeLayerId, setActiveLayerId] = useState('wall');
  const [snapIds, setSnapIds] = useState(['endpoint', 'midpoint', 'intersection']);
  const [constraintIds, setConstraintIds] = useState(['horizontal', 'perpendicular']);
  const [selectionFilterIds, setSelectionFilterIds] = useState(['line', 'arc', 'block']);
  const [selectedRowIds, setSelectedRowIds] = useState(['line-01']);
  const [selectionExtras, setSelectionExtras] = useState<CadAnyProps[]>([]);
  const [selectionSource, setSelectionSource] = useState('data-grid');
  const [selectionSets, setSelectionSets] = useState(INITIAL_SELECTION_SETS);
  const [activeSelectionSetId, setActiveSelectionSetId] = useState('primary-shell');
  const [selectionSetFilter, setSelectionSetFilter] = useState('');
  const [selectionContextMenuPosition, setSelectionContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectionRadialMenuPosition, setSelectionRadialMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [dynamicPoint, setDynamicPoint] = useState({ x: 1180, y: 640, z: 0 });
  const [drafting, setDrafting] = useState<CadAnyProps>(DEFAULT_DRAFTING);
  const [propertyState, setPropertyState] = useState<CadAnyProps>(DEFAULT_PROPERTY_STATE);
  const [selectedBlockId, setSelectedBlockId] = useState('door-900');
  const [pendingBlock, setPendingBlock] = useState<CadAnyProps | null>(null);
  const [insertOptions, setInsertOptions] = useState<CadAnyProps>(DEFAULT_INSERT_OPTIONS);
  const [insertDialogOpen, setInsertDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [quickPropertiesOpen, setQuickPropertiesOpen] = useState(true);
  const [quickPropertiesPinned, setQuickPropertiesPinned] = useState(false);
  const [events, setEvents] = useState([
    { id: 'initial', message: 'Sandbox ready — no CAD engine attached.', tone: 'muted' }
  ]);
  const activeProfile = profiles.find(profile => profile.id === activeProfileId)
    || profiles.find(profile => profile.id === CAD_WORKSPACE_MODEL_ID)
    || INITIAL_PROFILES[0];
  const isModelSpace = activeProfile?.id === CAD_WORKSPACE_MODEL_ID;
  const activeSpaceLabel = isModelSpace ? 'MODEL SPACE' : `PAPER SPACE / ${(activeProfile?.name || 'Layout').toUpperCase()}`;
  const selectedRowItems = useMemo(() => selectedRowIds.flatMap(id => {
    const row = OBJECT_ROWS.find(item => item.id === id);
    const metadata = OBJECT_SELECTION_METADATA[id];
    return row && metadata ? [{ id, label: row.entity, ...metadata }] : [];
  }), [selectedRowIds]);
  const selectedEntities = useMemo(() => [...selectedRowItems, ...selectionExtras], [selectedRowItems, selectionExtras]);
  const selectionCount = selectedEntities.length;
  const selectionSnapshot = useMemo(() => {
    const entityTypes = [...new Set(selectedEntities.map(item => item.entityType).filter(Boolean))];
    const commonTraits = selectedEntities.reduce((traits, item, index) => {
      const currentTraits = new Set(item.traits || []);
      return index === 0 ? [...currentTraits] : traits.filter(trait => currentTraits.has(trait));
    }, [] as string[]);
    return {
      ids: selectedEntities.map(item => item.id),
      entityTypes,
      traits: commonTraits,
      source: selectionSource
    };
  }, [selectedEntities, selectionSource]);

  const enterFocusMode = () => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      focusRestoreRef.current = document.activeElement;
    }
    setFocusMode(true);
  };

  const exitFocusMode = () => setFocusMode(false);

  useEffect(() => {
    if (focusMode) {
      focusExitRef.current?.focus();
      return;
    }

    if (focusRestoreRef.current?.isConnected) focusRestoreRef.current.focus();
    focusRestoreRef.current = null;
  }, [focusMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleKeyDown = event => {
      if (event.defaultPrevented || isEditingShortcutTarget(event.target) || hasOpenModal()) return;

      const isCleanScreenShortcut = event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey && (event.key === '0' || event.code === 'Digit0');
      if (isCleanScreenShortcut) {
        event.preventDefault();
        if (focusMode) exitFocusMode();
        else enterFocusMode();
        return;
      }

      if (focusMode && event.key === 'Escape') {
        event.preventDefault();
        exitFocusMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusMode]);

  const nextId = useCallback(prefix => `${prefix}-${++idSequence.current}`, []);
  const record = useCallback((message, tone = 'normal') => {
    setEvents(current => [{ id: nextId('event'), message, tone }, ...current].slice(0, 6));
  }, [nextId]);
  const report = useCallback((title, message, tone = 'neutral') => {
    record(`${title}: ${message}`, tone);
  }, [record]);
  const submitHeaderSearch = event => {
    event.preventDefault();
    const query = headerSearch.trim();
    if (query) report('Search', `“${query}” requested.`);
  };

  const createWorkspacePreset = useCallback(({ id, name = 'Current workspace', description, savedAt = new Date().toISOString() }: CadAnyProps = {}): CadAnyProps => createCadWorkspacePresetSnapshot({
    id,
    name,
    description,
    savedAt,
    panelPreferences: workspacePanelPreferences,
    settings: {
      layout: {
        left: { mode: leftPanelMode, width: leftDockWidth, activePanelId: leftDockTab },
        right: { mode: rightPanelMode, width: rightDockWidth, activePanelId: activeInspectorTab },
        bottom: { mode: bottomPanelMode, height: bottomDockHeight, activePanelId: bottomDockTab },
        commandLineHeight,
        ribbonTab,
        quickProperties: { open: quickPropertiesOpen, pinned: quickPropertiesPinned },
        viewportNavigation: {
          position: navigationOverlayPosition,
          collapsed: navigationOverlayCollapsed
        },
        selectionSummary: {
          position: selectionSummaryOverlayPosition,
          collapsed: selectionSummaryOverlayCollapsed
        },
        dynamicInput: {
          position: dynamicInputOverlayPosition,
          collapsed: dynamicInputOverlayCollapsed
        },
        viewCube: { collapsed: viewCubeCollapsed }
      },
      controls: {
        activeTool,
        activeView,
        zoom,
        navigationMode,
        visualStyle,
        viewportScale,
        activeLayerId,
        snapIds,
        constraintIds,
        selectionFilterIds,
        drafting,
        propertyState,
        selectedBlockId,
        insertOptions
      },
      profiles: { items: profiles, activeId: activeProfileId }
    }
  }, WORKSPACE_PRESET_OPTIONS), [
    activeInspectorTab,
    activeLayerId,
    activeProfileId,
    activeTool,
    activeView,
    bottomDockHeight,
    bottomDockTab,
    bottomPanelMode,
    commandLineHeight,
    constraintIds,
    drafting,
    dynamicInputOverlayCollapsed,
    dynamicInputOverlayPosition,
    insertOptions,
    leftDockTab,
    leftDockWidth,
    leftPanelMode,
    navigationOverlayCollapsed,
    navigationOverlayPosition,
    navigationMode,
    profiles,
    propertyState,
    quickPropertiesOpen,
    quickPropertiesPinned,
    ribbonTab,
    rightDockWidth,
    rightPanelMode,
    selectedBlockId,
    selectionFilterIds,
    selectionSummaryOverlayCollapsed,
    selectionSummaryOverlayPosition,
    snapIds,
    viewCubeCollapsed,
    viewportScale,
    visualStyle,
    workspacePanelPreferences,
    zoom
  ]);

  const applyWorkspacePreset = useCallback(preset => {
    const next = normalizeWorkspacePresetForPlayground(preset, layers);
    setFocusMode(false);
    setWorkspacePanelPreferences(next.panels);
    setLeftPanelMode(next.layout.leftPanelMode);
    setRightPanelMode(next.layout.rightPanelMode);
    setBottomPanelMode(next.layout.bottomPanelMode);
    setLeftDockTab(next.layout.leftDockTab);
    setActiveInspectorTab(next.layout.activeInspectorTab);
    setBottomDockTab(next.layout.bottomDockTab);
    setLeftDockWidth(next.layout.leftDockWidth);
    setRightDockWidth(next.layout.rightDockWidth);
    setBottomDockHeight(next.layout.bottomDockHeight);
    setCommandLineHeight(next.layout.commandLineHeight);
    setRibbonTab(next.layout.ribbonTab);
    setQuickPropertiesOpen(next.layout.quickPropertiesOpen);
    setQuickPropertiesPinned(next.layout.quickPropertiesPinned);
    setNavigationOverlayPosition(next.layout.viewportNavigation.position);
    setNavigationOverlayCollapsed(next.layout.viewportNavigation.collapsed);
    setSelectionSummaryOverlayPosition(next.layout.selectionSummary.position);
    setSelectionSummaryOverlayCollapsed(next.layout.selectionSummary.collapsed);
    setDynamicInputOverlayPosition(next.layout.dynamicInput.position);
    setDynamicInputOverlayCollapsed(next.layout.dynamicInput.collapsed);
    setViewCubeCollapsed(next.layout.viewCubeCollapsed);
    setActiveTool(next.controls.activeTool);
    setActiveView(next.controls.activeView);
    setZoom(next.controls.zoom);
    setNavigationMode(next.controls.navigationMode);
    setVisualStyle(next.controls.visualStyle);
    setViewportScale(next.controls.viewportScale);
    setActiveLayerId(next.controls.activeLayerId);
    setSnapIds(next.controls.snapIds);
    setConstraintIds(next.controls.constraintIds);
    setSelectionFilterIds(next.controls.selectionFilterIds);
    setDrafting(next.controls.drafting);
    setPropertyState(next.controls.propertyState);
    setSelectedBlockId(next.controls.selectedBlockId);
    setInsertOptions(next.controls.insertOptions);
    setProfiles(next.profiles.items);
    setActiveProfileId(next.profiles.activeId);
  }, [layers]);

  const replaceWorkspacePresets = nextPresets => {
    const normalized = normalizeWorkspacePresetCatalog(nextPresets);
    setWorkspacePresets(normalized);
    return { presets: normalized, persisted: persistWorkspacePresetCatalog(normalized) };
  };

  const currentWorkspacePreset = useMemo(() => createWorkspacePreset(), [createWorkspacePreset]);

  useEffect(() => {
    if (hasRestoredWorkspaceRef.current) return;
    hasRestoredWorkspaceRef.current = true;
    const restored = loadCurrentWorkspacePreset();
    if (restored) {
      applyWorkspacePreset(restored);
      setWorkspacePresetStatus({ message: 'Current workspace restored from this browser.', tone: 'success' });
    }
    persistenceReadyRef.current = true;
  }, [applyWorkspacePreset]);

  useEffect(() => {
    if (!persistenceReadyRef.current) return;
    // The initial render can contain temporary defaults while the stored
    // snapshot is being applied. Never overwrite the recovered layout with
    // those defaults; the following state commit persists the actual layout.
    if (skipInitialWorkspacePersistenceRef.current) {
      skipInitialWorkspacePersistenceRef.current = false;
      return;
    }
    persistCurrentWorkspacePreset(currentWorkspacePreset);
  }, [currentWorkspacePreset]);

  const handleWorkspacePresetSaveAs = action => {
    const name = workspacePresetName(action?.name, workspacePresets);
    if (workspacePresets.length >= WORKSPACE_PRESET_MAX_COUNT) {
      setWorkspacePresetStatus({ message: `Keep at most ${WORKSPACE_PRESET_MAX_COUNT} saved presets in this browser.`, tone: 'warning' });
      return;
    }
    const preset = createWorkspacePreset({
      id: workspacePresetId(name, workspacePresets),
      name,
      savedAt: new Date().toISOString()
    });
    const result = replaceWorkspacePresets([...workspacePresets, preset]);
    setSelectedWorkspacePresetId(preset.id);
    setWorkspacePresetDraftName('');
    setWorkspacePresetStatus({
      message: result.persisted ? `Saved “${preset.name}” in this browser.` : `Saved “${preset.name}” for this session.`,
      tone: result.persisted ? 'success' : 'warning'
    });
    report('Workspace preset', `${preset.name} saved.`);
  };

  const handleWorkspacePresetLoad = action => {
    if (!action?.preset) return;
    applyWorkspacePreset(action.preset);
    setSelectedWorkspacePresetId(action.preset.id);
    setWorkspacePresetStatus({ message: `Loaded “${action.preset.name}”.`, tone: 'success' });
    report('Workspace preset', `${action.preset.name} loaded.`);
  };

  const handleWorkspacePresetOverwrite = action => {
    const existing = action?.preset;
    if (!existing) return;
    const preset = createWorkspacePreset({
      id: existing.id,
      name: existing.name,
      description: existing.description,
      savedAt: new Date().toISOString()
    });
    const result = replaceWorkspacePresets(workspacePresets.map(candidate => candidate.id === existing.id ? preset : candidate));
    setWorkspacePresetStatus({
      message: result.persisted ? `Updated “${preset.name}”.` : `Updated “${preset.name}” for this session.`,
      tone: result.persisted ? 'success' : 'warning'
    });
    report('Workspace preset', `${preset.name} updated.`);
  };

  const handleWorkspacePresetDelete = action => {
    const existing = action?.preset;
    if (!existing) return;
    const result = replaceWorkspacePresets(workspacePresets.filter(candidate => candidate.id !== existing.id));
    setSelectedWorkspacePresetId(result.presets[0]?.id || '');
    setWorkspacePresetStatus({
      message: result.persisted ? `Deleted “${existing.name}”.` : `Deleted “${existing.name}” for this session.`,
      tone: result.persisted ? 'success' : 'warning'
    });
    report('Workspace preset', `${existing.name} deleted.`);
  };

  const handleWorkspacePresetExport = action => {
    const preset = action?.preset || createWorkspacePreset({ name: 'Current workspace' });
    const exported = exportCadWorkspacePreset(preset, WORKSPACE_PRESET_OPTIONS);
    if (!exported.ok) {
      setWorkspacePresetStatus({ message: 'The workspace preset could not be exported.', tone: 'error' });
      return;
    }
    const downloaded = downloadWorkspacePreset(exported.preset.name, exported.json);
    setWorkspacePresetStatus({
      message: downloaded ? `Exported “${exported.preset.name}” as JSON.` : 'Your browser cannot start the JSON download.',
      tone: downloaded ? 'success' : 'error'
    });
    if (downloaded) report('Workspace preset', `${exported.preset.name} exported.`);
  };

  const handleWorkspacePresetImport = () => presetImportRef.current?.click();

  const handleWorkspacePresetFileChange = event => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    readWorkspacePresetFile(file).then(contents => {
      const imported = importCadWorkspacePreset(contents, WORKSPACE_PRESET_OPTIONS);
      if (!imported.ok) {
        setWorkspacePresetStatus({ message: imported.errors[0]?.message || 'The workspace preset could not be imported.', tone: 'error' });
        return;
      }
      if (workspacePresets.length >= WORKSPACE_PRESET_MAX_COUNT) {
        setWorkspacePresetStatus({ message: `Keep at most ${WORKSPACE_PRESET_MAX_COUNT} saved presets in this browser.`, tone: 'warning' });
        return;
      }
      const name = workspacePresetName(imported.preset.name, workspacePresets);
      const preset = { ...imported.preset, id: workspacePresetId(imported.preset.id || name, workspacePresets), name, savedAt: new Date().toISOString() };
      const result = replaceWorkspacePresets([...workspacePresets, preset]);
      setSelectedWorkspacePresetId(preset.id);
      setWorkspacePresetStatus({
        message: result.persisted ? `Imported “${preset.name}”.` : `Imported “${preset.name}” for this session.`,
        tone: result.persisted ? 'success' : 'warning'
      });
      report('Workspace preset', `${preset.name} imported.`);
    }).catch(() => {
      setWorkspacePresetStatus({ message: 'The preset file could not be read.', tone: 'error' });
    });
  };

  const setDockMode = (label, setMode) => nextMode => {
    setMode(nextMode);
    record(`Workspace: ${label} ${nextMode}.`);
  };

  const resetDockLayout = () => {
    setLeftPanelMode('open');
    setRightPanelMode('open');
    setBottomPanelMode('open');
    setLeftDockWidth(DEFAULT_DOCK_LAYOUT.leftWidth);
    setRightDockWidth(DEFAULT_DOCK_LAYOUT.rightWidth);
    setBottomDockHeight(DEFAULT_DOCK_LAYOUT.bottomHeight);
    record('Workspace: Dock layout reset.');
  };

  const toggleDockFromChrome = (label, mode, setMode) => {
    setDockMode(label, setMode)(mode === 'closed' ? 'open' : 'closed');
  };

  const workspaceChromeItems = [
    {
      id: 'focus',
      label: 'Enter Focus Mode',
      title: 'Enter Focus Mode · Control+0',
      icon: '⌖',
      active: focusMode,
      shortcut: 'Control+0',
      onClick: () => focusMode ? exitFocusMode() : enterFocusMode()
    },
    {
      id: 'tools',
      label: `Toggle Tools panel — ${dockModeCaption(leftPanelMode)}`,
      title: `Tools panel: ${dockModeCaption(leftPanelMode)}. Activate to ${leftPanelMode === 'closed' ? 'OPEN' : 'HIDE'}.`,
      icon: '◧',
      mode: leftPanelMode,
      active: leftPanelMode !== 'closed',
      onClick: () => toggleDockFromChrome('Tools panel', leftPanelMode, setLeftPanelMode)
    },
    {
      id: 'command',
      label: `Toggle Command bar — ${dockModeCaption(bottomPanelMode)}`,
      title: `Command bar: ${dockModeCaption(bottomPanelMode)}. Activate to ${bottomPanelMode === 'closed' ? 'OPEN' : 'HIDE'}.`,
      icon: '▱',
      mode: bottomPanelMode,
      active: bottomPanelMode !== 'closed',
      onClick: () => toggleDockFromChrome('Command bar', bottomPanelMode, setBottomPanelMode)
    },
    {
      id: 'inspector',
      label: `Toggle Inspector panel — ${dockModeCaption(rightPanelMode)}`,
      title: `Inspector panel: ${dockModeCaption(rightPanelMode)}. Activate to ${rightPanelMode === 'closed' ? 'OPEN' : 'HIDE'}.`,
      icon: '◨',
      mode: rightPanelMode,
      active: rightPanelMode !== 'closed',
      onClick: () => toggleDockFromChrome('Inspector panel', rightPanelMode, setRightPanelMode)
    }
  ];

  const workspaceStyle = {
    '--cad-demo-left-pane': panelWidth(leftPanelMode, leftDockWidth),
    '--cad-demo-right-pane': panelWidth(rightPanelMode, rightDockWidth),
    '--cad-demo-left-dock-width': `${leftDockWidth}px`,
    '--cad-demo-right-dock-width': `${rightDockWidth}px`
  };

  const selectTool = tool => {
    if (!tool?.id) return;
    if (tool.id === 'ortho' || tool.id === 'polar') {
      setDrafting(current => ({ ...current, [tool.id]: Boolean(tool.active) }));
      report('Drafting mode', `${tool.id.toUpperCase()} ${tool.active ? 'enabled' : 'disabled'}`);
      return;
    }
    setActiveTool(tool.id);
    report('Command', `${String(tool.label || tool.id).toUpperCase()} is active.`);
  };

  const selectRows = (ids, source = 'data-grid') => {
    setSelectedRowIds(ids);
    setSelectionExtras([]);
    setSelectionSource(source);
  };

  const applySelectionAction = useCallback(command => {
    const action = command?.intent?.action || String(command?.id || '').replace(/^selection\./, '');
    if (!action || !selectionCount) return;
    if (action === 'properties') {
      setActiveInspectorTab('properties');
      setRightPanelMode('open');
    } else if (action === 'edit-block') {
      setActiveInspectorTab('blocks');
      setRightPanelMode('open');
    } else if (action === 'edit-dimension') {
      setActiveInspectorTab('properties');
      setRightPanelMode('open');
    } else if (action === 'delete') {
      setClearDialogOpen(true);
      return;
    } else {
      setActiveTool(action);
    }
    report('Selection action', `${String(command?.label || action).toUpperCase()} offered for ${selectionCount} selected object${selectionCount === 1 ? '' : 's'}.`);
  }, [report, selectionCount]);

  const handleSelectionMenuAction = useCallback(command => {
    const action = command?.intent?.action || String(command?.id || '').replace(/^selection\./, '');
    applySelectionAction(command);
    if (['properties', 'edit-block', 'edit-dimension', 'delete'].includes(action) || typeof window === 'undefined') return;
    window.setTimeout(() => viewportRef.current?.focus({ preventScroll: true }), 0);
  }, [applySelectionAction]);

  const openSelectionContextMenu = useCallback((clientX?: number, clientY?: number) => {
    const viewport = viewportRef.current;
    if (!viewport || !selectionCount) return;

    const bounds = viewport.getBoundingClientRect();
    const menuWidth = 232;
    const menuHeight = 286;
    const preferredX = Number.isFinite(clientX) ? Number(clientX) - bounds.left : bounds.width / 2;
    const preferredY = Number.isFinite(clientY) ? Number(clientY) - bounds.top : bounds.height / 2;
    const x = Math.max(8, Math.min(preferredX, Math.max(8, bounds.width - menuWidth - 8)));
    const y = Math.max(8, Math.min(preferredY, Math.max(8, bounds.height - menuHeight - 8)));
    setSelectionRadialMenuPosition(null);
    setSelectionContextMenuPosition({ x: Math.round(x), y: Math.round(y) });
  }, [selectionCount]);

  const openSelectionRadialMenu = useCallback((clientX?: number, clientY?: number) => {
    const viewport = viewportRef.current;
    if (!viewport || !selectionCount) return;

    const bounds = viewport.getBoundingClientRect();
    const preferredX = Number.isFinite(clientX) ? Number(clientX) - bounds.left : bounds.width / 2;
    const preferredY = Number.isFinite(clientY) ? Number(clientY) - bounds.top : bounds.height / 2;
    // Keep every spoke inside the viewport. On very small hosts this collapses
    // to the safest centre point rather than letting the wheel be clipped.
    const maximumInset = Math.max(24, Math.floor(Math.min(bounds.width, bounds.height) / 2 - 8));
    const inset = Math.max(24, Math.min(132, maximumInset));
    const x = Math.max(inset, Math.min(preferredX, Math.max(inset, bounds.width - inset)));
    const y = Math.max(inset, Math.min(preferredY, Math.max(inset, bounds.height - inset)));
    setSelectionContextMenuPosition(null);
    setSelectionRadialMenuPosition({ x: Math.round(x), y: Math.round(y) });
  }, [selectionCount]);

  const handleViewportContextMenu = event => {
    if (isViewportInteractiveTarget(event.target)) return;
    event.preventDefault();
    viewportRef.current?.focus({ preventScroll: true });
    if (event.altKey) openSelectionRadialMenu(event.clientX, event.clientY);
    else openSelectionContextMenu(event.clientX, event.clientY);
  };

  const runCommand = command => {
    const normalized = String(command || '').trim().toLowerCase();
    if (!normalized) return;
    const requestedSelectionCommand = selectionCount ? selectionActionForAlias(DEMO_SELECTION_ACTIONS.commands, command) : null;
    if (requestedSelectionCommand) {
      const selectionCommand = selectionContextActions.find(candidate => candidate.id === requestedSelectionCommand.id);
      if (selectionCommand) applySelectionAction(selectionCommand);
      else report('Selection action', `${requestedSelectionCommand.label} is not available for the current selection.`, 'muted');
      return;
    }
    const tool = normalized.includes('circle') || normalized === 'c' ? 'circle'
      : normalized.includes('move') || normalized === 'm' ? 'move'
        : normalized.includes('block') || normalized.includes('insert') ? 'insert'
          : normalized.includes('line') || normalized === 'l' ? 'line' : normalized;
    if (tool === 'insert') {
      openWorkspacePanel('blocks');
      report('Command', 'INSERT opened the Blocks palette.');
      return;
    }
    setActiveTool(tool);
    report('Command', `${tool.toUpperCase()} accepted from command line.`);
  };

  const runViewportCommand = command => {
    const point = parseCadPointArgument(command);
    if (point) setDynamicPoint(point);
    runCommand(command);
  };

  const addLayout = () => {
    const next = createCadWorkspaceProfile(profiles, { id: 'layout', name: `Layout${profiles.length}` });
    const added = next.at(-1);
    setProfiles(next);
    setActiveProfileId(added.id);
    report('Workspace', `${added.name} created.`);
  };

  const closeProfile = id => {
    const result = removeCadWorkspaceProfile(profiles, id, activeProfileId);
    setProfiles(result.profiles);
    setActiveProfileId(result.activeId);
    report('Workspace', `${id} closed.`);
  };

  const updateLayer = (layerId, patch) => {
    setLayers(current => current.map(layer => layer.id === layerId ? { ...layer, ...patch } : layer));
    report('Layer state', `${layerId} updated.`);
  };

  const propertyDefinitions = useMemo(() => [
    { id: 'layer', label: 'Layer', type: 'select', value: propertyState.layer, options: layers.map(layer => ({ value: layer.id, label: layer.label })) },
    { id: 'color', label: 'Color', type: 'cad-color', value: propertyState.color },
    { id: 'linetype', label: 'Linetype', type: 'linetype', value: propertyState.linetype },
    { id: 'lineweight', label: 'Lineweight', type: 'lineweight', value: propertyState.lineweight },
    ...(isModelSpace ? [{ id: 'annotationScale', label: 'Annotation scale', type: 'scale', value: propertyState.annotationScale }] : []),
    { id: 'length', label: 'Length', type: 'unit', value: propertyState.length, unit: 'mm', step: 25 },
    { id: 'locked', label: 'Locked', type: 'toggle', value: propertyState.locked, onLabel: 'Locked', offLabel: 'Unlocked' }
  ], [isModelSpace, layers, propertyState]);

  const toolbarGroups = useMemo(() => [
    {
      id: 'draw', label: 'Draw', items: [
        { id: 'line', label: 'LINE', shortcut: 'L', active: activeTool === 'line' },
        { id: 'circle', label: 'CIRCLE', shortcut: 'C', active: activeTool === 'circle' },
        { id: 'arc', label: 'ARC', shortcut: 'A', active: activeTool === 'arc' }
      ]
    },
    {
      id: 'modify', label: 'Modify', items: [
        { id: 'move', label: 'MOVE', shortcut: 'M', active: activeTool === 'move' },
        { id: 'trim', label: 'TRIM', shortcut: 'TR', active: activeTool === 'trim' },
        { id: 'offset', label: 'OFFSET', shortcut: 'O', active: activeTool === 'offset' }
      ]
    },
    {
      id: 'draft', label: 'Draft', items: [
        { id: 'ortho', label: 'ORTHO', toggle: true, active: drafting.ortho },
        { id: 'polar', label: 'POLAR', toggle: true, active: drafting.polar }
      ]
    }
  ], [activeTool, drafting.ortho, drafting.polar]);

  const workspaceRibbonTabs = useMemo(() => [
    { id: 'home', label: 'HOME', color: '#64d8ff' },
    { id: 'view', label: 'VIEW', color: '#b7df6a' },
    { id: 'draft', label: 'DRAFT', color: '#ffc261' },
    { id: 'workspace', label: 'WORKSPACE / PANELS', color: '#ef97ff' }
  ], []);

  const selectionToolbarTools = useMemo(() => selectCadCuiCommands(
    DEMO_SELECTION_ACTIONS,
    DEMO_SELECTION_ACTIONS.defaultState,
    { surface: 'selection-toolbar', selection: selectionSnapshot, unavailablePresentation: 'hide' }
  ).map(command => ({
    ...command,
    icon: <span>{SELECTION_ACTION_GLYPHS[command.id] || '•'}</span>
    })), [selectionSnapshot]);

  const selectionContextActions = useMemo(() => selectCadCuiCommands(
    DEMO_SELECTION_ACTIONS,
    DEMO_SELECTION_ACTIONS.defaultState,
    { surface: 'context', menuId: 'selection', selection: selectionSnapshot, unavailablePresentation: 'hide' }
  ).map(command => ({
    ...command,
    icon: <span>{SELECTION_ACTION_GLYPHS[command.id] || '•'}</span>
  })), [selectionSnapshot]);

  useEffect(() => {
    if (!selectionCount) {
      setSelectionContextMenuPosition(null);
      setSelectionRadialMenuPosition(null);
    }
  }, [selectionCount]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleSelectionShortcut = event => {
      if (!shouldHandleCadShortcut(event, { scopeRoot: viewportRef }) || isViewportInteractiveTarget(event.target)) return;

      const isContextMenuShortcut = event.key === 'ContextMenu'
        || (event.key === 'F10' && event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey);
      if (isContextMenuShortcut) {
        if (!selectionContextActions.length) return;
        event.preventDefault();
        openSelectionContextMenu();
        return;
      }

      const shortcut = keyboardShortcutForEvent(event);
      if (!shortcut) return;
      if (shortcut === 'Q') {
        if (!selectionContextActions.length) return;
        event.preventDefault();
        openSelectionRadialMenu();
        return;
      }
      const matches = selectionContextActions.filter(command => normaliseKeyboardShortcut(command.shortcut) === shortcut);
      if (matches.length !== 1) return;
      event.preventDefault();
      applySelectionAction(matches[0]);
    };

    window.addEventListener('keydown', handleSelectionShortcut);
    return () => window.removeEventListener('keydown', handleSelectionShortcut);
  }, [applySelectionAction, openSelectionContextMenu, openSelectionRadialMenu, selectionContextActions]);

  const selectionRibbonCommands = useMemo(() => selectCadCuiCommands(
    DEMO_SELECTION_ACTIONS,
    DEMO_SELECTION_ACTIONS.defaultState,
    { surface: 'ribbon', tabId: 'home', selection: selectionSnapshot, unavailablePresentation: 'hide' }
  ).map(command => ({
    ...command,
    groupId: 'selection',
    groupLabel: 'SELECTION',
    icon: <span>{SELECTION_ACTION_GLYPHS[command.id] || '•'}</span>
  })), [selectionSnapshot]);

  const workspaceRibbonCommands = useMemo(() => [
    { id: 'line', tabId: 'home', groupId: 'draw', groupLabel: 'DRAW', order: 10, label: 'LINE', shortcut: 'L', icon: <span>╱</span>, active: activeTool === 'line', toggle: true },
    { id: 'circle', tabId: 'home', groupId: 'draw', groupLabel: 'DRAW', order: 20, label: 'CIRCLE', shortcut: 'C', icon: <span>○</span>, active: activeTool === 'circle', toggle: true },
    { id: 'arc', tabId: 'home', groupId: 'draw', groupLabel: 'DRAW', order: 30, label: 'ARC', shortcut: 'A', icon: <span>◜</span>, active: activeTool === 'arc', toggle: true },
    ...(selectionCount ? [] : [
      { id: 'move', tabId: 'home', groupId: 'modify', groupLabel: 'MODIFY', order: 40, label: 'MOVE', shortcut: 'M', icon: <span>↗</span>, active: activeTool === 'move', toggle: true },
      { id: 'trim', tabId: 'home', groupId: 'modify', groupLabel: 'MODIFY', order: 50, label: 'TRIM', shortcut: 'TR', icon: <span>✂</span>, active: activeTool === 'trim', toggle: true },
      { id: 'offset', tabId: 'home', groupId: 'modify', groupLabel: 'MODIFY', order: 60, label: 'OFFSET', shortcut: 'O', icon: <span>⇆</span>, active: activeTool === 'offset', toggle: true }
    ]),
    { id: 'insert', tabId: 'home', groupId: 'content', groupLabel: 'CONTENT', order: 70, label: 'INSERT', shortcut: 'I', icon: <span>⊞</span> },
    ...selectionRibbonCommands,

    { id: 'view-top', tabId: 'view', groupId: 'views', groupLabel: 'VIEWS', order: 10, label: 'TOP', icon: <span>▣</span>, active: activeView === 'top', toggle: true },
    { id: 'view-iso', tabId: 'view', groupId: 'views', groupLabel: 'VIEWS', order: 20, label: 'ISO', icon: <span>◇</span>, active: activeView === 'iso', toggle: true },
    { id: 'zoom-in', tabId: 'view', groupId: 'navigate', groupLabel: 'NAVIGATE', order: 30, label: 'ZOOM IN', shortcut: '+', icon: <span>+</span> },
    { id: 'zoom-out', tabId: 'view', groupId: 'navigate', groupLabel: 'NAVIGATE', order: 40, label: 'ZOOM OUT', shortcut: '−', icon: <span>−</span> },
    { id: 'zoom-extents', tabId: 'view', groupId: 'navigate', groupLabel: 'NAVIGATE', order: 50, label: 'EXTENTS', shortcut: 'E', icon: <span>⤢</span> },
    { id: 'viewcube-controls', tabId: 'view', groupId: 'viewcube', groupLabel: 'VIEWCUBE', order: 60, label: viewCubeCollapsed ? 'CUBE RAIL' : 'CUBE OPEN', ariaLabel: viewCubeCollapsed ? 'Open ViewCube controls' : 'Collapse ViewCube controls', title: viewCubeCollapsed ? 'Open ViewCube controls permanently' : 'Collapse ViewCube controls to a hover rail', icon: <span>◇</span>, active: !viewCubeCollapsed, toggle: true },

    { id: 'grid', tabId: 'draft', groupId: 'drafting', groupLabel: 'DRAFTING', order: 10, label: 'GRID', icon: <span>▦</span>, active: drafting.grid, toggle: true },
    { id: 'snap', tabId: 'draft', groupId: 'drafting', groupLabel: 'DRAFTING', order: 20, label: 'SNAP', icon: <span>⌖</span>, active: drafting.snap, toggle: true },
    { id: 'ortho', tabId: 'draft', groupId: 'drafting', groupLabel: 'DRAFTING', order: 30, label: 'ORTHO', icon: <span>⌜</span>, active: drafting.ortho, toggle: true },
    { id: 'polar', tabId: 'draft', groupId: 'drafting', groupLabel: 'DRAFTING', order: 40, label: 'POLAR', icon: <span>∠</span>, active: drafting.polar, toggle: true },
    { id: 'osnap', tabId: 'draft', groupId: 'drafting', groupLabel: 'DRAFTING', order: 50, label: 'OSNAP', icon: <span>✣</span>, active: drafting.osnap, toggle: true },
    { id: 'measure', tabId: 'draft', groupId: 'inquiry', groupLabel: 'INQUIRY', order: 60, label: 'MEASURE', icon: <span>↔</span>, active: activeTool === 'measure', toggle: true },

    { id: 'panel-layout', tabId: 'workspace', groupId: 'panels', groupLabel: 'PANEL LAYOUT', order: 10, label: 'PANEL LAYOUT', icon: <span>▦</span> },
    { id: 'workspace-presets', tabId: 'workspace', groupId: 'presets', groupLabel: 'PRESETS', order: 20, label: 'WORKSPACE PRESETS', icon: <span>▣</span>, badge: workspacePresets.length || undefined }
  ], [activeTool, activeView, drafting, selectionCount, selectionRibbonCommands, viewCubeCollapsed, workspacePresets.length]);

  const handleRibbonCommand = command => {
    const commandId = command?.id;
    if (!commandId) return;

    if (commandId.startsWith('selection.')) {
      applySelectionAction(command);
      return;
    }

    if (commandId === 'panel-layout') {
      report('Workspace', 'Panel layout opened.');
      return;
    }
    if (commandId === 'workspace-presets') {
      report('Workspace', 'Workspace presets opened.');
      return;
    }

    if (Object.prototype.hasOwnProperty.call(drafting, commandId)) {
      const nextActive = !drafting[commandId];
      setDrafting(current => ({ ...current, [commandId]: !current[commandId] }));
      report('Drafting mode', `${commandId.toUpperCase()} ${nextActive ? 'enabled' : 'disabled'}`);
      return;
    }

    if (commandId === 'view-top' || commandId === 'view-iso') {
      const nextView = commandId === 'view-top' ? 'top' : 'iso';
      setActiveView(nextView);
      report('Viewport', `${nextView.toUpperCase()} view active.`);
      return;
    }
    if (commandId === 'viewcube-controls') {
      setViewCubeCollapsed(current => !current);
      return;
    }
    if (commandId === 'zoom-in') {
      setZoom(value => Math.min(1.35, value + 0.1));
      report('Viewport', 'Zoomed in.');
      return;
    }
    if (commandId === 'zoom-out') {
      setZoom(value => Math.max(0.7, value - 0.1));
      report('Viewport', 'Zoomed out.');
      return;
    }
    if (commandId === 'zoom-extents') {
      setZoom(1);
      report('Viewport', 'Zoom extents restored.');
      return;
    }
    if (commandId === 'insert') {
      openWorkspacePanel('blocks');
      report('Command', 'INSERT opened the Blocks palette.');
      return;
    }
    selectTool(command);
  };

  const commandHistory = events.map(event => ({ id: event.id, label: event.message.split(':')[0], detail: event.message.split(':').slice(1).join(':').trim(), tone: event.tone }));
  const menuItems = [
    { id: 'file', label: 'File', items: [{ id: 'new-layout', label: 'New layout', shortcut: 'Ctrl+N' }, { type: 'separator' }, { id: 'export', label: 'Export drawing', shortcut: 'Ctrl+E' }] },
    { id: 'edit', label: 'Edit', items: [{ id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z' }, { id: 'clear-selection', label: 'Clear selection', shortcut: 'Esc' }] },
    { id: 'view', label: 'View', items: [{ id: 'properties', label: 'Properties', checked: activeInspectorTab === 'properties' }, { id: 'blocks', label: 'Blocks', checked: activeInspectorTab === 'blocks' }, { id: 'data', label: 'Data table', checked: activeInspectorTab === 'object-data' }, { id: 'sets', label: 'Selection sets', checked: activeInspectorTab === 'selection-sets' }] },
    { id: 'help', label: 'Help', items: [{ id: 'shortcuts', label: 'Keyboard shortcuts', shortcut: 'F1' }, { id: 'about', label: 'About this sandbox' }] }
  ];

  const handleMenuAction = item => {
    if (!item?.id) return;
    if (item.id === 'new-layout') return addLayout();
    if (item.id === 'clear-selection') return setClearDialogOpen(true);
    const workspacePanelId = { properties: 'properties', blocks: 'blocks', data: 'object-data', sets: 'selection-sets' }[item.id];
    if (workspacePanelId) {
      openWorkspacePanel(workspacePanelId);
      return;
    }
    if (item.id === 'shortcuts' || item.id === 'about') return setHelpOpen(true);
    report('Menu action', `${item.label} is a host-owned command.`);
  };

  const confirmInsert = () => {
    if (!pendingBlock) return;
    setInsertDialogOpen(false);
    setSelectionExtras(current => [...current, {
      id: nextId('inserted-block'),
      label: pendingBlock.label,
      entityType: 'block',
      traits: ['editable', 'transformable', 'block']
    }]);
    setSelectionSource('insert');
    report('Insert complete', `${pendingBlock.label} inserted at ${formatPoint(dynamicPoint)}.`);
    setPendingBlock(null);
  };

  const handleWorkspacePanelPreferenceChange = (id, preference) => {
    if (!preference?.open || preference.placement !== 'dock') return;

    if (preference.dockZone === 'left') {
      setLeftDockTab(id);
      setLeftPanelMode('open');
      return;
    }
    if (preference.dockZone === 'right') {
      setActiveInspectorTab(id);
      setRightPanelMode('open');
      return;
    }
    if (preference.dockZone === 'bottom') {
      setBottomDockTab(id);
      setBottomPanelMode('open');
    }
  };

  const openWorkspacePanel = id => {
    const panel = WORKSPACE_PANEL_DECLARATIONS.find(candidate => candidate.id === id);
    if (!panel) return;
    const currentPreference = workspacePanelPreferences[id] || {};
    const preference = {
      ...currentPreference,
      open: true,
      placement: 'dock',
      dockZone: currentPreference.dockZone || panel.defaultDockZone
    };
    setWorkspacePanelPreferences(current => ({ ...current, [id]: preference }));
    handleWorkspacePanelPreferenceChange(id, preference);
  };

  const handleWorkspacePanelLayoutReset = nextPreferences => {
    const restoredPanels = groupCadWorkspacePanelsByDockZone(WORKSPACE_PANEL_DECLARATIONS, nextPreferences);
    const restoredLeftId = activeDockPanelId(restoredPanels.left, 'tool-palette');
    const restoredRightId = activeDockPanelId(restoredPanels.right, '');
    const restoredBottomId = activeDockPanelId(restoredPanels.bottom, '');

    // Preferences express the desired physical edge, while these host-owned
    // mode states decide whether that edge is actually visible. Re-open every
    // edge receiving a restored panel so Reset does not leave it in rail/closed.
    if (restoredLeftId) {
      setLeftDockTab(restoredLeftId);
      setLeftPanelMode('open');
    }
    if (restoredRightId) {
      setActiveInspectorTab(restoredRightId);
      setRightPanelMode('open');
    }
    if (restoredBottomId) {
      setBottomDockTab(restoredBottomId);
      setBottomPanelMode('open');
    }
  };

  const workspacePanelContent = {
    'tool-palette': <section className="cad-demo__workspace-panel" aria-label="Tool Palette panel">
      <CadToolPalette groups={toolbarGroups.slice(0, 2)} onAction={selectTool} layout="auto" />
    </section>,
    'object-snaps': <section className="cad-demo__workspace-panel" aria-label="Object Snaps panel">
      <CadObjectSnapMenu activeIds={snapIds} onChange={setSnapIds} />
    </section>,
    constraints: <section className="cad-demo__workspace-panel cad-demo__constraints-pane" aria-label="Constraints panel">
      <CadConstraintBar activeIds={constraintIds} onChange={setConstraintIds} layout="auto" />
    </section>,
    layers: <section className="cad-demo__workspace-panel" aria-label="Layers panel">
      <CadLayerPanel
        layers={layers}
        activeLayerId={activeLayerId}
        onActiveLayerChange={id => { setActiveLayerId(id); setPropertyState(current => ({ ...current, layer: id })); }}
        onLayerChange={updateLayer}
        onAddLayer={() => report('Layers', 'Add layer requested.')}
        onDeleteLayer={() => report('Layers', 'Delete layer requested.')}
      />
    </section>,
    properties: <section className="cad-demo__workspace-panel cad-demo__properties-pane" aria-label="Properties panel">
      {quickPropertiesOpen ? <CadQuickProperties
        title="Current properties"
        properties={propertyDefinitions}
        pinned={quickPropertiesPinned}
        onPinChange={setQuickPropertiesPinned}
        onClose={() => { setQuickPropertiesOpen(false); report('Palette', 'Quick properties hidden.'); }}
        onValueChange={(id, value) => {
          setPropertyState(current => ({ ...current, [id]: value }));
          if (id === 'layer') setActiveLayerId(value);
          report('Property', `${id} changed.`);
        }}
      /> : <button type="button" className="cad-demo__restore-palette" onClick={() => setQuickPropertiesOpen(true)}>Restore properties</button>}
      <CadDockPanel title="Object style" collapsible defaultCollapsed>
        <div className="cad-demo__panel-controls">
          <CadColorPickerButton value={propertyState.color} label="Object color" onChange={color => { setPropertyState(current => ({ ...current, color })); report('Style', 'Color changed.'); }} />
          <CadLinetypePicker value={propertyState.linetype} onChange={linetype => { setPropertyState(current => ({ ...current, linetype })); report('Style', 'Linetype changed.'); }} />
          <CadLineweightPicker value={propertyState.lineweight} onChange={lineweight => { setPropertyState(current => ({ ...current, lineweight })); report('Style', 'Lineweight changed.'); }} />
        </div>
      </CadDockPanel>
    </section>,
    blocks: <section className="cad-demo__workspace-panel cad-demo__blocks-pane" aria-label="Blocks panel">
      <CadBlockPalette
        blocks={BLOCKS}
        value={selectedBlockId}
        onChange={setSelectedBlockId}
        onInsert={block => { setPendingBlock(block); setInsertDialogOpen(true); }}
        onCreate={() => report('Block library', 'New block definition requested.')}
        title="Block library"
      />
    </section>,
    'object-data': <section className="cad-demo__workspace-panel cad-demo__data-pane" aria-label="Object Data panel">
      <CadDataGrid
        layout="auto"
        caption="Object extraction data"
        columns={[
          { id: 'entity', label: 'Entity', accessor: 'entity', sortable: true },
          { id: 'layer', label: 'Layer', accessor: 'layer', sortable: true },
          { id: 'length', label: 'Length', accessor: 'length', align: 'end', sortable: true },
          { id: 'status', label: 'State', accessor: 'status' }
        ]}
        rows={OBJECT_ROWS}
        selectedIds={selectedRowIds}
        onSelectionChange={(ids, row) => {
          selectRows(ids, 'data-grid');
          if (row) report('Data selection', `${row.entity} toggled.`);
        }}
        onRowActivate={row => report('Data selection', `${row.entity} activated.`)}
      />
    </section>,
    selection: <section className="cad-demo__workspace-panel cad-demo__selection-pane" aria-label="Selection panel">
      <CadDockPanel title="Live selection" collapsible>
        <CadSelectionSummary count={selectionCount} entityLabel="objects" fields={[{ label: 'Layer', value: layers.find(layer => layer.id === propertyState.layer)?.label || 'A-WALL' }, { label: 'Tool', value: activeTool.toUpperCase() }]} />
        <CadMeasureReadout distance="4200 mm" angle="90°" area="12.40 m²" />
      </CadDockPanel>
      <CadSelectionFilter
        filters={[{ id: 'line', label: 'Lines', count: 12 }, { id: 'arc', label: 'Arcs', count: 4 }, { id: 'block', label: 'Blocks', count: 7 }, { id: 'dimension', label: 'Dims', count: 9 }]}
        activeIds={selectionFilterIds}
        onChange={setSelectionFilterIds}
      />
      <CadSelectionCycler
        layout="auto"
        candidates={[{ id: 'line-01', label: 'Line 01', detail: 'A-WALL · 4200 mm' }, { id: 'arc-02', label: 'Arc 02', detail: 'A-DOOR · 1414 mm' }, { id: 'block-03', label: 'Block 03', detail: 'A-FURN' }]}
        onAccept={candidate => { selectRows([candidate.id], 'selection-cycler'); report('Selection', `${candidate.label} accepted.`); }}
        onCancel={() => report('Selection', 'Cycle cancelled.')}
      />
    </section>,
    'selection-sets': <section className="cad-demo__workspace-panel cad-demo__sets-pane" aria-label="Selection Sets panel">
      <CadSelectionSetPanel
        sets={selectionSets}
        activeId={activeSelectionSetId}
        filter={selectionSetFilter}
        onFilterChange={setSelectionSetFilter}
        onChange={(id, selectionSet) => {
          setActiveSelectionSetId(id);
          record(`Selection set: ${selectionSet?.label || id} active.`);
        }}
        onApply={selectionSet => {
          const count = Number(selectionSet?.count ?? 0);
          const entityType = selectionSet?.id === 'annotations' ? 'dimension' : '';
          const traits = selectionSet?.locked ? ['locked'] : ['editable'];
          setSelectedRowIds([]);
          setSelectionExtras(Array.from({ length: Math.max(0, count) }, (_, index) => ({
            id: `${selectionSet?.id || 'selection-set'}-${index + 1}`,
            label: selectionSet?.label || 'Selection set item',
            entityType,
            traits
          })));
          setSelectionSource('selection-set');
          report('Selection set', `${selectionSet.label} applied (${count} objects).`);
        }}
        onCreate={() => {
          const id = nextId('selection-set');
          const selectionSet = {
            id,
            label: `Current selection ${selectionSets.length + 1}`,
            description: 'A host-owned snapshot from the sandbox',
            group: 'Session',
            count: selectionCount
          };
          setSelectionSets(current => [...current, selectionSet]);
          setActiveSelectionSetId(id);
          report('Selection set', `${selectionSet.label} created.`);
        }}
        onRename={selectionSet => report('Selection set', `Rename request for ${selectionSet.label} sent to the host.`)}
        onDelete={selectionSet => {
          const fallbackId = selectionSets.find(item => item.id !== selectionSet.id)?.id || '';
          setSelectionSets(current => current.filter(item => item.id !== selectionSet.id));
          setActiveSelectionSetId(current => current === selectionSet.id ? fallbackId : current);
          report('Selection set', `${selectionSet.label} deleted.`);
        }}
      />
      <CadDockPanel title="Host boundary" collapsible defaultCollapsed>
        <p className="cad-demo__sets-note">Named sets are plain records. The host decides how a selected set maps to real drawing entities.</p>
      </CadDockPanel>
    </section>,
    'view-scale': <section className="cad-demo__workspace-panel cad-demo__view-scale-pane" aria-label="View and Scale panel" data-space={isModelSpace ? 'model' : 'layout'}>
      <CadDockPanel key="view-scale-display" title={isModelSpace ? 'Model display' : 'Viewport display'}>
        <div className="cad-demo__panel-controls">
          <CadVisualStylePicker value={visualStyle} label="Display" onChange={style => { setVisualStyle(style); report('Viewport', `Visual style ${style}.`); }} />
          {!isModelSpace && <CadViewportScalePicker value={viewportScale} label="Viewport scale" onChange={scale => { setViewportScale(scale); report('Viewport', `Viewport scale ${scale}.`); }} onManage={() => report('Viewport', 'Scale management requested.')} />}
        </div>
        <p className="cad-demo__view-scale-hint">{isModelSpace ? 'Viewport scale is configured in a Layout tab.' : 'Annotation scale is configured in Model Space.'}</p>
      </CadDockPanel>
      {isModelSpace && <CadDockPanel key="view-scale-annotation" title="Annotation scale">
        <CadAnnotationScalePicker value={propertyState.annotationScale} label="Annotation scale" onChange={annotationScale => { setPropertyState(current => ({ ...current, annotationScale })); report('Viewport', `Annotation scale ${annotationScale}.`); }} />
      </CadDockPanel>}
    </section>,
    command: <section className="cad-demo__workspace-panel cad-demo-command-panel" aria-label="Command panel">
      <div className="cad-demo-command-dock__line" data-command-height={commandLineHeight} style={{ '--cad-demo-command-height': `${commandLineHeight}px` }}>
        <CadCommandLine
          height={commandLineHeight}
          defaultHeight={144}
          minHeight={72}
          maxHeight={360}
          onHeightChange={nextHeight => {
            const nextCommandHeight = Math.max(72, Math.min(360, Math.round(Number(nextHeight) || 144)));
            setCommandLineHeight(nextCommandHeight);
            setBottomDockHeight(current => Math.max(current, nextCommandHeight + 76));
          }}
          prompt="Command:"
          suggestions={[{ id: 'line', label: 'LINE', detail: 'Draw a straight segment' }, { id: 'circle', label: 'CIRCLE', detail: 'Draw a circle' }, { id: 'insert', label: 'INSERT', detail: 'Open Blocks palette' }, { id: 'move', label: 'MOVE', detail: 'Move selected objects' }]}
          history={commandHistory}
          options={[{ id: 'undo', label: 'Undo' }, { id: 'close', label: 'Close' }, { id: 'help', label: 'Help', shortcut: 'F1' }]}
          onSubmit={runCommand}
          onOptionSelect={option => {
            if (option.id === 'help') return setHelpOpen(true);
            if (option.id === 'close') return setDockMode('Command bar', setBottomPanelMode)('closed');
            report('Command option', option.label);
          }}
        />
      </div>
    </section>,
    activity: <section className="cad-demo-bottom-activity" aria-label="Command activity">
      <header><span>COMMAND ACTIVITY</span><output>{events.length} EVENTS</output></header>
      <ol>{events.map(event => <li key={event.id} data-tone={event.tone}><span>{event.message}</span></li>)}</ol>
    </section>,
    layouts: <section className="cad-demo-bottom-layouts" aria-label="Drawing layouts">
      <CadWorkspaceProfileTabs profiles={profiles} activeId={activeProfileId} onChange={setActiveProfileId} onCreate={addLayout} onClose={closeProfile} />
      <CadDockPanel title="Active space" collapsible>
        <CadSelectionSummary count={selectionCount} entityLabel="selected objects" fields={[
          { label: 'Space', value: activeProfile?.name || 'Model' },
          { label: isModelSpace ? 'Annotation scale' : 'Viewport scale', value: isModelSpace ? propertyState.annotationScale : viewportScale }
        ]} />
      </CadDockPanel>
    </section>,
    'drafting-modes': <section className="cad-demo__workspace-panel cad-demo__drafting-pane" aria-label="Drafting Modes panel">
      <CadStatusBar layout="tiles" coordinates={dynamicPoint} units="mm" scale={isModelSpace ? propertyState.annotationScale : undefined} message={`${activeTool.toUpperCase()} · ${snapIds.length} snaps · ${constraintIds.length} constraints`} modes={[
        { id: 'grid', label: 'GRID', active: drafting.grid }, { id: 'snap', label: 'SNAP', active: drafting.snap }, { id: 'ortho', label: 'ORTHO', active: drafting.ortho }, { id: 'polar', label: 'POLAR', active: drafting.polar, tone: 'amber' }, { id: 'osnap', label: 'OSNAP', active: drafting.osnap, tone: 'magenta' }
      ]} onModeChange={(id, active) => { setDrafting(current => ({ ...current, [id]: active })); record(`${id.toUpperCase()} ${active ? 'enabled' : 'disabled'}.`); }} />
    </section>
  };

  const workspacePanelDefinitions = WORKSPACE_PANEL_DECLARATIONS.map(panel => ({
    ...panel,
    content: workspacePanelContent[panel.id]
  }));

  const workspacePanelsByDockZone = groupCadWorkspacePanelsByDockZone(workspacePanelDefinitions, workspacePanelPreferences);
  const leftDockPanels = workspacePanelsByDockZone.left;
  const rightDockPanels = workspacePanelsByDockZone.right;
  const bottomDockPanels = workspacePanelsByDockZone.bottom;

  const leftDockZone = <CadWorkspaceDockZone
    id="cad-demo-tools-zone"
    edge="left"
    label="Tools dock panels"
    tabsLabel="Tools dock panels"
    panels={leftDockPanels}
    activeId={activeDockPanelId(leftDockPanels, leftDockTab)}
    onActiveChange={id => setLeftDockTab(id)}
    compactTabs
    className="cad-demo-dock-zone cad-demo-dock-zone--tools"
  />;

  const rightDockZone = <CadWorkspaceDockZone
    id="cad-demo-inspector-zone"
    edge="right"
    label="Inspector dock panels"
    tabsLabel="Inspector dock panels"
    panels={rightDockPanels}
    activeId={activeDockPanelId(rightDockPanels, activeInspectorTab)}
    onActiveChange={id => setActiveInspectorTab(id)}
    compactTabs
    className="cad-demo-dock-zone cad-demo-dock-zone--inspector"
  />;

  const bottomDockZone = <CadWorkspaceDockZone
    id="cad-demo-command-zone"
    edge="bottom"
    label="Command dock panels"
    tabsLabel="Command dock panels"
    panels={bottomDockPanels}
    activeId={activeDockPanelId(bottomDockPanels, bottomDockTab)}
    onActiveChange={id => setBottomDockTab(id)}
    compactTabs
    className="cad-demo-dock-zone cad-demo-dock-zone--command"
  />;

  return <main className="cad-demo-page" data-focus-mode={focusMode ? 'true' : 'false'}>
    <section className="cad-demo-workbench" data-focus-mode={focusMode ? 'true' : 'false'} aria-label="CAD CUI interactive playground">
      <header className="cad-demo-header">
        <div className="cad-demo-header__left">
          <CadMenuBar
            items={menuItems}
            onAction={handleMenuAction}
            endSlotLabel="Application identity"
            endSlot={<div className="cad-demo-header__brand"><span aria-hidden="true">◫</span><strong>CAD CUI</strong><em>INTERACTION SANDBOX</em></div>}
          />
        </div>
        <form className="cad-demo-header__search" role="search" aria-label="Workspace search" onSubmit={submitHeaderSearch}>
          <span className="cad-demo-header__search-icon" aria-hidden="true">⌕</span>
          <input type="search" value={headerSearch} onChange={event => setHeaderSearch(event.target.value)} aria-label="Search CAD interface" placeholder="Search commands, panels, or help" />
          {headerSearch ? <button type="button" className="cad-demo-header__search-clear" aria-label="Clear header search" onClick={() => setHeaderSearch('')}>×</button> : <kbd aria-hidden="true">ENTER</kbd>}
        </form>
        <div className="cad-demo-header__right" role="group" aria-label="Application status and workspace controls">
          <div className="cad-demo-header__status"><span>ENGINE: <b>NOT CONNECTED</b></span><output>UI STATE: LIVE</output><CadTooltip content="This playground is a real React UI sandbox; it intentionally does not draw CAD geometry."><button type="button" className="cad-demo-header__help" aria-label="Open playground help" onClick={() => setHelpOpen(true)}>?</button></CadTooltip></div>
          <div className="cad-demo-menu-chrome">
            <CadWorkspaceChromeControls
              className="cad-demo-menu-chrome__quick-actions"
              label="Quick workspace controls"
              items={workspaceChromeItems}
            />
            <CadPopover
              label="Workspace layout"
              contentRole="dialog"
              placement="bottom-end"
              className="cad-demo-menu-chrome__layout-popover"
              contentClassName="cad-demo-menu-chrome__layout-surface"
              trigger={<button
                type="button"
                className="cad-workspace-chrome-controls__item cad-demo-menu-chrome__layout-trigger"
                aria-label="Customize workspace layout"
                title="Customize workspace layout"
              ><span className="cad-workspace-chrome-controls__icon" aria-hidden="true">▦</span></button>}
              content={<section className="cad-demo-menu-chrome__layout-content">
                <header>
                  <span>WORKSPACE</span>
                  <h2>Layout controls</h2>
                  <p>Choose an explicit Open, Rail, or Hide state for every dock.</p>
                </header>
                <div className="cad-demo-menu-chrome__layout-modes">
                  <section><span>Tools panel</span><CadWorkspaceDockModeControl label="Tools panel" controls="cad-demo-tools-panel" mode={leftPanelMode} onModeChange={setDockMode('Tools panel', setLeftPanelMode)} /></section>
                  <section><span>Command bar</span><CadWorkspaceDockModeControl label="Command bar" controls="cad-demo-command-bar" mode={bottomPanelMode} onModeChange={setDockMode('Command bar', setBottomPanelMode)} /></section>
                  <section><span>Inspector panel</span><CadWorkspaceDockModeControl label="Inspector panel" controls="cad-demo-inspector-panel" mode={rightPanelMode} onModeChange={setDockMode('Inspector panel', setRightPanelMode)} /></section>
                </div>
                <button type="button" className="cad-demo-menu-chrome__layout-reset" onClick={resetDockLayout}><span aria-hidden="true">↺</span>Reset dock layout</button>
              </section>}
            />
          </div>
        </div>
      </header>

      <section className="cad-demo-ribbon" aria-label="Command ribbon">
        <CadWorkspaceRibbon
          className="cad-demo-ribbon__workspace"
          tabs={workspaceRibbonTabs}
          commands={workspaceRibbonCommands}
          activeTab={ribbonTab}
          compact
          identity={<span className="cad-demo-ribbon__identity"><b>COMMAND</b><em>MODULES</em></span>}
          status={`ACTIVE: ${activeTool.toUpperCase()} · ${activeView.toUpperCase()} · ${isModelSpace ? `ANNO ${propertyState.annotationScale}` : `VIEW ${viewportScale}`}`}
          endSlot={<div className="cad-demo-ribbon__styles" role="group" data-space={isModelSpace ? 'model' : 'layout'} aria-label={isModelSpace ? 'Model Space drawing style controls' : 'Layout viewport style controls'}>
            <span>STYLE / {isModelSpace ? 'MODEL' : 'LAYOUT'}</span>
            <CadColorPickerButton value={propertyState.color} label="Object color" onChange={color => { setPropertyState(current => ({ ...current, color })); report('Style', 'Color changed.'); }} />
            <CadLinetypePicker value={propertyState.linetype} onChange={linetype => { setPropertyState(current => ({ ...current, linetype })); report('Style', 'Linetype changed.'); }} />
            <CadLineweightPicker value={propertyState.lineweight} onChange={lineweight => { setPropertyState(current => ({ ...current, lineweight })); report('Style', 'Lineweight changed.'); }} />
            {isModelSpace && <CadAnnotationScalePicker layout="inline" value={propertyState.annotationScale} onChange={annotationScale => { setPropertyState(current => ({ ...current, annotationScale })); report('Style', `Annotation scale ${annotationScale}.`); }} label="ANNO SCALE" selectProps={{ 'aria-label': 'Annotation scale' }} title="Text and dimension annotation scale" />}
            <CadVisualStylePicker value={visualStyle} label="Display" onChange={style => { setVisualStyle(style); report('Viewport', `Visual style ${style}.`); }} />
            {!isModelSpace && <CadViewportScalePicker value={viewportScale} label="VIEW SCALE" selectProps={{ 'aria-label': 'Viewport scale' }} title="Paper-space viewport scale" onChange={scale => { setViewportScale(scale); report('Viewport', `Viewport scale ${scale}.`); }} />}
            <CadPopover label="Sandbox scope" trigger={<button type="button" className="cad-demo-ribbon__scope">UI ONLY</button>} content={<p className="cad-demo-popover-copy">The SVG viewport is a neutral canvas stand-in. Every control here emits and retains host-owned React state.</p>} />
          </div>}
          onActiveTabChange={(id, tab, event) => {
            setRibbonTab(id);
            if (event?.type === 'pointerenter' || event?.type === 'focus') return;
            record(`Ribbon: ${tab?.label || id} tab active.`);
          }}
          onMinimizedChange={minimized => record(`Ribbon: ${minimized ? 'compact' : 'expanded'}.`)}
          renderCommand={(command, { execute, icon, buttonProps }) => {
            if (command?.id === 'workspace-presets') {
              return <CadPopover
                label="Workspace presets"
                contentRole="dialog"
                placement="bottom-start"
                className="cad-demo-ribbon__workspace-presets"
                contentClassName="cad-workspace-preset-manager__surface"
                trigger={<button
                  {...buttonProps}
                  className="cad-workspace-preset-manager__trigger"
                  aria-label="Workspace presets"
                  title="Workspace presets"
                  onClick={execute}
                >
                  <span className="cad-workspace-preset-manager__trigger-icon" aria-hidden="true">{icon}</span>
                  <span className="cad-workspace-preset-manager__trigger-label">Workspace presets</span>
                  {workspacePresets.length > 0 && <output aria-label={`${workspacePresets.length} saved presets`}>{workspacePresets.length}</output>}
                </button>}
                content={<CadWorkspacePresetManager
                  presets={workspacePresets}
                  selectedPresetId={selectedWorkspacePresetId}
                  draftName={workspacePresetDraftName}
                  onSelectedPresetIdChange={id => setSelectedWorkspacePresetId(id)}
                  onDraftNameChange={setWorkspacePresetDraftName}
                  onSaveAs={handleWorkspacePresetSaveAs}
                  onLoad={handleWorkspacePresetLoad}
                  onOverwrite={handleWorkspacePresetOverwrite}
                  onDelete={handleWorkspacePresetDelete}
                  onExport={handleWorkspacePresetExport}
                  onImport={handleWorkspacePresetImport}
                  status={workspacePresetStatus.message}
                  statusTone={workspacePresetStatus.tone}
                  title="Workspace presets"
                  description="Save the current CAD UI arrangement, restore it later, or exchange it as JSON."
                  importDescription="Imports are validated before they change the saved preset list."
                />}
              />;
            }
            if (command?.id !== 'panel-layout') return undefined;
            return <CadWorkspacePanelManager
              panels={workspacePanelDefinitions}
              value={workspacePanelPreferences}
              onChange={setWorkspacePanelPreferences}
              onPanelChange={handleWorkspacePanelPreferenceChange}
              onResetAll={handleWorkspacePanelLayoutReset}
              renderTrigger={({ visibleCount }) => <button
                {...buttonProps}
                className="cad-workspace-panel-manager__trigger"
                aria-label="Panel layout"
                title="Panel layout"
                onClick={execute}
              >
                <span className="cad-workspace-panel-manager__trigger-icon" aria-hidden="true">{icon}</span>
                <span className="cad-workspace-panel-manager__trigger-label">Panel layout</span>
                <output aria-label={`${visibleCount} visible panels`}>{visibleCount}</output>
              </button>}
              title="Panel layout"
              description="Host-owned visibility and physical dock-zone preferences for the workspace panels."
              triggerLabel="Panel layout"
              triggerIcon="▦"
              scope="DEMO HOST"
              placement="bottom-start"
              resetAllLabel="Restore panel layout"
              className="cad-demo-ribbon__panel-layout"
            />;
          }}
          onCommand={handleRibbonCommand}
        />
      </section>

      <section className="cad-demo-main-stage">
        <section
          className="cad-demo-workspace"
          style={workspaceStyle}
          data-left-panel={leftPanelMode}
          data-right-panel={rightPanelMode}
          data-left-width={leftDockWidth}
          data-right-width={rightDockWidth}
        >
          {leftPanelMode !== 'closed' && <aside id="cad-demo-tools-panel" className="cad-demo-left-rail" data-mode={leftPanelMode} aria-label="Tools panel">
            {leftPanelMode === 'rail' ? <CadWorkspaceDockRail
              id="cad-demo-tools-rail"
              edge="left"
              label="Tools panel"
              previewLabel="Tools panel preview"
              expandLabel="Open Tools panel"
              className="cad-demo-dock-rail cad-demo-dock-rail--left"
              railClassName="cad-demo-dock-rail__button"
              previewClassName="cad-demo-dock-rail__preview"
              onExpand={() => setDockMode('Tools panel', setLeftPanelMode)('open')}
            >{leftDockZone}</CadWorkspaceDockRail> : leftDockZone}
          </aside>}

          {!focusMode && leftPanelMode === 'open' && <CadWorkspaceDockResizeHandle
            className="cad-demo-dock-resize-handle cad-demo-dock-resize-handle--left"
            size={leftDockWidth}
            minSize={DOCK_SIZE_LIMITS.left.min}
            maxSize={DOCK_SIZE_LIMITS.left.max}
            resizeStep={16}
            edge="left"
            label="Resize Tools panel"
            separatorLabel="Resize Tools panel"
            controls="cad-demo-tools-panel"
            onSizeChange={nextSize => setLeftDockWidth(clampDockSize(nextSize, DOCK_SIZE_LIMITS.left, DEFAULT_DOCK_LAYOUT.leftWidth))}
          />}

          <section
            ref={viewportRef}
            className="cad-demo-viewport"
            data-cad-shortcut-scope="true"
            data-space={isModelSpace ? 'model' : 'layout'}
            data-visual-style={visualStyle}
            data-viewport-scale={viewportScale}
            aria-label="SVG drawing viewport mockup"
            aria-keyshortcuts="M O Q R X Delete Control+1 Shift+F10"
            tabIndex={0}
            onPointerDown={event => {
              if (!isViewportInteractiveTarget(event.target)) viewportRef.current?.focus({ preventScroll: true });
            }}
            onContextMenu={handleViewportContextMenu}
          >
            <div className="cad-demo-viewport__meta"><span>{activeSpaceLabel} / {activeView.toUpperCase()} / {visualStyle.toUpperCase()}</span><span>{Math.round(zoom * 100)}%{!isModelSpace && ` · VP ${viewportScale}`}</span></div>
            {focusMode && <aside className="cad-demo-focus-hud" aria-label="Focus mode controls">
              <span className="cad-demo-focus-hud__state"><i aria-hidden="true">◉</i> FOCUS / {activeSpaceLabel}</span>
              <CadWorkspaceFocusToggle
                ref={focusExitRef}
                className="cad-demo-focus-hud__exit"
                aria-keyshortcuts="Escape Control+0"
                active={focusMode}
                onActiveChange={nextActive => nextActive ? enterFocusMode() : exitFocusMode()}
                label="Enter Focus Mode"
                activeLabel="Exit Focus Mode"
                shortcut="Esc"
              />
            </aside>}
            <svg className="cad-demo-viewport__drawing" style={{ transform: `scale(${zoom * (isModelSpace ? 1 : (VIEWPORT_SCALE_FACTORS[viewportScale] || 1))})` }} viewBox="0 0 1000 620" role="img" aria-label="Technical drawing mockup">
              <defs><pattern id="cad-demo-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M 25 0 L 0 0 0 25" fill="none" stroke="currentColor" strokeWidth="0.6" /></pattern></defs>
              <rect width="1000" height="620" fill="url(#cad-demo-grid)" className="cad-demo-grid" />
              <g className="cad-demo-plan" fill="none">
                <path d="M190 135H765V470H190Z M318 135V274H190 M520 135V253H765 M520 253H765 M318 350H630V470" />
                <path d="M190 274H318 A76 76 0 0 1 242 350 M630 470V350 A120 120 0 0 1 750 470" className="cad-demo-plan__door" />
                <path d="M318 168H468 M538 168H690 M214 404H294 M362 404H522" className="cad-demo-plan__window" />
                <rect x="388" y="294" width="154" height="72" rx="2" className="cad-demo-plan__furniture" />
                <path d="M405 382H526 M465 294V366" className="cad-demo-plan__furniture" />
                <path d="M160 111H794 M160 99V123 M794 99V123" className="cad-demo-plan__dimension" />
                <text x="430" y="93" className="cad-demo-plan__label">8400</text>
                <path d="M810 135V470 M798 135H822 M798 470H822" className="cad-demo-plan__dimension" />
                <text x="832" y="310" transform="rotate(90 832 310)" className="cad-demo-plan__label">5600</text>
              </g>
            </svg>
            <div className="cad-demo-viewport__controls" data-fixed="true"><CadViewportControls collapsible collapsed={viewCubeCollapsed} onCollapsedChange={setViewCubeCollapsed} activeView={activeView} onViewChange={view => { setActiveView(view); record(`Viewport: ${String(view).toUpperCase()} view active.`); }} onZoomIn={() => { setZoom(value => Math.min(1.35, value + 0.1)); record('Viewport: Zoomed in.'); }} onZoomOut={() => { setZoom(value => Math.max(0.7, value - 0.1)); record('Viewport: Zoomed out.'); }} onZoomExtents={() => { setZoom(1); record('Viewport: Zoom extents restored.'); }} /></div>
            <CadMovableOverlay
              className="cad-demo-viewport__navigation"
              label="Viewport navigation dock"
              edge="top"
              handleIcon="⌖"
              position={navigationOverlayPosition}
              onPositionChange={setNavigationOverlayPosition}
              collapsed={navigationOverlayCollapsed}
              onCollapsedChange={setNavigationOverlayCollapsed}
            >
              <CadNavigationBar
                activeId={navigationMode}
                onActiveChange={id => setNavigationMode(id)}
                onPan={() => record('Navigation: Pan mode toggled.')}
                onZoomIn={() => { setZoom(value => Math.min(1.35, value + 0.1)); record('Navigation: Zoomed in.'); }}
                onZoomOut={() => { setZoom(value => Math.max(0.7, value - 0.1)); record('Navigation: Zoomed out.'); }}
                onZoomWindow={() => record('Navigation: Zoom window requested.')}
                onZoomExtents={() => { setZoom(1); record('Navigation: Zoom extents restored.'); }}
                onOrbit={() => record('Navigation: Orbit mode toggled.')}
                onHome={() => { setActiveView('top'); setZoom(1); report('Navigation', 'Home view restored.'); }}
              />
            </CadMovableOverlay>
            <CadMovableOverlay
              className="cad-demo-viewport__selection-overlay"
              label="Selection summary"
              edge="left"
              handleIcon="▣"
              position={selectionSummaryOverlayPosition}
              onPositionChange={setSelectionSummaryOverlayPosition}
              collapsed={selectionSummaryOverlayCollapsed}
              onCollapsedChange={setSelectionSummaryOverlayCollapsed}
            >
              <CadSelectionSummary className="cad-demo-viewport__selection" count={selectionCount} entityLabel="objects" fields={[{ label: 'Tool', value: activeTool.toUpperCase() }]} />
            </CadMovableOverlay>
            <CadMeasureReadout className="cad-demo-viewport__measure" distance="4200 mm" angle="90°" />
            <CadMovableOverlay
              className="cad-demo-viewport__command-overlay"
              label="Viewport command console"
              edge="left"
              handleIcon=">_"
              position={dynamicInputOverlayPosition}
              onPositionChange={setDynamicInputOverlayPosition}
              collapsed={dynamicInputOverlayCollapsed}
              onCollapsedChange={setDynamicInputOverlayCollapsed}
            >
              <CadCommandLine
                className="cad-demo-viewport__command-console"
                height={48}
                minHeight={48}
                maxHeight={48}
                resizable={false}
                showHistory={false}
                label="Viewport command console"
                prompt=">"
                placeholder="MOVE: 10,30,50"
                inputProps={{ 'aria-label': 'Dynamic CAD command' }}
                onSubmit={runViewportCommand}
              />
            </CadMovableOverlay>
            <CadPolarTracker className="cad-demo-viewport__polar" angle="45°" increment="15°" distance="1200 mm" active={drafting.polar} onActiveChange={polar => setDrafting(current => ({ ...current, polar }))} />
            <CadGripToolbar
              className="cad-demo-viewport__grip-tools"
              label="Selection actions"
              selectionCount={selectionCount}
              tools={selectionToolbarTools}
              onAction={applySelectionAction}
            />
            {selectionCount > 0 && <button
              type="button"
              className="cad-demo-viewport__radial-trigger"
              aria-label="Open radial selection menu"
              aria-haspopup="menu"
              aria-expanded={Boolean(selectionRadialMenuPosition)}
              title={`${selectionRadialMenuPosition ? 'Close' : 'Open'} radial selection menu · Q`}
              onClick={() => selectionRadialMenuPosition ? setSelectionRadialMenuPosition(null) : openSelectionRadialMenu()}
            ><span aria-hidden="true">◎</span><strong>RADIAL</strong><kbd>Q</kbd></button>}
            <CadRadialMenu
              className="cad-demo-viewport__selection-radial"
              open={Boolean(selectionRadialMenuPosition)}
              position={selectionRadialMenuPosition || { x: 0, y: 0 }}
              items={selectionContextActions}
              label="Selection radial menu"
              centerLabel={`${selectionCount} SELECTED`}
              menuRef={selectionRadialMenuRef}
              restoreFocusRef={viewportRef}
              onAction={handleSelectionMenuAction}
              onClose={() => setSelectionRadialMenuPosition(null)}
            />
            <CadContextMenuPopup
              className="cad-demo-viewport__selection-context"
              open={Boolean(selectionContextMenuPosition)}
              position={selectionContextMenuPosition || { x: 0, y: 0 }}
              items={selectionContextActions}
              label="Selection context menu"
              menuRef={selectionContextMenuRef}
              restoreFocusRef={viewportRef}
              onAction={handleSelectionMenuAction}
              onClose={() => setSelectionContextMenuPosition(null)}
            />
            <CadObjectSnapMarker className="cad-demo-viewport__snap-marker" type="endpoint" label="Endpoint" />
            <CadSelectionGrip className="cad-demo-viewport__grip cad-demo-viewport__grip--one" label="Move selected object" active onClick={() => report('Grip', 'Base grip activated.')} />
            <CadSelectionGrip className="cad-demo-viewport__grip cad-demo-viewport__grip--two" label="Stretch selected object" onClick={() => report('Grip', 'Stretch grip activated.')} />
          </section>

          {rightPanelMode !== 'closed' && <aside id="cad-demo-inspector-panel" className="cad-demo-inspector" data-mode={rightPanelMode} aria-label="Inspector panel">
            {rightPanelMode === 'rail' ? <CadWorkspaceDockRail
              id="cad-demo-inspector-rail"
              edge="right"
              label="Inspector panel"
              previewLabel="Inspector panel preview"
              expandLabel="Open Inspector panel"
              className="cad-demo-dock-rail cad-demo-dock-rail--right"
              railClassName="cad-demo-dock-rail__button"
              previewClassName="cad-demo-dock-rail__preview"
              onExpand={() => setDockMode('Inspector panel', setRightPanelMode)('open')}
            >{rightDockZone}</CadWorkspaceDockRail> : rightDockZone}
          </aside>}

          {!focusMode && rightPanelMode === 'open' && <CadWorkspaceDockResizeHandle
            className="cad-demo-dock-resize-handle cad-demo-dock-resize-handle--right"
            size={rightDockWidth}
            minSize={DOCK_SIZE_LIMITS.right.min}
            maxSize={DOCK_SIZE_LIMITS.right.max}
            resizeStep={16}
            edge="right"
            label="Resize Inspector panel"
            separatorLabel="Resize Inspector panel"
            controls="cad-demo-inspector-panel"
            onSizeChange={nextSize => setRightDockWidth(clampDockSize(nextSize, DOCK_SIZE_LIMITS.right, DEFAULT_DOCK_LAYOUT.rightWidth))}
          />}

        </section>

        <section
          id="cad-demo-command-bar"
          className="cad-demo-bottom-dock"
          aria-label="Command bar"
          data-mode={bottomPanelMode}
          data-dock-height={bottomDockHeight}
          style={{ '--cad-demo-bottom-dock-height': `${bottomDockHeight}px` }}
        >
          {bottomPanelMode === 'open' && <>
            {!focusMode && <CadWorkspaceDockResizeHandle
              className="cad-demo-dock-resize-handle cad-demo-dock-resize-handle--bottom cad-demo-bottom-dock__resize"
              size={bottomDockHeight}
              minSize={Math.max(DOCK_SIZE_LIMITS.bottom.min, commandLineHeight + 76)}
              maxSize={DOCK_SIZE_LIMITS.bottom.max}
              resizeStep={16}
              edge="bottom"
              label="Resize Command bar"
              separatorLabel="Resize Command bar"
              controls="cad-demo-command-bar"
              onSizeChange={nextSize => setBottomDockHeight(clampDockSize(nextSize, { ...DOCK_SIZE_LIMITS.bottom, min: Math.max(DOCK_SIZE_LIMITS.bottom.min, commandLineHeight + 76) }, DEFAULT_DOCK_LAYOUT.bottomHeight))}
            />}
            {bottomDockZone}
          </>}
          {bottomPanelMode === 'rail' && <CadWorkspaceDockRail
            id="cad-demo-command-rail"
            edge="bottom"
            label="Command bar"
            previewLabel="Command bar preview"
            expandLabel="Open Command bar"
            className="cad-demo-bottom-dock__rail"
            railClassName="cad-demo-bottom-dock__rail-button"
            previewClassName="cad-demo-bottom-dock__rail-preview"
            onExpand={() => setDockMode('Command bar', setBottomPanelMode)('open')}
          >{bottomDockZone}</CadWorkspaceDockRail>}
        </section>
      </section>
    </section>

    <CadConfirmDialog
      open={clearDialogOpen}
      title="Clear the current selection?"
      description="This changes only the sandbox state; no drawing data exists behind the demo."
      confirmLabel="Clear selection"
      onCancel={() => setClearDialogOpen(false)}
      onConfirm={() => { setSelectedRowIds([]); setSelectionExtras([]); setSelectionSource('clear'); setClearDialogOpen(false); report('Selection', 'Selection cleared.'); }}
    />
    <CadDialog open={insertDialogOpen} title={`Insert ${pendingBlock?.label || 'block'}`} description="The host owns insertion; this dialog collects UI input only." onClose={() => setInsertDialogOpen(false)} actions={<><button type="button" className="cad-dialog__button cad-dialog__button--quiet" onClick={() => setInsertDialogOpen(false)}>Cancel</button><button type="button" className="cad-dialog__button" onClick={confirmInsert}>Insert block</button></>}>
      <CadBlockInsertOptions value={insertOptions} onChange={setInsertOptions} />
    </CadDialog>
    <CadDialog open={helpOpen} title="Interactive playground" description="A component integration sandbox, not a CAD engine." onClose={() => setHelpOpen(false)}>
      <CadShortcutReference shortcuts={SHORTCUTS} onClose={() => setHelpOpen(false)} />
    </CadDialog>
    <input
      ref={presetImportRef}
      className="cad-demo__preset-file-input"
      type="file"
      accept="application/json,.json"
      tabIndex={-1}
      aria-hidden="true"
      onChange={handleWorkspacePresetFileChange}
    />
  </main>;
}

const rootElement = typeof document === 'undefined' ? null : document.getElementById('root');

// Vite may re-evaluate this module after an export-shape change elsewhere in
// the package. Reusing the root keeps the interactive sandbox stable during
// those development-only refreshes.
const rootKey = '__cadCuiPlaygroundRoot';
const root = rootElement && (rootElement[rootKey] || (rootElement[rootKey] = createRoot(rootElement)));

if (root) root.render(<Playground />);

export { Playground };
