import React, { isValidElement, useId, useMemo, useRef } from 'react';
import { CadToolButton } from './CadCommandUi.jsx';
import { CadPopover } from './CadOverlayUi.jsx';
import { groupCadWorkspaceRibbonCommands } from './CadWorkspaceRibbon.jsx';
import { asArray, cx, itemLabel, useControllableState } from './cadUiUtils.js';
import { toTrimmedString as text } from './cadValueUtils.js';

const numericOrder = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const safeId = value => text(value).replace(/[^a-zA-Z0-9_-]+/g, '-') || 'workspace';
const commandTabId = command => text(command?.tabId || command?.tab || command?.placement?.tab);
const groupTabId = group => text(group?.tabId || group?.tab || group?.placement?.tab);
const groupItems = group => asArray(group?.commands).length ? asArray(group.commands) : asArray(group?.items);

const TONE_ACCENTS = {
  cyan: '#53c9ff',
  green: '#9add4b',
  amber: '#ffb554',
  magenta: '#f08cff',
  violet: '#b9a1ff',
  neutral: '#b4bdc7'
};

const tabAccent = tab => tab?.color || TONE_ACCENTS[tab?.tone] || 'var(--cad-workspace-accent, #53c9ff)';

const normalizeTabs = tabs => asArray(tabs)
  .filter(tab => tab && text(tab.id))
  .map(tab => ({ ...tab, id: text(tab.id), label: itemLabel(tab) || text(tab.id) }));

const normalizeExplicitGroups = ({ groups, activeTabId, defaultGroupLabel }) => asArray(groups)
  .filter(group => group && typeof group === 'object' && (!activeTabId || !groupTabId(group) || groupTabId(group) === activeTabId))
  .map((group, index) => ({
    id: text(group.id) || `group-${index + 1}`,
    label: text(group.label) || defaultGroupLabel,
    order: numericOrder(group.order, index),
    commands: groupItems(group).filter(command => !activeTabId || !commandTabId(command) || commandTabId(command) === activeTabId)
  }))
  .filter(group => group.commands.length)
  .sort((first, second) => first.order - second.order);

/**
 * Resolves a tab's hierarchical command groups without coupling the menu to
 * a router, renderer, docking manager or command runtime.
 */
export function resolveCadCompactWorkspaceRibbonGroups({
  groups,
  commands = [],
  tabId = '',
  defaultGroupId = 'commands',
  defaultGroupLabel = 'COMMANDS'
} = {}) {
  const explicitGroups = normalizeExplicitGroups({ groups, activeTabId: tabId, defaultGroupLabel });
  if (explicitGroups.length) return explicitGroups;
  return groupCadWorkspaceRibbonCommands(commands, { tabId, defaultGroupId, defaultGroupLabel });
}

function CadCompactRibbonCommand({
  command,
  group,
  activeTab,
  renderIcon,
  renderCommand,
  onCommand,
  close,
  closeOnCommand
}) {
  const label = itemLabel(command) || 'COMMAND';
  const active = Boolean(command?.pressed ?? command?.active);
  const toggle = Boolean(command?.toggle || command?.pressed !== undefined || command?.active !== undefined);
  const commandContext = {
    command,
    group,
    activeTab,
    compact: true,
    source: 'compact-workspace-ribbon',
    close,
    execute: event => {
      if (command?.disabled) return;
      command?.onClick?.(command, event);
      onCommand?.(command, {
        command,
        group,
        activeTab,
        compact: true,
        source: 'compact-workspace-ribbon',
        close
      }, event);
      if (closeOnCommand && !event.defaultPrevented) close?.(event);
    }
  };
  const icon = typeof renderIcon === 'function' ? renderIcon(command, commandContext) : command?.icon;
  const Icon = typeof icon === 'function' ? icon : null;
  const iconElement = isValidElement(icon) ? icon : null;
  const buttonProps = {
    type: 'button',
    disabled: Boolean(command?.disabled),
    'data-cad-ribbon-tool': command?.toolId || command?.id || label,
    'data-command-id': command?.id,
    'data-testid': command?.testId,
    'data-tone': command?.tone || 'inherit',
    'data-active': active ? 'true' : 'false',
    'aria-label': command?.ariaLabel || command?.accessibleLabel || label,
    'aria-pressed': toggle ? active : undefined,
    title: command?.title || command?.detail || command?.description || label,
    className: 'cad-compact-workspace-ribbon__command',
    style: command?.color ? { '--cad-tool-accent': command.color } : undefined,
    onClick: commandContext.execute
  };

  if (typeof renderCommand === 'function') return renderCommand(command, { ...commandContext, icon, buttonProps });

  const customContent = iconElement && <><span className="cad-compact-workspace-ribbon__command-icon" aria-hidden="true">{iconElement}</span><span>{label}</span></>;
  return <CadToolButton
    {...buttonProps}
    icon={Icon || undefined}
    label={customContent ? undefined : label}
    badge={command?.badge}
    active={active}
    toggle={toggle}
  >{customContent || undefined}</CadToolButton>;
}

function CadCompactRibbonDisclosure({
  tab,
  groups,
  openGroupId,
  onOpenGroupChange,
  renderIcon,
  renderCommand,
  onCommand,
  close,
  closeOnCommand,
  label
}) {
  const selectedGroup = groups.find(group => group.id === openGroupId) || null;
  const commandPanelId = useId();

  return <section className="cad-compact-workspace-ribbon__disclosure-body" data-tab-id={tab.id}>
    <header className="cad-compact-workspace-ribbon__disclosure-header">
      <span>COMMAND GROUPS</span>
      <strong>{tab.label}</strong>
    </header>
    <div className="cad-compact-workspace-ribbon__groups" role="list" aria-label={`${tab.label} command groups`}>
      {groups.map(group => {
        const expanded = group.id === selectedGroup?.id;
        const groupPanelId = `${commandPanelId}-${safeId(group.id)}`;
        return <div key={group.id} role="listitem"><button
          type="button"
          className="cad-compact-workspace-ribbon__group"
          data-active={expanded ? 'true' : 'false'}
          aria-expanded={expanded}
          aria-controls={expanded ? groupPanelId : undefined}
          onClick={event => onOpenGroupChange(expanded ? null : group.id, group, event)}
        >
          <span className="cad-compact-workspace-ribbon__group-index" aria-hidden="true">{String(groups.indexOf(group) + 1).padStart(2, '0')}</span>
          <span>{group.label}</span>
          <small>{group.commands.length}</small>
          <b aria-hidden="true">{expanded ? '−' : '+'}</b>
        </button></div>;
      })}
    </div>
    {selectedGroup && <div
      id={`${commandPanelId}-${safeId(selectedGroup.id)}`}
      className="cad-compact-workspace-ribbon__commands"
      role="region"
      aria-label={`${selectedGroup.label} commands`}
    >
      <div className="cad-compact-workspace-ribbon__commands-heading">
        <span>{selectedGroup.label}</span>
        <small>{selectedGroup.commands.length} COMMANDS</small>
      </div>
      <div className="cad-compact-workspace-ribbon__command-grid" role="toolbar" aria-label={`${selectedGroup.label} tools`}>
        {selectedGroup.commands.map((command, index) => <CadCompactRibbonCommand
          key={command?.id || `${selectedGroup.id}-${index}`}
          command={command}
          group={selectedGroup}
          activeTab={tab}
          renderIcon={renderIcon}
          renderCommand={renderCommand}
          onCommand={onCommand}
          close={close}
          closeOnCommand={closeOnCommand}
        />)}
      </div>
    </div>}
    {!groups.length && <p className="cad-compact-workspace-ribbon__empty">No commands are available on this tab.</p>}
    <footer className="cad-compact-workspace-ribbon__disclosure-footer">
      <span>{label}</span>
      <button type="button" onClick={close}>CLOSE</button>
    </footer>
  </section>;
}

/**
 * A compact CAD ribbon that deliberately discloses commands in three steps:
 * tab → command group → command. It uses `CadPopover` so clicking the active
 * tab a second time, pressing Escape, moving focus or the pointer away, or
 * interacting outside the menu closes the disclosure without host-specific
 * event plumbing.
 *
 * `openTabId` and `openGroupId` are independently controllable. Commands
 * close by default after execution, returning the operator to Model Space.
 * Set `closeOnCommand={false}` for a deliberately persistent toggle palette.
 */
export function CadCompactWorkspaceRibbon({
  tabs = [],
  activeTab,
  defaultActiveTab,
  onActiveTabChange,
  openTabId,
  defaultOpenTabId = null,
  onOpenTabChange,
  openGroupId,
  defaultOpenGroupId = null,
  onOpenGroupChange,
  groups,
  commands = [],
  defaultGroupId = 'commands',
  defaultGroupLabel = 'COMMANDS',
  label = 'Compact CAD workspace ribbon',
  tabListLabel = 'Compact workspace commands',
  identity,
  endSlot,
  placement = 'bottom-start',
  closeOnOutside = true,
  closeOnEscape = true,
  closeOnFocusOutside = true,
  closeOnPointerLeave = true,
  closeOnCommand = true,
  renderIcon,
  renderCommand,
  onCommand,
  className,
  style,
  ...props
}) {
  const generatedId = useId();
  const instanceId = `cad-compact-workspace-ribbon-${safeId(generatedId)}`;
  const tabRefs = useRef(new Map());
  const normalizedTabs = useMemo(() => normalizeTabs(tabs), [tabs]);
  const firstAvailableTabId = normalizedTabs.find(tab => !tab.disabled)?.id || normalizedTabs[0]?.id || '';
  const [requestedActiveTabId, setRequestedActiveTabId] = useControllableState(
    activeTab,
    defaultActiveTab || firstAvailableTabId,
    (nextTabId, event) => onActiveTabChange?.(nextTabId, normalizedTabs.find(tab => tab.id === nextTabId) || null, event)
  );
  const resolvedActiveTab = normalizedTabs.find(tab => tab.id === requestedActiveTabId) || normalizedTabs.find(tab => !tab.disabled) || normalizedTabs[0] || null;
  const [requestedOpenTabId, setRequestedOpenTabId] = useControllableState(
    openTabId,
    defaultOpenTabId,
    (nextTabId, event) => onOpenTabChange?.(nextTabId || null, normalizedTabs.find(tab => tab.id === nextTabId) || null, event)
  );
  const resolvedOpenTab = normalizedTabs.find(tab => tab.id === requestedOpenTabId && !tab.disabled) || null;
  const resolvedOpenTabId = resolvedOpenTab?.id || '';
  const [requestedOpenGroupId, setRequestedOpenGroupId] = useControllableState(
    openGroupId,
    defaultOpenGroupId,
    (nextGroupId, group, event) => onOpenGroupChange?.(nextGroupId || null, group || null, resolvedOpenTab || null, event)
  );
  const groupsByTab = useMemo(() => new Map(normalizedTabs.map(tab => [
    tab.id,
    resolveCadCompactWorkspaceRibbonGroups({ groups, commands, tabId: tab.id, defaultGroupId, defaultGroupLabel })
  ])), [commands, defaultGroupId, defaultGroupLabel, groups, normalizedTabs]);

  const closeDisclosure = event => {
    setRequestedOpenGroupId(null, null, event);
    setRequestedOpenTabId(null, event);
  };
  const openDisclosure = (tab, event) => {
    setRequestedActiveTabId(tab.id, event);
    if (resolvedOpenTabId !== tab.id) setRequestedOpenGroupId(null, null, event);
    setRequestedOpenTabId(tab.id, event);
  };
  const selectTabFromKeyboard = (tab, event) => {
    if (tab.disabled) return;
    setRequestedActiveTabId(tab.id, event);
    closeDisclosure(event);
  };
  const moveTabFocus = (currentId, direction, event) => {
    const availableTabs = normalizedTabs.filter(tab => !tab.disabled);
    if (!availableTabs.length) return;
    const currentIndex = Math.max(0, availableTabs.findIndex(tab => tab.id === currentId));
    const target = availableTabs[(currentIndex + direction + availableTabs.length) % availableTabs.length];
    event.preventDefault();
    selectTabFromKeyboard(target, event);
    tabRefs.current.get(target.id)?.focus();
  };
  const onTabKeyDown = (tab, event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') moveTabFocus(tab.id, 1, event);
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') moveTabFocus(tab.id, -1, event);
    if (event.key === 'Home') {
      const first = normalizedTabs.find(tabItem => !tabItem.disabled);
      if (!first) return;
      event.preventDefault();
      selectTabFromKeyboard(first, event);
      tabRefs.current.get(first.id)?.focus();
    }
    if (event.key === 'End') {
      const last = normalizedTabs.filter(tabItem => !tabItem.disabled).at(-1);
      if (!last) return;
      event.preventDefault();
      selectTabFromKeyboard(last, event);
      tabRefs.current.get(last.id)?.focus();
    }
  };
  const renderGroupChange = (nextGroupId, group, event) => setRequestedOpenGroupId(nextGroupId, group, event);

  return <header
    {...props}
    className={cx('cad-workspace-ribbon', 'cad-compact-workspace-ribbon', className)}
    data-active-tab={resolvedActiveTab?.id || undefined}
    data-open-tab={resolvedOpenTabId || undefined}
    aria-label={label}
    style={{ '--cad-ribbon-accent': tabAccent(resolvedActiveTab), ...style }}
  >
    <div className="cad-workspace-ribbon__tabbar cad-compact-workspace-ribbon__tabbar">
      {identity && <div className="cad-workspace-ribbon__identity">{identity}</div>}
      {normalizedTabs.length > 0 && <div className="cad-workspace-ribbon__tabs" role="tablist" aria-label={tabListLabel}>
        {normalizedTabs.map(tab => {
          const selected = tab.id === resolvedActiveTab?.id;
          const open = tab.id === resolvedOpenTabId;
          const tabId = `${instanceId}-tab-${safeId(tab.id)}`;
          const tabGroups = groupsByTab.get(tab.id) || [];
          return <CadPopover
            key={tab.id}
            open={open}
            onOpenChange={(nextOpen, event) => {
              if (nextOpen) openDisclosure(tab, event);
              else if (open) closeDisclosure(event);
            }}
            placement={placement}
            label={`${tab.label} compact command menu`}
            closeOnOutside={closeOnOutside}
            closeOnEscape={closeOnEscape}
            closeOnFocusOutside={closeOnFocusOutside}
            closeOnPointerLeave={closeOnPointerLeave}
            className="cad-compact-workspace-ribbon__popover"
            contentClassName="cad-compact-workspace-ribbon__disclosure"
            style={{ '--cad-compact-ribbon-accent': tabAccent(tab) }}
            trigger={<button
              id={tabId}
              ref={element => { if (element) tabRefs.current.set(tab.id, element); else tabRefs.current.delete(tab.id); }}
              type="button"
              role="tab"
              disabled={Boolean(tab.disabled)}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              data-tone={tab.tone || 'inherit'}
              data-active={selected ? 'true' : 'false'}
              className="cad-workspace-ribbon__tab"
              style={tab.color ? { '--cad-ribbon-tab-accent': tab.color } : undefined}
              onKeyDown={event => onTabKeyDown(tab, event)}
            >{tab.icon && <span className="cad-workspace-ribbon__tab-icon" aria-hidden="true">{isValidElement(tab.icon) ? tab.icon : typeof tab.icon === 'function' ? React.createElement(tab.icon, { size: 12 }) : null}</span>}<span>{tab.label}</span></button>}
            content={({ close }) => <CadCompactRibbonDisclosure
              tab={tab}
              groups={tabGroups}
              openGroupId={open ? requestedOpenGroupId : null}
              onOpenGroupChange={renderGroupChange}
              renderIcon={renderIcon}
              renderCommand={renderCommand}
              onCommand={onCommand}
              close={close}
              closeOnCommand={closeOnCommand}
              label={label}
            />}
          />;
        })}
      </div>}
      {endSlot && <div className="cad-workspace-ribbon__end-slot">{endSlot}</div>}
    </div>
  </header>;
}
