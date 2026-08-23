import React, { cloneElement, isValidElement, useEffect, useId, useRef, useState } from 'react';
import { CadShortcutHint } from './CadCommandUi.jsx';
import { asArray, cx, itemLabel, useControllableState } from './cadUiUtils.js';

const callBoth = (first, second) => event => {
  first?.(event);
  if (!event.defaultPrevented) second?.(event);
};

const focusableSelector = '[data-autofocus], button:not(:disabled):not([tabindex="-1"]), input:not(:disabled):not([tabindex="-1"]), select:not(:disabled):not([tabindex="-1"]), textarea:not(:disabled):not([tabindex="-1"]), [href]:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';
const focusableChildren = container => [...(container?.querySelectorAll(focusableSelector) || [])].filter(element => !element.hidden && element.getAttribute('aria-hidden') !== 'true');

/**
 * Accessible modal shell for CAD settings, block insertion and destructive
 * actions. The host keeps ownership of `open` and action side effects.
 */
export function CadDialog({ open = false, onClose, title, description, actions, tone = 'neutral', closeOnBackdrop = true, closeOnEscape = true, className, children, ...props }) {
  const generatedId = useId();
  const titleId = `cad-dialog-title-${generatedId}`;
  const descriptionId = `cad-dialog-description-${generatedId}`;
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;
    previouslyFocused.current = document.activeElement;
    const focusInitial = () => {
      const dialog = dialogRef.current;
      const focusable = focusableChildren(dialog);
      (focusable[0] || dialog)?.focus?.();
    };
    const onWindowKeyDown = event => {
      if (event.key === 'Escape' && closeOnEscape) {
        event.preventDefault();
        onClose?.(event);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = focusableChildren(dialogRef.current);
      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const timer = window.setTimeout(focusInitial, 0);
    window.addEventListener('keydown', onWindowKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onWindowKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [closeOnEscape, onClose, open]);

  if (!open) return null;
  return <div className="cad-dialog-backdrop" data-tone={tone} role="presentation" onMouseDown={event => { if (closeOnBackdrop && event.target === event.currentTarget) onClose?.(event); }}>
    <section {...props} ref={dialogRef} tabIndex={-1} className={cx('cad-dialog', className)} data-tone={tone} role="dialog" aria-modal="true" aria-label={title ? undefined : props['aria-label'] || 'CAD dialog'} aria-labelledby={title ? titleId : undefined} aria-describedby={description ? descriptionId : undefined} onKeyDown={event => props.onKeyDown?.(event)}>
      <header className="cad-dialog__header"><div>{title && <h2 id={titleId}>{title}</h2>}{description && <p id={descriptionId}>{description}</p>}</div>{onClose && <button type="button" className="cad-dialog__close" aria-label={`Close ${title || 'dialog'}`} onClick={onClose}>×</button>}</header>
      <div className="cad-dialog__body">{children}</div>
      {actions && <footer className="cad-dialog__footer">{actions}</footer>}
    </section>
  </div>;
}

export function CadConfirmDialog({ open, title = 'Confirm action', description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', destructive = false, onConfirm, onCancel, children, className, ...props }) {
  return <CadDialog {...props} open={open} title={title} description={description} onClose={onCancel} className={cx('cad-confirm-dialog', className)} actions={<><button type="button" {...(destructive ? { 'data-autofocus': true } : {})} className="cad-dialog__button cad-dialog__button--quiet" onClick={onCancel}>{cancelLabel}</button><button type="button" {...(!destructive ? { 'data-autofocus': true } : {})} className={cx('cad-dialog__button', destructive && 'cad-dialog__button--danger')} onClick={onConfirm}>{confirmLabel}</button></>}>
    {children}
  </CadDialog>;
}

export function CadToast({ toast, onDismiss, className }) {
  const item = toast || {};
  const tone = item.tone || 'neutral';
  return <article className={cx('cad-toast', className)} data-tone={tone} role={tone === 'danger' || tone === 'error' ? 'alert' : 'status'}>
    <span className="cad-toast__signal" aria-hidden="true" />
    <div className="cad-toast__copy"><strong>{item.title || itemLabel(item) || 'CAD notification'}</strong>{item.message && <p>{item.message}</p>}</div>
    {item.action && <button type="button" className="cad-toast__action" onClick={event => item.action.onClick?.(item, event)}>{item.action.label || 'Open'}</button>}
    {onDismiss && <button type="button" className="cad-toast__close" aria-label={`Dismiss ${item.title || itemLabel(item) || 'notification'}`} onClick={event => onDismiss(item, event)}>×</button>}
  </article>;
}

/** A host-managed toast stack. Supply immutable toast items and dismiss them in the callback. */
export function CadToastStack({ toasts = [], onDismiss, placement = 'bottom-right', label = 'Notifications', className, ...props }) {
  return <section {...props} className={cx('cad-toast-stack', `cad-toast-stack--${placement}`, className)} aria-label={label} aria-live="polite">
    {asArray(toasts).map((toast, index) => <CadToast key={toast?.id || index} toast={toast} onDismiss={onDismiss} />)}
  </section>;
}

/** Lightweight popover with a composable trigger, useful for quick CAD selectors. */
export function CadPopover({ trigger, content, open, defaultOpen = false, onOpenChange, placement = 'bottom-start', label = 'More options', contentRole = 'dialog', closeOnOutside = true, restoreFocus = true, className, contentClassName, ...props }) {
  const generatedId = useId();
  const panelId = `cad-popover-${generatedId}`;
  const rootRef = useRef(null);
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, (nextValue, event) => onOpenChange?.(nextValue, event));
  const restoreTriggerFocus = () => {
    if (!restoreFocus) return;
    window.requestAnimationFrame(() => rootRef.current?.querySelector('button:not(:disabled), [tabindex]:not([tabindex="-1"])')?.focus?.());
  };
  const close = event => {
    setOpen(false, event);
    restoreTriggerFocus();
  };
  const toggle = event => setOpen(!isOpen, event);
  useEffect(() => {
    if (!isOpen || !closeOnOutside || typeof document === 'undefined') return undefined;
    const onPointerDown = event => {
      if (!rootRef.current?.contains(event.target)) close(event);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [closeOnOutside, isOpen]);
  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger, {
      'aria-haspopup': trigger.props['aria-haspopup'] || 'dialog',
      'aria-expanded': isOpen,
      'aria-controls': isOpen ? panelId : undefined,
      onClick: callBoth(trigger.props.onClick, toggle)
    })
    : <button type="button" className="cad-popover__fallback-trigger" aria-haspopup="dialog" aria-expanded={isOpen} aria-controls={isOpen ? panelId : undefined} onClick={toggle}>{trigger || 'Options'}</button>;
  return <div {...props} ref={rootRef} className={cx('cad-popover', `cad-popover--${placement}`, className)} onKeyDown={event => { props.onKeyDown?.(event); if (!event.defaultPrevented && event.key === 'Escape' && isOpen) { event.preventDefault(); close(event); } }}>
    {triggerElement}
    {isOpen && <section id={panelId} className={cx('cad-popover__content', contentClassName)} role={contentRole} aria-label={label}>{typeof content === 'function' ? content({ close }) : content}</section>}
  </div>;
}

/** Tooltip that supports both pointer and keyboard focus without native title text. */
export function CadTooltip({ content, placement = 'top', className, children }) {
  const generatedId = useId();
  const [visible, setVisible] = useState(false);
  if (!content || !isValidElement(children)) return children || null;
  const child = cloneElement(children, {
    'aria-describedby': [children.props['aria-describedby'], `cad-tooltip-${generatedId}`].filter(Boolean).join(' '),
    onMouseEnter: callBoth(children.props.onMouseEnter, () => setVisible(true)),
    onMouseLeave: callBoth(children.props.onMouseLeave, () => setVisible(false)),
    onFocus: callBoth(children.props.onFocus, () => setVisible(true)),
    onBlur: callBoth(children.props.onBlur, () => setVisible(false))
  });
  return <span className={cx('cad-tooltip', `cad-tooltip--${placement}`, visible && 'cad-tooltip--visible', className)}>{child}<span id={`cad-tooltip-${generatedId}`} className="cad-tooltip__bubble" role="tooltip">{content}</span></span>;
}

/** Searchable, keyboard-first shortcut reference for a CAD workspace. */
export function CadShortcutReference({ shortcuts = [], title = 'Keyboard shortcuts', onClose, className, ...props }) {
  const grouped = asArray(shortcuts).reduce((groups, shortcut, index) => {
    const group = shortcut?.group || 'General';
    if (!groups[group]) groups[group] = [];
    groups[group].push({ ...shortcut, id: shortcut?.id || `${group}-${index}` });
    return groups;
  }, {});
  return <section {...props} className={cx('cad-shortcut-reference', className)} aria-label={title}>
    <header><h2>{title}</h2>{onClose && <button type="button" aria-label={`Close ${title}`} onClick={onClose}>×</button>}</header>
    <div className="cad-shortcut-reference__groups">{Object.entries(grouped).map(([group, entries]) => <section key={group}><h3>{group}</h3><dl>{entries.map(entry => <div key={entry.id}><dt>{entry.label || entry.command || entry.id}</dt><dd><CadShortcutHint shortcut={entry.shortcut || entry.keys} /></dd>{entry.detail && <small>{entry.detail}</small>}</div>)}</dl></section>)}</div>
  </section>;
}

/** Small prompt overlay for command options that require one typed response. */
export function CadCommandPrompt({ open = true, label = 'Command input', prompt, value, defaultValue = '', onChange, onSubmit, onCancel, placeholder, submitLabel = 'Accept', className, ...props }) {
  const generatedId = useId();
  const [draft, setDraft] = useControllableState(value, defaultValue, (nextValue, event) => onChange?.(nextValue, event));
  if (!open) return null;
  return <form {...props} className={cx('cad-command-prompt', className)} aria-label={label} onKeyDown={event => { props.onKeyDown?.(event); if (!event.defaultPrevented && event.key === 'Escape') { event.preventDefault(); onCancel?.(event); } }} onSubmit={event => { event.preventDefault(); onSubmit?.(draft, event); }}>
    {prompt && <label htmlFor={`cad-command-prompt-${generatedId}`}>{prompt}</label>}
    <input id={`cad-command-prompt-${generatedId}`} aria-label={prompt || label} value={draft ?? ''} placeholder={placeholder} autoFocus onChange={event => setDraft(event.target.value, event)} />
    {(onCancel || onSubmit) && <div>{onCancel && <button type="button" onClick={onCancel}>Cancel</button>}{onSubmit && <button type="submit">{submitLabel}</button>}</div>}
  </form>;
}
