import React, { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  CAD_WORKSPACE_PANEL_DOCK_ZONES,
  CAD_WORKSPACE_PANEL_ACTIONS,
  CadWorkspacePanelManager,
  createCadWorkspacePanelPreferencesKey,
  getCadWorkspacePanelPreference,
  groupCadWorkspacePanelsByDockZone,
  normalizeCadWorkspacePanelDockZone,
  normalizeCadWorkspacePanelPreferences,
  resetCadWorkspacePanelPreferences,
  updateCadWorkspacePanelPreference
} from '../src/index.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const PANEL_DEFINITIONS = [
  { id: 'source-catalogue', label: 'Source catalogue', description: 'Linked records', defaultOpen: true, defaultPlacement: 'docked' },
  { id: 'detail-surface', label: 'Detail surface', defaultOpen: false, defaultPlacement: 'floating' },
  { id: 'required-status', label: 'Required status', required: true, defaultOpen: true, floatable: false }
];

const FILTERABLE_PANEL_DEFINITIONS = [
  { id: 'tool-palette', label: 'Tool palette' },
  { id: 'object-snaps', label: 'Object snaps' },
  { id: 'properties', label: 'Properties' },
  { id: 'command-line', label: 'Command line' },
  { id: 'blocks', label: 'Blocks' },
  { id: 'materials', label: 'Materials' },
  { id: 'layer-browser', label: 'Layer browser' }
];

const ForwardedPanelIcon = React.forwardRef(function ForwardedPanelIcon(props, ref) {
  return <svg {...props} ref={ref} data-testid="forwarded-panel-icon" />;
});

describe('CadWorkspacePanelManager data contract', () => {
  it('normalizes aliases, retains panel metadata, and keeps unknown host records intact when updating', () => {
    const initial = {
      'source-catalogue': { visible: true, mode: 'floating', analytics: 'trace-a' },
      'detail-surface': false,
      inactiveFeature: { open: true, placement: 'float', retained: true }
    };
    const normalized = normalizeCadWorkspacePanelPreferences(PANEL_DEFINITIONS, initial);

    expect(normalized).toEqual({
      'source-catalogue': { analytics: 'trace-a', open: true, placement: 'float' },
      'detail-surface': { open: false, placement: 'float' },
      'required-status': { open: true, placement: 'dock' }
    });
    expect(getCadWorkspacePanelPreference(PANEL_DEFINITIONS, initial, 'source-catalogue')).toMatchObject({ open: true, placement: 'float' });

    const closed = updateCadWorkspacePanelPreference(PANEL_DEFINITIONS, initial, 'source-catalogue', CAD_WORKSPACE_PANEL_ACTIONS.CLOSE);
    expect(closed).toMatchObject({
      'source-catalogue': { analytics: 'trace-a', open: false, placement: 'float' },
      inactiveFeature: { retained: true }
    });
    expect(updateCadWorkspacePanelPreference(PANEL_DEFINITIONS, closed, 'required-status', 'close')).toBe(closed);

    const reset = resetCadWorkspacePanelPreferences(PANEL_DEFINITIONS, closed);
    expect(reset).toMatchObject({
      'source-catalogue': { analytics: 'trace-a', open: true, placement: 'dock' },
      'detail-surface': { open: false, placement: 'float' },
      inactiveFeature: { retained: true }
    });
  });

  it('creates stable scope-aware keys without reading or writing browser storage', () => {
    expect(createCadWorkspacePanelPreferencesKey({ namespace: 'Graph CAD', scope: 'Public User' })).toBe('graph-cad:public-user:panels');
    expect(createCadWorkspacePanelPreferencesKey('Graph CAD', 'Admin')).toBe('graph-cad:admin:panels');
  });

  it('keeps physical dock zones explicit, persists the last zone while floating, and restores the declared default', () => {
    const zonedPanels = [{
      id: 'layer-browser',
      label: 'Layer browser',
      defaultOpen: true,
      defaultPlacement: 'dock',
      defaultDockZone: 'left',
      dockZones: ['left', 'right', 'bottom']
    }];
    const initial = { 'layer-browser': { open: true, placement: 'dock', dockZone: 'footer', retained: 'host-metadata' } };

    expect(normalizeCadWorkspacePanelDockZone('command-line')).toBe(CAD_WORKSPACE_PANEL_DOCK_ZONES.BOTTOM);
    expect(normalizeCadWorkspacePanelPreferences(zonedPanels, initial)).toEqual({
      'layer-browser': { open: true, placement: 'dock', dockZone: 'bottom', retained: 'host-metadata' }
    });

    const moved = updateCadWorkspacePanelPreference(zonedPanels, initial, 'layer-browser', {
      type: CAD_WORKSPACE_PANEL_ACTIONS.SET_DOCK_ZONE,
      value: CAD_WORKSPACE_PANEL_DOCK_ZONES.RIGHT
    });
    expect(moved['layer-browser']).toMatchObject({ placement: 'dock', dockZone: 'right', retained: 'host-metadata' });

    const floating = updateCadWorkspacePanelPreference(zonedPanels, moved, 'layer-browser', 'float');
    expect(floating['layer-browser']).toMatchObject({ placement: 'float', dockZone: 'right' });

    const reset = resetCadWorkspacePanelPreferences(zonedPanels, floating);
    expect(reset['layer-browser']).toEqual({ open: true, placement: 'dock', dockZone: 'left', retained: 'host-metadata' });

    expect(updateCadWorkspacePanelPreference(zonedPanels, moved, 'layer-browser', {
      type: CAD_WORKSPACE_PANEL_ACTIONS.SET_DOCK_ZONE,
      value: 'top'
    })).toBe(moved);
  });

  it('groups only visible, docked declarations by their explicit physical zone', () => {
    const panels = [
      { id: 'tool-palette', label: 'Tool palette', defaultDockZone: 'left', dockZones: ['left', 'right', 'bottom'] },
      { id: 'object-snaps', label: 'Object snaps', defaultDockZone: 'left', dockZones: ['left', 'right', 'bottom'] },
      { id: 'constraints', label: 'Constraints', defaultDockZone: 'right', dockZones: ['left', 'right', 'bottom'] },
      { id: 'layers', label: 'Layers', defaultDockZone: 'bottom', dockZones: ['left', 'right', 'bottom'] }
    ];
    const grouped = groupCadWorkspacePanelsByDockZone(panels, {
      'object-snaps': { open: true, placement: 'dock', dockZone: 'bottom' },
      constraints: { open: false, placement: 'dock', dockZone: 'right' },
      layers: { open: true, placement: 'float', dockZone: 'bottom' }
    });

    expect(grouped.left.map(panel => panel.id)).toEqual(['tool-palette']);
    expect(grouped.right).toEqual([]);
    expect(grouped.bottom.map(panel => panel.id)).toEqual(['object-snaps']);
    expect(grouped.bottom[0].preference).toMatchObject({ placement: 'dock', dockZone: 'bottom' });
  });
});

describe('CadWorkspacePanelManager interactions', () => {
  it('accepts a forwardRef icon component without an icon-library adapter', () => {
    render(<CadWorkspacePanelManager panels={[{ ...PANEL_DEFINITIONS[0], icon: ForwardedPanelIcon }]} />);

    fireEvent.click(screen.getByRole('button', { name: /Workspace panels/ }));
    expect(screen.getByTestId('forwarded-panel-icon')).toBeInTheDocument();
  });

  it('reports open, close, dock, float and reset intents while keeping host layout ownership external', () => {
    const onChange = vi.fn();
    const onPanelChange = vi.fn();
    const onPanelOpen = vi.fn();
    const onPanelClose = vi.fn();
    const onPanelDock = vi.fn();
    const onPanelFloat = vi.fn();
    const onResetAll = vi.fn();
    const onMenuOpenChange = vi.fn();

    render(<CadWorkspacePanelManager
      panels={PANEL_DEFINITIONS}
      defaultValue={{
        'source-catalogue': { open: true, placement: 'dock' },
        'detail-surface': { open: false, placement: 'dock' }
      }}
      onChange={onChange}
      onPanelChange={onPanelChange}
      onPanelOpen={onPanelOpen}
      onPanelClose={onPanelClose}
      onPanelDock={onPanelDock}
      onPanelFloat={onPanelFloat}
      onResetAll={onResetAll}
      onMenuOpenChange={onMenuOpenChange}
      scope="ADMIN"
    />);

    const trigger = screen.getByRole('button', { name: /Workspace panels/ });
    fireEvent.click(trigger);
    expect(onMenuOpenChange).toHaveBeenLastCalledWith(true, expect.any(Object));
    expect(screen.getByRole('dialog', { name: 'Workspace panels' })).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hide Source catalogue' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Hide Source catalogue' }));
    expect(screen.getByRole('button', { name: 'Show Source catalogue' })).toHaveAttribute('aria-pressed', 'false');
    expect(onPanelClose).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'source-catalogue' }),
      expect.objectContaining({ open: false, placement: 'dock' }),
      expect.objectContaining({ action: 'close', source: 'workspace-panel-preferences' }),
      expect.any(Object)
    );
    expect(onPanelChange).toHaveBeenLastCalledWith('source-catalogue', expect.objectContaining({ open: false }), expect.any(Object), expect.any(Object));

    fireEvent.click(screen.getByRole('button', { name: 'Show Source catalogue' }));
    expect(onPanelOpen).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'source-catalogue' }),
      expect.objectContaining({ open: true, placement: 'dock' }),
      expect.objectContaining({ action: 'open' }),
      expect.any(Object)
    );

    fireEvent.click(screen.getByRole('button', { name: 'Float Detail surface' }));
    expect(onPanelFloat).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'detail-surface' }), expect.objectContaining({ placement: 'float' }), expect.any(Object), expect.any(Object));

    fireEvent.click(screen.getByRole('button', { name: 'Dock Detail surface' }));
    expect(onPanelDock).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'detail-surface' }), expect.objectContaining({ placement: 'dock' }), expect.any(Object), expect.any(Object));
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ 'detail-surface': expect.objectContaining({ placement: 'dock' }) }), expect.objectContaining({ action: 'dock' }), expect.any(Object));

    expect(screen.getByRole('button', { name: 'Hide Required status' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Float Required status' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reset workspace' }));
    expect(onResetAll).toHaveBeenLastCalledWith(expect.objectContaining({ 'source-catalogue': expect.objectContaining({ open: true, placement: 'dock' }) }), expect.objectContaining({ action: 'reset-all' }), expect.any(Object));
  });

  it('works in controlled mode and closes accessibly with Escape, returning focus to its trigger', async () => {
    function ControlledManager() {
      const [preferences, setPreferences] = useState({ 'source-catalogue': { open: true, placement: 'dock' } });
      return <CadWorkspacePanelManager
        panels={PANEL_DEFINITIONS.slice(0, 2)}
        value={preferences}
        onChange={setPreferences}
        triggerLabel="Configure view"
      />;
    }

    render(<ControlledManager />);
    const trigger = screen.getByRole('button', { name: /Configure view/ });
    trigger.focus();
    fireEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Close Workspace panels' })).toHaveFocus());
    fireEvent.click(screen.getByRole('button', { name: 'Float Source catalogue' }));
    expect(screen.getByRole('button', { name: 'Float Source catalogue' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('Source catalogue placement: floating')).toHaveTextContent('FLOATING');

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Workspace panels' })).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it('offers declared side and bottom dock zones as a separate serializable intent', () => {
    const onPanelDockZone = vi.fn();
    const onChange = vi.fn();
    const panels = [{
      id: 'layers',
      label: 'Layers',
      defaultOpen: true,
      defaultDockZone: 'left',
      dockZones: ['left', 'right', 'bottom']
    }];
    render(<CadWorkspacePanelManager panels={panels} onChange={onChange} onPanelDockZone={onPanelDockZone} />);

    fireEvent.click(screen.getByRole('button', { name: /Workspace panels/ }));
    const bottom = screen.getByRole('button', { name: 'Dock Layers to bottom' });
    expect(bottom).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(bottom);

    expect(bottom).toHaveAttribute('aria-pressed', 'true');
    expect(onPanelDockZone).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'layers' }),
      expect.objectContaining({ placement: 'dock', dockZone: 'bottom' }),
      expect.objectContaining({ action: 'dock-zone', source: 'workspace-panel-preferences' }),
      expect.any(Object)
    );
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ layers: expect.objectContaining({ dockZone: 'bottom' }) }),
      expect.objectContaining({ action: 'dock-zone' }),
      expect.any(Object)
    );
  });

  it('shows the panel filter only after six configured panels by default', () => {
    render(<CadWorkspacePanelManager panels={FILTERABLE_PANEL_DEFINITIONS.slice(0, 6)} />);

    fireEvent.click(screen.getByRole('button', { name: /Workspace panels/ }));
    expect(screen.queryByRole('searchbox', { name: 'Find panel' })).not.toBeInTheDocument();
  });

  it('filters a large panel list, reports shown results, handles no matches, and clears back to every panel', () => {
    render(<CadWorkspacePanelManager
      panels={FILTERABLE_PANEL_DEFINITIONS}
      defaultFilter="tool"
      filterLabel="Filter workspace panels"
      filterPlaceholder="Search workspace panels"
      clearFilterLabel="Clear workspace panel filter"
      filteredEmptyLabel="No matching workspace panels."
    />);

    fireEvent.click(screen.getByRole('button', { name: /Workspace panels/ }));
    const search = screen.getByRole('searchbox', { name: 'Filter workspace panels' });
    const shownCount = () => document.querySelector('.cad-workspace-panel-manager__filter-count');

    expect(search).toHaveValue('tool');
    expect(search).toHaveAttribute('placeholder', 'Search workspace panels');
    expect(document.querySelectorAll('[data-panel-id]')).toHaveLength(1);
    expect(document.querySelector('[data-panel-id="tool-palette"]')).toBeInTheDocument();
    expect(shownCount()).toHaveTextContent('1 SHOWN');

    fireEvent.change(search, { target: { value: 'layer' } });
    expect(document.querySelectorAll('[data-panel-id]')).toHaveLength(1);
    expect(document.querySelector('[data-panel-id="layer-browser"]')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Hide Tool palette' })).not.toBeInTheDocument();
    expect(shownCount()).toHaveTextContent('1 SHOWN');

    fireEvent.change(search, { target: { value: 'not-a-panel' } });
    expect(shownCount()).toHaveTextContent('0 SHOWN');
    expect(screen.getByText('No matching workspace panels.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clear workspace panel filter' }));
    expect(search).toHaveValue('');
    expect(document.querySelectorAll('[data-panel-id]')).toHaveLength(7);
    expect(shownCount()).toHaveTextContent('7 SHOWN');
  });

  it('forwards controlled filter changes to the host callback', () => {
    const onFilterChange = vi.fn();

    function ControlledFilterManager() {
      const [filter, setFilter] = useState('');
      const handleFilterChange = (nextFilter, event) => {
        onFilterChange(nextFilter, event);
        setFilter(nextFilter);
      };

      return <CadWorkspacePanelManager
        panels={FILTERABLE_PANEL_DEFINITIONS}
        filter={filter}
        onFilterChange={handleFilterChange}
      />;
    }

    render(<ControlledFilterManager />);
    fireEvent.click(screen.getByRole('button', { name: /Workspace panels/ }));
    const search = screen.getByRole('searchbox', { name: 'Find panel' });

    fireEvent.change(search, { target: { value: 'properties' } });
    expect(onFilterChange).toHaveBeenLastCalledWith('properties', expect.any(Object));
    expect(search).toHaveValue('properties');
    expect(document.querySelectorAll('[data-panel-id]')).toHaveLength(1);
    expect(document.querySelector('[data-panel-id="properties"]')).toBeInTheDocument();
  });
});
