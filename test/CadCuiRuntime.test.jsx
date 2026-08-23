import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CadCuiCommandPalette, CadCuiContextMenu, CadCuiCustomizer, CadCuiProvider, CadCuiQuickAccess, CadCuiRibbon, defineCadCuiSystem, loadCadCuiState, sanitizeCadCuiState, selectCadCuiCommands, useCadCui } from '../src/index.js';

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
    { id: 'open-explorer', label: 'EXPLORER', detail: 'Dokumentumok megnyitása', tone: 'cyan', toolId: 'explorer', intent: { type: 'panel.open', panelId: 'explorer' }, placements: [{ surface: 'ribbon', tab: 'file', order: 10 }, { surface: 'quick-access', order: 10 }, { surface: 'context', menu: 'node', order: 10 }] },
    { id: 'go-knowledge', label: 'TUDÁSTÁR', detail: 'Ugrás a tudástárba', tone: 'green', intent: { type: 'route.navigate', to: '/knowledge?project_id=prj-alpha' }, placements: [{ surface: 'ribbon', tab: 'file', order: 20 }, { surface: 'context', menu: 'node', order: 20 }] },
    { id: 'admin-editor', label: 'SZERKESZTŐ', detail: 'Védett admin parancs', tone: 'magenta', requires: ['admin'], intent: { type: 'panel.open', panelId: 'editor' }, placements: [{ surface: 'ribbon', tab: 'file', order: 30 }] }
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

function Fixture({ capabilities = {}, handlers = {} }) {
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

function renderFixture(options) {
  return render(<MemoryRouter initialEntries={['/graph']}>
    <Routes><Route path="*" element={<Fixture {...options} />} /></Routes>
  </MemoryRouter>);
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('CAD CUI runtime', () => {
  it('keeps command placement and authorization in the declarative schema', () => {
    expect(selectCadCuiCommands(TEST_CUI, TEST_CUI.defaultState, { surface: 'ribbon', tabId: 'file' }).map(command => command.id)).toEqual(['open-explorer', 'go-knowledge']);
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
});
