import React, { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  CadNavigationBar,
  CadSelectionSetPanel,
  CadViewportScalePicker,
  CadVisualStylePicker
} from '../src/CadContextUi';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CadContextUi viewport and selection primitives', () => {
  it('keeps navigation modes controllable while routing command callbacks without a CAD engine', () => {
    const onActiveChange = vi.fn();
    const onAction = vi.fn();
    const onZoom = vi.fn();
    const onHome = vi.fn();
    render(<CadNavigationBar defaultActiveId="pan" onActiveChange={onActiveChange} onAction={onAction} onZoom={onZoom} onHome={onHome} />);

    const pan = screen.getByRole('button', { name: 'Pan' });
    const orbit = screen.getByRole('button', { name: 'Orbit' });
    const zoomIn = screen.getByRole('button', { name: 'Zoom in' });
    expect(pan).toHaveAttribute('aria-pressed', 'true');
    expect(zoomIn).not.toHaveAttribute('aria-pressed');

    fireEvent.click(orbit);
    expect(orbit).toHaveAttribute('aria-pressed', 'true');
    expect(onActiveChange).toHaveBeenLastCalledWith('orbit', expect.objectContaining({ id: 'orbit' }), expect.any(Object));
    expect(onAction).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'orbit' }), expect.any(Object));

    fireEvent.click(zoomIn);
    expect(onZoom).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'zoom-in' }), expect.any(Object));
    fireEvent.click(screen.getByRole('button', { name: 'Home view' }));
    expect(onHome).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'home' }), expect.any(Object));
  });

  it('provides controlled and labelled visual-style and viewport-scale selectors', () => {
    const onStyleChange = vi.fn();
    const onScaleChange = vi.fn();
    const onManage = vi.fn();
    function ControlledStyle() {
      const [style, setStyle] = useState('2d-wireframe');
      return <CadVisualStylePicker value={style} onChange={(nextValue, item, event) => { setStyle(nextValue); onStyleChange(nextValue, item, event); }} selectProps={{ name: 'visual-style' }} />;
    }

    render(<><ControlledStyle /><CadViewportScalePicker defaultValue="1:50" onChange={onScaleChange} onManage={onManage} selectProps={{ name: 'viewport-scale' }} /></>);

    const visualStyle = screen.getByLabelText('Visual style');
    expect(visualStyle).toHaveAttribute('name', 'visual-style');
    fireEvent.change(visualStyle, { target: { value: 'realistic' } });
    expect(visualStyle).toHaveValue('realistic');
    expect(onStyleChange).toHaveBeenLastCalledWith('realistic', expect.objectContaining({ id: 'realistic', label: 'Realistic' }), expect.any(Object));

    const viewportScale = screen.getByLabelText('Viewport scale');
    expect(viewportScale).toHaveValue('1:50');
    expect(viewportScale).toHaveAttribute('name', 'viewport-scale');
    fireEvent.change(viewportScale, { target: { value: '1:20' } });
    expect(onScaleChange).toHaveBeenLastCalledWith('1:20', expect.objectContaining({ id: '1:20' }), expect.any(Object));
    fireEvent.click(screen.getByRole('button', { name: 'Manage' }));
    expect(onManage).toHaveBeenLastCalledWith(expect.objectContaining({ id: '1:20' }), expect.any(Object));
  });

  it('filters, selects, applies, and protects host-owned named selection sets', () => {
    const onChange = vi.fn();
    const onApply = vi.fn();
    const onCreate = vi.fn();
    const onRename = vi.fn();
    const onDelete = vi.fn();
    render(<CadSelectionSetPanel
      sets={[
        { id: 'core-walls', label: 'Core walls', count: 12, description: 'Structural walls' },
        { id: 'notes', label: 'Drawing notes', count: 4, group: 'Annotations', locked: true }
      ]}
      defaultActiveId="core-walls"
      onChange={onChange}
      onApply={onApply}
      onCreate={onCreate}
      onRename={onRename}
      onDelete={onDelete}
    />);

    expect(screen.getByRole('button', { name: 'Core walls' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('Core walls: 12 objects')).toHaveTextContent('12');
    fireEvent.click(screen.getByRole('button', { name: 'Rename' }));
    expect(onRename).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'core-walls' }), expect.any(Object));
    fireEvent.click(screen.getByRole('button', { name: 'Drawing notes' }));
    expect(screen.getByRole('button', { name: 'Drawing notes' })).toHaveAttribute('aria-pressed', 'true');
    expect(onChange).toHaveBeenLastCalledWith('notes', expect.objectContaining({ id: 'notes', group: 'Annotations' }), expect.any(Object));

    fireEvent.click(screen.getByRole('button', { name: 'Select' }));
    expect(onApply).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'notes' }), expect.any(Object));
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Filter selection sets' }), { target: { value: 'core' } });
    expect(screen.getByRole('button', { name: 'Core walls' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Drawing notes' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'New' }));
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onDelete).not.toHaveBeenCalled();
  });
});
