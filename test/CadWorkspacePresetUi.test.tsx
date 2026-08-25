import React, { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  CAD_WORKSPACE_PRESET_ACTIONS,
  CadWorkspacePresetManager,
  getCadWorkspacePreset,
  isCadWorkspacePresetNameTaken,
  normalizeCadWorkspacePresets
} from '../src/CadWorkspacePresetUi';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const PRESETS = [
  { id: 'review', name: 'Review', description: 'Read-only detail layout', snapshot: { dock: 'right' } },
  { id: 'focused', label: 'Focused drafting', locked: true, snapshot: { dock: 'hidden' } }
];

describe('CadWorkspacePresetManager data contract', () => {
  it('normalizes presentational fields while leaving host snapshot metadata intact', () => {
    const presets = normalizeCadWorkspacePresets([
      { id: 'review', name: ' Review ', snapshot: { panels: ['properties'] } },
      { id: 'review', name: 'Ignored duplicate' },
      'Compact',
      null
    ]);

    expect(presets).toEqual([
      expect.objectContaining({ id: 'review', name: 'Review', snapshot: { panels: ['properties'] }, canOverwrite: true, canDelete: true }),
      expect.objectContaining({ id: 'Compact', name: 'Compact' })
    ]);
    expect(getCadWorkspacePreset(presets, 'review')).toMatchObject({ name: 'Review' });
    expect(isCadWorkspacePresetNameTaken(presets, 'compact')).toBe(true);
    expect(isCadWorkspacePresetNameTaken(presets, 'compact', { exceptId: 'Compact' })).toBe(false);
  });
});

describe('CadWorkspacePresetManager interactions', () => {
  it('emits save, load, overwrite, delete, export and import intents without owning preset state', () => {
    const onAction = vi.fn();
    const onSaveAs = vi.fn();
    const onLoad = vi.fn();
    const onOverwrite = vi.fn();
    const onDelete = vi.fn();
    const onExport = vi.fn();
    const onImport = vi.fn();
    const onSelectedPresetIdChange = vi.fn();
    const onDraftNameChange = vi.fn();

    render(<CadWorkspacePresetManager
      presets={PRESETS}
      selectedPresetId="review"
      draftName="Site review"
      onAction={onAction}
      onSaveAs={onSaveAs}
      onLoad={onLoad}
      onOverwrite={onOverwrite}
      onDelete={onDelete}
      onExport={onExport}
      onImport={onImport}
      onSelectedPresetIdChange={onSelectedPresetIdChange}
      onDraftNameChange={onDraftNameChange}
    />);

    fireEvent.change(screen.getByLabelText('Saved presets'), { target: { value: 'focused' } });
    expect(onSelectedPresetIdChange).toHaveBeenLastCalledWith(
      'focused',
      expect.objectContaining({ id: 'focused', readOnly: true }),
      expect.objectContaining({ type: CAD_WORKSPACE_PRESET_ACTIONS.SELECT }),
      expect.any(Object)
    );
    // The parent did not update the controlled value, so the rendered selection stays put.
    expect(screen.getByLabelText('Saved presets')).toHaveValue('review');

    fireEvent.change(screen.getByLabelText('Preset name'), { target: { value: 'New review' } });
    expect(onDraftNameChange).toHaveBeenLastCalledWith(
      'New review',
      expect.objectContaining({ type: CAD_WORKSPACE_PRESET_ACTIONS.DRAFT_NAME_CHANGE, name: 'New review' }),
      expect.any(Object)
    );
    expect(screen.getByLabelText('Preset name')).toHaveValue('Site review');

    fireEvent.click(screen.getByRole('button', { name: 'Save as Site review' }));
    fireEvent.click(screen.getByRole('button', { name: 'Load' }));
    fireEvent.click(screen.getByRole('button', { name: 'Overwrite' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    fireEvent.click(screen.getByRole('button', { name: 'Import' }));

    expect(onSaveAs).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'save-as', name: 'Site review' }), expect.any(Object));
    expect(onLoad).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'load', preset: expect.objectContaining({ id: 'review' }) }), expect.any(Object));
    expect(onOverwrite).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'overwrite', preset: expect.objectContaining({ id: 'review' }) }), expect.any(Object));
    expect(onDelete).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'delete', preset: expect.objectContaining({ id: 'review' }) }), expect.any(Object));
    expect(onExport).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'export', presets: expect.arrayContaining([expect.objectContaining({ id: 'review' })]) }), expect.any(Object));
    expect(onImport).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'import' }), expect.any(Object));
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ source: 'workspace-preset-manager' }), expect.any(Object));
  });

  it('allows the host to control name and preset selection, and protects read-only presets', () => {
    function ControlledManager() {
      const [selectedPresetId, setSelectedPresetId] = useState('review');
      const [draftName, setDraftName] = useState('');
      return <CadWorkspacePresetManager
        presets={PRESETS}
        selectedPresetId={selectedPresetId}
        draftName={draftName}
        onSelectedPresetIdChange={setSelectedPresetId}
        onDraftNameChange={setDraftName}
        onSaveAs={() => {}}
        onLoad={() => {}}
        onOverwrite={() => {}}
        onDelete={() => {}}
      />;
    }

    render(<ControlledManager />);
    fireEvent.change(screen.getByLabelText('Preset name'), { target: { value: 'Focused drafting' } });
    expect(screen.getByRole('alert')).toHaveTextContent('A preset with this name already exists.');
    expect(screen.getByRole('button', { name: 'Save as Focused drafting' })).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Saved presets'), { target: { value: 'focused' } });
    expect(screen.getByText('Protected preset')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Load' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Overwrite' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
  });

  it('keeps transfer actions host-owned and surfaces host status accessibly', () => {
    const onImport = vi.fn();
    render(<CadWorkspacePresetManager
      presets={[]}
      selectedPresetId="unknown"
      draftName=""
      onImport={onImport}
      status="Imported 3 presets."
      statusTone="success"
    />);

    expect(screen.getByText('No saved presets yet.')).toHaveAttribute('role', 'status');
    expect(screen.getByRole('button', { name: 'Export' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Import' })).toBeEnabled();
    expect(screen.getByText('Imported 3 presets.')).toHaveAttribute('role', 'status');
    fireEvent.click(screen.getByRole('button', { name: 'Import' }));
    expect(onImport).toHaveBeenCalledWith(expect.objectContaining({ type: 'import', presets: [] }), expect.any(Object));
  });

  it('shows a compact first-save checklist only while the host has no presets', () => {
    const { rerender } = render(<CadWorkspacePresetManager
      presets={[]}
      draftName=""
      onDraftNameChange={() => {}}
      onSaveAs={() => {}}
    />);

    const guide = screen.getByRole('list', { name: 'First preset checklist' });
    expect(guide).toHaveTextContent('Name the current workspace below.');
    expect(guide).toHaveTextContent('Choose Save as to store it.');
    expect(guide).toHaveTextContent('Later, choose it from Saved presets and select Load.');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);

    rerender(<CadWorkspacePresetManager
      presets={PRESETS}
      selectedPresetId="review"
      draftName=""
      onSelectedPresetIdChange={() => {}}
      onDraftNameChange={() => {}}
      onSaveAs={() => {}}
    />);

    expect(screen.queryByRole('list', { name: 'First preset checklist' })).not.toBeInTheDocument();
    expect(screen.queryByText('Name the current workspace below.')).not.toBeInTheDocument();
  });
});
