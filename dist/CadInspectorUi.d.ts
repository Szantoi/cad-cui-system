import type { CadAnyProps } from './cad-types.js';
import React from 'react';
export declare function CadFilterBar({ value, defaultValue, onChange, placeholder, label, className, ...props }: CadAnyProps): React.JSX.Element;
/** Renders a standard CAD property editor from a compact field declaration. */
export declare function CadPropertyField({ property, value, onValueChange, inputId, className }: CadAnyProps): React.JSX.Element;
export declare function CadPropertyRow({ property, value, onValueChange, className }: CadAnyProps): React.JSX.Element;
export declare function CadPropertySection({ id, title, properties, collapsible, open, defaultOpen, onOpenChange, onValueChange, className, children }: CadAnyProps): React.JSX.Element;
/** Sectioned inspector grid. It owns only disclosure state, never CAD data. */
export declare function CadPropertyGrid({ sections, properties, onValueChange, label, className, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadLayerPicker({ layers, value, defaultValue, onChange, label, className, disabled }: CadAnyProps): React.JSX.Element;
export declare function CadLayerRow({ layer, active, onActivate, onLayerChange, onColorClick, className }: CadAnyProps): React.JSX.Element;
export declare function CadLayerPanel({ layers, activeLayerId, onActiveLayerChange, onLayerChange, onAddLayer, onDeleteLayer, onColorClick, title, filter, defaultFilter, onFilterChange, filterable, className, emptyLabel }: CadAnyProps): React.JSX.Element;
/** Model browser / block explorer tree with controlled selection and expansion. */
export declare function CadObjectTree({ nodes, selectedId, defaultSelectedId, onSelect, expandedIds, defaultExpandedIds, onExpandedChange, label, className, ...props }: CadAnyProps): React.JSX.Element;
export declare function CadTaskProgress({ label, value, status, onCancel, className }: CadAnyProps): React.JSX.Element;
export declare function CadReferenceList({ references, onReload, onUnload, className, title }: CadAnyProps): React.JSX.Element;
