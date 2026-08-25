import type { CadAnyProps } from './cad-types';
import React, { createContext, useCallback, useContext, useDeferredValue, useEffect, useMemo, useReducer, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CadActionButton, CadDataRow, CadEmptyState, CadPanelFooter, CadPanelHeader, CadPanelSection, CadPanelShell, CadSegmentTabs } from './GraphCadUi';
import { matchesCadSelection, normalizeCadSelection, normalizeCadSelectionRule } from './CadSelectionActions';
import { toTrimmedString as text } from './cadValueUtils';

const EMPTY_LIST: readonly any[] = Object.freeze([]);
const EMPTY_OBJECT: CadAnyProps = Object.freeze({});
const EMPTY_SELECTION = normalizeCadSelection();
const CadCuiContext = createContext<CadAnyProps | null>(null);

export const CAD_CUI_RUNTIME_VERSION = 1;

const unique = (values: unknown): string[] => [...new Set((Array.isArray(values) ? values : EMPTY_LIST).map(text).filter(Boolean))];
const copyOption = option => ({ id: text(option?.id), label: text(option?.label) || text(option?.id), detail: text(option?.detail), color: text(option?.color) });
const copyIntent = intent => Object.freeze({ ...(intent && typeof intent === 'object' ? intent : EMPTY_OBJECT) });
const hasOwn = (value, key) => Boolean(value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, key));
const copyBadge = value => value === undefined || value === null ? '' : value;
const copySelectionRule = selection => normalizeCadSelectionRule(selection);
const copyPlacement = placement => Object.freeze({
  surface: text(placement?.surface),
  tab: text(placement?.tab),
  menu: text(placement?.menu),
  group: text(placement?.group),
  groupId: text(placement?.groupId),
  control: text(placement?.control),
  label: text(placement?.label),
  detail: text(placement?.detail),
  icon: text(placement?.icon),
  tone: text(placement?.tone),
  badge: copyBadge(placement?.badge),
  order: Number.isFinite(Number(placement?.order)) ? Number(placement.order) : 0
});
const copyGroup = group => ({
  id: text(group?.id),
  label: text(group?.label) || text(group?.id),
  detail: text(group?.detail || group?.description),
  icon: text(group?.icon),
  tone: text(group?.tone) || 'cyan',
  surface: text(group?.surface),
  tab: text(group?.tab),
  menu: text(group?.menu),
  control: text(group?.control),
  order: Number.isFinite(Number(group?.order)) ? Number(group.order) : 0
});

const deepFreeze = value => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
};

const capabilityEnabled = (capabilities, capability) => Array.isArray(capabilities)
  ? capabilities.includes(capability)
  : Boolean(capabilities?.[capability]);

const isElement = value => typeof Element !== 'undefined' && value instanceof Element;
const EDITABLE_SHORTCUT_TARGETS = [
  'input',
  'textarea',
  'select',
  '[contenteditable]:not([contenteditable="false"])',
  '[role~="textbox"]',
  '[role~="searchbox"]',
  '[role~="combobox"]',
  '[role~="listbox"]',
  '[role~="spinbutton"]'
].join(', ');

const isEditableTarget = target => isElement(target) && Boolean(target.closest(EDITABLE_SHORTCUT_TARGETS));
const shortcutScopeRoot = scopeRoot => {
  const candidate = scopeRoot && typeof scopeRoot === 'object' && 'current' in scopeRoot
    ? scopeRoot.current
    : scopeRoot;
  return isElement(candidate) ? candidate : null;
};

const documentForShortcutEvent = event => {
  if (isElement(event?.target)) return event.target.ownerDocument;
  if (event?.view?.document) return event.view.document;
  return typeof document === 'undefined' ? null : document;
};

const hasOpenShortcutDialog = documentRef => Array.from(documentRef?.querySelectorAll?.('dialog[open], [role~="dialog"], [role~="alertdialog"]') || EMPTY_LIST)
  .some((dialog: any) => !dialog.closest('[hidden], [aria-hidden="true"]'));

/**
 * Returns whether a global CAD shortcut may act on this key event.
 *
 * It keeps model-space shortcuts out of text controls and modal dialogs. Pass
 * an HTMLElement or React ref through `scopeRoot` to confine shortcuts to a
 * viewport or another explicit interaction region.
 */
export function shouldHandleCadShortcut(event: any, { scopeRoot }: CadAnyProps = EMPTY_OBJECT): boolean {
  if (!event || event.defaultPrevented || event.repeat || event.isComposing || event.keyCode === 229) return false;
  const scopeWasProvided = scopeRoot !== undefined && scopeRoot !== null;
  const scope = shortcutScopeRoot(scopeRoot);
  const target = event.target;
  if (scopeWasProvided && (!scope || !isElement(target) || !scope.contains(target))) return false;
  if (isEditableTarget(target) || hasOpenShortcutDialog(documentForShortcutEvent(event))) return false;
  return true;
}

const eventShortcut = event => {
  const eventKey = text(event.key).toUpperCase();
  const key = eventKey === 'DEL' ? 'DELETE' : eventKey;
  if (!key || ['CONTROL', 'ALT', 'SHIFT', 'META'].includes(key)) return '';
  const modifiers = [event.ctrlKey || event.metaKey ? 'CTRL' : '', event.altKey ? 'ALT' : '', event.shiftKey ? 'SHIFT' : ''].filter(Boolean);
  return [...modifiers, key].join('+');
};

const normaliseShortcut = shortcut => text(shortcut)
  .toUpperCase()
  .replace(/COMMAND|CMD/g, 'CTRL')
  .replace(/\bDEL\b/g, 'DELETE')
  .replace(/\s+/g, '');

/**
 * Declarative, serializable CUI registry. Keep executable callbacks out of
 * this object: runtime adapters receive an `intent` when a command is run.
 * The same schema can therefore drive a ribbon, quick access bar, context
 * menus and a command palette without coupling to a window manager.
 */
export function defineCadCuiSystem(definition: CadAnyProps = EMPTY_OBJECT) {
  const commands = (Array.isArray(definition.commands) ? definition.commands : EMPTY_LIST)
    .map(command => ({
      id: text(command?.id),
      label: text(command?.label),
      detail: text(command?.detail || command?.description),
      icon: text(command?.icon),
      tone: text(command?.tone) || 'cyan',
      toolId: text(command?.toolId),
      shortcut: text(command?.shortcut),
      requires: unique(command?.requires),
      customizable: command?.customizable !== false,
      alwaysVisible: Boolean(command?.alwaysVisible),
      disabled: Boolean(command?.disabled),
      active: Boolean(command?.active),
      badge: copyBadge(command?.badge),
      selection: copySelectionRule(command?.selection),
      intent: copyIntent(command?.intent),
      placements: (Array.isArray(command?.placements) ? command.placements : EMPTY_LIST).map(copyPlacement)
    }))
    .filter(command => command.id && command.label);
  const commandIds = new Set(commands.map(command => command.id));
  const tabs = (Array.isArray(definition.tabs) ? definition.tabs : EMPTY_LIST)
    .map(tab => ({ id: text(tab?.id), label: text(tab?.label) || text(tab?.id), color: text(tab?.color) || '#00fbfb', tone: text(tab?.tone) || 'cyan' }))
    .filter(tab => tab.id);
  const seenGroupIds = new Set();
  const groups = (Array.isArray(definition.groups) ? definition.groups : EMPTY_LIST)
    .map(copyGroup)
    .filter(group => {
      if (!group.id || seenGroupIds.has(group.id)) return false;
      seenGroupIds.add(group.id);
      return true;
    });
  const calibration = definition.calibration && typeof definition.calibration === 'object' ? definition.calibration : EMPTY_OBJECT;
  const accentModes = (Array.isArray(calibration.accentModes) ? calibration.accentModes : EMPTY_LIST).map(copyOption).filter(option => option.id);
  const densities = (Array.isArray(calibration.densities) ? calibration.densities : EMPTY_LIST).map(copyOption).filter(option => option.id);
  const details = (Array.isArray(calibration.details) ? calibration.details : EMPTY_LIST).map(copyOption).filter(option => option.id);
  const panels = (Array.isArray(definition.panels) ? definition.panels : EMPTY_LIST)
    .map(panel => ({ ...panel, id: text(panel?.id), title: text(panel?.title) || text(panel?.id) }))
    .filter(panel => panel.id);
  const defaults = definition.defaults && typeof definition.defaults === 'object' ? definition.defaults : EMPTY_OBJECT;
  const defaultState = {
    version: Number(definition.version) || CAD_CUI_RUNTIME_VERSION,
    activeTab: tabs.some(tab => tab.id === defaults.activeTab) ? defaults.activeTab : (tabs[0]?.id || ''),
    hiddenCommandIds: unique(defaults.hiddenCommandIds).filter(id => commandIds.has(id)),
    accentMode: accentModes.some(option => option.id === defaults.accentMode) ? defaults.accentMode : (accentModes[0]?.id || ''),
    density: densities.some(option => option.id === defaults.density) ? defaults.density : (densities[0]?.id || ''),
    detail: details.some(option => option.id === defaults.detail) ? defaults.detail : (details[0]?.id || ''),
    quickAccessIds: unique(defaults.quickAccessIds).filter(id => commandIds.has(id)),
    recentCommandIds: EMPTY_LIST,
    commandStatus: { phase: 'idle', id: '', error: '' }
  };
  return deepFreeze({
    id: text(definition.id) || 'cad-cui',
    version: Number(definition.version) || CAD_CUI_RUNTIME_VERSION,
    storageKey: text(definition.storageKey) || 'cad-cui-preferences:v1',
    tabs,
    groups,
    panels,
    commands,
    calibration: { accentModes, densities, details },
    defaultState
  });
}

export const DEFAULT_CAD_CUI_SYSTEM = defineCadCuiSystem({ id: 'cad-cui-default' });

const commandMapFor = (system: any) => new Map<any, CadAnyProps>(system.commands.map((command: any) => [command.id, command]));
const optionExists = (options: any[], value: any) => options.some(option => option.id === value);
const commandStateFor = (commandStates: any, command: any, context: CadAnyProps = EMPTY_OBJECT): CadAnyProps => {
  const candidate = typeof commandStates === 'function'
    ? commandStates(command, context)
    : commandStates instanceof Map
      ? commandStates.get(command?.id)
      : commandStates?.[command?.id];
  return candidate && typeof candidate === 'object' ? candidate : EMPTY_OBJECT;
};

/**
 * Resolves host-owned command state without putting executable or transient
 * data into the serializable registry. It is used by every command surface so
 * visibility, disabled state, selected/pressed treatment and badges never
 * drift apart between the ribbon, palette and quick access bar.
 */
export function resolveCadCuiCommand(command: any, {
  state = EMPTY_OBJECT,
  capabilities = EMPTY_OBJECT,
  commandStates = EMPTY_OBJECT,
  selection = EMPTY_SELECTION,
  placement = command?.placement,
  surface = placement?.surface || '',
  unavailablePresentation = 'hide'
}: CadAnyProps = EMPTY_OBJECT) {
  if (!command) return null;
  const normalizedSelection = normalizeCadSelection(selection);
  const selectionMatch = matchesCadSelection(command.selection, normalizedSelection);
  const dynamicState = commandStateFor(commandStates, command, {
    command,
    selection: normalizedSelection,
    state,
    capabilities,
    placement,
    surface
  });
  const hiddenCommandIds = new Set(state?.hiddenCommandIds || EMPTY_LIST);
  const requirements = Array.isArray(command.requires) ? command.requires : EMPTY_LIST;
  let visible = (command.alwaysVisible || !hiddenCommandIds.has(command.id))
    && requirements.every(requirement => capabilityEnabled(capabilities, requirement))
    && dynamicState.visible !== false;
  let disabled = Boolean(command.disabled || dynamicState.disabled || dynamicState.enabled === false);
  if (!selectionMatch.matches) {
    if (unavailablePresentation === 'disable') disabled = true;
    else visible = false;
  }
  const active = hasOwn(dynamicState, 'active') ? Boolean(dynamicState.active) : Boolean(command.active);
  const badge = hasOwn(dynamicState, 'badge')
    ? copyBadge(dynamicState.badge)
    : hasOwn(placement, 'badge') && placement.badge !== ''
      ? placement.badge
      : command.badge;
  return {
    ...command,
    placement,
    visible,
    disabled,
    active,
    badge,
    selection: normalizedSelection,
    selectionMatched: selectionMatch.matches,
    unavailableReason: selectionMatch.reason
  };
}

// A descriptive alias for adapters that consume just the effective view state.
export const resolveCadCuiCommandState = resolveCadCuiCommand;

const presentedCommand = (command, placement) => ({
  ...command,
  label: placement.label || command.label,
  detail: placement.detail || command.detail,
  icon: placement.icon || command.icon,
  tone: placement.tone || command.tone,
  placement
});

export function sanitizeCadCuiState(system: any, candidate: any): CadAnyProps {
  const source = candidate && typeof candidate === 'object' ? candidate : EMPTY_OBJECT;
  const commands = commandMapFor(system);
  const legacyHidden = Array.isArray(source.hiddenToolIds)
    ? system.commands.filter(command => source.hiddenToolIds.includes(command.toolId)).map(command => command.id)
    : EMPTY_LIST;
  const hiddenCommandIds = unique(source.hiddenCommandIds || legacyHidden)
    .filter(commandId => commands.has(commandId) && !commands.get(commandId).alwaysVisible);
  return {
    version: system.version,
    activeTab: system.tabs.some(tab => tab.id === source.activeTab) ? source.activeTab : system.defaultState.activeTab,
    hiddenCommandIds,
    accentMode: optionExists(system.calibration.accentModes, source.accentMode) ? source.accentMode : system.defaultState.accentMode,
    density: optionExists(system.calibration.densities, source.density) ? source.density : system.defaultState.density,
    detail: optionExists(system.calibration.details, source.detail) ? source.detail : system.defaultState.detail,
    quickAccessIds: unique(source.quickAccessIds || system.defaultState.quickAccessIds).filter(commandId => commands.has(commandId)),
    recentCommandIds: unique(source.recentCommandIds).filter(commandId => commands.has(commandId)).slice(0, 8),
    commandStatus: { phase: 'idle', id: '', error: '' }
  };
}

export function loadCadCuiState(system: any, storage: Pick<Storage, 'getItem'> | null = typeof window === 'undefined' ? null : window.localStorage): CadAnyProps {
  if (!storage) return sanitizeCadCuiState(system, system.defaultState);
  try {
    const raw = storage.getItem(system.storageKey);
    if (!raw) return sanitizeCadCuiState(system, system.defaultState);
    const payload = JSON.parse(raw);
    return sanitizeCadCuiState(system, payload?.preferences || payload);
  } catch {
    return sanitizeCadCuiState(system, system.defaultState);
  }
}

export function saveCadCuiState(system: any, state: any, storage: Pick<Storage, 'setItem'> | null = typeof window === 'undefined' ? null : window.localStorage): boolean {
  if (!storage) return false;
  try {
    const preferences = sanitizeCadCuiState(system, state);
    storage.setItem(system.storageKey, JSON.stringify({ version: system.version, preferences: {
      activeTab: preferences.activeTab,
      hiddenCommandIds: preferences.hiddenCommandIds,
      accentMode: preferences.accentMode,
      density: preferences.density,
      detail: preferences.detail,
      quickAccessIds: preferences.quickAccessIds
    } }));
    return true;
  } catch {
    return false;
  }
}

export function selectCadCuiCommands(system: any, state: any, {
  surface = 'palette',
  tabId = '',
  menuId = '',
  groupId = '',
  capabilities = EMPTY_OBJECT,
  commandStates = EMPTY_OBJECT,
  selection = EMPTY_SELECTION,
  unavailablePresentation = 'hide'
}: CadAnyProps = EMPTY_OBJECT) {
  const hidden = new Set(state?.hiddenCommandIds || EMPTY_LIST);
  const normalizedSelection = normalizeCadSelection(selection);
  return system.commands.flatMap(command => {
    if (hidden.has(command.id) && !command.alwaysVisible) return EMPTY_LIST;
    if (command.requires.some(requirement => !capabilityEnabled(capabilities, requirement))) return EMPTY_LIST;
    const placement = surface === 'palette'
      ? { surface: 'palette', order: 0 }
      : command.placements.find(item => item.surface === surface && (!tabId || item.tab === tabId) && (!menuId || item.menu === menuId) && (!groupId || item.groupId === groupId));
    if (!placement) return EMPTY_LIST;
    const resolved = resolveCadCuiCommand(presentedCommand(command, placement), {
      state,
      capabilities,
      commandStates,
      selection: normalizedSelection,
      placement,
      surface,
      unavailablePresentation
    });
    return resolved?.visible ? [resolved] : EMPTY_LIST;
  }).sort((first, second) => first.placement.order - second.placement.order || first.label.localeCompare(second.label, 'hu'));
}

/**
 * Returns command groups with their resolved commands. Groups are opt-in:
 * registries with no `groups` keep the legacy flat ribbon output untouched.
 */
export function selectCadCuiCommandGroups(system: any, state: any, {
  surface = 'ribbon',
  tabId = '',
  menuId = '',
  capabilities = EMPTY_OBJECT,
  commandStates = EMPTY_OBJECT,
  selection = EMPTY_SELECTION,
  unavailablePresentation = 'hide'
}: CadAnyProps = EMPTY_OBJECT) {
  const configuredGroups = (Array.isArray(system?.groups) ? system.groups : EMPTY_LIST)
    .filter(group => (!group.surface || group.surface === surface) && (!tabId || !group.tab || group.tab === tabId) && (!menuId || !group.menu || group.menu === menuId))
    .sort((first, second) => first.order - second.order || first.label.localeCompare(second.label, 'hu'));
  if (!configuredGroups.length) return EMPTY_LIST;
  const commands = selectCadCuiCommands(system, state, {
    surface,
    tabId,
    menuId,
    capabilities,
    commandStates,
    selection,
    unavailablePresentation
  });
  const groupedIds = new Set();
  const groups = configuredGroups.map(group => {
    const groupCommands = commands
      .filter(command => command.placement.groupId === group.id)
      .map(command => command.placement.control || !group.control ? command : {
        ...command,
        placement: { ...command.placement, control: group.control }
      });
    groupCommands.forEach(command => groupedIds.add(command.id));
    return { ...group, commands: groupCommands };
  }).filter(group => group.commands.length);
  const ungroupedCommands = commands.filter(command => !groupedIds.has(command.id));
  if (ungroupedCommands.length) {
    groups.push({ id: '__ungrouped__', label: 'EGYÉB PARANCSOK', detail: '', icon: '', tone: 'cyan', surface, tab: tabId, menu: menuId, control: '', order: Number.MAX_SAFE_INTEGER, commands: ungroupedCommands });
  }
  return groups;
}

const createCadCuiReducer = (system: any) => (state: any, action: any): any => {
  switch (action.type) {
    case 'tab.select':
      return sanitizeCadCuiState(system, { ...state, activeTab: action.tabId });
    case 'command.visibility': {
      const command = system.commands.find(candidate => candidate.id === action.commandId);
      if (!command || command.alwaysVisible) return state;
      const hiddenCommandIds = state.hiddenCommandIds.includes(action.commandId)
        ? state.hiddenCommandIds.filter(commandId => commandId !== action.commandId)
        : [...state.hiddenCommandIds, action.commandId];
      return sanitizeCadCuiState(system, { ...state, hiddenCommandIds });
    }
    case 'preference.set':
      return sanitizeCadCuiState(system, { ...state, [action.key]: action.value });
    case 'preferences.reset':
      return sanitizeCadCuiState(system, system.defaultState);
    case 'command.completed':
      return { ...state, recentCommandIds: unique([action.commandId, ...state.recentCommandIds]).slice(0, 8), commandStatus: { phase: 'idle', id: action.commandId, error: '' } };
    case 'command.failed':
      return { ...state, commandStatus: { phase: 'error', id: action.commandId, error: text(action.error) || 'COMMAND_FAILED' } };
    default:
      return state;
  }
};

/**
 * Copy/paste integration:
 *
 * <CadCuiProvider registry={registry} capabilities={{ admin: isAdmin }}
 *   selection={{ ids: selectedIds, entityTypes: selectedTypes, traits: ['editable'] }}
 *   commandStates={{ 'draw.line': { active: true, badge: 2 } }} handlers={{
 *   'panel.open': ({ intent }) => openWorkspacePanel(intent.panelId),
 *   'panel.place': ({ intent }) => placeWorkspacePanel(intent.panelId, intent.placement),
 *   'workspace.reset-layout': () => resetWorkspaceLayout(),
 *   'workspace.toggle-fullscreen': () => toggleWorkspaceFullscreen()
 * }}>
 *   <CadCuiRibbon iconMap={icons} />
 *   <CadCuiQuickAccess iconMap={icons} />
 *   <CadCuiContextMenu menuId="node" iconMap={icons} />
 *   <CadCuiCommandPalette iconMap={icons} />
 *   <CadCuiCustomizer />
 * </CadCuiProvider>
 *
 * The provider owns only serializable UI preferences. Domain data, window
 * manager handles and authorization remain in the application adapter.
 */
export function CadCuiProvider({ registry = DEFAULT_CAD_CUI_SYSTEM, capabilities = EMPTY_OBJECT, selection = EMPTY_SELECTION, commandStates = EMPTY_OBJECT, handlers = EMPTY_OBJECT, onCommand, shortcutScope, children }: CadAnyProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, dispatch] = useReducer(createCadCuiReducer(registry), registry, system => loadCadCuiState(system));
  const commandMap = useMemo(() => commandMapFor(registry), [registry]);
  const normalizedSelection = useMemo(() => normalizeCadSelection(selection), [selection]);

  useEffect(() => {
    saveCadCuiState(registry, state);
  }, [registry, state]);

  const resolveCommand = useCallback((command: any, placement?: any) => resolveCadCuiCommand(command, {
    state,
    capabilities,
    commandStates,
    selection: normalizedSelection,
    placement
  }), [capabilities, commandStates, normalizedSelection, state]);

  const canExecute = useCallback(command => {
    const resolved = resolveCommand(command);
    return Boolean(resolved?.visible && !resolved.disabled);
  }, [resolveCommand]);

  const selectCommands = useCallback((options = EMPTY_OBJECT) => selectCadCuiCommands(registry, state, {
    ...options,
    capabilities,
    commandStates,
    selection: options.selection ?? normalizedSelection
  }), [capabilities, commandStates, normalizedSelection, registry, state]);
  const selectCommandGroups = useCallback((options = EMPTY_OBJECT) => selectCadCuiCommandGroups(registry, state, {
    ...options,
    capabilities,
    commandStates,
    selection: options.selection ?? normalizedSelection
  }), [capabilities, commandStates, normalizedSelection, registry, state]);

  const executeCommand = useCallback(async (commandId, { source = 'api', payload = EMPTY_OBJECT } = EMPTY_OBJECT) => {
    const command = commandMap.get(commandId);
    if (!command) return { ok: false, reason: 'COMMAND_NOT_FOUND' };
    const resolvedCommand = resolveCommand(command);
    if (!resolvedCommand?.visible || resolvedCommand.disabled) return { ok: false, reason: 'COMMAND_NOT_AVAILABLE' };
    const intent = { ...command.intent, ...(payload && typeof payload === 'object' ? payload : EMPTY_OBJECT) };
    // Keep `command` as the immutable registry declaration for existing host
    // handlers. Consumers that need the host-resolved visual/executable state
    // can opt into the additive `resolvedCommand` field.
    const event = { commandId, command, resolvedCommand, intent, payload, source, state, selection: normalizedSelection, location };
    try {
      if (intent.type === 'route.navigate') navigate(intent.to, intent.options);
      else {
        const handler = handlers[intent.type];
        if (typeof handler !== 'function') return { ok: false, reason: 'COMMAND_HANDLER_NOT_FOUND' };
        await handler({ ...event, navigate });
      }
      onCommand?.(event);
      dispatch({ type: 'command.completed', commandId });
      return { ok: true, event };
    } catch (error) {
      dispatch({ type: 'command.failed', commandId, error: error instanceof Error ? error.message : String(error) });
      return { ok: false, reason: 'COMMAND_FAILED', error };
    }
  }, [commandMap, handlers, location, navigate, normalizedSelection, onCommand, resolveCommand, state]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onKeyDown = event => {
      if (!shouldHandleCadShortcut(event, { scopeRoot: shortcutScope })) return;
      const shortcut = eventShortcut(event);
      if (!shortcut) return;
      const commands = registry.commands.filter(candidate => normaliseShortcut(candidate.shortcut) === shortcut && canExecute(candidate));
      if (commands.length !== 1) return;
      event.preventDefault();
      void executeCommand(commands[0].id, { source: 'shortcut' });
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [canExecute, executeCommand, registry.commands, shortcutScope]);

  const value = useMemo(() => ({
    registry,
    state,
    capabilities,
    selection: normalizedSelection,
    commandStates,
    resolveCommand,
    selectCommands,
    selectCommandGroups,
    executeCommand,
    setActiveTab: tabId => dispatch({ type: 'tab.select', tabId }),
    setPreference: (key, value) => dispatch({ type: 'preference.set', key, value }),
    toggleCommandVisibility: commandId => dispatch({ type: 'command.visibility', commandId }),
    resetPreferences: () => dispatch({ type: 'preferences.reset' }),
    canExecute
  }), [canExecute, capabilities, commandStates, executeCommand, normalizedSelection, registry, resolveCommand, selectCommands, selectCommandGroups, state]);

  return <CadCuiContext.Provider value={value}>{children}</CadCuiContext.Provider>;
}

export function useCadCui() {
  const value = useContext(CadCuiContext);
  if (!value) throw new Error('useCadCui must be used below CadCuiProvider.');
  return value;
}

export function useCadCuiCommand(commandId: any, source = 'api') {
  const { executeCommand } = useCadCui();
  return useCallback((payload?: any) => executeCommand(commandId, { source, payload }), [commandId, executeCommand, source]);
}

/**
 * Resolves only the currently meaningful commands for a selection surface.
 * It is a thin adapter over the shared CUI registry, so a host can feed the
 * result directly into `CadGripToolbar` without creating another command list.
 */
export function useCadSelectionActions({ surface = 'selection-toolbar', tabId = '', menuId = '', groupId = '' }: CadAnyProps = EMPTY_OBJECT) {
  const { selection, selectCommands, executeCommand } = useCadCui();
  const actions = useMemo(() => selectCommands({ surface, tabId, menuId, groupId, unavailablePresentation: 'hide' }), [groupId, menuId, selectCommands, surface, tabId]);
  const execute = useCallback((action: any, payload?: any) => {
    const commandId = typeof action === 'string' ? action : action?.id;
    return executeCommand(commandId, { source: surface, payload });
  }, [executeCommand, surface]);
  return { selection, actions, execute };
}

const resolveIcon = (iconMap, icon) => iconMap?.[icon] || null;

function CadCuiCommandButton({ command, iconMap, source, role, badge, className }: CadAnyProps) {
  const { executeCommand } = useCadCui();
  const Icon = resolveIcon(iconMap, command.icon);
  const control = command.placement?.control || 'button';
  const isToggle = ['toggle', 'switch', 'checkbox', 'radio'].includes(control.toLocaleLowerCase('en'));
  const hasBadge = command.badge !== '' && command.badge !== undefined && command.badge !== null;
  return <CadActionButton type="button" role={role} icon={Icon} tone={command.tone} className={className} data-command-id={command.id} data-command-control={control} data-active={command.active ? 'true' : 'false'} data-badge={hasBadge ? String(command.badge) : undefined} title={command.detail || command.label} aria-label={hasBadge ? `${command.label}, ${command.badge}` : command.label} aria-pressed={isToggle ? command.active : undefined} disabled={command.disabled} onClick={() => { void executeCommand(command.id, { source }); }}>
    {badge ?? command.label}
    {hasBadge && <em data-cui-command-badge="true" aria-hidden="true">{command.badge}</em>}
  </CadActionButton>;
}

export function CadCuiRibbon({ iconMap = EMPTY_OBJECT, className, title = 'PARANCS SZALAG', description = 'Deklaratív CUI-regiszterből épített munkatéri parancsok', renderBadge, ...props }: CadAnyProps) {
  const { registry, state, selectCommands, selectCommandGroups, setActiveTab } = useCadCui();
  const activeTab = registry.tabs.find(tab => tab.id === state.activeTab) || registry.tabs[0];
  const commands = selectCommands({ surface: 'ribbon', tabId: activeTab?.id });
  const commandGroups = registry.groups?.length ? selectCommandGroups({ surface: 'ribbon', tabId: activeTab?.id }) : EMPTY_LIST;
  const hasGroups = commandGroups.length > 0;
  return <CadPanelShell {...props} tone={activeTab?.tone || 'cyan'} scroll={false} className={className} data-testid={props['data-testid'] || 'cad-cui-ribbon'}>
    <CadPanelHeader eyebrow="CUI REGISZTER" title={title} description={description} status={activeTab?.label || 'NÉZET'} />
    <CadPanelSection eyebrow="MUNKATÉR" title="PARANCSCSOPORT" compact>
      <CadSegmentTabs label="CAD szalag fülek" activeId={activeTab?.id} onChange={setActiveTab} items={registry.tabs.map(tab => ({ id: tab.id, label: tab.label }))} />
      {hasGroups
        ? <div className="cad-cui-command-groups cad-cui-command-grid--ribbon" data-cui-grouped-ribbon="true">
          {commandGroups.map(group => <section key={group.id} className="cad-cui-command-group" data-command-group-id={group.id} data-command-control={group.control || undefined} role="group" aria-label={group.label}>
            <header>{group.label}{group.detail && <small>{group.detail}</small>}</header>
            <div className="cad-cui-command-grid" role="toolbar" aria-label={`${group.label} parancsok`}>
              {group.commands.map(command => <CadCuiCommandButton key={command.id} command={command} iconMap={iconMap} source="ribbon" badge={renderBadge?.(command) ?? command.label} />)}
            </div>
          </section>)}
        </div>
        : <div className="cad-cui-command-grid cad-cui-command-grid--ribbon" role="toolbar" aria-label={`${activeTab?.label || 'CAD'} parancsok`}>
          {commands.map(command => <CadCuiCommandButton key={command.id} command={command} iconMap={iconMap} source="ribbon" badge={renderBadge?.(command) ?? command.label} />)}
        </div>}
    </CadPanelSection>
  </CadPanelShell>;
}

export function CadCuiQuickAccess({ iconMap = EMPTY_OBJECT, commandIds, className, ...props }: CadAnyProps) {
  const { registry, state, resolveCommand } = useCadCui();
  const requestedIds = Array.isArray(commandIds) ? commandIds : state.quickAccessIds;
  const commands = requestedIds.map(commandId => registry.commands.find(command => command.id === commandId))
    .filter(Boolean)
    .map(command => {
      const placement = command.placements.find(item => item.surface === 'quick-access');
      return resolveCommand(placement ? presentedCommand(command, placement) : command, placement);
    })
    .filter(command => command?.visible);
  return <div {...props} className={['cad-cui-quick-access', className].filter(Boolean).join(' ')} data-testid={props['data-testid'] || 'cad-cui-quick-access'} role="toolbar" aria-label="Gyors elérés">
    {commands.map(command => <CadCuiCommandButton key={command.id} command={command} iconMap={iconMap} source="quick-access" />)}
  </div>;
}

export function CadCuiContextMenu({ menuId = 'canvas', iconMap = EMPTY_OBJECT, className, onClose, ...props }: CadAnyProps) {
  const { selectCommands } = useCadCui();
  const commands = selectCommands({ surface: 'context', menuId });
  return <CadPanelShell {...props} as="aside" role="menu" aria-label="CUI helyi menü" tone="magenta" density="compact" scroll={false} className={className} data-testid={props['data-testid'] || 'cad-cui-context-menu'}>
    <CadPanelHeader eyebrow="KONTEXTUS" title="GYORSPARANCSOK" actions={onClose && <CadActionButton compact onClick={onClose} aria-label="Helyi menü bezárása">BEZÁR</CadActionButton>} />
    <CadPanelSection compact>
      <div className="cad-cui-command-grid">
        {commands.map(command => <CadCuiCommandButton key={command.id} command={command} iconMap={iconMap} source="context" role="menuitem" />)}
        {!commands.length && <CadEmptyState title="NINCS ELÉRHETŐ PARANCS">A jogosultság vagy a profil jelenleg elrejti ezt a menüt.</CadEmptyState>}
      </div>
    </CadPanelSection>
  </CadPanelShell>;
}

export function CadCuiCommandPalette({ iconMap = EMPTY_OBJECT, className, ...props }: CadAnyProps) {
  const { selectCommands, state } = useCadCui();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const commands = useMemo(() => {
    const needle = text(deferredQuery).toLocaleLowerCase('hu');
    return selectCommands({ surface: 'palette' }).filter(command => !needle || `${command.label} ${command.detail} ${command.shortcut}`.toLocaleLowerCase('hu').includes(needle));
  }, [deferredQuery, selectCommands]);
  return <CadPanelShell {...props} tone="violet" className={className} data-testid={props['data-testid'] || 'cad-cui-command-palette'}>
    <CadPanelHeader eyebrow="CUI PARANCSOK" title="PARANCS PALETTA" description="A szalag, a gyorselérés és a helyi menük közös kereshető parancsregisztere." status={`${commands.length} TALÁLAT`} />
    <CadPanelSection compact>
      <label className="cad-cui-sr-only" htmlFor="cad-cui-command-query">Parancs keresése</label>
      <input id="cad-cui-command-query" value={query} onChange={event => setQuery(event.target.value)} placeholder="PARANCS KERESÉSE…" className="cad-cui-command-palette__input" />
      <div className="cad-cui-command-grid">
        {commands.map(command => <CadCuiCommandButton key={command.id} command={command} iconMap={iconMap} source="palette" />)}
        {!commands.length && <CadEmptyState title="NINCS TALÁLAT">Próbálj meg másik parancsnevet vagy engedélyezd a rejtett elemet.</CadEmptyState>}
      </div>
    </CadPanelSection>
    <CadPanelFooter>UTOLSÓ PARANCS: {state.recentCommandIds[0] || 'NINCS'}</CadPanelFooter>
  </CadPanelShell>;
}

export function CadCuiCustomizer({ className, ...props }: CadAnyProps) {
  const { registry, state, setPreference, toggleCommandVisibility, resetPreferences } = useCadCui();
  const hiddenCommands = new Set(state.hiddenCommandIds);
  return <CadPanelShell {...props} tone="magenta" className={className} data-testid={props['data-testid'] || 'cad-cui-customizer'}>
    <CadPanelHeader eyebrow="MUNKATÉR KALIBRÁLÁSA" title="CUI PROFIL" description="A beállítások csak a személyes munkatéri nézetet módosítják; a parancsok és a jogosultságok központilag definiáltak." actions={<CadActionButton compact onClick={resetPreferences}>ALAPÉRTELMEZETT</CadActionButton>} />
    <CadPanelSection eyebrow="VIZUÁLIS PROFIL" title="AKCENTUS" compact>
      <CadSegmentTabs label="Akcentusszín" activeId={state.accentMode} onChange={value => setPreference('accentMode', value)} items={registry.calibration.accentModes.map(option => ({ id: option.id, label: option.label }))} />
    </CadPanelSection>
    <CadPanelSection eyebrow="TARTALMI NÉZET" title="INFORMÁCIÓS SŰRŰSÉG" compact>
      <div className="cad-cui-stack cad-cui-stack--regular">
        <CadSegmentTabs label="Tartalmi sűrűség" activeId={state.density} onChange={value => setPreference('density', value)} items={registry.calibration.densities.map(option => ({ id: option.id, label: option.label }))} />
        <CadSegmentTabs label="Információs részletesség" activeId={state.detail} onChange={value => setPreference('detail', value)} items={registry.calibration.details.map(option => ({ id: option.id, label: option.label }))} />
      </div>
    </CadPanelSection>
    <CadPanelSection eyebrow="PARANCSKIOSZTÁS" title="LÁTHATÓ PARANCSOK" compact>
      <div className="cad-cui-command-grid">
        {registry.commands.filter(command => command.customizable).map(command => <CadDataRow as="label" key={command.id} title={command.label} detail={command.detail} active={!hiddenCommands.has(command.id)} tone={command.tone} actions={<input aria-label={`${command.label} láthatósága`} type="checkbox" checked={!hiddenCommands.has(command.id)} onChange={() => toggleCommandVisibility(command.id)} />} />)}
      </div>
    </CadPanelSection>
  </CadPanelShell>;
}
