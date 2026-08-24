import React, { useCallback, useId, useMemo } from 'react';
import { CadPopover } from './CadOverlayUi.jsx';
import { asArray, cx, itemLabel, useControllableState } from './cadUiUtils.js';

const text = value => String(value ?? '').trim();
const isRecord = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const samePreference = (first, second) => Boolean(first) && Boolean(second)
  && first.open === second.open
  && first.placement === second.placement;

const recordFrom = value => {
  if (value instanceof Map) return Object.fromEntries(value.entries());
  return isRecord(value) ? value : {};
};

const omitStateFields = value => {
  if (!isRecord(value)) return {};
  const { open, visible, isOpen, placement, mode, ...metadata } = value;
  return metadata;
};

const booleanValue = (...values) => {
  const value = values.find(candidate => typeof candidate === 'boolean');
  return value === undefined ? undefined : value;
};

const safeKeySegment = (value, fallback) => text(value)
  .toLocaleLowerCase()
  .replace(/[^a-z0-9._-]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80) || fallback;

export const CAD_WORKSPACE_PANEL_PLACEMENTS = Object.freeze({
  DOCK: 'dock',
  FLOAT: 'float'
});

export const CAD_WORKSPACE_PANEL_ACTIONS = Object.freeze({
  OPEN: 'open',
  CLOSE: 'close',
  TOGGLE: 'toggle',
  DOCK: 'dock',
  FLOAT: 'float',
  RESET: 'reset',
  RESET_ALL: 'reset-all',
  PATCH: 'patch'
});

/** Accepts common dock/floating aliases while keeping persisted state compact. */
export function normalizeCadWorkspacePanelPlacement(value, fallback = CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK) {
  const normalized = text(value).toLocaleLowerCase();
  if (['float', 'floating', 'overlay', 'window'].includes(normalized)) return CAD_WORKSPACE_PANEL_PLACEMENTS.FLOAT;
  if (['dock', 'docked', 'left', 'right', 'top', 'bottom', 'side'].includes(normalized)) return CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK;
  return fallback;
}

const allowedPlacementsFor = panel => {
  const rawPlacements = asArray(panel?.placements ?? panel?.allowedPlacements ?? panel?.placementOptions)
    .map(placement => normalizeCadWorkspacePanelPlacement(placement, ''))
    .filter(Boolean);
  const preferenceLocked = Boolean(panel?.preferenceLocked ?? panel?.locked);
  const supportsDock = !preferenceLocked && panel?.dockable !== false;
  const supportsFloat = !preferenceLocked && panel?.floatable !== false;
  const permitted = (rawPlacements.length ? rawPlacements : [
    ...(supportsDock ? [CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK] : []),
    ...(supportsFloat ? [CAD_WORKSPACE_PANEL_PLACEMENTS.FLOAT] : [])
  ]).filter(placement => (placement === CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK ? supportsDock : supportsFloat));
  return [...new Set(permitted)];
};

/**
 * Normalizes declarative panel records without coupling them to a docking
 * library. The host may include any additional metadata (React icons,
 * permissions, analytics IDs, renderer references) and it will pass through.
 */
export function normalizeCadWorkspacePanels(panels = []) {
  const seenIds = new Set();
  return asArray(panels).reduce((normalized, candidate, index) => {
    if (candidate === null || candidate === undefined) return normalized;
    const panel = typeof candidate === 'string' || typeof candidate === 'number'
      ? { id: String(candidate), label: String(candidate) }
      : candidate;
    if (!isRecord(panel)) return normalized;
    const id = text(panel.id ?? panel.key) || `panel-${index + 1}`;
    if (seenIds.has(id)) return normalized;
    seenIds.add(id);

    const preferenceLocked = Boolean(panel.preferenceLocked ?? panel.locked);
    const placements = allowedPlacementsFor(panel);
    const requestedPlacement = normalizeCadWorkspacePanelPlacement(
      panel.defaultPlacement ?? panel.placement ?? panel.mode,
      CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK
    );
    const defaultPlacement = placements.includes(requestedPlacement)
      ? requestedPlacement
      : placements[0] || requestedPlacement;
    const defaultOpen = booleanValue(panel.defaultOpen, panel.defaultVisible, panel.open, panel.visible) ?? true;

    normalized.push({
      ...panel,
      id,
      label: itemLabel(panel) || `Panel ${index + 1}`,
      description: text(panel.description ?? panel.detail),
      disabled: Boolean(panel.disabled),
      required: Boolean(panel.required),
      preferenceLocked,
      closable: !preferenceLocked && !panel.required && panel.closable !== false,
      placements,
      defaultPlacement,
      defaultOpen
    });
    return normalized;
  }, []);
}

const resolvePanelPreference = (panel, rawValue) => {
  const source = typeof rawValue === 'boolean' ? { open: rawValue } : recordFrom(rawValue);
  const requestedOpen = booleanValue(source.open, source.visible, source.isOpen, panel.defaultOpen);
  const requestedPlacement = normalizeCadWorkspacePanelPlacement(
    source.placement ?? source.mode,
    panel.defaultPlacement
  );
  const placement = panel.placements.includes(requestedPlacement)
    ? requestedPlacement
    : panel.placements[0] || panel.defaultPlacement;
  return {
    ...omitStateFields(source),
    open: panel.required ? true : Boolean(requestedOpen),
    placement
  };
};

/**
 * Returns a compact, JSON-safe preference map for the supplied declarations.
 * Unknown IDs are deliberately omitted here; `updateCadWorkspacePanelPreference`
 * and `resetCadWorkspacePanelPreferences` preserve them when writing state.
 */
export function normalizeCadWorkspacePanelPreferences(panels = [], value = {}) {
  const source = recordFrom(value);
  return normalizeCadWorkspacePanels(panels).reduce((preferences, panel) => {
    preferences[panel.id] = resolvePanelPreference(panel, source[panel.id]);
    return preferences;
  }, {});
}

export function getCadWorkspacePanelPreference(panels = [], value = {}, panelId) {
  const id = text(panelId);
  return id ? normalizeCadWorkspacePanelPreferences(panels, value)[id] : undefined;
}

const normalizedAction = action => {
  if (typeof action === 'string') return { type: action };
  return isRecord(action) ? action : { type: '' };
};

const updatePreferenceForAction = (panel, preference, action) => {
  const { type, value } = normalizedAction(action);
  const next = { ...preference };
  const canMove = placement => panel.placements.includes(placement);
  if (panel.disabled || panel.preferenceLocked) return preference;

  switch (type) {
    case CAD_WORKSPACE_PANEL_ACTIONS.OPEN:
      next.open = true;
      break;
    case CAD_WORKSPACE_PANEL_ACTIONS.CLOSE:
      if (!panel.closable) return preference;
      next.open = false;
      break;
    case CAD_WORKSPACE_PANEL_ACTIONS.TOGGLE:
      if (preference.open && !panel.closable) return preference;
      next.open = !preference.open;
      break;
    case CAD_WORKSPACE_PANEL_ACTIONS.DOCK:
      if (!canMove(CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK)) return preference;
      next.placement = CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK;
      break;
    case CAD_WORKSPACE_PANEL_ACTIONS.FLOAT:
      if (!canMove(CAD_WORKSPACE_PANEL_PLACEMENTS.FLOAT)) return preference;
      next.placement = CAD_WORKSPACE_PANEL_PLACEMENTS.FLOAT;
      break;
    case CAD_WORKSPACE_PANEL_ACTIONS.RESET:
      return resolvePanelPreference(panel, {});
    case CAD_WORKSPACE_PANEL_ACTIONS.PATCH: {
      const patch = recordFrom(value);
      if (typeof patch.open === 'boolean' && (patch.open || panel.closable)) next.open = patch.open;
      const placement = normalizeCadWorkspacePanelPlacement(patch.placement ?? patch.mode, '');
      if (placement && canMove(placement)) next.placement = placement;
      break;
    }
    default:
      return preference;
  }
  return next;
};

/**
 * Applies one intent to a host-owned preference map. It never mutates input,
 * never opens a dock, and preserves unknown panel records for feature flags or
 * profiles that are currently inactive.
 */
export function updateCadWorkspacePanelPreference(panels = [], value = {}, panelId, action) {
  const id = text(panelId);
  const definitions = normalizeCadWorkspacePanels(panels);
  const panel = definitions.find(candidate => candidate.id === id);
  const source = recordFrom(value);
  if (!panel) return source;

  const current = resolvePanelPreference(panel, source[id]);
  const next = updatePreferenceForAction(panel, current, action);
  if (samePreference(current, next)) return source;
  return { ...source, [id]: next };
}

/** Resets all declared panels while retaining unknown records and metadata. */
export function resetCadWorkspacePanelPreferences(panels = [], value = {}) {
  const source = recordFrom(value);
  return normalizeCadWorkspacePanels(panels).reduce((next, panel) => ({
    ...next,
    [panel.id]: resolvePanelPreference(panel, omitStateFields(source[panel.id]))
  }), { ...source });
}

/**
 * Creates a stable, scope-aware key for host persistence. It intentionally
 * does not read or write localStorage, so public/admin, project, user and
 * server storage policies remain entirely host-owned.
 */
export function createCadWorkspacePanelPreferencesKey(namespaceOrOptions = 'cad-workspace', legacyScope = 'default') {
  const options = isRecord(namespaceOrOptions)
    ? namespaceOrOptions
    : { namespace: namespaceOrOptions, scope: legacyScope };
  const namespace = safeKeySegment(options.namespace, 'cad-workspace');
  const scope = safeKeySegment(options.scope, 'default');
  const section = safeKeySegment(options.section, 'panels');
  return `${namespace}:${scope}:${section}`;
}

/**
 * Controlled/uncontrolled state adapter for workspace-panel preferences.
 * Use it when a host wants the same data contract without rendering the menu.
 */
export function useCadWorkspacePanelPreferences({ panels = [], value, defaultValue, onChange } = {}) {
  const normalizedPanels = useMemo(() => normalizeCadWorkspacePanels(panels), [panels]);
  const initialValue = useMemo(
    () => ({ ...recordFrom(defaultValue), ...normalizeCadWorkspacePanelPreferences(normalizedPanels, defaultValue) }),
    [defaultValue, normalizedPanels]
  );
  const [rawValue, setRawValue] = useControllableState(value, initialValue, (nextValue, change, event) => {
    onChange?.(nextValue, change, event);
  });
  const preferences = useMemo(
    () => normalizeCadWorkspacePanelPreferences(normalizedPanels, rawValue),
    [normalizedPanels, rawValue]
  );

  const dispatch = useCallback((panelId, action, event) => {
    const id = text(panelId);
    const panel = normalizedPanels.find(candidate => candidate.id === id);
    const previousPreference = preferences[id];
    if (!panel || !previousPreference) return { changed: false, panel, action: normalizedAction(action).type };
    const nextValue = updateCadWorkspacePanelPreference(normalizedPanels, rawValue, id, action);
    const nextPreference = normalizeCadWorkspacePanelPreferences(normalizedPanels, nextValue)[id];
    const changed = !samePreference(previousPreference, nextPreference);
    const change = {
      changed,
      id,
      panel,
      action: normalizedAction(action).type,
      previousPreference,
      preference: nextPreference,
      value: nextValue,
      source: 'workspace-panel-preferences'
    };
    if (changed) setRawValue(nextValue, change, event);
    return change;
  }, [normalizedPanels, preferences, rawValue, setRawValue]);

  const reset = useCallback(event => {
    const nextValue = resetCadWorkspacePanelPreferences(normalizedPanels, rawValue);
    const nextPreferences = normalizeCadWorkspacePanelPreferences(normalizedPanels, nextValue);
    const changed = normalizedPanels.some(panel => !samePreference(preferences[panel.id], nextPreferences[panel.id]));
    const change = {
      changed,
      action: CAD_WORKSPACE_PANEL_ACTIONS.RESET_ALL,
      panels: normalizedPanels,
      previousPreferences: preferences,
      preferences: nextPreferences,
      value: nextValue,
      source: 'workspace-panel-preferences'
    };
    if (changed) setRawValue(nextValue, change, event);
    return change;
  }, [normalizedPanels, preferences, rawValue, setRawValue]);

  return { panels: normalizedPanels, value: preferences, preferences, dispatch, reset };
}

const defaultPanelIcon = <span aria-hidden="true">▣</span>;

const panelIcon = (panel, renderPanelIcon) => {
  if (typeof renderPanelIcon === 'function') return renderPanelIcon(panel);
  if (React.isValidElement(panel.icon)) return panel.icon;
  // React.forwardRef() and React.memo() return component-type objects rather
  // than functions. Supporting their $$typeof marker lets hosts pass Lucide
  // and similar icon exports directly, without coupling this primitive to an
  // icon library or forcing a pre-created React element.
  if (typeof panel.icon === 'function' || Boolean(panel.icon?.$$typeof)) {
    return React.createElement(panel.icon, { size: 13, 'aria-hidden': true });
  }
  if (panel.icon !== undefined && panel.icon !== null) return panel.icon;
  return defaultPanelIcon;
};

const placementLabel = placement => placement === CAD_WORKSPACE_PANEL_PLACEMENTS.FLOAT ? 'FLOATING' : 'DOCKED';

/**
 * A compact CAD workspace-customization flyout. It only edits serializable
 * intent ({ open, placement }); hosts decide whether that means a Dockview
 * tab, a floating HTML panel, a native window, or a renderer overlay.
 */
export function CadWorkspacePanelManager({
  panels = [],
  value,
  defaultValue,
  onChange,
  onPanelChange,
  onPanelAction,
  onPanelOpen,
  onPanelClose,
  onPanelDock,
  onPanelFloat,
  onPanelReset,
  onResetAll,
  menuOpen,
  defaultMenuOpen = false,
  onMenuOpenChange,
  title = 'Workspace panels',
  description = 'Show, dock or float the panels used in this workspace.',
  trigger,
  renderTrigger,
  triggerLabel = 'Workspace panels',
  triggerIcon = '▦',
  scope,
  placement = 'bottom-end',
  emptyLabel = 'No configurable panels are available.',
  resetAllLabel = 'Reset workspace',
  showResetAll = true,
  closeLabel,
  renderPanel,
  renderPanelIcon,
  className,
  contentClassName,
  ...props
}) {
  const generatedId = useId();
  const {
    panels: normalizedPanels,
    preferences,
    dispatch,
    reset
  } = useCadWorkspacePanelPreferences({ panels, value, defaultValue, onChange });
  const configuredPanels = normalizedPanels.filter(panel => !panel.hidden);
  const visibleCount = configuredPanels.filter(panel => preferences[panel.id]?.open).length;
  const floatingCount = configuredPanels.filter(panel => preferences[panel.id]?.open && preferences[panel.id]?.placement === CAD_WORKSPACE_PANEL_PLACEMENTS.FLOAT).length;

  const publishPanelAction = useCallback((panel, action, event) => {
    const change = dispatch(panel.id, action, event);
    if (!change.changed) return;
    onPanelChange?.(panel.id, change.preference, change, event);
    onPanelAction?.(change, event);
    if (change.action === CAD_WORKSPACE_PANEL_ACTIONS.OPEN) onPanelOpen?.(panel, change.preference, change, event);
    if (change.action === CAD_WORKSPACE_PANEL_ACTIONS.CLOSE) onPanelClose?.(panel, change.preference, change, event);
    if (change.action === CAD_WORKSPACE_PANEL_ACTIONS.DOCK) onPanelDock?.(panel, change.preference, change, event);
    if (change.action === CAD_WORKSPACE_PANEL_ACTIONS.FLOAT) onPanelFloat?.(panel, change.preference, change, event);
    if (change.action === CAD_WORKSPACE_PANEL_ACTIONS.RESET) onPanelReset?.(panel, change.preference, change, event);
  }, [dispatch, onPanelAction, onPanelChange, onPanelClose, onPanelDock, onPanelFloat, onPanelOpen, onPanelReset]);

  const publishReset = useCallback(event => {
    const change = reset(event);
    if (!change.changed) return;
    onPanelAction?.(change, event);
    onResetAll?.(change.value, change, event);
  }, [onPanelAction, onResetAll, reset]);

  const defaultTrigger = <button type="button" className="cad-workspace-panel-manager__trigger" title={triggerLabel}>
    <span className="cad-workspace-panel-manager__trigger-icon" aria-hidden="true">{triggerIcon}</span>
    <span className="cad-workspace-panel-manager__trigger-label">{triggerLabel}</span>
    <output aria-label={`${visibleCount} visible panels`}>{visibleCount}</output>
  </button>;
  const resolvedTrigger = typeof renderTrigger === 'function'
    ? renderTrigger({ visibleCount, floatingCount, panels: configuredPanels, preferences })
    : trigger || defaultTrigger;
  const resolvedCloseLabel = closeLabel || `Close ${title}`;
  const contentId = `cad-workspace-panel-manager-${generatedId}`;

  const renderDefaultPanel = (panel, preference) => {
    const isVisible = Boolean(preference.open);
    const visibilityAction = isVisible ? CAD_WORKSPACE_PANEL_ACTIONS.CLOSE : CAD_WORKSPACE_PANEL_ACTIONS.OPEN;
    const canToggleVisibility = !panel.disabled && (!isVisible || panel.closable);
    const supportsPlacement = panel.placements.length > 1;
    const controls = {
      open: event => publishPanelAction(panel, CAD_WORKSPACE_PANEL_ACTIONS.OPEN, event),
      close: event => publishPanelAction(panel, CAD_WORKSPACE_PANEL_ACTIONS.CLOSE, event),
      toggle: event => publishPanelAction(panel, CAD_WORKSPACE_PANEL_ACTIONS.TOGGLE, event),
      dock: event => publishPanelAction(panel, CAD_WORKSPACE_PANEL_ACTIONS.DOCK, event),
      float: event => publishPanelAction(panel, CAD_WORKSPACE_PANEL_ACTIONS.FLOAT, event),
      reset: event => publishPanelAction(panel, CAD_WORKSPACE_PANEL_ACTIONS.RESET, event)
    };
    if (typeof renderPanel === 'function') return renderPanel(panel, preference, controls);

    return <article className="cad-workspace-panel-manager__panel" data-panel-id={panel.id} data-open={isVisible ? 'true' : 'false'} data-placement={preference.placement} data-locked={panel.preferenceLocked ? 'true' : 'false'} role="listitem">
      <div className="cad-workspace-panel-manager__panel-summary">
        <button
          type="button"
          className="cad-workspace-panel-manager__visibility"
          aria-label={`${isVisible ? 'Hide' : 'Show'} ${panel.label}`}
          aria-pressed={isVisible}
          disabled={!canToggleVisibility}
          title={panel.preferenceLocked ? `${panel.label} preferences are locked` : `${isVisible ? 'Hide' : 'Show'} ${panel.label}`}
          onClick={event => publishPanelAction(panel, visibilityAction, event)}
        >
          <span className="cad-workspace-panel-manager__panel-icon" aria-hidden="true">{panelIcon(panel, renderPanelIcon)}</span>
          <span className="cad-workspace-panel-manager__panel-copy"><strong>{panel.label}</strong>{panel.description && <small>{panel.description}</small>}</span>
          <span className="cad-workspace-panel-manager__visibility-state" aria-hidden="true">{isVisible ? '●' : '○'}</span>
        </button>
        <output className="cad-workspace-panel-manager__state" aria-label={`${panel.label} is ${isVisible ? 'visible' : 'hidden'}`}>{isVisible ? 'VISIBLE' : 'HIDDEN'}</output>
      </div>
      <div className="cad-workspace-panel-manager__placement" role="group" aria-label={`${panel.label} placement`}>
        {panel.placements.includes(CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK) && <button
          type="button"
          aria-label={`Dock ${panel.label}`}
          aria-pressed={preference.placement === CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK}
          disabled={panel.disabled || panel.preferenceLocked || !supportsPlacement}
          onClick={controls.dock}
        ><span aria-hidden="true">▣</span>DOCK</button>}
        {panel.placements.includes(CAD_WORKSPACE_PANEL_PLACEMENTS.FLOAT) && <button
          type="button"
          aria-label={`Float ${panel.label}`}
          aria-pressed={preference.placement === CAD_WORKSPACE_PANEL_PLACEMENTS.FLOAT}
          disabled={panel.disabled || panel.preferenceLocked || !supportsPlacement}
          onClick={controls.float}
        ><span aria-hidden="true">◇</span>FLOAT</button>}
        <output aria-label={`${panel.label} placement: ${placementLabel(preference.placement).toLocaleLowerCase()}`}>{placementLabel(preference.placement)}</output>
        {!panel.preferenceLocked && <button type="button" className="cad-workspace-panel-manager__reset" aria-label={`Reset ${panel.label}`} title={`Reset ${panel.label}`} onClick={controls.reset}>↺</button>}
      </div>
    </article>;
  };

  return <CadPopover
    {...props}
    id={contentId}
    className={cx('cad-workspace-panel-manager', className)}
    contentClassName={cx('cad-workspace-panel-manager__surface', contentClassName)}
    trigger={resolvedTrigger}
    open={menuOpen}
    defaultOpen={defaultMenuOpen}
    onOpenChange={onMenuOpenChange}
    placement={placement}
    label={title}
    contentRole="dialog"
    content={({ close }) => <section className="cad-workspace-panel-manager__content" aria-describedby={description ? `${contentId}-description` : undefined}>
      <header className="cad-workspace-panel-manager__header">
        <div><span className="cad-workspace-panel-manager__eyebrow">WORKSPACE</span><h2>{title}</h2>{description && <p id={`${contentId}-description`}>{description}</p>}</div>
        <div className="cad-workspace-panel-manager__header-actions">
          {scope && <output className="cad-workspace-panel-manager__scope">{scope}</output>}
          <button type="button" className="cad-workspace-panel-manager__close" aria-label={resolvedCloseLabel} title={resolvedCloseLabel} onClick={close}>×</button>
        </div>
      </header>
      {configuredPanels.length > 0 ? <>
        <div className="cad-workspace-panel-manager__summary" aria-label="Workspace panel summary"><span><b>{visibleCount}</b> VISIBLE</span><span><b>{floatingCount}</b> FLOATING</span></div>
        <div className="cad-workspace-panel-manager__list" role="list">{configuredPanels.map(panel => <React.Fragment key={panel.id}>{renderDefaultPanel(panel, preferences[panel.id])}</React.Fragment>)}</div>
      </> : <p className="cad-workspace-panel-manager__empty" role="status">{emptyLabel}</p>}
      {showResetAll && configuredPanels.length > 0 && <footer className="cad-workspace-panel-manager__footer"><button type="button" aria-label={resetAllLabel} onClick={publishReset}><span aria-hidden="true">↺</span> {resetAllLabel}</button><span>Host-owned layout state</span></footer>}
    </section>}
  />;
}

export const CadWorkspacePanelPreferences = CadWorkspacePanelManager;
