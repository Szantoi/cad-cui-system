import type { CadAnyProps } from './cad-types';
import React, { useId, useMemo } from 'react';
import { asArray, cx, itemLabel, useControllableState } from './cadUiUtils';

const DEFAULT_NAVIGATION_ACTIONS = Object.freeze([
  Object.freeze({ id: 'pan', label: 'Pan', glyph: '✥', shortcut: 'P', mode: true }),
  Object.freeze({ id: 'zoom-in', label: 'Zoom in', glyph: '+', shortcut: '+' }),
  Object.freeze({ id: 'zoom-out', label: 'Zoom out', glyph: '−', shortcut: '−' }),
  Object.freeze({ id: 'zoom-window', label: 'Zoom window', glyph: '⌗', shortcut: 'W' }),
  Object.freeze({ id: 'zoom-extents', label: 'Zoom extents', glyph: '⤢', shortcut: 'E' }),
  Object.freeze({ id: 'orbit', label: 'Orbit', glyph: '◌', shortcut: 'Shift+Middle', mode: true }),
  Object.freeze({ id: 'home', label: 'Home view', glyph: '⌂', shortcut: 'Home' })
]);

const DEFAULT_VISUAL_STYLES = Object.freeze([
  Object.freeze({ id: '2d-wireframe', label: '2D Wireframe' }),
  Object.freeze({ id: 'hidden', label: 'Hidden' }),
  Object.freeze({ id: 'conceptual', label: 'Conceptual' }),
  Object.freeze({ id: 'realistic', label: 'Realistic' }),
  Object.freeze({ id: 'shaded', label: 'Shaded' }),
  Object.freeze({ id: 'shaded-with-edges', label: 'Shaded with edges' }),
  Object.freeze({ id: 'x-ray', label: 'X-ray' })
]);

const DEFAULT_VIEWPORT_SCALES = Object.freeze([
  Object.freeze({ id: '1:1', label: '1:1' }),
  Object.freeze({ id: '1:2', label: '1:2' }),
  Object.freeze({ id: '1:4', label: '1:4' }),
  Object.freeze({ id: '1:5', label: '1:5' }),
  Object.freeze({ id: '1:10', label: '1:10' }),
  Object.freeze({ id: '1:20', label: '1:20' }),
  Object.freeze({ id: '1:25', label: '1:25' }),
  Object.freeze({ id: '1:50', label: '1:50' }),
  Object.freeze({ id: '1:100', label: '1:100' })
]);

const normalizeItems = (items, prefix) => asArray(items).map((item, index) => {
  if (typeof item === 'string' || typeof item === 'number') {
    return { id: String(item), label: String(item) };
  }
  const label = itemLabel(item) || `${prefix} ${index + 1}`;
  return { ...item, id: item?.id ?? `${prefix}-${index + 1}`, label };
});

const firstEnabledId = items => asArray(items).find(item => !item?.disabled)?.id ?? '';

const navigationCallback = (id, callbacks, action, event) => {
  const handlerById = {
    pan: callbacks.onPan,
    'zoom-in': callbacks.onZoomIn,
    'zoom-out': callbacks.onZoomOut,
    'zoom-window': callbacks.onZoomWindow,
    'zoom-extents': callbacks.onZoomExtents,
    orbit: callbacks.onOrbit,
    home: callbacks.onHome
  };
  if (id.startsWith('zoom')) callbacks.onZoom?.(action, event);
  handlerById[id]?.(action, event);
};

/**
 * A compact engine-independent navigation toolbar. Mode actions (Pan and
 * Orbit by default) have controlled/uncontrolled active state; command
 * actions simply report their invocation back to the host.
 */
export function CadNavigationBar({
  actions = DEFAULT_NAVIGATION_ACTIONS,
  activeId,
  defaultActiveId = '',
  onActiveChange,
  onChange,
  onAction,
  onPan,
  onZoom,
  onZoomIn,
  onZoomOut,
  onZoomWindow,
  onZoomExtents,
  onOrbit,
  onHome,
  label = 'Viewport navigation',
  orientation = 'vertical',
  className,
  ...props
}: CadAnyProps) {
  const normalizedActions = useMemo(() => normalizeItems(actions, 'navigation-action'), [actions]);
  const [currentActiveId, setActiveId] = useControllableState(activeId, defaultActiveId, (nextValue, action, event) => {
    onActiveChange?.(nextValue, action, event);
    onChange?.(nextValue, action, event);
  });

  const activate = (action, event) => {
    if (action.disabled) return;
    const isMode = action.toggle ?? action.mode ?? false;
    if (isMode) setActiveId(currentActiveId === action.id ? '' : action.id, action, event);
    action.onClick?.(action, event);
    onAction?.(action, event);
    navigationCallback(action.id, { onPan, onZoom, onZoomIn, onZoomOut, onZoomWindow, onZoomExtents, onOrbit, onHome }, action, event);
  };

  return <nav {...props} className={cx('cad-navigation-bar', `cad-navigation-bar--${orientation}`, className)} aria-label={label}>
    <div className="cad-navigation-bar__tools" role="toolbar" aria-label={label} aria-orientation={orientation}>
      {normalizedActions.map((action, index) => {
        if (action.type === 'separator') return <span key={action.id || index} className="cad-navigation-bar__separator" role="separator" aria-orientation={orientation === 'vertical' ? 'horizontal' : 'vertical'} />;
        const Icon = action.icon;
        const isMode = action.toggle ?? action.mode ?? false;
        const isActive = isMode && currentActiveId === action.id;
        const actionLabel = itemLabel(action);
        return <button
          key={action.id}
          type="button"
          className="cad-navigation-bar__action"
          data-action={action.id}
          data-active={isActive ? 'true' : 'false'}
          aria-label={action.ariaLabel || actionLabel}
          aria-pressed={isMode ? isActive : undefined}
          aria-keyshortcuts={action.ariaKeyShortcuts || undefined}
          disabled={action.disabled}
          title={action.title || [actionLabel, action.shortcut].filter(Boolean).join(' · ')}
          onClick={event => activate(action, event)}
        >
          {typeof Icon === 'function'
            ? <Icon size={14} aria-hidden="true" />
            : <span className="cad-navigation-bar__glyph" aria-hidden="true">{Icon || action.glyph || '•'}</span>}
          <span className="cad-navigation-bar__label">{actionLabel}</span>
        </button>;
      })}
    </div>
  </nav>;
}

/** A native, labelled selector for a visual/viewport rendering style. */
export function CadVisualStylePicker({
  styles = DEFAULT_VISUAL_STYLES,
  value,
  defaultValue,
  onChange,
  onStyleChange,
  label = 'Visual style',
  id,
  selectProps = {},
  disabled = false,
  className,
  ...props
}: CadAnyProps) {
  const generatedId = useId();
  const selectId = id || `cad-visual-style-${generatedId}`;
  const options = useMemo(() => normalizeItems(styles, 'visual-style'), [styles]);
  const initialValue = defaultValue ?? options[0]?.id ?? '';
  const [selectedId, setSelectedId] = useControllableState(value, initialValue, (nextValue, style, event) => {
    onChange?.(nextValue, style, event);
    onStyleChange?.(nextValue, style, event);
  });
  const selected = options.find(option => option.id === selectedId) || options[0];

  return <div {...props} className={cx('cad-visual-style-picker', className)} data-visual-style={selected?.id || ''}>
    <label htmlFor={selectId}>{label}</label>
    <span className="cad-visual-style-picker__control">
      <span className="cad-visual-style-picker__preview" data-style={selected?.id || ''} aria-hidden="true" />
      <select
        {...selectProps}
        id={selectId}
        value={selectedId ?? ''}
        disabled={disabled || selectProps.disabled}
        onChange={event => {
          const style = options.find(option => option.id === event.target.value);
          setSelectedId(event.target.value, style, event);
          selectProps.onChange?.(event);
        }}
      >
        {options.map(style => <option key={style.id} value={style.id} disabled={style.disabled}>{style.label}</option>)}
      </select>
    </span>
  </div>;
}

/** A native, labelled paper-space viewport scale selector. */
export function CadViewportScalePicker({
  scales = DEFAULT_VIEWPORT_SCALES,
  value,
  defaultValue,
  onChange,
  onScaleChange,
  onManage,
  manageLabel = 'Manage',
  label = 'Viewport scale',
  id,
  selectProps = {},
  disabled = false,
  className,
  ...props
}: CadAnyProps) {
  const generatedId = useId();
  const selectId = id || `cad-viewport-scale-${generatedId}`;
  const options = useMemo(() => normalizeItems(scales, 'viewport-scale'), [scales]);
  const initialValue = defaultValue ?? options[0]?.id ?? '';
  const [selectedId, setSelectedId] = useControllableState(value, initialValue, (nextValue, scale, event) => {
    onChange?.(nextValue, scale, event);
    onScaleChange?.(nextValue, scale, event);
  });
  const selected = options.find(option => option.id === selectedId) || options[0];

  return <div {...props} className={cx('cad-viewport-scale-picker', className)} data-scale={selected?.id || ''}>
    <label htmlFor={selectId}>{label}</label>
    <span className="cad-viewport-scale-picker__control">
      <select
        {...selectProps}
        id={selectId}
        value={selectedId ?? ''}
        disabled={disabled || selectProps.disabled}
        onChange={event => {
          const scale = options.find(option => option.id === event.target.value);
          setSelectedId(event.target.value, scale, event);
          selectProps.onChange?.(event);
        }}
      >
        {options.map(scale => <option key={scale.id} value={scale.id} disabled={scale.disabled}>{scale.label}</option>)}
      </select>
      {onManage && <button type="button" disabled={disabled || selectProps.disabled} onClick={event => onManage(selected, event)}>{manageLabel}</button>}
    </span>
  </div>;
}

/**
 * A host-owned catalogue of named selection sets. This component never
 * creates, deletes or applies CAD selections itself: callbacks receive the
 * relevant serializable set record and let the host own that work.
 */
export function CadSelectionSetPanel({
  sets = [],
  activeId,
  defaultActiveId,
  onChange,
  onApply,
  onCreate,
  onRename,
  onDelete,
  filter,
  defaultFilter = '',
  onFilterChange,
  showFilter = true,
  title = 'Selection sets',
  filterLabel = 'Filter selection sets',
  emptyLabel = 'No selection sets match the current filter',
  createLabel = 'New',
  applyLabel = 'Select',
  renameLabel = 'Rename',
  deleteLabel = 'Delete',
  className,
  children,
  ...props
}: CadAnyProps) {
  const generatedId = useId();
  const filterId = `cad-selection-set-filter-${generatedId}`;
  const normalizedSets = useMemo(() => normalizeItems(sets, 'selection-set'), [sets]);
  const initialActiveId = defaultActiveId ?? firstEnabledId(normalizedSets);
  const [selectedId, setSelectedId] = useControllableState(activeId, initialActiveId, (nextValue, selectionSet, event) => onChange?.(nextValue, selectionSet, event));
  const [query, setQuery] = useControllableState(filter, defaultFilter, (nextValue, event) => onFilterChange?.(nextValue, event));
  const activeSet = normalizedSets.find(selectionSet => selectionSet.id === selectedId);
  const visibleSets = useMemo(() => {
    const normalizedQuery = String(query || '').trim().toLocaleLowerCase();
    if (!normalizedQuery) return normalizedSets;
    return normalizedSets.filter(selectionSet => [
      itemLabel(selectionSet),
      selectionSet.description,
      selectionSet.group
    ].filter(Boolean).join(' ').toLocaleLowerCase().includes(normalizedQuery));
  }, [normalizedSets, query]);
  const activeSetIsProtected = Boolean(activeSet?.disabled || activeSet?.locked || activeSet?.protected || activeSet?.system);

  return <section {...props} className={cx('cad-selection-set-panel', className)} aria-label={title}>
    <header className="cad-selection-set-panel__header">
      <span><h2>{title}</h2><output aria-label={`${normalizedSets.length} selection sets`}>{normalizedSets.length}</output></span>
      {onCreate && <button type="button" className="cad-selection-set-panel__create" onClick={event => onCreate(event)}>{createLabel}</button>}
    </header>
    {showFilter && <div className="cad-selection-set-panel__filter">
      <label htmlFor={filterId}>{filterLabel}</label>
      <input id={filterId} type="search" value={query ?? ''} onChange={event => setQuery(event.target.value, event)} />
      {query && <button type="button" aria-label="Clear selection set filter" onClick={event => setQuery('', event)}>×</button>}
    </div>}
    <ul className="cad-selection-set-panel__list">
      {visibleSets.map(selectionSet => {
        const selected = selectionSet.id === selectedId;
        const count = selectionSet.count ?? selectionSet.entityCount;
        const countLabel = selectionSet.countLabel || `${count} objects`;
        return <li key={selectionSet.id} data-selected={selected ? 'true' : 'false'}>
          <button
            type="button"
            className="cad-selection-set-panel__set"
            aria-label={selectionSet.ariaLabel || itemLabel(selectionSet)}
            aria-pressed={selected}
            aria-current={selected ? 'true' : undefined}
            disabled={selectionSet.disabled}
            onClick={event => setSelectedId(selectionSet.id, selectionSet, event)}
          >
            <span className="cad-selection-set-panel__set-name">{itemLabel(selectionSet)}</span>
            {selectionSet.description && <small>{selectionSet.description}</small>}
            {selectionSet.group && <em>{selectionSet.group}</em>}
          </button>
          {count !== undefined && <output aria-label={`${itemLabel(selectionSet)}: ${countLabel}`}>{count}</output>}
        </li>;
      })}
    </ul>
    {!visibleSets.length && <p className="cad-selection-set-panel__empty" role="status">{emptyLabel}</p>}
    {(onApply || onRename || onDelete || children) && <footer className="cad-selection-set-panel__actions" role="group" aria-label={`${title} actions`}>
      {onApply && <button type="button" disabled={!activeSet || activeSet.disabled} onClick={event => onApply(activeSet, event)}>{applyLabel}</button>}
      {onRename && <button type="button" disabled={!activeSet || activeSetIsProtected} onClick={event => onRename(activeSet, event)}>{renameLabel}</button>}
      {onDelete && <button type="button" disabled={!activeSet || activeSetIsProtected} onClick={event => onDelete(activeSet, event)}>{deleteLabel}</button>}
      {children}
    </footer>}
  </section>;
}
