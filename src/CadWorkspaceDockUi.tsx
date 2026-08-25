import type { CadAnyProps } from './cad-types';
import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { CadDockTabs } from './CadWorkspaceUi';
import { asArray, clamp, cx, useControllableState } from './cadUiUtils';

/** The compact visibility states a host can persist for a workspace dock. */
export const CAD_WORKSPACE_DOCK_MODES = Object.freeze({
  OPEN: 'open',
  RAIL: 'rail',
  CLOSED: 'closed'
});

const DOCK_MODE_VALUES = new Set<string>(Object.values(CAD_WORKSPACE_DOCK_MODES));
const DOCK_EDGES = new Set(['left', 'right', 'top', 'bottom']);
const DOCK_RAIL_EDGES = new Set(['left', 'right', 'bottom']);

const finiteNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const pixelValue = (value, fallback, minimum, maximum) => clamp(
  Math.round(finiteNumber(value, fallback)),
  minimum,
  maximum
);

const resolveBounds = (minSize, maxSize) => {
  const minimum = Math.max(0, Math.round(finiteNumber(minSize, 72)));
  const maximum = Math.max(minimum, Math.round(finiteNumber(maxSize, 720)));
  return { minimum, maximum };
};

const resolveStep = value => Math.max(1, Math.round(finiteNumber(value, 16)));

const normalizeMode = (value: unknown, fallback: string = CAD_WORKSPACE_DOCK_MODES.OPEN): string => {
  const candidate = String(value ?? '').trim().toLocaleLowerCase();
  return DOCK_MODE_VALUES.has(candidate) ? candidate : fallback;
};

const normalizePreviewMount = (value, fallback = 'always') => {
  const candidate = String(value ?? '').trim().toLocaleLowerCase();
  return candidate === 'when-open' || candidate === 'always' ? candidate : fallback;
};

const normalizeEdge = edge => DOCK_EDGES.has(edge) ? edge : 'left';

const edgeDetails = edge => {
  const resolvedEdge = normalizeEdge(edge);
  const horizontal = resolvedEdge === 'left' || resolvedEdge === 'right';
  const growsWithPositiveMovement = resolvedEdge === 'left' || resolvedEdge === 'top';
  return {
    edge: resolvedEdge,
    axis: horizontal ? 'x' : 'y',
    orientation: horizontal ? 'vertical' : 'horizontal',
    growsWithPositiveMovement,
    growKey: horizontal
      ? (growsWithPositiveMovement ? 'ArrowRight' : 'ArrowLeft')
      : (growsWithPositiveMovement ? 'ArrowDown' : 'ArrowUp'),
    shrinkKey: horizontal
      ? (growsWithPositiveMovement ? 'ArrowLeft' : 'ArrowRight')
      : (growsWithPositiveMovement ? 'ArrowUp' : 'ArrowDown')
  };
};

const pointerMatches = (drag, event) => {
  if (!drag) return false;
  // Some DOM shims do not expose pointerId. In that case the active capture
  // is still the only session and should be allowed to finish cleanly.
  if (drag.pointerId === null || event?.pointerId === null || event?.pointerId === undefined) return true;
  return event.pointerId === drag.pointerId;
};

/**
 * Host-owned dock intent, without choosing a layout engine or writing any
 * persistence. `size` is always a clamped pixel count, while `mode` remains a
 * serializable `open`, `rail`, or `closed` value.
 */
export function useCadWorkspaceDock({
  mode,
  defaultMode = CAD_WORKSPACE_DOCK_MODES.OPEN,
  onModeChange,
  size,
  defaultSize = 280,
  minSize = 72,
  maxSize = 720,
  onSizeChange
}: CadAnyProps = {}) {
  const { minimum, maximum } = resolveBounds(minSize, maxSize);
  const initialMode = normalizeMode(defaultMode);
  const initialSize = pixelValue(defaultSize, 280, minimum, maximum);
  const [storedMode, setStoredMode] = useControllableState(
    mode,
    initialMode,
    (nextMode, change, event) => onModeChange?.(normalizeMode(nextMode, initialMode), change, event)
  );
  const [storedSize, setStoredSize] = useControllableState(
    size,
    initialSize,
    (nextSize, change, event) => onSizeChange?.(pixelValue(nextSize, initialSize, minimum, maximum), change, event)
  );
  const currentMode = normalizeMode(storedMode, initialMode);
  const currentSize = pixelValue(storedSize, initialSize, minimum, maximum);

  const setMode = useCallback((nextValue, event, source = 'programmatic') => {
    const requested = typeof nextValue === 'function' ? nextValue(currentMode) : nextValue;
    const nextMode = normalizeMode(requested, currentMode);
    const change = {
      changed: nextMode !== currentMode,
      mode: nextMode,
      previousMode: currentMode,
      source
    };
    if (change.changed) setStoredMode(nextMode, change, event);
    return change;
  }, [currentMode, setStoredMode]);

  const setSize = useCallback((nextValue, event, source = 'programmatic', metadata = {}) => {
    const requested = typeof nextValue === 'function' ? nextValue(currentSize) : nextValue;
    const nextSize = pixelValue(requested, currentSize, minimum, maximum);
    const change = {
      changed: nextSize !== currentSize,
      size: nextSize,
      previousSize: currentSize,
      minSize: minimum,
      maxSize: maximum,
      ...metadata,
      source
    };
    if (change.changed) setStoredSize(nextSize, change, event);
    return change;
  }, [currentSize, maximum, minimum, setStoredSize]);

  const open = useCallback((event, source = 'open') => setMode(CAD_WORKSPACE_DOCK_MODES.OPEN, event, source), [setMode]);
  const rail = useCallback((event, source = 'rail') => setMode(CAD_WORKSPACE_DOCK_MODES.RAIL, event, source), [setMode]);
  const close = useCallback((event, source = 'close') => setMode(CAD_WORKSPACE_DOCK_MODES.CLOSED, event, source), [setMode]);

  return {
    mode: currentMode,
    size: currentSize,
    minSize: minimum,
    maxSize: maximum,
    setMode,
    setSize,
    open,
    rail,
    close,
    isOpen: currentMode === CAD_WORKSPACE_DOCK_MODES.OPEN,
    isRail: currentMode === CAD_WORKSPACE_DOCK_MODES.RAIL,
    isClosed: currentMode === CAD_WORKSPACE_DOCK_MODES.CLOSED
  };
}

/**
 * A three-position visibility control for a dock. It reports intent only; the
 * host decides whether rail means a tab strip, a compact inspector, or another
 * view entirely.
 */
export function CadWorkspaceDockModeControl({
  mode,
  defaultMode = CAD_WORKSPACE_DOCK_MODES.OPEN,
  onModeChange,
  label = 'Workspace dock',
  controls,
  disabled = false,
  openDisabled = false,
  railDisabled = false,
  hideDisabled = false,
  openLabel,
  railLabel,
  hideLabel,
  onOpenClick,
  onRailClick,
  onHideClick,
  className,
  'aria-label': ariaLabel,
  'aria-controls': ariaControls,
  ...props
}: CadAnyProps) {
  const dock = useCadWorkspaceDock({ mode, defaultMode, onModeChange });
  const resolvedControls = ariaControls || controls;
  const resolvedLabel = String(label || 'Workspace dock');
  const items = [
    {
      mode: CAD_WORKSPACE_DOCK_MODES.OPEN,
      label: openLabel || `Open ${resolvedLabel}`,
      caption: 'OPEN',
      symbol: '▤',
      disabled: disabled || openDisabled,
      onClick: onOpenClick
    },
    {
      mode: CAD_WORKSPACE_DOCK_MODES.RAIL,
      label: railLabel || `Rail ${resolvedLabel}`,
      caption: 'RAIL',
      symbol: '▥',
      disabled: disabled || railDisabled,
      onClick: onRailClick
    },
    {
      mode: CAD_WORKSPACE_DOCK_MODES.CLOSED,
      label: hideLabel || `Hide ${resolvedLabel}`,
      caption: 'HIDE',
      symbol: '×',
      disabled: disabled || hideDisabled,
      onClick: onHideClick
    }
  ];

  const selectMode = (nextMode, event, callback) => {
    callback?.(event, dock);
    if (!event.defaultPrevented) dock.setMode(nextMode, event, 'mode-control');
  };

  return <div
    {...props}
    className={cx('cad-workspace-dock-mode-control', className)}
    data-mode={dock.mode}
    role="group"
    aria-label={ariaLabel || `${resolvedLabel} visibility`}
  >
    {items.map(item => <button
      key={item.mode}
      type="button"
      className="cad-workspace-dock-mode-control__action"
      data-mode={item.mode}
      data-active={dock.mode === item.mode ? 'true' : 'false'}
      aria-label={item.label}
      aria-controls={resolvedControls}
      aria-pressed={dock.mode === item.mode}
      disabled={item.disabled}
      title={item.label}
      onClick={event => selectMode(item.mode, event, item.onClick)}
    >
      <span aria-hidden="true">{item.symbol}</span>
      <span>{item.caption}</span>
    </button>)}
  </div>;
}

/**
 * Pixel-based dock separator. `edge` describes where the dock is anchored:
 * left grows rightward, right grows leftward, top grows downward, and bottom
 * grows upward. The pointer and arrow keys mirror that physical direction.
 */
export const CadWorkspaceDockResizeHandle = forwardRef<HTMLDivElement, CadAnyProps>(function CadWorkspaceDockResizeHandle({
  size,
  defaultSize = 280,
  minSize = 72,
  maxSize = 720,
  resizeStep = 16,
  edge = 'left',
  onSizeChange,
  onResizeStart,
  onResizeEnd,
  disabled = false,
  label = 'dock',
  separatorLabel,
  controls,
  className,
  children,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  onKeyDown,
  'aria-label': ariaLabel,
  'aria-controls': ariaControls,
  ...props
}: CadAnyProps, ref) {
  const dock = useCadWorkspaceDock({
    size,
    defaultSize,
    minSize,
    maxSize,
    onSizeChange
  });
  const configuration = useMemo(() => edgeDetails(edge), [edge]);
  const resolvedStep = resolveStep(resizeStep);
  const dragRef = useRef(null);
  const activeListenersRef = useRef(null);
  const latestSizeRef = useRef(dock.size);
  const setSizeRef = useRef(dock.setSize);
  const onResizeStartRef = useRef(onResizeStart);
  const onResizeEndRef = useRef(onResizeEnd);
  const [isResizing, setResizing] = useState(false);

  setSizeRef.current = dock.setSize;
  onResizeStartRef.current = onResizeStart;
  onResizeEndRef.current = onResizeEnd;

  useEffect(() => {
    if (!dragRef.current) latestSizeRef.current = dock.size;
  }, [dock.size]);

  const releasePointerCapture = useCallback(drag => {
    try {
      if (drag?.pointerId !== null && drag?.pointerId !== undefined && drag?.handle?.hasPointerCapture?.(drag.pointerId)) {
        drag.handle.releasePointerCapture?.(drag.pointerId);
      }
    } catch {
      // Pointer capture can have already been released by the browser.
    }
  }, []);

  const pointerMoveHandler = useCallback(event => {
    const drag = dragRef.current;
    if (!drag || !pointerMatches(drag, event) || event.defaultPrevented) return;
    const coordinate = drag.axis === 'x' ? Number(event.clientX) : Number(event.clientY);
    if (!Number.isFinite(coordinate)) return;
    const signedDelta = (coordinate - drag.startCoordinate) * (drag.growsWithPositiveMovement ? 1 : -1);
    const nextSize = pixelValue(drag.startSize + signedDelta, drag.startSize, drag.minSize, drag.maxSize);
    latestSizeRef.current = nextSize;
    setSizeRef.current?.(nextSize, event, 'pointer', {
      edge: drag.edge,
      orientation: drag.orientation,
      axis: drag.axis
    });
  }, []);

  const removeWindowListeners = useCallback(() => {
    const listeners = activeListenersRef.current;
    activeListenersRef.current = null;
    if (!listeners || typeof window === 'undefined') return;
    window.removeEventListener('pointermove', listeners.pointerMove);
    window.removeEventListener('pointerup', listeners.pointerEnd);
    window.removeEventListener('pointercancel', listeners.pointerCancel);
  }, []);

  const finishResize = useCallback((event, cancelled = false) => {
    const drag = dragRef.current;
    if (!drag || !pointerMatches(drag, event)) return;
    dragRef.current = null;
    removeWindowListeners();
    releasePointerCapture(drag);
    setResizing(false);
    const finalSize = pixelValue(latestSizeRef.current, drag.startSize, drag.minSize, drag.maxSize);
    latestSizeRef.current = finalSize;
    onResizeEndRef.current?.(finalSize, {
      changed: finalSize !== drag.startSize,
      source: 'pointer',
      edge: drag.edge,
      orientation: drag.orientation,
      axis: drag.axis,
      cancelled: Boolean(cancelled)
    }, event);
  }, [releasePointerCapture, removeWindowListeners]);

  const pointerEndHandler = useCallback(event => finishResize(event, false), [finishResize]);
  const pointerCancelHandler = useCallback(event => finishResize(event, true), [finishResize]);

  useEffect(() => () => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    removeWindowListeners();
    releasePointerCapture(drag);
    const finalSize = pixelValue(latestSizeRef.current, drag.startSize, drag.minSize, drag.maxSize);
    onResizeEndRef.current?.(finalSize, {
      changed: finalSize !== drag.startSize,
      source: 'pointer',
      edge: drag.edge,
      orientation: drag.orientation,
      axis: drag.axis,
      cancelled: true,
      reason: 'unmount'
    });
  }, [releasePointerCapture, removeWindowListeners]);

  useEffect(() => {
    if (disabled) finishResize(undefined, true);
  }, [disabled, finishResize]);

  const startResize = event => {
    if (disabled || dragRef.current || (event.button !== undefined && event.button !== 0)) return;
    onPointerDown?.(event);
    if (event.defaultPrevented) return;
    const startCoordinate = configuration.axis === 'x' ? Number(event.clientX) : Number(event.clientY);
    if (!Number.isFinite(startCoordinate)) return;
    event.preventDefault();
    const pointerId = event.pointerId === undefined || event.pointerId === null ? null : event.pointerId;
    const drag = {
      pointerId,
      handle: event.currentTarget,
      startCoordinate,
      startSize: dock.size,
      minSize: dock.minSize,
      maxSize: dock.maxSize,
      ...configuration
    };
    latestSizeRef.current = dock.size;
    dragRef.current = drag;
    try {
      if (pointerId !== null) event.currentTarget.setPointerCapture?.(pointerId);
    } catch {
      // The global listeners below remain a reliable fallback.
    }
    setResizing(true);
    onResizeStartRef.current?.(dock.size, {
      source: 'pointer',
      edge: configuration.edge,
      orientation: configuration.orientation,
      axis: configuration.axis
    }, event);
    if (typeof window !== 'undefined') {
      const listeners = {
        pointerMove: pointerMoveHandler,
        pointerEnd: pointerEndHandler,
        pointerCancel: pointerCancelHandler
      };
      activeListenersRef.current = listeners;
      window.addEventListener('pointermove', listeners.pointerMove);
      window.addEventListener('pointerup', listeners.pointerEnd);
      window.addEventListener('pointercancel', listeners.pointerCancel);
    }
  };

  const resizeByKeyboard = (amount, event) => {
    const baseSize = pixelValue(latestSizeRef.current, dock.size, dock.minSize, dock.maxSize);
    const nextSize = pixelValue(baseSize + amount, baseSize, dock.minSize, dock.maxSize);
    latestSizeRef.current = nextSize;
    dock.setSize(nextSize, event, 'keyboard', {
      edge: configuration.edge,
      orientation: configuration.orientation,
      axis: configuration.axis
    });
  };

  const resizeToKeyboardBound = (bound, event) => {
    const nextSize = bound === 'min' ? dock.minSize : dock.maxSize;
    latestSizeRef.current = nextSize;
    dock.setSize(nextSize, event, 'keyboard', {
      edge: configuration.edge,
      orientation: configuration.orientation,
      axis: configuration.axis
    });
  };

  const handleKeyDown = event => {
    onKeyDown?.(event);
    if (disabled || event.defaultPrevented) return;
    const step = resolvedStep * (event.shiftKey ? 3 : 1);
    if (event.key === configuration.growKey) {
      event.preventDefault();
      resizeByKeyboard(step, event);
      return;
    }
    if (event.key === configuration.shrinkKey) {
      event.preventDefault();
      resizeByKeyboard(-step, event);
      return;
    }
    if (event.key === 'PageUp') {
      event.preventDefault();
      resizeByKeyboard(step * 3, event);
      return;
    }
    if (event.key === 'PageDown') {
      event.preventDefault();
      resizeByKeyboard(-step * 3, event);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      resizeToKeyboardBound('min', event);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      resizeToKeyboardBound('max', event);
    }
  };

  const resolvedControls = ariaControls || controls;
  const resolvedSeparatorLabel = ariaLabel || separatorLabel || `Resize ${label}`;

  return <div
    {...props}
    ref={ref}
    className={cx('cad-workspace-dock-resize-handle', className)}
    data-edge={configuration.edge}
    data-orientation={configuration.orientation}
    data-resizing={isResizing ? 'true' : 'false'}
    data-disabled={disabled ? 'true' : 'false'}
    role="separator"
    tabIndex={disabled ? -1 : 0}
    aria-label={resolvedSeparatorLabel}
    aria-controls={resolvedControls}
    aria-disabled={disabled || undefined}
    aria-orientation={configuration.orientation as 'horizontal' | 'vertical'}
    aria-valuemin={dock.minSize}
    aria-valuemax={dock.maxSize}
    aria-valuenow={dock.size}
    aria-valuetext={`${dock.size} pixels`}
    onPointerDown={startResize}
    onPointerMove={onPointerMove}
    onPointerUp={event => {
      onPointerUp?.(event);
      finishResize(event, false);
    }}
    onPointerCancel={event => {
      onPointerCancel?.(event);
      finishResize(event, true);
    }}
    onLostPointerCapture={event => {
      onLostPointerCapture?.(event);
      finishResize(event, true);
    }}
    onKeyDown={handleKeyDown}
  >
    {children || <span className="cad-workspace-dock-resize-handle__grip" aria-hidden="true" />}
  </div>;
});

CadWorkspaceDockResizeHandle.displayName = 'CadWorkspaceDockResizeHandle';

const normalizeRailEdge = edge => DOCK_RAIL_EDGES.has(edge) ? edge : 'left';

/**
 * Controlled/uncontrolled temporary visibility for a collapsed dock rail.
 * This stays deliberately separate from the durable dock `mode`: a hover peek
 * should never rewrite a saved workspace layout.
 */
export function useCadWorkspaceDockRail({
  peekOpen,
  defaultPeekOpen = false,
  onPeekOpenChange,
  edge = 'left'
}: CadAnyProps = {}) {
  const resolvedEdge = normalizeRailEdge(edge);
  const [storedPeekOpen, setStoredPeekOpen] = useControllableState(
    peekOpen,
    Boolean(defaultPeekOpen),
    (nextOpen, change, event) => onPeekOpenChange?.(Boolean(nextOpen), change, event)
  );
  const isPeekOpen = Boolean(storedPeekOpen);

  const setPeekOpen = useCallback((nextValue, event, source = 'programmatic') => {
    const nextOpen = Boolean(typeof nextValue === 'function' ? nextValue(isPeekOpen) : nextValue);
    const change = {
      changed: nextOpen !== isPeekOpen,
      open: nextOpen,
      previousOpen: isPeekOpen,
      edge: resolvedEdge,
      source
    };
    if (change.changed) setStoredPeekOpen(nextOpen, change, event);
    return change;
  }, [isPeekOpen, resolvedEdge, setStoredPeekOpen]);

  const openPeek = useCallback((event, source = 'programmatic') => setPeekOpen(true, event, source), [setPeekOpen]);
  const closePeek = useCallback((event, source = 'programmatic') => setPeekOpen(false, event, source), [setPeekOpen]);

  return {
    edge: resolvedEdge,
    peekOpen: isPeekOpen,
    setPeekOpen,
    openPeek,
    closePeek
  };
}

const targetIsInside = (container, target) => {
  if (!container || !target) return false;
  try { return container === target || Boolean(container.contains?.(target)); } catch { return false; }
};

/**
 * A compact dock rail that opens a preview while it is hovered or focused.
 * Static preview children stay mounted by default, preserving state between
 * short peeks. A render function defaults to lazy mounting so expensive
 * previews only exist while the rail is active. Clicking the rail only reports
 * `onExpand`; the host can then make its own durable open-mode/layout decision.
 */
export function CadWorkspaceDockRail({
  edge = 'left',
  label = 'Workspace dock',
  previewLabel,
  expandLabel,
  children,
  renderPreview,
  previewMount,
  peekOpen,
  defaultPeekOpen = false,
  onPeekOpenChange,
  onExpand,
  disabled = false,
  id,
  controls,
  className,
  railClassName,
  previewClassName,
  onPointerEnter,
  onPointerLeave,
  onFocusCapture,
  onBlurCapture,
  onKeyDown,
  'aria-label': ariaLabel,
  ...props
}: CadAnyProps) {
  const generatedId = useId();
  const railButtonRef = useRef(null);
  const interactionsRef = useRef({ pointer: false, focus: false, dismissed: false });
  const resolvedEdge = normalizeRailEdge(edge);
  const rootId = id || `cad-workspace-dock-rail-${generatedId}`;
  const labelId = `${rootId}-label`;
  const previewId = `${rootId}-preview`;
  const rail = useCadWorkspaceDockRail({
    edge: resolvedEdge,
    peekOpen,
    defaultPeekOpen,
    onPeekOpenChange
  });
  const isPeekOpen = !disabled && rail.peekOpen;
  const resolvedLabel = String(label || 'Workspace dock');
  const resolvedPreviewLabel = previewLabel || `${resolvedLabel} preview`;
  const resolvedExpandLabel = expandLabel || `Expand ${resolvedLabel}`;
  const previewRenderer = typeof renderPreview === 'function'
    ? renderPreview
    : typeof children === 'function' ? children : null;
  const resolvedPreviewMount = normalizePreviewMount(
    previewMount,
    previewRenderer ? 'when-open' : 'always'
  );
  const previewContext = useMemo(() => ({
    active: isPeekOpen,
    peekOpen: isPeekOpen,
    edge: resolvedEdge,
    label: resolvedLabel,
    previewId,
    controls: controls || previewId,
    disabled: Boolean(disabled)
  }), [controls, disabled, isPeekOpen, previewId, resolvedEdge, resolvedLabel]);
  const shouldRenderPreview = isPeekOpen || resolvedPreviewMount === 'always';
  const previewContent = shouldRenderPreview
    ? previewRenderer ? previewRenderer(previewContext) : children
    : null;

  const requestOpen = (event, source) => {
    if (disabled) return;
    interactionsRef.current.dismissed = false;
    rail.openPeek(event, source);
  };

  const requestCloseWhenIdle = (event, source) => {
    const interactions = interactionsRef.current;
    if (disabled || interactions.pointer || interactions.focus) return;
    interactions.dismissed = false;
    rail.closePeek(event, source);
  };

  const handlePointerEnter = event => {
    onPointerEnter?.(event);
    if (event.defaultPrevented || disabled) return;
    interactionsRef.current.pointer = true;
    requestOpen(event, 'pointer-enter');
  };

  const handlePointerLeave = event => {
    onPointerLeave?.(event);
    if (event.defaultPrevented || disabled || targetIsInside(event.currentTarget, event.relatedTarget)) return;
    interactionsRef.current.pointer = false;
    requestCloseWhenIdle(event, 'pointer-leave');
  };

  const handleFocusCapture = event => {
    onFocusCapture?.(event);
    if (event.defaultPrevented || disabled) return;
    interactionsRef.current.focus = true;
    if (!interactionsRef.current.dismissed) requestOpen(event, 'focus-enter');
  };

  const handleBlurCapture = event => {
    onBlurCapture?.(event);
    if (event.defaultPrevented || disabled || targetIsInside(event.currentTarget, event.relatedTarget)) return;
    interactionsRef.current.focus = false;
    requestCloseWhenIdle(event, 'focus-leave');
  };

  const handleKeyDown = event => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || event.key !== 'Escape' || !isPeekOpen) return;
    event.preventDefault();
    interactionsRef.current.dismissed = true;
    rail.closePeek(event, 'escape');
    railButtonRef.current?.focus();
  };

  const expand = event => {
    if (disabled) return;
    const details = {
      edge: resolvedEdge,
      label: resolvedLabel,
      previewId,
      controls: controls || previewId,
      source: 'rail-expand'
    };
    onExpand?.(event, details);
    if (!event.defaultPrevented) requestOpen(event, 'expand');
  };

  return <section
    {...props}
    id={rootId}
    className={cx('cad-workspace-dock-rail', className)}
    data-edge={resolvedEdge}
    data-peek-open={isPeekOpen ? 'true' : 'false'}
    data-preview-mount={resolvedPreviewMount}
    data-preview-rendered={shouldRenderPreview ? 'true' : 'false'}
    data-disabled={disabled ? 'true' : 'false'}
    onPointerEnter={handlePointerEnter}
    onPointerLeave={handlePointerLeave}
    onFocusCapture={handleFocusCapture}
    onBlurCapture={handleBlurCapture}
    onKeyDown={handleKeyDown}
  >
    <button
      ref={railButtonRef}
      id={labelId}
      type="button"
      className={cx('cad-workspace-dock-rail__label', railClassName)}
      aria-label={ariaLabel || `Preview ${resolvedLabel}`}
      aria-controls={previewId}
      aria-expanded={isPeekOpen}
      disabled={disabled}
      title={resolvedExpandLabel}
      onClick={expand}
    >
      <span className="cad-workspace-dock-rail__signal" aria-hidden="true"><i /><i /><i /></span>
      <span>{resolvedLabel}</span>
      <small aria-hidden="true">PEEK</small>
    </button>
    <aside
      id={previewId}
      className={cx('cad-workspace-dock-rail__preview', previewClassName)}
      data-edge={resolvedEdge}
      role="region"
      aria-label={previewLabel ? resolvedPreviewLabel : undefined}
      aria-labelledby={previewLabel ? undefined : labelId}
      aria-hidden={!isPeekOpen}
      hidden={!isPeekOpen}
    >
      {previewContent}
    </aside>
  </section>;
}

/**
 * A small layout-engine-neutral dock zone. It deliberately delegates tab ARIA,
 * keyboard selection, badges, and optional closable panels to the existing
 * CadDockTabs primitive while exposing side/bottom placement as host-readable
 * metadata. Close actions are opt-in: merely using a dock zone cannot create
 * a destructive close target.
 */
export function CadWorkspaceDockZone({
  edge = 'left',
  panels = [],
  activeId,
  defaultActiveId,
  onActiveChange,
  onPanelClose,
  label = 'Docked panels',
  tabsLabel,
  compactTabs = false,
  renderPanel,
  children,
  id,
  className,
  tabsClassName,
  panelClassName,
  emptyLabel = 'No panels are available in this dock.',
  ...props
}: CadAnyProps) {
  const resolvedEdge = normalizeRailEdge(edge);
  const resolvedPanels = asArray(panels);
  const renderZonePanel = useCallback(item => {
    const customContent = renderPanel?.(item);
    const content = customContent === undefined ? item?.content ?? item?.children : customContent;
    return panelClassName ? <div className={panelClassName}>{content}</div> : content;
  }, [panelClassName, renderPanel]);

  return <section
    {...props}
    id={id}
    className={cx('cad-workspace-dock-zone', className)}
    data-edge={resolvedEdge}
    aria-label={label}
    role="complementary"
  >
    {resolvedPanels.length > 0 ? <CadDockTabs
      items={resolvedPanels}
      activeId={activeId}
      defaultActiveId={defaultActiveId}
      onChange={(nextId, item, event) => onActiveChange?.(nextId, item, event)}
      onClose={onPanelClose ? (item, event) => onPanelClose(item, event) : undefined}
      label={tabsLabel || label}
      compact={compactTabs}
      className={cx('cad-workspace-dock-zone__tabs', tabsClassName)}
      renderPanel={renderZonePanel}
    /> : <div className="cad-workspace-dock-zone__empty" role="status">{children || emptyLabel}</div>}
  </section>;
}
