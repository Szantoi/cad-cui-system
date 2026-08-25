import type { CadAnyProps } from './cad-types.js';
import React from 'react';
/**
 * AutoCAD-inspired Model/Layout tab strip. It is intentionally separate from
 * `CadSegmentTabs`: drawings and paper-space layouts need close, dirty and
 * overflow affordances that ordinary option tabs do not.
 */
export declare function CadDrawingSpaceTabs({ items, activeId, defaultActiveId, onChange, onClose, onCreate, onContextMenu, onRename, onOverflow, addLabel, addButtonProps, overflowLabel, overflowButtonProps, ariaLabel, className, ...props }: CadAnyProps): React.JSX.Element;
export declare const CadLayoutTabs: typeof CadDrawingSpaceTabs;
export declare const CadDocumentTabs: typeof CadDrawingSpaceTabs;
/**
 * Application-facing Model/Layout/+ adapter. It keeps layout data and
 * persistence with the host, while consistently mapping it to CAD drawing
 * spaces and keeping the Model profile pinned.
 */
export declare function CadWorkspaceProfileTabs({ profiles, activeId, onChange, onCreate, onClose, onRename, modelId, modelName, className, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadDockPanel({ title, icon: Icon, actions, collapsible, collapsed, defaultCollapsed, onCollapsedChange, className, children, ...props }: CadAnyProps): React.JSX.Element;
/**
 * Accessible dock tabs with an opt-in compact visual label. When `compact` is
 * enabled, an item may provide `tabLabel` (preferred) or `shortLabel` for the
 * rendered caption. The canonical `label` remains the tab's accessible name
 * and tooltip, so condensed chrome never loses its full meaning. Dock tabs do
 * not render routine count badges; `attention`/`alert` only renders for
 * actionable `warning` or `danger` states.
 */
export declare function CadDockTabs({ items, activeId, defaultActiveId, onChange, onClose, label, compact, className, children, renderPanel, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadStatusToggle({ mode, label, active, disabled, shortcut, tone, onChange, className }: CadAnyProps): React.JSX.Element;
/**
 * Coordinate readout plus object snap/grid/ortho-style state controls.
 * `tiles` turns a status-bar instance used as a panel into an adaptive grid,
 * while the default `strip` stays appropriate for an application footer.
 */
export declare function CadStatusBar({ coordinates, coordinateLabel, modes, onModeChange, units, scale, message, layout, className, children, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadCommandHistory({ items, label, onSelect, className }: CadAnyProps): React.JSX.Element;
export declare function CadCommandOptions({ options, label, onSelect, className }: CadAnyProps): React.JSX.Element;
/**
 * Controlled or standalone command line with history, options and suggestions.
 *
 * `height` is a controlled pixel height. Use `defaultHeight` for a standalone
 * resizable line; `minHeight`, `maxHeight`, `resizeStep`, and `onHeightChange`
 * keep the host in control of the allowed drawing-space allocation. Use
 * `label` when more than one command surface appears in the same workspace.
 */
export declare function CadCommandLine({ value, defaultValue, onChange, onSubmit, prompt, history, suggestions, options, onSuggestionSelect, onOptionSelect, clearOnSubmit, submitSuggestionOnEnter, disabled, placeholder, showHistory, height, defaultHeight, minHeight, maxHeight, resizeStep, resizable, onHeightChange, label, className, inputProps, style, id, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadViewCube({ activeView, onViewChange, className, label }: CadAnyProps): React.JSX.Element;
export declare function CadUcsIndicator({ xLabel, yLabel, zLabel, className, label }: CadAnyProps): React.JSX.Element;
/**
 * A fixed-host viewport control surface. Hosts decide its physical corner;
 * `collapsible` adds a durable open/collapsed intent plus a transient
 * hover/focus peek without turning the ViewCube into a draggable overlay.
 */
export declare function CadViewportControls({ activeView, onViewChange, onZoomIn, onZoomOut, onZoomExtents, showCube, showUcs, collapsible, collapsed, defaultCollapsed, onCollapsedChange, peekOpen, defaultPeekOpen, onPeekOpenChange, peekOnHover, peekOnFocus, className, label, panelLabel, onPointerEnter, onPointerLeave, onFocusCapture, onBlurCapture, onKeyDown, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadSelectionSummary({ count, entityLabel, fields, emptyLabel, className }: CadAnyProps): React.JSX.Element;
export declare function CadMeasureReadout({ distance, angle, area, volume, className, label }: CadAnyProps): React.JSX.Element;
