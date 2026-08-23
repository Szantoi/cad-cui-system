import React, { useEffect, useId, useRef } from 'react';
import { asArray, clamp, cx, itemLabel, useControllableState } from './cadUiUtils.js';

const callItemAction = (item, event, onAction) => {
  if (item?.disabled) return;
  item?.onClick?.(item, event);
  onAction?.(item, event);
};

export function CadShortcutHint({ shortcut, className }) {
  if (!shortcut) return null;
  return <kbd className={cx('cad-shortcut-hint', className)}>{shortcut}</kbd>;
}

/** A compact tool button suitable for a ribbon, a tool palette or a menu bar. */
export function CadToolButton({ icon: Icon, label, shortcut, active = false, toggle = false, tone = 'inherit', badge, compact = false, className, children, title, type = 'button', ...props }) {
  const accessibleLabel = label || (typeof children === 'string' ? children : 'CAD tool');
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
    {Icon && <span className="cad-tool-button__icon" aria-hidden="true"><Icon size={compact ? 13 : 16} /></span>}
    {(label || children) && <span className="cad-tool-button__label">{children || label}</span>}
    {badge && <span className="cad-tool-button__badge">{badge}</span>}
    {shortcut && <CadShortcutHint shortcut={shortcut} />}
  </button>;
}

export function CadToggleButton({ active = false, onChange, onClick, ...props }) {
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
export function CadSplitButton({ icon: Icon, label, shortcut, tone = 'inherit', disabled = false, menu, menuId, menuOpen, defaultMenuOpen = false, onMenuOpenChange, onClick, className, children, ...props }) {
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

export function CadToolbarGroup({ label, items = [], onAction, className, children }) {
  return <section className={cx('cad-toolbar-group', className)} aria-label={label}>
    <div className="cad-toolbar-group__tools">
      {asArray(items).map((item, index) => {
        if (item?.type === 'separator') return <span key={item.id || `separator-${index}`} className="cad-toolbar-group__separator" role="separator" aria-orientation="vertical" />;
        const common = {
          key: item.id || `${itemLabel(item)}-${index}`,
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
        if (item?.type === 'split') return <CadSplitButton {...common} menu={item.menu} menuOpen={item.menuOpen} onMenuOpenChange={(nextValue, event) => item.onMenuOpenChange?.(nextValue, item, event)} onClick={execute} />;
        if (item?.toggle) return <CadToggleButton {...common} onChange={(nextValue, event) => { item.onChange?.(nextValue, item, event); onAction?.({ ...item, active: nextValue }, event); }} />;
        return <CadToolButton {...common} onClick={execute} />;
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
export function CadToolbar({ groups, items, label = 'CAD tools', orientation = 'horizontal', onAction, className, children, ...props }) {
  const normalizedGroups = asArray(groups).length ? asArray(groups) : [{ id: 'default', items: asArray(items) }];
  return <div {...props} className={cx('cad-toolbar', `cad-toolbar--${orientation}`, className)} role="toolbar" aria-label={label} aria-orientation={orientation}>
    {normalizedGroups.map((group, index) => <CadToolbarGroup key={group.id || group.label || index} label={group.label} items={group.items} onAction={onAction} />)}
    {children}
  </div>;
}

export function CadToolPalette({ groups, items, label = 'CAD tool palette', className, ...props }) {
  return <CadToolbar {...props} groups={groups} items={items} label={label} orientation="vertical" className={cx('cad-tool-palette', className)} />;
}

/** A controlled/uncontrolled numeric field with CAD-friendly unit and step controls. */
export function CadNumericInput({ id, label, value, defaultValue = '', onValueChange, onChange, min, max, step = 1, unit, prefix, suffix, asNumber = true, disabled = false, readOnly = false, showSteppers = true, className, inputClassName, ...props }) {
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

export function CadUnitInput({ unit = 'mm', ...props }) {
  return <CadNumericInput {...props} unit={unit} />;
}

export function CadAngleInput({ unit = '°', ...props }) {
  return <CadNumericInput {...props} unit={unit} />;
}

/** A three-axis numeric editor for point, displacement and scale values. */
export function CadCoordinateInput({ value, defaultValue = { x: '', y: '', z: '' }, onValueChange, onChange, axes = ['X', 'Y', 'Z'], unit = 'mm', label = 'Coordinates', className, ...props }) {
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

export function CadColorSwatch({ color = '#ffffff', label, size = 'regular', onClick, className, style, ...props }) {
  const content = <><span className="cad-color-swatch__chip" style={{ '--cad-swatch-color': color }} aria-hidden="true" />{label && <span className="cad-color-swatch__label">{label}</span>}</>;
  const shared = { ...props, className: cx('cad-color-swatch', `cad-color-swatch--${size}`, className), style, title: props.title || label || color };
  if (onClick) return <button {...shared} type="button" aria-label={props['aria-label'] || label || color} onClick={onClick}>{content}</button>;
  return <span {...shared} aria-label={props['aria-label'] || label || color}>{content}</span>;
}

export function CadLinetypePreview({ type = 'continuous', color = 'currentColor', label, className }) {
  return <span className={cx('cad-linetype-preview', className)} data-type={type} style={{ '--cad-line-color': color }} title={label || type} aria-label={label || type}>
    <span aria-hidden="true" />{label && <small>{label}</small>}
  </span>;
}

export function CadLineweightPreview({ weight = 0.25, color = 'currentColor', label, className }) {
  return <span className={cx('cad-lineweight-preview', className)} style={{ '--cad-line-color': color, '--cad-line-weight': `${Math.max(1, Number(weight) * 4)}px` }} title={label || `${weight} mm`} aria-label={label || `${weight} mm`}>
    <span aria-hidden="true" />{label && <small>{label}</small>}
  </span>;
}

export function CadMenuSeparator({ className }) {
  return <div className={cx('cad-menu__separator', className)} role="separator" />;
}

export function CadMenuItem({ item, label, detail, shortcut, icon: Icon, checked, disabled = false, type = 'action', tone = 'inherit', onClick, className }) {
  const resolvedLabel = label || itemLabel(item);
  const resolvedChecked = checked ?? item?.checked;
  const resolvedDisabled = disabled || item?.disabled;
  const menuRole = type === 'checkbox' ? 'menuitemcheckbox' : type === 'radio' ? 'menuitemradio' : 'menuitem';
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
    {Icon && <Icon size={13} aria-hidden="true" />}
    <span className="cad-menu__copy"><strong>{resolvedLabel}</strong>{detail && <small>{detail}</small>}</span>
    {shortcut && <CadShortcutHint shortcut={shortcut} />}
  </button>;
}

/** Keyboard-friendly menu primitive. Escape calls `onClose`; arrows wrap through items. */
export function CadMenu({ items = [], label = 'CAD menu', onAction, onClose, className, children, menuRef: externalMenuRef, ...props }) {
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

export function CadOverflowMenu({ items = [], label = 'More options', open, defaultOpen = false, onOpenChange, onAction, className, triggerLabel = 'More', ...props }) {
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
