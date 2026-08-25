import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { CadViewportControls } from '../src/CadWorkspaceUi.jsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CadViewportControls', () => {
  it('keeps a collapsed ViewCube open across its shared hover and focus region without persisting a peek', () => {
    const onCollapsedChange = vi.fn();
    const onPeekOpenChange = vi.fn();
    const onZoomIn = vi.fn();
    const onViewChange = vi.fn();
    render(<CadViewportControls
      collapsible
      defaultCollapsed
      activeView="top"
      onCollapsedChange={onCollapsedChange}
      onPeekOpenChange={onPeekOpenChange}
      onZoomIn={onZoomIn}
      onViewChange={onViewChange}
    />);

    const controls = screen.getByRole('complementary', { name: 'Viewport controls' });
    const handle = screen.getByRole('button', { name: 'Open Viewport controls' });
    const content = document.getElementById(handle.getAttribute('aria-controls'));
    expect(controls).toHaveAttribute('data-collapsible', 'true');
    expect(controls).toHaveAttribute('data-collapsed', 'true');
    expect(controls).toHaveAttribute('data-expanded', 'false');
    expect(handle).toHaveAttribute('aria-expanded', 'false');
    expect(content).toHaveAttribute('hidden');
    expect(screen.queryByRole('button', { name: 'Zoom in' })).not.toBeInTheDocument();

    fireEvent.pointerEnter(controls);
    expect(controls).toHaveAttribute('data-collapsed', 'true');
    expect(controls).toHaveAttribute('data-peek-open', 'true');
    expect(controls).toHaveAttribute('data-expanded', 'true');
    expect(handle).toHaveAttribute('aria-expanded', 'true');
    expect(content).not.toHaveAttribute('hidden');
    expect(onCollapsedChange).not.toHaveBeenCalled();
    expect(onPeekOpenChange).toHaveBeenLastCalledWith(true, expect.objectContaining({ source: 'pointer-enter' }), expect.any(Object));

    const zoomIn = screen.getByRole('button', { name: 'Zoom in' });
    fireEvent.pointerLeave(controls, { relatedTarget: zoomIn });
    expect(content).not.toHaveAttribute('hidden');
    fireEvent.click(zoomIn);
    expect(onZoomIn).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'front view' }));
    expect(onViewChange).toHaveBeenLastCalledWith('front', expect.any(Object));

    fireEvent.pointerLeave(controls, { relatedTarget: document.body });
    expect(content).toHaveAttribute('hidden');
    expect(controls).toHaveAttribute('data-collapsed', 'true');

    fireEvent.focus(handle);
    expect(content).not.toHaveAttribute('hidden');
    const topView = screen.getByRole('button', { name: 'top view' });
    fireEvent.blur(handle, { relatedTarget: topView });
    fireEvent.focus(topView);
    fireEvent.pointerLeave(controls, { relatedTarget: document.body });
    expect(content).not.toHaveAttribute('hidden');
    fireEvent.blur(topView, { relatedTarget: document.body });
    expect(content).toHaveAttribute('hidden');

    fireEvent.click(handle);
    expect(controls).toHaveAttribute('data-collapsed', 'false');
    expect(controls).toHaveAttribute('data-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Collapse Viewport controls' })).toBeInTheDocument();
    expect(onCollapsedChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ source: 'toggle' }), expect.any(Object));

    fireEvent.click(screen.getByRole('button', { name: 'Collapse Viewport controls' }));
    expect(controls).toHaveAttribute('data-collapsed', 'true');
    expect(content).toHaveAttribute('hidden');
  });
});
