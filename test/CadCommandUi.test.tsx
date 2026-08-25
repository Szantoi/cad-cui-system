import React, { useRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CadContextMenuPopup, CadRadialMenu } from '../src';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const actions = [
  { id: 'move', label: 'Move', icon: <span data-testid="move-icon">↔</span> },
  { id: 'copy', label: 'Copy' }
];

function RadialCopyIcon({ size = 0 }: { size?: number }) {
  return <span data-testid="radial-copy-icon" data-size={size}>▣</span>;
}

const radialActions = [
  { id: 'move', label: 'Move', icon: <span data-testid="radial-move-icon">↔</span>, shortcut: 'M' },
  { id: 'copy', label: 'Copy', icon: RadialCopyIcon, shortcut: 'C' },
  { id: 'rotate', label: 'Rotate', shortcut: 'R' }
];

function ContextMenuHarness({ onAction = vi.fn(), onClose = vi.fn(), useReturnFocusRef = false }: { onAction?: (item: unknown, event: unknown) => void; onClose?: (event: unknown, meta: unknown) => void; useReturnFocusRef?: boolean }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = (event, meta) => {
    onClose(event, meta);
    setOpen(false);
  };
  const focusProps = useReturnFocusRef ? { returnFocusRef: triggerRef } : { restoreFocusRef: triggerRef };
  return <>
    <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>Open selection menu</button>
    <button type="button">Outside control</button>
    {open && <CadContextMenuPopup
      {...focusProps}
      open={open}
      position={{ x: 36, y: 48 }}
      items={actions}
      label="Selection actions"
      onAction={onAction}
      onClose={close}
    />}
  </>;
}

describe('CadContextMenuPopup', () => {
  it('positions a menu, accepts React element icons, and supports initial focus, arrows, and Escape', async () => {
    const onClose = vi.fn();
    render(<ContextMenuHarness onClose={onClose} />);

    const trigger = screen.getByRole('button', { name: 'Open selection menu' });
    trigger.focus();
    fireEvent.click(trigger);

    const menu = await screen.findByRole('menu', { name: 'Selection actions' });
    const move = screen.getByRole('menuitem', { name: 'Move' });
    const copy = screen.getByRole('menuitem', { name: 'Copy' });
    expect(menu).toHaveStyle({ position: 'absolute', left: '36px', top: '48px' });
    expect(screen.getByTestId('move-icon')).toBeInTheDocument();
    await waitFor(() => expect(move).toHaveFocus());

    fireEvent.keyDown(move, { key: 'ArrowDown' });
    expect(copy).toHaveFocus();
    fireEvent.keyDown(copy, { key: 'Escape' });

    expect(onClose).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ reason: 'escape' }));
    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: 'Selection actions' })).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it('dismisses on a pointer press outside and restores the return-focus target', async () => {
    const onClose = vi.fn();
    render(<ContextMenuHarness onClose={onClose} useReturnFocusRef />);

    const trigger = screen.getByRole('button', { name: 'Open selection menu' });
    trigger.focus();
    fireEvent.click(trigger);
    await screen.findByRole('menu', { name: 'Selection actions' });

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside control' }));

    expect(onClose).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ reason: 'outside' }));
    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: 'Selection actions' })).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it('closes after a command without restoring focus away from the command destination', async () => {
    const onAction = vi.fn();
    function ActionHarness() {
      const [open, setOpen] = useState(false);
      const triggerRef = useRef<HTMLButtonElement>(null);
      const commandDestinationRef = useRef<HTMLButtonElement>(null);
      return <>
        <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>Open selection menu</button>
        <button ref={commandDestinationRef} type="button">Command destination</button>
        {open && <CadContextMenuPopup
          open={open}
          position={{ x: 12, y: 24 }}
          items={actions}
          label="Selection actions"
          restoreFocusRef={triggerRef}
          onAction={(item, event) => {
            onAction(item, event);
            commandDestinationRef.current?.focus();
          }}
          onClose={() => setOpen(false)}
        />}
      </>;
    }

    render(<ActionHarness />);
    fireEvent.click(screen.getByRole('button', { name: 'Open selection menu' }));
    const move = await screen.findByRole('menuitem', { name: 'Move' });
    fireEvent.click(move);

    expect(onAction).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'move' }), expect.anything());
    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: 'Selection actions' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Command destination' })).toHaveFocus();
    });
  });
});

function RadialMenuHarness({ onAction = vi.fn(), onClose = vi.fn(), useReturnFocusRef = false }: { onAction?: (item: unknown, event: unknown) => void; onClose?: (event: unknown, meta: unknown) => void; useReturnFocusRef?: boolean }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = (event, meta) => {
    onClose(event, meta);
    setOpen(false);
  };
  const focusProps = useReturnFocusRef ? { returnFocusRef: triggerRef } : { restoreFocusRef: triggerRef };
  return <>
    <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>Open radial menu</button>
    <button type="button">Outside radial control</button>
    <CadRadialMenu
      {...focusProps}
      open={open}
      position={{ x: 72, y: 96 }}
      items={radialActions}
      label="Selection radial actions"
      centerLabel="Modify"
      onAction={onAction}
      onClose={close}
    />
  </>;
}

describe('CadRadialMenu', () => {
  it('positions the centre-anchored menu, accepts React element icons, and supports logical arrow navigation', async () => {
    render(<RadialMenuHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'Open radial menu' }));
    const menu = await screen.findByRole('menu', { name: 'Selection radial actions' });
    const move = screen.getByRole('menuitem', { name: 'Move' });
    const copy = screen.getByRole('menuitem', { name: 'Copy' });
    const rotate = screen.getByRole('menuitem', { name: 'Rotate' });
    expect(menu).toHaveStyle({ position: 'absolute', left: '72px', top: '96px' });
    expect(screen.getByText('Modify')).toBeInTheDocument();
    expect(screen.getByTestId('radial-move-icon')).toBeInTheDocument();
    expect(screen.getByTestId('radial-copy-icon')).toHaveAttribute('data-size', '20');
    await waitFor(() => expect(move).toHaveFocus());

    fireEvent.keyDown(move, { key: 'ArrowRight' });
    expect(copy).toHaveFocus();
    fireEvent.keyDown(copy, { key: 'ArrowUp' });
    expect(move).toHaveFocus();
    fireEvent.keyDown(move, { key: 'End' });
    expect(rotate).toHaveFocus();
    fireEvent.keyDown(rotate, { key: 'Home' });
    expect(move).toHaveFocus();
  });

  it('dismisses on Escape and outside pointer presses, restoring either focus-ref alias', async () => {
    const onClose = vi.fn();
    render(<RadialMenuHarness onClose={onClose} useReturnFocusRef />);

    const trigger = screen.getByRole('button', { name: 'Open radial menu' });
    trigger.focus();
    fireEvent.click(trigger);
    const move = await screen.findByRole('menuitem', { name: 'Move' });
    fireEvent.keyDown(move, { key: 'Escape' });

    expect(onClose).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ reason: 'escape' }));
    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: 'Selection radial actions' })).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });

    fireEvent.click(trigger);
    await screen.findByRole('menu', { name: 'Selection radial actions' });
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside radial control' }));
    expect(onClose).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ reason: 'outside' }));
    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: 'Selection radial actions' })).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it('closes after an action without pulling focus back from the command destination', async () => {
    const onAction = vi.fn();
    function ActionHarness() {
      const [open, setOpen] = useState(false);
      const triggerRef = useRef<HTMLButtonElement>(null);
      const commandDestinationRef = useRef<HTMLButtonElement>(null);
      return <>
        <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>Open radial menu</button>
        <button ref={commandDestinationRef} type="button">Radial command destination</button>
        <CadRadialMenu
          open={open}
          position={{ x: 12, y: 24 }}
          items={radialActions}
          label="Radial selection actions"
          restoreFocusRef={triggerRef}
          onAction={(item, event) => {
            onAction(item, event);
            commandDestinationRef.current?.focus();
          }}
          onClose={() => setOpen(false)}
        />
      </>;
    }

    render(<ActionHarness />);
    fireEvent.click(screen.getByRole('button', { name: 'Open radial menu' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Move' }));

    expect(onAction).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'move' }), expect.anything());
    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: 'Radial selection actions' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Radial command destination' })).toHaveFocus();
    });
  });
});
