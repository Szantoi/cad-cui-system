import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  CadCommandLine,
  CadDrawingSpaceTabs,
  CadLayerPanel,
  CadObjectTree,
  CadPropertyGrid,
  CadStatusBar,
  CadToolPalette,
  CadWorkspaceProfileTabs,
  createCadWorkspaceProfile,
  removeCadWorkspaceProfile
} from '../src/index.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CAD workspace primitives', () => {
  it('selects drawing spaces by click and keyboard, and exposes close and create callbacks', () => {
    const onChange = vi.fn();
    const onClose = vi.fn();
    const onCreate = vi.fn();

    render(
      <CadDrawingSpaceTabs
        items={[
          { id: 'model', label: 'Model', kind: 'model', pinned: true },
          { id: 'layout-1', label: 'Layout 1', closable: true },
          { id: 'layout-2', label: 'Layout 2', closable: true, disabled: true }
        ]}
        defaultActiveId="model"
        onChange={onChange}
        onClose={onClose}
        onCreate={onCreate}
        addButtonProps={{ 'data-testid': 'create-space' }}
      />
    );

    const tablist = screen.getByRole('tablist', { name: 'Drawing spaces' });
    const modelTab = screen.getByRole('tab', { name: 'Model' });
    const layoutOneTab = screen.getByRole('tab', { name: 'Layout 1' });

    expect(modelTab).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(layoutOneTab);
    expect(layoutOneTab).toHaveAttribute('aria-selected', 'true');
    expect(onChange.mock.calls.at(-1)[0]).toBe('layout-1');

    fireEvent.keyDown(layoutOneTab, { key: 'ArrowRight' });
    expect(modelTab).toHaveAttribute('aria-selected', 'true');
    expect(onChange.mock.calls.at(-1)[0]).toBe('model');

    fireEvent.click(screen.getByRole('button', { name: 'Close Layout 1' }));
    expect(onClose.mock.calls[0][0]).toMatchObject({ id: 'layout-1', label: 'Layout 1' });

    fireEvent.click(screen.getByTestId('create-space'));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('maps persisted workspace profiles to a pinned Model/Layout/+ strip', () => {
    const onChange = vi.fn();
    const onClose = vi.fn();
    const onCreate = vi.fn();
    render(
      <CadWorkspaceProfileTabs
        profiles={[
          { id: 'model', name: 'Model', snapshot: { kind: 'root' } },
          { id: 'review', name: 'Review board', snapshot: { kind: 'review' } }
        ]}
        activeId="model"
        onChange={onChange}
        onClose={onClose}
        onCreate={onCreate}
      />
    );

    expect(screen.queryByRole('button', { name: 'Close Model' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Review board' }));
    expect(onChange.mock.calls[0][0]).toBe('review');
    expect(onChange.mock.calls[0][1]).toMatchObject({ snapshot: { kind: 'review' } });
    fireEvent.click(screen.getByRole('button', { name: 'Close Review board' }));
    expect(onClose.mock.calls[0][0]).toBe('review');
    fireEvent.click(screen.getByRole('button', { name: 'New layout' }));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('creates a distinct profile and returns Model when the active layout is removed', () => {
    const profiles = createCadWorkspaceProfile([
      { id: 'model', name: 'Model' },
      { id: 'layout', name: 'Layout 1', snapshot: { dock: 'left' } }
    ], { id: 'layout', name: 'Layout 2', snapshot: { dock: 'right' } });
    expect(profiles.map(profile => profile.id)).toEqual(['model', 'layout', 'layout-2']);
    expect(profiles.at(-1)).toMatchObject({ name: 'Layout 2', snapshot: { dock: 'right' } });

    const next = removeCadWorkspaceProfile(profiles, 'layout-2', 'layout-2');
    expect(next.activeId).toBe('model');
    expect(next.profiles.map(profile => profile.id)).toEqual(['model', 'layout']);
  });

  it('submits typed commands and keyboard-selected suggestions', () => {
    const onSubmit = vi.fn();
    const onSuggestionSelect = vi.fn();

    render(
      <CadCommandLine
        suggestions={[{ id: 'move', label: 'MOVE', detail: 'Move selected objects' }]}
        onSubmit={onSubmit}
        onSuggestionSelect={onSuggestionSelect}
        submitSuggestionOnEnter
      />
    );

    const input = screen.getByRole('combobox', { name: 'Command:' });
    const form = input.closest('form');
    expect(form).not.toBeNull();

    fireEvent.focus(input);
    const suggestion = screen.getByRole('option', { name: /move/i });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(suggestion).toHaveAttribute('aria-selected', 'true');
    fireEvent.submit(form);

    expect(onSuggestionSelect.mock.calls[0][0]).toMatchObject({ id: 'move', label: 'MOVE' });
    expect(onSubmit.mock.calls[0][0]).toBe('MOVE');
    expect(input).toHaveValue('');

    fireEvent.change(input, { target: { value: 'LINE 0,0 10,0' } });
    fireEvent.submit(form);
    expect(onSubmit.mock.calls.at(-1)[0]).toBe('LINE 0,0 10,0');
    expect(input).toHaveValue('');
  });

  it('keeps command history in a fixed, accessible, resizable command area', () => {
    const onHeightChange = vi.fn();
    const history = Array.from({ length: 16 }, (_, index) => ({ id: `command-${index}`, label: `COMMAND ${index}`, detail: `Result ${index}` }));
    const { rerender } = render(
      <CadCommandLine
        defaultHeight={120}
        minHeight={96}
        maxHeight={144}
        resizeStep={8}
        history={history}
        onHeightChange={onHeightChange}
      />
    );

    const resizeHandle = screen.getByRole('separator', { name: 'Resize command line' });
    const commandLine = resizeHandle.closest('.cad-command-line');
    expect(commandLine.style.getPropertyValue('--cad-command-line-height')).toBe('120px');
    expect(resizeHandle).toHaveAttribute('aria-valuenow', '120');
    expect(screen.getByLabelText('Command history').parentElement).toHaveClass('cad-command-line__transcript');

    fireEvent.keyDown(resizeHandle, { key: 'ArrowUp' });
    expect(commandLine.style.getPropertyValue('--cad-command-line-height')).toBe('128px');
    expect(onHeightChange).toHaveBeenLastCalledWith(128, expect.anything());

    fireEvent.pointerDown(resizeHandle, { button: 0, pointerId: 12, clientY: 200 });
    fireEvent.pointerMove(resizeHandle, { pointerId: 12, clientY: 184 });
    fireEvent.pointerUp(resizeHandle, { pointerId: 12, clientY: 184 });
    expect(commandLine.style.getPropertyValue('--cad-command-line-height')).toBe('144px');

    fireEvent.keyDown(resizeHandle, { key: 'Home' });
    expect(commandLine.style.getPropertyValue('--cad-command-line-height')).toBe('96px');
    fireEvent.keyDown(resizeHandle, { key: 'End' });
    expect(commandLine.style.getPropertyValue('--cad-command-line-height')).toBe('144px');

    rerender(<CadCommandLine height={112} minHeight={96} maxHeight={144} onHeightChange={onHeightChange} />);
    const controlledHandle = screen.getByRole('separator', { name: 'Resize command line' });
    const controlledLine = controlledHandle.closest('.cad-command-line');
    fireEvent.keyDown(controlledHandle, { key: 'ArrowUp' });
    expect(onHeightChange).toHaveBeenLastCalledWith(120, expect.anything());
    expect(controlledLine.style.getPropertyValue('--cad-command-line-height')).toBe('112px');
  });

  it('reports status mode changes from the status bar', () => {
    const onModeChange = vi.fn();
    const snap = { id: 'snap', label: 'SNAP', active: false, shortcut: 'F9' };

    render(
      <CadStatusBar
        coordinates={{ x: 12.5, y: 8 }}
        layout="tiles"
        modes={[snap]}
        onModeChange={onModeChange}
      />
    );

    expect(screen.getByLabelText('CAD status bar')).toHaveAttribute('data-layout', 'tiles');
    expect(screen.getByLabelText('Coordinates')).toHaveTextContent(/X: 12\.5\s+Y: 8/);
    const snapButton = screen.getByRole('button', { name: 'SNAP' });
    expect(snapButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(snapButton);
    expect(onModeChange.mock.calls[0].slice(0, 3)).toEqual([
      'snap',
      true,
      expect.objectContaining({ id: 'snap', label: 'SNAP' })
    ]);
  });

  it('marks a dockable tool palette for panel-local tile layout without changing its toolbar semantics', () => {
    const onAction = vi.fn();
    render(<CadToolPalette layout="auto" items={[{ id: 'line', label: 'Line' }, { id: 'move', label: 'Move' }]} onAction={onAction} />);

    const palette = screen.getByRole('toolbar', { name: 'CAD tool palette' });
    expect(palette).toHaveAttribute('data-layout', 'auto');
    fireEvent.click(screen.getByRole('button', { name: 'Line' }));
    expect(onAction.mock.calls[0][0]).toMatchObject({ id: 'line', label: 'Line' });
  });
});

describe('CAD inspector primitives', () => {
  it('filters and mutates layers through their explicit callbacks', () => {
    const onActiveLayerChange = vi.fn();
    const onLayerChange = vi.fn();
    const onAddLayer = vi.fn();
    const onDeleteLayer = vi.fn();

    render(
      <CadLayerPanel
        layers={[
          { id: 'walls', label: 'Walls', visible: true, color: '#ff0000' },
          { id: 'dimensions', label: 'Dimensions', visible: true, color: '#00ff00' }
        ]}
        activeLayerId="walls"
        onActiveLayerChange={onActiveLayerChange}
        onLayerChange={onLayerChange}
        onAddLayer={onAddLayer}
        onDeleteLayer={onDeleteLayer}
      />
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Filter layers' }), { target: { value: 'wall' } });
    expect(screen.getByRole('button', { name: 'Walls' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Dimensions' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Walls' }));
    expect(onActiveLayerChange.mock.calls[0][0]).toBe('walls');

    fireEvent.click(screen.getByRole('button', { name: 'Walls: hide' }));
    expect(onLayerChange.mock.calls[0].slice(0, 2)).toEqual(['walls', { visible: false }]);

    fireEvent.click(screen.getByRole('button', { name: 'Add layer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete active layer' }));
    expect(onAddLayer).toHaveBeenCalledTimes(1);
    expect(onDeleteLayer).toHaveBeenCalledTimes(1);
  });

  it('emits typed property changes from the property grid', () => {
    const onValueChange = vi.fn();

    render(
      <CadPropertyGrid
        properties={[
          { id: 'height', label: 'Height', type: 'number', value: 2500, unit: 'mm' },
          { id: 'visible', label: 'Visible', type: 'boolean', value: true, onLabel: 'On', offLabel: 'Off' }
        ]}
        onValueChange={onValueChange}
      />
    );

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Height' }), { target: { value: '2750' } });
    expect(onValueChange.mock.calls[0].slice(0, 2)).toEqual(['height', 2750]);

    fireEvent.click(screen.getByRole('checkbox', { name: /visible/i }));
    expect(onValueChange.mock.calls.at(-1).slice(0, 2)).toEqual(['visible', false]);
  });

  it('expands object tree branches and reports selected objects', () => {
    const onSelect = vi.fn();
    const onExpandedChange = vi.fn();

    render(
      <CadObjectTree
        nodes={[{
          id: 'model',
          label: 'Model',
          children: [{ id: 'wall-a', label: 'Wall A' }]
        }]}
        onSelect={onSelect}
        onExpandedChange={onExpandedChange}
      />
    );

    expect(screen.queryByRole('button', { name: 'Wall A' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Expand Model' }));
    expect(onExpandedChange.mock.calls[0][0]).toEqual(['model']);

    const child = screen.getByRole('button', { name: 'Wall A' });
    fireEvent.click(child);
    expect(onSelect.mock.calls[0][0]).toBe('wall-a');
    expect(onSelect.mock.calls[0][1]).toMatchObject({ id: 'wall-a', label: 'Wall A' });
  });
});
