import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import type { CadAnyProps } from '../src/cad-types';
import { CadCuiCommandPalette, CadCuiContextMenu, CadCuiCustomizer, CadCuiProvider, CadCuiQuickAccess, CadCuiRibbon, defineCadCuiSystem, loadCadCuiState, sanitizeCadCuiState, selectCadCuiCommandGroups, selectCadCuiCommands, selectCadCuiRadialTree, shouldHandleCadShortcut, useCadCui } from '../src/index';

const TEST_STORAGE_KEY = 'cad-cui-package-test:v1';
const TEST_CUI = defineCadCuiSystem({
  id: 'package-test',
  storageKey: TEST_STORAGE_KEY,
  defaults: { activeTab: 'file', accentMode: 'cyan', density: 'regular', detail: 'guided', quickAccessIds: ['open-explorer'] },
  calibration: {
    accentModes: [{ id: 'cyan', label: 'CIÁN' }, { id: 'magenta', label: 'MAGENTA' }],
    densities: [{ id: 'compact', label: 'TÖMÖR' }, { id: 'regular', label: 'EGYENSÚLY' }],
    details: [{ id: 'focus', label: 'FÓKUSZ' }, { id: 'guided', label: 'INFORMATÍV' }]
  },
  tabs: [{ id: 'file', label: 'FILE', tone: 'cyan' }],
  commands: [
    { id: 'open-explorer', label: 'EXPLORER', detail: 'Dokumentumok megnyitása', tone: 'cyan', toolId: 'explorer', intent: { type: 'panel.open', panelId: 'explorer' }, placements: [{ surface: 'ribbon', tab: 'file', group: 'MUNKATÉR', order: 10 }, { surface: 'quick-access', order: 10 }, { surface: 'context', menu: 'node', order: 10 }] },
    { id: 'go-knowledge', label: 'TUDÁSTÁR', detail: 'Ugrás a tudástárba', tone: 'green', intent: { type: 'route.navigate', to: '/knowledge?project_id=prj-alpha' }, placements: [{ surface: 'ribbon', tab: 'file', order: 20 }, { surface: 'context', menu: 'node', order: 20 }] },
    { id: 'admin-editor', label: 'SZERKESZTŐ', detail: 'Védett admin parancs', tone: 'magenta', requires: ['admin'], intent: { type: 'panel.open', panelId: 'editor' }, placements: [{ surface: 'ribbon', tab: 'file', order: 30 }] }
  ]
});

const GROUPED_CUI = defineCadCuiSystem({
  id: 'grouped-package-test',
  storageKey: 'cad-cui-grouped-package-test:v1',
  defaults: { activeTab: 'home', quickAccessIds: ['line', 'move', 'erase'] },
  tabs: [{ id: 'home', label: 'HOME', tone: 'cyan' }],
  groups: [
    { id: 'draw', label: 'RAJZOLÁS', detail: 'Alap geometriák', tab: 'home', control: 'toggle', order: 10 },
    { id: 'modify', label: 'MÓDOSÍTÁS', tab: 'home', order: 20 }
  ],
  commands: [
    { id: 'line', label: 'VONAL', intent: { type: 'draw.line' }, placements: [{ surface: 'ribbon', tab: 'home', groupId: 'draw', control: 'toggle', order: 10 }, { surface: 'quick-access', order: 10 }, { surface: 'context', menu: 'canvas', order: 10 }] },
    { id: 'move', label: 'MOZGATÁS', intent: { type: 'modify.move' }, placements: [{ surface: 'ribbon', tab: 'home', groupId: 'modify', control: 'large', order: 10 }, { surface: 'quick-access', order: 20 }, { surface: 'context', menu: 'canvas', order: 20 }] },
    { id: 'erase', label: 'TÖRLÉS', intent: { type: 'modify.erase' }, placements: [{ surface: 'ribbon', tab: 'home', groupId: 'modify', order: 20 }, { surface: 'quick-access', order: 30 }, { surface: 'context', menu: 'canvas', order: 30 }] }
  ]
});

const SELECTION_CUI = defineCadCuiSystem({
  id: 'selection-package-test',
  storageKey: 'cad-cui-selection-package-test:v1',
  defaults: { activeTab: 'home' },
  tabs: [{ id: 'home', label: 'HOME', tone: 'cyan' }],
  groups: [{ id: 'selection', label: 'KIJELÖLÉS', tab: 'home', order: 10 }],
  commands: [
    { id: 'move', label: 'MOZGATÁS', shortcut: 'M', intent: { type: 'modify.move' }, selection: { count: 'any', traits: ['editable'] }, placements: [{ surface: 'ribbon', tab: 'home', groupId: 'selection', order: 10 }, { surface: 'context', menu: 'selection', order: 10 }] },
    { id: 'explode', label: 'SZÉTBONTÁS', shortcut: 'X', intent: { type: 'modify.explode' }, selection: { count: 'one', entityTypes: ['block'], traits: ['editable'] }, placements: [{ surface: 'ribbon', tab: 'home', groupId: 'selection', order: 20 }, { surface: 'context', menu: 'selection', order: 20 }] },
    { id: 'properties', label: 'TULAJDONSÁGOK', shortcut: 'CTRL+1', intent: { type: 'inspect.properties' }, selection: { count: 'any' }, placements: [{ surface: 'ribbon', tab: 'home', groupId: 'selection', order: 30 }, { surface: 'context', menu: 'selection', order: 30 }] },
    { id: 'erase', label: 'TÖRLÉS', shortcut: 'DELETE', intent: { type: 'modify.erase' }, selection: { count: 'any', traits: ['editable'] }, placements: [{ surface: 'ribbon', tab: 'home', groupId: 'selection', order: 40 }, { surface: 'context', menu: 'selection', order: 40 }] }
  ]
});

const RADIAL_TREE_CUI = defineCadCuiSystem({
  id: 'radial-tree-package-test',
  storageKey: 'cad-cui-radial-tree-package-test:v1',
  groups: [
    { id: 'modify', label: 'MÓDOSÍTÁS', detail: 'Kijelölés módosítása', icon: '✥', tone: 'violet', surface: 'radial', menu: 'selection', order: 10 },
    { id: 'transform', label: 'TRANSZFORMÁLÁS', detail: 'Helyzet és alak', icon: '↗', tone: 'cyan', parentId: 'modify', surface: 'radial', menu: 'selection', control: 'radial', order: 10 },
    { id: 'edit', label: 'SZERKESZTÉS', detail: 'Objektum szerkesztése', icon: '✎', tone: 'green', parentId: 'modify', surface: 'radial', menu: 'selection', order: 20 },
    { id: 'inspect', label: 'VIZSGÁLAT', detail: 'Tulajdonságok', icon: '⌕', tone: 'amber', surface: 'radial', menu: 'selection', order: 20 },
    { id: 'empty', label: 'ÜRES', surface: 'radial', menu: 'selection', order: 30 }
  ],
  commands: [
    { id: 'copy', label: 'MÁSOLÁS', intent: { type: 'modify.copy' }, selection: { count: 'any', traits: ['editable'] }, placements: [{ surface: 'radial', menu: 'selection', groupId: 'modify', order: 5 }] },
    { id: 'move', label: 'MOZGATÁS', intent: { type: 'modify.move' }, selection: { count: 'any', traits: ['editable'] }, placements: [{ surface: 'radial', menu: 'selection', groupId: 'transform', order: 10 }] },
    { id: 'offset', label: 'PÁRHUZAMOS', intent: { type: 'modify.offset' }, selection: { count: 'any', traits: ['editable'] }, placements: [{ surface: 'radial', menu: 'selection', groupId: 'transform', order: 20 }] },
    { id: 'explode', label: 'SZÉTBONTÁS', intent: { type: 'modify.explode' }, selection: { count: 'one', entityTypes: ['block'], traits: ['editable'] }, placements: [{ surface: 'radial', menu: 'selection', groupId: 'edit', order: 10 }] },
    { id: 'properties', label: 'TULAJDONSÁGOK', intent: { type: 'inspect.properties' }, selection: { count: 'any' }, placements: [{ surface: 'radial', menu: 'selection', groupId: 'inspect', order: 10 }] },
    { id: 'erase', label: 'TÖRLÉS', intent: { type: 'modify.erase' }, selection: { count: 'any', traits: ['editable'] }, placements: [{ surface: 'radial', menu: 'selection', order: 90 }] }
  ]
});

const AMBIGUOUS_SHORTCUT_CUI = defineCadCuiSystem({
  id: 'ambiguous-shortcut-package-test',
  storageKey: 'cad-cui-ambiguous-shortcut-package-test:v1',
  commands: [
    { id: 'first', label: 'ELSŐ', shortcut: 'M', intent: { type: 'test.first' } },
    { id: 'second', label: 'MÁSODIK', shortcut: 'M', intent: { type: 'test.second' } }
  ]
});

function StateProbe() {
  const { state } = useCadCui();
  return <output data-testid="cui-state" data-density={state.density} data-detail={state.detail} />;
}

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="cui-location">{`${location.pathname}${location.search}`}</output>;
}

function Fixture({ capabilities = {}, handlers = {} }: CadAnyProps) {
  return <CadCuiProvider registry={TEST_CUI} capabilities={capabilities} handlers={handlers}>
    <LocationProbe />
    <StateProbe />
    <CadCuiRibbon data-testid="ribbon" />
    <CadCuiQuickAccess data-testid="quick-access" />
    <CadCuiContextMenu data-testid="context" menuId="node" />
    <CadCuiCommandPalette data-testid="palette" />
    <CadCuiCustomizer data-testid="customizer" />
  </CadCuiProvider>;
}

function renderFixture(options: CadAnyProps = {}) {
  return render(<MemoryRouter initialEntries={['/graph']}>
    <Routes><Route path="*" element={<Fixture {...options} />} /></Routes>
  </MemoryRouter>);
}

function GroupedFixture({ commandStates = {}, handlers = {} }: CadAnyProps) {
  return <CadCuiProvider registry={GROUPED_CUI} commandStates={commandStates} handlers={handlers}>
    <CadCuiRibbon data-testid="grouped-ribbon" />
    <CadCuiQuickAccess data-testid="grouped-quick-access" />
    <CadCuiContextMenu data-testid="grouped-context" menuId="canvas" />
    <CadCuiCommandPalette data-testid="grouped-palette" />
  </CadCuiProvider>;
}

function renderGroupedFixture(options: CadAnyProps = {}) {
  return render(<MemoryRouter initialEntries={['/graph']}>
    <Routes><Route path="*" element={<GroupedFixture {...options} />} /></Routes>
  </MemoryRouter>);
}

function SelectionFixture({ selection = {}, commandStates = {}, handlers = {} }: CadAnyProps) {
  return <CadCuiProvider registry={SELECTION_CUI} selection={selection} commandStates={commandStates} handlers={handlers}>
    <CadCuiRibbon data-testid="selection-ribbon" />
  </CadCuiProvider>;
}

function renderSelectionFixture(options: CadAnyProps = {}) {
  return render(<MemoryRouter initialEntries={['/graph']}>
    <Routes><Route path="*" element={<SelectionFixture {...options} />} /></Routes>
  </MemoryRouter>);
}

function ScopedShortcutFixture({ handlers = {} }: CadAnyProps) {
  const shortcutScope = React.useRef<HTMLDivElement>(null);
  return <div ref={shortcutScope} data-testid="shortcut-scope">
    <CadCuiProvider registry={SELECTION_CUI} selection={{ ids: ['line-01'], entityTypes: ['line'], traits: ['editable'] }} handlers={handlers} shortcutScope={shortcutScope}>
      <button type="button" data-testid="shortcut-scope-target">MODEL TÉR</button>
    </CadCuiProvider>
  </div>;
}

function renderScopedShortcutFixture(options: CadAnyProps = {}) {
  return render(<MemoryRouter initialEntries={['/graph']}>
    <Routes><Route path="*" element={<ScopedShortcutFixture {...options} />} /></Routes>
  </MemoryRouter>);
}

function renderAmbiguousShortcutFixture(options: CadAnyProps = {}) {
  return render(<MemoryRouter initialEntries={['/graph']}>
    <Routes><Route path="*" element={<CadCuiProvider registry={AMBIGUOUS_SHORTCUT_CUI} {...options}><button type="button" data-testid="ambiguous-shortcut-target">MODEL TÉR</button></CadCuiProvider>} /></Routes>
  </MemoryRouter>);
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('CAD CUI runtime', () => {
  it('keeps command placement and authorization in the declarative schema', () => {
    const publicCommands = selectCadCuiCommands(TEST_CUI, TEST_CUI.defaultState, { surface: 'ribbon', tabId: 'file' });
    expect(publicCommands.map(command => command.id)).toEqual(['open-explorer', 'go-knowledge']);
    expect(publicCommands[0].placement.group).toBe('MUNKATÉR');
    expect(selectCadCuiCommands(TEST_CUI, TEST_CUI.defaultState, { surface: 'ribbon', tabId: 'file', capabilities: { admin: true } }).map(command => command.id)).toEqual(['open-explorer', 'go-knowledge', 'admin-editor']);
  });

  it('normalizes legacy preferences and handles broken local storage', () => {
    const state = sanitizeCadCuiState(TEST_CUI, { activeTab: 'missing', hiddenToolIds: ['explorer'], density: 'compact', detail: 'missing' });
    expect(state).toMatchObject({ activeTab: 'file', hiddenCommandIds: ['open-explorer'], density: 'compact', detail: 'guided' });
    expect(loadCadCuiState(TEST_CUI, { getItem: () => '{invalid' })).toMatchObject({ density: 'regular' });
  });

  it('executes one intent from the ribbon, quick access and context surfaces', async () => {
    const panelOpen = vi.fn();
    renderFixture({ handlers: { 'panel.open': panelOpen } });

    fireEvent.click(within(screen.getByTestId('ribbon')).getByRole('button', { name: 'EXPLORER' }));
    await waitFor(() => expect(panelOpen).toHaveBeenLastCalledWith(expect.objectContaining({ commandId: 'open-explorer', source: 'ribbon' })));
    fireEvent.click(within(screen.getByTestId('quick-access')).getByRole('button', { name: 'EXPLORER' }));
    await waitFor(() => expect(panelOpen).toHaveBeenLastCalledWith(expect.objectContaining({ source: 'quick-access' })));
    fireEvent.click(within(screen.getByTestId('context')).getByRole('menuitem', { name: 'EXPLORER' }));
    await waitFor(() => expect(panelOpen).toHaveBeenLastCalledWith(expect.objectContaining({ source: 'context' })));
  });

  it('uses React Router and persists calibration preferences', async () => {
    renderFixture();
    fireEvent.click(within(screen.getByTestId('ribbon')).getByRole('button', { name: 'TUDÁSTÁR' }));
    await waitFor(() => expect(screen.getByTestId('cui-location')).toHaveTextContent('/knowledge?project_id=prj-alpha'));

    const customizer = screen.getByTestId('customizer');
    fireEvent.click(within(customizer).getByRole('tab', { name: 'TÖMÖR' }));
    fireEvent.click(within(customizer).getByRole('tab', { name: 'FÓKUSZ' }));
    await waitFor(() => expect(screen.getByTestId('cui-state')).toHaveAttribute('data-density', 'compact'));
    expect(JSON.parse(localStorage.getItem(TEST_STORAGE_KEY))).toMatchObject({ preferences: { density: 'compact', detail: 'focus' } });
  });

  it('normalizes optional command groups and selects their placed controls', () => {
    expect(GROUPED_CUI.groups).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'draw', label: 'RAJZOLÁS', control: 'toggle' }),
      expect.objectContaining({ id: 'modify', label: 'MÓDOSÍTÁS' })
    ]));
    const groups = selectCadCuiCommandGroups(GROUPED_CUI, GROUPED_CUI.defaultState, { surface: 'ribbon', tabId: 'home' });
    expect(groups.map(group => ({ id: group.id, commands: group.commands.map(command => command.id) }))).toEqual([
      { id: 'draw', commands: ['line'] },
      { id: 'modify', commands: ['move', 'erase'] }
    ]);
    expect(groups[0].commands[0].placement.control).toBe('toggle');
    expect(groups[1].commands[0].placement.control).toBe('large');
  });

  it('copies nested group parent ids and presentation metadata from the declarative registry', () => {
    const source = { id: 'child', label: 'GYEREK', parentId: 'root', icon: '◌', tone: 'green', surface: 'radial', menu: 'selection', order: 20 };
    const system = defineCadCuiSystem({
      id: 'group-copy-test',
      groups: [{ id: 'root', label: 'GYÖKÉR', surface: 'radial', menu: 'selection', order: 10 }, source]
    });
    source.parentId = 'changed-after-copy';

    expect(system.groups).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'child', parentId: 'root', icon: '◌', tone: 'green', surface: 'radial', menu: 'selection', order: 20 })
    ]));
    expect(system.groups.find(group => group.id === 'child')).not.toBe(source);
  });

  it('selects a stable nested radial tree while preserving direct command leaves and collector presentation', () => {
    const tree = selectCadCuiRadialTree(RADIAL_TREE_CUI, RADIAL_TREE_CUI.defaultState, {
      menuId: 'selection',
      selection: { ids: ['block-03'], entityTypes: ['block'], traits: ['editable'] }
    });

    expect(tree.map(group => group.id)).toEqual(['modify', 'inspect', '__ungrouped__']);
    expect(tree[0]).toMatchObject({
      id: 'modify',
      label: 'MÓDOSÍTÁS',
      detail: 'Kijelölés módosítása',
      icon: '✥',
      tone: 'violet',
      order: 10,
      commands: [expect.objectContaining({ id: 'copy' })]
    });
    expect(tree[0]).not.toBe(RADIAL_TREE_CUI.groups.find(group => group.id === 'modify'));
    expect(tree[0].children.map(group => ({ id: group.id, parentId: group.parentId, commands: group.commands.map(command => command.id) }))).toEqual([
      { id: 'transform', parentId: 'modify', commands: ['move', 'offset'] },
      { id: 'edit', parentId: 'modify', commands: ['explode'] }
    ]);
    expect(tree[0].children[0]).toMatchObject({ icon: '↗', tone: 'cyan', control: 'radial' });
    expect(tree[0].children[0].commands[0].placement.control).toBe('radial');
    expect(tree[1]).toMatchObject({ id: 'inspect', icon: '⌕', tone: 'amber', commands: [expect.objectContaining({ id: 'properties' })], children: [] });
    expect(tree[2]).toMatchObject({ id: '__ungrouped__', label: 'EGYÉB PARANCSOK', commands: [expect.objectContaining({ id: 'erase' })], children: [] });
  });

  it('prunes empty radial collectors after selection filtering and skips an empty ungrouped collector', () => {
    const lineTree = selectCadCuiRadialTree(RADIAL_TREE_CUI, RADIAL_TREE_CUI.defaultState, {
      menuId: 'selection',
      selection: { ids: ['line-01'], entityTypes: ['line'], traits: ['editable'] }
    });
    expect(lineTree.map(group => group.id)).toEqual(['modify', 'inspect', '__ungrouped__']);
    expect(lineTree[0].children.map(group => group.id)).toEqual(['transform']);
    expect(lineTree[0].children[0].commands.map(command => command.id)).toEqual(['move', 'offset']);

    expect(selectCadCuiRadialTree(RADIAL_TREE_CUI, RADIAL_TREE_CUI.defaultState, {
      menuId: 'selection',
      selection: {}
    })).toEqual([]);
  });

  it('shares dynamic command state across grouped ribbon, quick access, context and palette', async () => {
    const commandHandler = vi.fn();
    const commandStates = {
      line: { active: true, badge: 2 },
      move: { disabled: true, badge: 'LOCKED' },
      erase: { visible: false }
    };
    renderGroupedFixture({ commandStates, handlers: { 'draw.line': commandHandler, 'modify.move': commandHandler, 'modify.erase': commandHandler } });

    const ribbon = screen.getByTestId('grouped-ribbon');
    expect(ribbon.querySelector('[data-cui-grouped-ribbon="true"]')).not.toBeNull();
    expect(within(ribbon).getByRole('group', { name: 'RAJZOLÁS' })).toBeInTheDocument();
    const lineButton = within(ribbon).getByRole('button', { name: 'VONAL, 2' });
    expect(lineButton).toHaveAttribute('data-active', 'true');
    expect(lineButton).toHaveAttribute('aria-pressed', 'true');
    expect(lineButton).toHaveAttribute('data-badge', '2');
    const moveButton = within(ribbon).getByRole('button', { name: 'MOZGATÁS, LOCKED' });
    expect(moveButton).toBeDisabled();
    expect(within(ribbon).queryByRole('button', { name: /TÖRLÉS/ })).toBeNull();

    const quickAccess = screen.getByTestId('grouped-quick-access');
    expect(within(quickAccess).getByRole('button', { name: 'VONAL, 2' })).toHaveAttribute('data-active', 'true');
    expect(within(quickAccess).getByRole('button', { name: 'MOZGATÁS, LOCKED' })).toBeDisabled();
    expect(within(quickAccess).queryByRole('button', { name: /TÖRLÉS/ })).toBeNull();

    const context = screen.getByTestId('grouped-context');
    expect(within(context).getByRole('menuitem', { name: 'VONAL, 2' })).toHaveAttribute('data-badge', '2');
    expect(within(context).getByRole('menuitem', { name: 'MOZGATÁS, LOCKED' })).toBeDisabled();
    expect(within(context).queryByRole('menuitem', { name: /TÖRLÉS/ })).toBeNull();
    expect(within(screen.getByTestId('grouped-palette')).queryByRole('button', { name: /TÖRLÉS/ })).toBeNull();

    fireEvent.click(lineButton);
    await waitFor(() => expect(commandHandler).toHaveBeenCalledWith(expect.objectContaining({
      commandId: 'line',
      command: expect.objectContaining({ id: 'line', active: false, badge: '' }),
      resolvedCommand: expect.objectContaining({ id: 'line', active: true, badge: 2 })
    })));
    fireEvent.click(moveButton);
    expect(commandHandler).toHaveBeenCalledTimes(1);
  });

  it('filters selection commands at the shared registry boundary and passes the snapshot to hosts', async () => {
    const empty = selectCadCuiCommands(SELECTION_CUI, SELECTION_CUI.defaultState, { surface: 'ribbon', tabId: 'home', selection: {} });
    expect(empty).toEqual([]);
    expect(selectCadCuiCommands(SELECTION_CUI, SELECTION_CUI.defaultState, {
      surface: 'ribbon',
      tabId: 'home',
      selection: { ids: ['line-01'], entityTypes: ['line'], traits: ['editable'] }
    }).map(command => command.id)).toEqual(['move', 'properties', 'erase']);
    expect(selectCadCuiCommands(SELECTION_CUI, SELECTION_CUI.defaultState, {
      surface: 'context',
      menuId: 'selection',
      selection: { ids: ['block-03'], entityTypes: ['block'], traits: ['editable'] }
    }).map(command => command.id)).toEqual(['move', 'explode', 'properties', 'erase']);

    const modifyExplode = vi.fn();
    const commandStates = vi.fn(() => ({}));
    renderSelectionFixture({
      selection: { ids: ['block-03'], entityTypes: ['block'], traits: ['editable'], source: 'canvas' },
      commandStates,
      handlers: { 'modify.explode': modifyExplode }
    });

    const ribbon = screen.getByTestId('selection-ribbon');
    expect(within(ribbon).getByRole('button', { name: 'MOZGATÁS' })).toBeInTheDocument();
    const explode = within(ribbon).getByRole('button', { name: 'SZÉTBONTÁS' });
    expect(commandStates).toHaveBeenCalledWith(expect.objectContaining({ id: 'explode' }), expect.objectContaining({
      selection: expect.objectContaining({ ids: ['block-03'], entityTypes: ['block'], traits: ['editable'], source: 'canvas' }),
      surface: 'ribbon'
    }));

    fireEvent.click(explode);
    await waitFor(() => expect(modifyExplode).toHaveBeenCalledWith(expect.objectContaining({
      commandId: 'explode',
      selection: expect.objectContaining({ ids: ['block-03'], source: 'canvas' })
    })));
  });

  it('executes only the selection shortcuts available for the current snapshot', async () => {
    const modifyMove = vi.fn();
    const modifyExplode = vi.fn();
    const modifyErase = vi.fn();
    renderSelectionFixture({
      selection: { ids: ['block-03'], entityTypes: ['block'], traits: ['editable'] },
      handlers: { 'modify.move': modifyMove, 'modify.explode': modifyExplode, 'modify.erase': modifyErase }
    });

    fireEvent.keyDown(window, { key: 'm' });
    await waitFor(() => expect(modifyMove).toHaveBeenCalledWith(expect.objectContaining({ commandId: 'move', source: 'shortcut' })));
    fireEvent.keyDown(window, { key: 'x' });
    await waitFor(() => expect(modifyExplode).toHaveBeenCalledWith(expect.objectContaining({ commandId: 'explode', source: 'shortcut' })));
    fireEvent.keyDown(window, { key: 'Del' });
    await waitFor(() => expect(modifyErase).toHaveBeenCalledWith(expect.objectContaining({ commandId: 'erase', source: 'shortcut' })));
  });

  it('keeps global shortcuts out of text, modal, repeated and out-of-scope interactions', async () => {
    const scope = document.createElement('section');
    const modelTarget = document.createElement('button');
    const outsideTarget = document.createElement('button');
    const textbox = document.createElement('div');
    textbox.setAttribute('role', 'textbox');
    scope.append(modelTarget, textbox);
    document.body.append(scope, outsideTarget);

    try {
      expect(shouldHandleCadShortcut({ target: modelTarget })).toBe(true);
      expect(shouldHandleCadShortcut({ target: modelTarget }, { scopeRoot: scope })).toBe(true);
      expect(shouldHandleCadShortcut({ target: outsideTarget }, { scopeRoot: scope })).toBe(false);
      expect(shouldHandleCadShortcut({ target: textbox })).toBe(false);
      expect(shouldHandleCadShortcut({ target: modelTarget, defaultPrevented: true })).toBe(false);
      expect(shouldHandleCadShortcut({ target: modelTarget, repeat: true })).toBe(false);
      expect(shouldHandleCadShortcut({ target: modelTarget, isComposing: true })).toBe(false);
      expect(shouldHandleCadShortcut({ target: modelTarget, keyCode: 229 })).toBe(false);

      const dialog = document.createElement('section');
      dialog.setAttribute('role', 'dialog');
      document.body.append(dialog);
      expect(shouldHandleCadShortcut({ target: modelTarget })).toBe(false);
      dialog.hidden = true;
      expect(shouldHandleCadShortcut({ target: modelTarget })).toBe(true);
      dialog.remove();
    } finally {
      scope.remove();
      outsideTarget.remove();
    }

    const modifyMove = vi.fn();
    renderScopedShortcutFixture({ handlers: { 'modify.move': modifyMove } });
    fireEvent.keyDown(screen.getByTestId('shortcut-scope-target'), { key: 'm' });
    await waitFor(() => expect(modifyMove).toHaveBeenCalledWith(expect.objectContaining({ source: 'shortcut' })));
    modifyMove.mockClear();
    fireEvent.keyDown(document.body, { key: 'm' });
    expect(modifyMove).not.toHaveBeenCalled();
  });

  it('does not guess when more than one available command uses a shortcut', () => {
    const first = vi.fn();
    const second = vi.fn();
    renderAmbiguousShortcutFixture({ handlers: { 'test.first': first, 'test.second': second } });
    fireEvent.keyDown(window, { key: 'm' });
    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });

  it('keeps the original flat ribbon markup when no registry groups are declared', () => {
    renderFixture();
    const ribbon = screen.getByTestId('ribbon');
    expect(selectCadCuiCommandGroups(TEST_CUI, TEST_CUI.defaultState, { surface: 'ribbon', tabId: 'file' })).toEqual([]);
    expect(ribbon.querySelector('[data-cui-grouped-ribbon]')).toBeNull();
    expect(ribbon.querySelector('[data-command-group-id]')).toBeNull();
  });
});
