import type { CadAnyProps } from './cad-types';
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { asArray, cx, itemLabel, useControllableState } from './cadUiUtils';
import { CAD_WORKSPACE_MODEL_ID, normalizeCadWorkspaceProfiles } from './CadWorkspaceProfiles';

const firstEnabledId = items => asArray(items).find(item => !item?.disabled)?.id || '';
const normaliseHistoryItem = (item, index) => typeof item === 'string'
  ? { id: `${item}-${index}`, label: item }
  : { id: item?.id || `${itemLabel(item)}-${index}`, label: itemLabel(item), detail: item?.detail, tone: item?.tone };

const dockTabAttention = item => {
  const value = item?.attention ?? item?.alert;
  const source = value && typeof value === 'object' ? value : { tone: value };
  const tone = String(source?.tone ?? '').trim().toLowerCase();
  if (tone !== 'warning' && tone !== 'danger') return null;
  const label = String(source?.label ?? (tone === 'danger' ? 'Danger' : 'Warning')).trim();
  return { tone, label: label || (tone === 'danger' ? 'Danger' : 'Warning'), symbol: source?.symbol || '!' };
};

/**
 * AutoCAD-inspired Model/Layout tab strip. It is intentionally separate from
 * `CadSegmentTabs`: drawings and paper-space layouts need close, dirty and
 * overflow affordances that ordinary option tabs do not.
 */
export function CadDrawingSpaceTabs({ items = [], activeId, defaultActiveId, onChange, onClose, onCreate, onContextMenu, onRename, onOverflow, addLabel = 'New layout', addButtonProps = {}, overflowLabel = 'More drawing spaces', overflowButtonProps = {}, ariaLabel = 'Drawing spaces', className, ...props }: CadAnyProps) {
  const generatedId = useId();
  const normalizedItems = useMemo(() => asArray(items).map((item, index) => ({ ...item, id: item?.id || `space-${index}` })), [items]);
  const initialActiveId = defaultActiveId || firstEnabledId(normalizedItems);
  const [selectedId, setSelectedId] = useControllableState(activeId, initialActiveId, (nextValue, item, event) => onChange?.(nextValue, item, event));
  const resolvedActiveId = normalizedItems.some(item => item.id === selectedId) ? selectedId : firstEnabledId(normalizedItems);
  const selectItem = (item, event) => {
    if (!item || item.disabled) return;
    setSelectedId(item.id, item, event);
  };
  const focusItem = item => document.getElementById(`cad-space-tab-${generatedId}-${item.id}`)?.focus();
  const selectRelative = (event, offset) => {
    const enabledItems = normalizedItems.filter(item => !item.disabled);
    if (!enabledItems.length) return;
    const currentIndex = Math.max(0, enabledItems.findIndex(item => item.id === resolvedActiveId));
    const nextItem = enabledItems[(currentIndex + offset + enabledItems.length) % enabledItems.length];
    event.preventDefault();
    selectItem(nextItem, event);
    focusItem(nextItem);
  };

  return <nav {...props} className={cx('cad-drawing-space-tabs', className)} aria-label={ariaLabel}>
    <div className="cad-drawing-space-tabs__strip">
      <div className="cad-drawing-space-tabs__scroll" role="tablist" aria-label={ariaLabel} onKeyDown={event => {
       if (!(event.target instanceof Element) || !event.target.closest('[role="tab"]')) return;
      if (event.key === 'ArrowRight') selectRelative(event, 1);
      if (event.key === 'ArrowLeft') selectRelative(event, -1);
      if (event.key === 'Home') { const next = normalizedItems.find(item => !item.disabled); if (next) { event.preventDefault(); selectItem(next, event); focusItem(next); } }
      if (event.key === 'End') { const next = [...normalizedItems].reverse().find(item => !item.disabled); if (next) { event.preventDefault(); selectItem(next, event); focusItem(next); } }
      if ((event.key === 'Delete' || event.key === 'Backspace') && onClose) { const activeItem = normalizedItems.find(item => item.id === resolvedActiveId); if (activeItem?.closable && !activeItem?.pinned) { event.preventDefault(); onClose(activeItem, event); } }
    }}>
        {normalizedItems.map(item => {
          const itemId = item.id;
          const selected = itemId === resolvedActiveId;
          const tabId = `cad-space-tab-${generatedId}-${itemId}`;
          const isClosable = Boolean(onClose && item?.closable && !item?.pinned);
          const Icon = item?.icon;
          return <div key={itemId} className={cx('cad-drawing-space-tabs__item', selected && 'cad-drawing-space-tabs__item--active')} data-kind={item?.kind || 'layout'} data-dirty={item?.dirty ? 'true' : 'false'} onContextMenu={event => {
            if (!onContextMenu) return;
            event.preventDefault();
            onContextMenu(item, event);
          }}>
            <button
              id={tabId}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={item?.panelId}
              aria-label={item?.ariaLabel || itemLabel(item)}
              disabled={item?.disabled}
              tabIndex={selected ? 0 : -1}
              title={item?.title || itemLabel(item)}
              onClick={event => selectItem({ ...item, id: itemId }, event)}
              onDoubleClick={event => onRename?.({ ...item, id: itemId }, event)}
            >
              {Icon && <Icon size={12} aria-hidden="true" />}<span>{itemLabel(item)}</span>{item?.dirty && <i aria-label="Unsaved changes" title="Unsaved changes" />}
            </button>
            {isClosable && <button type="button" className="cad-drawing-space-tabs__close" aria-label={`Close ${itemLabel(item)}`} title={`Close ${itemLabel(item)}`} onClick={event => onClose({ ...item, id: itemId }, event)}>×</button>}
          </div>;
        })}
      </div>
      {onCreate && <button {...addButtonProps} type="button" className={cx('cad-drawing-space-tabs__add', addButtonProps.className)} aria-label={addButtonProps['aria-label'] || addLabel} title={addButtonProps.title || addLabel} onClick={event => { addButtonProps.onClick?.(event); if (!event.defaultPrevented) onCreate(event); }}>+</button>}
      {onOverflow && <button {...overflowButtonProps} type="button" className={cx('cad-drawing-space-tabs__overflow', overflowButtonProps.className)} aria-label={overflowButtonProps['aria-label'] || overflowLabel} title={overflowButtonProps.title || overflowLabel} onClick={event => { overflowButtonProps.onClick?.(event); if (!event.defaultPrevented) onOverflow(event); }}>⋯</button>}
    </div>
  </nav>;
}

export const CadLayoutTabs = CadDrawingSpaceTabs;
export const CadDocumentTabs = CadDrawingSpaceTabs;

/**
 * Application-facing Model/Layout/+ adapter. It keeps layout data and
 * persistence with the host, while consistently mapping it to CAD drawing
 * spaces and keeping the Model profile pinned.
 */
export function CadWorkspaceProfileTabs({ profiles = [], activeId, onChange, onCreate, onClose, onRename, modelId = CAD_WORKSPACE_MODEL_ID, modelName = 'Model', className, ...props }: CadAnyProps) {
  const normalizedProfiles = useMemo(() => normalizeCadWorkspaceProfiles(profiles, { modelId, modelName }), [modelId, modelName, profiles]);
  const profileById = useMemo(() => new Map(normalizedProfiles.map(profile => [profile.id, profile])), [normalizedProfiles]);
  const items = useMemo(() => normalizedProfiles.map(profile => ({
    ...profile,
    label: profile.name,
    kind: profile.id === modelId ? 'model' : 'layout',
    pinned: profile.id === modelId || profile.system,
    closable: Boolean(onClose && profile.id !== modelId && !profile.system)
  })), [modelId, normalizedProfiles, onClose]);
  const resolveProfile = item => profileById.get(item?.id) || item;
  return <CadDrawingSpaceTabs
    {...props}
    className={cx('cad-workspace-profile-tabs', className)}
    ariaLabel={props.ariaLabel || 'Workspace profiles'}
    items={items}
    activeId={activeId}
    defaultActiveId={modelId}
    onChange={(id, item, event) => onChange?.(id, resolveProfile(item), event)}
    onCreate={event => onCreate?.(event)}
    onClose={(item, event) => onClose?.(item.id, resolveProfile(item), event)}
    onRename={(item, event) => onRename?.(item.id, resolveProfile(item), event)}
  />;
}

export function CadDockPanel({ title, icon: Icon, actions, collapsible = false, collapsed, defaultCollapsed = false, onCollapsedChange, className, children, ...props }: CadAnyProps) {
  const generatedId = useId();
  const bodyId = `cad-dock-panel-body-${generatedId}`;
  const [isCollapsed, setCollapsed] = useControllableState(collapsed, defaultCollapsed, (nextValue, event) => onCollapsedChange?.(nextValue, event));
  return <section {...props} className={cx('cad-dock-panel', isCollapsed && 'cad-dock-panel--collapsed', className)} data-collapsed={isCollapsed ? 'true' : 'false'}>
    {(title || Icon || actions || collapsible) && <header className="cad-dock-panel__header">
      <div className="cad-dock-panel__title">{Icon && <Icon size={13} aria-hidden="true" />}{title && <h2>{title}</h2>}</div>
      <div className="cad-dock-panel__actions">{actions}{collapsible && <button type="button" aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${title || 'panel'}`} aria-expanded={!isCollapsed} aria-controls={bodyId} onClick={event => setCollapsed(!isCollapsed, event)}>{isCollapsed ? '▸' : '▾'}</button>}</div>
    </header>}
    <div id={bodyId} className="cad-dock-panel__body" hidden={isCollapsed}>{children}</div>
  </section>;
}

/**
 * Accessible dock tabs with an opt-in compact visual label. When `compact` is
 * enabled, an item may provide `tabLabel` (preferred) or `shortLabel` for the
 * rendered caption. The canonical `label` remains the tab's accessible name
 * and tooltip, so condensed chrome never loses its full meaning. Dock tabs do
 * not render routine count badges; `attention`/`alert` only renders for
 * actionable `warning` or `danger` states.
 */
export function CadDockTabs({ items = [], activeId, defaultActiveId, onChange, onClose, label = 'Docked panels', compact = false, className, children, renderPanel, ...props }: CadAnyProps) {
  const generatedId = useId();
  const initialActiveId = defaultActiveId || firstEnabledId(items);
  const [selectedId, setSelectedId] = useControllableState(activeId, initialActiveId, (nextValue, item, event) => onChange?.(nextValue, item, event));
  const activeItem = asArray(items).find(item => item?.id === selectedId) || asArray(items).find(item => !item?.disabled);
  const selectItem = (item, event) => {
    if (!item || item.disabled) return;
    setSelectedId(item.id, item, event);
  };
  const keyboardSelect = event => {
    if (!event.target.closest('[role="tab"]')) return;
    const available = asArray(items).filter(item => !item?.disabled);
    if (!available.length) return;
    const current = Math.max(0, available.findIndex(item => item.id === activeItem?.id));
    let next;
    if (event.key === 'ArrowRight') next = available[(current + 1) % available.length];
    if (event.key === 'ArrowLeft') next = available[(current - 1 + available.length) % available.length];
    if (event.key === 'Home') next = available[0];
    if (event.key === 'End') next = available[available.length - 1];
    if (next) { event.preventDefault(); selectItem(next, event); document.getElementById(`cad-dock-tab-${generatedId}-${next.id}`)?.focus(); }
  };
  const panelId = activeItem?.panelId || `cad-dock-panel-${generatedId}-${activeItem?.id || 'empty'}`;
  return <section {...props} className={cx('cad-dock-tabs', compact && 'cad-dock-tabs--compact', className)} data-compact={compact ? 'true' : 'false'}>
    <div className="cad-dock-tabs__list" role="tablist" aria-label={label} onKeyDown={keyboardSelect}>
      {asArray(items).map((item, index) => {
        const selected = item?.id === activeItem?.id;
        const Icon = item?.icon;
        const fullLabel = itemLabel(item);
        const visualLabel = compact && item?.tabLabel !== undefined
          ? item.tabLabel
          : compact && item?.shortLabel !== undefined
            ? item.shortLabel
            : fullLabel;
        const accessibleLabel = item?.ariaLabel || item?.accessibleLabel || fullLabel;
        const title = item?.title || fullLabel;
        const attention = dockTabAttention(item);
        const tabLabel = attention ? `${accessibleLabel}, ${attention.label}` : accessibleLabel;
        return <div key={item?.id || index} className={cx('cad-dock-tabs__tab-wrap', selected && 'cad-dock-tabs__tab-wrap--active')}>
          <button id={`cad-dock-tab-${generatedId}-${item?.id}`} type="button" role="tab" aria-label={tabLabel} title={attention ? `${title} · ${attention.label}` : title} aria-selected={selected} aria-controls={selected ? panelId : item?.panelId} disabled={item?.disabled} tabIndex={selected ? 0 : -1} onClick={event => selectItem(item, event)}>{Icon && <span className="cad-dock-tabs__tab-icon" aria-hidden="true"><Icon size={compact ? 16 : 14} /></span>}<span className="cad-dock-tabs__tab-label">{visualLabel}</span>{attention && <span className="cad-dock-tabs__attention" data-tone={attention.tone} aria-hidden="true">{attention.symbol}</span>}</button>
          {onClose && item?.closable && <button type="button" className="cad-dock-tabs__close" aria-label={`Close ${fullLabel}`} onClick={event => onClose(item, event)}>×</button>}
        </div>;
      })}
    </div>
    <div id={panelId} className="cad-dock-tabs__panel" role="tabpanel" aria-labelledby={activeItem ? `cad-dock-tab-${generatedId}-${activeItem.id}` : undefined}>{activeItem ? (renderPanel?.(activeItem) ?? activeItem.content ?? activeItem.children) : children}</div>
  </section>;
}

export function CadStatusToggle({ mode, label, active, disabled = false, shortcut, tone = 'inherit', onChange, className }: CadAnyProps) {
  const resolvedLabel = label || itemLabel(mode);
  const resolvedActive = active ?? mode?.active ?? false;
  const resolvedDisabled = disabled || mode?.disabled;
  return <button type="button" className={cx('cad-status-toggle', className)} data-tone={tone || mode?.tone || 'inherit'} data-active={resolvedActive ? 'true' : 'false'} aria-label={resolvedLabel} aria-pressed={resolvedActive} disabled={resolvedDisabled} title={[resolvedLabel, shortcut || mode?.shortcut].filter(Boolean).join(' · ')} onClick={event => onChange?.(!resolvedActive, mode, event)}>
    <span>{resolvedLabel}</span>{(shortcut || mode?.shortcut) && <small>{shortcut || mode?.shortcut}</small>}
  </button>;
}

const coordinateText = coordinates => {
  if (coordinates === null || coordinates === undefined || coordinates === '') return '';
  if (typeof coordinates === 'string' || typeof coordinates === 'number') return String(coordinates);
  if (Array.isArray(coordinates)) return coordinates.map((value, index) => `${'XYZ'[index] || index}: ${value}`).join('  ');
  return ['x', 'y', 'z'].filter(key => coordinates[key] !== undefined).map(key => `${key.toUpperCase()}: ${coordinates[key]}`).join('  ');
};

/**
 * Coordinate readout plus object snap/grid/ortho-style state controls.
 * `tiles` turns a status-bar instance used as a panel into an adaptive grid,
 * while the default `strip` stays appropriate for an application footer.
 */
export function CadStatusBar({ coordinates, coordinateLabel = 'Coordinates', modes = [], onModeChange, units, scale, message, layout = 'strip', className, children, ...props }: CadAnyProps) {
  const coordinateValue = coordinateText(coordinates);
  const resolvedLayout = layout === 'tiles' || layout === 'auto' ? layout : 'strip';
  return <footer {...props} className={cx('cad-status-bar', className)} data-layout={resolvedLayout} aria-label="CAD status bar">
    {coordinateValue && <output className="cad-status-bar__coordinates" aria-label={coordinateLabel}>{coordinateValue}</output>}
    <div className="cad-status-bar__modes" role="group" aria-label="Drafting modes">
      {asArray(modes).map((mode, index) => <CadStatusToggle key={mode?.id || itemLabel(mode) || index} mode={mode} onChange={(nextValue, item, event) => { mode?.onChange?.(nextValue, item, event); onModeChange?.(mode?.id, nextValue, item, event); }} />)}
    </div>
    {(units || scale) && <div className="cad-status-bar__readouts">{units && <output title="Drawing units">{units}</output>}{scale && <output title="Annotation scale">{scale}</output>}</div>}
    {message && <output className="cad-status-bar__message">{message}</output>}
    {children}
  </footer>;
}

export function CadCommandHistory({ items = [], label = 'Command history', onSelect, className }: CadAnyProps) {
  const normalizedItems = useMemo(() => asArray(items).map(normaliseHistoryItem), [items]);
  return <ol className={cx('cad-command-history', className)} aria-label={label}>
    {normalizedItems.map(item => <li key={item.id} data-tone={item.tone || 'inherit'}>{onSelect
      ? <button type="button" onClick={event => onSelect(item, event)}><strong>{item.label}</strong>{item.detail && <small>{item.detail}</small>}</button>
      : <span><strong>{item.label}</strong>{item.detail && <small>{item.detail}</small>}</span>}</li>)}
  </ol>;
}

export function CadCommandOptions({ options = [], label = 'Command options', onSelect, className }: CadAnyProps) {
  return <div className={cx('cad-command-options', className)} role="group" aria-label={label}>
    {asArray(options).map((option, index) => {
      const resolved = typeof option === 'string' ? { id: option, label: option } : option;
      return <button key={resolved?.id || index} type="button" disabled={resolved?.disabled} data-active={resolved?.active ? 'true' : 'false'} onClick={event => { resolved?.onClick?.(resolved, event); onSelect?.(resolved, event); }}>{itemLabel(resolved)}{resolved?.shortcut && <kbd>{resolved.shortcut}</kbd>}</button>;
    })}
  </div>;
}

const normaliseCommandLineHeight = (value, fallback, minimum, maximum) => {
  const numericValue = Number(value);
  const fallbackValue = Number(fallback);
  const resolved = Number.isFinite(numericValue) ? numericValue : (Number.isFinite(fallbackValue) ? fallbackValue : 152);
  return Math.min(maximum, Math.max(minimum, Math.round(resolved)));
};

/**
 * Controlled or standalone command line with history, options and suggestions.
 *
 * `height` is a controlled pixel height. Use `defaultHeight` for a standalone
 * resizable line; `minHeight`, `maxHeight`, `resizeStep`, and `onHeightChange`
 * keep the host in control of the allowed drawing-space allocation. Use
 * `label` when more than one command surface appears in the same workspace.
 */
export function CadCommandLine({ value, defaultValue = '', onChange, onSubmit, prompt = 'Command:', history = [], suggestions = [], options = [], onSuggestionSelect, onOptionSelect, clearOnSubmit = true, submitSuggestionOnEnter = false, disabled = false, placeholder = 'Type a command or search', showHistory = true, height, defaultHeight = 152, minHeight = 72, maxHeight = 360, resizeStep = 8, resizable = true, onHeightChange, label = 'CAD command line', className, inputProps = {}, style, id, ...props }: CadAnyProps) {
  const generatedId = useId();
  const [draft, setDraft] = useControllableState(value, defaultValue, (nextValue, event) => onChange?.(nextValue, event));
  const rawMinimum = Number(minHeight);
  // Reserve room for the grip and the single-line prompt even at the smallest size.
  const resolvedMinHeight = Math.max(48, Number.isFinite(rawMinimum) ? Math.round(rawMinimum) : 72);
  const rawMaximum = Number(maxHeight);
  const resolvedMaxHeight = Math.max(resolvedMinHeight, Number.isFinite(rawMaximum) ? Math.round(rawMaximum) : 360);
  const initialHeight = normaliseCommandLineHeight(defaultHeight, 152, resolvedMinHeight, resolvedMaxHeight);
  const [storedHeight, setStoredHeight] = useControllableState(height, initialHeight, (nextHeight, event) => onHeightChange?.(nextHeight, event));
  const resolvedHeight = normaliseCommandLineHeight(storedHeight, initialHeight, resolvedMinHeight, resolvedMaxHeight);
  const resolvedResizeStep = Math.max(1, Number.isFinite(Number(resizeStep)) ? Math.round(Number(resizeStep)) : 8);
  const resizeState = useRef(null);
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const normalizedSuggestions = useMemo(() => asArray(suggestions).map(normaliseHistoryItem), [suggestions]);
  const suggestionId = `cad-command-suggestions-${generatedId}`;
  const commandLineId = id || `cad-command-line-${generatedId}`;
  const setHeight = (nextHeight, event) => {
    const candidate = typeof nextHeight === 'function' ? nextHeight(resolvedHeight) : nextHeight;
    const clampedHeight = normaliseCommandLineHeight(candidate, resolvedHeight, resolvedMinHeight, resolvedMaxHeight);
    if (clampedHeight !== resolvedHeight) setStoredHeight(clampedHeight, event);
  };
  const finishResize = event => {
    if (!resizeState.current) return;
    const pointerId = resizeState.current.pointerId;
    resizeState.current = null;
    if (event?.currentTarget?.hasPointerCapture?.(pointerId)) event.currentTarget.releasePointerCapture?.(pointerId);
  };
  const beginResize = event => {
    if (!resizable || event.button !== 0) return;
    event.preventDefault();
    resizeState.current = { pointerId: event.pointerId, startY: event.clientY, startHeight: resolvedHeight };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const resizeFromPointer = event => {
    const activeResize = resizeState.current;
    if (!activeResize || activeResize.pointerId !== event.pointerId) return;
    // The grip lives at the top edge: moving up makes the command area taller.
    setHeight(activeResize.startHeight + activeResize.startY - event.clientY, event);
  };
  const selectSuggestion = (suggestion, event, submit = false) => {
    if (!suggestion) return;
    setDraft(suggestion.label, event);
    onSuggestionSelect?.(suggestion, event);
    if (submit) {
      onSubmit?.(suggestion.label, event);
      if (clearOnSubmit) setDraft('', event);
    }
    setHighlightedIndex(-1);
  };
  const submit = event => {
    event.preventDefault();
    if (highlightedIndex >= 0 && normalizedSuggestions[highlightedIndex]) {
      selectSuggestion(normalizedSuggestions[highlightedIndex], event, submitSuggestionOnEnter);
      return;
    }
    const command = String(draft ?? '').trim();
    if (!command) return;
    onSubmit?.(command, event);
    if (clearOnSubmit) setDraft('', event);
  };
  const showSuggestions = focused && normalizedSuggestions.length > 0;
  const hasTranscript = options.length > 0 || (showHistory && history.length > 0);
  return <section {...props} id={commandLineId} className={cx('cad-command-line', className)} style={{ ...style, '--cad-command-line-height': `${resolvedHeight}px` }} aria-label={label}>
    {resizable && <div
      className="cad-command-line__resize-handle"
      role="separator"
      tabIndex={0}
      aria-label="Resize command line"
      aria-controls={commandLineId}
      aria-orientation="horizontal"
      aria-valuemin={resolvedMinHeight}
      aria-valuemax={resolvedMaxHeight}
      aria-valuenow={resolvedHeight}
      aria-valuetext={`${resolvedHeight} pixels`}
      onPointerDown={beginResize}
      onPointerMove={resizeFromPointer}
      onPointerUp={finishResize}
      onPointerCancel={finishResize}
      onKeyDown={event => {
        const increment = event.shiftKey ? resolvedResizeStep * 3 : resolvedResizeStep;
        if (event.key === 'ArrowUp') { event.preventDefault(); setHeight(resolvedHeight + increment, event); }
        if (event.key === 'ArrowDown') { event.preventDefault(); setHeight(resolvedHeight - increment, event); }
        if (event.key === 'PageUp') { event.preventDefault(); setHeight(resolvedHeight + increment * 3, event); }
        if (event.key === 'PageDown') { event.preventDefault(); setHeight(resolvedHeight - increment * 3, event); }
        if (event.key === 'Home') { event.preventDefault(); setHeight(resolvedMinHeight, event); }
        if (event.key === 'End') { event.preventDefault(); setHeight(resolvedMaxHeight, event); }
      }}
    />}
    <form className="cad-command-line__form" onSubmit={submit}>
      <label htmlFor={`cad-command-input-${generatedId}`} className="cad-command-line__prompt">{prompt}</label>
      <input
        {...inputProps}
        id={`cad-command-input-${generatedId}`}
        className="cad-command-line__input"
        value={draft ?? ''}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-autocomplete={normalizedSuggestions.length ? 'list' : undefined}
        aria-expanded={showSuggestions}
        aria-controls={suggestionId}
        aria-activedescendant={showSuggestions && highlightedIndex >= 0 ? `${suggestionId}-${highlightedIndex}` : undefined}
        onFocus={event => { setFocused(true); inputProps.onFocus?.(event); }}
        onBlur={event => { setFocused(false); setHighlightedIndex(-1); inputProps.onBlur?.(event); }}
        onChange={event => { setDraft(event.target.value, event); setHighlightedIndex(-1); inputProps.onChange?.(event); }}
        onKeyDown={event => {
          if (event.key === 'ArrowDown' && normalizedSuggestions.length) { event.preventDefault(); setHighlightedIndex(index => (index + 1) % normalizedSuggestions.length); }
          if (event.key === 'ArrowUp' && normalizedSuggestions.length) { event.preventDefault(); setHighlightedIndex(index => (index - 1 + normalizedSuggestions.length) % normalizedSuggestions.length); }
          if (event.key === 'Escape') { setHighlightedIndex(-1); setFocused(false); event.currentTarget.blur(); }
          inputProps.onKeyDown?.(event);
        }}
      />
      <button type="submit" className="cad-command-line__submit" disabled={disabled} aria-label="Run command">↵</button>
    </form>
    {showSuggestions && <div id={suggestionId} className="cad-command-line__suggestions" role="listbox" aria-label="Command suggestions">
      {normalizedSuggestions.map((suggestion, index) => <button key={suggestion.id} id={`${suggestionId}-${index}`} type="button" role="option" aria-selected={highlightedIndex === index} data-active={highlightedIndex === index ? 'true' : 'false'} onMouseDown={event => event.preventDefault()} onClick={event => selectSuggestion(suggestion, event)}><strong>{suggestion.label}</strong>{suggestion.detail && <small>{suggestion.detail}</small>}</button>)}
    </div>}
    {hasTranscript && <div className="cad-command-line__transcript">
      {options.length > 0 && <CadCommandOptions options={options} onSelect={onOptionSelect} />}
      {showHistory && history.length > 0 && <CadCommandHistory items={history} onSelect={(item, event) => setDraft(item.label, event)} />}
    </div>}
  </section>;
}

export function CadViewCube({ activeView = 'top', onViewChange, className, label = 'View cube' }: CadAnyProps) {
  const views = ['top', 'front', 'right'];
  return <div className={cx('cad-view-cube', className)} role="group" aria-label={label} data-view={activeView}>
    {views.map(view => <button key={view} type="button" data-active={activeView === view ? 'true' : 'false'} aria-pressed={activeView === view} aria-label={`${view} view`} onClick={event => onViewChange?.(view, event)}>{view.slice(0, 1).toUpperCase()}</button>)}
    <span className="cad-view-cube__axis" aria-hidden="true" />
  </div>;
}

export function CadUcsIndicator({ xLabel = 'X', yLabel = 'Y', zLabel = 'Z', className, label = 'UCS orientation' }: CadAnyProps) {
  return <svg className={cx('cad-ucs-indicator', className)} viewBox="0 0 56 56" role="img" aria-label={label}>
    <circle cx="15" cy="41" r="2.8" /><path d="M15 41H45M15 41V11M15 41l17-17" /><text x="47" y="44">{xLabel}</text><text x="11" y="9">{yLabel}</text><text x="34" y="23">{zLabel}</text>
  </svg>;
}

const targetIsInside = (container, target) => {
  if (!container || !target) return false;
  try { return container === target || Boolean(container.contains?.(target)); } catch { return false; }
};

/**
 * A fixed-host viewport control surface. Hosts decide its physical corner;
 * `collapsible` adds a durable open/collapsed intent plus a transient
 * hover/focus peek without turning the ViewCube into a draggable overlay.
 */
export function CadViewportControls({
  activeView,
  onViewChange,
  onZoomIn,
  onZoomOut,
  onZoomExtents,
  showCube = true,
  showUcs = true,
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  peekOpen,
  defaultPeekOpen = false,
  onPeekOpenChange,
  peekOnHover = true,
  peekOnFocus = true,
  className,
  label = 'Viewport controls',
  panelLabel,
  onPointerEnter,
  onPointerLeave,
  onFocusCapture,
  onBlurCapture,
  onKeyDown,
  ...props
}: CadAnyProps) {
  const generatedId = useId();
  const contentId = `cad-viewport-controls-content-${generatedId}`;
  const instructionId = `cad-viewport-controls-instructions-${generatedId}`;
  const handleRef = useRef(null);
  const interactionsRef = useRef({ pointer: false, focus: false, dismissed: false });
  const [storedCollapsed, setStoredCollapsed] = useControllableState(
    collapsed,
    Boolean(defaultCollapsed),
    (nextCollapsed, change, event) => onCollapsedChange?.(Boolean(nextCollapsed), change, event)
  );
  const [storedPeekOpen, setStoredPeekOpen] = useControllableState(
    peekOpen,
    Boolean(defaultPeekOpen),
    (nextPeekOpen, change, event) => onPeekOpenChange?.(Boolean(nextPeekOpen), change, event)
  );
  const supportsCollapse = Boolean(collapsible);
  const isCollapsed = supportsCollapse && Boolean(storedCollapsed);
  const isPeekOpen = isCollapsed && Boolean(storedPeekOpen);
  const isExpanded = !supportsCollapse || !isCollapsed || isPeekOpen;
  const resolvedLabel = String(label || 'Viewport controls');
  const resolvedPanelLabel = panelLabel || `${resolvedLabel} panel`;

  const changeCollapsed = (requestedCollapsed, event, source = 'programmatic') => {
    const previousCollapsed = Boolean(storedCollapsed);
    const nextCollapsed = Boolean(typeof requestedCollapsed === 'function'
      ? requestedCollapsed(previousCollapsed)
      : requestedCollapsed);
    const change = {
      changed: previousCollapsed !== nextCollapsed,
      previousCollapsed,
      collapsed: nextCollapsed,
      source
    };
    if (change.changed) setStoredCollapsed(nextCollapsed, change, event);
    return change;
  };

  const changePeekOpen = (requestedOpen, event, source = 'programmatic') => {
    const previousOpen = Boolean(storedPeekOpen);
    const nextOpen = Boolean(typeof requestedOpen === 'function' ? requestedOpen(previousOpen) : requestedOpen);
    const change = {
      changed: previousOpen !== nextOpen,
      previousOpen,
      open: nextOpen,
      collapsed: isCollapsed,
      source
    };
    if (change.changed) setStoredPeekOpen(nextOpen, change, event);
    return change;
  };

  const requestPeekOpen = (event, source) => {
    if (!supportsCollapse || !isCollapsed || interactionsRef.current.dismissed) return;
    changePeekOpen(true, event, source);
  };

  const requestPeekCloseWhenIdle = (event, source) => {
    const interactions = interactionsRef.current;
    if (!supportsCollapse || !isCollapsed || interactions.pointer || interactions.focus) return;
    interactions.dismissed = false;
    changePeekOpen(false, event, source);
  };

  const handlePointerEnter = event => {
    onPointerEnter?.(event);
    if (event.defaultPrevented || !supportsCollapse) return;
    interactionsRef.current.pointer = true;
    interactionsRef.current.dismissed = false;
    if (peekOnHover) requestPeekOpen(event, 'pointer-enter');
  };

  const handlePointerLeave = event => {
    onPointerLeave?.(event);
    if (event.defaultPrevented || !supportsCollapse || targetIsInside(event.currentTarget, event.relatedTarget)) return;
    interactionsRef.current.pointer = false;
    requestPeekCloseWhenIdle(event, 'pointer-leave');
  };

  const handleFocusCapture = event => {
    onFocusCapture?.(event);
    if (event.defaultPrevented || !supportsCollapse) return;
    interactionsRef.current.focus = true;
    interactionsRef.current.dismissed = false;
    if (peekOnFocus) requestPeekOpen(event, 'focus-enter');
  };

  const handleBlurCapture = event => {
    onBlurCapture?.(event);
    if (event.defaultPrevented || !supportsCollapse || targetIsInside(event.currentTarget, event.relatedTarget)) return;
    interactionsRef.current.focus = false;
    requestPeekCloseWhenIdle(event, 'focus-leave');
  };

  const toggleCollapsed = event => {
    const nextCollapsed = !isCollapsed;
    if (!nextCollapsed) changePeekOpen(false, event, 'pin-open');
    else {
      interactionsRef.current.dismissed = true;
      changePeekOpen(false, event, 'collapse');
    }
    changeCollapsed(nextCollapsed, event, 'toggle');
  };

  const handleKeyDown = event => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== 'Escape' || !isCollapsed || !isPeekOpen) return;
    event.preventDefault();
    interactionsRef.current.dismissed = true;
    interactionsRef.current.focus = false;
    changePeekOpen(false, event, 'escape');
    handleRef.current?.focus();
  };

  useEffect(() => {
    if (isExpanded || typeof document === 'undefined') return;
    const content = document.getElementById(contentId);
    if (!content?.contains(document.activeElement)) return;
    try { handleRef.current?.focus?.({ preventScroll: true }); } catch { handleRef.current?.focus?.(); }
  }, [contentId, isExpanded]);

  const toggleLabel = isCollapsed ? `Open ${resolvedLabel}` : `Collapse ${resolvedLabel}`;
  const toggleTitle = isCollapsed
    ? (isExpanded ? `Keep ${resolvedLabel} open` : `Open ${resolvedLabel}`)
    : `Collapse ${resolvedLabel}`;

  return <aside
    {...props}
    className={cx('cad-viewport-controls', className)}
    aria-label={resolvedLabel}
    data-collapsible={supportsCollapse ? 'true' : 'false'}
    data-collapsed={isCollapsed ? 'true' : 'false'}
    data-peek-open={isPeekOpen ? 'true' : 'false'}
    data-expanded={isExpanded ? 'true' : 'false'}
    onPointerEnter={handlePointerEnter}
    onPointerLeave={handlePointerLeave}
    onFocusCapture={handleFocusCapture}
    onBlurCapture={handleBlurCapture}
    onKeyDown={handleKeyDown}
  >
    {supportsCollapse && <button
      ref={handleRef}
      type="button"
      className="cad-viewport-controls__handle"
      aria-label={toggleLabel}
      aria-pressed={!isCollapsed}
      aria-controls={contentId}
      aria-expanded={isExpanded}
      aria-describedby={instructionId}
      title={toggleTitle}
      onClick={toggleCollapsed}
    >
      <span className="cad-viewport-controls__handle-icon" aria-hidden="true">◇</span>
      <span className="cad-viewport-controls__handle-label">VIEW CUBE</span>
      <span className="cad-viewport-controls__handle-chevron" aria-hidden="true">{isCollapsed ? '‹' : '›'}</span>
    </button>}
    <div id={contentId} className="cad-viewport-controls__content" role={supportsCollapse ? 'region' : undefined} aria-label={supportsCollapse ? resolvedPanelLabel : undefined} hidden={!isExpanded}>
      {showCube && <CadViewCube activeView={activeView} onViewChange={onViewChange} />}
      <div className="cad-viewport-controls__zoom" role="group" aria-label="Zoom controls"><button type="button" aria-label="Zoom in" onClick={onZoomIn}>+</button><button type="button" aria-label="Zoom out" onClick={onZoomOut}>−</button><button type="button" aria-label="Zoom extents" onClick={onZoomExtents}>⌗</button></div>
      {showUcs && <CadUcsIndicator />}
    </div>
    {supportsCollapse && <span id={instructionId} className="cad-cui-sr-only">When collapsed, hover or focus the ViewCube to temporarily reveal its navigation controls. Use this button to keep it open.</span>}
  </aside>;
}

export function CadSelectionSummary({ count = 0, entityLabel = 'objects', fields = [], emptyLabel = 'Nothing selected', className }: CadAnyProps) {
  return <output className={cx('cad-selection-summary', className)} aria-live="polite">
    <strong>{count ? `${count} ${entityLabel}` : emptyLabel}</strong>
    {asArray(fields).length > 0 && <span>{asArray(fields).map((field, index) => <small key={field?.id || index}>{field?.label}: <b>{field?.value}</b></small>)}</span>}
  </output>;
}

export function CadMeasureReadout({ distance, angle, area, volume, className, label = 'Measurement' }: CadAnyProps) {
  const fields = [{ id: 'distance', label: 'D', value: distance }, { id: 'angle', label: 'A', value: angle }, { id: 'area', label: 'Area', value: area }, { id: 'volume', label: 'Vol', value: volume }].filter(field => field.value !== undefined && field.value !== null && field.value !== '');
  if (!fields.length) return null;
  return <output className={cx('cad-measure-readout', className)} aria-label={label}>{fields.map(field => <span key={field.id}><small>{field.label}</small><b>{field.value}</b></span>)}</output>;
}
