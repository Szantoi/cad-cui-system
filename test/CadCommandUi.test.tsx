import React, { useRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CadContextMenuPopup, CadRadialMenu } from '../src';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
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

const radialCollectorTree = [
  {
    id: 'modify',
    label: 'Modify',
    icon: '✥',
    commands: [
      { id: 'move', label: 'Move' },
      { id: 'copy', label: 'Copy' }
    ],
    children: [
      {
        id: 'advanced',
        label: 'Advanced',
        icon: '✎',
        commands: [
          { id: 'offset', label: 'Offset' },
          { id: 'trim', label: 'Trim' }
        ]
      }
    ]
  }
];

const sevenRadialActions = Array.from({ length: 7 }, (_, index) => ({
  id: `action-${index + 1}`,
  label: `Action ${index + 1}`
}));

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

  it('accepts registry-style commands and children as collectors, including string glyph icons', async () => {
    render(<CadRadialMenu
      open
      position={{ x: 64, y: 64 }}
      items={radialCollectorTree}
      label="Registry radial actions"
      defaultExpandedPath={['modify']}
    />);

    const menu = await screen.findByRole('menu', { name: 'Registry radial actions' });
    const modify = screen.getByRole('menuitem', { name: /Modify, submenu/i });
    expect(modify).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('✥')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Move' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Advanced, submenu/i })).toBeInTheDocument();
    expect(menu).toHaveClass('cad-radial-menu--cascade');
    expect(menu.style.getPropertyValue('--cad-radial-menu-safe-inset')).toContain('--cad-radial-menu-radius');
  });

  it('opens collector layers by hover, keeps them open across the child handoff, and collapses only after leaving the constellation', async () => {
    vi.useFakeTimers();
    render(<CadRadialMenu
      open
      position={{ x: 64, y: 64 }}
      items={radialCollectorTree}
      label="Hover radial actions"
      submenuDelay={30}
    />);

    const menu = screen.getByRole('menu', { name: 'Hover radial actions' });
    const modify = screen.getByRole('menuitem', { name: /Modify, submenu/i });
    fireEvent.pointerEnter(modify);
    await act(async () => { await vi.advanceTimersByTimeAsync(31); });
    const advanced = screen.getByRole('menuitem', { name: /Advanced, submenu/i });
    expect(screen.getByRole('menuitem', { name: 'Move' })).toBeInTheDocument();

    fireEvent.pointerLeave(menu, { relatedTarget: advanced });
    await act(async () => { await vi.advanceTimersByTimeAsync(31); });
    expect(screen.getByRole('menuitem', { name: 'Move' })).toBeInTheDocument();

    fireEvent.pointerLeave(menu);
    await act(async () => { await vi.advanceTimersByTimeAsync(31); });
    expect(screen.queryByRole('menuitem', { name: 'Move' })).not.toBeInTheDocument();
  });

  it('supports click-only collector opening and nested keyboard backtracking before root Escape closes', async () => {
    const onClose = vi.fn();
    render(<CadRadialMenu
      open
      position={{ x: 64, y: 64 }}
      items={radialCollectorTree}
      label="Nested keyboard radial actions"
      submenuTrigger="click"
      onClose={onClose}
    />);

    const modify = screen.getByRole('menuitem', { name: /Modify, submenu/i });
    fireEvent.pointerEnter(modify);
    expect(screen.queryByRole('menuitem', { name: 'Move' })).not.toBeInTheDocument();

    fireEvent.click(modify);
    const advanced = await screen.findByRole('menuitem', { name: /Advanced, submenu/i });
    fireEvent.keyDown(advanced, { key: 'Enter' });
    const offset = await screen.findByRole('menuitem', { name: 'Offset' });
    await waitFor(() => expect(offset).toHaveFocus());

    fireEvent.keyDown(offset, { key: 'ArrowLeft' });
    await waitFor(() => {
      expect(screen.queryByRole('menuitem', { name: 'Offset' })).not.toBeInTheDocument();
      expect(advanced).toHaveFocus();
    });
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.keyDown(advanced, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('menuitem', { name: 'Advanced, submenu' })).not.toBeInTheDocument();
      expect(modify).toHaveFocus();
    });
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.keyDown(modify, { key: 'Escape' });
    expect(onClose).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ reason: 'escape' }));
  });

  it('wraps seven or more leaf actions into concentric rings and exposes a rings presentation', async () => {
    render(<CadRadialMenu
      open
      position={{ x: 64, y: 64 }}
      items={sevenRadialActions}
      label="Multi-ring radial actions"
      presentation="rings"
    />);

    const menu = await screen.findByRole('menu', { name: 'Multi-ring radial actions' });
    expect(menu).toHaveClass('cad-radial-menu--rings', 'cad-radial-menu--multi-ring');
    expect(menu).toHaveAttribute('data-ring-count', '2');
    expect(menu).toHaveAttribute('data-maximum-ring-count', '2');
    expect(screen.getByRole('menuitem', { name: 'Action 6' })).toHaveAttribute('data-radial-ring', '0');
    expect(screen.getByRole('menuitem', { name: 'Action 7' })).toHaveAttribute('data-radial-ring', '1');
  });
});
