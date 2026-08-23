import React, { useEffect, useId, useMemo, useRef } from 'react';
import { CadColorSwatch, CadLineweightPreview, CadLinetypePreview, CadShortcutHint } from './CadCommandUi.jsx';
import { CadPopover } from './CadOverlayUi.jsx';
import { asArray, clamp, cx, itemLabel, useControllableState } from './cadUiUtils.js';

const DEFAULT_COLORS = Object.freeze([
  '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffffff', '#9a9a9a',
  '#7f0000', '#7f7f00', '#007f00', '#007f7f', '#00007f', '#7f007f', '#d0d0d0', '#444444',
  '#ff7f7f', '#ffff7f', '#7fff7f', '#7fffff', '#7f7fff', '#ff7fff', '#ffffff', '#202020'
]);

const DEFAULT_LINETYPES = Object.freeze([
  { id: 'continuous', label: 'Continuous' }, { id: 'dashed', label: 'Dashed' },
  { id: 'dotted', label: 'Dotted' }, { id: 'dashdot', label: 'Dash dot' }
]);

const DEFAULT_LINEWEIGHTS = Object.freeze([
  { id: 'default', label: 'Default', value: 0.13 }, { id: '0.18', label: '0.18 mm', value: 0.18 },
  { id: '0.25', label: '0.25 mm', value: 0.25 }, { id: '0.35', label: '0.35 mm', value: 0.35 },
  { id: '0.50', label: '0.50 mm', value: 0.5 }, { id: '0.70', label: '0.70 mm', value: 0.7 }, { id: '1.00', label: '1.00 mm', value: 1 }
]);

const normalizeItems = items => asArray(items).map((item, index) => typeof item === 'string' || typeof item === 'number'
  ? { id: String(item), label: String(item), value: item }
  : { ...item, id: item?.id || `${itemLabel(item)}-${index}`, label: itemLabel(item) });

const normalizeColor = value => {
  if (typeof value === 'string') return { mode: 'rgb', value };
  if (!value || typeof value !== 'object') return { mode: 'by-layer' };
  return { ...value, mode: value.mode || 'rgb', value: value.value || value.hex };
};

const colorLabel = color => {
  const item = normalizeColor(color);
  if (item.mode === 'by-layer') return 'ByLayer';
  if (item.mode === 'by-block') return 'ByBlock';
  return item.value || item.hex || 'Color';
};

/**
 * Engine-independent resizable panel split. `size` is the primary pane's
 * percentage; the semantic separator is keyboard-operable as well as draggable.
 */
export function CadSplitPane({ orientation = 'horizontal', size, defaultSize = 30, minSize = 12, maxSize = 88, keyboardStep = 5, primary, secondary, onSizeChange, onResizeStart, onResizeEnd, separatorLabel = 'Resize panels', className, ...props }) {
  const rootRef = useRef(null);
  const dragRef = useRef(null);
  const latestSizeRef = useRef(defaultSize);
  const setSizeRef = useRef(null);
  const onResizeEndRef = useRef(onResizeEnd);
  const moveHandlerRef = useRef(null);
  const endHandlerRef = useRef(null);
  const removeListenersRef = useRef(null);
  const parsedMinSize = Number(minSize);
  const parsedMaxSize = Number(maxSize);
  const resolvedMinSize = Number.isFinite(parsedMinSize) ? parsedMinSize : 0;
  const resolvedMaxSize = Math.max(resolvedMinSize, Number.isFinite(parsedMaxSize) ? parsedMaxSize : 100);
  const parsedDefaultSize = Number(defaultSize);
  const fallbackSize = clamp(Number.isFinite(parsedDefaultSize) ? parsedDefaultSize : resolvedMinSize, resolvedMinSize, resolvedMaxSize);
  const parsedKeyboardStep = Number(keyboardStep);
  const resolvedKeyboardStep = Number.isFinite(parsedKeyboardStep) && parsedKeyboardStep > 0 ? parsedKeyboardStep : 5;
  const [currentSize, setSize] = useControllableState(size, defaultSize, (nextValue, meta, event) => onSizeChange?.(nextValue, meta, event));
  const parsedCurrentSize = Number(currentSize);
  const normalizedSize = clamp(Number.isFinite(parsedCurrentSize) ? parsedCurrentSize : fallbackSize, resolvedMinSize, resolvedMaxSize);
  const axis = orientation === 'vertical' ? 'y' : 'x';
  const separatorOrientation = orientation === 'vertical' ? 'horizontal' : 'vertical';
  latestSizeRef.current = normalizedSize;
  setSizeRef.current = setSize;
  onResizeEndRef.current = onResizeEnd;
  if (!removeListenersRef.current) removeListenersRef.current = () => {
    if (typeof window === 'undefined') return;
    window.removeEventListener('pointermove', moveHandlerRef.current);
    window.removeEventListener('pointerup', endHandlerRef.current);
    window.removeEventListener('pointercancel', endHandlerRef.current);
  };
  if (!moveHandlerRef.current) moveHandlerRef.current = event => {
    const drag = dragRef.current;
    const root = rootRef.current;
    if (!drag || !root || (drag.pointerId !== null && event.pointerId !== drag.pointerId)) return;
    const rect = root.getBoundingClientRect();
    const total = drag.orientation === 'vertical' ? rect.height : rect.width;
    const offset = drag.orientation === 'vertical' ? event.clientY - rect.top : event.clientX - rect.left;
    if (!Number.isFinite(total) || total <= 0 || !Number.isFinite(offset)) return;
    const next = clamp(Math.round(((offset / Math.max(total, 1)) * 100) * 10) / 10, drag.minSize, drag.maxSize);
    latestSizeRef.current = next;
    setSizeRef.current?.(next, { source: 'pointer', axis: drag.axis }, event);
  };
  if (!endHandlerRef.current) endHandlerRef.current = event => {
    const drag = dragRef.current;
    if (!drag || (drag.pointerId !== null && event.pointerId !== drag.pointerId)) return;
    dragRef.current = null;
    removeListenersRef.current?.();
    try { if (drag.pointerId !== null) drag.divider?.releasePointerCapture?.(drag.pointerId); } catch { /* Pointer capture may already be released. */ }
    const finalSize = clamp(Number(latestSizeRef.current), drag.minSize, drag.maxSize);
    latestSizeRef.current = finalSize;
    onResizeEndRef.current?.(finalSize, event);
  };
  useEffect(() => () => {
    const drag = dragRef.current;
    dragRef.current = null;
    removeListenersRef.current?.();
    try { if (drag?.pointerId !== null && drag?.pointerId !== undefined) drag.divider?.releasePointerCapture?.(drag.pointerId); } catch { /* Pointer capture may already be released. */ }
  }, []);
  const startDragging = event => {
    if (event.button !== 0 || dragRef.current) return;
    event.preventDefault();
    latestSizeRef.current = normalizedSize;
    dragRef.current = {
      pointerId: event.pointerId ?? null,
      divider: event.currentTarget,
      orientation,
      minSize: resolvedMinSize,
      maxSize: resolvedMaxSize,
      axis
    };
    try { if (event.pointerId !== undefined) event.currentTarget.setPointerCapture?.(event.pointerId); } catch { /* Pointer capture is not available in every host environment. */ }
    onResizeStart?.(normalizedSize, event);
    window.addEventListener('pointermove', moveHandlerRef.current);
    window.addEventListener('pointerup', endHandlerRef.current);
    window.addEventListener('pointercancel', endHandlerRef.current);
  };
  const resizeByKey = (amount, event) => {
    const baseSize = clamp(Number(latestSizeRef.current), resolvedMinSize, resolvedMaxSize);
    const next = clamp(baseSize + amount, resolvedMinSize, resolvedMaxSize);
    latestSizeRef.current = next;
    setSizeRef.current?.(next, { source: 'keyboard', axis }, event);
  };
  const resizeTo = (next, event) => {
    const resolvedSize = clamp(next, resolvedMinSize, resolvedMaxSize);
    latestSizeRef.current = resolvedSize;
    setSizeRef.current?.(resolvedSize, { source: 'keyboard', axis }, event);
  };
  return <section {...props} ref={rootRef} className={cx('cad-split-pane', `cad-split-pane--${orientation}`, className)} style={{ '--cad-split-size': `${normalizedSize}%`, ...props.style }}>
    <div className="cad-split-pane__primary">{primary}</div>
    <div className="cad-split-pane__divider" role="separator" aria-label={separatorLabel} aria-orientation={separatorOrientation} aria-valuemin={resolvedMinSize} aria-valuemax={resolvedMaxSize} aria-valuenow={normalizedSize} aria-valuetext={`${normalizedSize}%`} tabIndex={0} onPointerDown={startDragging} onPointerCancel={endHandlerRef.current} onLostPointerCapture={endHandlerRef.current} onKeyDown={event => {
      const increaseKeys = orientation === 'vertical' ? ['ArrowDown', 'ArrowRight'] : ['ArrowRight', 'ArrowDown'];
      const decreaseKeys = orientation === 'vertical' ? ['ArrowUp', 'ArrowLeft'] : ['ArrowLeft', 'ArrowUp'];
      if (increaseKeys.includes(event.key)) { event.preventDefault(); resizeByKey(resolvedKeyboardStep, event); return; }
      if (decreaseKeys.includes(event.key)) { event.preventDefault(); resizeByKey(-resolvedKeyboardStep, event); return; }
      if (event.key === 'Home') { event.preventDefault(); resizeTo(resolvedMinSize, event); return; }
      if (event.key === 'End') { event.preventDefault(); resizeTo(resolvedMaxSize, event); }
    }}><span aria-hidden="true" /></div>
    <div className="cad-split-pane__secondary">{secondary}</div>
  </section>;
}

function CadMenuBarMenu({ item, open, onToggle, onAction, onClose }) {
  const entries = normalizeItems(item?.items);
  const popupId = `cad-menu-bar-popup-${useId()}`;
  const hasEntries = entries.length > 0;
  return <div className={cx('cad-menu-bar__menu', open && 'cad-menu-bar__menu--open')} data-menu-id={item.id} role="none">
    <button type="button" role="menuitem" data-menu-id={item.id} aria-haspopup={hasEntries ? 'menu' : undefined} aria-expanded={hasEntries ? open : undefined} aria-controls={open ? popupId : undefined} disabled={item?.disabled} onClick={event => { if (hasEntries && !item?.disabled) onToggle(item, event); }}>{itemLabel(item)}{item?.shortcut && <CadShortcutHint shortcut={item.shortcut} />}</button>
    {open && <div id={popupId} className="cad-menu-bar__popup" role="menu" aria-label={itemLabel(item)}>{entries.map(entry => entry.type === 'separator'
      ? <div key={entry.id} className="cad-menu-bar__separator" role="separator" />
      : <CadSubmenu key={entry.id} item={entry} onAction={onAction} onClose={onClose} />)}</div>}
  </div>;
}

/** Nested menu entry used inside `CadMenuBar`. */
export function CadSubmenu({ item, onAction, onClose, className }) {
  const entries = normalizeItems(item?.items);
  const hasChildren = entries.length > 0;
  const [open, setOpen] = useControllableState(undefined, false);
  const select = event => {
    if (item?.disabled) return;
    if (hasChildren) { setOpen(!open, event); return; }
    item?.onClick?.(item, event);
    onAction?.(item, event);
    onClose?.(event);
  };
  return <div className={cx('cad-submenu', open && 'cad-submenu--open', className)} role="none">
    <button type="button" role={item?.checked === undefined ? 'menuitem' : 'menuitemcheckbox'} aria-checked={item?.checked === undefined ? undefined : Boolean(item.checked)} aria-haspopup={hasChildren ? 'menu' : undefined} aria-expanded={hasChildren ? open : undefined} disabled={item?.disabled} data-checked={item?.checked ? 'true' : 'false'} onClick={select}><span className="cad-submenu__check" aria-hidden="true">{item?.checked ? '✓' : ''}</span><span className="cad-submenu__label">{itemLabel(item)}</span>{item?.shortcut && <CadShortcutHint shortcut={item.shortcut} />}{hasChildren && <span className="cad-submenu__caret" aria-hidden="true">›</span>}</button>
    {hasChildren && open && <div className="cad-submenu__popup" role="menu" aria-label={itemLabel(item)}>{entries.map(entry => entry.type === 'separator' ? <div key={entry.id} className="cad-menu-bar__separator" role="separator" /> : <CadSubmenu key={entry.id} item={entry} onAction={onAction} onClose={onClose} />)}</div>}
  </div>;
}

/** Top-level menu bar with composable nested menus; it complements `CadMenu`. */
export function CadMenuBar({ items = [], openId, defaultOpenId = '', onOpenChange, onAction, label = 'CAD application menu', className, ...props }) {
  const normalizedItems = useMemo(() => normalizeItems(items), [items]);
  const [currentOpenId, setOpenId] = useControllableState(openId, defaultOpenId, (nextValue, item, event) => onOpenChange?.(nextValue, item, event));
  const rootRef = useRef(null);
  const pendingFirstItemFocusRef = useRef('');
  const openMenu = normalizedItems.find(item => item.id === currentOpenId && !item.disabled && normalizeItems(item.items).length > 0);
  const activeOpenId = openMenu?.id || '';
  const focusTopLevelMenu = menuId => {
    if (!menuId || typeof window === 'undefined') return;
    window.requestAnimationFrame(() => {
      const menu = [...(rootRef.current?.querySelectorAll('.cad-menu-bar__menu') || [])].find(element => element.dataset.menuId === menuId);
      menu?.querySelector(':scope > button:not(:disabled)')?.focus?.();
    });
  };
  const focusFirstMenuItem = menuId => {
    const menu = [...(rootRef.current?.querySelectorAll('.cad-menu-bar__menu') || [])].find(element => element.dataset.menuId === menuId);
    menu?.querySelector('.cad-menu-bar__popup [role^="menuitem"]:not(:disabled)')?.focus?.();
  };
  const closeMenu = (item, event, restoreFocus = false) => {
    if (!activeOpenId) return;
    setOpenId('', item || openMenu, event);
    if (restoreFocus) focusTopLevelMenu(item?.id || activeOpenId);
  };
  const changeMenu = (item, event) => {
    if (item?.disabled || normalizeItems(item?.items).length === 0) return;
    if (item.id === activeOpenId) {
      closeMenu(item, event);
      return;
    }
    setOpenId(item.id, item, event);
  };
  useEffect(() => {
    const pendingMenuId = pendingFirstItemFocusRef.current;
    if (!pendingMenuId || pendingMenuId !== activeOpenId || typeof window === 'undefined') return undefined;
    pendingFirstItemFocusRef.current = '';
    const frame = window.requestAnimationFrame(() => focusFirstMenuItem(pendingMenuId));
    return () => window.cancelAnimationFrame(frame);
  }, [activeOpenId]);
  useEffect(() => {
    if (!activeOpenId || typeof document === 'undefined') return undefined;
    const onPointerDown = event => {
      if (!rootRef.current?.contains(event.target)) closeMenu(openMenu, event);
    };
    const onKeyDown = event => {
      if (event.defaultPrevented || event.key !== 'Escape') return;
      event.preventDefault();
      closeMenu(openMenu, event, true);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [activeOpenId, openMenu, setOpenId]);
  const focusRelative = (event, offset) => {
    const buttons = [...event.currentTarget.querySelectorAll(':scope > .cad-menu-bar__menu > button:not(:disabled)')];
    if (!buttons.length) return;
    const activeIndex = buttons.indexOf(document.activeElement);
    const index = activeIndex >= 0 ? activeIndex : Math.max(0, buttons.findIndex(button => button.dataset.menuId === activeOpenId));
    const next = buttons[(index + offset + buttons.length) % buttons.length];
    next?.focus();
    const id = next?.dataset.menuId;
    if (id && activeOpenId) setOpenId(id, normalizedItems.find(item => item.id === id), event);
  };
  return <nav {...props} ref={rootRef} className={cx('cad-menu-bar', className)} role="menubar" aria-label={label} onKeyDown={event => {
    props.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); focusRelative(event, 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); focusRelative(event, -1); }
    if (event.key === 'Escape' && activeOpenId) { event.preventDefault(); closeMenu(openMenu, event, true); }
    if (event.key === 'ArrowDown' && document.activeElement?.dataset.menuId) {
      const active = normalizedItems.find(item => item.id === document.activeElement.dataset.menuId);
      if (active && !active.disabled && normalizeItems(active.items).length > 0) {
        event.preventDefault();
        if (active.id === activeOpenId) {
          window.requestAnimationFrame(() => focusFirstMenuItem(active.id));
        } else {
          pendingFirstItemFocusRef.current = active.id;
          setOpenId(active.id, active, event);
        }
      }
    }
  }}>
    {normalizedItems.map(item => <CadMenuBarMenu key={item.id} item={item} open={activeOpenId === item.id} onToggle={changeMenu} onAction={onAction} onClose={event => closeMenu(item, event, true)} />)}
  </nav>;
}

/** CAD color palette with explicit ByLayer / ByBlock / RGB models. */
export function CadColorPicker({ value, defaultValue = { mode: 'by-layer' }, onChange, colors = DEFAULT_COLORS, allowByLayer = true, allowByBlock = true, label = 'Color', className, ...props }) {
  const [color, setColor] = useControllableState(value, defaultValue, (nextValue, event) => onChange?.(nextValue, event));
  const current = normalizeColor(color);
  const select = (next, event) => setColor(next, event);
  return <section {...props} className={cx('cad-color-picker', className)} aria-label={label}>
    <header><strong>{label}</strong><CadColorSwatch color={current.value || (current.mode === 'by-layer' ? '#b4bdc7' : '#ffffff')} label={colorLabel(current)} /></header>
    {(allowByLayer || allowByBlock) && <div className="cad-color-picker__modes" role="group" aria-label="Color source">{allowByLayer && <button type="button" aria-pressed={current.mode === 'by-layer'} data-active={current.mode === 'by-layer' ? 'true' : 'false'} onClick={event => select({ mode: 'by-layer' }, event)}>ByLayer</button>}{allowByBlock && <button type="button" aria-pressed={current.mode === 'by-block'} data-active={current.mode === 'by-block' ? 'true' : 'false'} onClick={event => select({ mode: 'by-block' }, event)}>ByBlock</button>}</div>}
    <div className="cad-color-picker__swatches" role="group" aria-label="Indexed colors">{asArray(colors).map((hex, index) => { const colorValue = typeof hex === 'string' ? hex : hex?.value || hex?.hex; const itemLabelValue = typeof hex === 'string' ? `Color ${index + 1}` : itemLabel(hex); const active = current.mode === 'rgb' && String(current.value || '').toLowerCase() === String(colorValue || '').toLowerCase(); return <button key={`${colorValue}-${index}`} type="button" aria-label={itemLabelValue} aria-pressed={active} data-active={active ? 'true' : 'false'} style={{ '--cad-picker-color': colorValue }} onClick={event => select({ mode: 'rgb', value: colorValue, index: index + 1 }, event)} />; })}</div>
    <label className="cad-color-picker__custom"><span>Custom RGB</span><input type="color" value={current.mode === 'rgb' && current.value ? current.value : '#ffffff'} onChange={event => select({ mode: 'rgb', value: event.target.value }, event)} /><output>{current.mode === 'rgb' ? current.value : '—'}</output></label>
  </section>;
}

export function CadColorPickerButton({ value, onChange, label = 'Color', className, ...props }) {
  const current = normalizeColor(value);
  return <CadPopover label={label} className={cx('cad-color-picker-button', className)} trigger={<button type="button" className="cad-color-picker-button__trigger"><CadColorSwatch color={current.value || '#b4bdc7'} label={colorLabel(current)} /></button>} content={({ close }) => <CadColorPicker {...props} value={value} onChange={(nextValue, event) => { onChange?.(nextValue, event); close(event); }} label={label} />} />;
}

export function CadLinetypePicker({ linetypes = DEFAULT_LINETYPES, value, defaultValue, onChange, label = 'Linetype', className, ...props }) {
  const options = useMemo(() => normalizeItems(linetypes), [linetypes]);
  const initialValue = defaultValue ?? options[0]?.id ?? '';
  const [selectedId, setSelectedId] = useControllableState(value, initialValue, (nextValue, item, event) => onChange?.(nextValue, item, event));
  const selected = options.find(item => item.id === selectedId) || options[0];
  return <CadPopover label={label} className={cx('cad-linetype-picker', className)} trigger={<button type="button" className="cad-style-picker__trigger"><CadLinetypePreview type={selected?.id || 'continuous'} label={selected?.label} /><span>⌄</span></button>} content={({ close }) => <div {...props} className="cad-style-picker" role="listbox" aria-label={label}>{options.map(option => <button key={option.id} type="button" role="option" aria-selected={option.id === selectedId} onClick={event => { setSelectedId(option.id, option, event); close(event); }}><CadLinetypePreview type={option.id} label={option.label} /></button>)}</div>} />;
}

export function CadLineweightPicker({ lineweights = DEFAULT_LINEWEIGHTS, value, defaultValue, onChange, label = 'Lineweight', className, ...props }) {
  const options = useMemo(() => normalizeItems(lineweights), [lineweights]);
  const initialValue = defaultValue ?? options[0]?.id ?? '';
  const [selectedId, setSelectedId] = useControllableState(value, initialValue, (nextValue, item, event) => onChange?.(nextValue, item, event));
  const selected = options.find(item => item.id === selectedId) || options[0];
  return <CadPopover label={label} className={cx('cad-lineweight-picker', className)} trigger={<button type="button" className="cad-style-picker__trigger"><CadLineweightPreview weight={selected?.value ?? 0.25} label={selected?.label} /><span>⌄</span></button>} content={({ close }) => <div {...props} className="cad-style-picker" role="listbox" aria-label={label}>{options.map(option => { const parsedWeight = Number(option.value ?? option.id); const weight = Number.isFinite(parsedWeight) ? parsedWeight : 0.25; return <button key={option.id} type="button" role="option" aria-selected={option.id === selectedId} onClick={event => { setSelectedId(option.id, option, event); close(event); }}><CadLineweightPreview weight={weight} label={option.label} /></button>; })}</div>} />;
}

export function CadBlockTile({ block, selected = false, onSelect, onInsert, onEdit, onDelete, renderThumbnail, className }) {
  const item = block || {};
  const label = itemLabel(item);
  return <article className={cx('cad-block-tile', selected && 'cad-block-tile--selected', className)} data-selected={selected ? 'true' : 'false'} role="listitem">
    <button type="button" className="cad-block-tile__select" aria-pressed={selected} onClick={event => onSelect?.(item, event)}>
      <span className="cad-block-tile__thumbnail">{renderThumbnail ? renderThumbnail(item) : item.thumbnail ? <img src={item.thumbnail} alt="" /> : <span aria-hidden="true">▧</span>}</span>
      <span className="cad-block-tile__copy"><strong>{label}</strong>{item.category && <small>{item.category}</small>}</span>
    </button>
    {(onInsert || onEdit || onDelete) && <footer>{onInsert && <button type="button" onClick={event => onInsert(item, event)}>Insert</button>}{onEdit && <button type="button" aria-label={`Edit ${label}`} onClick={event => onEdit(item, event)}>✎</button>}{onDelete && <button type="button" aria-label={`Delete ${label}`} onClick={event => onDelete(item, event)}>×</button>}</footer>}
  </article>;
}

export function CadBlockPalette({ blocks = [], value, defaultValue = '', onChange, onInsert, onCreate, onEdit, onDelete, filter, defaultFilter = '', onFilterChange, view = 'grid', renderThumbnail, title = 'Blocks', className, emptyLabel = 'No blocks match the current filter' }) {
  const generatedId = useId();
  const filterId = `cad-block-filter-${generatedId}`;
  const [selectedId, setSelectedId] = useControllableState(value, defaultValue, (nextValue, block, event) => onChange?.(nextValue, block, event));
  const [query, setQuery] = useControllableState(filter, defaultFilter, (nextValue, event) => onFilterChange?.(nextValue, event));
  const filteredBlocks = useMemo(() => asArray(blocks).filter(block => `${itemLabel(block)} ${block?.category || ''}`.toLocaleLowerCase().includes(String(query || '').toLocaleLowerCase())), [blocks, query]);
  return <section className={cx('cad-block-palette', `cad-block-palette--${view}`, className)} aria-label={title}>
    <header><h2>{title}</h2>{onCreate && <button type="button" onClick={onCreate}>+ New</button>}</header>
    <div className="cad-block-palette__filter"><label htmlFor={filterId}>Filter blocks</label><input id={filterId} value={query ?? ''} placeholder="Filter blocks" onChange={event => setQuery(event.target.value, event)} />{query && <button type="button" aria-label="Clear block filter" onClick={event => setQuery('', event)}>×</button>}</div>
    <div className="cad-block-palette__blocks" role="list">{filteredBlocks.map((block, index) => <CadBlockTile key={block?.id || index} block={block} selected={block?.id === selectedId} onSelect={(item, event) => setSelectedId(item.id, item, event)} onInsert={onInsert} onEdit={onEdit} onDelete={onDelete} renderThumbnail={renderThumbnail} />)}{!filteredBlocks.length && <p>{emptyLabel}</p>}</div>
  </section>;
}

export function CadBlockInsertOptions({ value, defaultValue = { scale: 1, rotation: 0, uniform: true, specifyOnScreen: false, explode: false }, onChange, label = 'Insert options', className }) {
  const [options, setOptions] = useControllableState(value, defaultValue, (nextValue, field, event) => onChange?.(nextValue, field, event));
  const update = (field, nextValue, event) => setOptions({ ...(options || {}), [field]: nextValue }, field, event);
  return <fieldset className={cx('cad-block-insert-options', className)}><legend>{label}</legend><label>Scale<input type="number" step="0.1" value={options?.scale ?? 1} onChange={event => update('scale', Number(event.target.value), event)} /></label><label>Rotation<input type="number" step="1" value={options?.rotation ?? 0} onChange={event => update('rotation', Number(event.target.value), event)} /><small>°</small></label><label><input type="checkbox" checked={Boolean(options?.uniform)} onChange={event => update('uniform', event.target.checked, event)} />Uniform scale</label><label><input type="checkbox" checked={Boolean(options?.specifyOnScreen)} onChange={event => update('specifyOnScreen', event.target.checked, event)} />Specify on-screen</label><label><input type="checkbox" checked={Boolean(options?.explode)} onChange={event => update('explode', event.target.checked, event)} />Explode</label></fieldset>;
}
