import React, { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { CadWorkspaceChromeControls } from '../src/index';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CadWorkspaceChromeControls', () => {
  it('renders icon-only controls with accessible labels and shortcut-aware titles', () => {
    const controlsRef = createRef<HTMLDivElement>();
    render(<CadWorkspaceChromeControls
      ref={controlsRef}
      label="CAD titlebar controls"
      items={[
        {
          id: 'layout',
          label: 'Customize workspace layout',
          icon: <svg data-testid="layout-icon" viewBox="0 0 16 16" />,
          shortcut: 'Ctrl+Alt+L'
        }
      ]}
    />);

    const group = screen.getByRole('group', { name: 'CAD titlebar controls' });
    const layout = screen.getByRole('button', { name: 'Customize workspace layout' });
    expect(controlsRef.current).toBe(group);
    expect(screen.getByTestId('layout-icon')).toBeInTheDocument();
    expect(layout).toHaveAttribute('title', 'Customize workspace layout · Ctrl+Alt+L');
    expect(layout).toHaveAttribute('aria-keyshortcuts', 'Ctrl+Alt+L');
    expect(layout).toHaveAttribute('data-shortcut', 'Ctrl+Alt+L');
  });

  it('delivers declarative item clicks to both the item and the group callback', () => {
    const onItemAction = vi.fn();
    const onItemClick = vi.fn();
    const item = { id: 'toggle-left', label: 'Toggle left dock', icon: '◧', onClick: onItemAction };
    render(<CadWorkspaceChromeControls items={[item]} onItemClick={onItemClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Toggle left dock' }));
    expect(onItemAction).toHaveBeenLastCalledWith(item, expect.objectContaining({
      id: 'toggle-left',
      label: 'Toggle left dock',
      source: 'workspace-chrome'
    }), expect.any(Object));
    expect(onItemClick).toHaveBeenLastCalledWith(item, expect.objectContaining({
      id: 'toggle-left',
      source: 'workspace-chrome'
    }), expect.any(Object));
  });

  it('prevents disabled controls from delivering an action', () => {
    const onItemAction = vi.fn();
    const onItemClick = vi.fn();
    render(<CadWorkspaceChromeControls
      items={[{ id: 'locked', label: 'Locked workspace layout', icon: '⌘', disabled: true, onClick: onItemAction }]}
      onItemClick={onItemClick}
    />);

    const locked = screen.getByRole('button', { name: 'Locked workspace layout' });
    expect(locked).toBeDisabled();
    expect(locked).toHaveAttribute('data-disabled', 'true');
    fireEvent.click(locked);
    expect(onItemAction).not.toHaveBeenCalled();
    expect(onItemClick).not.toHaveBeenCalled();
  });

  it('exposes active toggle and mode state in semantic and machine-readable attributes', () => {
    render(<CadWorkspaceChromeControls items={[
      { id: 'left-open', label: 'Left dock open', icon: '◧', active: true, mode: 'open' },
      { id: 'right-rail', label: 'Right dock rail', icon: '◨', active: false, mode: 'rail' },
      { id: 'command', label: 'Command dock', icon: '▱' }
    ]} />);

    const open = screen.getByRole('button', { name: 'Left dock open' });
    const rail = screen.getByRole('button', { name: 'Right dock rail' });
    const command = screen.getByRole('button', { name: 'Command dock' });
    expect(open).toHaveAttribute('aria-pressed', 'true');
    expect(open).toHaveAttribute('data-active', 'true');
    expect(open).toHaveAttribute('data-mode', 'open');
    expect(rail).toHaveAttribute('aria-pressed', 'false');
    expect(rail).toHaveAttribute('data-active', 'false');
    expect(rail).toHaveAttribute('data-mode', 'rail');
    expect(command).not.toHaveAttribute('aria-pressed');
    expect(command).toHaveAttribute('data-active', 'false');
    expect(command).not.toHaveAttribute('data-mode');
  });
});
