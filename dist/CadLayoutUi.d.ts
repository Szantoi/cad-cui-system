import type { CadAnyProps } from './cad-types.js';
import React from 'react';
/**
 * Engine-independent resizable panel split. `size` is the primary pane's
 * percentage; the semantic separator is keyboard-operable as well as draggable.
 */
export declare function CadSplitPane({ orientation, size, defaultSize, minSize, maxSize, keyboardStep, primary, secondary, onSizeChange, onResizeStart, onResizeEnd, separatorLabel, className, ...props }: CadAnyProps): React.JSX.Element;
/** Nested menu entry used inside `CadMenuBar`. */
export declare function CadSubmenu({ item, onAction, onClose, className }: CadAnyProps): React.JSX.Element;
/** Top-level menu bar with composable nested menus; it complements `CadMenu`. */
export declare function CadMenuBar({ items, openId, defaultOpenId, onOpenChange, onAction, label, endSlot, endSlotLabel, className, ...props }: CadAnyProps): React.JSX.Element;
/** CAD color palette with explicit ByLayer / ByBlock / RGB models. */
export declare function CadColorPicker({ value, defaultValue, onChange, colors, allowByLayer, allowByBlock, label, className, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadColorPickerButton({ value, onChange, label, className, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadLinetypePicker({ linetypes, value, defaultValue, onChange, label, className, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadLineweightPicker({ lineweights, value, defaultValue, onChange, label, className, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadBlockTile({ block, selected, onSelect, onInsert, onEdit, onDelete, renderThumbnail, className }: CadAnyProps): React.JSX.Element;
export declare function CadBlockPalette({ blocks, value, defaultValue, onChange, onInsert, onCreate, onEdit, onDelete, filter, defaultFilter, onFilterChange, view, renderThumbnail, title, className, emptyLabel }: CadAnyProps): React.JSX.Element;
export declare function CadBlockInsertOptions({ value, defaultValue, onChange, label, className }: CadAnyProps): React.JSX.Element;
