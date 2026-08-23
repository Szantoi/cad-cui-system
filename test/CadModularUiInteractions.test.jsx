import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  CadBlockPalette,
  CadColorPicker,
  CadDialog,
  CadDynamicInput,
  CadPopover,
  CadSplitPane,
  CadToast,
  CadTooltip
} from '../src/index.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CAD layout and drafting interactions', () => {
  it('resizes a split pane from its keyboard-operable separator', () => {
    const onSizeChange = vi.fn();
    render(
      <CadSplitPane
        defaultSize={30}
        keyboardStep={7}
        onSizeChange={onSizeChange}
        primary={<span>Tools</span>}
        secondary={<span>Canvas</span>}
      />
    );

    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-valuenow', '30');

    fireEvent.keyDown(separator, { key: 'ArrowRight' });
    expect(separator).toHaveAttribute('aria-valuenow', '37');
    expect(onSizeChange).toHaveBeenLastCalledWith(
      37,
      { source: 'keyboard', axis: 'x' },
      expect.any(Object)
    );

    fireEvent.keyDown(separator, { key: 'Home' });
    expect(separator).toHaveAttribute('aria-valuenow', '12');
  });

  it('selects color source models and indexed RGB swatches', () => {
    const onChange = vi.fn();
    render(<CadColorPicker colors={['#cc0000']} onChange={onChange} />);

    const byBlock = screen.getByRole('button', { name: 'ByBlock' });
    fireEvent.click(byBlock);
    expect(byBlock).toHaveAttribute('data-active', 'true');
    expect(onChange).toHaveBeenLastCalledWith({ mode: 'by-block' }, expect.any(Object));

    const red = screen.getByRole('button', { name: 'Color 1' });
    fireEvent.click(red);
    expect(red).toHaveAttribute('aria-pressed', 'true');
    expect(onChange).toHaveBeenLastCalledWith(
      { mode: 'rgb', value: '#cc0000', index: 1 },
      expect.any(Object)
    );
  });

  it('filters, selects, and inserts blocks through host callbacks', () => {
    const onChange = vi.fn();
    const onFilterChange = vi.fn();
    const onInsert = vi.fn();
    render(
      <CadBlockPalette
        blocks={[
          { id: 'door-single', label: 'Single door', category: 'Architecture' },
          { id: 'desk', label: 'Desk', category: 'Furniture' }
        ]}
        onChange={onChange}
        onFilterChange={onFilterChange}
        onInsert={onInsert}
      />
    );

    const door = screen.getByRole('button', { name: /Single door/ });
    fireEvent.click(door);
    expect(door).toHaveAttribute('aria-pressed', 'true');
    expect(onChange).toHaveBeenLastCalledWith(
      'door-single',
      expect.objectContaining({ id: 'door-single' }),
      expect.any(Object)
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'Insert' })[0]);
    expect(onInsert).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'door-single', category: 'Architecture' }),
      expect.any(Object)
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Filter blocks' }), { target: { value: 'furniture' } });
    expect(onFilterChange).toHaveBeenLastCalledWith('furniture', expect.any(Object));
    expect(screen.queryByRole('button', { name: /Single door/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Desk/ })).toBeInTheDocument();
  });

  it('submits the numeric coordinate draft supplied by a dynamic input', () => {
    const onSubmit = vi.fn();
    render(
      <CadDynamicInput
        prompt="Specify insertion point"
        defaultValue={{ x: 4, y: 8 }}
        fields={[
          { id: 'x', label: 'X' },
          { id: 'y', label: 'Y' }
        ]}
        onSubmit={onSubmit}
      />
    );

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Y' }), { target: { value: '16' } });
    fireEvent.submit(screen.getByRole('form', { name: 'Specify insertion point' }));
    expect(onSubmit).toHaveBeenCalledWith({ x: 4, y: 16 }, expect.any(Object));
  });
});

describe('CAD overlay interactions', () => {
  it('closes a dialog from Escape and exposes its accessible title', () => {
    const onClose = vi.fn();
    render(<CadDialog open title="Block settings" description="Configure the selected block" onClose={onClose}><p>Settings</p></CadDialog>);

    const dialog = screen.getByRole('dialog', { name: 'Block settings' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('dispatches toast actions and dismissals with the original toast item', () => {
    const onAction = vi.fn();
    const onDismiss = vi.fn();
    const toast = {
      id: 'saved',
      title: 'Drawing saved',
      message: 'Model.dwg is up to date',
      action: { label: 'Open folder', onClick: onAction }
    };
    render(<CadToast toast={toast} onDismiss={onDismiss} />);

    expect(screen.getByRole('status')).toHaveTextContent('Model.dwg is up to date');
    fireEvent.click(screen.getByRole('button', { name: 'Open folder' }));
    expect(onAction).toHaveBeenLastCalledWith(toast, expect.any(Object));

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss Drawing saved' }));
    expect(onDismiss).toHaveBeenLastCalledWith(toast, expect.any(Object));
  });

  it('opens and closes a popover while revealing tooltip content on focus', () => {
    const onOpenChange = vi.fn();
    render(
      <>
        <CadPopover
          label="Layer options"
          contentRole="dialog"
          trigger={<button type="button">Layer tools</button>}
          content={<button type="button">Freeze layer</button>}
          onOpenChange={onOpenChange}
        />
        <CadTooltip content="Turn snap mode on or off"><button type="button">Snap mode</button></CadTooltip>
      </>
    );

    const trigger = screen.getByRole('button', { name: 'Layer tools' });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: 'Layer options' })).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.any(Object));

    fireEvent.keyDown(screen.getByRole('dialog', { name: 'Layer options' }), { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Layer options' })).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.any(Object));

    const snapMode = screen.getByRole('button', { name: 'Snap mode' });
    const tooltip = screen.getByRole('tooltip');
    fireEvent.focus(snapMode);
    expect(tooltip.parentElement).toHaveClass('cad-tooltip--visible');
    expect(snapMode).toHaveAttribute('aria-describedby', tooltip.id);
    fireEvent.blur(snapMode);
    expect(tooltip.parentElement).not.toHaveClass('cad-tooltip--visible');
  });
});
