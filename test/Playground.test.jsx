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

  it('resizes the outer workspace split through its keyboard separator', () => {
    render(<Playground />);

    const outerSplitter = screen.getAllByRole('separator')[0];
    expect(outerSplitter).toHaveAttribute('aria-valuenow', '19');

    fireEvent.keyDown(outerSplitter, { key: 'ArrowRight' });

    expect(outerSplitter).toHaveAttribute('aria-valuenow', '24');
    expect(screen.getByText('24% / 68%')).toBeInTheDocument();
  });

  it('takes a block from the palette through insert confirmation and host toast feedback', () => {
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
    const toast = screen.getByText('Door 900 inserted at 1180, 640, 0.', { selector: '.cad-toast p' }).closest('[role="status"]');
    expect(toast).not.toBeNull();
    expect(toast).toHaveTextContent('Insert complete');
    expect(screen.getByText('2 objects')).toBeInTheDocument();
  });
});
