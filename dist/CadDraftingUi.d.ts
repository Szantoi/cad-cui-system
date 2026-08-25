import type { CadAnyProps } from './cad-types.js';
import React from 'react';
/**
 * Cursor-adjacent coordinate input. It owns only temporary UI draft values;
 * the host decides where the overlay is positioned and what a submission does.
 */
export declare function CadDynamicInput({ mode, fields, value, defaultValue, onChange, onSubmit, prompt, unit, visible, submitLabel, className, children, ...props }: CadAnyProps): React.JSX.Element;
/** Object-snap chooser for endpoint/midpoint/intersection-style drafting. */
export declare function CadObjectSnapMenu({ modes, activeIds, defaultActiveIds, multiple, onChange, onClose, label, className, ...props }: CadAnyProps): React.JSX.Element;
/** Compact context toolbar intended for a selected object or active grip. */
export declare function CadGripToolbar({ tools, selectionCount, label, onAction, onDismiss, className, ...props }: CadAnyProps): React.JSX.Element;
/**
 * Parametric constraint actions. `strip` preserves a conventional compact
 * toolbar; `auto` allows the actions to wrap into panel-local tiles as their
 * host narrows, without changing the accessible controls or their state.
 */
export declare function CadConstraintBar({ constraints, activeIds, defaultActiveIds, onChange, onAction, label, layout, className, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadAnnotationScalePicker({ scales, value, defaultValue, onChange, label, onManage, id, selectProps, disabled, layout, className, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadViewPresetPicker({ presets, value, defaultValue, onChange, label, id, selectProps, disabled, className, ...props }: CadAnyProps): React.JSX.Element;
/** Readout for polar tracking, ortho and typed distances near the cursor. */
export declare function CadPolarTracker({ angle, distance, increment, active, defaultActive, onActiveChange, className, label, ...props }: CadAnyProps): React.JSX.Element;
/** Visual object-snap marker for an on-canvas overlay. */
export declare function CadObjectSnapMarker({ type, label, active, className, style, ...props }: CadAnyProps): React.JSX.Element;
/** Focusable selection grip. The host handles pointer movement and geometry edits. */
export declare function CadSelectionGrip({ label, variant, active, disabled, onPointerDown, onClick, className, ...props }: CadAnyProps): React.JSX.Element;
