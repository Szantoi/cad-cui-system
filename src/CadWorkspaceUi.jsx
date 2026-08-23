import React, { useId, useMemo, useState } from 'react';
import { asArray, cx, itemLabel, useControllableState } from './cadUiUtils.js';
import { CAD_WORKSPACE_MODEL_ID, normalizeCadWorkspaceProfiles } from './CadWorkspaceProfiles.js';

const firstEnabledId = items => asArray(items).find(item => !item?.disabled)?.id || '';
const normaliseHistoryItem = (item, index) => typeof item === 'string'
  ? { id: `${item}-${index}`, label: item }
  : { id: item?.id || `${itemLabel(item)}-${index}`, label: itemLabel(item), detail: item?.detail, tone: item?.tone };

/**
 * AutoCAD-inspired Model/Layout tab strip. It is intentionally separate from
 * `CadSegmentTabs`: drawings and paper-space layouts need close, dirty and
 * overflow affordances that ordinary option tabs do not.
 */
export function CadDrawingSpaceTabs({ items = [], activeId, defaultActiveId, onChange, onClose, onCreate, onContextMenu, onRename, onOverflow, addLabel = 'New layout', addButtonProps = {}, overflowLabel = 'More drawing spaces', overflowButtonProps = {}, ariaLabel = 'Drawing spaces', className, ...props }) {
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
      if (!event.target.closest('[role="tab"]')) return;
      if (event.key === 'ArrowRight') selectRelative(event, 1);
      if (event.key === 'ArrowLeft') selectRelative(event, -1);
      if (event.key === 'Home') { const next = normalizedItems.find(item => !item.disabled); if (next) { event.preventDefault(); selectItem(next, event); focusItem(next); } }
      if (event.key === 'End') { const next = [...normalizedItems].reverse().find(item => !item.disabled); if (next) { event.preventDefault(); selectItem(next, event); focusItem(next); } }
      if ((event.key === 'Delete' || event.key === 'Backspace') && onClose) { const activeItem = normalizedItems.find(item => item.id === resolvedActiveId); if (activeItem?.closable && !activeItem?.pinned) { event.preventDefault(); onClose(activeItem, event); } }
    }}>
        {normalizedItems.map((item, index) => {
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
export function CadWorkspaceProfileTabs({ profiles = [], activeId, onChange, onCreate, onClose, onRename, modelId = CAD_WORKSPACE_MODEL_ID, modelName = 'Model', className, ...props }) {
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

export function CadDockPanel({ title, icon: Icon, actions, collapsible = false, collapsed, defaultCollapsed = false, onCollapsedChange, className, children, ...props }) {
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

export function CadDockTabs({ items = [], activeId, defaultActiveId, onChange, onClose, label = 'Docked panels', className, children, renderPanel, ...props }) {
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
  return <section {...props} className={cx('cad-dock-tabs', className)}>
    <div className="cad-dock-tabs__list" role="tablist" aria-label={label} onKeyDown={keyboardSelect}>
      {asArray(items).map((item, index) => {
        const selected = item?.id === activeItem?.id;
        const Icon = item?.icon;
        return <div key={item?.id || index} className={cx('cad-dock-tabs__tab-wrap', selected && 'cad-dock-tabs__tab-wrap--active')}>
          <button id={`cad-dock-tab-${generatedId}-${item?.id}`} type="button" role="tab" aria-selected={selected} aria-controls={selected ? panelId : item?.panelId} disabled={item?.disabled} tabIndex={selected ? 0 : -1} onClick={event => selectItem(item, event)}>{Icon && <Icon size={12} aria-hidden="true" />}<span>{itemLabel(item)}</span>{item?.badge && <em>{item.badge}</em>}</button>
          {onClose && item?.closable && <button type="button" className="cad-dock-tabs__close" aria-label={`Close ${itemLabel(item)}`} onClick={event => onClose(item, event)}>×</button>}
        </div>;
      })}
    </div>
    <div id={panelId} className="cad-dock-tabs__panel" role="tabpanel" aria-labelledby={activeItem ? `cad-dock-tab-${generatedId}-${activeItem.id}` : undefined}>{activeItem ? (renderPanel?.(activeItem) ?? activeItem.content ?? activeItem.children) : children}</div>
  </section>;
}

export function CadStatusToggle({ mode, label, active, disabled = false, shortcut, tone = 'inherit', onChange, className }) {
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

/** Coordinate readout plus object snap/grid/ortho-style state controls. */
export function CadStatusBar({ coordinates, coordinateLabel = 'Coordinates', modes = [], onModeChange, units, scale, message, className, children, ...props }) {
  const coordinateValue = coordinateText(coordinates);
  return <footer {...props} className={cx('cad-status-bar', className)} aria-label="CAD status bar">
    {coordinateValue && <output className="cad-status-bar__coordinates" aria-label={coordinateLabel}>{coordinateValue}</output>}
    <div className="cad-status-bar__modes" role="group" aria-label="Drafting modes">
      {asArray(modes).map((mode, index) => <CadStatusToggle key={mode?.id || itemLabel(mode) || index} mode={mode} onChange={(nextValue, item, event) => { mode?.onChange?.(nextValue, item, event); onModeChange?.(mode?.id, nextValue, item, event); }} />)}
    </div>
    {(units || scale) && <div className="cad-status-bar__readouts">{units && <output title="Drawing units">{units}</output>}{scale && <output title="Annotation scale">{scale}</output>}</div>}
    {message && <output className="cad-status-bar__message">{message}</output>}
    {children}
  </footer>;
}

export function CadCommandHistory({ items = [], label = 'Command history', onSelect, className }) {
  const normalizedItems = useMemo(() => asArray(items).map(normaliseHistoryItem), [items]);
  return <ol className={cx('cad-command-history', className)} aria-label={label}>
    {normalizedItems.map(item => <li key={item.id} data-tone={item.tone || 'inherit'}>{onSelect
      ? <button type="button" onClick={event => onSelect(item, event)}><strong>{item.label}</strong>{item.detail && <small>{item.detail}</small>}</button>
      : <span><strong>{item.label}</strong>{item.detail && <small>{item.detail}</small>}</span>}</li>)}
  </ol>;
}

export function CadCommandOptions({ options = [], label = 'Command options', onSelect, className }) {
  return <div className={cx('cad-command-options', className)} role="group" aria-label={label}>
    {asArray(options).map((option, index) => {
      const resolved = typeof option === 'string' ? { id: option, label: option } : option;
      return <button key={resolved?.id || index} type="button" disabled={resolved?.disabled} data-active={resolved?.active ? 'true' : 'false'} onClick={event => { resolved?.onClick?.(resolved, event); onSelect?.(resolved, event); }}>{itemLabel(resolved)}{resolved?.shortcut && <kbd>{resolved.shortcut}</kbd>}</button>;
    })}
  </div>;
}

/** Controlled or standalone command line with history, options and suggestions. */
export function CadCommandLine({ value, defaultValue = '', onChange, onSubmit, prompt = 'Command:', history = [], suggestions = [], options = [], onSuggestionSelect, onOptionSelect, clearOnSubmit = true, submitSuggestionOnEnter = false, disabled = false, placeholder = 'Type a command or search', showHistory = true, className, inputProps = {}, ...props }) {
  const generatedId = useId();
  const [draft, setDraft] = useControllableState(value, defaultValue, (nextValue, event) => onChange?.(nextValue, event));
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const normalizedSuggestions = useMemo(() => asArray(suggestions).map(normaliseHistoryItem), [suggestions]);
  const suggestionId = `cad-command-suggestions-${generatedId}`;
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
  return <section {...props} className={cx('cad-command-line', className)} aria-label="CAD command line">
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
    {options.length > 0 && <CadCommandOptions options={options} onSelect={onOptionSelect} />}
    {showHistory && history.length > 0 && <CadCommandHistory items={history} onSelect={(item, event) => setDraft(item.label, event)} />}
  </section>;
}

export function CadViewCube({ activeView = 'top', onViewChange, className, label = 'View cube' }) {
  const views = ['top', 'front', 'right'];
  return <div className={cx('cad-view-cube', className)} role="group" aria-label={label} data-view={activeView}>
    {views.map(view => <button key={view} type="button" data-active={activeView === view ? 'true' : 'false'} aria-pressed={activeView === view} aria-label={`${view} view`} onClick={event => onViewChange?.(view, event)}>{view.slice(0, 1).toUpperCase()}</button>)}
    <span className="cad-view-cube__axis" aria-hidden="true" />
  </div>;
}

export function CadUcsIndicator({ xLabel = 'X', yLabel = 'Y', zLabel = 'Z', className, label = 'UCS orientation' }) {
  return <svg className={cx('cad-ucs-indicator', className)} viewBox="0 0 56 56" role="img" aria-label={label}>
    <circle cx="15" cy="41" r="2.8" /><path d="M15 41H45M15 41V11M15 41l17-17" /><text x="47" y="44">{xLabel}</text><text x="11" y="9">{yLabel}</text><text x="34" y="23">{zLabel}</text>
  </svg>;
}

export function CadViewportControls({ activeView, onViewChange, onZoomIn, onZoomOut, onZoomExtents, showCube = true, showUcs = true, className }) {
  return <aside className={cx('cad-viewport-controls', className)} aria-label="Viewport controls">
    {showCube && <CadViewCube activeView={activeView} onViewChange={onViewChange} />}
    <div className="cad-viewport-controls__zoom" role="group" aria-label="Zoom controls"><button type="button" aria-label="Zoom in" onClick={onZoomIn}>+</button><button type="button" aria-label="Zoom out" onClick={onZoomOut}>−</button><button type="button" aria-label="Zoom extents" onClick={onZoomExtents}>⌗</button></div>
    {showUcs && <CadUcsIndicator />}
  </aside>;
}

export function CadSelectionSummary({ count = 0, entityLabel = 'objects', fields = [], emptyLabel = 'Nothing selected', className }) {
  return <output className={cx('cad-selection-summary', className)} aria-live="polite">
    <strong>{count ? `${count} ${entityLabel}` : emptyLabel}</strong>
    {asArray(fields).length > 0 && <span>{asArray(fields).map((field, index) => <small key={field?.id || index}>{field?.label}: <b>{field?.value}</b></small>)}</span>}
  </output>;
}

export function CadMeasureReadout({ distance, angle, area, volume, className, label = 'Measurement' }) {
  const fields = [{ id: 'distance', label: 'D', value: distance }, { id: 'angle', label: 'A', value: angle }, { id: 'area', label: 'Area', value: area }, { id: 'volume', label: 'Vol', value: volume }].filter(field => field.value !== undefined && field.value !== null && field.value !== '');
  if (!fields.length) return null;
  return <output className={cx('cad-measure-readout', className)} aria-label={label}>{fields.map(field => <span key={field.id}><small>{field.label}</small><b>{field.value}</b></span>)}</output>;
}
