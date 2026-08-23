import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  CadAnnotationScalePicker,
  CadBlockInsertOptions,
  CadBlockPalette,
  CadColorPickerButton,
  CadCommandLine,
  CadConfirmDialog,
  CadConstraintBar,
  CadDataGrid,
  CadDialog,
  CadDockPanel,
  CadDockTabs,
  CadDynamicInput,
  CadGripToolbar,
  CadLayerPanel,
  CadLineweightPicker,
  CadLinetypePicker,
  CadMeasureReadout,
  CadMenuBar,
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
  CadSplitPane,
  CadStatusBar,
  CadToastStack,
  CadToolPalette,
  CadTooltip,
  CadViewportControls,
  CadViewportScalePicker,
  CadVisualStylePicker,
  CadWorkspaceRibbon,
  CadWorkspaceProfileTabs,
  createCadWorkspaceProfile,
  removeCadWorkspaceProfile
} from '../../src/index.js';
import './playground.css';

const INITIAL_PROFILES = [
  { id: 'model', name: 'Model', system: true },
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
  { id: 'properties', group: 'Workspace', label: 'Properties', shortcut: 'Ctrl+1' },
  { id: 'palette', group: 'Workspace', label: 'Command palette', shortcut: 'Ctrl+P' }
];

const formatPoint = point => `${point.x ?? 0}, ${point.y ?? 0}, ${point.z ?? 0}`;

function Playground() {
  const idSequence = useRef(0);
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState('model');
  const [leftPaneSize, setLeftPaneSize] = useState(19);
  const [rightPaneSize, setRightPaneSize] = useState(68);
  const [activeInspectorTab, setActiveInspectorTab] = useState('properties');
  const [activeTool, setActiveTool] = useState('line');
  const [activeView, setActiveView] = useState('top');
  const [zoom, setZoom] = useState(1);
  const [ribbonTab, setRibbonTab] = useState('home');
  const [navigationMode, setNavigationMode] = useState('');
  const [visualStyle, setVisualStyle] = useState('2d-wireframe');
  const [viewportScale, setViewportScale] = useState('1:50');
  const [layers, setLayers] = useState(INITIAL_LAYERS);
  const [activeLayerId, setActiveLayerId] = useState('wall');
  const [snapIds, setSnapIds] = useState(['endpoint', 'midpoint', 'intersection']);
  const [constraintIds, setConstraintIds] = useState(['horizontal', 'perpendicular']);
  const [selectionFilterIds, setSelectionFilterIds] = useState(['line', 'arc', 'block']);
  const [selectedRowIds, setSelectedRowIds] = useState(['line-01']);
  const [selectionCount, setSelectionCount] = useState(1);
  const [selectionSets, setSelectionSets] = useState(INITIAL_SELECTION_SETS);
  const [activeSelectionSetId, setActiveSelectionSetId] = useState('primary-shell');
  const [selectionSetFilter, setSelectionSetFilter] = useState('');
  const [dynamicPoint, setDynamicPoint] = useState({ x: 1180, y: 640, z: 0 });
  const [drafting, setDrafting] = useState({ grid: true, snap: true, ortho: false, polar: true, osnap: true });
  const [propertyState, setPropertyState] = useState({
    layer: 'wall',
    color: { mode: 'by-layer' },
    linetype: 'continuous',
    lineweight: '0.35',
    annotationScale: '1:50',
    length: 4200,
    locked: false
  });
  const [selectedBlockId, setSelectedBlockId] = useState('door-900');
  const [pendingBlock, setPendingBlock] = useState(null);
  const [insertOptions, setInsertOptions] = useState({ scale: 1, rotation: 0, uniform: true, specifyOnScreen: true, explode: false });
  const [insertDialogOpen, setInsertDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [quickPropertiesOpen, setQuickPropertiesOpen] = useState(true);
  const [quickPropertiesPinned, setQuickPropertiesPinned] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [events, setEvents] = useState([
    { id: 'initial', message: 'Sandbox ready — no CAD engine attached.', tone: 'muted' }
  ]);

  const nextId = prefix => `${prefix}-${++idSequence.current}`;
  const record = (message, tone = 'normal') => {
    setEvents(current => [{ id: nextId('event'), message, tone }, ...current].slice(0, 6));
  };
  const notify = (title, message, tone = 'neutral') => {
    setToasts(current => [...current, { id: nextId('toast'), title, message, tone }]);
  };
  const report = (title, message, tone = 'neutral') => {
    record(`${title}: ${message}`, tone);
    notify(title, message, tone);
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

  const runCommand = command => {
    const normalized = String(command || '').trim().toLowerCase();
    if (!normalized) return;
    const tool = normalized.includes('circle') || normalized === 'c' ? 'circle'
      : normalized.includes('move') || normalized === 'm' ? 'move'
        : normalized.includes('block') || normalized.includes('insert') ? 'insert'
          : normalized.includes('line') || normalized === 'l' ? 'line' : normalized;
    if (tool === 'insert') {
      setActiveInspectorTab('blocks');
      report('Command', 'INSERT opened the Blocks palette.');
      return;
    }
    setActiveTool(tool);
    report('Command', `${tool.toUpperCase()} accepted from command line.`);
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
    { id: 'annotationScale', label: 'Anno scale', type: 'scale', value: propertyState.annotationScale },
    { id: 'length', label: 'Length', type: 'unit', value: propertyState.length, unit: 'mm', step: 25 },
    { id: 'locked', label: 'Locked', type: 'toggle', value: propertyState.locked, onLabel: 'Locked', offLabel: 'Unlocked' }
  ], [layers, propertyState]);

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
    { id: 'draft', label: 'DRAFT', color: '#ffc261' }
  ], []);

  const workspaceRibbonCommands = useMemo(() => [
    { id: 'line', tabId: 'home', groupId: 'draw', groupLabel: 'DRAW', order: 10, label: 'LINE', shortcut: 'L', icon: <span>╱</span>, active: activeTool === 'line', toggle: true },
    { id: 'circle', tabId: 'home', groupId: 'draw', groupLabel: 'DRAW', order: 20, label: 'CIRCLE', shortcut: 'C', icon: <span>○</span>, active: activeTool === 'circle', toggle: true },
    { id: 'arc', tabId: 'home', groupId: 'draw', groupLabel: 'DRAW', order: 30, label: 'ARC', shortcut: 'A', icon: <span>◜</span>, active: activeTool === 'arc', toggle: true },
    { id: 'move', tabId: 'home', groupId: 'modify', groupLabel: 'MODIFY', order: 40, label: 'MOVE', shortcut: 'M', icon: <span>↗</span>, active: activeTool === 'move', toggle: true },
    { id: 'trim', tabId: 'home', groupId: 'modify', groupLabel: 'MODIFY', order: 50, label: 'TRIM', shortcut: 'TR', icon: <span>✂</span>, active: activeTool === 'trim', toggle: true },
    { id: 'offset', tabId: 'home', groupId: 'modify', groupLabel: 'MODIFY', order: 60, label: 'OFFSET', shortcut: 'O', icon: <span>⇆</span>, active: activeTool === 'offset', toggle: true },
    { id: 'insert', tabId: 'home', groupId: 'content', groupLabel: 'CONTENT', order: 70, label: 'INSERT', shortcut: 'I', icon: <span>⊞</span> },

    { id: 'view-top', tabId: 'view', groupId: 'views', groupLabel: 'VIEWS', order: 10, label: 'TOP', icon: <span>▣</span>, active: activeView === 'top', toggle: true },
    { id: 'view-iso', tabId: 'view', groupId: 'views', groupLabel: 'VIEWS', order: 20, label: 'ISO', icon: <span>◇</span>, active: activeView === 'iso', toggle: true },
    { id: 'zoom-in', tabId: 'view', groupId: 'navigate', groupLabel: 'NAVIGATE', order: 30, label: 'ZOOM IN', shortcut: '+', icon: <span>+</span> },
    { id: 'zoom-out', tabId: 'view', groupId: 'navigate', groupLabel: 'NAVIGATE', order: 40, label: 'ZOOM OUT', shortcut: '−', icon: <span>−</span> },
    { id: 'zoom-extents', tabId: 'view', groupId: 'navigate', groupLabel: 'NAVIGATE', order: 50, label: 'EXTENTS', shortcut: 'E', icon: <span>⤢</span> },

    { id: 'grid', tabId: 'draft', groupId: 'drafting', groupLabel: 'DRAFTING', order: 10, label: 'GRID', icon: <span>▦</span>, active: drafting.grid, toggle: true },
    { id: 'snap', tabId: 'draft', groupId: 'drafting', groupLabel: 'DRAFTING', order: 20, label: 'SNAP', icon: <span>⌖</span>, active: drafting.snap, toggle: true },
    { id: 'ortho', tabId: 'draft', groupId: 'drafting', groupLabel: 'DRAFTING', order: 30, label: 'ORTHO', icon: <span>⌜</span>, active: drafting.ortho, toggle: true },
    { id: 'polar', tabId: 'draft', groupId: 'drafting', groupLabel: 'DRAFTING', order: 40, label: 'POLAR', icon: <span>∠</span>, active: drafting.polar, toggle: true },
    { id: 'osnap', tabId: 'draft', groupId: 'drafting', groupLabel: 'DRAFTING', order: 50, label: 'OSNAP', icon: <span>✣</span>, active: drafting.osnap, toggle: true },
    { id: 'measure', tabId: 'draft', groupId: 'inquiry', groupLabel: 'INQUIRY', order: 60, label: 'MEASURE', icon: <span>↔</span>, active: activeTool === 'measure', toggle: true }
  ], [activeTool, activeView, drafting]);

  const handleRibbonCommand = command => {
    const commandId = command?.id;
    if (!commandId) return;

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
      setActiveInspectorTab('blocks');
      report('Command', 'INSERT opened the Blocks palette.');
      return;
    }
    selectTool(command);
  };

  const commandHistory = events.map(event => ({ id: event.id, label: event.message.split(':')[0], detail: event.message.split(':').slice(1).join(':').trim(), tone: event.tone }));
  const menuItems = [
    { id: 'file', label: 'File', items: [{ id: 'new-layout', label: 'New layout', shortcut: 'Ctrl+N' }, { type: 'separator' }, { id: 'export', label: 'Export drawing', shortcut: 'Ctrl+E' }] },
    { id: 'edit', label: 'Edit', items: [{ id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z' }, { id: 'clear-selection', label: 'Clear selection', shortcut: 'Esc' }] },
    { id: 'view', label: 'View', items: [{ id: 'properties', label: 'Properties', checked: activeInspectorTab === 'properties' }, { id: 'blocks', label: 'Blocks', checked: activeInspectorTab === 'blocks' }, { id: 'data', label: 'Data table', checked: activeInspectorTab === 'data' }, { id: 'sets', label: 'Selection sets', checked: activeInspectorTab === 'sets' }] },
    { id: 'help', label: 'Help', items: [{ id: 'shortcuts', label: 'Keyboard shortcuts', shortcut: 'F1' }, { id: 'about', label: 'About this sandbox' }] }
  ];

  const handleMenuAction = item => {
    if (!item?.id) return;
    if (item.id === 'new-layout') return addLayout();
    if (item.id === 'clear-selection') return setClearDialogOpen(true);
    if (['properties', 'blocks', 'data', 'sets'].includes(item.id)) return setActiveInspectorTab(item.id);
    if (item.id === 'shortcuts' || item.id === 'about') return setHelpOpen(true);
    report('Menu action', `${item.label} is a host-owned command.`);
  };

  const confirmInsert = () => {
    if (!pendingBlock) return;
    setInsertDialogOpen(false);
    setSelectionCount(count => count + 1);
    report('Insert complete', `${pendingBlock.label} inserted at ${formatPoint(dynamicPoint)}.`);
    setPendingBlock(null);
  };

  const inspectorContent = {
    properties: <div className="cad-demo__properties-pane">
      {quickPropertiesOpen ? <CadQuickProperties
        title="Quick properties"
        properties={propertyDefinitions}
        pinned={quickPropertiesPinned}
        onPinChange={setQuickPropertiesPinned}
        onClose={() => { setQuickPropertiesOpen(false); report('Palette', 'Quick properties hidden.'); }}
        onValueChange={(id, value) => {
          setPropertyState(current => ({ ...current, [id]: value }));
          if (id === 'layer') setActiveLayerId(value);
          report('Property', `${id} changed.`);
        }}
      /> : <button type="button" className="cad-demo__restore-palette" onClick={() => setQuickPropertiesOpen(true)}>Restore Quick properties</button>}
      <CadDockPanel title="Live selection" collapsible>
        <CadSelectionSummary count={selectionCount} entityLabel="objects" fields={[{ label: 'Layer', value: layers.find(layer => layer.id === propertyState.layer)?.label || 'A-WALL' }, { label: 'Tool', value: activeTool.toUpperCase() }]} />
        <CadMeasureReadout distance="4200 mm" angle="90°" area="12.40 m²" />
      </CadDockPanel>
    </div>,
    blocks: <div className="cad-demo__blocks-pane">
      <CadBlockPalette
        blocks={BLOCKS}
        value={selectedBlockId}
        onChange={setSelectedBlockId}
        onInsert={block => { setPendingBlock(block); setInsertDialogOpen(true); }}
        onCreate={() => report('Block library', 'New block definition requested.')}
        title="Blocks"
      />
      <CadDockPanel title="Selection cycle" collapsible defaultCollapsed>
        <CadSelectionCycler
          candidates={[{ id: 'line', label: 'Line', detail: 'A-WALL' }, { id: 'hatch', label: 'Hatch', detail: 'A-FILL' }, { id: 'block', label: 'Door 900', detail: 'A-DOOR' }]}
          onAccept={candidate => report('Selection', `${candidate.label} accepted.`)}
        />
      </CadDockPanel>
    </div>,
    data: <div className="cad-demo__data-pane">
      <CadSelectionFilter
        filters={[{ id: 'line', label: 'Lines', count: 12 }, { id: 'arc', label: 'Arcs', count: 4 }, { id: 'block', label: 'Blocks', count: 7 }, { id: 'dimension', label: 'Dims', count: 9 }]}
        activeIds={selectionFilterIds}
        onChange={setSelectionFilterIds}
      />
      <CadDataGrid
        caption="Object extraction data"
        columns={[
          { id: 'entity', label: 'Entity', accessor: 'entity', sortable: true },
          { id: 'layer', label: 'Layer', accessor: 'layer', sortable: true },
          { id: 'length', label: 'Length', accessor: 'length', align: 'end', sortable: true },
          { id: 'status', label: 'State', accessor: 'status' }
        ]}
        rows={OBJECT_ROWS}
        selectedIds={selectedRowIds}
        onSelectionChange={(ids, row) => { setSelectedRowIds(ids); if (row) report('Data selection', `${row.entity} toggled.`); }}
        onRowActivate={row => report('Data selection', `${row.entity} activated.`)}
      />
      <CadSelectionCycler
        candidates={[{ id: 'line', label: 'Line 01', detail: 'A-WALL · 4200 mm' }, { id: 'arc', label: 'Arc 02', detail: 'A-DOOR · 1414 mm' }, { id: 'block', label: 'Block 03', detail: 'A-FURN' }]}
        onAccept={candidate => { setSelectionCount(1); report('Selection', `${candidate.label} accepted.`); }}
        onCancel={() => report('Selection', 'Cycle cancelled.')}
      />
    </div>,
    sets: <div className="cad-demo__sets-pane">
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
          setSelectionCount(count);
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
    </div>
  };

  return <main className="cad-demo-page">
    <section className="cad-demo-workbench" aria-label="CAD CUI interactive playground">
      <header className="cad-demo-titlebar">
        <div className="cad-demo-titlebar__brand"><span aria-hidden="true">◫</span><strong>CAD CUI</strong><em>INTERACTION SANDBOX</em></div>
        <div className="cad-demo-titlebar__status"><span>ENGINE: <b>NOT CONNECTED</b></span><output>UI STATE: LIVE</output><CadTooltip content="This playground is a real React UI sandbox; it intentionally does not draw CAD geometry."><button type="button" className="cad-demo-titlebar__help" aria-label="Open playground help" onClick={() => setHelpOpen(true)}>?</button></CadTooltip></div>
      </header>

      <CadMenuBar items={menuItems} onAction={handleMenuAction} />

      <section className="cad-demo-ribbon" aria-label="Command ribbon">
        <CadWorkspaceRibbon
          className="cad-demo-ribbon__workspace"
          tabs={workspaceRibbonTabs}
          commands={workspaceRibbonCommands}
          activeTab={ribbonTab}
          compact
          identity={<span className="cad-demo-ribbon__identity"><b>COMMAND</b><em>MODULES</em></span>}
          status={`ACTIVE: ${activeTool.toUpperCase()} · ${activeView.toUpperCase()} · ${viewportScale}`}
          endSlot={<div className="cad-demo-ribbon__styles" aria-label="Current object and viewport style">
            <span>STYLE / VIEW</span>
            <CadColorPickerButton value={propertyState.color} label="Object color" onChange={color => { setPropertyState(current => ({ ...current, color })); report('Style', 'Color changed.'); }} />
            <CadLinetypePicker value={propertyState.linetype} onChange={linetype => { setPropertyState(current => ({ ...current, linetype })); report('Style', 'Linetype changed.'); }} />
            <CadLineweightPicker value={propertyState.lineweight} onChange={lineweight => { setPropertyState(current => ({ ...current, lineweight })); report('Style', 'Lineweight changed.'); }} />
            <CadAnnotationScalePicker value={propertyState.annotationScale} onChange={annotationScale => { setPropertyState(current => ({ ...current, annotationScale })); report('Style', `Annotation scale ${annotationScale}.`); }} label="Scale" />
            <CadVisualStylePicker value={visualStyle} label="Display" onChange={style => { setVisualStyle(style); report('Viewport', `Visual style ${style}.`); }} />
            <CadViewportScalePicker value={viewportScale} label="VP scale" onChange={scale => { setViewportScale(scale); report('Viewport', `Viewport scale ${scale}.`); }} onManage={() => report('Viewport', 'Scale management requested.')} />
            <CadPopover label="Sandbox scope" trigger={<button type="button" className="cad-demo-ribbon__scope">UI ONLY</button>} content={<p className="cad-demo-popover-copy">The SVG viewport is a neutral canvas stand-in. Every control here emits and retains host-owned React state.</p>} />
          </div>}
          onActiveTabChange={(id, tab) => {
            setRibbonTab(id);
            record(`Ribbon: ${tab?.label || id} tab active.`);
          }}
          onMinimizedChange={minimized => record(`Ribbon: ${minimized ? 'compact' : 'expanded'}.`)}
          onCommand={handleRibbonCommand}
        />
      </section>

      <section className="cad-demo-workspace">
        <CadSplitPane
          className="cad-demo__outer-split"
          size={leftPaneSize}
          minSize={14}
          maxSize={34}
          onSizeChange={setLeftPaneSize}
          primary={<aside className="cad-demo-left-rail">
            <CadDockPanel title="Tool palette" collapsible>
              <CadToolPalette groups={toolbarGroups.slice(0, 2)} onAction={selectTool} />
            </CadDockPanel>
            <CadDockPanel title="Object snaps" collapsible>
              <CadObjectSnapMenu activeIds={snapIds} onChange={setSnapIds} />
            </CadDockPanel>
            <CadDockPanel title="Constraints" collapsible defaultCollapsed>
              <CadConstraintBar activeIds={constraintIds} onChange={setConstraintIds} />
            </CadDockPanel>
            <CadDockPanel title="Layers" collapsible>
              <CadLayerPanel
                layers={layers}
                activeLayerId={activeLayerId}
                onActiveLayerChange={id => { setActiveLayerId(id); setPropertyState(current => ({ ...current, layer: id })); }}
                onLayerChange={updateLayer}
                onAddLayer={() => report('Layers', 'Add layer requested.')}
                onDeleteLayer={() => report('Layers', 'Delete layer requested.')}
              />
            </CadDockPanel>
          </aside>}
          secondary={<CadSplitPane
            className="cad-demo__inner-split"
            size={rightPaneSize}
            minSize={48}
            maxSize={80}
            onSizeChange={setRightPaneSize}
            primary={<section className="cad-demo-viewport" data-visual-style={visualStyle} data-viewport-scale={viewportScale} aria-label="SVG drawing viewport mockup">
              <div className="cad-demo-viewport__meta"><span>MODEL SPACE / {activeView.toUpperCase()} / {visualStyle.toUpperCase()}</span><span>{Math.round(zoom * 100)}% · VP {viewportScale}</span></div>
              <svg className="cad-demo-viewport__drawing" style={{ transform: `scale(${zoom * (VIEWPORT_SCALE_FACTORS[viewportScale] || 1)})` }} viewBox="0 0 1000 620" role="img" aria-label="Technical drawing mockup">
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
              <div className="cad-demo-viewport__controls"><CadViewportControls activeView={activeView} onViewChange={view => { setActiveView(view); record(`Viewport: ${String(view).toUpperCase()} view active.`); }} onZoomIn={() => { setZoom(value => Math.min(1.35, value + 0.1)); record('Viewport: Zoomed in.'); }} onZoomOut={() => { setZoom(value => Math.max(0.7, value - 0.1)); record('Viewport: Zoomed out.'); }} onZoomExtents={() => { setZoom(1); record('Viewport: Zoom extents restored.'); }} /></div>
              <div className="cad-demo-viewport__navigation">
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
              </div>
              <CadSelectionSummary className="cad-demo-viewport__selection" count={selectionCount} entityLabel="objects" fields={[{ label: 'Tool', value: activeTool.toUpperCase() }]} />
              <CadMeasureReadout className="cad-demo-viewport__measure" distance="4200 mm" angle="90°" />
              <CadDynamicInput className="cad-demo-viewport__dynamic" value={dynamicPoint} onChange={setDynamicPoint} onSubmit={point => report('Point accepted', formatPoint(point))} prompt={`Specify ${activeTool} point`} />
              <CadPolarTracker className="cad-demo-viewport__polar" angle="45°" increment="15°" distance="1200 mm" active={drafting.polar} onActiveChange={polar => setDrafting(current => ({ ...current, polar }))} />
              <CadGripToolbar className="cad-demo-viewport__grip-tools" selectionCount={selectionCount} tools={[{ id: 'move', label: 'Move' }, { id: 'rotate', label: 'Rotate' }, { id: 'delete', label: 'Delete', tone: 'danger' }]} onAction={selectTool} />
              <CadObjectSnapMarker className="cad-demo-viewport__snap-marker" type="endpoint" label="Endpoint" />
              <CadSelectionGrip className="cad-demo-viewport__grip cad-demo-viewport__grip--one" label="Move selected object" active onClick={() => report('Grip', 'Base grip activated.')} />
              <CadSelectionGrip className="cad-demo-viewport__grip cad-demo-viewport__grip--two" label="Stretch selected object" onClick={() => report('Grip', 'Stretch grip activated.')} />
            </section>}
            secondary={<aside className="cad-demo-inspector">
              <CadDockTabs
                items={[{ id: 'properties', label: 'Properties' }, { id: 'blocks', label: 'Blocks' }, { id: 'data', label: 'Data', badge: selectedRowIds.length || undefined }, { id: 'sets', label: 'Sets', badge: selectionSets.length || undefined }]}
                activeId={activeInspectorTab}
                onChange={setActiveInspectorTab}
                renderPanel={item => inspectorContent[item.id]}
              />
              <section className="cad-demo-events" aria-label="Host event log"><header><span>HOST EVENT LOG</span><output>{leftPaneSize.toFixed(0)}% / {rightPaneSize.toFixed(0)}%</output></header><ol>{events.map(event => <li key={event.id} data-tone={event.tone}>{event.message}</li>)}</ol></section>
            </aside>}
          />}
        />
      </section>

      <CadCommandLine
        prompt="Command:"
        suggestions={[{ id: 'line', label: 'LINE', detail: 'Draw a straight segment' }, { id: 'circle', label: 'CIRCLE', detail: 'Draw a circle' }, { id: 'insert', label: 'INSERT', detail: 'Open Blocks palette' }, { id: 'move', label: 'MOVE', detail: 'Move selected objects' }]}
        history={commandHistory}
        options={[{ id: 'undo', label: 'Undo' }, { id: 'close', label: 'Close' }, { id: 'help', label: 'Help', shortcut: 'F1' }]}
        onSubmit={runCommand}
        onOptionSelect={option => option.id === 'help' ? setHelpOpen(true) : report('Command option', option.label)}
      />

      <CadWorkspaceProfileTabs profiles={profiles} activeId={activeProfileId} onChange={setActiveProfileId} onCreate={addLayout} onClose={closeProfile} />
      <CadStatusBar coordinates={dynamicPoint} units="mm" scale={propertyState.annotationScale} message={`${activeTool.toUpperCase()} · ${snapIds.length} snaps · ${constraintIds.length} constraints`} modes={[
        { id: 'grid', label: 'GRID', active: drafting.grid }, { id: 'snap', label: 'SNAP', active: drafting.snap }, { id: 'ortho', label: 'ORTHO', active: drafting.ortho }, { id: 'polar', label: 'POLAR', active: drafting.polar, tone: 'amber' }, { id: 'osnap', label: 'OSNAP', active: drafting.osnap, tone: 'magenta' }
      ]} onModeChange={(id, active) => { setDrafting(current => ({ ...current, [id]: active })); record(`${id.toUpperCase()} ${active ? 'enabled' : 'disabled'}.`); }} />
    </section>

    <CadConfirmDialog
      open={clearDialogOpen}
      title="Clear the current selection?"
      description="This changes only the sandbox state; no drawing data exists behind the demo."
      confirmLabel="Clear selection"
      onCancel={() => setClearDialogOpen(false)}
      onConfirm={() => { setSelectionCount(0); setSelectedRowIds([]); setClearDialogOpen(false); report('Selection', 'Selection cleared.'); }}
    />
    <CadDialog open={insertDialogOpen} title={`Insert ${pendingBlock?.label || 'block'}`} description="The host owns insertion; this dialog collects UI input only." onClose={() => setInsertDialogOpen(false)} actions={<><button type="button" className="cad-dialog__button cad-dialog__button--quiet" onClick={() => setInsertDialogOpen(false)}>Cancel</button><button type="button" className="cad-dialog__button" onClick={confirmInsert}>Insert block</button></>}>
      <CadBlockInsertOptions value={insertOptions} onChange={setInsertOptions} />
    </CadDialog>
    <CadDialog open={helpOpen} title="Interactive playground" description="A component integration sandbox, not a CAD engine." onClose={() => setHelpOpen(false)}>
      <CadShortcutReference shortcuts={SHORTCUTS} onClose={() => setHelpOpen(false)} />
    </CadDialog>
    <CadToastStack toasts={toasts} onDismiss={toast => setToasts(current => current.filter(item => item.id !== toast.id))} />
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
