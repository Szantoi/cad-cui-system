import type { CadAnyProps } from './cad-types.js';
import React from 'react';
export declare function CadShortcutHint({ shortcut, className }: CadAnyProps): React.JSX.Element;
/** A compact tool button suitable for a ribbon, a tool palette or a menu bar. */
export declare function CadToolButton({ icon: Icon, label, shortcut, active, toggle, tone, badge, compact, className, children, title, type, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadToggleButton({ active, onChange, onClick, ...props }: CadAnyProps): React.JSX.Element;
/** A primary CAD action with an independently controllable dropdown affordance. */
export declare function CadSplitButton({ icon: Icon, label, shortcut, tone, disabled, menu, menuId, menuOpen, defaultMenuOpen, onMenuOpenChange, onClick, className, children, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadToolbarGroup({ label, items, onAction, className, children }: CadAnyProps): React.JSX.Element;
/**
 * Declarative toolbar. `groups` accepts `{ id, label, items }`; a tool item
 * can be a regular button, `{ toggle: true }`, `{ type: 'split' }`, or a
 * `{ type: 'separator' }`.
 */
export declare function CadToolbar({ groups, items, label, orientation, onAction, className, children, ...props }: CadAnyProps): React.JSX.Element;
/**
 * A vertical tool palette. Use `layout="auto"` (or `tiles`) when it lives in
 * a movable dock: the host stylesheet can then turn the tool rows into a
 * panel-local tile grid without changing the toolbar semantics.
 */
export declare function CadToolPalette({ groups, items, label, layout, className, ...props }: CadAnyProps): React.JSX.Element;
/** A controlled/uncontrolled numeric field with CAD-friendly unit and step controls. */
export declare function CadNumericInput({ id, label, value, defaultValue, onValueChange, onChange, min, max, step, unit, prefix, suffix, asNumber, disabled, readOnly, showSteppers, className, inputClassName, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadUnitInput({ unit, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadAngleInput({ unit, ...props }: CadAnyProps): React.JSX.Element;
/** A three-axis numeric editor for point, displacement and scale values. */
export declare function CadCoordinateInput({ value, defaultValue, onValueChange, onChange, axes, unit, label, className, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadColorSwatch({ color, label, size, onClick, className, style, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadLinetypePreview({ type, color, label, className }: CadAnyProps): React.JSX.Element;
export declare function CadLineweightPreview({ weight, color, label, className }: CadAnyProps): React.JSX.Element;
export declare function CadMenuSeparator({ className }: CadAnyProps): React.JSX.Element;
export declare function CadMenuItem({ item, label, detail, shortcut, icon: Icon, checked, disabled, type, tone, onClick, className }: CadAnyProps): React.JSX.Element;
/** Keyboard-friendly menu primitive. Escape calls `onClose`; arrows wrap through items. */
export declare function CadMenu({ items, label, onAction, onClose, className, children, menuRef: externalMenuRef, ...props }: CadAnyProps): React.JSX.Element;
/**
 * A controlled, pointer-positioned menu for viewport and canvas actions.
 * Dismissal restores the supplied focus target, while command activation does
 * not, so a command is free to move focus into a dialog or prompt.
 */
export declare function CadContextMenuPopup({ open, position, items, label, onAction, onClose, restoreFocusRef, returnFocusRef, className, style, children, menuRef: externalMenuRef, onContextMenu, ...props }: CadAnyProps): React.JSX.Element;
/**
 * A controlled, pointer-positioned radial menu for a small set of contextual
 * CAD actions. `position` describes the centre of the menu, so it can be
 * anchored directly at a pointer, grip, or selection centroid.
 *
 * Escape and outside presses dismiss the menu and return focus to the
 * supplied trigger. Activating an action intentionally does not restore
 * focus: commands may instead move focus to a prompt or dialog.
 */
export declare function CadRadialMenu({ open, position, items, label, centerLabel, onAction, onClose, restoreFocusRef, returnFocusRef, className, style, children, menuRef: externalMenuRef, onKeyDown, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadOverflowMenu({ items, label, open, defaultOpen, onOpenChange, onAction, className, triggerLabel, ...props }: CadAnyProps): React.JSX.Element;
