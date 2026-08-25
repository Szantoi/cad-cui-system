import type { CadAnyProps } from './cad-types.js';
import React from 'react';
/**
 * A compact engine-independent navigation toolbar. Mode actions (Pan and
 * Orbit by default) have controlled/uncontrolled active state; command
 * actions simply report their invocation back to the host.
 */
export declare function CadNavigationBar({ actions, activeId, defaultActiveId, onActiveChange, onChange, onAction, onPan, onZoom, onZoomIn, onZoomOut, onZoomWindow, onZoomExtents, onOrbit, onHome, label, orientation, className, ...props }: CadAnyProps): React.JSX.Element;
/** A native, labelled selector for a visual/viewport rendering style. */
export declare function CadVisualStylePicker({ styles, value, defaultValue, onChange, onStyleChange, label, id, selectProps, disabled, className, ...props }: CadAnyProps): React.JSX.Element;
/** A native, labelled paper-space viewport scale selector. */
export declare function CadViewportScalePicker({ scales, value, defaultValue, onChange, onScaleChange, onManage, manageLabel, label, id, selectProps, disabled, className, ...props }: CadAnyProps): React.JSX.Element;
/**
 * A host-owned catalogue of named selection sets. This component never
 * creates, deletes or applies CAD selections itself: callbacks receive the
 * relevant serializable set record and let the host own that work.
 */
export declare function CadSelectionSetPanel({ sets, activeId, defaultActiveId, onChange, onApply, onCreate, onRename, onDelete, filter, defaultFilter, onFilterChange, showFilter, title, filterLabel, emptyLabel, createLabel, applyLabel, renameLabel, deleteLabel, className, children, ...props }: CadAnyProps): React.JSX.Element;
