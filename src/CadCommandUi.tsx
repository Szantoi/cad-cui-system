import type { CadAnyProps } from './cad-types';
import React, { useEffect, useId, useRef } from 'react';
import { asArray, clamp, cx, itemLabel, useControllableState } from './cadUiUtils';

const callItemAction = (item, event, onAction) => {
  if (item?.disabled) return;
  item?.onClick?.(item, event);
  onAction?.(item, event);
};

export function CadShortcutHint({ shortcut, className }: CadAnyProps) {
  if (!shortcut) return null;
  return <kbd className={cx('cad-shortcut-hint', className)}>{shortcut}</kbd>;
}

/** A compact tool button suitable for a ribbon, a tool palette or a menu bar. */
export function CadToolButton({ icon: Icon, label, shortcut, active = false, toggle = false, tone = 'inherit', badge, compact = false, className, children, title, type = 'button', ...props }: CadAnyProps) {
  const accessibleLabel = label || (typeof children === 'string' ? children : 'CAD tool');
  const icon = React.isValidElement(Icon)
    ? Icon
    : typeof Icon === 'function'
      ? <Icon size={compact ? 13 : 16} />
      : null;
  return <button
    {...props}
    type={type}
    data-tone={tone}
    data-active={active ? 'true' : 'false'}
    aria-pressed={toggle ? active : undefined}
    aria-label={props['aria-label'] || accessibleLabel}
    title={title || [accessibleLabel, shortcut].filter(Boolean).join(' · ')}
    className={cx('cad-tool-button', compact && 'cad-tool-button--compact', className)}
  >
    {icon && <span className="cad-tool-button__icon" aria-hidden="true">{icon}</span>}
    {(label || children) && <span className="cad-tool-button__label">{children || label}</span>}
    {badge && <span className="cad-tool-button__badge">{badge}</span>}
    {shortcut && <CadShortcutHint shortcut={shortcut} />}
  </button>;
}

export function CadToggleButton({ active = false, onChange, onClick, ...props }: CadAnyProps) {
  return <CadToolButton
    {...props}
    active={active}
    toggle
    onClick={event => {
      onChange?.(!active, event);
      onClick?.(event);
    }}
  />;
}

/** A primary CAD action with an independently controllable dropdown affordance. */
export function CadSplitButton({ icon: Icon, label, shortcut, tone = 'inherit', disabled = false, menu, menuId, menuOpen, defaultMenuOpen = false, onMenuOpenChange, onClick, className, children, ...props }: CadAnyProps) {
  const generatedId = useId();
  const resolvedMenuId = menuId || `cad-split-menu-${generatedId}`;
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [isMenuOpen, setMenuOpen] = useControllableState(menuOpen, defaultMenuOpen, (nextValue, event) => onMenuOpenChange?.(nextValue, event));
  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const timer = window.setTimeout(() => menuRef.current?.querySelector('[role="menuitem"]:not(:disabled), button:not(:disabled)')?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [isMenuOpen]);
  const closeMenu = event => {
    setMenuOpen(false, event);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  return <span className={cx('cad-split-button', className)} data-tone={tone}>
    <button {...props} type="button" disabled={disabled} className="cad-split-button__primary" onClick={onClick} title={[label, shortcut].filter(Boolean).join(' · ')}>
      {Icon && <Icon size={14} aria-hidden="true" />}<span>{children || label}</span>{shortcut && <CadShortcutHint shortcut={shortcut} />}
    </button>
    <button
      type="button"
      className="cad-split-button__menu-trigger"
      disabled={disabled}
      aria-label={`${label || 'Action'} options`}
      aria-haspopup="menu"
      aria-expanded={isMenuOpen}
      aria-controls={isMenuOpen ? resolvedMenuId : undefined}
      ref={triggerRef}
      onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setMenuOpen(true, event); } }}
      onClick={event => setMenuOpen(!isMenuOpen, event)}
    >⌄</button>
    {isMenuOpen && menu && <div id={resolvedMenuId} ref={menuRef} className="cad-split-button__menu" onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); closeMenu(event); } }}>{menu}</div>}
  </span>;
}

export function CadToolbarGroup({ label, items = [], onAction, className, children }: CadAnyProps) {
  return <section className={cx('cad-toolbar-group', className)} aria-label={label}>
    <div className="cad-toolbar-group__tools">
      {asArray(items).map((item, index) => {
        if (item?.type === 'separator') return <span key={item.id || `separator-${index}`} className="cad-toolbar-group__separator" role="separator" aria-orientation="vertical" />;
        const key = item.id || `${itemLabel(item)}-${index}`;
        const common = {
          icon: item.icon,
          label: itemLabel(item),
          shortcut: item.shortcut,
          tone: item.tone,
          disabled: item.disabled,
          active: item.active,
          badge: item.badge,
          title: item.title || item.detail,
          className: item.className
        };
        const execute = event => callItemAction(item, event, onAction);
        if (item?.type === 'split') return <CadSplitButton key={key} {...common} menu={item.menu} menuOpen={item.menuOpen} onMenuOpenChange={(nextValue, event) => item.onMenuOpenChange?.(nextValue, item, event)} onClick={execute} />;
        if (item?.toggle) return <CadToggleButton key={key} {...common} onChange={(nextValue, event) => { item.onChange?.(nextValue, item, event); onAction?.({ ...item, active: nextValue }, event); }} />;
        return <CadToolButton key={key} {...common} onClick={execute} />;
      })}
      {children}
    </div>
    {label && <span className="cad-toolbar-group__label">{label}</span>}
  </section>;
}

/**
 * Declarative toolbar. `groups` accepts `{ id, label, items }`; a tool item
 * can be a regular button, `{ toggle: true }`, `{ type: 'split' }`, or a
 * `{ type: 'separator' }`.
 */
export function CadToolbar({ groups, items, label = 'CAD tools', orientation = 'horizontal', onAction, className, children, ...props }: CadAnyProps) {
  const normalizedGroups = asArray(groups).length ? asArray(groups) : [{ id: 'default', items: asArray(items) }];
  return <div {...props} className={cx('cad-toolbar', `cad-toolbar--${orientation}`, className)} role="toolbar" aria-label={label} aria-orientation={orientation}>
    {normalizedGroups.map((group, index) => <CadToolbarGroup key={group.id || group.label || index} label={group.label} items={group.items} onAction={onAction} />)}
    {children}
  </div>;
}

/**
 * A vertical tool palette. Use `layout="auto"` (or `tiles`) when it lives in
 * a movable dock: the host stylesheet can then turn the tool rows into a
 * panel-local tile grid without changing the toolbar semantics.
 */
export function CadToolPalette({ groups, items, label = 'CAD tool palette', layout = 'strip', className, ...props }: CadAnyProps) {
  const resolvedLayout = layout === 'auto' || layout === 'tiles' ? layout : 'strip';
  return <CadToolbar {...props} groups={groups} items={items} label={label} orientation="vertical" data-layout={resolvedLayout} className={cx('cad-tool-palette', className)} />;
}

/** A controlled/uncontrolled numeric field with CAD-friendly unit and step controls. */
export function CadNumericInput({ id, label, value, defaultValue = '', onValueChange, onChange, min, max, step = 1, unit, prefix, suffix, asNumber = true, disabled = false, readOnly = false, showSteppers = true, className, inputClassName, ...props }: CadAnyProps) {
  const generatedId = useId();
  const inputId = id || `cad-number-${generatedId}`;
  const [currentValue, setCurrentValue] = useControllableState(value, defaultValue, (nextValue, event) => {
    onValueChange?.(nextValue, event);
    onChange?.(nextValue, event);
  });
  const updateValue = (nextValue, event) => {
    const normalized = asNumber && nextValue !== '' ? Number(nextValue) : nextValue;
    setCurrentValue(normalized, event);
  };
  const nudge = (direction, event) => {
    const baseline = Number(currentValue);
    const amount = Number(step) || 1;
    const nextValue = clamp((Number.isFinite(baseline) ? baseline : 0) + direction * amount, Number(min), Number(max));
    updateValue(nextValue, event);
  };

  return <div className={cx('cad-numeric-input', disabled && 'cad-numeric-input--disabled', className)}>
    {label && <label className="cad-numeric-input__label" htmlFor={inputId}>{label}</label>}
    <span className="cad-numeric-input__control">
      {prefix && <span className="cad-numeric-input__adornment">{prefix}</span>}
      <input
        {...props}
        id={inputId}
        className={cx('cad-numeric-input__field', inputClassName)}
        type="number"
        value={currentValue ?? ''}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        readOnly={readOnly}
        onChange={event => updateValue(event.target.value, event)}
      />
      {(unit || suffix) && <span className="cad-numeric-input__adornment">{suffix || unit}</span>}
      {showSteppers && !readOnly && <span className="cad-numeric-input__steppers">
        <button type="button" tabIndex={-1} disabled={disabled} aria-label={`Increase ${label || 'value'}`} onClick={event => nudge(1, event)}>+</button>
        <button type="button" tabIndex={-1} disabled={disabled} aria-label={`Decrease ${label || 'value'}`} onClick={event => nudge(-1, event)}>−</button>
      </span>}
    </span>
  </div>;
}

export function CadUnitInput({ unit = 'mm', ...props }: CadAnyProps) {
  return <CadNumericInput {...props} unit={unit} />;
}

export function CadAngleInput({ unit = '°', ...props }: CadAnyProps) {
  return <CadNumericInput {...props} unit={unit} />;
}

/** A three-axis numeric editor for point, displacement and scale values. */
export function CadCoordinateInput({ value, defaultValue = { x: '', y: '', z: '' }, onValueChange, onChange, axes = ['X', 'Y', 'Z'], unit = 'mm', label = 'Coordinates', className, ...props }: CadAnyProps) {
  const [coordinate, setCoordinate] = useControllableState(value, defaultValue, (nextValue, axis, event) => {
    onValueChange?.(nextValue, axis, event);
    onChange?.(nextValue, axis, event);
  });
  return <fieldset className={cx('cad-coordinate-input', className)}>
    {label && <legend>{label}</legend>}
    <div className="cad-coordinate-input__axes">
      {asArray(axes).map(axis => {
        const key = String(axis).toLowerCase();
        return <CadUnitInput
          {...props}
          key={key}
          label={String(axis).toUpperCase()}
          unit={unit}
          value={coordinate?.[key] ?? coordinate?.[axis] ?? ''}
          onValueChange={(nextValue, event) => setCoordinate({ ...(coordinate || {}), [key]: nextValue }, String(axis).toUpperCase(), event)}
        />;
      })}
    </div>
  </fieldset>;
}

export function CadColorSwatch({ color = '#ffffff', label, size = 'regular', onClick, className, style, ...props }: CadAnyProps) {
  const content = <><span className="cad-color-swatch__chip" style={{ '--cad-swatch-color': color }} aria-hidden="true" />{label && <span className="cad-color-swatch__label">{label}</span>}</>;
  const shared = { ...props, className: cx('cad-color-swatch', `cad-color-swatch--${size}`, className), style, title: props.title || label || color };
  if (onClick) return <button {...shared} type="button" aria-label={props['aria-label'] || label || color} onClick={onClick}>{content}</button>;
  return <span {...shared} aria-label={props['aria-label'] || label || color}>{content}</span>;
}

export function CadLinetypePreview({ type = 'continuous', color = 'currentColor', label, className }: CadAnyProps) {
  return <span className={cx('cad-linetype-preview', className)} data-type={type} style={{ '--cad-line-color': color }} title={label || type} aria-label={label || type}>
    <span aria-hidden="true" />{label && <small>{label}</small>}
  </span>;
}

export function CadLineweightPreview({ weight = 0.25, color = 'currentColor', label, className }: CadAnyProps) {
  return <span className={cx('cad-lineweight-preview', className)} style={{ '--cad-line-color': color, '--cad-line-weight': `${Math.max(1, Number(weight) * 4)}px` }} title={label || `${weight} mm`} aria-label={label || `${weight} mm`}>
    <span aria-hidden="true" />{label && <small>{label}</small>}
  </span>;
}

export function CadMenuSeparator({ className }: CadAnyProps) {
  return <div className={cx('cad-menu__separator', className)} role="separator" />;
}

export function CadMenuItem({ item, label, detail, shortcut, icon: Icon, checked, disabled = false, type = 'action', tone = 'inherit', onClick, className }: CadAnyProps) {
  const resolvedLabel = label || itemLabel(item);
  const resolvedChecked = checked ?? item?.checked;
  const resolvedDisabled = disabled || item?.disabled;
  const menuRole = type === 'checkbox' ? 'menuitemcheckbox' : type === 'radio' ? 'menuitemradio' : 'menuitem';
  const icon = React.isValidElement(Icon)
    ? Icon
    : typeof Icon === 'function'
      ? <Icon size={13} />
      : null;
  return <button
    type="button"
    role={menuRole}
    disabled={resolvedDisabled}
    data-tone={tone || item?.tone || 'inherit'}
    aria-checked={menuRole === 'menuitem' ? undefined : Boolean(resolvedChecked)}
    className={cx('cad-menu__item', resolvedChecked && 'cad-menu__item--checked', className)}
    onClick={event => onClick?.(item, event)}
  >
    <span className="cad-menu__check" aria-hidden="true">{resolvedChecked ? '✓' : ''}</span>
    {icon && <span className="cad-menu__icon" aria-hidden="true">{icon}</span>}
    <span className="cad-menu__copy"><strong>{resolvedLabel}</strong>{detail && <small>{detail}</small>}</span>
    {shortcut && <CadShortcutHint shortcut={shortcut} />}
  </button>;
}

/** Keyboard-friendly menu primitive. Escape calls `onClose`; arrows wrap through items. */
export function CadMenu({ items = [], label = 'CAD menu', onAction, onClose, className, children, menuRef: externalMenuRef, ...props }: CadAnyProps) {
  const localMenuRef = useRef(null);
  const menuRef = externalMenuRef || localMenuRef;
  const moveFocus = direction => {
    const entries = [...(menuRef.current?.querySelectorAll('[role^="menuitem"]') || [])].filter(entry => !entry.disabled);
    if (!entries.length) return;
    const currentIndex = entries.indexOf(document.activeElement);
    entries[(currentIndex + direction + entries.length) % entries.length].focus();
  };
  return <div
    {...props}
    ref={menuRef}
    className={cx('cad-menu', className)}
    role="menu"
    aria-label={label}
    onKeyDown={event => {
      if (event.key === 'ArrowDown') { event.preventDefault(); moveFocus(1); }
      if (event.key === 'ArrowUp') { event.preventDefault(); moveFocus(-1); }
      if (event.key === 'Home') { event.preventDefault(); const entry = menuRef.current?.querySelector('[role^="menuitem"]:not(:disabled)'); entry?.focus(); }
      if (event.key === 'End') { event.preventDefault(); const entries = menuRef.current?.querySelectorAll('[role^="menuitem"]:not(:disabled)'); entries?.[entries.length - 1]?.focus(); }
      if (event.key === 'Escape') { event.preventDefault(); onClose?.(event); }
    }}
  >
    {asArray(items).map((item, index) => item?.type === 'separator'
      ? <CadMenuSeparator key={item.id || `separator-${index}`} />
      : <CadMenuItem key={item.id || `${itemLabel(item)}-${index}`} item={item} label={itemLabel(item)} detail={item.detail} shortcut={item.shortcut} icon={item.icon} checked={item.checked} disabled={item.disabled} type={item.type} tone={item.tone} onClick={(selectedItem, event) => callItemAction(selectedItem, event, onAction)} />)}
    {children}
  </div>;
}

/**
 * A controlled, pointer-positioned menu for viewport and canvas actions.
 * Dismissal restores the supplied focus target, while command activation does
 * not, so a command is free to move focus into a dialog or prompt.
 */
export function CadContextMenuPopup({
  open = false,
  position = { x: 0, y: 0 },
  items = [],
  label = 'Context menu',
  onAction,
  onClose,
  restoreFocusRef,
  returnFocusRef,
  className,
  style,
  children,
  menuRef: externalMenuRef,
  onContextMenu,
  ...props
}: CadAnyProps) {
  const localMenuRef = useRef(null);
  const menuRef = externalMenuRef || localMenuRef;
  const shouldRestoreFocusRef = useRef(false);
  const focusTargetRef = restoreFocusRef || returnFocusRef;
  const requestClose = React.useCallback((event, reason, item = undefined) => {
    shouldRestoreFocusRef.current = reason === 'escape' || reason === 'outside';
    onClose?.(event, { reason, item });
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const focusTarget = focusTargetRef?.current;
    const timer = window.setTimeout(() => menuRef.current?.querySelector('[role^="menuitem"]:not(:disabled)')?.focus(), 0);
    return () => {
      window.clearTimeout(timer);
      if (!shouldRestoreFocusRef.current) return;
      shouldRestoreFocusRef.current = false;
      window.setTimeout(() => focusTarget?.focus?.(), 0);
    };
  }, [focusTargetRef, menuRef, open]);

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = event => {
      const target = event.target;
      if (!(target instanceof Node) || menuRef.current?.contains(target)) return;
      requestClose(event, 'outside');
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [menuRef, open, requestClose]);

  if (!open) return null;
  const resolvedPosition = position || { x: 0, y: 0 };
  const popupStyle = {
    ...style,
    position: 'absolute',
    left: resolvedPosition.x ?? 0,
    top: resolvedPosition.y ?? 0,
    zIndex: style?.zIndex ?? 40
  };
  return <CadMenu
    {...props}
    menuRef={menuRef}
    items={items}
    label={label}
    className={cx('cad-context-menu-popup', className)}
    style={popupStyle}
    onContextMenu={event => {
      event.preventDefault();
      onContextMenu?.(event);
    }}
    onClose={event => {
      event.stopPropagation?.();
      requestClose(event, 'escape');
    }}
    onAction={(item, event) => {
      shouldRestoreFocusRef.current = false;
      onAction?.(item, event);
      requestClose(event, 'action', item);
    }}
  >{children}</CadMenu>;
}

const radialVisibleItems = (items: unknown) => asArray(items).filter(item => item && item.type !== 'separator' && !item.hidden);
const radialChildItems = item => {
  const seen = new Set();
  return radialVisibleItems([
    ...asArray(item?.commands),
    ...asArray(item?.children),
    ...asArray(item?.items)
  ]).filter(child => {
    if (seen.has(child)) return false;
    seen.add(child);
    return true;
  });
};
const radialItemPathId = (item, index) => String(item?.id ?? item?.key ?? (itemLabel(item) || `item-${index}`));
const sameRadialPath = (left, right) => left.length === right.length && left.every((entry, index) => entry === right[index]);

const resolveRadialExpandedPath = (rootItems, requestedPath) => {
  let levelItems = radialVisibleItems(rootItems);
  const resolvedPath: string[] = [];
  for (const requestedId of asArray(requestedPath)) {
    const requestedKey = String(requestedId);
    const index = levelItems.findIndex((item, itemIndex) => radialItemPathId(item, itemIndex) === requestedKey);
    const collector = index < 0 ? undefined : levelItems[index];
    const childItems = radialChildItems(collector);
    if (!collector || !childItems.length) break;
    resolvedPath.push(radialItemPathId(collector, index));
    levelItems = childItems;
  }
  return resolvedPath;
};

const radialRingPlacement = (index, itemCount, capacity) => {
  const ring = Math.floor(index / capacity);
  const firstItemIndex = ring * capacity;
  const ringItemCount = Math.min(capacity, itemCount - firstItemIndex);
  const slot = index - firstItemIndex;
  const angle = -90 + (360 * slot) / Math.max(ringItemCount, 1);
  const radius = ring === 0
    ? 'var(--cad-radial-menu-radius)'
    : `calc(var(--cad-radial-menu-radius) + ${ring} * var(--cad-radial-menu-ring-gap))`;
  return { angle, radius, ring };
};

const radialMaximumRingCount = (items, capacity) => {
  const visibleItems = radialVisibleItems(items);
  return visibleItems.reduce((maximum, item) => Math.max(maximum, radialMaximumRingCount(radialChildItems(item), capacity)), Math.max(1, Math.ceil(visibleItems.length / capacity)));
};

/**
 * A controlled, pointer-positioned radial menu for contextual CAD actions.
 *
 * `position` describes its centre. Items may declare a `children` or `items`
 * array to become a collector: that collector opens another radial layer. Use
 * `maxItemsPerRing` (or the `ringCapacity` alias) to set the number of actions
 * before a level grows another concentric ring. `expandedPath` /
 * `defaultExpandedPath` use collector ids and make a preferred initial radial
 * mode host-configurable. `presentation="cascade"` (the default) grows child
 * radial layers from their collector; `presentation="rings"` keeps the active
 * path centred and renders child actions in outward concentric rings.
 *
 * Escape and outside presses dismiss the menu and return focus to the supplied
 * trigger. Escape first collapses the innermost collector layer. Activating a
 * leaf action intentionally does not restore focus: commands may instead move
 * focus to a prompt or dialog.
 */
export function CadRadialMenu({
  open = false,
  position = { x: 0, y: 0 },
  items = [],
  label = 'CAD radial menu',
  centerLabel = 'Actions',
  onAction,
  onClose,
  restoreFocusRef,
  returnFocusRef,
  className,
  style,
  children,
  menuRef: externalMenuRef,
  onKeyDown,
  submenuTrigger = 'both',
  submenuDelay = 140,
  expandedPath,
  defaultExpandedPath = [],
  onExpandedPathChange,
  maxItemsPerRing,
  ringCapacity,
  presentation = 'cascade',
  ...props
}: CadAnyProps) {
  const localMenuRef = useRef(null);
  const menuRef = externalMenuRef || localMenuRef;
  const generatedId = useId();
  const menuId = `cad-radial-menu-${generatedId}`;
  const shouldRestoreFocusRef = useRef(false);
  const focusTargetRef = restoreFocusRef || returnFocusRef;
  const initialFocusDoneRef = useRef(false);
  const pendingFocusRef = useRef<any>(null);
  const hoverOpenTimerRef = useRef<number | null>(null);
  const hoverCollapseTimerRef = useRef<number | null>(null);
  const actionItems = React.useMemo(() => radialVisibleItems(items), [items]);
  const [expandedPathValue, setExpandedPathValue] = useControllableState(
    expandedPath,
    defaultExpandedPath,
    (nextPath, event, meta) => onExpandedPathChange?.(nextPath, event, meta)
  );
  const resolvedSubmenuTrigger = submenuTrigger === 'hover' || submenuTrigger === 'click' || submenuTrigger === 'both'
    ? submenuTrigger
    : 'both';
  const resolvedPresentation = presentation === 'rings' ? 'rings' : 'cascade';
  const resolvedSubmenuDelay = Math.max(0, Number(submenuDelay) || 0);
  const resolvedRingCapacity = Math.max(1, Math.floor(Number(maxItemsPerRing ?? ringCapacity) || 6));
  const normalizedExpandedPath = React.useMemo(
    () => resolveRadialExpandedPath(actionItems, expandedPathValue),
    [actionItems, expandedPathValue]
  );
  const rootRingCount = Math.max(1, Math.ceil(actionItems.length / resolvedRingCapacity));
  const maximumRingCount = radialMaximumRingCount(actionItems, resolvedRingCapacity);

  const clearHoverOpenTimer = React.useCallback(() => {
    if (hoverOpenTimerRef.current !== null) window.clearTimeout(hoverOpenTimerRef.current);
    hoverOpenTimerRef.current = null;
  }, []);
  const clearHoverCollapseTimer = React.useCallback(() => {
    if (hoverCollapseTimerRef.current !== null) window.clearTimeout(hoverCollapseTimerRef.current);
    hoverCollapseTimerRef.current = null;
  }, []);
  const getFocusableItems = React.useCallback((depth?: number) => {
    const level = depth === undefined
      ? menuRef.current
      : menuRef.current?.querySelector(`.cad-radial-menu__level[data-radial-level="${depth}"]`);
    return [...(level?.querySelectorAll('[role^="menuitem"]') || [])].filter(entry => !entry.disabled && entry.closest('.cad-radial-menu__level') === level);
  }, [menuRef]);
  const focusLevelItem = React.useCallback((depth, itemId?: string) => {
    const entries = getFocusableItems(depth);
    const target = itemId === undefined
      ? entries[0]
      : entries.find(entry => entry.getAttribute('data-radial-item-id') === itemId) || entries[0];
    target?.focus();
  }, [getFocusableItems]);
  const requestClose = React.useCallback((event, reason, item = undefined) => {
    shouldRestoreFocusRef.current = reason === 'escape' || reason === 'outside';
    onClose?.(event, { reason, item });
  }, [onClose]);
  const setExpandedPath = React.useCallback((nextPath, event, meta) => {
    setExpandedPathValue(nextPath, event, meta);
  }, [setExpandedPathValue]);
  const openCollector = React.useCallback((item, nextPath, event, { focusChild = false, reason = 'expand' } = {}) => {
    if (item?.disabled || !radialChildItems(item).length) return;
    if (focusChild) pendingFocusRef.current = { depth: nextPath.length };
    if (!sameRadialPath(normalizedExpandedPath, nextPath)) {
      setExpandedPath(nextPath, event, { reason, item, path: nextPath });
      return;
    }
    if (focusChild) window.setTimeout(() => focusLevelItem(nextPath.length), 0);
  }, [focusLevelItem, normalizedExpandedPath, setExpandedPath]);
  const collapseInnermostSubmenu = React.useCallback(event => {
    if (!normalizedExpandedPath.length) return false;
    const collectorId = normalizedExpandedPath[normalizedExpandedPath.length - 1];
    const nextPath = normalizedExpandedPath.slice(0, -1);
    pendingFocusRef.current = { depth: nextPath.length, itemId: collectorId };
    setExpandedPath(nextPath, event, { reason: 'escape', path: nextPath });
    return true;
  }, [normalizedExpandedPath, setExpandedPath]);
  const scheduleCollectorOpen = React.useCallback((item, nextPath, event) => {
    if (resolvedSubmenuTrigger !== 'hover' && resolvedSubmenuTrigger !== 'both') return;
    clearHoverOpenTimer();
    clearHoverCollapseTimer();
    hoverOpenTimerRef.current = window.setTimeout(() => {
      hoverOpenTimerRef.current = null;
      openCollector(item, nextPath, event, { reason: 'hover' });
    }, resolvedSubmenuDelay);
  }, [clearHoverCollapseTimer, clearHoverOpenTimer, openCollector, resolvedSubmenuDelay, resolvedSubmenuTrigger]);
  const scheduleSubmenuCollapse = React.useCallback(event => {
    if (!normalizedExpandedPath.length) return;
    clearHoverOpenTimer();
    clearHoverCollapseTimer();
    hoverCollapseTimerRef.current = window.setTimeout(() => {
      hoverCollapseTimerRef.current = null;
      setExpandedPath([], event, { reason: 'pointerleave', path: [] });
    }, resolvedSubmenuDelay);
  }, [clearHoverCollapseTimer, clearHoverOpenTimer, normalizedExpandedPath.length, resolvedSubmenuDelay, setExpandedPath]);
  const moveFocus = React.useCallback((direction, target) => {
    const levelElement = target instanceof Element ? target.closest('.cad-radial-menu__level') : null;
    const depth = Number(levelElement?.getAttribute('data-radial-level'));
    const entries = getFocusableItems(Number.isFinite(depth) ? depth : normalizedExpandedPath.length);
    if (!entries.length) return;
    const currentIndex = entries.indexOf(document.activeElement);
    entries[(currentIndex + direction + entries.length) % entries.length].focus();
  }, [getFocusableItems, normalizedExpandedPath.length]);
  const focusDepthForTarget = target => {
    const levelElement = target instanceof Element ? target.closest('.cad-radial-menu__level') : null;
    const depth = Number(levelElement?.getAttribute('data-radial-level'));
    return Number.isFinite(depth) ? depth : normalizedExpandedPath.length;
  };

  useEffect(() => () => {
    clearHoverOpenTimer();
    clearHoverCollapseTimer();
  }, [clearHoverCollapseTimer, clearHoverOpenTimer]);

  useEffect(() => {
    if (!open) {
      initialFocusDoneRef.current = false;
      pendingFocusRef.current = null;
      return undefined;
    }
    const focusTarget = focusTargetRef?.current;
    return () => {
      if (!shouldRestoreFocusRef.current) return;
      shouldRestoreFocusRef.current = false;
      window.setTimeout(() => focusTarget?.focus?.(), 0);
    };
  }, [focusTargetRef, open]);

  useEffect(() => {
    if (!open) return undefined;
    let pendingFocus = pendingFocusRef.current;
    if (!initialFocusDoneRef.current) {
      initialFocusDoneRef.current = true;
      pendingFocus = { depth: normalizedExpandedPath.length };
    }
    if (!pendingFocus) return undefined;
    pendingFocusRef.current = null;
    const timer = window.setTimeout(() => focusLevelItem(pendingFocus.depth, pendingFocus.itemId), 0);
    return () => window.clearTimeout(timer);
  }, [focusLevelItem, normalizedExpandedPath, open]);

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = event => {
      const target = event.target;
      if (!(target instanceof Node) || menuRef.current?.contains(target)) return;
      requestClose(event, 'outside');
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [menuRef, open, requestClose]);

  if (!open) return null;
  const resolvedPosition = position || { x: 0, y: 0 };
  const rootOuterRadius = `calc(var(--cad-radial-menu-radius) + ${rootRingCount - 1} * var(--cad-radial-menu-ring-gap))`;
  const cascadeInsetTerms = Array.from(
    { length: Math.max(1, normalizedExpandedPath.length + 1) },
    () => 'var(--cad-radial-menu-radius) + var(--cad-radial-menu-action-size)'
  ).join(' + ');
  const safeInset = resolvedPresentation === 'rings'
    ? `calc(var(--cad-radial-menu-root-outer-radius) + var(--cad-radial-menu-action-size) + ${normalizedExpandedPath.length} * var(--cad-radial-menu-level-gap))`
    : `calc(${cascadeInsetTerms})`;
  const popupStyle = {
    ...style,
    '--cad-radial-menu-root-outer-radius': style?.['--cad-radial-menu-root-outer-radius'] || rootOuterRadius,
    '--cad-radial-menu-safe-inset': style?.['--cad-radial-menu-safe-inset'] || safeInset,
    position: 'absolute',
    left: resolvedPosition.x ?? 0,
    top: resolvedPosition.y ?? 0,
    zIndex: style?.zIndex ?? 40
  } as React.CSSProperties;
  const renderLevel = (levelItems, path: string[], depth: number, parentItem = undefined, entryPlacement = undefined) => {
    const visibleItems = radialVisibleItems(levelItems);
    const ringCount = Math.max(1, Math.ceil(visibleItems.length / resolvedRingCapacity));
    const outerRadius = `calc(var(--cad-radial-menu-radius) + ${ringCount - 1} * var(--cad-radial-menu-ring-gap))`;
    const pathIsActive = path.every((pathId, pathIndex) => normalizedExpandedPath[pathIndex] === pathId);
    const expandedId = pathIsActive ? normalizedExpandedPath[depth] : undefined;
    const expandedIndex = expandedId === undefined
      ? -1
      : visibleItems.findIndex((item, itemIndex) => radialItemPathId(item, itemIndex) === expandedId);
    const expandedItem = expandedIndex < 0 ? undefined : visibleItems[expandedIndex];
    const expandedChildren = radialChildItems(expandedItem);
    const levelStyle = {
      '--cad-radial-menu-level-outer-radius': outerRadius,
      '--cad-radial-menu-level-entry-angle': entryPlacement ? `${entryPlacement.angle}deg` : '0deg',
      '--cad-radial-menu-level-entry-radius': entryPlacement?.radius || '0px',
      '--cad-radial-menu-level-presentation-offset': depth === 0 ? '0px' : `calc(${depth} * var(--cad-radial-menu-level-gap))`,
      '--cad-radial-menu-level-depth': depth
    } as React.CSSProperties;
    const levelCenterLabel = depth === 0 ? centerLabel : itemLabel(parentItem) || centerLabel;
    const levelId = `${menuId}-level-${depth}`;
    return <div
      key={`${path.join('/') || 'root'}-${depth}`}
      id={levelId}
      role="group"
      aria-label={depth === 0 ? label : `${levelCenterLabel} submenu`}
      className={cx('cad-radial-menu__level', depth > 0 && 'cad-radial-menu__level--nested')}
      data-radial-level={depth}
      data-radial-path={path.join('/')}
      style={levelStyle}
    >
      <span className="cad-radial-menu__ring" aria-hidden="true" />
      <span className="cad-radial-menu__center" aria-hidden="true">{levelCenterLabel}</span>
      {visibleItems.map((item, index) => {
        const resolvedLabel = itemLabel(item) || 'CAD action';
        const resolvedChecked = item.checked;
        const resolvedDisabled = Boolean(item.disabled);
        const childItems = radialChildItems(item);
        const collector = childItems.length > 0;
        const itemId = radialItemPathId(item, index);
        const itemPath = [...path, itemId];
        const expanded = collector && sameRadialPath(normalizedExpandedPath.slice(0, itemPath.length), itemPath);
        const itemType = item.type || (item.toggle ? 'checkbox' : 'action');
        const menuRole = itemType === 'checkbox' ? 'menuitemcheckbox' : itemType === 'radio' ? 'menuitemradio' : 'menuitem';
        const Icon = item.icon;
        const icon = React.isValidElement(Icon)
          ? Icon
          : typeof Icon === 'function'
            ? <Icon size={20} />
            : (typeof Icon === 'string' || typeof Icon === 'number') && Icon !== ''
              ? <span>{Icon}</span>
            : null;
        const placement = radialRingPlacement(index, visibleItems.length, resolvedRingCapacity);
        const radialItemStyle = {
          '--cad-radial-menu-angle': `${placement.angle}deg`,
          '--cad-radial-menu-counter-angle': `${-placement.angle}deg`,
          '--cad-radial-menu-item-radius': placement.radius
        } as React.CSSProperties;
        return <button
          key={item.id || `${resolvedLabel}-${index}`}
          type="button"
          role={menuRole}
          disabled={resolvedDisabled}
          data-tone={item.tone || 'inherit'}
          data-active={item.active ? 'true' : 'false'}
          data-checked={resolvedChecked ? 'true' : 'false'}
          data-radial-ring={placement.ring}
          data-radial-item-id={itemId}
          data-radial-collector={collector ? 'true' : undefined}
          aria-checked={menuRole === 'menuitem' ? undefined : Boolean(resolvedChecked)}
          aria-haspopup={collector ? 'menu' : undefined}
          aria-expanded={collector ? expanded : undefined}
          aria-controls={collector && expanded ? `${menuId}-level-${depth + 1}` : undefined}
          aria-label={item['aria-label'] || (collector ? `${resolvedLabel}, submenu` : resolvedLabel)}
          aria-keyshortcuts={item.shortcut || undefined}
          title={[resolvedLabel, collector && 'Submenu', item.detail, item.shortcut].filter(Boolean).join(' · ')}
          className={cx('cad-radial-menu__item', collector && 'cad-radial-menu__item--collector', item.className)}
          style={radialItemStyle}
          onPointerEnter={event => { if (collector) scheduleCollectorOpen(item, itemPath, event); }}
          onKeyDown={event => {
            if (!collector || (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'ArrowRight')) return;
            event.preventDefault();
            event.stopPropagation();
            clearHoverOpenTimer();
            clearHoverCollapseTimer();
            openCollector(item, itemPath, event, { focusChild: true, reason: 'keyboard' });
          }}
          onClick={event => {
            if (collector) {
              if (resolvedSubmenuTrigger !== 'click' && resolvedSubmenuTrigger !== 'both') return;
              clearHoverOpenTimer();
              clearHoverCollapseTimer();
              openCollector(item, itemPath, event, { focusChild: true, reason: 'click' });
              return;
            }
            shouldRestoreFocusRef.current = false;
            callItemAction(item, event, onAction);
            requestClose(event, 'action', item);
          }}
        >
          {icon && <span className="cad-radial-menu__icon" aria-hidden="true">{icon}</span>}
          <span className="cad-radial-menu__label">{resolvedLabel}</span>
          {collector && <span className="cad-radial-menu__collector-mark" aria-hidden="true">⌁</span>}
          {item.shortcut && <CadShortcutHint shortcut={item.shortcut} />}
        </button>;
      })}
      {expandedItem && expandedChildren.length && renderLevel(
        expandedChildren,
        [...path, radialItemPathId(expandedItem, expandedIndex)],
        depth + 1,
        expandedItem,
        radialRingPlacement(expandedIndex, visibleItems.length, resolvedRingCapacity)
      )}
    </div>;
  };
  return <div
    {...props}
    ref={menuRef}
    className={cx('cad-radial-menu', `cad-radial-menu--${resolvedPresentation}`, maximumRingCount > 1 && 'cad-radial-menu--multi-ring', className)}
    style={popupStyle}
    role="menu"
    aria-label={label}
    data-count={actionItems.length}
    data-expanded-depth={normalizedExpandedPath.length}
    data-ring-count={rootRingCount}
    data-maximum-ring-count={maximumRingCount}
    data-presentation={resolvedPresentation}
    onPointerEnter={() => clearHoverCollapseTimer()}
    onPointerLeave={event => {
      const relatedTarget = event.relatedTarget;
      if (relatedTarget instanceof Node && event.currentTarget.contains(relatedTarget)) return;
      scheduleSubmenuCollapse(event);
    }}
    onKeyDown={event => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveFocus(1, event.target); }
      if ((event.key === 'ArrowLeft' || event.key === 'Backspace') && focusDepthForTarget(event.target) > 0) {
        event.preventDefault();
        event.stopPropagation?.();
        collapseInnermostSubmenu(event);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveFocus(-1, event.target); }
      else if (event.key === 'Backspace') { event.preventDefault(); }
      if (event.key === 'Home') { event.preventDefault(); focusLevelItem(focusDepthForTarget(event.target)); }
      if (event.key === 'End') {
        event.preventDefault();
        const entries = getFocusableItems(focusDepthForTarget(event.target));
        entries[entries.length - 1]?.focus();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation?.();
        if (!collapseInnermostSubmenu(event)) requestClose(event, 'escape');
      }
    }}
  >
    {renderLevel(actionItems, [], 0)}
    {children}
  </div>;
}

export function CadOverflowMenu({ items = [], label = 'More options', open, defaultOpen = false, onOpenChange, onAction, className, triggerLabel = 'More', ...props }: CadAnyProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, (nextValue, event) => onOpenChange?.(nextValue, event));
  const generatedId = useId();
  const menuId = `cad-overflow-menu-${generatedId}`;
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  useEffect(() => {
    if (!isOpen) return undefined;
    const timer = window.setTimeout(() => menuRef.current?.querySelector('[role^="menuitem"]:not(:disabled)')?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [isOpen]);
  const close = event => {
    setOpen(false, event);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };
  return <span className={cx('cad-overflow-menu', className)}>
    <button {...props} ref={triggerRef} type="button" className="cad-overflow-menu__trigger" aria-label={label} aria-haspopup="menu" aria-expanded={isOpen} aria-controls={isOpen ? menuId : undefined} onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true, event); } }} onClick={event => setOpen(!isOpen, event)}>{triggerLabel === 'More' ? '⋯' : triggerLabel}</button>
    {isOpen && <CadMenu menuRef={menuRef} id={menuId} items={items} label={label} onClose={close} onAction={(item, event) => { onAction?.(item, event); close(event); }} />}
  </span>;
}
