import React, { forwardRef, useMemo } from 'react';
import { asArray, cx, itemLabel } from './cadUiUtils.js';

const text = value => String(value ?? '').trim();

const controlId = (item, index) => text(item?.id ?? item?.key) || `control-${index + 1}`;
const controlLabel = (item, index) => text(item?.ariaLabel ?? item?.accessibleLabel ?? itemLabel(item)) || `Workspace control ${index + 1}`;
const hasActiveState = item => item?.active !== undefined || item?.pressed !== undefined;
const isActive = item => Boolean(item?.active ?? item?.pressed);

const renderIcon = (item, label) => {
  if (React.isValidElement(item?.icon)) return item.icon;
  if (typeof item?.icon === 'function') return React.createElement(item.icon, { size: 14, 'aria-hidden': true });
  if (item?.icon !== undefined && item?.icon !== null && item.icon !== '') return item.icon;
  return <span className="cad-workspace-chrome-controls__fallback-icon" aria-hidden="true">{label.slice(0, 1)}</span>;
};

/**
 * Compact titlebar controls for a CAD workspace shell.
 *
 * The component deliberately owns no workspace state, docking logic, keyboard
 * bindings, or persistence. It only turns declarative control records into
 * accessible buttons so a host can place the group beside its File/Edit menu.
 *
 * Each `items` record supports `{ id, label, icon, mode, active, disabled,
 * onClick, shortcut }`. `onClick` receives `(item, context, event)` and the
 * optional group-level `onItemClick` receives the same arguments after it.
 */
export const CadWorkspaceChromeControls = forwardRef(function CadWorkspaceChromeControls({
  items = [],
  label = 'Workspace controls',
  onItemClick,
  className,
  style,
  role = 'group',
  ...props
}, ref) {
  const controls = useMemo(() => asArray(items)
    .filter(item => item && typeof item === 'object')
    .map((item, index) => {
      const id = controlId(item, index);
      const accessibleLabel = controlLabel(item, index);
      const activeState = isActive(item);
      const mode = text(item.mode);
      const shortcut = text(item.shortcut);
      return {
        item,
        index,
        id,
        accessibleLabel,
        activeState,
        mode,
        shortcut,
        toggle: hasActiveState(item)
      };
    }), [items]);

  return <div
    {...props}
    ref={ref}
    role={role}
    aria-label={props['aria-label'] || label}
    className={cx('cad-workspace-chrome-controls', className)}
    style={style}
  >
    {controls.map(control => {
      const { item, index, id, accessibleLabel, activeState, mode, shortcut, toggle } = control;
      const title = text(item.title) || [accessibleLabel, shortcut].filter(Boolean).join(' · ');
      const context = {
        id,
        index,
        label: accessibleLabel,
        active: activeState,
        mode: mode || undefined,
        shortcut: shortcut || undefined,
        source: 'workspace-chrome'
      };

      return <button
        key={id}
        type="button"
        className="cad-workspace-chrome-controls__item"
        data-control-id={id}
        data-active={activeState ? 'true' : 'false'}
        data-mode={mode || undefined}
        data-disabled={item.disabled ? 'true' : 'false'}
        data-shortcut={shortcut || undefined}
        style={item.color ? { '--cad-workspace-chrome-item-accent': item.color } : undefined}
        aria-label={accessibleLabel}
        aria-pressed={toggle ? activeState : undefined}
        aria-keyshortcuts={shortcut || undefined}
        title={title || undefined}
        disabled={Boolean(item.disabled)}
        onClick={event => {
          if (item.disabled) return;
          item.onClick?.(item, context, event);
          onItemClick?.(item, context, event);
        }}
      >
        <span className="cad-workspace-chrome-controls__icon" aria-hidden="true">{renderIcon(item, accessibleLabel)}</span>
      </button>;
    })}
  </div>;
});

CadWorkspaceChromeControls.displayName = 'CadWorkspaceChromeControls';
