import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  CadBlockPalette,
  CadCommandPrompt,
  CadDialog,
  CadPopover,
  CadSplitPane
} from '../src/index.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CAD layout and overlay primitives', () => {
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

  it('traps focus in a modal dialog and restores its opener on close', async () => {
    const onClose = vi.fn();
    const { rerender } = render(<><button type="button">Open dialog</button><CadDialog open={false} onClose={onClose} title="Settings"><button type="button" data-autofocus>First</button><button type="button">Last</button></CadDialog></>);
    const opener = screen.getByRole('button', { name: 'Open dialog' });
    opener.focus();
    rerender(<><button type="button">Open dialog</button><CadDialog open onClose={onClose} title="Settings"><button type="button" data-autofocus>First</button><button type="button">Last</button></CadDialog></>);

    const first = await screen.findByRole('button', { name: 'First' });
    const last = screen.getByRole('button', { name: 'Last' });
    await waitFor(() => expect(first).toHaveFocus());
    last.focus();
    fireEvent.keyDown(last, { key: 'Tab' });
    await waitFor(() => expect(first).toHaveFocus());

    rerender(<><button type="button">Open dialog</button><CadDialog open={false} onClose={onClose} title="Settings" /></>);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Open dialog' })).toHaveFocus());
  });

  it('closes a popover outside its boundary and gives command input a real label and Escape callback', () => {
    const onCancel = vi.fn();
    render(<><CadPopover trigger={<button type="button">Options</button>} content={<span>Popover content</span>} label="Options menu" /><CadCommandPrompt label="Graph command" onCancel={onCancel} /></>);

    fireEvent.click(screen.getByRole('button', { name: 'Options' }));
    expect(screen.getByRole('dialog', { name: 'Options menu' })).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('dialog', { name: 'Options menu' })).not.toBeInTheDocument();

    const command = screen.getByRole('textbox', { name: 'Graph command' });
    fireEvent.keyDown(command, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('uses valid list semantics in a block palette and omits inactive Insert actions', () => {
    render(<CadBlockPalette blocks={[{ id: 'title', label: 'Title block', category: 'ISO' }]} />);
    const list = screen.getByRole('list');
    expect(list).toContainElement(screen.getByRole('listitem'));
    expect(screen.queryByRole('button', { name: 'Insert' })).not.toBeInTheDocument();
  });
});
