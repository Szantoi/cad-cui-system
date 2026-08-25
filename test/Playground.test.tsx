import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { Playground } from '../demo/src/main';

afterEach(() => {
  cleanup();
  globalThis.localStorage?.clear?.();
  vi.restoreAllMocks();
});

const showCommandActivity = () => {
  const tabs = screen.getByRole('tablist', { name: 'Command dock panels' });
  fireEvent.click(within(tabs).getByRole('tab', { name: /^Activity/ }));
  return tabs;
};

const WORKSPACE_PANELS_BY_DOCK = Object.freeze({
  tools: ['Tool Palette', 'Object Snaps', 'Constraints', 'Layers'],
  inspector: ['Properties', 'Blocks', 'Object Data', 'Selection', 'Selection Sets', 'View / Scale'],
  command: ['Command', 'Activity', 'Layouts', 'Drafting Modes']
});

const WORKSPACE_PANEL_LABELS = Object.freeze(Object.values(WORKSPACE_PANELS_BY_DOCK).flat());

const expectCompactIconTabs = (tablist, labels) => {
  const dockTabs = tablist.closest('.cad-dock-tabs');
  expect(dockTabs).toHaveAttribute('data-compact', 'true');
  expect(dockTabs.querySelector('em')).not.toBeInTheDocument();
  expect(dockTabs.querySelector('.cad-dock-tabs__close')).not.toBeInTheDocument();
  labels.forEach(label => {
    const tab = within(tablist).getByRole('tab', { name: label });
    expect(tab).toHaveAttribute('aria-label', label);
    expect(tab).toHaveAttribute('title', label);
    expect(tab.querySelector('.cad-dock-tabs__tab-label')).toBeEmptyDOMElement();
    const icon = tab.querySelector('.cad-dock-tabs__tab-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).not.toBeEmptyDOMElement();
    expect(tab.querySelector('.cad-dock-tabs__attention')).not.toBeInTheDocument();
  });
};

const openWorkspacePresets = () => {
  fireEvent.click(screen.getByRole('tab', { name: 'WORKSPACE / PANELS' }));
  fireEvent.click(screen.getByRole('button', { name: 'Workspace presets' }));
  return screen.getByRole('dialog', { name: 'Workspace presets' });
};

const workspaceLayoutControls = () => screen.getByRole('group', { name: 'Application status and workspace controls' });

const quickWorkspaceControls = () => within(workspaceLayoutControls()).getByRole('group', { name: 'Quick workspace controls' });

const quickDockToggle = dockLabel => within(quickWorkspaceControls()).getByRole('button', {
  name: new RegExp(`^Toggle ${dockLabel} — `)
});

const openWorkspaceLayout = () => {
  fireEvent.click(within(workspaceLayoutControls()).getByRole('button', { name: 'Customize workspace layout' }));
  return screen.getByRole('dialog', { name: 'Workspace layout' });
};

const chooseWorkspaceDockMode = (layout, dockLabel, mode) => {
  const dockVisibility = within(layout).getByRole('group', { name: `${dockLabel} visibility` });
  const action = within(dockVisibility).getByRole('button', { name: `${mode} ${dockLabel}` });
  fireEvent.click(action);
  return action;
};

const closeWorkspaceLayout = layout => {
  fireEvent.keyDown(layout, { key: 'Escape' });
  expect(screen.queryByRole('dialog', { name: 'Workspace layout' })).not.toBeInTheDocument();
};

describe('interactive CAD CUI playground', () => {
  it('renders the engine-free workbench and creates a new layout profile', () => {
    render(<Playground />);

    expect(screen.getByText('ENGINE:')).toHaveTextContent('ENGINE: NOT CONNECTED');
    expect(screen.getByRole('img', { name: 'Technical drawing mockup' })).toBeInTheDocument();

    const commandTabs = screen.getByRole('tablist', { name: 'Command dock panels' });
    fireEvent.click(within(commandTabs).getByRole('tab', { name: 'Layouts' }));
    const profiles = screen.getByRole('tablist', { name: 'Workspace profiles' });
    expect(within(profiles).getByRole('tab', { name: 'Model' })).toHaveAttribute('aria-selected', 'true');
    expect(within(profiles).getByRole('tab', { name: 'Layout1' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'New layout' }));

    expect(within(profiles).getByRole('tab', { name: 'Layout3' })).toHaveAttribute('aria-selected', 'true');
    showCommandActivity();
    expect(screen.getByText('Workspace: Layout3 created.')).toBeInTheDocument();
  });

  it('keeps header workspace controls outside the menubar and exposes direct plus explicit dock actions', () => {
    render(<Playground />);

    const menuBar = screen.getByRole('menubar', { name: 'CAD application menu' });
    const layoutControls = workspaceLayoutControls();
    const quickControls = quickWorkspaceControls();
    const header = document.querySelector('.cad-demo-header') as HTMLElement;
    const headerChildren = Array.from(header.children) as HTMLElement[];
    const brand = screen.getByText('CAD CUI').closest('.cad-demo-header__brand') as HTMLElement;
    const status = screen.getByText('ENGINE:').closest('.cad-demo-header__status') as HTMLElement;
    const search = screen.getByRole('search', { name: 'Workspace search' });
    expect(header).toContainElement(menuBar);
    expect(header).toContainElement(layoutControls);
    expect(headerChildren[0]).toContainElement(menuBar);
    expect(headerChildren[0]).toContainElement(brand);
    expect(headerChildren[1]).toBe(search);
    expect(headerChildren[2]).toContainElement(status);
    expect(headerChildren[2]).toContainElement(quickControls);
    expect(menuBar).not.toContainElement(layoutControls);
    expect(menuBar).not.toContainElement(brand);
    expect(search).toContainElement(screen.getByRole('searchbox', { name: 'Search CAD interface' }));
    expect(within(quickControls).getByRole('button', { name: 'Enter Focus Mode' })).toHaveAttribute('aria-pressed', 'false');
    expect(quickDockToggle('Tools panel')).toHaveAttribute('data-mode', 'open');
    expect(quickDockToggle('Command bar')).toHaveAttribute('data-mode', 'open');
    expect(quickDockToggle('Inspector panel')).toHaveAttribute('data-mode', 'open');

    const layout = openWorkspaceLayout();
    expect(within(layout).getByText('Choose an explicit Open, Rail, or Hide state for every dock.')).toBeInTheDocument();
    expect(chooseWorkspaceDockMode(layout, 'Tools panel', 'Rail')).toHaveAttribute('aria-pressed', 'true');
    expect(document.getElementById('cad-demo-tools-panel')).toHaveAttribute('data-mode', 'rail');
    expect(screen.getByRole('button', { name: 'Preview Tools panel' })).toBeInTheDocument();

    expect(chooseWorkspaceDockMode(layout, 'Inspector panel', 'Hide')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('complementary', { name: 'Inspector panel' })).not.toBeInTheDocument();
    expect(quickDockToggle('Inspector panel')).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(quickDockToggle('Inspector panel'));
    expect(document.getElementById('cad-demo-inspector-panel')).toHaveAttribute('data-mode', 'open');
    expect(quickDockToggle('Inspector panel')).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(quickDockToggle('Tools panel'));
    expect(document.getElementById('cad-demo-tools-panel')).toBeNull();
    expect(quickDockToggle('Tools panel')).toHaveAttribute('data-mode', 'closed');
    fireEvent.click(quickDockToggle('Tools panel'));
    expect(document.getElementById('cad-demo-tools-panel')).toHaveAttribute('data-mode', 'open');

    expect(chooseWorkspaceDockMode(layout, 'Command bar', 'Hide')).toHaveAttribute('aria-pressed', 'true');
    expect(document.getElementById('cad-demo-command-bar')).toHaveAttribute('data-mode', 'closed');
    fireEvent.click(quickDockToggle('Command bar'));
    expect(document.getElementById('cad-demo-command-bar')).toHaveAttribute('data-mode', 'open');
    closeWorkspaceLayout(layout);
  });

  it('keeps the centered header search editable, clearable, and routed to the activity log', () => {
    render(<Playground />);

    const search = screen.getByRole('search', { name: 'Workspace search' });
    const input = screen.getByRole('searchbox', { name: 'Search CAD interface' });
    fireEvent.change(input, { target: { value: 'layers' } });
    expect(input).toHaveValue('layers');
    expect(within(search).getByRole('button', { name: 'Clear header search' })).toBeInTheDocument();

    fireEvent.submit(search);
    showCommandActivity();
    expect(screen.getByText('Search: “layers” requested.')).toBeInTheDocument();

    fireEvent.click(within(search).getByRole('button', { name: 'Clear header search' }));
    expect(input).toHaveValue('');
  });

  it('offers only selection-compatible actions from the shared desktop selection snapshot', () => {
    render(<Playground />);

    const selectionToolbar = screen.getByRole('toolbar', { name: 'Selection actions' });
    expect(within(selectionToolbar).getByRole('button', { name: 'MOVE' })).toBeInTheDocument();
    expect(within(selectionToolbar).getByRole('button', { name: 'TRIM' })).toBeInTheDocument();
    expect(within(selectionToolbar).getByRole('button', { name: 'OFFSET' })).toBeInTheDocument();
    expect(within(selectionToolbar).queryByRole('button', { name: 'ROTATE' })).not.toBeInTheDocument();
    expect(document.querySelector('[data-cad-group="MODIFY"]')).toBeNull();

    fireEvent.click(within(selectionToolbar).getByRole('button', { name: 'MOVE' }));
    showCommandActivity();
    expect(screen.getByText('Selection action: MOVE offered for 1 selected object.')).toBeInTheDocument();

    const inspectorTabs = screen.getByRole('tablist', { name: 'Inspector dock panels' });
    fireEvent.click(within(inspectorTabs).getByRole('tab', { name: 'Object Data' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select line-01' }));
    expect(screen.queryByRole('toolbar', { name: 'Selection actions' })).not.toBeInTheDocument();
    expect(document.querySelector('[data-cad-group="MODIFY"]')).not.toBeNull();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select block-03' }));

    const blockToolbar = screen.getByRole('toolbar', { name: 'Selection actions' });
    expect(within(blockToolbar).getByRole('button', { name: 'ROTATE' })).toBeInTheDocument();
    expect(within(blockToolbar).getByRole('button', { name: 'EXPLODE' })).toBeInTheDocument();
    expect(within(blockToolbar).queryByRole('button', { name: 'TRIM' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'EDIT BLOCK' })).toBeInTheDocument();
    expect(document.querySelector('[data-cad-group="MODIFY"]')).toBeNull();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Select block-03' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select dim-04' }));
    const lockedToolbar = screen.getByRole('toolbar', { name: 'Selection actions' });
    expect(within(lockedToolbar).getByRole('button', { name: 'PROPERTIES' })).toBeInTheDocument();
    expect(within(lockedToolbar).queryByRole('button', { name: 'MOVE' })).not.toBeInTheDocument();
  });

  it('derives grouped radial actions and flat right-click actions from the same filtered selection registry', async () => {
    render(<Playground />);

    const viewport = screen.getByLabelText('SVG drawing viewport mockup');
    viewport.focus();
    fireEvent.keyDown(viewport, { key: 'm' });
    showCommandActivity();
    expect(screen.getByText('Selection action: MOVE offered for 1 selected object.')).toBeInTheDocument();

    fireEvent.keyDown(viewport, { key: 'q' });
    const radialMenu = await screen.findByRole('menu', { name: 'Selection radial menu' });
    const modifyCollector = within(radialMenu).getByRole('menuitem', { name: 'MODIFY, submenu' });
    expect(within(radialMenu).getByRole('menuitem', { name: 'OPTIONS, submenu' })).toBeInTheDocument();
    expect(within(radialMenu).queryByRole('menuitem', { name: 'ROTATE' })).not.toBeInTheDocument();
    await waitFor(() => expect(modifyCollector).toHaveFocus());
    fireEvent.keyDown(modifyCollector, { key: 'ArrowRight' });
    const radialMove = await within(radialMenu).findByRole('menuitem', { name: 'MOVE' });
    expect(within(radialMenu).getByRole('menuitem', { name: 'TRIM' })).toBeInTheDocument();
    expect(within(radialMenu).getByRole('menuitem', { name: 'OFFSET' })).toBeInTheDocument();
    expect(radialMove).toHaveAttribute('data-radial-ring', '0');
    fireEvent.keyDown(radialMove, { key: 'ArrowRight' });
    expect(within(radialMenu).getByRole('menuitem', { name: 'COPY' })).toHaveFocus();
    fireEvent.keyDown(radialMenu, { key: 'Escape' });
    await waitFor(() => expect(modifyCollector).toHaveFocus());
    fireEvent.keyDown(modifyCollector, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('menu', { name: 'Selection radial menu' })).not.toBeInTheDocument());
    expect(viewport).toHaveFocus();

    const collectorMode = screen.getByLabelText('Radial collector opening mode');
    const presentationMode = screen.getByLabelText('Radial submenu presentation');
    expect(collectorMode).toHaveValue('hover');
    expect(presentationMode).toHaveValue('cascade');
    fireEvent.change(collectorMode, { target: { value: 'click' } });
    fireEvent.change(presentationMode, { target: { value: 'rings' } });
    viewport.focus();
    fireEvent.keyDown(viewport, { key: 'q' });
    const configuredRadial = await screen.findByRole('menu', { name: 'Selection radial menu' });
    expect(configuredRadial).toHaveAttribute('data-presentation', 'rings');
    const configuredModify = within(configuredRadial).getByRole('menuitem', { name: 'MODIFY, submenu' });
    fireEvent.pointerEnter(configuredModify);
    expect(within(configuredRadial).queryByRole('menuitem', { name: 'MOVE' })).not.toBeInTheDocument();
    fireEvent.click(configuredModify);
    expect(await within(configuredRadial).findByRole('menuitem', { name: 'MOVE' })).toBeInTheDocument();
    fireEvent.keyDown(configuredRadial, { key: 'Escape' });
    await waitFor(() => expect(configuredModify).toHaveFocus());
    fireEvent.keyDown(configuredModify, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('menu', { name: 'Selection radial menu' })).not.toBeInTheDocument());

    fireEvent.keyDown(viewport, { key: 'F10', shiftKey: true });
    const contextMenu = await screen.findByRole('menu', { name: 'Selection context menu' });
    expect(within(contextMenu).getByRole('menuitem', { name: /MOVE/ })).toBeInTheDocument();
    expect(within(contextMenu).getByRole('menuitem', { name: /TRIM/ })).toBeInTheDocument();
    expect(within(contextMenu).getByRole('menuitem', { name: /OFFSET/ })).toBeInTheDocument();
    expect(within(contextMenu).queryByRole('menuitem', { name: /ROTATE/ })).not.toBeInTheDocument();

    const move = within(contextMenu).getByRole('menuitem', { name: /MOVE/ });
    await waitFor(() => expect(move).toHaveFocus());
    fireEvent.keyDown(contextMenu, { key: 'ArrowDown' });
    expect(within(contextMenu).getByRole('menuitem', { name: /COPY/ })).toHaveFocus();
    fireEvent.keyDown(contextMenu, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('menu', { name: 'Selection context menu' })).not.toBeInTheDocument());
    expect(viewport).toHaveFocus();

    fireEvent.contextMenu(viewport, { clientX: 160, clientY: 120, altKey: true });
    const pointerRadial = await screen.findByRole('menu', { name: 'Selection radial menu' });
    fireEvent.click(within(pointerRadial).getByRole('menuitem', { name: 'MODIFY, submenu' }));
    fireEvent.click(await within(pointerRadial).findByRole('menuitem', { name: 'OFFSET' }));
    await waitFor(() => expect(screen.queryByRole('menu', { name: 'Selection radial menu' })).not.toBeInTheDocument());
    expect(screen.getByText('Selection action: OFFSET offered for 1 selected object.')).toBeInTheDocument();
    await waitFor(() => expect(viewport).toHaveFocus());

    fireEvent.contextMenu(viewport, { clientX: 160, clientY: 120 });
    const pointerMenu = await screen.findByRole('menu', { name: 'Selection context menu' });
    fireEvent.click(within(pointerMenu).getByRole('menuitem', { name: /OFFSET/ }));
    await waitFor(() => expect(screen.queryByRole('menu', { name: 'Selection context menu' })).not.toBeInTheDocument());
    expect(screen.getAllByText('Selection action: OFFSET offered for 1 selected object.')).toHaveLength(2);
    await waitFor(() => expect(viewport).toHaveFocus());

    const commandInput = screen.getByRole('combobox', { name: 'Dynamic CAD command' });
    fireEvent.keyDown(commandInput, { key: 'm' });
    expect(screen.getAllByText('Selection action: MOVE offered for 1 selected object.')).toHaveLength(1);
  });

  it('routes CAD command aliases through the current selection before the generic command parser', () => {
    render(<Playground />);

    const commandInput = screen.getByRole('combobox', { name: 'Dynamic CAD command' });
    fireEvent.change(commandInput, { target: { value: 'TR' } });
    fireEvent.submit(commandInput.closest('form'));
    showCommandActivity();
    expect(screen.getByText('Selection action: TRIM offered for 1 selected object.')).toBeInTheDocument();

    const inspectorTabs = screen.getByRole('tablist', { name: 'Inspector dock panels' });
    fireEvent.click(within(inspectorTabs).getByRole('tab', { name: 'Object Data' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select line-01' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select dim-04' }));
    fireEvent.change(commandInput, { target: { value: 'BE' } });
    fireEvent.submit(commandInput.closest('form'));
    expect(screen.getByText('Selection action: EDIT BLOCK is not available for the current selection.')).toBeInTheDocument();
  });

  it('shows one context-appropriate scale control as Model Space changes to a Layout', () => {
    render(<Playground />);

    const modelStyleControls = screen.getByRole('group', { name: 'Model Space drawing style controls' });
    const annotationScale = within(modelStyleControls).getByRole('combobox', { name: 'Annotation scale' });
    expect(within(modelStyleControls).queryByRole('combobox', { name: 'Viewport scale' })).not.toBeInTheDocument();
    fireEvent.change(annotationScale, { target: { value: '1:20' } });
    expect(annotationScale).toHaveValue('1:20');

    const inspectorTabs = screen.getByRole('tablist', { name: 'Inspector dock panels' });
    fireEvent.click(within(inspectorTabs).getByRole('tab', { name: 'View / Scale' }));
    const modelScalePanel = screen.getByLabelText('View and Scale panel');
    expect(within(modelScalePanel).getByRole('combobox', { name: 'Annotation scale' })).toBeInTheDocument();
    expect(within(modelScalePanel).queryByRole('combobox', { name: 'Viewport scale' })).not.toBeInTheDocument();

    const commandTabs = screen.getByRole('tablist', { name: 'Command dock panels' });
    fireEvent.click(within(commandTabs).getByRole('tab', { name: 'Layouts' }));
    const profiles = screen.getByRole('tablist', { name: 'Workspace profiles' });
    fireEvent.click(within(profiles).getByRole('tab', { name: 'Layout1' }));

    const layoutStyleControls = screen.getByRole('group', { name: 'Layout viewport style controls' });
    const viewportScale = within(layoutStyleControls).getByRole('combobox', { name: 'Viewport scale' });
    expect(within(layoutStyleControls).queryByRole('combobox', { name: 'Annotation scale' })).not.toBeInTheDocument();
    fireEvent.change(viewportScale, { target: { value: '1:10' } });
    const layoutScalePanel = screen.getByLabelText('View and Scale panel');
    expect(within(layoutScalePanel).getByRole('combobox', { name: 'Viewport scale' })).toBeInTheDocument();
    expect(within(layoutScalePanel).queryByRole('combobox', { name: 'Annotation scale' })).not.toBeInTheDocument();
    const viewport = screen.getByLabelText('SVG drawing viewport mockup');
    expect(viewport).toHaveAttribute('data-space', 'layout');
    expect(viewport).toHaveAttribute('data-viewport-scale', '1:10');

    fireEvent.click(within(profiles).getByRole('tab', { name: 'Model' }));
    const returnedModelControls = screen.getByRole('group', { name: 'Model Space drawing style controls' });
    expect(within(returnedModelControls).getByRole('combobox', { name: 'Annotation scale' })).toHaveValue('1:20');
    expect(screen.getByLabelText('SVG drawing viewport mockup')).toHaveAttribute('data-space', 'model');
  });

  it('shows a non-reflowing dock preview from rails and only makes the dock durable on click', () => {
    render(<Playground />);

    const workspace = document.querySelector('.cad-demo-workspace');
    const layout = openWorkspaceLayout();
    chooseWorkspaceDockMode(layout, 'Tools panel', 'Rail');
    closeWorkspaceLayout(layout);

    const railLabel = screen.getByRole('button', { name: 'Preview Tools panel' });
    const rail = railLabel.closest('.cad-workspace-dock-rail');
    expect(rail).not.toBeNull();
    expect(workspace).toHaveAttribute('data-left-panel', 'rail');
    expect(workspace).toHaveAttribute('data-left-width', '288');
    expect(screen.queryByRole('region', { name: 'Tools panel preview' })).not.toBeInTheDocument();

    fireEvent.pointerEnter(railLabel);
    const preview = screen.getByRole('region', { name: 'Tools panel preview' });
    expect(railLabel).toHaveAttribute('aria-expanded', 'true');
    expect(preview).not.toHaveAttribute('hidden');
    expect(workspace).toHaveAttribute('data-left-panel', 'rail');
    expect(workspace).toHaveAttribute('data-left-width', '288');

    fireEvent.pointerLeave(rail, { relatedTarget: preview });
    expect(screen.getByRole('region', { name: 'Tools panel preview' })).toBe(preview);

    fireEvent.pointerLeave(rail, { relatedTarget: document.body });
    expect(screen.queryByRole('region', { name: 'Tools panel preview' })).not.toBeInTheDocument();
    expect(preview).toHaveAttribute('hidden');

    fireEvent.click(railLabel);
    expect(document.getElementById('cad-demo-tools-panel')).toHaveAttribute('data-mode', 'open');
    expect(screen.queryByRole('button', { name: 'Preview Tools panel' })).not.toBeInTheDocument();
  });

  it('uses compact, icon-led tabs for every dock zone while preserving named tab access', () => {
    render(<Playground />);

    const toolTabs = screen.getByRole('tablist', { name: 'Tools dock panels' });
    expectCompactIconTabs(toolTabs, WORKSPACE_PANELS_BY_DOCK.tools);
    fireEvent.click(within(toolTabs).getByRole('tab', { name: 'Constraints' }));
    const constraintsPanel = screen.getByLabelText('Constraints panel');
    const constraintBar = within(constraintsPanel).getByRole('group', { name: 'Geometric constraints' });
    expect(constraintBar).toHaveAttribute('data-layout', 'auto');
    expect(within(constraintBar).getAllByRole('button')).toHaveLength(9);
    const coincident = within(constraintBar).getByRole('button', { name: 'Coincident' });
    expect(coincident).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(coincident);
    expect(coincident).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(within(toolTabs).getByRole('tab', { name: 'Layers' }));
    expect(within(toolTabs).getByRole('tab', { name: 'Layers' })).toHaveAttribute('aria-selected', 'true');

    const inspectorTabs = screen.getByRole('tablist', { name: 'Inspector dock panels' });
    expectCompactIconTabs(inspectorTabs, WORKSPACE_PANELS_BY_DOCK.inspector);
    fireEvent.click(within(inspectorTabs).getByRole('tab', { name: 'Object Data' }));
    expect(within(inspectorTabs).getByRole('tab', { name: 'Object Data' })).toHaveAttribute('aria-selected', 'true');

    const commandTabs = screen.getByRole('tablist', { name: 'Command dock panels' });
    expectCompactIconTabs(commandTabs, WORKSPACE_PANELS_BY_DOCK.command);
    fireEvent.click(within(commandTabs).getByRole('tab', { name: 'Layouts' }));
    expect(screen.getByRole('region', { name: 'Drawing layouts' })).toBeInTheDocument();

    const layout = openWorkspaceLayout();
    chooseWorkspaceDockMode(layout, 'Command bar', 'Rail');
    closeWorkspaceLayout(layout);
    const commandRail = screen.getByRole('button', { name: 'Preview Command bar' });
    fireEvent.pointerEnter(commandRail);
    const commandPreview = screen.getByRole('region', { name: 'Command bar preview' });
    expect(within(commandPreview).getByRole('tablist', { name: 'Command dock panels' })).toBeInTheDocument();
    expect(document.getElementById('cad-demo-command-bar')).toHaveAttribute('data-mode', 'rail');
  });

  it('hosts all 14 workspace panels in preference-owned dock zones from the ribbon layout control', () => {
    render(<Playground />);

    const leftTabs = screen.getByRole('tablist', { name: 'Tools dock panels' });
    const inspectorTabs = screen.getByRole('tablist', { name: 'Inspector dock panels' });
    const commandTabs = screen.getByRole('tablist', { name: 'Command dock panels' });
    expectCompactIconTabs(leftTabs, WORKSPACE_PANELS_BY_DOCK.tools);
    expectCompactIconTabs(inspectorTabs, WORKSPACE_PANELS_BY_DOCK.inspector);
    expectCompactIconTabs(commandTabs, WORKSPACE_PANELS_BY_DOCK.command);

    fireEvent.click(screen.getByRole('tab', { name: 'WORKSPACE / PANELS' }));
    expect(screen.getByRole('tab', { name: 'WORKSPACE / PANELS' })).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(screen.getByRole('button', { name: /Panel layout/ }));
    const panelLayout = screen.getByRole('dialog', { name: 'Panel layout' });
    WORKSPACE_PANEL_LABELS.forEach(label => {
      expect(within(panelLayout).getByText(label)).toBeInTheDocument();
    });
    expect(panelLayout.querySelectorAll('[data-panel-id]')).toHaveLength(14);

    fireEvent.click(within(panelLayout).getByRole('button', { name: 'Dock Object Snaps to bottom' }));
    expect(within(commandTabs).getByRole('tab', { name: 'Object Snaps' })).toHaveAttribute('aria-selected', 'true');
    expect(within(leftTabs).queryByRole('tab', { name: 'Object Snaps' })).not.toBeInTheDocument();

    fireEvent.click(within(panelLayout).getByRole('button', { name: 'Dock Layers to right' }));
    expect(within(inspectorTabs).getByRole('tab', { name: 'Layers' })).toHaveAttribute('aria-selected', 'true');
    expect(within(leftTabs).queryByRole('tab', { name: 'Layers' })).not.toBeInTheDocument();

    fireEvent.click(within(panelLayout).getByRole('button', { name: 'Dock Object Data to bottom' }));
    expect(within(commandTabs).getByRole('tab', { name: 'Object Data' })).toHaveAttribute('aria-selected', 'true');
    expect(within(inspectorTabs).queryByRole('tab', { name: 'Object Data' })).not.toBeInTheDocument();

    fireEvent.click(within(panelLayout).getByRole('button', { name: 'Hide Constraints' }));
    expect(within(leftTabs).queryByRole('tab', { name: 'Constraints' })).not.toBeInTheDocument();
    expect(panelLayout.querySelector('[data-panel-id="constraints"]')).toHaveAttribute('data-open', 'false');
  });

  it('restores a relocated workspace panel and reopens its physical dock from the ribbon command', () => {
    render(<Playground />);

    fireEvent.click(screen.getByRole('tab', { name: 'WORKSPACE / PANELS' }));
    fireEvent.click(screen.getByRole('button', { name: 'Panel layout' }));
    const firstLayout = screen.getByRole('dialog', { name: 'Panel layout' });
    fireEvent.click(within(firstLayout).getByRole('button', { name: 'Dock Object Snaps to bottom' }));
    expect(within(screen.getByRole('tablist', { name: 'Command dock panels' })).getByRole('tab', { name: 'Object Snaps' })).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(within(firstLayout).getByRole('button', { name: 'Close Panel layout' }));
    const workspaceLayout = openWorkspaceLayout();
    chooseWorkspaceDockMode(workspaceLayout, 'Tools panel', 'Rail');
    closeWorkspaceLayout(workspaceLayout);
    expect(document.getElementById('cad-demo-tools-panel')).toHaveAttribute('data-mode', 'rail');

    fireEvent.click(screen.getByRole('button', { name: 'Panel layout' }));
    const restoredLayout = screen.getByRole('dialog', { name: 'Panel layout' });
    fireEvent.click(within(restoredLayout).getByRole('button', { name: 'Restore panel layout' }));

    expect(document.getElementById('cad-demo-tools-panel')).toHaveAttribute('data-mode', 'open');
    const restoredTools = screen.getByRole('tablist', { name: 'Tools dock panels' });
    expect(within(restoredTools).getByRole('tab', { name: 'Object Snaps' })).toBeInTheDocument();
    expect(within(restoredTools).getByRole('tab', { name: 'Tool Palette' })).toHaveAttribute('aria-selected', 'true');
    showCommandActivity();
    expect(screen.getAllByText('Workspace: Panel layout opened.')).toHaveLength(2);
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

    const layout = openWorkspaceLayout();
    chooseWorkspaceDockMode(layout, 'Command bar', 'Rail');
    expect(document.getElementById('cad-demo-command-bar')).toHaveAttribute('data-mode', 'rail');
    expect(screen.queryByRole('region', { name: 'CAD command line' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('CAD command line').closest('[hidden]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Preview Command bar' })).toBeInTheDocument();

    chooseWorkspaceDockMode(layout, 'Command bar', 'Hide');
    expect(document.getElementById('cad-demo-command-bar')).toHaveAttribute('data-mode', 'closed');
    expect(screen.queryByLabelText('CAD command line')).not.toBeInTheDocument();

    chooseWorkspaceDockMode(layout, 'Command bar', 'Open');
    expect(document.getElementById('cad-demo-command-bar')).toHaveAttribute('data-mode', 'open');
    expect(screen.getByLabelText('CAD command line')).toBeInTheDocument();
    closeWorkspaceLayout(layout);
  });

  it('keeps dock geometry independent, restores it after hiding, and exposes edge-aware keyboard resizing', () => {
    render(<Playground />);

    const workspace = document.querySelector('.cad-demo-workspace');
    const commandDock = document.getElementById('cad-demo-command-bar');
    const leftResize = screen.getByRole('separator', { name: 'Resize Tools panel' });
    const rightResize = screen.getByRole('separator', { name: 'Resize Inspector panel' });
    const bottomResize = screen.getByRole('separator', { name: 'Resize Command bar' });

    expect(leftResize).toHaveAttribute('aria-controls', 'cad-demo-tools-panel');
    expect(leftResize).toHaveAttribute('aria-valuenow', '288');
    expect(rightResize).toHaveAttribute('aria-valuenow', '352');
    expect(bottomResize).toHaveAttribute('aria-valuenow', '248');

    fireEvent.keyDown(leftResize, { key: 'ArrowRight' });
    fireEvent.keyDown(rightResize, { key: 'ArrowLeft' });
    fireEvent.keyDown(bottomResize, { key: 'ArrowUp' });

    expect(workspace).toHaveAttribute('data-left-width', '304');
    expect(workspace).toHaveAttribute('data-right-width', '368');
    expect(commandDock).toHaveAttribute('data-dock-height', '264');

    const layout = openWorkspaceLayout();
    chooseWorkspaceDockMode(layout, 'Tools panel', 'Rail');
    chooseWorkspaceDockMode(layout, 'Inspector panel', 'Hide');
    chooseWorkspaceDockMode(layout, 'Command bar', 'Rail');

    expect(screen.queryByRole('separator', { name: 'Resize Tools panel' })).not.toBeInTheDocument();
    expect(screen.queryByRole('separator', { name: 'Resize Inspector panel' })).not.toBeInTheDocument();
    expect(screen.queryByRole('separator', { name: 'Resize Command bar' })).not.toBeInTheDocument();

    chooseWorkspaceDockMode(layout, 'Tools panel', 'Open');
    chooseWorkspaceDockMode(layout, 'Inspector panel', 'Open');
    chooseWorkspaceDockMode(layout, 'Command bar', 'Open');

    expect(screen.getByRole('separator', { name: 'Resize Tools panel' })).toHaveAttribute('aria-valuenow', '304');
    expect(screen.getByRole('separator', { name: 'Resize Inspector panel' })).toHaveAttribute('aria-valuenow', '368');
    expect(screen.getByRole('separator', { name: 'Resize Command bar' })).toHaveAttribute('aria-valuenow', '264');

    fireEvent.click(within(layout).getByRole('button', { name: 'Reset dock layout' }));
    expect(workspace).toHaveAttribute('data-left-width', '288');
    expect(workspace).toHaveAttribute('data-right-width', '352');
    expect(commandDock).toHaveAttribute('data-dock-height', '248');
    expect(document.getElementById('cad-demo-tools-panel')).toHaveAttribute('data-mode', 'open');
    expect(document.getElementById('cad-demo-inspector-panel')).toHaveAttribute('data-mode', 'open');
    expect(commandDock).toHaveAttribute('data-mode', 'open');
    closeWorkspaceLayout(layout);
  });

  it('saves named workspace presets, restores their dock geometry, and reloads the current workspace from local storage', async () => {
    const { unmount } = render(<Playground />);

    const workspace = document.querySelector('.cad-demo-workspace');
    const collectorMode = screen.getByLabelText('Radial collector opening mode');
    const presentationMode = screen.getByLabelText('Radial submenu presentation');
    fireEvent.change(collectorMode, { target: { value: 'click' } });
    fireEvent.change(presentationMode, { target: { value: 'rings' } });
    expect(collectorMode).toHaveValue('click');
    expect(presentationMode).toHaveValue('rings');
    const navigationDock = screen.getByRole('complementary', { name: 'Viewport navigation dock' });
    const navigationHandle = screen.getByRole('button', { name: 'Collapse Viewport navigation dock' });
    const viewportControls = screen.getByRole('complementary', { name: 'Viewport controls' });
    const fixedViewCubeHost = viewportControls.closest('.cad-demo-viewport__controls');
    expect(fixedViewCubeHost).toHaveAttribute('data-fixed', 'true');
    expect(fixedViewCubeHost.closest('.cad-demo-viewport')).toContainElement(viewportControls);
    expect(fixedViewCubeHost.querySelector('.cad-movable-overlay')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'VIEW' }));
    fireEvent.click(document.querySelector('[data-command-id="viewcube-controls"]'));
    expect(viewportControls).toHaveAttribute('data-collapsed', 'true');
    fireEvent.pointerEnter(viewportControls);
    expect(viewportControls).toHaveAttribute('data-expanded', 'true');
    expect(viewportControls).toHaveAttribute('data-collapsed', 'true');
    fireEvent.pointerLeave(viewportControls, { relatedTarget: document.body });
    expect(viewportControls).toHaveAttribute('data-expanded', 'false');
    expect(navigationDock).toHaveAttribute('data-edge', 'top');
    fireEvent.keyDown(navigationHandle, { key: 'ArrowLeft' });
    fireEvent.click(navigationHandle);
    expect(navigationDock).toHaveAttribute('data-position-x', '-16');
    expect(navigationDock).toHaveAttribute('data-collapsed', 'true');
    expect(screen.queryByRole('button', { name: 'Pan' })).not.toBeInTheDocument();
    const leftResize = screen.getByRole('separator', { name: 'Resize Tools panel' });
    fireEvent.keyDown(leftResize, { key: 'ArrowRight' });
    const layout = openWorkspaceLayout();
    chooseWorkspaceDockMode(layout, 'Tools panel', 'Rail');
    closeWorkspaceLayout(layout);
    expect(workspace).toHaveAttribute('data-left-width', '304');
    expect(document.getElementById('cad-demo-tools-panel')).toHaveAttribute('data-mode', 'rail');

    const presetDialog = openWorkspacePresets();
    const presetName = within(presetDialog).getByLabelText('Preset name');
    expect(presetName).toBeInTheDocument();
    ['Load', 'Overwrite', 'Delete', 'Export', 'Import'].forEach(name => {
      expect(within(presetDialog).getByRole('button', { name })).toBeInTheDocument();
    });

    fireEvent.change(presetName, { target: { value: 'Focused drafting' } });
    fireEvent.click(within(presetDialog).getByRole('button', { name: 'Save as Focused drafting' }));
    const savedPresets = within(presetDialog).getByRole('combobox', { name: 'Saved presets' });
    expect(savedPresets).not.toHaveValue('');
    expect(within(savedPresets).getByRole('option', { name: 'Focused drafting' })).toBeInTheDocument();

    fireEvent.click(quickDockToggle('Tools panel'));
    expect(document.getElementById('cad-demo-tools-panel')).toBeNull();
    fireEvent.click(quickDockToggle('Tools panel'));
    fireEvent.keyDown(screen.getByRole('separator', { name: 'Resize Tools panel' }), { key: 'ArrowLeft' });
    expect(workspace).toHaveAttribute('data-left-width', '288');
    expect(document.getElementById('cad-demo-tools-panel')).toHaveAttribute('data-mode', 'open');
    fireEvent.click(screen.getByRole('button', { name: 'Open Viewport controls' }));
    expect(viewportControls).toHaveAttribute('data-collapsed', 'false');
    fireEvent.click(screen.getByRole('button', { name: 'Expand Viewport navigation dock' }));
    fireEvent.keyDown(screen.getByRole('button', { name: 'Collapse Viewport navigation dock' }), { key: 'ArrowRight' });
    expect(navigationDock).toHaveAttribute('data-position-x', '0');
    expect(navigationDock).toHaveAttribute('data-collapsed', 'false');

    fireEvent.click(within(presetDialog).getByRole('button', { name: 'Load' }));
    expect(workspace).toHaveAttribute('data-left-width', '304');
    expect(document.getElementById('cad-demo-tools-panel')).toHaveAttribute('data-mode', 'rail');
    expect(navigationDock).toHaveAttribute('data-position-x', '-16');
    expect(navigationDock).toHaveAttribute('data-collapsed', 'true');
    expect(viewportControls).toHaveAttribute('data-collapsed', 'true');
    expect(collectorMode).toHaveValue('click');
    expect(presentationMode).toHaveValue('rings');

    unmount();
    render(<Playground />);
    await waitFor(() => {
      expect(document.querySelector('.cad-demo-workspace')).toHaveAttribute('data-left-width', '304');
      expect(document.getElementById('cad-demo-tools-panel')).toHaveAttribute('data-mode', 'rail');
       expect(screen.getByRole('complementary', { name: 'Viewport navigation dock' })).toHaveAttribute('data-position-x', '-16');
       expect(screen.getByRole('complementary', { name: 'Viewport navigation dock' })).toHaveAttribute('data-collapsed', 'true');
       expect(screen.getByRole('complementary', { name: 'Viewport controls' })).toHaveAttribute('data-collapsed', 'true');
       expect(screen.getByLabelText('Radial collector opening mode')).toHaveValue('click');
       expect(screen.getByLabelText('Radial submenu presentation')).toHaveValue('rings');
     });

    const restoredPresetDialog = openWorkspacePresets();
    expect(within(restoredPresetDialog).getByRole('option', { name: 'Focused drafting' })).toBeInTheDocument();
  });

  it('distinguishes, moves, collapses, and restores the viewport selection and command-console overlays', async () => {
    const { unmount } = render(<Playground />);

    const navigationOverlay = screen.getByRole('complementary', { name: 'Viewport navigation dock' });
    const selectionOverlay = screen.getByRole('complementary', { name: 'Selection summary' });
    const dynamicOverlay = screen.getByRole('complementary', { name: 'Viewport command console' });
    const selectionHandle = screen.getByRole('button', { name: 'Collapse Selection summary' });
    const dynamicHandle = screen.getByRole('button', { name: 'Collapse Viewport command console' });

    expect(navigationOverlay).toHaveAttribute('data-edge', 'top');
    expect(selectionOverlay).toHaveAttribute('data-edge', 'left');
    expect(dynamicOverlay).toHaveAttribute('data-edge', 'left');
    const overlays: Array<[HTMLElement, string]> = [[navigationOverlay, '⌖'], [selectionOverlay, '▣'], [dynamicOverlay, '>_']];
    overlays.forEach(([overlay, icon]) => {
      expect(overlay).toHaveAttribute('data-has-handle-icon', 'true');
      expect(overlay.querySelector('.cad-movable-overlay__icon')).toHaveTextContent(icon);
    });

    const commandInput = screen.getByRole('combobox', { name: 'Dynamic CAD command' });
    fireEvent.change(commandInput, { target: { value: 'MOVE: 10,30,50' } });
    fireEvent.submit(commandInput.closest('form'));
    expect(commandInput).toHaveValue('');
    fireEvent.click(within(screen.getByRole('tablist', { name: 'Command dock panels' })).getByRole('tab', { name: 'Drafting Modes' }));
    expect(screen.getByLabelText('Coordinates')).toHaveTextContent(/X: 10\s+Y: 30\s+Z: 50/);

    fireEvent.keyDown(selectionHandle, { key: 'ArrowRight' });
    fireEvent.keyDown(selectionHandle, { key: 'ArrowUp', shiftKey: true });
    fireEvent.click(selectionHandle);
    fireEvent.keyDown(dynamicHandle, { key: 'ArrowLeft', shiftKey: true });
    fireEvent.keyDown(dynamicHandle, { key: 'ArrowDown' });
    fireEvent.click(dynamicHandle);

    expect(selectionOverlay).toHaveAttribute('data-position-x', '16');
    expect(selectionOverlay).toHaveAttribute('data-position-y', '-64');
    expect(selectionOverlay).toHaveAttribute('data-collapsed', 'true');
    expect(dynamicOverlay).toHaveAttribute('data-position-x', '-64');
    expect(dynamicOverlay).toHaveAttribute('data-position-y', '16');
    expect(dynamicOverlay).toHaveAttribute('data-collapsed', 'true');
    expect(screen.queryByRole('combobox', { name: 'Dynamic CAD command' })).not.toBeInTheDocument();

    const presetDialog = openWorkspacePresets();
    fireEvent.change(within(presetDialog).getByLabelText('Preset name'), { target: { value: 'Overlay layout' } });
    fireEvent.click(within(presetDialog).getByRole('button', { name: 'Save as Overlay layout' }));
    fireEvent.keyDown(presetDialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Workspace presets' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Expand Selection summary' }));
    fireEvent.keyDown(screen.getByRole('button', { name: 'Collapse Selection summary' }), { key: 'ArrowLeft' });
    fireEvent.click(screen.getByRole('button', { name: 'Expand Viewport command console' }));
    fireEvent.keyDown(screen.getByRole('button', { name: 'Collapse Viewport command console' }), { key: 'ArrowUp' });

    expect(selectionOverlay).toHaveAttribute('data-position-x', '0');
    expect(selectionOverlay).toHaveAttribute('data-collapsed', 'false');
    expect(dynamicOverlay).toHaveAttribute('data-position-y', '0');
    expect(dynamicOverlay).toHaveAttribute('data-collapsed', 'false');

    const restoreDialog = openWorkspacePresets();
    fireEvent.click(within(restoreDialog).getByRole('button', { name: 'Load' }));
    expect(selectionOverlay).toHaveAttribute('data-position-x', '16');
    expect(selectionOverlay).toHaveAttribute('data-position-y', '-64');
    expect(selectionOverlay).toHaveAttribute('data-collapsed', 'true');
    expect(dynamicOverlay).toHaveAttribute('data-position-x', '-64');
    expect(dynamicOverlay).toHaveAttribute('data-position-y', '16');
    expect(dynamicOverlay).toHaveAttribute('data-collapsed', 'true');

    unmount();
    render(<Playground />);
    await waitFor(() => {
      expect(screen.getByRole('complementary', { name: 'Selection summary' })).toHaveAttribute('data-position-x', '16');
      expect(screen.getByRole('complementary', { name: 'Selection summary' })).toHaveAttribute('data-position-y', '-64');
      expect(screen.getByRole('complementary', { name: 'Selection summary' })).toHaveAttribute('data-collapsed', 'true');
      expect(screen.getByRole('complementary', { name: 'Viewport command console' })).toHaveAttribute('data-position-x', '-64');
      expect(screen.getByRole('complementary', { name: 'Viewport command console' })).toHaveAttribute('data-position-y', '16');
      expect(screen.getByRole('complementary', { name: 'Viewport command console' })).toHaveAttribute('data-collapsed', 'true');
    });
  });

  it('enters focus mode from the header chrome and restores the prior dock modes', () => {
    render(<Playground />);

    const layout = openWorkspaceLayout();
    chooseWorkspaceDockMode(layout, 'Tools panel', 'Rail');
    closeWorkspaceLayout(layout);
    fireEvent.click(quickDockToggle('Command bar'));

    const focusEntry = within(quickWorkspaceControls()).getByRole('button', { name: 'Enter Focus Mode' });
    expect(screen.getByRole('separator', { name: 'Resize Inspector panel' })).toBeInTheDocument();
    focusEntry.focus();
    fireEvent.click(focusEntry);

    const workbench = document.querySelector('.cad-demo-workbench');
    expect(workbench).toHaveAttribute('data-focus-mode', 'true');
    const focusHud = screen.getByRole('complementary', { name: 'Focus mode controls' });
    expect(focusHud).toBeInTheDocument();
    expect(within(focusHud).getByRole('button', { name: 'Exit Focus Mode' })).toHaveFocus();
    expect(document.getElementById('cad-demo-tools-panel')).toHaveAttribute('data-mode', 'rail');
    expect(document.getElementById('cad-demo-command-bar')).toHaveAttribute('data-mode', 'closed');
    expect(screen.queryByRole('separator', { name: 'Resize Inspector panel' })).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(workbench).toHaveAttribute('data-focus-mode', 'false');
    expect(screen.getByRole('button', { name: 'Enter Focus Mode' })).toHaveFocus();
    expect(document.getElementById('cad-demo-tools-panel')).toHaveAttribute('data-mode', 'rail');
    expect(document.getElementById('cad-demo-command-bar')).toHaveAttribute('data-mode', 'closed');
    expect(screen.getByRole('separator', { name: 'Resize Inspector panel' })).toBeInTheDocument();
  });

  it('uses Ctrl+0 for focus mode without stealing command input shortcuts', () => {
    render(<Playground />);

    const commandInput = screen.getByPlaceholderText('Type a command or search');
    fireEvent.keyDown(commandInput, { key: '0', code: 'Digit0', ctrlKey: true });
    expect(document.querySelector('.cad-demo-workbench')).toHaveAttribute('data-focus-mode', 'false');

    fireEvent.keyDown(window, { key: '0', code: 'Digit0', ctrlKey: true });
    expect(document.querySelector('.cad-demo-workbench')).toHaveAttribute('data-focus-mode', 'true');

    fireEvent.keyDown(commandInput, { key: 'Escape' });
    expect(document.querySelector('.cad-demo-workbench')).toHaveAttribute('data-focus-mode', 'true');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.querySelector('.cad-demo-workbench')).toHaveAttribute('data-focus-mode', 'false');
  });

  it('leaves Clean Screen shortcuts to an open dialog', () => {
    render(<Playground />);

    fireEvent.click(screen.getByRole('button', { name: 'Open playground help' }));
    expect(screen.getByRole('dialog', { name: 'Interactive playground' })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: '0', code: 'Digit0', ctrlKey: true });
    expect(document.querySelector('.cad-demo-workbench')).toHaveAttribute('data-focus-mode', 'false');
  });

  it('takes a block from the palette through insert confirmation and records host feedback without toast notifications', () => {
    render(<Playground />);

    fireEvent.click(screen.getByRole('tab', { name: 'Blocks' }));
    const doorButton = screen.getByRole('button', { name: /Door 900/ });
    const doorTile = doorButton.closest('[role="listitem"]') as HTMLElement | null;
    expect(doorButton).toHaveAttribute('aria-pressed', 'true');
    expect(doorTile).not.toBeNull();

    fireEvent.click(within(doorTile as HTMLElement).getByRole('button', { name: 'Insert' }));
    expect(screen.getByRole('dialog', { name: 'Insert Door 900' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Insert block' }));

    expect(screen.queryByRole('dialog', { name: 'Insert Door 900' })).not.toBeInTheDocument();
    showCommandActivity();
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

    showCommandActivity();
    expect(screen.getByText('Selection set: Doors + windows applied (12 objects).')).toBeInTheDocument();
    expect(screen.getByText('12 objects')).toBeInTheDocument();
  });
});
