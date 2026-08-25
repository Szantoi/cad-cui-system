import type { CadAnyProps } from './cad-types.js';
import React from 'react';
/**
 * A host-positioned viewport overlay with an explicit, ribbed drag tab.
 *
 * `position` is a pixel translation from the host's own anchor. The overlay
 * clamps itself to its immediate parent when that parent has measurable bounds;
 * this lets a host keep a useful default placement in CSS while still making
 * the surface movable and safe after the viewport is resized. `handleIcon`
 * is decorative; retain a descriptive `label` for the accessible grip name.
 */
export declare function CadMovableOverlay({ position, defaultPosition, onPositionChange, collapsed, defaultCollapsed, onCollapsedChange, onDragStart, onDragEnd, edge, moveStep, label, handleLabel, handleIcon, className, children, style, 'aria-label': ariaLabel, ...props }: CadAnyProps): React.JSX.Element;
/**
 * Accessible modal shell for CAD settings, block insertion and destructive
 * actions. The host keeps ownership of `open` and action side effects.
 */
export declare function CadDialog({ open, onClose, title, description, actions, tone, closeOnBackdrop, closeOnEscape, className, children, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadConfirmDialog({ open, title, description, confirmLabel, cancelLabel, destructive, onConfirm, onCancel, children, className, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadToast({ toast, onDismiss, className }: CadAnyProps): React.JSX.Element;
/** A host-managed toast stack. Supply immutable toast items and dismiss them in the callback. */
export declare function CadToastStack({ toasts, onDismiss, placement, label, className, ...props }: CadAnyProps): React.JSX.Element;
/** Lightweight popover with a composable trigger, useful for quick CAD selectors. */
export declare function CadPopover({ trigger, content, open, defaultOpen, onOpenChange, placement, label, contentRole, closeOnOutside, closeOnEscape, closeOnFocusOutside, closeOnPointerLeave, restoreFocus, focusOnOpen, className, contentClassName, onKeyDown, onBlur, onPointerLeave, ...props }: CadAnyProps): React.JSX.Element;
/** Tooltip that supports both pointer and keyboard focus without native title text. */
export declare function CadTooltip({ content, placement, className, children }: CadAnyProps): any;
/** Searchable, keyboard-first shortcut reference for a CAD workspace. */
export declare function CadShortcutReference({ shortcuts, title, onClose, className, ...props }: CadAnyProps): React.JSX.Element;
/** Small prompt overlay for command options that require one typed response. */
export declare function CadCommandPrompt({ open, label, prompt, value, defaultValue, onChange, onSubmit, onCancel, placeholder, submitLabel, className, ...props }: CadAnyProps): React.JSX.Element;
