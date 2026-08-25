import React, { cloneElement, isValidElement, useCallback, useEffect, useId, useRef, useState } from 'react';
import { CadShortcutHint } from './CadCommandUi.jsx';
import { asArray, clamp, cx, itemLabel, useControllableState } from './cadUiUtils.js';

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

const targetIsInside = (container, target) => {
  if (!container || !target) return false;
  try { return container === target || Boolean(container.contains?.(target)); } catch { return false; }
};

const isTopmostDialog = dialog => {
  if (typeof document === 'undefined' || !dialog) return false;
  const dialogs = document.querySelectorAll('[data-cad-dialog="true"]');
  return dialogs[dialogs.length - 1] === dialog;
};

const overlayCoordinate = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.round(numeric) : fallback;
};

const normalizeOverlayPosition = (position, fallback = { x: 0, y: 0 }) => ({
  x: overlayCoordinate(position?.x, overlayCoordinate(fallback?.x, 0)),
  y: overlayCoordinate(position?.y, overlayCoordinate(fallback?.y, 0))
});

const overlayPositionsEqual = (first, second) => first?.x === second?.x && first?.y === second?.y;

const overlayPointerMatches = (drag, event) => {
  if (!drag || !event) return false;
  return drag.pointerId === undefined || event.pointerId === undefined || drag.pointerId === event.pointerId;
};

const resolvedOverlayEdge = edge => ['top', 'right', 'bottom', 'left'].includes(String(edge || '').toLocaleLowerCase())
  ? String(edge).toLocaleLowerCase()
  : 'right';

const rangeForOverlay = (minimum, maximum, fallback) => {
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum)) return { min: -Infinity, max: Infinity };
  if (minimum <= maximum) return { min: minimum, max: maximum };
  return { min: fallback, max: fallback };
};

/**
 * A host-positioned viewport overlay with an explicit, ribbed drag tab.
 *
 * `position` is a pixel translation from the host's own anchor. The overlay
 * clamps itself to its immediate parent when that parent has measurable bounds;
 * this lets a host keep a useful default placement in CSS while still making
 * the surface movable and safe after the viewport is resized. `handleIcon`
 * is decorative; retain a descriptive `label` for the accessible grip name.
 */
export function CadMovableOverlay({
  position,
  defaultPosition = { x: 0, y: 0 },
  onPositionChange,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  onDragStart,
  onDragEnd,
  edge = 'right',
  moveStep = 16,
  label = 'Movable overlay',
  handleLabel,
  handleIcon,
  className,
  children,
  style,
  'aria-label': ariaLabel,
  ...props
}) {
  const generatedId = useId();
  const contentId = `cad-movable-overlay-content-${generatedId}`;
  const instructionId = `cad-movable-overlay-instructions-${generatedId}`;
  const rootRef = useRef(null);
  const handleRef = useRef(null);
  const dragRef = useRef(null);
  const activeListenersRef = useRef(null);
  const latestPositionRef = useRef(null);
  const renderedPositionRef = useRef(null);
  const collapsedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const [isDragging, setDragging] = useState(false);
  const [storedPosition, setStoredPosition] = useControllableState(
    position,
    normalizeOverlayPosition(defaultPosition),
    (nextPosition, metadata, event) => onPositionChange?.(nextPosition, metadata, event)
  );
  const [storedCollapsed, setStoredCollapsed] = useControllableState(
    collapsed,
    Boolean(defaultCollapsed),
    (nextCollapsed, metadata, event) => onCollapsedChange?.(nextCollapsed, metadata, event)
  );
  const currentPosition = normalizeOverlayPosition(storedPosition);
  const isCollapsed = Boolean(storedCollapsed);
  const currentEdge = resolvedOverlayEdge(edge);
  const keyboardStep = Math.max(1, Math.round(Number(moveStep) || 16));

  latestPositionRef.current = currentPosition;
  renderedPositionRef.current = currentPosition;
  collapsedRef.current = isCollapsed;

  const getPositionBounds = useCallback(() => {
    const root = rootRef.current;
    const boundary = root?.parentElement;
    const rootRect = root?.getBoundingClientRect?.();
    const boundaryRect = boundary?.getBoundingClientRect?.();
    const renderedPosition = renderedPositionRef.current || { x: 0, y: 0 };
    const hasBounds = [
      rootRect?.left,
      rootRect?.right,
      rootRect?.top,
      rootRect?.bottom,
      rootRect?.width,
      rootRect?.height,
      boundaryRect?.left,
      boundaryRect?.right,
      boundaryRect?.top,
      boundaryRect?.bottom,
      boundaryRect?.width,
      boundaryRect?.height
    ].every(Number.isFinite);

    if (!hasBounds || rootRect.width <= 0 || rootRect.height <= 0 || boundaryRect.width <= 0 || boundaryRect.height <= 0) {
      return { minX: -Infinity, maxX: Infinity, minY: -Infinity, maxY: Infinity };
    }

    const baseLeft = rootRect.left - renderedPosition.x;
    const baseTop = rootRect.top - renderedPosition.y;
    const x = rangeForOverlay(boundaryRect.left - baseLeft, boundaryRect.right - baseLeft - rootRect.width, renderedPosition.x);
    const y = rangeForOverlay(boundaryRect.top - baseTop, boundaryRect.bottom - baseTop - rootRect.height, renderedPosition.y);
    return { minX: x.min, maxX: x.max, minY: y.min, maxY: y.max };
  }, []);

  const changePosition = useCallback((requestedPosition, event, source = 'programmatic', extra = {}) => {
    const previousPosition = latestPositionRef.current || currentPosition;
    const requested = typeof requestedPosition === 'function' ? requestedPosition(previousPosition) : requestedPosition;
    const candidate = normalizeOverlayPosition(requested, previousPosition);
    const bounds = getPositionBounds();
    const nextPosition = {
      x: Math.round(clamp(candidate.x, bounds.minX, bounds.maxX)),
      y: Math.round(clamp(candidate.y, bounds.minY, bounds.maxY))
    };
    const changed = !overlayPositionsEqual(previousPosition, nextPosition);
    const metadata = {
      changed,
      previousPosition,
      position: nextPosition,
      source,
      edge: currentEdge,
      bounds,
      ...extra
    };
    if (changed) {
      latestPositionRef.current = nextPosition;
      setStoredPosition(nextPosition, metadata, event);
    }
    return metadata;
  }, [currentEdge, currentPosition, getPositionBounds, setStoredPosition]);

  const changeCollapsed = useCallback((requestedCollapsed, event, source = 'programmatic') => {
    const previousCollapsed = collapsedRef.current;
    const nextCollapsed = Boolean(typeof requestedCollapsed === 'function' ? requestedCollapsed(previousCollapsed) : requestedCollapsed);
    const metadata = {
      changed: previousCollapsed !== nextCollapsed,
      previousCollapsed,
      collapsed: nextCollapsed,
      source,
      edge: currentEdge
    };
    if (metadata.changed) {
      collapsedRef.current = nextCollapsed;
      setStoredCollapsed(nextCollapsed, metadata, event);
    }
    return metadata;
  }, [currentEdge, setStoredCollapsed]);

  const releasePointerCapture = useCallback(drag => {
    try {
      if (drag?.pointerId !== undefined && drag.handle?.hasPointerCapture?.(drag.pointerId)) drag.handle.releasePointerCapture?.(drag.pointerId);
    } catch {
      // Pointer capture may already have been released by the browser.
    }
  }, []);

  const removeWindowListeners = useCallback(() => {
    const listeners = activeListenersRef.current;
    activeListenersRef.current = null;
    if (!listeners || typeof window === 'undefined') return;
    window.removeEventListener('pointermove', listeners.move);
    window.removeEventListener('pointerup', listeners.end);
    window.removeEventListener('pointercancel', listeners.cancel);
  }, []);

  const movePointer = useCallback(event => {
    const drag = dragRef.current;
    if (!drag || !overlayPointerMatches(drag, event) || event.defaultPrevented) return;
    const clientX = Number(event.clientX);
    const clientY = Number(event.clientY);
    if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) return;
    const deltaX = clientX - drag.startClientX;
    const deltaY = clientY - drag.startClientY;
    if (!drag.moved && Math.hypot(deltaX, deltaY) >= 3) {
      drag.moved = true;
      setDragging(true);
      onDragStart?.(drag.startPosition, { edge: currentEdge, source: 'pointer' }, event);
    }
    if (!drag.moved) return;
    if (event.cancelable) event.preventDefault();
    changePosition({ x: drag.startPosition.x + deltaX, y: drag.startPosition.y + deltaY }, event, 'pointer', {
      axis: 'both',
      dragging: true
    });
  }, [changePosition, currentEdge, onDragStart]);

  const finishPointer = useCallback((event, cancelled = false) => {
    const drag = dragRef.current;
    if (!drag || (event && !overlayPointerMatches(drag, event))) return;
    dragRef.current = null;
    removeWindowListeners();
    releasePointerCapture(drag);
    setDragging(false);
    suppressClickRef.current = Boolean(drag.moved);
    if (!drag.moved) return;
    const positionAtEnd = latestPositionRef.current || drag.startPosition;
    onDragEnd?.(positionAtEnd, {
      changed: !overlayPositionsEqual(drag.startPosition, positionAtEnd),
      cancelled: Boolean(cancelled),
      edge: currentEdge,
      source: 'pointer'
    }, event);
  }, [currentEdge, onDragEnd, releasePointerCapture, removeWindowListeners]);

  const startPointer = event => {
    if (event.defaultPrevented || (event.button !== undefined && event.button !== 0)) return;
    const pointerId = event.pointerId;
    const startClientX = Number(event.clientX);
    const startClientY = Number(event.clientY);
    if (!Number.isFinite(startClientX) || !Number.isFinite(startClientY)) return;
    const handle = event.currentTarget;
    const startPosition = latestPositionRef.current || currentPosition;
    dragRef.current = {
      pointerId,
      handle,
      startClientX,
      startClientY,
      startPosition,
      moved: false
    };
    suppressClickRef.current = false;
    try {
      handle.setPointerCapture?.(pointerId);
    } catch {
      // Some test and browser implementations do not expose pointer capture.
    }
    if (typeof window !== 'undefined') {
      const listeners = {
        move: movePointer,
        end: pointerEvent => finishPointer(pointerEvent, false),
        cancel: pointerEvent => finishPointer(pointerEvent, true)
      };
      activeListenersRef.current = listeners;
      window.addEventListener('pointermove', listeners.move);
      window.addEventListener('pointerup', listeners.end);
      window.addEventListener('pointercancel', listeners.cancel);
    }
  };

  const keyDownHandle = event => {
    if (event.defaultPrevented) return;
    const multiplier = event.shiftKey ? 4 : 1;
    const delta = keyboardStep * multiplier;
    const bounds = getPositionBounds();
    const previousPosition = latestPositionRef.current || currentPosition;
    let nextPosition;
    if (event.key === 'ArrowLeft') nextPosition = { ...previousPosition, x: previousPosition.x - delta };
    if (event.key === 'ArrowRight') nextPosition = { ...previousPosition, x: previousPosition.x + delta };
    if (event.key === 'ArrowUp') nextPosition = { ...previousPosition, y: previousPosition.y - delta };
    if (event.key === 'ArrowDown') nextPosition = { ...previousPosition, y: previousPosition.y + delta };
    if (event.key === 'Home' && Number.isFinite(bounds.minX) && Number.isFinite(bounds.minY)) nextPosition = { x: bounds.minX, y: bounds.minY };
    if (event.key === 'End' && Number.isFinite(bounds.maxX) && Number.isFinite(bounds.maxY)) nextPosition = { x: bounds.maxX, y: bounds.maxY };
    if (!nextPosition) return;
    event.preventDefault();
    changePosition(nextPosition, event, 'keyboard', { key: event.key, multiplier });
  };

  const clickHandle = event => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      event.preventDefault();
      return;
    }
    changeCollapsed(nextCollapsed => !nextCollapsed, event, 'toggle');
  };

  useEffect(() => () => {
    const drag = dragRef.current;
    dragRef.current = null;
    removeWindowListeners();
    releasePointerCapture(drag);
  }, [releasePointerCapture, removeWindowListeners]);

  useEffect(() => {
    if (!isCollapsed || typeof document === 'undefined') return;
    const content = document.getElementById(contentId);
    if (content?.contains(document.activeElement)) focusElement(handleRef.current);
  }, [contentId, isCollapsed]);

  useEffect(() => {
    const root = rootRef.current;
    const boundary = root?.parentElement;
    if (!root || !boundary) return undefined;
    const keepInsideBoundary = () => changePosition(latestPositionRef.current || currentPosition, undefined, 'boundary');
    keepInsideBoundary();
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(keepInsideBoundary);
      observer.observe(root);
      observer.observe(boundary);
      return () => observer.disconnect();
    }
    if (typeof window === 'undefined') return undefined;
    window.addEventListener('resize', keepInsideBoundary);
    return () => window.removeEventListener('resize', keepInsideBoundary);
  }, [changePosition, currentPosition, isCollapsed]);

  const collapseLabel = isCollapsed ? `Expand ${label}` : `Collapse ${label}`;
  const resolvedHandleLabel = handleLabel ? `${handleLabel}. ${collapseLabel}` : collapseLabel;
  const hasHandleIcon = handleIcon !== undefined && handleIcon !== null && handleIcon !== false;
  const HandleIcon = typeof handleIcon === 'function' ? handleIcon : null;
  const handleGlyph = currentEdge === 'top'
    ? isCollapsed ? '⌄' : '⌃'
    : currentEdge === 'bottom'
      ? isCollapsed ? '⌃' : '⌄'
      : isCollapsed
        ? currentEdge === 'left' ? '›' : '‹'
        : currentEdge === 'left' ? '‹' : '›';
  const overlayStyle = {
    ...style,
    '--cad-movable-overlay-x': `${currentPosition.x}px`,
    '--cad-movable-overlay-y': `${currentPosition.y}px`
  };

  return <aside
    {...props}
    ref={rootRef}
    className={cx('cad-movable-overlay', className)}
    style={overlayStyle}
    data-edge={currentEdge}
    data-has-handle-icon={hasHandleIcon ? 'true' : 'false'}
    data-collapsed={isCollapsed ? 'true' : 'false'}
    data-dragging={isDragging ? 'true' : 'false'}
    data-position-x={currentPosition.x}
    data-position-y={currentPosition.y}
    aria-label={ariaLabel || label}
  >
    <div id={contentId} className="cad-movable-overlay__content" hidden={isCollapsed}>{children}</div>
    <button
      type="button"
      ref={handleRef}
      className="cad-movable-overlay__handle"
      aria-label={resolvedHandleLabel}
      aria-controls={contentId}
      aria-expanded={!isCollapsed}
      aria-describedby={instructionId}
      title={`${collapseLabel}. Drag to move; Arrow keys nudge.`}
      onPointerDown={startPointer}
      onPointerMove={movePointer}
      onPointerUp={event => finishPointer(event, false)}
      onPointerCancel={event => finishPointer(event, true)}
      onLostPointerCapture={event => finishPointer(event, true)}
      onKeyDown={keyDownHandle}
      onClick={clickHandle}
    >
      <span className="cad-movable-overlay__identity" aria-hidden="true">
        {hasHandleIcon && <span className="cad-movable-overlay__icon">{HandleIcon ? <HandleIcon size={12} aria-hidden="true" /> : handleIcon}</span>}
        <span className="cad-movable-overlay__ridges" />
      </span>
      <span className="cad-movable-overlay__chevron" aria-hidden="true">{handleGlyph}</span>
    </button>
    <span id={instructionId} className="cad-cui-sr-only">Drag to move this overlay. Arrow keys nudge it, Shift plus an arrow key moves it farther, and Home or End moves it to a viewport corner. Click to {isCollapsed ? 'expand' : 'collapse'} it.</span>
  </aside>;
}

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
export function CadPopover({
  trigger,
  content,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-start',
  label = 'More options',
  contentRole = 'region',
  closeOnOutside = true,
  closeOnEscape = true,
  closeOnFocusOutside = false,
  closeOnPointerLeave = false,
  restoreFocus = true,
  focusOnOpen,
  className,
  contentClassName,
  onKeyDown,
  onBlur,
  onPointerLeave,
  ...props
}) {
  const generatedId = useId();
  const panelId = `cad-popover-${generatedId}`;
  const rootRef = useRef(null);
  const contentRef = useRef(null);
  const wasOpenRef = useRef(open === undefined ? defaultOpen : open);
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, (nextValue, event) => onOpenChange?.(nextValue, event));
  const resolvedContentRole = contentRole === false ? undefined : contentRole;
  const popupAriaHasPopup = ['dialog', 'grid', 'listbox', 'menu', 'tree'].includes(resolvedContentRole) ? resolvedContentRole : undefined;
  const shouldFocusOnOpen = focusOnOpen ?? resolvedContentRole === 'dialog';
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
    if (!isOpen || !shouldFocusOnOpen || typeof window === 'undefined') return undefined;
    const timer = window.setTimeout(() => {
      const contentElement = contentRef.current;
      const focusable = focusableChildren(contentElement);
      const preferred = focusable.find(element => element.hasAttribute('data-autofocus'));
      focusElement(preferred || focusable[0] || contentElement);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isOpen, shouldFocusOnOpen]);

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
  const handleKeyDown = event => {
    onKeyDown?.(event);
    if (!event.defaultPrevented && closeOnEscape && event.key === 'Escape' && isOpen) {
      event.preventDefault();
      close(event);
    }
  };
  const handleBlur = event => {
    onBlur?.(event);
    if (!event.defaultPrevented && closeOnFocusOutside && isOpen && !targetIsInside(event.currentTarget, event.relatedTarget)) close(event);
  };
  const handlePointerLeave = event => {
    onPointerLeave?.(event);
    if (!event.defaultPrevented && closeOnPointerLeave && isOpen && !targetIsInside(event.currentTarget, event.relatedTarget)) close(event);
  };

  return <div {...props} ref={rootRef} className={cx('cad-popover', `cad-popover--${placement}`, className)} onKeyDown={handleKeyDown} onBlur={handleBlur} onPointerLeave={handlePointerLeave}>
    {triggerElement}
    {isOpen && <div id={panelId} ref={contentRef} tabIndex={shouldFocusOnOpen ? -1 : undefined} className={cx('cad-popover__content', contentClassName)} role={resolvedContentRole} aria-label={label}>{typeof content === 'function' ? content({ close }) : content}</div>}
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
