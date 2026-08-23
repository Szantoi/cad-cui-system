import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { CadWorkspaceRibbon, groupCadWorkspaceRibbonCommands } from '../src/index.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const ribbonTabs = [
  { id: 'file', label: 'FILE', tone: 'cyan' },
  { id: 'view', label: 'VIEW', tone: 'magenta' },
  { id: 'admin', label: 'ADMIN', disabled: true }
];

const ribbonCommands = [
  { id: 'save', label: 'SAVE', icon: 'save', shortcut: 'CTRL+S', placement: { tab: 'file', group: 'FILE', order: 20 } },
  { id: 'open', label: 'OPEN', icon: 'folder', placement: { tab: 'file', group: 'FILE', order: 10 } },
  { id: 'layers', label: 'LAYERS', badge: 3, placement: { tab: 'view', group: 'DISPLAY', order: 10 } },
  { id: 'fit', label: 'ZOOM EXTENTS', placement: { tab: 'view', group: 'CAMERA', order: 20 } }
];

describe('CadWorkspaceRibbon data contract', () => {
  it('groups runtime placements and plain command fields in deterministic order', () => {
    expect(groupCadWorkspaceRibbonCommands(ribbonCommands, { tabId: 'file' })).toEqual([
      {
        id: 'FILE',
        label: 'FILE',
        commands: [ribbonCommands[1], ribbonCommands[0]]
      }
    ]);

    const groups = groupCadWorkspaceRibbonCommands([
      { id: 'properties', label: 'PROPERTIES', tabId: 'view', groupId: 'inspect', groupLabel: 'INSPECT', order: 30 },
      { id: 'layers', label: 'LAYERS', tabId: 'view', groupId: 'inspect', groupLabel: 'INSPECT', order: 10 },
      { id: 'draw', label: 'DRAW', tabId: 'edit', group: 'CREATE', order: 10 }
    ], { tabId: 'view' });

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({ id: 'inspect', label: 'INSPECT' });
    expect(groups[0].commands.map(command => command.id)).toEqual(['layers', 'properties']);
  });
});

describe('CadWorkspaceRibbon', () => {
  it('owns uncontrolled tab/minimized state and reports selected commands without a renderer dependency', () => {
    const onActiveTabChange = vi.fn();
    const onMinimizedChange = vi.fn();
    const onCommand = vi.fn();
    const Icon = () => <svg data-testid="ribbon-icon" />;

    render(
      <CadWorkspaceRibbon
        tabs={ribbonTabs}
        defaultActiveTab="file"
        commands={ribbonCommands}
        onActiveTabChange={onActiveTabChange}
        onMinimizedChange={onMinimizedChange}
        onCommand={onCommand}
        renderIcon={command => command.icon ? <Icon /> : null}
        identity={<strong>DRAWING</strong>}
        status={<span>3 ACTIVE LAYERS</span>}
      />
    );

    const tablist = screen.getByRole('tablist', { name: 'Workspace commands' });
    const fileTab = within(tablist).getByRole('tab', { name: 'FILE' });
    const viewTab = within(tablist).getByRole('tab', { name: 'VIEW' });
    expect(fileTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', fileTab.getAttribute('aria-controls'));
    expect(screen.getByText('DRAWING')).toBeInTheDocument();
    expect(screen.getByLabelText('Workspace status')).toHaveTextContent('3 ACTIVE LAYERS');
    expect(screen.getAllByTestId('ribbon-icon')).toHaveLength(2);
    expect(screen.getByText('FILE', { selector: '.cad-workspace-ribbon__group-label' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'OPEN' }));
    expect(onCommand).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'open' }),
      expect.objectContaining({ source: 'workspace-ribbon', activeTab: expect.objectContaining({ id: 'file' }) }),
      expect.any(Object)
    );

    fireEvent.keyDown(fileTab, { key: 'ArrowRight' });
    expect(viewTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', viewTab.getAttribute('aria-controls'));
    expect(onActiveTabChange).toHaveBeenLastCalledWith('view', expect.objectContaining({ id: 'view' }), expect.any(Object));
    expect(screen.getByRole('button', { name: 'LAYERS' })).toHaveAttribute('data-command-id', 'layers');
    expect(screen.getByRole('button', { name: 'LAYERS' })).toHaveTextContent('3');

    fireEvent.click(screen.getByRole('button', { name: 'Minimize ribbon' }));
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
    expect(onMinimizedChange).toHaveBeenLastCalledWith(true, expect.any(Object));
    expect(screen.getByRole('button', { name: 'Expand ribbon' })).toBeInTheDocument();
  });

  it('uses caller-owned explicit groups, command renderers, and controlled state', () => {
    const onCommand = vi.fn();
    const renderCommand = vi.fn((command, context) => <button key={command.id} type="button" data-testid={`custom-${command.id}`} onClick={context.execute}>{command.label} CUSTOM</button>);

    const { rerender } = render(
      <CadWorkspaceRibbon
        tabs={ribbonTabs}
        activeTab="view"
        minimized={false}
        onCommand={onCommand}
        renderCommand={renderCommand}
        groups={[
          { id: 'navigation', label: 'NAVIGATION', tabId: 'view', commands: [{ id: 'orbit', label: 'ORBIT' }] },
          { id: 'ignored', label: 'IGNORED', tabId: 'file', commands: [{ id: 'save', label: 'SAVE' }] }
        ]}
      />
    );

    expect(screen.getByText('NAVIGATION')).toBeInTheDocument();
    expect(screen.queryByText('IGNORED')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('custom-orbit'));
    expect(onCommand).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'orbit' }),
      expect.objectContaining({ activeTab: expect.objectContaining({ id: 'view' }) }),
      expect.any(Object)
    );

    rerender(<CadWorkspaceRibbon tabs={ribbonTabs} activeTab="file" minimized={true} groups={[]} />);
    expect(screen.getByRole('tab', { name: 'FILE' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
  });
});
