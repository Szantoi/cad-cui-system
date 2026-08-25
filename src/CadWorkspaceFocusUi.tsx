import type { CadAnyProps } from './cad-types';
import React, { forwardRef, useCallback } from 'react';
import { CadShortcutHint } from './CadCommandUi';
import { cx, useControllableState } from './cadUiUtils';

const asBoolean = value => Boolean(value);

/**
 * Controlled/uncontrolled focus-mode intent for a CAD workspace.
 *
 * It purposefully owns no DOM layout, fullscreen API, keyboard listener, or
 * focus-trap. A host can use the serializable boolean to hide docks, expand a
 * viewport, restore its own layout, or bind the shortcut that is safe in its
 * application shell.
 */
export function useCadWorkspaceFocus({ active, defaultActive = false, onActiveChange }: CadAnyProps = {}) {
  const [storedActive, setStoredActive] = useControllableState(
    active,
    asBoolean(defaultActive),
    (nextActive, change, event) => onActiveChange?.(asBoolean(nextActive), change, event)
  );
  const isActive = asBoolean(storedActive);

  const setActive = useCallback((nextValue, event, source = 'programmatic') => {
    const nextActive = asBoolean(typeof nextValue === 'function' ? nextValue(isActive) : nextValue);
    if (nextActive === isActive) {
      return {
        changed: false,
        active: isActive,
        previousActive: isActive,
        source
      };
    }
    const change = {
      changed: true,
      active: nextActive,
      previousActive: isActive,
      source
    };
    setStoredActive(nextActive, change, event);
    return change;
  }, [isActive, setStoredActive]);

  const toggle = useCallback((event, source = 'toggle') => setActive(!isActive, event, source), [isActive, setActive]);

  return { active: isActive, setActive, toggle };
}

/**
 * A compact, engine-free trigger for workspace focus mode.
 *
 * `shortcut` is deliberately an indicator only. Document-level keyboard
 * bindings stay host-owned so applications can avoid collisions with inputs,
 * dialogs, browser shortcuts, and their own command routing.
 */
export const CadWorkspaceFocusToggle = forwardRef<HTMLButtonElement, CadAnyProps>(function CadWorkspaceFocusToggle({
  active,
  defaultActive = false,
  onActiveChange,
  label = 'Enter focus mode',
  activeLabel = 'Exit focus mode',
  shortcut,
  disabled = false,
  onClick,
  className,
  title,
  ...props
}: CadAnyProps, ref) {
  const focus = useCadWorkspaceFocus({ active, defaultActive, onActiveChange });
  const resolvedLabel = focus.active ? activeLabel : label;
  const resolvedTitle = title || [resolvedLabel, shortcut].filter(Boolean).join(' · ');

  return <button
    {...props}
    ref={ref}
    type="button"
    className={cx('cad-workspace-focus-toggle', className)}
    data-active={focus.active ? 'true' : 'false'}
    aria-pressed={focus.active}
    aria-label={props['aria-label'] || resolvedLabel}
    title={resolvedTitle}
    disabled={disabled}
    onClick={event => {
      onClick?.(event);
      if (!event.defaultPrevented) focus.toggle(event, 'trigger');
    }}
  >
    <span className="cad-workspace-focus-toggle__reticle" aria-hidden="true"><i /><i /></span>
    <span className="cad-workspace-focus-toggle__copy">
      <span className="cad-workspace-focus-toggle__label">{resolvedLabel}</span>
      <span className="cad-workspace-focus-toggle__state" aria-hidden="true">{focus.active ? 'FOCUS' : 'READY'}</span>
    </span>
    {shortcut && <CadShortcutHint shortcut={shortcut} className="cad-workspace-focus-toggle__shortcut" />}
  </button>;
});

CadWorkspaceFocusToggle.displayName = 'CadWorkspaceFocusToggle';
