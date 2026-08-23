import React, { cloneElement, isValidElement, useEffect, useId, useRef, useState } from 'react';
import { CadShortcutHint } from './CadCommandUi.jsx';
import { asArray, cx, itemLabel, useControllableState } from './cadUiUtils.js';

const callBoth = (first, second) => event => {
  first?.(event);
  if (!event.defaultPrevented) second?.(event);
};

const focusableSelector = 'button:not(:disabled):not([tabindex="-1"]), input:not(:disabled):not([tabindex="-1"]), select:not(:disabled):not([tabindex="-1"]), textarea:not(:disabled):not([tabindex="-1"]), [contenteditable="true"]:not([tabindex="-1"]), [href]:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

const isFocusable = element => Boolean(
  element
  && !element.hidden
  && !element.closest?.('[hidden], [aria-hidden="true"], [inert]')
  && element.getAttribute('aria-hidden') !== 'true'
  && element.getAttribute('aria-disabled') !== 'true'
  && !element.hasAttribute('disabled')
);

const focusableChildren = container => [...(container?.querySelectorAll(focusableSelector) || [])].filter(isFocusable);
const focusElement = element => {
  if (!element?.isConnected) return;
  try {
    element.focus({ preventScroll: true });
  } catch {
    element.focus?.();
  }
};

const isTopmostDialog = dialog => {
  if (typeof document === 'undefined' || !dialog) return false;
  const dialogs = document.querySelectorAll('[data-cad-dialog="true"]');
  return dialogs[dialogs.length - 1] === dialog;
};

/**
 * Accessible modal shell for CAD settings, block insertion and destructive
 * actions. The host keeps ownership of `open` and action side effects.
 */
export function CadDialog({ open = false, onClose, title, description, actions, tone = 'neutral', closeOnBackdrop = true, closeOnEscape = true, className, children, ...props }) {
  const generatedId = useId();
  const titleId = `cad-dialog-title-${generatedId}`;
  const descriptionId = `cad-dialog-description-${generatedId}`;
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const closeOnEscapeRef = useRef(closeOnEscape);
  const { 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy, onKeyDown, ...dialogProps } = props;

  onCloseRef.current = onClose;
  closeOnEscapeRef.current = closeOnEscape;

  useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;
    const restoreTarget = document.activeElement;
    const focusInitial = () => {
      const dialog = dialogRef.current;
      if (!isTopmostDialog(dialog)) return;
      const focusable = focusableChildren(dialog);
      const preferred = focusable.find(element => element.hasAttribute('data-autofocus'));
      focusElement(preferred || focusable[0] || dialog);
    };
    const onWindowKeyDown = event => {
      const dialog = dialogRef.current;
      if (event.defaultPrevented || !isTopmostDialog(dialog)) return;
      if (event.key === 'Escape' && closeOnEscapeRef.current) {
        event.preventDefault();
        onCloseRef.current?.(event);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = focusableChildren(dialog);
      if (!focusable.length) {
        event.preventDefault();
        focusElement(dialog);
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;
      if (!dialog?.contains(activeElement)) {
        event.preventDefault();
        focusElement(event.shiftKey ? last : first);
      } else if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        focusElement(last);
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        focusElement(first);
      }
    };
    const timer = window.setTimeout(focusInitial, 0);
    window.addEventListener('keydown', onWindowKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onWindowKeyDown);
      focusElement(restoreTarget);
    };
  }, [open]);

  if (!open) return null;
  const resolvedLabelledBy = title ? titleId : ariaLabelledBy;
  const resolvedDescribedBy = [description ? descriptionId : undefined, ariaDescribedBy].filter(Boolean).join(' ') || undefined;
  const resolvedLabel = resolvedLabelledBy ? undefined : ariaLabel || 'CAD dialog';
  const closeLabel = typeof title === 'string' && title.trim() ? `Close ${title}` : 'Close dialog';
  return <div className="cad-dialog-backdrop" data-tone={tone} role="presentation" onMouseDown={event => { if (closeOnBackdrop && event.target === event.currentTarget) onCloseRef.current?.(event); }}>
    <section {...dialogProps} ref={dialogRef} tabIndex={-1} className={cx('cad-dialog', className)} data-cad-dialog="true" data-tone={tone} role="dialog" aria-modal="true" aria-label={resolvedLabel} aria-labelledby={resolvedLabelledBy} aria-describedby={resolvedDescribedBy} onKeyDown={event => onKeyDown?.(event)}>
      <header className="cad-dialog__header"><div>{title && <h2 id={titleId}>{title}</h2>}{description && <p id={descriptionId}>{description}</p>}</div>{onClose && <button type="button" className="cad-dialog__close" aria-label={closeLabel} onClick={onClose}>×</button>}</header>
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
export function CadPopover({ trigger, content, open, defaultOpen = false, onOpenChange, placement = 'bottom-start', label = 'More options', contentRole = 'region', closeOnOutside = true, closeOnEscape = true, restoreFocus = true, className, contentClassName, ...props }) {
  const generatedId = useId();
  const panelId = `cad-popover-${generatedId}`;
  const rootRef = useRef(null);
  const wasOpenRef = useRef(open === undefined ? defaultOpen : open);
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, (nextValue, event) => onOpenChange?.(nextValue, event));
  const resolvedContentRole = contentRole === false ? undefined : contentRole;
  const popupAriaHasPopup = ['dialog', 'grid', 'listbox', 'menu', 'tree'].includes(resolvedContentRole) ? resolvedContentRole : undefined;
  const close = event => setOpen(false, event);
  const toggle = event => setOpen(!isOpen, event);

  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = isOpen;
    if (!wasOpen || isOpen || !restoreFocus || typeof window === 'undefined') return undefined;
    const frame = window.requestAnimationFrame(() => {
      const triggerElement = rootRef.current?.querySelector('[data-cad-popover-trigger="true"]');
      if (triggerElement && document.contains(triggerElement)) triggerElement.focus?.();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, restoreFocus]);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return undefined;
    const onPointerDown = event => {
      if (closeOnOutside && !rootRef.current?.contains(event.target)) setOpen(false, event);
    };
    const onKeyDown = event => {
      if (!closeOnEscape || event.defaultPrevented || event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false, event);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [closeOnEscape, closeOnOutside, isOpen, setOpen]);

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger, {
      'data-cad-popover-trigger': 'true',
      'aria-haspopup': trigger.props['aria-haspopup'] ?? popupAriaHasPopup,
      'aria-expanded': isOpen,
      'aria-controls': isOpen ? panelId : undefined,
      onClick: callBoth(trigger.props.onClick, toggle)
    })
    : <button type="button" data-cad-popover-trigger="true" className="cad-popover__fallback-trigger" aria-haspopup={popupAriaHasPopup} aria-expanded={isOpen} aria-controls={isOpen ? panelId : undefined} onClick={toggle}>{trigger || 'Options'}</button>;
  return <div {...props} ref={rootRef} className={cx('cad-popover', `cad-popover--${placement}`, className)} onKeyDown={event => { props.onKeyDown?.(event); if (!event.defaultPrevented && closeOnEscape && event.key === 'Escape' && isOpen) { event.preventDefault(); close(event); } }}>
    {triggerElement}
    {isOpen && <div id={panelId} className={cx('cad-popover__content', contentClassName)} role={resolvedContentRole} aria-label={label}>{typeof content === 'function' ? content({ close }) : content}</div>}
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
