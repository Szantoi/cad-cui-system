import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { Playground } from '../demo/src/main.jsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('interactive CAD CUI playground', () => {
  it('renders the engine-free workbench and creates a new layout profile', () => {
    render(<Playground />);

    expect(screen.getByText('ENGINE:')).toHaveTextContent('ENGINE: NOT CONNECTED');
    expect(screen.getByRole('img', { name: 'Technical drawing mockup' })).toBeInTheDocument();

    const profiles = screen.getByRole('tablist', { name: 'Workspace profiles' });
    expect(within(profiles).getByRole('tab', { name: 'Model' })).toHaveAttribute('aria-selected', 'true');
    expect(within(profiles).getByRole('tab', { name: 'Layout1' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'New layout' }));

    expect(within(profiles).getByRole('tab', { name: 'Layout3' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Workspace: Layout3 created.')).toBeInTheDocument();
  });

  it('lets the operator open, rail, and close the workspace panels while model space remains available', () => {
    render(<Playground />);

    const toolsVisibility = screen.getByRole('group', { name: 'Tools panel visibility' });
    expect(within(toolsVisibility).getByRole('button', { name: 'Open Tools panel' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(within(toolsVisibility).getByRole('button', { name: 'Rail Tools panel' }));
    expect(within(toolsVisibility).getByRole('button', { name: 'Rail Tools panel' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Expand Tools panel' })).toBeInTheDocument();

    fireEvent.click(within(toolsVisibility).getByRole('button', { name: 'Closed Tools panel' }));
    expect(screen.queryByRole('complementary', { name: 'Tools panel' })).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Technical drawing mockup' })).toBeInTheDocument();

    fireEvent.click(within(toolsVisibility).getByRole('button', { name: 'Open Tools panel' }));
    expect(screen.getByRole('complementary', { name: 'Tools panel' })).toBeInTheDocument();

    const inspectorVisibility = screen.getByRole('group', { name: 'Inspector panel visibility' });
    fireEvent.click(within(inspectorVisibility).getByRole('button', { name: 'Rail Inspector panel' }));
    expect(screen.getByRole('button', { name: 'Expand Inspector panel' })).toBeInTheDocument();
    fireEvent.click(within(inspectorVisibility).getByRole('button', { name: 'Closed Inspector panel' }));
    expect(screen.queryByRole('complementary', { name: 'Inspector panel' })).not.toBeInTheDocument();
  });

  it('keeps the command dock at a controlled height and supports rail and closed states', () => {
    render(<Playground />);

    expect(document.querySelector('.cad-demo-command-dock__line')).toHaveAttribute('data-command-height', '144');
    expect(screen.getByLabelText('CAD command line')).toBeInTheDocument();
    const commandResize = screen.getByRole('separator', { name: 'Resize command line' });
    expect(commandResize).toHaveAttribute('aria-valuenow', '144');
    fireEvent.keyDown(commandResize, { key: 'ArrowUp' });
    expect(commandResize).toHaveAttribute('aria-valuenow', '152');
    expect(document.querySelector('.cad-demo-command-dock__line')).toHaveAttribute('data-command-height', '152');

    const commandVisibility = screen.getByRole('group', { name: 'Command bar visibility' });
    fireEvent.click(within(commandVisibility).getByRole('button', { name: 'Rail Command bar' }));
    expect(document.getElementById('cad-demo-command-bar')).toHaveAttribute('data-mode', 'rail');
    expect(screen.queryByLabelText('CAD command line')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Expand command bar' })).toBeInTheDocument();

    fireEvent.click(within(commandVisibility).getByRole('button', { name: 'Closed Command bar' }));
    expect(document.getElementById('cad-demo-command-bar')).toHaveAttribute('data-mode', 'closed');
    expect(screen.queryByLabelText('CAD command line')).not.toBeInTheDocument();

    fireEvent.click(within(commandVisibility).getByRole('button', { name: 'Open Command bar' }));
    expect(document.getElementById('cad-demo-command-bar')).toHaveAttribute('data-mode', 'open');
    expect(screen.getByLabelText('CAD command line')).toBeInTheDocument();
  });

  it('takes a block from the palette through insert confirmation and records host feedback without toast notifications', () => {
    render(<Playground />);

    fireEvent.click(screen.getByRole('tab', { name: 'Blocks' }));
    const doorButton = screen.getByRole('button', { name: /Door 900/ });
    const doorTile = doorButton.closest('[role="listitem"]');
    expect(doorButton).toHaveAttribute('aria-pressed', 'true');
    expect(doorTile).not.toBeNull();

    fireEvent.click(within(doorTile).getByRole('button', { name: 'Insert' }));
    expect(screen.getByRole('dialog', { name: 'Insert Door 900' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Insert block' }));

    expect(screen.queryByRole('dialog', { name: 'Insert Door 900' })).not.toBeInTheDocument();
    expect(screen.getByText('Insert complete: Door 900 inserted at 1180, 640, 0.')).toBeInTheDocument();
    expect(document.querySelector('.cad-toast')).toBeNull();
    expect(screen.getByText('2 objects')).toBeInTheDocument();
  });

  it('keeps workspace ribbon, viewport style, and named selection sets in host-owned state', () => {
    render(<Playground />);

    fireEvent.click(screen.getByRole('tab', { name: 'VIEW' }));
    expect(screen.getByRole('tab', { name: 'VIEW' })).toHaveAttribute('aria-selected', 'true');

    fireEvent.change(screen.getByLabelText('Display'), { target: { value: 'x-ray' } });
    expect(screen.getByLabelText('SVG drawing viewport mockup')).toHaveAttribute('data-visual-style', 'x-ray');

    fireEvent.click(screen.getByRole('tab', { name: /Sets/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Doors + windows' }));
    fireEvent.click(screen.getByRole('button', { name: 'Select' }));

    expect(screen.getByText('Selection set: Doors + windows applied (12 objects).')).toBeInTheDocument();
    expect(screen.getByText('12 objects')).toBeInTheDocument();
  });
});
