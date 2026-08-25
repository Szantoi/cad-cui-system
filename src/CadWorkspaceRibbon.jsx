import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { CadShortcutHint } from './CadCommandUi.jsx';
import { asArray, cx, itemLabel, useControllableState } from './cadUiUtils.js';
import { toTrimmedString as text } from './cadValueUtils.js';

const numericOrder = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const commandTabId = command => text(command?.tabId || command?.tab || command?.placement?.tab);
const commandGroupId = (command, fallback) => text(command?.groupId || command?.group || command?.placement?.groupId || command?.placement?.group) || fallback;
const commandGroupLabel = (command, fallback) => text(command?.groupLabel || command?.placement?.groupLabel || command?.placement?.group) || fallback;
const commandOrder = (command, fallback) => numericOrder(command?.order ?? command?.placement?.order, fallback);
const groupTabId = group => text(group?.tabId || group?.tab || group?.placement?.tab);
const groupItems = group => asArray(group?.commands).length ? asArray(group.commands) : asArray(group?.items);
const safeId = value => text(value).replace(/[^a-zA-Z0-9_-]+/g, '-') || 'workspace';
const targetIsInside = (container, target) => {
  if (!container || !target) return false;
  try { return container === target || Boolean(container.contains?.(target)); } catch { return false; }
};
const scheduleFrame = callback => {
  if (typeof window === 'undefined') return;
  const schedule = window.requestAnimationFrame || (next => window.setTimeout(next, 0));
  schedule(callback);
};
const FIRST_COMMAND_FOCUSABLE = [
  'button:not(:disabled)',
  'a[href]',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[role="button"]:not([aria-disabled="true"])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

/**
 * Turns flat command declarations into stable, ordered ribbon groups.
 *
 * It understands either generic `{ tabId, groupId, groupLabel, order }`
 * fields or the serializable `placement` shape emitted by `CadCuiRuntime`.
 * No command is executed or mutated here, so it is safe to use with any
 * drawing renderer, router or state manager.
 */
export function groupCadWorkspaceRibbonCommands(commands = [], {
  tabId = '',
  defaultGroupId = 'commands',
  defaultGroupLabel = 'COMMANDS'
} = {}) {
  const groups = new Map();

  asArray(commands).forEach((command, index) => {
    if (!command || typeof command !== 'object') return;
    const sourceTabId = commandTabId(command);
    if (tabId && sourceTabId && sourceTabId !== tabId) return;

    const id = commandGroupId(command, defaultGroupId);
    const label = commandGroupLabel(command, defaultGroupLabel);
    const order = commandOrder(command, index);
    const existing = groups.get(id);
    if (existing) {
      existing.commands.push({ command, order, index });
      existing.order = Math.min(existing.order, order);
      return;
    }
    groups.set(id, { id, label, order, index, commands: [{ command, order, index }] });
  });

  return [...groups.values()]
    .sort((first, second) => first.order - second.order || first.index - second.index)
    .map(group => ({
      id: group.id,
      label: group.label,
      commands: group.commands
        .sort((first, second) => first.order - second.order || first.index - second.index)
        .map(entry => entry.command)
    }));
}

const visibleGroups = ({ groups, commands, activeTabId, defaultGroupId, defaultGroupLabel }) => {
  const explicitGroups = asArray(groups)
    .filter(group => group && typeof group === 'object' && (!activeTabId || !groupTabId(group) || groupTabId(group) === activeTabId))
    .map((group, index) => ({
      id: text(group.id) || `group-${index + 1}`,
      label: text(group.label) || defaultGroupLabel,
      order: numericOrder(group.order, index),
      commands: groupItems(group).filter(command => !activeTabId || !commandTabId(command) || commandTabId(command) === activeTabId)
    }))
    .filter(group => group.commands.length);

  if (explicitGroups.length) return explicitGroups.sort((first, second) => first.order - second.order);
  return groupCadWorkspaceRibbonCommands(commands, { tabId: activeTabId, defaultGroupId, defaultGroupLabel });
};

const defaultIcon = (command, compact) => {
  if (React.isValidElement(command?.icon)) return command.icon;
  if (typeof command?.icon === 'function') return React.createElement(command.icon, { size: compact ? 13 : 16, 'aria-hidden': true });
  return null;
};

function CadWorkspaceRibbonTool({ command, group, activeTab, compact, renderIcon, renderCommand, onCommand }) {
  const label = itemLabel(command) || 'COMMAND';
  const isToggle = Boolean(command?.toggle || command?.pressed !== undefined || command?.active !== undefined);
  const commandContext = {
    command,
    group,
    activeTab,
    compact,
    source: 'workspace-ribbon',
    execute: event => {
      if (command?.disabled) return;
      command?.onClick?.(command, event);
      onCommand?.(command, { group, activeTab, compact, source: 'workspace-ribbon' }, event);
    }
  };
  const icon = typeof renderIcon === 'function'
    ? renderIcon(command, commandContext)
    : defaultIcon(command, compact);
  const buttonProps = {
    type: 'button',
    disabled: Boolean(command?.disabled),
    'data-cad-ribbon-tool': command?.toolId || command?.id || label,
    'data-command-id': command?.id,
    'data-tone': command?.tone || 'inherit',
    'data-active': command?.active || command?.pressed ? 'true' : 'false',
    'data-testid': command?.testId,
    className: 'cad-workspace-ribbon__tool',
    style: command?.color ? { '--cad-ribbon-tool-accent': command.color } : undefined,
    'aria-label': command?.ariaLabel || command?.accessibleLabel || label,
    'aria-pressed': isToggle ? Boolean(command?.pressed ?? command?.active) : undefined,
    title: command?.title || command?.detail || command?.description || label,
    onClick: commandContext.execute
  };

  const renderedCommand = typeof renderCommand === 'function'
    ? renderCommand(command, { ...commandContext, icon, buttonProps })
    : undefined;
  // A selective renderer can opt into a specialised command component without
  // having to reproduce every ordinary ribbon button. Other explicit return
  // values (including false) retain the caller's existing rendering intent.
  if (renderedCommand !== undefined && renderedCommand !== null) return renderedCommand;

  const badgeVisible = command?.badge !== undefined && command?.badge !== null && command.badge !== '';
  return <button {...buttonProps}>
    {icon && <span className="cad-workspace-ribbon__tool-icon" aria-hidden="true">{icon}{badgeVisible && <em>{command.badge}</em>}</span>}
    {!icon && badgeVisible && <span className="cad-workspace-ribbon__tool-badge-only" aria-hidden="true"><em>{command.badge}</em></span>}
    <span className="cad-workspace-ribbon__tool-label">{label}</span>
    {command?.shortcut && <CadShortcutHint shortcut={command.shortcut} />}
  </button>;
}

/**
 * A renderer-agnostic AutoCAD-style command ribbon.
 *
 * The host keeps command execution, icons, authentication and rendering
 * adapters. This primitive only manages the tab/minimized UI state and emits
 * selected command records through `onCommand`.
 */
export function CadWorkspaceRibbon({
  tabs = [],
  activeTab,
  defaultActiveTab,
  onActiveTabChange,
  groups,
  commands = [],
  defaultGroupId = 'commands',
  defaultGroupLabel = 'COMMANDS',
  label = 'CAD workspace ribbon',
  tabListLabel = 'Workspace commands',
  minimized,
  defaultMinimized = false,
  onMinimizedChange,
  collapsible = true,
  compact = false,
  identity,
  renderIdentity,
  status,
  statusLabel = 'Workspace status',
  renderStatus,
  endSlot,
  renderIcon,
  renderCommand,
  renderMinimizeControl,
  onCommand,
  className,
  style,
  children,
  ...props
}) {
  const generatedId = useId();
  const instanceId = `cad-workspace-ribbon-${safeId(generatedId)}`;
  const tabRefs = useRef(new Map());
  const flyoutRef = useRef(null);
  const suppressNextTabFlyoutRef = useRef(false);
  const pendingTabSelectionRef = useRef('');
  const interactionsRef = useRef({ pointer: false, focus: false });
  const [isFlyoutOpen, setFlyoutOpen] = useState(false);
  const normalizedTabs = useMemo(() => asArray(tabs)
    .filter(tab => tab && text(tab.id))
    .map(tab => ({ ...tab, id: text(tab.id), label: itemLabel(tab) || text(tab.id) })), [tabs]);
  const firstAvailableTabId = normalizedTabs.find(tab => !tab.disabled)?.id || normalizedTabs[0]?.id || '';
  const [requestedActiveTab, setRequestedActiveTab] = useControllableState(
    activeTab,
    defaultActiveTab || firstAvailableTabId,
    (nextTabId, event) => onActiveTabChange?.(nextTabId, normalizedTabs.find(tab => tab.id === nextTabId), event)
  );
  const resolvedActiveTab = normalizedTabs.find(tab => tab.id === requestedActiveTab) || normalizedTabs.find(tab => !tab.disabled) || normalizedTabs[0] || null;
  const resolvedActiveTabId = resolvedActiveTab?.id || '';
  const [isMinimized, setMinimized] = useControllableState(
    minimized,
    defaultMinimized,
    (nextValue, event) => onMinimizedChange?.(Boolean(nextValue), event)
  );
  useEffect(() => {
    if (!isMinimized) {
      setFlyoutOpen(false);
      interactionsRef.current = { pointer: false, focus: false };
    }
  }, [isMinimized]);
  useEffect(() => {
    if (pendingTabSelectionRef.current === resolvedActiveTabId) pendingTabSelectionRef.current = '';
  }, [resolvedActiveTabId]);
  const normalizedGroups = useMemo(() => visibleGroups({
    groups,
    commands,
    activeTabId: resolvedActiveTabId,
    defaultGroupId,
    defaultGroupLabel
  }), [commands, defaultGroupId, defaultGroupLabel, groups, resolvedActiveTabId]);
  const context = { activeTab: resolvedActiveTab, groups: normalizedGroups, compact, minimized: Boolean(isMinimized), flyoutOpen: Boolean(isMinimized && isFlyoutOpen) };
  const identityContent = typeof renderIdentity === 'function' ? renderIdentity(context) : identity;
  const statusContent = typeof renderStatus === 'function' ? renderStatus(context) : status;
  const panelId = `${instanceId}-panel-${safeId(resolvedActiveTabId || 'commands')}`;

  const selectTab = (tab, event) => {
    if (tab.disabled || tab.id === resolvedActiveTabId || pendingTabSelectionRef.current === tab.id) return;
    pendingTabSelectionRef.current = tab.id;
    setRequestedActiveTab(tab.id, event);
    scheduleFrame(() => {
      if (pendingTabSelectionRef.current === tab.id) pendingTabSelectionRef.current = '';
    });
  };
  const openMinimizedFlyout = (tab, event) => {
    if (!isMinimized || tab.disabled) return;
    if (event?.type === 'focus' && suppressNextTabFlyoutRef.current) {
      suppressNextTabFlyoutRef.current = false;
      return;
    }
    if (tab.id !== resolvedActiveTabId) selectTab(tab, event);
    setFlyoutOpen(true);
  };
  const focusFirstFlyoutCommand = () => {
    scheduleFrame(() => flyoutRef.current?.querySelector(FIRST_COMMAND_FOCUSABLE)?.focus());
  };
  const closeMinimizedFlyout = ({ restoreTabFocus = false } = {}) => {
    setFlyoutOpen(false);
    if (!restoreTabFocus || typeof window === 'undefined') return;
    suppressNextTabFlyoutRef.current = true;
    scheduleFrame(() => {
      const tab = tabRefs.current.get(resolvedActiveTabId);
      if (tab) tab.focus();
      else suppressNextTabFlyoutRef.current = false;
    });
  };
  const moveTabFocus = (currentId, direction, event) => {
    const availableTabs = normalizedTabs.filter(tab => !tab.disabled);
    if (!availableTabs.length) return;
    const currentIndex = Math.max(0, availableTabs.findIndex(tab => tab.id === currentId));
    const target = availableTabs[(currentIndex + direction + availableTabs.length) % availableTabs.length];
    event.preventDefault();
    selectTab(target, event);
    tabRefs.current.get(target.id)?.focus();
  };
  const onTabKeyDown = (tab, event) => {
    if (isMinimized && event.key === 'ArrowDown') {
      event.preventDefault();
      openMinimizedFlyout(tab, event);
      focusFirstFlyoutCommand();
      return;
    }
    if (isMinimized && event.key === 'Escape') {
      event.preventDefault();
      closeMinimizedFlyout();
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') moveTabFocus(tab.id, 1, event);
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') moveTabFocus(tab.id, -1, event);
    if (event.key === 'Home') moveTabFocus(normalizedTabs.find(tabItem => !tabItem.disabled)?.id || tab.id, 0, event);
    if (event.key === 'End') {
      const availableTabs = normalizedTabs.filter(tabItem => !tabItem.disabled);
      const lastTab = availableTabs.at(-1);
      if (!lastTab) return;
      event.preventDefault();
      selectTab(lastTab, event);
      tabRefs.current.get(lastTab.id)?.focus();
    }
  };
  const toggleMinimized = event => {
    setFlyoutOpen(false);
    setMinimized(current => !current, event);
  };
  const minimizeControl = typeof renderMinimizeControl === 'function'
    ? renderMinimizeControl({ minimized: Boolean(isMinimized), toggle: toggleMinimized })
    : collapsible && <button
      type="button"
      className="cad-workspace-ribbon__minimize"
      aria-label={isMinimized ? 'Expand ribbon' : 'Minimize ribbon'}
      aria-expanded={!isMinimized}
      title={isMinimized ? 'Expand ribbon' : 'Minimize ribbon'}
      onClick={toggleMinimized}
    ><span aria-hidden="true">{isMinimized ? '⌄' : '⌃'}</span><b>{isMinimized ? 'EXPAND' : 'COMPACT'}</b></button>;

  const renderCommandPanel = flyout => <div
    id={panelId}
    ref={flyout ? flyoutRef : undefined}
    role="tabpanel"
    aria-labelledby={resolvedActiveTabId ? `${instanceId}-tab-${safeId(resolvedActiveTabId)}` : undefined}
    tabIndex={flyout ? -1 : 0}
    className={cx('cad-workspace-ribbon__commands', flyout && 'cad-workspace-ribbon__commands--flyout')}
    onKeyDown={event => {
      if (!flyout || event.defaultPrevented || event.key !== 'Escape') return;
      event.preventDefault();
      closeMinimizedFlyout({ restoreTabFocus: true });
    }}
  >
    <div className="cad-workspace-ribbon__groups" role="group" aria-label={`${resolvedActiveTab?.label || 'CAD'} commands`}>
      {normalizedGroups.map((group, groupIndex) => <section key={group.id} className="cad-workspace-ribbon__group" data-cad-group={group.label} data-primary={groupIndex === 0 ? 'true' : 'false'} aria-label={`${group.label} command group`}>
        <div className="cad-workspace-ribbon__group-tools">
          {group.commands.map((command, commandIndex) => <CadWorkspaceRibbonTool key={command?.id || `${group.id}-${commandIndex}`} command={command} group={group} activeTab={resolvedActiveTab} compact={compact} renderIcon={renderIcon} renderCommand={renderCommand} onCommand={onCommand} />)}
        </div>
        {group.label && <span className="cad-workspace-ribbon__group-label">{group.label}</span>}
      </section>)}
    </div>
    {statusContent && <div className="cad-workspace-ribbon__status" aria-label={statusLabel}>{statusContent}</div>}
    {children && <div className="cad-workspace-ribbon__content">{children}</div>}
  </div>;
  const flyoutVisible = Boolean(isMinimized && isFlyoutOpen);
  const closeFlyoutWhenIdle = () => {
    const interactions = interactionsRef.current;
    if (!isMinimized || interactions.pointer || interactions.focus) return;
    closeMinimizedFlyout();
  };
  const handleFlyoutPointerEnter = event => {
    props.onPointerEnter?.(event);
    if (event.defaultPrevented || !isMinimized) return;
    interactionsRef.current.pointer = true;
  };
  const handleFlyoutFocus = event => {
    props.onFocus?.(event);
    if (event.defaultPrevented || !isMinimized) return;
    interactionsRef.current.focus = true;
  };
  const handleFlyoutBlur = event => {
    props.onBlur?.(event);
    if (event.defaultPrevented || !isMinimized || targetIsInside(event.currentTarget, event.relatedTarget)) return;
    interactionsRef.current.focus = false;
    closeFlyoutWhenIdle();
  };
  const handleFlyoutPointerLeave = event => {
    props.onPointerLeave?.(event);
    if (event.defaultPrevented || !isMinimized || targetIsInside(event.currentTarget, event.relatedTarget)) return;
    interactionsRef.current.pointer = false;
    closeFlyoutWhenIdle();
  };

  return <header
    {...props}
    className={cx('cad-workspace-ribbon', compact && 'cad-workspace-ribbon--compact', isMinimized && 'cad-workspace-ribbon--minimized', className)}
    data-active-tab={resolvedActiveTabId || undefined}
    data-minimized={isMinimized ? 'true' : 'false'}
    data-flyout-open={flyoutVisible ? 'true' : 'false'}
    aria-label={label}
    style={{ '--cad-ribbon-accent': resolvedActiveTab?.color || undefined, ...style }}
    onPointerEnter={handleFlyoutPointerEnter}
    onFocus={handleFlyoutFocus}
    onBlur={handleFlyoutBlur}
    onPointerLeave={handleFlyoutPointerLeave}
  >
    <div className="cad-workspace-ribbon__tabbar">
      {identityContent && <div className="cad-workspace-ribbon__identity">{identityContent}</div>}
      {normalizedTabs.length > 0 && <div className="cad-workspace-ribbon__tabs" role="tablist" aria-label={tabListLabel}>
        {normalizedTabs.map(tab => {
          const selected = tab.id === resolvedActiveTabId;
          const tabId = `${instanceId}-tab-${safeId(tab.id)}`;
          return <button
            key={tab.id}
            id={tabId}
            ref={element => { if (element) tabRefs.current.set(tab.id, element); else tabRefs.current.delete(tab.id); }}
            type="button"
            role="tab"
            disabled={Boolean(tab.disabled)}
            aria-selected={selected}
            aria-controls={selected ? panelId : undefined}
            tabIndex={selected ? 0 : -1}
            data-tone={tab.tone || 'inherit'}
            data-active={selected ? 'true' : 'false'}
            className="cad-workspace-ribbon__tab"
            style={tab.color ? { '--cad-ribbon-tab-accent': tab.color } : undefined}
            onClick={event => isMinimized ? openMinimizedFlyout(tab, event) : selectTab(tab, event)}
            onFocus={event => openMinimizedFlyout(tab, event)}
            onPointerEnter={event => openMinimizedFlyout(tab, event)}
            onKeyDown={event => onTabKeyDown(tab, event)}
          >{tab.icon && <span className="cad-workspace-ribbon__tab-icon" aria-hidden="true">{React.isValidElement(tab.icon) ? tab.icon : typeof tab.icon === 'function' ? React.createElement(tab.icon, { size: 12 }) : null}</span>}<span>{tab.label}</span></button>;
        })}
      </div>}
      {endSlot && <div className="cad-workspace-ribbon__end-slot">{endSlot}</div>}
      {minimizeControl}
    </div>
    <div className={cx('cad-workspace-ribbon__panel-host', isMinimized && 'cad-workspace-ribbon__panel-host--flyout')} hidden={Boolean(isMinimized && !flyoutVisible)}>
      {renderCommandPanel(Boolean(isMinimized))}
    </div>
  </header>;
}
