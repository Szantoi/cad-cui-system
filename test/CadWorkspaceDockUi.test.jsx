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

  it('defers a render-function preview until the rail becomes active, then unmounts it when idle', () => {
    const renderPreview = vi.fn(({ active, edge }) => <p>{active ? `${edge} preview` : 'inactive preview'}</p>);
    render(<CadWorkspaceDockRail id="inspector-rail" edge="right" label="Inspector" renderPreview={renderPreview} />);

    const trigger = screen.getByRole('button', { name: 'Preview Inspector' });
    const preview = document.getElementById('inspector-rail-preview');
    expect(renderPreview).not.toHaveBeenCalled();
    expect(preview).toHaveAttribute('hidden');
    expect(preview).toBeEmptyDOMElement();

    fireEvent.pointerEnter(trigger);
    expect(renderPreview).toHaveBeenLastCalledWith(expect.objectContaining({ active: true, peekOpen: true, edge: 'right', previewId: 'inspector-rail-preview' }));
    expect(screen.getByText('right preview')).toBeInTheDocument();

    fireEvent.pointerLeave(preview, { relatedTarget: document.body });
    expect(preview).toHaveAttribute('hidden');
    expect(preview).toBeEmptyDOMElement();
  });

  it('can lazily mount a static preview explicitly without changing the default child behavior', () => {
    render(<CadWorkspaceDockRail id="activity-rail" edge="bottom" label="Activity" previewMount="when-open"><p>Activity stream</p></CadWorkspaceDockRail>);

    const trigger = screen.getByRole('button', { name: 'Preview Activity' });
    const preview = document.getElementById('activity-rail-preview');
    expect(preview).toHaveAttribute('hidden');
    expect(screen.queryByText('Activity stream')).not.toBeInTheDocument();

    fireEvent.pointerEnter(trigger);
    expect(screen.getByText('Activity stream')).toBeInTheDocument();
    fireEvent.pointerLeave(preview, { relatedTarget: document.body });
    expect(screen.queryByText('Activity stream')).not.toBeInTheDocument();
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
