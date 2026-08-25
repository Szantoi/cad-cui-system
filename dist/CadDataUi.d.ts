import type { CadAnyProps } from './cad-types.js';
import React from 'react';
/**
 * A compact semantic table for layer states, block attributes and extraction
 * results. It intentionally remains a table rather than claiming full ARIA
 * grid keyboard semantics.
 */
export declare function CadDataGrid({ columns, rows, rowId, selectedIds, defaultSelectedIds, onSelectionChange, selectionMode, onRowActivate, sort, defaultSort, onSortChange, caption, emptyLabel, layout, className, ...props }: CadAnyProps): React.JSX.Element;
/** Entity-type switches for crowded drawings and selection refinement. */
export declare function CadSelectionFilter({ filters, activeIds, defaultActiveIds, onChange, label, className, ...props }: CadAnyProps): React.JSX.Element;
/** Cycle through coincident/selectable objects while keeping geometry ownership in the host. */
export declare function CadSelectionCycler({ candidates, activeId, defaultActiveId, onChange, onAccept, onCancel, label, layout, className, ...props }: CadAnyProps): React.JSX.Element;
/** A compact, context-sensitive property palette for the current selection. */
export declare function CadQuickProperties({ title, properties, sections, onValueChange, onPinChange, pinned, onClose, className, ...props }: CadAnyProps): React.JSX.Element;
