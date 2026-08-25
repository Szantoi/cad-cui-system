import React, { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { CadAnyProps } from '../src/cad-types';
import { CadWorkspaceFocusToggle, useCadWorkspaceFocus } from '../src/index';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function FocusProbe({ active, defaultActive, onActiveChange }: CadAnyProps) {
  const focus = useCadWorkspaceFocus({ active, defaultActive, onActiveChange });
  return <>
    <output data-testid="focus-state">{String(focus.active)}</output>
    <button type="button" onClick={event => focus.toggle(event, 'probe')}>Toggle focus</button>
    <button type="button" onClick={event => focus.setActive(false, event, 'reset')}>Reset focus</button>
  </>;
}

describe('CadWorkspaceFocusToggle', () => {
  it('owns standalone focus intent and exposes the currently meaningful action label', () => {
    const onActiveChange = vi.fn();
    const buttonRef = createRef<HTMLButtonElement>();

    render(<CadWorkspaceFocusToggle ref={buttonRef} shortcut="Ctrl+0" onActiveChange={onActiveChange} />);

    const trigger = screen.getByRole('button', { name: 'Enter focus mode' });
    expect(buttonRef.current).toBe(trigger);
    expect(trigger).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('Ctrl+0', { selector: 'kbd' })).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByRole('button', { name: 'Exit focus mode' })).toHaveAttribute('aria-pressed', 'true');
    expect(onActiveChange).toHaveBeenLastCalledWith(true, expect.objectContaining({
      changed: true,
      previousActive: false,
      source: 'trigger'
    }), expect.any(Object));

    fireEvent.click(screen.getByRole('button', { name: 'Exit focus mode' }));
    expect(screen.getByRole('button', { name: 'Enter focus mode' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('reports controlled focus changes without owning the controlled value', () => {
    const onActiveChange = vi.fn();
    const { rerender } = render(<CadWorkspaceFocusToggle active={false} onActiveChange={onActiveChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Enter focus mode' }));
    expect(onActiveChange).toHaveBeenLastCalledWith(true, expect.objectContaining({ source: 'trigger' }), expect.any(Object));
    expect(screen.getByRole('button', { name: 'Enter focus mode' })).toHaveAttribute('aria-pressed', 'false');

    rerender(<CadWorkspaceFocusToggle active onActiveChange={onActiveChange} />);
    expect(screen.getByRole('button', { name: 'Exit focus mode' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps document-level keyboard routing host-owned while exposing a state hook', () => {
    const onActiveChange = vi.fn();
    render(<FocusProbe defaultActive onActiveChange={onActiveChange} />);

    expect(screen.getByTestId('focus-state')).toHaveTextContent('true');
    fireEvent.click(screen.getByRole('button', { name: 'Reset focus' }));
    expect(screen.getByTestId('focus-state')).toHaveTextContent('false');
    expect(onActiveChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ source: 'reset' }), expect.any(Object));

    fireEvent.keyDown(document, { key: '0', ctrlKey: true });
    expect(screen.getByTestId('focus-state')).toHaveTextContent('false');
  });

  it('respects consumer click cancellation and disabled state', () => {
    const onActiveChange = vi.fn();
    const onClick = event => event.preventDefault();
    const { rerender } = render(<CadWorkspaceFocusToggle onClick={onClick} onActiveChange={onActiveChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Enter focus mode' }));
    expect(onActiveChange).not.toHaveBeenCalled();

    rerender(<CadWorkspaceFocusToggle disabled onActiveChange={onActiveChange} />);
    expect(screen.getByRole('button', { name: 'Enter focus mode' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Enter focus mode' }));
    expect(onActiveChange).not.toHaveBeenCalled();
  });
});
