import React, { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import {
  CAD_WORKSPACE_DOCK_MODES,
  CadWorkspaceDockRail,
  CadWorkspaceDockZone,
  CadWorkspaceDockModeControl,
  CadWorkspaceDockResizeHandle,
  useCadWorkspaceDock,
  useCadWorkspaceDockRail
} from '../src/index.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function DockProbe(props) {
  const dock = useCadWorkspaceDock(props);
  return <>
    <output data-testid="dock-mode">{dock.mode}</output>
    <output data-testid="dock-size">{dock.size}</output>
    <button type="button" onClick={event => dock.setMode(CAD_WORKSPACE_DOCK_MODES.OPEN, event, 'probe-mode')}>Open probe</button>
    <button type="button" onClick={event => dock.setSize(current => current + 20, event, 'probe-size')}>Grow probe</button>
  </>;
}

function RailProbe(props) {
  const rail = useCadWorkspaceDockRail(props);
  return <>
    <output data-testid="rail-peek-state">{String(rail.peekOpen)}</output>
    <button type="button" onClick={event => rail.openPeek(event, 'probe-open')}>Open rail peek</button>
    <button type="button" onClick={event => rail.closePeek(event, 'probe-close')}>Close rail peek</button>
  </>;
}

function StatefulRailPreview() {
  const [count, setCount] = useState(0);
  return <button type="button" onClick={() => setCount(value => value + 1)}>Preview count {count}</button>;
}

describe('useCadWorkspaceDock', () => {
  it('owns standalone mode and pixel size intent, then reports controlled requests without owning their values', () => {
    const onModeChange = vi.fn();
    const onSizeChange = vi.fn();
    const { rerender } = render(<DockProbe
      defaultMode={CAD_WORKSPACE_DOCK_MODES.RAIL}
      defaultSize={210}
      minSize={160}
      maxSize={240}
      onModeChange={onModeChange}
      onSizeChange={onSizeChange}
    />);

    expect(screen.getByTestId('dock-mode')).toHaveTextContent('rail');
    expect(screen.getByTestId('dock-size')).toHaveTextContent('210');
    fireEvent.click(screen.getByRole('button', { name: 'Open probe' }));
    fireEvent.click(screen.getByRole('button', { name: 'Grow probe' }));
    expect(screen.getByTestId('dock-mode')).toHaveTextContent('open');
    expect(screen.getByTestId('dock-size')).toHaveTextContent('230');
    expect(onModeChange).toHaveBeenLastCalledWith('open', expect.objectContaining({
      changed: true,
      previousMode: 'rail',
      source: 'probe-mode'
    }), expect.any(Object));
    expect(onSizeChange).toHaveBeenLastCalledWith(230, expect.objectContaining({
      changed: true,
      previousSize: 210,
      source: 'probe-size'
    }), expect.any(Object));

    rerender(<DockProbe
      mode={CAD_WORKSPACE_DOCK_MODES.CLOSED}
      size={180}
      minSize={160}
      maxSize={240}
      onModeChange={onModeChange}
      onSizeChange={onSizeChange}
    />);
    fireEvent.click(screen.getByRole('button', { name: 'Open probe' }));
    fireEvent.click(screen.getByRole('button', { name: 'Grow probe' }));
    expect(onModeChange).toHaveBeenLastCalledWith('open', expect.objectContaining({ previousMode: 'closed' }), expect.any(Object));
    expect(onSizeChange).toHaveBeenLastCalledWith(200, expect.objectContaining({ previousSize: 180 }), expect.any(Object));
    expect(screen.getByTestId('dock-mode')).toHaveTextContent('closed');
    expect(screen.getByTestId('dock-size')).toHaveTextContent('180');
  });
});

describe('CadWorkspaceDockModeControl', () => {
  it('exposes Open, Rail, and Hide as an accessible, cancellable dock state group', () => {
    const onModeChange = vi.fn();
    const preventOpen = event => event.preventDefault();
    render(<CadWorkspaceDockModeControl
      defaultMode="rail"
      label="Layers dock"
      controls="layers-dock"
      onModeChange={onModeChange}
      onOpenClick={preventOpen}
    />);

    const group = screen.getByRole('group', { name: 'Layers dock visibility' });
    const open = screen.getByRole('button', { name: 'Open Layers dock' });
    const rail = screen.getByRole('button', { name: 'Rail Layers dock' });
    const hide = screen.getByRole('button', { name: 'Hide Layers dock' });
    expect(group).toHaveAttribute('data-mode', 'rail');
    expect(rail).toHaveAttribute('aria-pressed', 'true');
    expect(open).toHaveAttribute('aria-controls', 'layers-dock');
    rail.focus();
    expect(rail).toHaveFocus();

    fireEvent.click(open);
    expect(group).toHaveAttribute('data-mode', 'rail');
    expect(onModeChange).not.toHaveBeenCalled();

    fireEvent.click(hide);
    expect(group).toHaveAttribute('data-mode', 'closed');
    expect(hide).toHaveAttribute('aria-pressed', 'true');
    expect(onModeChange).toHaveBeenLastCalledWith('closed', expect.objectContaining({ source: 'mode-control' }), expect.any(Object));
  });

  it('honours disabled mode actions without changing its currently selected state', () => {
    const onModeChange = vi.fn();
    render(<CadWorkspaceDockModeControl defaultMode="open" label="Inspector" hideDisabled onModeChange={onModeChange} />);

    const hide = screen.getByRole('button', { name: 'Hide Inspector' });
    expect(hide).toBeDisabled();
    fireEvent.click(hide);
    expect(screen.getByRole('group', { name: 'Inspector visibility' })).toHaveAttribute('data-mode', 'open');
    expect(onModeChange).not.toHaveBeenCalled();
  });
});

describe('CadWorkspaceDockResizeHandle', () => {
  it('provides a focused semantic separator with right-edge keyboard bounds and pointer growth direction', () => {
    const onSizeChange = vi.fn();
    const onResizeStart = vi.fn();
    const onResizeEnd = vi.fn();
    const handleRef = createRef();
    const addListener = vi.spyOn(window, 'addEventListener');
    const removeListener = vi.spyOn(window, 'removeEventListener');
    render(<CadWorkspaceDockResizeHandle
      ref={handleRef}
      edge="right"
      label="Properties dock"
      controls="properties-dock"
      defaultSize={200}
      minSize={160}
      maxSize={240}
      resizeStep={10}
      onSizeChange={onSizeChange}
      onResizeStart={onResizeStart}
      onResizeEnd={onResizeEnd}
    />);

    const handle = screen.getByRole('separator', { name: 'Resize Properties dock' });
    expect(handleRef.current).toBe(handle);
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    expect(handle).toHaveAttribute('aria-controls', 'properties-dock');
    expect(handle).toHaveAttribute('aria-valuemin', '160');
    expect(handle).toHaveAttribute('aria-valuemax', '240');
    expect(handle).toHaveAttribute('aria-valuenow', '200');
    handle.focus();
    expect(handle).toHaveFocus();

    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(handle).toHaveAttribute('aria-valuenow', '210');
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(handle).toHaveAttribute('aria-valuenow', '200');
    fireEvent.keyDown(handle, { key: 'Home' });
    expect(handle).toHaveAttribute('aria-valuenow', '160');
    fireEvent.keyDown(handle, { key: 'End' });
    expect(handle).toHaveAttribute('aria-valuenow', '240');
    fireEvent.keyDown(handle, { key: 'Home' });

    expect(addListener.mock.calls.filter(([type]) => type === 'pointermove')).toHaveLength(0);
    fireEvent.pointerDown(handle, { button: 0, pointerId: 44, clientX: 100 });
    expect(handle).toHaveAttribute('data-resizing', 'true');
    expect(onResizeStart).toHaveBeenLastCalledWith(160, expect.objectContaining({ edge: 'right', orientation: 'vertical' }), expect.any(Object));
    expect(addListener).toHaveBeenCalledWith('pointermove', expect.any(Function));

    // A right-side dock grows as the divider travels left.
    fireEvent.pointerMove(window, { pointerId: 44, clientX: 70 });
    expect(handle).toHaveAttribute('aria-valuenow', '190');
    fireEvent.pointerUp(window, { pointerId: 44, clientX: 70 });
    expect(handle).toHaveAttribute('data-resizing', 'false');
    expect(onResizeEnd).toHaveBeenLastCalledWith(190, expect.objectContaining({
      changed: true,
      edge: 'right',
      cancelled: false
    }), expect.any(Object));
    expect(removeListener).toHaveBeenCalledWith('pointermove', expect.any(Function));
    expect(onSizeChange).toHaveBeenLastCalledWith(190, expect.objectContaining({ source: 'pointer', edge: 'right' }), expect.any(Object));
  });

  it('maps bottom edge arrows and pointer movement toward the dock, including cancellation cleanup', () => {
    const onResizeEnd = vi.fn();
    render(<>
      <CadWorkspaceDockResizeHandle
        edge="bottom"
        label="Command dock"
        defaultSize={150}
        minSize={120}
        maxSize={210}
        resizeStep={10}
        onResizeEnd={onResizeEnd}
      />
      <CadWorkspaceDockResizeHandle
        edge="top"
        label="Top dock"
        defaultSize={150}
        minSize={120}
        maxSize={210}
        resizeStep={10}
      />
    </>);

    const handle = screen.getByRole('separator', { name: 'Resize Command dock' });
    expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
    fireEvent.keyDown(handle, { key: 'ArrowUp' });
    expect(handle).toHaveAttribute('aria-valuenow', '160');
    fireEvent.keyDown(handle, { key: 'ArrowDown' });
    expect(handle).toHaveAttribute('aria-valuenow', '150');

    fireEvent.pointerDown(handle, { button: 0, pointerId: 87, clientY: 200 });
    // A bottom dock grows as the divider travels upward.
    fireEvent.pointerMove(window, { pointerId: 87, clientY: 170 });
    expect(handle).toHaveAttribute('aria-valuenow', '180');
    fireEvent.pointerCancel(window, { pointerId: 87, clientY: 170 });
    expect(handle).toHaveAttribute('data-resizing', 'false');
    expect(onResizeEnd).toHaveBeenLastCalledWith(180, expect.objectContaining({
      edge: 'bottom',
      cancelled: true
    }), expect.any(Object));

    const topHandle = screen.getByRole('separator', { name: 'Resize Top dock' });
    fireEvent.keyDown(topHandle, { key: 'ArrowDown' });
    expect(topHandle).toHaveAttribute('aria-valuenow', '160');
    fireEvent.keyDown(topHandle, { key: 'ArrowUp' });
    expect(topHandle).toHaveAttribute('aria-valuenow', '150');
  });

  it('reports controlled resize requests while preserving the externally supplied size', () => {
    const onSizeChange = vi.fn();
    const { rerender } = render(<CadWorkspaceDockResizeHandle
      edge="left"
      size={200}
      minSize={160}
      maxSize={240}
      resizeStep={8}
      onSizeChange={onSizeChange}
    />);

    const handle = screen.getByRole('separator', { name: 'Resize dock' });
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(onSizeChange).toHaveBeenLastCalledWith(208, expect.objectContaining({
      source: 'keyboard',
      previousSize: 200,
      edge: 'left'
    }), expect.any(Object));
    expect(handle).toHaveAttribute('aria-valuenow', '200');

    rerender(<CadWorkspaceDockResizeHandle edge="left" size={208} minSize={160} maxSize={240} resizeStep={8} onSizeChange={onSizeChange} />);
    expect(screen.getByRole('separator', { name: 'Resize dock' })).toHaveAttribute('aria-valuenow', '208');
  });

  it('allows consumer cancellation and rejects resize interaction when disabled', () => {
    const onResizeStart = vi.fn();
    const onSizeChange = vi.fn();
    const cancelPointer = event => event.preventDefault();
    const cancelKey = event => event.preventDefault();
    const { rerender } = render(<CadWorkspaceDockResizeHandle
      defaultSize={180}
      minSize={160}
      maxSize={240}
      onResizeStart={onResizeStart}
      onSizeChange={onSizeChange}
      onPointerDown={cancelPointer}
      onKeyDown={cancelKey}
    />);

    const handle = screen.getByRole('separator', { name: 'Resize dock' });
    fireEvent.pointerDown(handle, { button: 0, pointerId: 12, clientX: 100 });
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(onResizeStart).not.toHaveBeenCalled();
    expect(onSizeChange).not.toHaveBeenCalled();
    expect(handle).toHaveAttribute('aria-valuenow', '180');

    rerender(<CadWorkspaceDockResizeHandle defaultSize={180} minSize={160} maxSize={240} disabled onSizeChange={onSizeChange} />);
    const disabledHandle = screen.getByRole('separator', { name: 'Resize dock' });
    expect(disabledHandle).toHaveAttribute('aria-disabled', 'true');
    expect(disabledHandle).toHaveAttribute('tabindex', '-1');
    fireEvent.pointerDown(disabledHandle, { button: 0, pointerId: 12, clientX: 100 });
    fireEvent.keyDown(disabledHandle, { key: 'ArrowRight' });
    expect(onSizeChange).not.toHaveBeenCalled();
    expect(disabledHandle).toHaveAttribute('aria-valuenow', '180');
  });
});

describe('CadWorkspaceDockRail', () => {
  it('treats its label and preview as one hover region, only closing after the pointer leaves both', () => {
    const onPeekOpenChange = vi.fn();
    render(<CadWorkspaceDockRail edge="left" label="Layers rail" onPeekOpenChange={onPeekOpenChange}>
      <p>Layer preview</p>
    </CadWorkspaceDockRail>);

    const label = screen.getByRole('button', { name: 'Preview Layers rail' });
    const preview = document.getElementById(label.getAttribute('aria-controls'));

    // This is the physical route users take: off the narrow rail label and into
    // the expanded preview. It must not create a hover gap that closes the panel.
    fireEvent.pointerEnter(label);
    expect(preview).not.toHaveAttribute('hidden');
    fireEvent.pointerLeave(label, { relatedTarget: preview });
    expect(preview).not.toHaveAttribute('hidden');
    expect(onPeekOpenChange).toHaveBeenCalledTimes(1);
    expect(onPeekOpenChange).toHaveBeenLastCalledWith(true, expect.objectContaining({
      source: 'pointer-enter'
    }), expect.any(Object));

    // Returning to the label is also internal to the same joined hover region.
    fireEvent.pointerLeave(preview, { relatedTarget: label });
    expect(preview).not.toHaveAttribute('hidden');
    expect(onPeekOpenChange).toHaveBeenCalledTimes(1);

    // An actual exit from the full rail + preview region does close the peek.
    fireEvent.pointerLeave(preview, { relatedTarget: document.body });
    expect(preview).toHaveAttribute('hidden');
    expect(onPeekOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({
      source: 'pointer-leave'
    }), expect.any(Object));
  });

  it('keeps its disclosure relationship bound to its preview when an external expand target is supplied', () => {
    const onExpand = vi.fn();
    render(<CadWorkspaceDockRail
      id="layers-rail"
      controls="tools-dock"
      label="Layers rail"
      onExpand={onExpand}
    ><p>Layer preview</p></CadWorkspaceDockRail>);

    const label = screen.getByRole('button', { name: 'Preview Layers rail' });
    const preview = document.getElementById('layers-rail-preview');
    expect(label).toHaveAttribute('aria-controls', 'layers-rail-preview');
    expect(preview).toHaveAttribute('hidden');

    fireEvent.click(label);
    expect(onExpand).toHaveBeenLastCalledWith(expect.any(Object), expect.objectContaining({
      controls: 'tools-dock',
      previewId: 'layers-rail-preview'
    }));
    expect(label).toHaveAttribute('aria-expanded', 'true');
    expect(preview).not.toHaveAttribute('hidden');
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
    expect(renderPreview).toHaveBeenLastCalledWith(expect.objectContaining({
      active: true,
      peekOpen: true,
      edge: 'right',
      previewId: 'inspector-rail-preview'
    }));
    expect(screen.getByText('right preview')).toBeInTheDocument();

    fireEvent.pointerLeave(preview, { relatedTarget: document.body });
    expect(preview).toHaveAttribute('hidden');
    expect(preview).toBeEmptyDOMElement();
  });

  it('can lazily mount a static preview explicitly without changing the default child behavior', () => {
    render(<CadWorkspaceDockRail id="activity-rail" edge="bottom" label="Activity" previewMount="when-open">
      <p>Activity stream</p>
    </CadWorkspaceDockRail>);

    const trigger = screen.getByRole('button', { name: 'Preview Activity' });
    const preview = document.getElementById('activity-rail-preview');
    expect(preview).toHaveAttribute('hidden');
    expect(screen.queryByText('Activity stream')).not.toBeInTheDocument();

    fireEvent.pointerEnter(trigger);
    expect(screen.getByText('Activity stream')).toBeInTheDocument();
    fireEvent.pointerLeave(preview, { relatedTarget: document.body });
    expect(screen.queryByText('Activity stream')).not.toBeInTheDocument();
  });

  it('keeps a mounted preview open while pointer or focus remains in the rail, preserves child state, and escapes cleanly', () => {
    const onPeekOpenChange = vi.fn();
    const onExpand = vi.fn();
    render(<CadWorkspaceDockRail
      edge="left"
      label="Layers rail"
      onPeekOpenChange={onPeekOpenChange}
      onExpand={onExpand}
    ><StatefulRailPreview /></CadWorkspaceDockRail>);

    const label = screen.getByRole('button', { name: 'Preview Layers rail' });
    const rail = label.closest('.cad-workspace-dock-rail');
    const previewId = label.getAttribute('aria-controls');
    const preview = document.getElementById(previewId);
    expect(rail).toHaveAttribute('data-edge', 'left');
    expect(preview).toHaveAttribute('hidden');
    expect(preview).toHaveAttribute('aria-labelledby', label.id);

    fireEvent.pointerEnter(rail);
    expect(label).toHaveAttribute('aria-expanded', 'true');
    expect(preview).not.toHaveAttribute('hidden');
    fireEvent.click(screen.getByRole('button', { name: 'Preview count 0' }));
    expect(screen.getByRole('button', { name: 'Preview count 1' })).toBeInTheDocument();

    // Moving from the rail strip to the preview is still inside the shared rail region.
    fireEvent.pointerLeave(rail, { relatedTarget: preview });
    expect(preview).not.toHaveAttribute('hidden');
    fireEvent.pointerLeave(rail, { relatedTarget: document.body });
    expect(preview).toHaveAttribute('hidden');
    fireEvent.pointerEnter(rail);
    expect(screen.getByRole('button', { name: 'Preview count 1' })).toBeInTheDocument();

    // Keyboard focus keeps the preview alive even once the pointer leaves it.
    label.focus();
    fireEvent.pointerLeave(rail, { relatedTarget: document.body });
    expect(preview).not.toHaveAttribute('hidden');
    fireEvent.blur(label, { relatedTarget: document.body });
    expect(preview).toHaveAttribute('hidden');
    fireEvent.pointerEnter(rail);

    fireEvent.click(label);
    expect(onExpand).toHaveBeenLastCalledWith(expect.any(Object), expect.objectContaining({
      edge: 'left',
      label: 'Layers rail',
      source: 'rail-expand'
    }));
    label.focus();
    fireEvent.keyDown(label, { key: 'Escape' });
    expect(preview).toHaveAttribute('hidden');
    expect(label).toHaveFocus();
    expect(onPeekOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ source: 'escape' }), expect.any(Object));
  });

  it('uses controlled peek state without taking layout ownership and exposes a state hook for standalone use', () => {
    const onPeekOpenChange = vi.fn();
    const { rerender } = render(<CadWorkspaceDockRail
      edge="bottom"
      label="Command rail"
      peekOpen={false}
      onPeekOpenChange={onPeekOpenChange}
    ><p>Command preview</p></CadWorkspaceDockRail>);

    const label = screen.getByRole('button', { name: 'Preview Command rail' });
    const rail = label.closest('.cad-workspace-dock-rail');
    const preview = document.getElementById(label.getAttribute('aria-controls'));
    fireEvent.pointerEnter(rail);
    expect(onPeekOpenChange).toHaveBeenLastCalledWith(true, expect.objectContaining({
      edge: 'bottom',
      source: 'pointer-enter'
    }), expect.any(Object));
    expect(preview).toHaveAttribute('hidden');

    rerender(<CadWorkspaceDockRail edge="bottom" label="Command rail" peekOpen onPeekOpenChange={onPeekOpenChange}><p>Command preview</p></CadWorkspaceDockRail>);
    expect(document.getElementById(label.getAttribute('aria-controls'))).not.toHaveAttribute('hidden');

    cleanup();
    render(<RailProbe defaultPeekOpen edge="right" onPeekOpenChange={onPeekOpenChange} />);
    expect(screen.getByTestId('rail-peek-state')).toHaveTextContent('true');
    fireEvent.click(screen.getByRole('button', { name: 'Close rail peek' }));
    expect(screen.getByTestId('rail-peek-state')).toHaveTextContent('false');
    expect(onPeekOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ edge: 'right', source: 'probe-close' }), expect.any(Object));
  });
});

describe('CadWorkspaceDockZone', () => {
  it('forwards compact visual tab labels without shortening the tab name or tooltip', () => {
    render(<CadWorkspaceDockZone
      edge="left"
      label="Compact tools panels"
      compactTabs
      panels={[
        { id: 'properties', label: 'Properties', tabLabel: 'Props', content: <p>Object properties</p> },
        { id: 'blocks', label: 'Blocks', shortLabel: 'BLK', content: <p>Block library</p> },
        { id: 'layers', label: 'Layers', content: <p>Layer browser</p> }
      ]}
    />);

    const tabs = screen.getByRole('tablist', { name: 'Compact tools panels' });
    const properties = within(tabs).getByRole('tab', { name: 'Properties' });
    const blocks = within(tabs).getByRole('tab', { name: 'Blocks' });
    const layers = within(tabs).getByRole('tab', { name: 'Layers' });

    expect(tabs.closest('.cad-dock-tabs')).toHaveClass('cad-dock-tabs--compact');
    expect(properties).toHaveTextContent('Props');
    expect(properties).toHaveAttribute('aria-label', 'Properties');
    expect(properties).toHaveAttribute('title', 'Properties');
    expect(blocks).toHaveTextContent('BLK');
    expect(blocks).toHaveAttribute('aria-label', 'Blocks');
    expect(blocks).toHaveAttribute('title', 'Blocks');
    expect(layers).toHaveTextContent('Layers');
  });

  it('adapts reusable CadDockTabs into an edge-aware multi-panel dock zone', () => {
    const onActiveChange = vi.fn();
    const onPanelClose = vi.fn();
    render(<CadWorkspaceDockZone
      edge="right"
      label="Inspector panels"
      panels={[
        { id: 'properties', label: 'Properties', closable: true, content: <p>Object properties</p> },
        { id: 'layers', label: 'Layers', badge: 4, content: <p>Layer browser</p> }
      ]}
      onActiveChange={onActiveChange}
      onPanelClose={onPanelClose}
      panelClassName="test-zone-panel"
    />);

    const zone = screen.getByRole('complementary', { name: 'Inspector panels' });
    expect(zone).toHaveAttribute('data-edge', 'right');
    expect(zone.querySelector('.cad-dock-tabs')).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: 'Inspector panels' })).toBeInTheDocument();
    expect(screen.getByText('Object properties').closest('.test-zone-panel')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /Layers/ }));
    expect(onActiveChange).toHaveBeenLastCalledWith('layers', expect.objectContaining({ id: 'layers' }), expect.any(Object));
    expect(screen.getByText('Layer browser')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close Properties' }));
    expect(onPanelClose).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'properties' }), expect.any(Object));
  });

  it('does not create a destructive close target unless the host explicitly handles panel close intent', () => {
    render(<CadWorkspaceDockZone
      edge="left"
      label="Pinned tools"
      panels={[
        { id: 'properties', label: 'Properties', closable: true, content: <p>Object properties</p> }
      ]}
    />);

    const tablist = screen.getByRole('tablist', { name: 'Pinned tools' });
    expect(within(tablist).queryByRole('button', { name: 'Close Properties' })).not.toBeInTheDocument();
    expect(tablist.querySelector('.cad-dock-tabs__close')).not.toBeInTheDocument();
  });

  it('reserves dock-tab attention indicators for actionable warning and danger states', () => {
    render(<CadWorkspaceDockZone
      label="Panel attention"
      panels={[
        {
          id: 'layers',
          label: 'Layers',
          attention: { tone: 'warning', label: 'Layer conflict' },
          content: <p>Layer browser</p>
        },
        {
          id: 'external-references',
          label: 'External references',
          alert: 'danger',
          content: <p>External reference browser</p>
        },
        {
          id: 'properties',
          label: 'Properties',
          badge: 7,
          attention: 'info',
          content: <p>Object properties</p>
        }
      ]}
    />);

    const warning = screen.getByRole('tab', { name: 'Layers, Layer conflict' });
    expect(warning).toHaveAttribute('title', 'Layers · Layer conflict');
    expect(warning.querySelector('.cad-dock-tabs__attention')).toHaveAttribute('data-tone', 'warning');

    const danger = screen.getByRole('tab', { name: 'External references, Danger' });
    expect(danger).toHaveAttribute('title', 'External references · Danger');
    expect(danger.querySelector('.cad-dock-tabs__attention')).toHaveAttribute('data-tone', 'danger');

    const neutral = screen.getByRole('tab', { name: 'Properties' });
    expect(neutral.querySelector('.cad-dock-tabs__attention')).not.toBeInTheDocument();
    expect(neutral.querySelector('em')).not.toBeInTheDocument();
  });

  it('keeps bottom-zone metadata and supplies an accessible empty state when no panels are declared', () => {
    render(<CadWorkspaceDockZone edge="bottom" label="Command panels" emptyLabel="No command panels" />);
    expect(screen.getByRole('complementary', { name: 'Command panels' })).toHaveAttribute('data-edge', 'bottom');
    expect(screen.getByRole('status')).toHaveTextContent('No command panels');
  });
});
