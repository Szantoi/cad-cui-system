import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  CadAnnotationScalePicker,
  CadDynamicInput,
  CadObjectSnapMenu,
  CadPolarTracker,
  CadSelectionGrip
} from '../src/index.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CAD drafting primitives', () => {
  it('merges field defaults into a dynamic-input submission and honours hidden mode', () => {
    const onSubmit = vi.fn();
    const { rerender } = render(<CadDynamicInput fields={[
      { id: 'x', label: 'X', value: 12 },
      { id: 'y', label: 'Y', value: 5 }
    ]} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Y' }), { target: { value: '21' } });
    fireEvent.submit(screen.getByRole('form', { name: 'Specify point' }));
    expect(onSubmit).toHaveBeenCalledWith({ x: 12, y: 21 }, expect.any(Object));

    rerender(<CadDynamicInput visible={false} onSubmit={onSubmit} />);
    expect(screen.queryByRole('form', { name: 'Specify point' })).not.toBeInTheDocument();
  });

  it('supports snap selection, close callbacks and disabled snap modes', () => {
    const onChange = vi.fn();
    const onClose = vi.fn();
    render(<CadObjectSnapMenu
      modes={[{ id: 'endpoint', label: 'Endpoint' }, { id: 'midpoint', label: 'Midpoint', disabled: true }]}
      onChange={onChange}
      onClose={onClose}
    />);

    const endpoint = screen.getByRole('button', { name: /Endpoint/ });
    fireEvent.click(endpoint);
    expect(endpoint).toHaveAttribute('aria-pressed', 'true');
    expect(onChange).toHaveBeenLastCalledWith(['endpoint'], expect.objectContaining({ id: 'endpoint' }), expect.any(Object));

    const midpoint = screen.getByRole('button', { name: /Midpoint/ });
    expect(midpoint).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Close Object snaps' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps picker labels attached to native controls and isolates management actions', () => {
    const onChange = vi.fn();
    const onManage = vi.fn();
    render(<CadAnnotationScalePicker label="Scale" defaultValue="1:50" onChange={onChange} onManage={onManage} selectProps={{ name: 'annotation-scale' }} />);

    const select = screen.getByLabelText('Scale');
    expect(select).toHaveAttribute('name', 'annotation-scale');
    fireEvent.change(select, { target: { value: '1:20' } });
    expect(onChange).toHaveBeenCalledWith('1:20', expect.objectContaining({ id: '1:20' }), expect.any(Object));
    fireEvent.click(screen.getByRole('button', { name: 'Manage' }));
    expect(onManage).toHaveBeenCalledTimes(1);
  });

  it('is an independently usable polar toggle and a non-toggle selection grip', () => {
    const onPointerDown = vi.fn();
    render(<><CadPolarTracker defaultActive={false} angle="90°" distance="120" /><CadSelectionGrip label="Node grip" onPointerDown={onPointerDown} /></>);

    const polar = screen.getByRole('button', { name: 'POLAR' });
    expect(polar).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(polar);
    expect(polar).toHaveAttribute('aria-pressed', 'true');

    const grip = screen.getByRole('button', { name: 'Node grip' });
    expect(grip).not.toHaveAttribute('aria-pressed');
    fireEvent.pointerDown(grip);
    expect(onPointerDown).toHaveBeenCalledTimes(1);
  });
});
