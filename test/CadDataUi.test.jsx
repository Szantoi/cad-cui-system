import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import {
  CadDataGrid,
  CadQuickProperties,
  CadSelectionCycler,
  CadSelectionFilter
} from '../src/CadDataUi.jsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CadDataUi data primitives', () => {
  it('sorts data-grid rows and reports row selection changes', () => {
    const onSelectionChange = vi.fn();
    const onSortChange = vi.fn();
    render(
      <CadDataGrid
        caption="Layer data"
        layout="auto"
        columns={[
          { id: 'name', label: 'Name', sortable: true },
          { id: 'objects', label: 'Objects' }
        ]}
        rows={[
          { id: 'walls', label: 'Walls', name: 'Walls', objects: 18 },
          { id: 'annotations', label: 'Annotations', name: 'Annotations', objects: 6 }
        ]}
        onSelectionChange={onSelectionChange}
        onSortChange={onSortChange}
      />
    );

    const dataGrid = screen.getByRole('table', { name: 'Layer data' }).closest('.cad-data-grid');
    expect(dataGrid).toHaveAttribute('data-layout', 'auto');

    fireEvent.click(screen.getByRole('button', { name: /name/i }));
    const dataRows = screen.getAllByRole('row').slice(1);
    expect(within(dataRows[0]).getByRole('cell', { name: 'Annotations' })).toHaveAttribute('data-column', 'Name');
    expect(within(dataRows[0]).getByRole('cell', { name: '6' })).toHaveAttribute('data-column', 'Objects');
    expect(screen.getByRole('columnheader', { name: /name/i })).toHaveAttribute('aria-sort', 'ascending');
    expect(onSortChange).toHaveBeenLastCalledWith(
      { columnId: 'name', direction: 'asc' },
      expect.objectContaining({ id: 'name' }),
      expect.any(Object)
    );

    const annotationSelection = screen.getByRole('checkbox', { name: 'Select Annotations' });
    fireEvent.click(annotationSelection);
    expect(annotationSelection).toBeChecked();
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      ['annotations'],
      expect.objectContaining({ id: 'annotations' }),
      expect.any(Object)
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      ['annotations', 'walls'],
      null,
      expect.any(Object)
    );
  });

  it('toggles selection-filter entity types and forwards the active id set', () => {
    const onChange = vi.fn();
    render(
      <CadSelectionFilter
        filters={[
          { id: 'lines', label: 'Lines', count: 12 },
          { id: 'dimensions', label: 'Dimensions', count: 4 }
        ]}
        defaultActiveIds={['lines']}
        onChange={onChange}
      />
    );

    const lines = screen.getByRole('button', { name: /lines/i });
    const dimensions = screen.getByRole('button', { name: /dimensions/i });
    expect(lines).toHaveAttribute('aria-pressed', 'true');
    expect(dimensions).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(dimensions);
    expect(dimensions).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('2/2')).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith(
      ['lines', 'dimensions'],
      expect.objectContaining({ id: 'dimensions', label: 'Dimensions' }),
      expect.any(Object)
    );

    fireEvent.click(lines);
    expect(lines).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('1/2')).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith(
      ['dimensions'],
      expect.objectContaining({ id: 'lines', label: 'Lines' }),
      expect.any(Object)
    );
  });

  it('cycles to the next candidate and accepts that candidate', () => {
    const onChange = vi.fn();
    const onAccept = vi.fn();
    render(
      <CadSelectionCycler
        layout="auto"
        candidates={[
          { id: 'wall-a', label: 'Wall A', detail: 'Linework' },
          { id: 'hatch-a', label: 'Hatch A', detail: 'Pattern fill' }
        ]}
        onChange={onChange}
        onAccept={onAccept}
      />
    );

    expect(screen.getByRole('complementary', { name: 'Selection cycle' })).toHaveAttribute('data-layout', 'auto');
    expect(screen.getByText('Wall A')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next candidate' }));
    expect(screen.getByText('Hatch A')).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith(
      'hatch-a',
      expect.objectContaining({ id: 'hatch-a', detail: 'Pattern fill' }),
      expect.any(Object)
    );

    fireEvent.click(screen.getByRole('button', { name: 'Select' }));
    expect(onAccept).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'hatch-a', label: 'Hatch A' }),
      expect.any(Object)
    );
  });

  it('pins, closes, and edits quick properties through host callbacks', () => {
    const onPinChange = vi.fn();
    const onClose = vi.fn();
    const onValueChange = vi.fn();
    render(
      <CadQuickProperties
        title="Wall properties"
        properties={[{ id: 'layer', label: 'Layer', value: 'Walls' }]}
        onPinChange={onPinChange}
        onClose={onClose}
        onValueChange={onValueChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Pin Wall properties' }));
    expect(onPinChange).toHaveBeenLastCalledWith(true, expect.any(Object));

    fireEvent.change(screen.getByRole('textbox', { name: 'Layer' }), { target: { value: 'Structural walls' } });
    expect(onValueChange).toHaveBeenLastCalledWith(
      'layer',
      'Structural walls',
      expect.objectContaining({ id: 'layer', label: 'Layer' }),
      expect.any(Object)
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close Wall properties' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
