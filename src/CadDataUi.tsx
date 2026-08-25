import type { CadAnyProps } from './cad-types';
import React, { useMemo } from 'react';
import { CadPropertyGrid } from './CadInspectorUi';
import { asArray, cx, itemLabel, useControllableState } from './cadUiUtils';

const resolveCell = (row, column) => {
  if (typeof column?.render === 'function') return column.render(row, column);
  if (typeof column?.accessor === 'function') return column.accessor(row, column);
  return row?.[column?.accessor || column?.id];
};

const resolveSortValue = (row, column) => {
  const value = typeof column?.sortValue === 'function' ? column.sortValue(row, column) : resolveCell(row, column);
  return typeof value === 'string' ? value.toLocaleLowerCase() : value;
};

/**
 * A compact semantic table for layer states, block attributes and extraction
 * results. It intentionally remains a table rather than claiming full ARIA
 * grid keyboard semantics.
 */
export function CadDataGrid({ columns = [], rows = [], rowId = row => row?.id, selectedIds, defaultSelectedIds = [], onSelectionChange, selectionMode = 'multiple', onRowActivate, sort, defaultSort, onSortChange, caption = 'CAD data', emptyLabel = 'No rows to display', layout = 'table', className, ...props }: CadAnyProps) {
  const normalizedColumns = useMemo(() => asArray(columns).filter(column => column?.id), [columns]);
  const [currentSelectedIds, setSelectedIds] = useControllableState(selectedIds, defaultSelectedIds, (nextValue, row, event) => onSelectionChange?.(nextValue, row, event));
  const [currentSort, setSort] = useControllableState(sort, defaultSort, (nextValue, column, event) => onSortChange?.(nextValue, column, event));
  const selected = new Set(asArray(currentSelectedIds));
  const resolvedLayout = layout === 'auto' || layout === 'cards' ? layout : 'table';
  const displayRows = useMemo(() => {
    const nextRows = [...asArray(rows)];
    const column = normalizedColumns.find(item => item.id === currentSort?.columnId);
    if (!column || !currentSort?.direction) return nextRows;
    const direction = currentSort.direction === 'desc' ? -1 : 1;
    return nextRows.sort((first, second) => String(resolveSortValue(first, column) ?? '').localeCompare(String(resolveSortValue(second, column) ?? ''), undefined, { numeric: true }) * direction);
  }, [currentSort, normalizedColumns, rows]);
  const toggleSelection = (row, event) => {
    if (selectionMode === 'none') return;
    const id = typeof rowId === 'function' ? rowId(row) : row?.[rowId];
    const next = selectionMode === 'single'
      ? selected.has(id) ? [] : [id]
      : selected.has(id) ? [...selected].filter(value => value !== id) : [...selected, id];
    setSelectedIds(next, row, event);
  };
  const toggleSort = (column, event) => {
    if (!column.sortable) return;
    const nextDirection = currentSort?.columnId === column.id && currentSort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ columnId: column.id, direction: nextDirection }, column, event);
  };
  const allSelected = displayRows.length > 0 && displayRows.every(row => selected.has(typeof rowId === 'function' ? rowId(row) : row?.[rowId]));
  return <div {...props} className={cx('cad-data-grid', className)} data-layout={resolvedLayout}>
    <table>
      <caption>{caption}</caption>
      <thead><tr>{selectionMode !== 'none' && <th scope="col" className="cad-data-grid__selection">{selectionMode === 'multiple' && <input type="checkbox" aria-label="Select all rows" checked={allSelected} onChange={event => { const next = event.target.checked ? displayRows.map(row => typeof rowId === 'function' ? rowId(row) : row?.[rowId]) : []; setSelectedIds(next, null, event); }} />}</th>}{normalizedColumns.map(column => <th key={column.id} scope="col" style={column.width ? { width: column.width } : undefined} aria-sort={currentSort?.columnId === column.id ? currentSort.direction === 'desc' ? 'descending' : 'ascending' : undefined}>{column.sortable ? <button type="button" onClick={event => toggleSort(column, event)}>{column.label || column.id}<span aria-hidden="true">{currentSort?.columnId === column.id ? currentSort.direction === 'desc' ? '↓' : '↑' : '↕'}</span></button> : column.label || column.id}</th>)}</tr></thead>
      <tbody>{displayRows.map((row, index) => { const id = typeof rowId === 'function' ? rowId(row) : row?.[rowId]; const isSelected = selected.has(id); return <tr key={id || index} data-selected={isSelected ? 'true' : 'false'} onDoubleClick={event => onRowActivate?.(row, event)}>{selectionMode !== 'none' && <td className="cad-data-grid__selection" data-column="Select"><input type={selectionMode === 'single' ? 'radio' : 'checkbox'} aria-label={`Select ${itemLabel(row) || id || index + 1}`} checked={isSelected} onChange={event => toggleSelection(row, event)} /></td>}{normalizedColumns.map(column => <td key={column.id} data-align={column.align || 'start'} data-column={column.label || column.id}>{resolveCell(row, column) ?? '—'}</td>)}</tr>; })}{!displayRows.length && <tr><td colSpan={normalizedColumns.length + (selectionMode !== 'none' ? 1 : 0)} className="cad-data-grid__empty">{emptyLabel}</td></tr>}</tbody>
    </table>
  </div>;
}

/** Entity-type switches for crowded drawings and selection refinement. */
export function CadSelectionFilter({ filters = [], activeIds, defaultActiveIds = [], onChange, label = 'Selection filter', className, ...props }: CadAnyProps) {
  const [currentActiveIds, setActiveIds] = useControllableState(activeIds, defaultActiveIds, (nextValue, filter, event) => onChange?.(nextValue, filter, event));
  const selected = new Set(asArray(currentActiveIds));
  return <section {...props} className={cx('cad-selection-filter', className)} aria-label={label}>
    <header><strong>{label}</strong><output>{selected.size}/{asArray(filters).length}</output></header>
    <div role="group" aria-label={label}>{asArray(filters).map((filter, index) => { const id = filter?.id || `${itemLabel(filter)}-${index}`; const active = selected.has(id); const Icon = filter?.icon; return <button key={id} type="button" aria-pressed={active} data-active={active ? 'true' : 'false'} disabled={filter?.disabled} onClick={event => { const next = active ? [...selected].filter(value => value !== id) : [...selected, id]; setActiveIds(next, { ...filter, id }, event); }}>{Icon && <Icon size={12} aria-hidden="true" />}<span>{itemLabel(filter)}</span>{filter?.count !== undefined && <em>{filter.count}</em>}</button>; })}</div>
  </section>;
}

/** Cycle through coincident/selectable objects while keeping geometry ownership in the host. */
export function CadSelectionCycler({ candidates = [], activeId, defaultActiveId, onChange, onAccept, onCancel, label = 'Selection cycle', layout = 'strip', className, ...props }: CadAnyProps) {
  const normalizedCandidates = useMemo(() => asArray(candidates).map((candidate, index) => ({ ...candidate, id: candidate?.id || `${itemLabel(candidate)}-${index}` })), [candidates]);
  const initialActiveId = defaultActiveId ?? normalizedCandidates[0]?.id ?? '';
  const [currentActiveId, setActiveId] = useControllableState(activeId, initialActiveId, (nextValue, candidate, event) => onChange?.(nextValue, candidate, event));
  const currentIndex = Math.max(0, normalizedCandidates.findIndex(candidate => candidate.id === currentActiveId));
  const current = normalizedCandidates[currentIndex];
  const cycle = (direction, event) => {
    if (!normalizedCandidates.length) return;
    const next = normalizedCandidates[(currentIndex + direction + normalizedCandidates.length) % normalizedCandidates.length];
    setActiveId(next.id, next, event);
  };
  if (!normalizedCandidates.length) return null;
  return <aside {...props} className={cx('cad-selection-cycler', className)} data-layout={layout === 'auto' || layout === 'tiles' ? layout : 'strip'} aria-label={label}>
    <button type="button" aria-label="Previous candidate" onClick={event => cycle(-1, event)}>‹</button>
    <output><small>{currentIndex + 1} / {normalizedCandidates.length}</small><strong>{itemLabel(current)}</strong>{current?.detail && <span>{current.detail}</span>}</output>
    <button type="button" aria-label="Next candidate" onClick={event => cycle(1, event)}>›</button>
    {onAccept && <button type="button" className="cad-selection-cycler__accept" onClick={event => onAccept(current, event)}>Select</button>}
    {onCancel && <button type="button" className="cad-selection-cycler__cancel" aria-label="Cancel selection cycle" onClick={onCancel}>×</button>}
  </aside>;
}

/** A compact, context-sensitive property palette for the current selection. */
export function CadQuickProperties({ title = 'Quick properties', properties, sections, onValueChange, onPinChange, pinned = false, onClose, className, ...props }: CadAnyProps) {
  return <aside {...props} className={cx('cad-quick-properties', className)} aria-label={title}>
    <header><h2>{title}</h2><span>{onPinChange && <button type="button" aria-label={`${pinned ? 'Unpin' : 'Pin'} ${title}`} aria-pressed={pinned} onClick={event => onPinChange(!pinned, event)}>⌖</button>}{onClose && <button type="button" aria-label={`Close ${title}`} onClick={onClose}>×</button>}</span></header>
    <CadPropertyGrid properties={properties} sections={sections} onValueChange={onValueChange} label={title} />
  </aside>;
}
