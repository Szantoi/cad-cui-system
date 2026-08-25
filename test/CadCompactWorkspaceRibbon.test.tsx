import React, { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import {
  CadCompactWorkspaceRibbon,
  resolveCadCompactWorkspaceRibbonGroups
} from '../src/index';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const tabs = [
  { id: 'file', label: 'FILE', tone: 'cyan' },
  { id: 'view', label: 'VIEW', tone: 'magenta' },
  { id: 'admin', label: 'ADMIN', disabled: true }
];

const commands = [
  { id: 'open', label: 'OPEN', placement: { tab: 'file', group: 'DRAWING', order: 10 } },
  { id: 'save', label: 'SAVE', placement: { tab: 'file', group: 'DRAWING', order: 20 } },
  { id: 'layers', label: 'LAYERS', toggle: true, active: false, placement: { tab: 'view', group: 'DISPLAY', order: 10 } },
  { id: 'grid', label: 'GRID', toggle: true, active: true, placement: { tab: 'view', group: 'DISPLAY', order: 20 } },
  { id: 'fit', label: 'ZOOM EXTENTS', placement: { tab: 'view', group: 'CAMERA', order: 30 } }
];

describe('resolveCadCompactWorkspaceRibbonGroups', () => {
  it('uses the same tab and placement.group contract as the full workspace ribbon', () => {
    expect(resolveCadCompactWorkspaceRibbonGroups({ commands, tabId: 'view' })).toMatchObject([
      { id: 'DISPLAY', label: 'DISPLAY', commands: [commands[2], commands[3]] },
      { id: 'CAMERA', label: 'CAMERA', commands: [commands[4]] }
    ]);
  });

  it('prefers caller-owned groups when a host has already arranged them', () => {
    const result = resolveCadCompactWorkspaceRibbonGroups({
      tabId: 'view',
      groups: [
        { id: 'inspect', label: 'INSPECT', tabId: 'view', order: 20, commands: [{ id: 'properties', label: 'PROPERTIES' }] },
        { id: 'ignored', label: 'IGNORED', tabId: 'file', commands: [{ id: 'open', label: 'OPEN' }] }
      ],
      commands
    });

    expect(result).toEqual([{ id: 'inspect', label: 'INSPECT', order: 20, commands: [{ id: 'properties', label: 'PROPERTIES' }] }]);
  });
});

describe('CadCompactWorkspaceRibbon', () => {
  it('reveals tab → group → command, closes after selection, and closes on the second tab click', () => {
    const onCommand = vi.fn();
    const onOpenTabChange = vi.fn();
    const onOpenGroupChange = vi.fn();

    render(<CadCompactWorkspaceRibbon
      tabs={tabs}
      defaultActiveTab="file"
      commands={commands}
      onCommand={onCommand}
      onOpenTabChange={onOpenTabChange}
      onOpenGroupChange={onOpenGroupChange}
    />);

    expect(screen.queryByRole('region', { name: 'VIEW compact command menu' })).not.toBeInTheDocument();
    const viewTab = screen.getByRole('tab', { name: 'VIEW' });
    fireEvent.click(viewTab);

    const menu = screen.getByRole('region', { name: 'VIEW compact command menu' });
    expect(viewTab).toHaveAttribute('aria-selected', 'true');
    expect(within(menu).getByRole('button', { name: /DISPLAY/ })).toHaveAttribute('aria-expanded', 'false');
    expect(within(menu).getByRole('button', { name: /CAMERA/ })).toBeInTheDocument();
    expect(within(menu).queryByRole('button', { name: 'LAYERS' })).not.toBeInTheDocument();
    expect(onOpenTabChange).toHaveBeenLastCalledWith('view', expect.objectContaining({ id: 'view' }), expect.any(Object));

    fireEvent.click(within(menu).getByRole('button', { name: /DISPLAY/ }));
    const layers = within(menu).getByRole('button', { name: 'LAYERS' });
    expect(layers).toHaveAttribute('aria-pressed', 'false');
    expect(within(menu).getByRole('button', { name: 'GRID' })).toHaveAttribute('aria-pressed', 'true');
    expect(onOpenGroupChange).toHaveBeenLastCalledWith('DISPLAY', expect.objectContaining({ id: 'DISPLAY' }), expect.objectContaining({ id: 'view' }), expect.any(Object));

    fireEvent.click(layers);
    expect(onCommand).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'layers' }),
      expect.objectContaining({ source: 'compact-workspace-ribbon', compact: true, group: expect.objectContaining({ id: 'DISPLAY' }) }),
      expect.any(Object)
    );
    expect(screen.queryByRole('region', { name: 'VIEW compact command menu' })).not.toBeInTheDocument();

    fireEvent.click(viewTab);
    expect(screen.getByRole('region', { name: 'VIEW compact command menu' })).toBeInTheDocument();

    fireEvent.click(viewTab);
    expect(screen.queryByRole('region', { name: 'VIEW compact command menu' })).not.toBeInTheDocument();
    expect(onOpenGroupChange).toHaveBeenLastCalledWith(null, null, expect.objectContaining({ id: 'view' }), expect.any(Object));
    expect(onOpenTabChange).toHaveBeenLastCalledWith(null, null, expect.any(Object));
  });

  it('supports a host-owned open/close panel toggle without auto-closing the command menu', () => {
    function PanelToggleHarness() {
      const [panelOpen, setPanelOpen] = useState(false);
      return <CadCompactWorkspaceRibbon
        tabs={tabs}
        defaultActiveTab="view"
        commands={[{ id: 'layers', label: 'LAYERS', toggle: true, active: panelOpen, placement: { tab: 'view', group: 'DISPLAY' } }]}
        closeOnCommand={false}
        onCommand={() => setPanelOpen(current => !current)}
      />;
    }

    render(<PanelToggleHarness />);
    fireEvent.click(screen.getByRole('tab', { name: 'VIEW' }));
    fireEvent.click(screen.getByRole('button', { name: /DISPLAY/ }));
    const layers = screen.getByRole('button', { name: 'LAYERS' });

    fireEvent.click(layers);
    expect(layers).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('region', { name: 'VIEW compact command menu' })).toBeInTheDocument();

    fireEvent.click(layers);
    expect(layers).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('region', { name: 'VIEW compact command menu' })).toBeInTheDocument();
  });

  it('closes by default when the pointer or focus leaves its compact flyout', () => {
    render(<><CadCompactWorkspaceRibbon tabs={tabs} defaultActiveTab="view" commands={commands} /><button type="button">OUTSIDE</button></>);
    const viewTab = screen.getByRole('tab', { name: 'VIEW' });
    const outside = screen.getByRole('button', { name: 'OUTSIDE' });

    fireEvent.click(viewTab);
    expect(screen.getByRole('region', { name: 'VIEW compact command menu' })).toBeInTheDocument();
    fireEvent.pointerLeave(viewTab.closest('.cad-popover'));
    expect(screen.queryByRole('region', { name: 'VIEW compact command menu' })).not.toBeInTheDocument();

    fireEvent.click(viewTab);
    const compactPopover = viewTab.closest('.cad-popover');
    expect(screen.getByRole('region', { name: 'VIEW compact command menu' })).toBeInTheDocument();
    fireEvent.blur(compactPopover, { relatedTarget: outside });
    expect(screen.queryByRole('region', { name: 'VIEW compact command menu' })).not.toBeInTheDocument();
  });

  it('closes its disclosure on Escape and outside interaction', () => {
    render(<><CadCompactWorkspaceRibbon tabs={tabs} defaultActiveTab="view" commands={commands} /><button type="button">OUTSIDE</button></>);
    const viewTab = screen.getByRole('tab', { name: 'VIEW' });

    fireEvent.click(viewTab);
    expect(screen.getByRole('region', { name: 'VIEW compact command menu' })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('region', { name: 'VIEW compact command menu' })).not.toBeInTheDocument();

    fireEvent.click(viewTab);
    expect(screen.getByRole('region', { name: 'VIEW compact command menu' })).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByRole('button', { name: 'OUTSIDE' }));
    expect(screen.queryByRole('region', { name: 'VIEW compact command menu' })).not.toBeInTheDocument();
  });

  it('can be driven by controlled disclosure state', () => {
    function ControlledHarness() {
      const [openTabId, setOpenTabId] = useState(null);
      const [openGroupId, setOpenGroupId] = useState(null);
      return <CadCompactWorkspaceRibbon
        tabs={tabs}
        activeTab="view"
        commands={commands}
        openTabId={openTabId}
        openGroupId={openGroupId}
        onOpenTabChange={nextTabId => setOpenTabId(nextTabId)}
        onOpenGroupChange={nextGroupId => setOpenGroupId(nextGroupId)}
      />;
    }

    render(<ControlledHarness />);
    fireEvent.click(screen.getByRole('tab', { name: 'VIEW' }));
    expect(screen.getByRole('region', { name: 'VIEW compact command menu' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /CAMERA/ }));
    expect(screen.getByRole('button', { name: 'ZOOM EXTENTS' })).toBeInTheDocument();
  });
});
