import type { CadAnyProps } from './cad-types';
import React, { useCallback, useId, useMemo } from 'react';
import { CadPopover } from './CadOverlayUi';
import { asArray, cx, itemLabel, useControllableState } from './cadUiUtils';
import { isRecord, toTrimmedString as text } from './cadValueUtils';

const samePreference = (first, second) => Boolean(first) && Boolean(second)
  && first.open === second.open
  && first.placement === second.placement
  && first.dockZone === second.dockZone;

const recordFrom = value => {
  if (value instanceof Map) return Object.fromEntries(value.entries());
  return isRecord(value) ? value : {};
};

const PANEL_PREFERENCE_STATE_FIELDS = new Set(['open', 'visible', 'isOpen', 'placement', 'mode']);

const omitStateFields = value => {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([key]) => !PANEL_PREFERENCE_STATE_FIELDS.has(key)));
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

/** Physical workspace zones a docked panel may occupy. */
export const CAD_WORKSPACE_PANEL_DOCK_ZONES = Object.freeze({
  LEFT: 'left',
  RIGHT: 'right',
  BOTTOM: 'bottom'
});

export const CAD_WORKSPACE_PANEL_ACTIONS = Object.freeze({
  OPEN: 'open',
  CLOSE: 'close',
  TOGGLE: 'toggle',
  DOCK: 'dock',
  FLOAT: 'float',
  SET_DOCK_ZONE: 'dock-zone',
  RESET: 'reset',
  RESET_ALL: 'reset-all',
  PATCH: 'patch'
});

/** Accepts common dock/floating aliases while keeping persisted state compact. */
export function normalizeCadWorkspacePanelPlacement(value: unknown, fallback: any = CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK): any {
  const normalized = text(value).toLocaleLowerCase();
  if (['float', 'floating', 'overlay', 'window'].includes(normalized)) return CAD_WORKSPACE_PANEL_PLACEMENTS.FLOAT;
  if (['dock', 'docked', 'left', 'right', 'top', 'bottom', 'side'].includes(normalized)) return CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK;
  return fallback;
}

/** Accepts common physical-zone aliases while keeping persisted state compact. */
export function normalizeCadWorkspacePanelDockZone(value: unknown, fallback: any = ''): any {
  const normalized = text(value).toLocaleLowerCase();
  if (['left', 'start', 'west', 'leading'].includes(normalized)) return CAD_WORKSPACE_PANEL_DOCK_ZONES.LEFT;
  if (['right', 'end', 'east', 'trailing'].includes(normalized)) return CAD_WORKSPACE_PANEL_DOCK_ZONES.RIGHT;
  if (['bottom', 'lower', 'footer', 'command', 'command-line'].includes(normalized)) return CAD_WORKSPACE_PANEL_DOCK_ZONES.BOTTOM;
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

const listFrom = value => Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];

const allowedDockZonesFor = panel => {
  if (panel?.dockable === false) return [];
  const rawZones = listFrom(panel?.dockZones ?? panel?.allowedDockZones ?? panel?.dockZoneOptions);
  const declaredDefault = panel?.defaultDockZone ?? panel?.dockZone ?? panel?.zone;
  const candidates = rawZones.length ? rawZones : declaredDefault === undefined ? [] : [declaredDefault];
  return [...new Set(candidates
    .map(zone => normalizeCadWorkspacePanelDockZone(zone, ''))
    .filter(Boolean))];
};

/**
 * Normalizes declarative panel records without coupling them to a docking
 * library. The host may include any additional metadata (React icons,
 * permissions, analytics IDs, renderer references) and it will pass through.
 */
export function normalizeCadWorkspacePanels(panels: readonly any[] = []): CadAnyProps[] {
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
    const dockZones = placements.includes(CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK)
      ? allowedDockZonesFor(panel)
      : [];
    const requestedDockZone = normalizeCadWorkspacePanelDockZone(
      panel.defaultDockZone ?? panel.dockZone ?? panel.zone,
      ''
    );
    const defaultDockZone = dockZones.includes(requestedDockZone)
      ? requestedDockZone
      : dockZones[0] || '';
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
      dockZones,
      defaultDockZone,
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
  const dockZones = panel.dockZones || [];
  const requestedDockZone = normalizeCadWorkspacePanelDockZone(
    source.dockZone ?? source.zone,
    panel.defaultDockZone
  );
  const dockZone = dockZones.includes(requestedDockZone)
    ? requestedDockZone
    : dockZones[0] || '';
  const metadata = omitStateFields(source);
  if (dockZones.length) {
    delete metadata.dockZone;
    delete metadata.zone;
  }
  return {
    ...metadata,
    open: panel.required ? true : Boolean(requestedOpen),
    placement,
    ...(dockZones.length ? { dockZone } : {})
  };
};

/**
 * Returns a compact, JSON-safe preference map for the supplied declarations.
 * Unknown IDs are deliberately omitted here; `updateCadWorkspacePanelPreference`
 * and `resetCadWorkspacePanelPreferences` preserve them when writing state.
 */
export function normalizeCadWorkspacePanelPreferences(panels: readonly any[] = [], value: CadAnyProps = {}): CadAnyProps {
  const source = recordFrom(value);
  return normalizeCadWorkspacePanels(panels).reduce((preferences, panel) => {
    preferences[panel.id] = resolvePanelPreference(panel, source[panel.id]);
    return preferences;
  }, {});
}

export function getCadWorkspacePanelPreference(panels: readonly any[] = [], value: CadAnyProps = {}, panelId?: any): CadAnyProps | undefined {
  const id = text(panelId);
  return id ? normalizeCadWorkspacePanelPreferences(panels, value)[id] : undefined;
}

/**
 * Groups declared, visible docked panels by their physical workspace edge.
 * This is intentionally a pure adapter: the host still chooses whether each
 * resulting item becomes a tab, a stacked panel, or a docking-library view.
 * Panels without a declared `dockZone` are omitted rather than guessed.
 */
export function groupCadWorkspacePanelsByDockZone(panels: readonly any[] = [], value: CadAnyProps = {}): CadAnyProps {
  const normalizedPanels = normalizeCadWorkspacePanels(panels);
  const preferences = normalizeCadWorkspacePanelPreferences(normalizedPanels, value);
  const groups = {
    [CAD_WORKSPACE_PANEL_DOCK_ZONES.LEFT]: [],
    [CAD_WORKSPACE_PANEL_DOCK_ZONES.RIGHT]: [],
    [CAD_WORKSPACE_PANEL_DOCK_ZONES.BOTTOM]: []
  };

  normalizedPanels.forEach(panel => {
    const preference = preferences[panel.id];
    const dockZone = normalizeCadWorkspacePanelDockZone(preference?.dockZone, '');
    if (!preference?.open || preference.placement !== CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK || !dockZone) return;
    groups[dockZone].push({ ...panel, preference });
  });

  return groups;
}

const normalizedAction = action => {
  if (typeof action === 'string') return { type: action };
  return isRecord(action) ? action : { type: '' };
};

const updatePreferenceForAction = (panel, preference, action) => {
  const { type, value } = normalizedAction(action);
  const next = { ...preference };
  const canMove = placement => panel.placements.includes(placement);
  const canDockTo = zone => panel.dockZones?.includes(zone);
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
    case CAD_WORKSPACE_PANEL_ACTIONS.SET_DOCK_ZONE: {
      const dockZone = normalizeCadWorkspacePanelDockZone(value, '');
      if (!canMove(CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK) || !canDockTo(dockZone)) return preference;
      next.placement = CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK;
      next.dockZone = dockZone;
      break;
    }
    case CAD_WORKSPACE_PANEL_ACTIONS.RESET:
      return resolvePanelPreference(panel, {});
    case CAD_WORKSPACE_PANEL_ACTIONS.PATCH: {
      const patch = recordFrom(value);
      if (typeof patch.open === 'boolean' && (patch.open || panel.closable)) next.open = patch.open;
      const placement = normalizeCadWorkspacePanelPlacement(patch.placement ?? patch.mode, '');
      if (placement && canMove(placement)) next.placement = placement;
      const dockZone = normalizeCadWorkspacePanelDockZone(patch.dockZone ?? patch.zone, '');
      if (dockZone && canDockTo(dockZone)) {
        next.dockZone = dockZone;
        next.placement = CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK;
      }
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
export function updateCadWorkspacePanelPreference(panels: readonly any[] = [], value: CadAnyProps = {}, panelId?: any, action?: any): CadAnyProps {
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
export function resetCadWorkspacePanelPreferences(panels: readonly any[] = [], value: CadAnyProps = {}): CadAnyProps {
  const source = recordFrom(value);
  return normalizeCadWorkspacePanels(panels).reduce((next, panel) => {
    const metadata = omitStateFields(source[panel.id]);
    if (panel.dockZones?.length) {
      delete metadata.dockZone;
      delete metadata.zone;
    }
    return { ...next, [panel.id]: resolvePanelPreference(panel, metadata) };
  }, { ...source });
}

/**
 * Creates a stable, scope-aware key for host persistence. It intentionally
 * does not read or write localStorage, so public/admin, project, user and
 * server storage policies remain entirely host-owned.
 */
export function createCadWorkspacePanelPreferencesKey(namespaceOrOptions: CadAnyProps | string = 'cad-workspace', legacyScope = 'default') {
  const options: CadAnyProps = isRecord(namespaceOrOptions)
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
export function useCadWorkspacePanelPreferences({ panels = [], value, defaultValue, onChange }: CadAnyProps = {}) {
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

  const dispatch = useCallback((panelId, action, event): CadAnyProps => {
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

  const reset = useCallback((event): CadAnyProps => {
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

const dockZoneLabel = dockZone => ({
  [CAD_WORKSPACE_PANEL_DOCK_ZONES.LEFT]: 'LEFT',
  [CAD_WORKSPACE_PANEL_DOCK_ZONES.RIGHT]: 'RIGHT',
  [CAD_WORKSPACE_PANEL_DOCK_ZONES.BOTTOM]: 'BOTTOM'
}[dockZone] || '');

const placementLabel = (placement, dockZone) => placement === CAD_WORKSPACE_PANEL_PLACEMENTS.FLOAT
  ? 'FLOATING'
  : [dockZoneLabel(dockZone), 'DOCKED'].filter(Boolean).join(' ');

/**
 * A compact CAD workspace-customization flyout. It only edits serializable
 * intent ({ open, placement, dockZone? }); hosts decide whether that means a
 * Dockview tab, a floating HTML panel, a native window, or a renderer overlay.
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
  onPanelDockZone,
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
  filter,
  defaultFilter = '',
  onFilterChange,
  filterable = true,
  filterLabel = 'Find panel',
  filterPlaceholder = 'Search panels',
  clearFilterLabel = 'Clear panel filter',
  filteredEmptyLabel = 'No panels match the current filter.',
  resetAllLabel = 'Reset workspace',
  showResetAll = true,
  closeLabel,
  renderPanel,
  renderPanelIcon,
  className,
  contentClassName,
  ...props
}: CadAnyProps) {
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
  const [panelFilter, setPanelFilter] = useControllableState(filter, defaultFilter, (nextFilter, event) => {
    onFilterChange?.(nextFilter, event);
  });
  const normalizedFilter = text(panelFilter).toLocaleLowerCase();
  const filteredPanels = useMemo(() => configuredPanels.filter(panel => {
    if (!normalizedFilter) return true;
    const preference = preferences[panel.id] || {};
    const searchable = [
      panel.label,
      panel.description,
      preference.open ? 'visible open' : 'hidden closed',
      placementLabel(preference.placement, preference.dockZone),
      dockZoneLabel(preference.dockZone)
    ].filter(Boolean).join(' ').toLocaleLowerCase();
    return searchable.includes(normalizedFilter);
  }), [configuredPanels, normalizedFilter, preferences]);
  const showFilter = filterable && configuredPanels.length > 6;

  const publishPanelAction = useCallback((panel, action, event) => {
    const change = dispatch(panel.id, action, event);
    if (!change.changed) return;
    onPanelChange?.(panel.id, change.preference, change, event);
    onPanelAction?.(change, event);
    if (change.action === CAD_WORKSPACE_PANEL_ACTIONS.OPEN) onPanelOpen?.(panel, change.preference, change, event);
    if (change.action === CAD_WORKSPACE_PANEL_ACTIONS.CLOSE) onPanelClose?.(panel, change.preference, change, event);
    if (change.action === CAD_WORKSPACE_PANEL_ACTIONS.DOCK) onPanelDock?.(panel, change.preference, change, event);
    if (change.action === CAD_WORKSPACE_PANEL_ACTIONS.SET_DOCK_ZONE) onPanelDockZone?.(panel, change.preference, change, event);
    if (change.action === CAD_WORKSPACE_PANEL_ACTIONS.FLOAT) onPanelFloat?.(panel, change.preference, change, event);
    if (change.action === CAD_WORKSPACE_PANEL_ACTIONS.RESET) onPanelReset?.(panel, change.preference, change, event);
  }, [dispatch, onPanelAction, onPanelChange, onPanelClose, onPanelDock, onPanelDockZone, onPanelFloat, onPanelOpen, onPanelReset]);

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
    const supportsDockZones = panel.placements.includes(CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK) && panel.dockZones.length > 1;
    const controls = {
      open: event => publishPanelAction(panel, CAD_WORKSPACE_PANEL_ACTIONS.OPEN, event),
      close: event => publishPanelAction(panel, CAD_WORKSPACE_PANEL_ACTIONS.CLOSE, event),
      toggle: event => publishPanelAction(panel, CAD_WORKSPACE_PANEL_ACTIONS.TOGGLE, event),
      dock: event => publishPanelAction(panel, CAD_WORKSPACE_PANEL_ACTIONS.DOCK, event),
      dockTo: (dockZone, event) => publishPanelAction(panel, { type: CAD_WORKSPACE_PANEL_ACTIONS.SET_DOCK_ZONE, value: dockZone }, event),
      float: event => publishPanelAction(panel, CAD_WORKSPACE_PANEL_ACTIONS.FLOAT, event),
      reset: event => publishPanelAction(panel, CAD_WORKSPACE_PANEL_ACTIONS.RESET, event)
    };
    if (typeof renderPanel === 'function') return renderPanel(panel, preference, controls);

    return <article className="cad-workspace-panel-manager__panel" data-panel-id={panel.id} data-open={isVisible ? 'true' : 'false'} data-placement={preference.placement} data-dock-zone={preference.dockZone || undefined} data-locked={panel.preferenceLocked ? 'true' : 'false'} role="listitem">
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
      {(supportsPlacement || !panel.preferenceLocked) && <div className="cad-workspace-panel-manager__placement" role="group" aria-label={`${panel.label} placement`}>
        {supportsPlacement && panel.placements.includes(CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK) && <button
          type="button"
          aria-label={`Dock ${panel.label}`}
          aria-pressed={preference.placement === CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK}
          disabled={panel.disabled || panel.preferenceLocked}
          onClick={controls.dock}
        ><span aria-hidden="true">▣</span>DOCK</button>}
        {supportsPlacement && panel.placements.includes(CAD_WORKSPACE_PANEL_PLACEMENTS.FLOAT) && <button
          type="button"
          aria-label={`Float ${panel.label}`}
          aria-pressed={preference.placement === CAD_WORKSPACE_PANEL_PLACEMENTS.FLOAT}
          disabled={panel.disabled || panel.preferenceLocked}
          onClick={controls.float}
        ><span aria-hidden="true">◇</span>FLOAT</button>}
        {supportsPlacement && <output aria-label={`${panel.label} placement: ${placementLabel(preference.placement, preference.dockZone).toLocaleLowerCase()}`}>{placementLabel(preference.placement, preference.dockZone)}</output>}
        {!panel.preferenceLocked && <button type="button" className="cad-workspace-panel-manager__reset" aria-label={`Reset ${panel.label}`} title={`Reset ${panel.label}`} onClick={controls.reset}>↺</button>}
      </div>}
      {supportsDockZones && <div className="cad-workspace-panel-manager__dock-zones" role="group" aria-label={`${panel.label} dock zone`}>
        {panel.dockZones.map(dockZone => <button
          key={dockZone}
          type="button"
          aria-label={`Dock ${panel.label} to ${dockZoneLabel(dockZone).toLocaleLowerCase()}`}
          aria-pressed={preference.placement === CAD_WORKSPACE_PANEL_PLACEMENTS.DOCK && preference.dockZone === dockZone}
          disabled={panel.disabled || panel.preferenceLocked}
          onClick={event => controls.dockTo(dockZone, event)}
        >{dockZoneLabel(dockZone)}</button>)}
      </div>}
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
    content={({ close }: CadAnyProps) => <section className="cad-workspace-panel-manager__content" aria-describedby={description ? `${contentId}-description` : undefined}>
      <header className="cad-workspace-panel-manager__header">
        <div><span className="cad-workspace-panel-manager__eyebrow">WORKSPACE</span><h2>{title}</h2>{description && <p id={`${contentId}-description`}>{description}</p>}</div>
        <div className="cad-workspace-panel-manager__header-actions">
          {scope && <output className="cad-workspace-panel-manager__scope">{scope}</output>}
          <button type="button" className="cad-workspace-panel-manager__close" data-autofocus aria-label={resolvedCloseLabel} title={resolvedCloseLabel} onClick={close}>×</button>
        </div>
      </header>
      {configuredPanels.length > 0 ? <>
        {showFilter && <div className="cad-workspace-panel-manager__filter">
          <label htmlFor={`${contentId}-filter`}>{filterLabel}</label>
          <input
            id={`${contentId}-filter`}
            type="search"
            value={panelFilter ?? ''}
            placeholder={filterPlaceholder}
            onChange={event => setPanelFilter(event.target.value, event)}
          />
          {normalizedFilter && <button type="button" aria-label={clearFilterLabel} title={clearFilterLabel} onClick={event => setPanelFilter('', event)}>×</button>}
        </div>}
        <div className="cad-workspace-panel-manager__summary" aria-label="Workspace panel summary"><span><b>{visibleCount}</b> VISIBLE</span><span><b>{floatingCount}</b> FLOATING</span>{showFilter && <span className="cad-workspace-panel-manager__filter-count" role="status"><b>{filteredPanels.length}</b> SHOWN</span>}</div>
        {filteredPanels.length > 0
          ? <div className="cad-workspace-panel-manager__list" role="list">{filteredPanels.map(panel => <React.Fragment key={panel.id}>{renderDefaultPanel(panel, preferences[panel.id])}</React.Fragment>)}</div>
          : <p className="cad-workspace-panel-manager__empty cad-workspace-panel-manager__empty--filtered" role="status">{filteredEmptyLabel}</p>}
      </> : <p className="cad-workspace-panel-manager__empty" role="status">{emptyLabel}</p>}
      {showResetAll && configuredPanels.length > 0 && <footer className="cad-workspace-panel-manager__footer"><button type="button" aria-label={resetAllLabel} onClick={publishReset}><span aria-hidden="true">↺</span> {resetAllLabel}</button><span>Host-owned layout state</span></footer>}
    </section>}
  />;
}

export const CadWorkspacePanelPreferences = CadWorkspacePanelManager;
