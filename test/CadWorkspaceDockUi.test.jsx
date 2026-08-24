import React, { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  CadWorkspaceDockModeControl,
  CadWorkspaceDockRail,
  CadWorkspaceDockResizeHandle,
  CadWorkspaceDockZone
} from '../src/index.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('workspace dock primitives', () => {
  it('exposes an accessible open / rail control without requiring a layout engine', () => {
    const onModeChange = vi.fn();
    render(<CadWorkspaceDockModeControl defaultMode="rail" label="Layers" hideDisabled onModeChange={onModeChange} />);

    expect(screen.getByRole('group', { name: 'Layers visibility' })).toHaveAttribute('data-mode', 'rail');
    expect(screen.getByRole('button', { name: 'Rail Layers' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Open Layers' }));
    expect(onModeChange).toHaveBeenLastCalledWith('open', expect.objectContaining({ source: 'mode-control' }), expect.any(Object));
  });

  it('opens a transient joined hover preview and turns a click into durable host expansion', () => {
    const onExpand = vi.fn();
    render(<CadWorkspaceDockRail id="layers-rail" edge="left" label="Layers" onExpand={onExpand}><p>Layer preview</p></CadWorkspaceDockRail>);

    const trigger = screen.getByRole('button', { name: 'Preview Layers' });
    const preview = document.getElementById('layers-rail-preview');
    expect(preview).toHaveAttribute('hidden');
    fireEvent.pointerEnter(trigger);
    expect(preview).not.toHaveAttribute('hidden');
    fireEvent.pointerLeave(preview, { relatedTarget: document.body });
    expect(preview).toHaveAttribute('hidden');
    fireEvent.click(trigger);
    expect(onExpand).toHaveBeenLastCalledWith(expect.any(Object), expect.objectContaining({ edge: 'left', source: 'rail-expand' }));
  });

  it('keeps dock sizing host-controlled and maps bottom keyboard growth upward', () => {
    function Probe() {
      const [size, setSize] = useState(160);
      return <CadWorkspaceDockResizeHandle edge="bottom" size={size} minSize={120} maxSize={240} resizeStep={10} label="Activity" onSizeChange={setSize} />;
    }
    render(<Probe />);
    const handle = screen.getByRole('separator', { name: 'Resize Activity' });
    expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
    fireEvent.keyDown(handle, { key: 'ArrowUp' });
    expect(handle).toHaveAttribute('aria-valuenow', '170');
  });

  it('renders a tabbed left/right/bottom host zone without assuming a docking engine', () => {
    render(<CadWorkspaceDockZone edge="right" label="Inspector" panels={[{ id: 'properties', title: 'Properties', content: <p>Node properties</p> }]} />);
    expect(screen.getByRole('complementary', { name: 'Inspector' })).toHaveAttribute('data-edge', 'right');
    expect(screen.getByText('Node properties')).toBeInTheDocument();
  });
});
