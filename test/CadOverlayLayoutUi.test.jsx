import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  CadBlockPalette,
  CadCommandPrompt,
  CadConfirmDialog,
  CadDialog,
  CadMenuBar,
  CadMovableOverlay,
  CadPopover,
  CadSplitPane
} from '../src/index.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CAD layout and overlay primitives', () => {
  it('moves a ribbed viewport overlay without collapsing it after a drag, and keeps its content accessible on expand', () => {
    const onPositionChange = vi.fn();
    const onCollapsedChange = vi.fn();
    render(<div data-testid="viewport-boundary"><CadMovableOverlay
      label="Viewport navigation dock"
      edge="top"
      handleIcon="⌖"
      onPositionChange={onPositionChange}
      onCollapsedChange={onCollapsedChange}
    ><button type="button">Pan</button></CadMovableOverlay></div>);

    const boundary = screen.getByTestId('viewport-boundary');
    const overlay = screen.getByRole('complementary', { name: 'Viewport navigation dock' });
    boundary.getBoundingClientRect = () => ({ left: 0, top: 0, right: 500, bottom: 400, width: 500, height: 400, x: 0, y: 0, toJSON: () => ({}) });
    overlay.getBoundingClientRect = () => {
      const x = Number(overlay.getAttribute('data-position-x')) || 0;
      const y = Number(overlay.getAttribute('data-position-y')) || 0;
      return { left: 120 + x, top: 80 + y, right: 190 + x, bottom: 240 + y, width: 70, height: 160, x: 120 + x, y: 80 + y, toJSON: () => ({}) };
    };

    const handle = screen.getByRole('button', { name: 'Collapse Viewport navigation dock' });
    expect(overlay).toHaveAttribute('data-edge', 'top');
    expect(overlay).toHaveAttribute('data-has-handle-icon', 'true');
    expect(overlay.querySelector('.cad-movable-overlay__icon')).toHaveTextContent('⌖');
    expect(handle).toHaveAttribute('aria-expanded', 'true');
    expect(handle.querySelector('.cad-movable-overlay__chevron')).toHaveTextContent('⌃');
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(overlay).toHaveAttribute('data-position-x', '16');
    expect(onPositionChange).toHaveBeenLastCalledWith({ x: 16, y: 0 }, expect.objectContaining({ source: 'keyboard', key: 'ArrowRight' }), expect.any(Object));

    fireEvent.pointerDown(handle, { button: 0, pointerId: 7, clientX: 20, clientY: 20 });
    fireEvent.pointerMove(window, { pointerId: 7, clientX: 60, clientY: 44 });
    fireEvent.pointerUp(window, { pointerId: 7 });
    expect(overlay).toHaveAttribute('data-position-x', '56');
    expect(overlay).toHaveAttribute('data-position-y', '24');
    expect(onPositionChange).toHaveBeenLastCalledWith({ x: 56, y: 24 }, expect.objectContaining({ source: 'pointer', dragging: true }), expect.any(Object));

    fireEvent.pointerDown(handle, { button: 0, pointerId: 8, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(window, { pointerId: 8, clientX: 2000, clientY: 2000 });
    fireEvent.pointerUp(window, { pointerId: 8 });
    expect(overlay).toHaveAttribute('data-position-x', '310');
    expect(overlay).toHaveAttribute('data-position-y', '160');

    fireEvent.click(handle);
    expect(overlay).toHaveAttribute('data-collapsed', 'false');
    expect(screen.getByRole('button', { name: 'Pan' })).toBeInTheDocument();

    fireEvent.click(handle);
    expect(overlay).toHaveAttribute('data-collapsed', 'true');
    expect(handle).toHaveAttribute('aria-expanded', 'false');
    expect(handle.querySelector('.cad-movable-overlay__chevron')).toHaveTextContent('⌄');
    expect(screen.queryByRole('button', { name: 'Pan' })).not.toBeInTheDocument();
    expect(onCollapsedChange).toHaveBeenLastCalledWith(true, expect.objectContaining({ source: 'toggle' }), expect.any(Object));

    fireEvent.click(screen.getByRole('button', { name: 'Expand Viewport navigation dock' }));
    expect(overlay).toHaveAttribute('data-collapsed', 'false');
    expect(screen.getByRole('button', { name: 'Pan' })).toBeInTheDocument();
  });

  it('resizes a split pane through keyboard and pointer input, reporting the final drag value', () => {
    const onSizeChange = vi.fn();
    const onResizeEnd = vi.fn();
    render(<CadSplitPane defaultSize={30} onSizeChange={onSizeChange} onResizeEnd={onResizeEnd} primary={<span>Primary</span>} secondary={<span>Secondary</span>} />);

    const splitter = screen.getByRole('separator');
    const pane = splitter.closest('.cad-split-pane');
    pane.getBoundingClientRect = () => ({ width: 1000, height: 600, top: 0, left: 0, right: 1000, bottom: 600, x: 0, y: 0, toJSON: () => ({}) });
    fireEvent.keyDown(splitter, { key: 'ArrowRight' });
    expect(onSizeChange).toHaveBeenLastCalledWith(35, expect.objectContaining({ source: 'keyboard' }), expect.any(Object));

    fireEvent.pointerDown(splitter, { button: 0, pointerId: 4 });
    fireEvent.pointerMove(window, { clientX: 480, clientY: 0, pointerId: 4 });
    fireEvent.pointerUp(window, { pointerId: 4 });
    expect(onResizeEnd).toHaveBeenLastCalledWith(48, expect.any(Object));
  });

  it('keeps a split drag scoped to its primary pointer and ends with the committed controlled size', () => {
    const onSizeChange = vi.fn();
    const onResizeEnd = vi.fn();
    function ControlledSplitPane() {
      const [size, setSize] = React.useState(30);
      return <CadSplitPane
        size={size}
        onSizeChange={nextSize => {
          onSizeChange(nextSize);
          setSize(Math.min(nextSize, 45));
        }}
        onResizeEnd={onResizeEnd}
        primary={<span>Primary</span>}
        secondary={<span>Secondary</span>}
      />;
    }

    render(<ControlledSplitPane />);
    const splitter = screen.getByRole('separator', { name: 'Resize panels' });
    const pane = splitter.closest('.cad-split-pane');
    pane.getBoundingClientRect = () => ({ width: 1000, height: 600, top: 0, left: 0, right: 1000, bottom: 600, x: 0, y: 0, toJSON: () => ({}) });

    fireEvent.pointerDown(splitter, { button: 1, pointerId: 7 });
    fireEvent.pointerMove(window, { clientX: 800, pointerId: 7 });
    expect(onSizeChange).not.toHaveBeenCalled();

    fireEvent.pointerDown(splitter, { button: 0, pointerId: 4 });
    fireEvent.pointerMove(window, { clientX: 800, pointerId: 9 });
    expect(onSizeChange).not.toHaveBeenCalled();

    fireEvent.pointerMove(window, { clientX: 480, pointerId: 4 });
    expect(splitter).toHaveAttribute('aria-valuenow', '45');
    fireEvent.pointerCancel(window, { pointerId: 4 });
    fireEvent.pointerUp(window, { pointerId: 4 });

    expect(onResizeEnd).toHaveBeenCalledTimes(1);
    expect(onResizeEnd).toHaveBeenLastCalledWith(45, expect.any(Object));
  });

  it('cleans up active pointer listeners when the split pane unmounts', () => {
    const addListener = vi.spyOn(window, 'addEventListener');
    const removeListener = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<CadSplitPane primary={<span>Primary</span>} secondary={<span>Secondary</span>} />);
    const splitter = screen.getByRole('separator');

    fireEvent.pointerDown(splitter, { button: 0, pointerId: 12 });
    expect(addListener).toHaveBeenCalledWith('pointermove', expect.any(Function));
    expect(addListener).toHaveBeenCalledWith('pointerup', expect.any(Function));
    expect(addListener).toHaveBeenCalledWith('pointercancel', expect.any(Function));

    unmount();
    expect(removeListener).toHaveBeenCalledWith('pointermove', expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith('pointerup', expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith('pointercancel', expect.any(Function));
  });

  it('traps focus in a modal dialog and restores its opener on close', async () => {
    const onClose = vi.fn();
    const { rerender } = render(<><button type="button">Open dialog</button><CadDialog open={false} onClose={onClose} title="Settings"><button type="button" data-autofocus>First</button><button type="button">Last</button></CadDialog></>);
    const opener = screen.getByRole('button', { name: 'Open dialog' });
    opener.focus();
    rerender(<><button type="button">Open dialog</button><CadDialog open onClose={onClose} title="Settings"><button type="button" data-autofocus>First</button><button type="button">Last</button></CadDialog></>);

    const first = await screen.findByRole('button', { name: 'First' });
    const last = screen.getByRole('button', { name: 'Last' });
    const close = screen.getByRole('button', { name: 'Close Settings' });
    await waitFor(() => expect(first).toHaveFocus());
    last.focus();
    fireEvent.keyDown(last, { key: 'Tab' });
    await waitFor(() => expect(close).toHaveFocus());
    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
    await waitFor(() => expect(last).toHaveFocus());

    rerender(<><button type="button">Open dialog</button><CadDialog open={false} onClose={onClose} title="Settings" /></>);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Open dialog' })).toHaveFocus());
  });

  it('keeps a dialog itself focusable when it has no actionable child and gives it a fallback name', async () => {
    render(<CadDialog open />);

    const dialog = screen.getByRole('dialog', { name: 'CAD dialog' });
    await waitFor(() => expect(dialog).toHaveFocus());
    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(dialog).toHaveFocus();
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
    expect(dialog).toHaveFocus();
  });

  it('defaults a destructive confirmation to the safe Cancel action', async () => {
    render(<CadConfirmDialog open destructive title="Delete graph" confirmLabel="Delete" cancelLabel="Keep graph" />);

    const cancel = screen.getByRole('button', { name: 'Keep graph' });
    expect(screen.getByRole('dialog', { name: 'Delete graph' })).toHaveAttribute('aria-modal', 'true');
    await waitFor(() => expect(cancel).toHaveFocus());
  });

  it('routes Escape and initial focus to only the topmost open modal', async () => {
    const closeOuter = vi.fn();
    const closeInner = vi.fn();
    render(<CadDialog open title="Outer settings" onClose={closeOuter}><CadDialog open title="Inner settings" onClose={closeInner} /></CadDialog>);

    await waitFor(() => expect(screen.getByRole('button', { name: 'Close Inner settings' })).toHaveFocus());
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(closeInner).toHaveBeenCalledTimes(1);
    expect(closeOuter).not.toHaveBeenCalled();
  });

  it('closes a generic popover outside its boundary, restores focus, and gives command input a real label and Escape callback', async () => {
    const onCancel = vi.fn();
    render(<><CadPopover trigger={<button type="button">Options</button>} content={<button type="button">Popover content</button>} label="Options menu" /><button type="button">Outside control</button><CadCommandPrompt label="Graph command" onCancel={onCancel} /></>);

    const trigger = screen.getByRole('button', { name: 'Options' });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole('region', { name: 'Options menu' })).toBeInTheDocument();
    const content = screen.getByRole('button', { name: 'Popover content' });
    content.focus();
    fireEvent.keyDown(content, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('region', { name: 'Options menu' })).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });

    fireEvent.click(trigger);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside control' }));
    await waitFor(() => {
      expect(screen.queryByRole('region', { name: 'Options menu' })).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });

    const command = screen.getByRole('textbox', { name: 'Graph command' });
    fireEvent.keyDown(command, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('keeps disabled top-level menus inert and focuses the first available command from ArrowDown', async () => {
    const onOpenChange = vi.fn();
    render(<><CadMenuBar
      onOpenChange={onOpenChange}
      items={[
        { id: 'locked', label: 'Locked', disabled: true, items: [{ id: 'disabled-command', label: 'Disabled command' }] },
        { id: 'file', label: 'File', items: [{ id: 'unavailable', label: 'Unavailable', disabled: true }, { id: 'open', label: 'Open drawing' }] },
        { id: 'view', label: 'View', items: [{ id: 'zoom', label: 'Zoom extents' }] }
      ]}
    /><button type="button">Outside control</button></>);

    const locked = screen.getByRole('menuitem', { name: 'Locked' });
    expect(locked).toBeDisabled();
    fireEvent.click(locked);
    expect(screen.queryByRole('menu', { name: 'Locked' })).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();

    const file = screen.getByRole('menuitem', { name: 'File' });
    file.focus();
    fireEvent.keyDown(file, { key: 'ArrowDown' });
    await screen.findByRole('menu', { name: 'File' });
    const openDrawing = screen.getByRole('menuitem', { name: 'Open drawing' });
    await waitFor(() => expect(openDrawing).toHaveFocus());

    fireEvent.keyDown(openDrawing, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: 'File' })).not.toBeInTheDocument();
      expect(file).toHaveFocus();
    });

    fireEvent.click(file);
    expect(screen.getByRole('menu', { name: 'File' })).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside control' }));
    await waitFor(() => expect(screen.queryByRole('menu', { name: 'File' })).not.toBeInTheDocument());
  });

  it('keeps end-slot controls outside the menubar while Arrow navigation remains scoped to menus', () => {
    render(<CadMenuBar
      endSlot={<button type="button">Layout controls</button>}
      endSlotLabel="Workspace controls"
      items={[
        { id: 'file', label: 'File', items: [{ id: 'open', label: 'Open drawing' }] },
        { id: 'edit', label: 'Edit', items: [{ id: 'undo', label: 'Undo' }] }
      ]}
    />);

    const menubar = screen.getByRole('menubar', { name: 'CAD application menu' });
    const endSlot = screen.getByRole('group', { name: 'Workspace controls' });
    const layoutControls = screen.getByRole('button', { name: 'Layout controls' });
    const file = screen.getByRole('menuitem', { name: 'File' });
    const edit = screen.getByRole('menuitem', { name: 'Edit' });

    expect(endSlot.parentElement).toHaveClass('cad-menu-bar__layout');
    expect(menubar).not.toContainElement(endSlot);
    expect(endSlot).not.toContainElement(menubar);

    file.focus();
    fireEvent.keyDown(file, { key: 'ArrowRight' });
    expect(edit).toHaveFocus();

    layoutControls.focus();
    fireEvent.keyDown(layoutControls, { key: 'ArrowLeft' });
    expect(layoutControls).toHaveFocus();
    expect(screen.queryByRole('menu', { name: 'Edit' })).not.toBeInTheDocument();
  });

  it('uses valid list semantics in a block palette and omits inactive Insert actions', () => {
    render(<CadBlockPalette blocks={[{ id: 'title', label: 'Title block', category: 'ISO' }]} />);
    const list = screen.getByRole('list');
    expect(list).toContainElement(screen.getByRole('listitem'));
    expect(screen.queryByRole('button', { name: 'Insert' })).not.toBeInTheDocument();
  });
});
