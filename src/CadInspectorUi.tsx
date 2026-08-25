import type { CadAnyProps } from './cad-types';
import React, { useId, useMemo } from 'react';
import { CadAngleInput, CadColorSwatch, CadCoordinateInput, CadLinetypePreview, CadLineweightPreview, CadNumericInput, CadUnitInput } from './CadCommandUi';
import { CadAnnotationScalePicker } from './CadDraftingUi';
import { CadColorPickerButton, CadLineweightPicker, CadLinetypePicker } from './CadLayoutUi';
import { asArray, cx, itemLabel, useControllableState } from './cadUiUtils';

export function CadFilterBar({ value, defaultValue = '', onChange, placeholder = 'Filter', label = 'Filter list', className, ...props }: CadAnyProps) {
  const generatedId = useId();
  const [query, setQuery] = useControllableState(value, defaultValue, (nextValue, event) => onChange?.(nextValue, event));
  return <div className={cx('cad-filter-bar', className)}>
    <label className="cad-filter-bar__label" htmlFor={`cad-filter-${generatedId}`}>{label}</label>
    <input {...props} id={`cad-filter-${generatedId}`} value={query ?? ''} placeholder={placeholder} onChange={event => setQuery(event.target.value, event)} />
    {query && <button type="button" aria-label={`Clear ${label.toLowerCase()}`} onClick={event => setQuery('', event)}>×</button>}
  </div>;
}

/** Renders a standard CAD property editor from a compact field declaration. */
export function CadPropertyField({ property, value, onValueChange, inputId, className }: CadAnyProps) {
  const field = property || {};
  const type = field.type || 'text';
  const fieldValue = value ?? field.value ?? '';
  const emit = (nextValue: any, event?: any) => {
    field.onChange?.(nextValue, field, event);
    onValueChange?.(field.id, nextValue, field, event);
  };
  if (typeof field.render === 'function') return <div className={cx('cad-property-field', className)}>{field.render({ id: inputId, property: field, value: fieldValue, onChange: emit })}</div>;
  if (field.readOnly || type === 'readonly') return <output className={cx('cad-property-field', 'cad-property-field--readonly', className)} title={String(fieldValue)}>{fieldValue || '—'}</output>;
  if (type === 'toggle' || type === 'boolean') return <label className={cx('cad-property-field', 'cad-property-field--toggle', className)}><input id={inputId} type="checkbox" aria-label={field.label || field.id} checked={Boolean(fieldValue)} disabled={field.disabled} onChange={event => emit(event.target.checked, event)} /><span>{fieldValue ? field.onLabel || 'On' : field.offLabel || 'Off'}</span></label>;
  if (type === 'select' || type === 'enum') return <select id={inputId} className={cx('cad-property-field', className)} value={fieldValue} disabled={field.disabled} onChange={event => emit(event.target.value, event)}>{asArray(field.options).map((option, index) => { const item = typeof option === 'string' || typeof option === 'number' ? { value: option, label: option } : option; return <option key={item.id || item.value || index} value={item.value ?? item.id}>{itemLabel(item)}</option>; })}</select>;
  if (type === 'color') return <span className={cx('cad-property-field', 'cad-property-field--color', className)}><CadColorSwatch color={fieldValue || '#ffffff'} label={fieldValue || '#ffffff'} /><input id={inputId} type="color" value={fieldValue || '#ffffff'} disabled={field.disabled} onChange={event => emit(event.target.value, event)} /></span>;
  if (type === 'cad-color') return <CadColorPickerButton value={fieldValue} onChange={emit} label={field.label || field.id} className={cx('cad-property-field', 'cad-property-field--cad-color', className)} colors={field.colors} allowByLayer={field.allowByLayer} allowByBlock={field.allowByBlock} />;
  if (type === 'linetype') return <CadLinetypePicker value={fieldValue} onChange={(nextValue, item, event) => emit(nextValue, event)} label={field.label || field.id} className={cx('cad-property-field', 'cad-property-field--style', className)} linetypes={field.options} />;
  if (type === 'lineweight') return <CadLineweightPicker value={fieldValue} onChange={(nextValue, item, event) => emit(nextValue, event)} label={field.label || field.id} className={cx('cad-property-field', 'cad-property-field--style', className)} lineweights={field.options} />;
  if (type === 'scale') return <CadAnnotationScalePicker value={fieldValue} onChange={(nextValue, item, event) => emit(nextValue, event)} label={field.label || field.id} className={cx('cad-property-field', 'cad-property-field--style', className)} scales={field.options} />;
  if (type === 'number') return <CadNumericInput id={inputId} className={cx('cad-property-field', className)} value={fieldValue} min={field.min} max={field.max} step={field.step} unit={field.unit} prefix={field.prefix} suffix={field.suffix} disabled={field.disabled} readOnly={field.readOnly} onValueChange={emit} aria-label={field.label || field.id} />;
  if (type === 'unit') return <CadUnitInput id={inputId} className={cx('cad-property-field', className)} value={fieldValue} unit={field.unit} min={field.min} max={field.max} step={field.step} disabled={field.disabled} onValueChange={emit} aria-label={field.label || field.id} />;
  if (type === 'angle') return <CadAngleInput id={inputId} className={cx('cad-property-field', className)} value={fieldValue} unit={field.unit || '°'} min={field.min} max={field.max} step={field.step} disabled={field.disabled} onValueChange={emit} aria-label={field.label || field.id} />;
  if (type === 'coordinate') return <CadCoordinateInput className={cx('cad-property-field', className)} value={fieldValue} axes={field.axes} unit={field.unit} disabled={field.disabled} onValueChange={nextValue => emit(nextValue)} label={field.label || field.id} />;
  if (type === 'multiline') return <textarea id={inputId} className={cx('cad-property-field', 'cad-property-field--multiline', className)} value={fieldValue} placeholder={field.placeholder} disabled={field.disabled} onChange={event => emit(event.target.value, event)} />;
  return <input id={inputId} className={cx('cad-property-field', className)} type={type} value={fieldValue} placeholder={field.placeholder} disabled={field.disabled} onChange={event => emit(event.target.value, event)} />;
}

export function CadPropertyRow({ property, value, onValueChange, className }: CadAnyProps) {
  const generatedId = useId();
  const field = property || {};
  if (field.hidden) return null;
  const inputId = `cad-property-${generatedId}-${field.id || 'field'}`;
  const labelable = !field.readOnly && typeof field.render !== 'function' && !['toggle', 'boolean', 'coordinate', 'readonly'].includes(field.type || 'text');
  return <div className={cx('cad-property-row', field.readOnly && 'cad-property-row--readonly', className)} data-type={field.type || 'text'}>
    {labelable ? <label className="cad-property-row__label" htmlFor={inputId} title={field.description || field.label}>{field.label || field.id}</label> : <span className="cad-property-row__label" title={field.description || field.label}>{field.label || field.id}</span>}
    <CadPropertyField property={field} value={value} inputId={inputId} onValueChange={onValueChange} />
  </div>;
}

export function CadPropertySection({ id, title, properties = [], collapsible = true, open, defaultOpen = true, onOpenChange, onValueChange, className, children }: CadAnyProps) {
  const generatedId = useId();
  const sectionId = id || `cad-property-section-${generatedId}`;
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, (nextValue, event) => onOpenChange?.(nextValue, event));
  const heading = collapsible
    ? <button type="button" className="cad-property-section__heading" aria-expanded={isOpen} aria-controls={`${sectionId}-body`} onClick={event => setOpen(!isOpen, event)}><span>{title}</span><i aria-hidden="true">{isOpen ? '▾' : '▸'}</i></button>
    : <h3 className="cad-property-section__heading">{title}</h3>;
  return <section className={cx('cad-property-section', !isOpen && 'cad-property-section--closed', className)}>
    {heading}
    <div id={`${sectionId}-body`} className="cad-property-section__body" hidden={!isOpen}>{children || asArray(properties).map((property, index) => <CadPropertyRow key={property?.id || index} property={property} onValueChange={onValueChange} />)}</div>
  </section>;
}

/** Sectioned inspector grid. It owns only disclosure state, never CAD data. */
export function CadPropertyGrid({ sections, properties, onValueChange, label = 'Properties', className, ...props }: CadAnyProps) {
  const normalizedSections = asArray(sections).length ? asArray(sections) : [{ id: 'properties', title: label, properties: asArray(properties) }];
  return <section {...props} className={cx('cad-property-grid', className)} aria-label={label}>
    {normalizedSections.map((section, index) => <CadPropertySection key={section?.id || index} {...section} onValueChange={onValueChange} />)}
  </section>;
}

export function CadLayerPicker({ layers = [], value, defaultValue, onChange, label = 'Current layer', className, disabled = false }: CadAnyProps) {
  const initialValue = defaultValue ?? asArray(layers)[0]?.id ?? '';
  const [selectedId, setSelectedId] = useControllableState(value, initialValue, (nextValue, layer, event) => onChange?.(nextValue, layer, event));
  return <label className={cx('cad-layer-picker', className)}><span>{label}</span><select value={selectedId} disabled={disabled} onChange={event => { const layer = asArray(layers).find(item => item?.id === event.target.value); setSelectedId(event.target.value, layer, event); }}>
    {asArray(layers).map((layer, index) => <option key={layer?.id || index} value={layer?.id}>{itemLabel(layer)}</option>)}
  </select></label>;
}

export function CadLayerRow({ layer, active = false, onActivate, onLayerChange, onColorClick, className }: CadAnyProps) {
  const item = layer || {};
  const update = (patch, event) => onLayerChange?.(item.id, patch, item, event);
  const label = itemLabel(item);
  const stateControl = (ariaLabel, pressed, glyph, patch) => onLayerChange
    ? <button type="button" aria-label={ariaLabel} aria-pressed={pressed} data-active={pressed ? 'true' : 'false'} onClick={event => update(patch, event)}>{glyph}</button>
    : <span aria-hidden="true" data-active={pressed ? 'true' : 'false'}>{glyph}</span>;
  const color = <CadColorSwatch color={item.color || '#ffffff'} aria-label={`${label} color`} onClick={onColorClick ? event => onColorClick(item, event) : undefined} />;
  const name = <span><strong>{label}</strong>{item.description && <small>{item.description}</small>}</span>;
  return <div className={cx('cad-layer-row', active && 'cad-layer-row--active', className)} data-active={active ? 'true' : 'false'} role="listitem">
    <div className="cad-layer-row__states">
      {stateControl(`${label}: ${item.visible === false ? 'show' : 'hide'}`, item.visible !== false, '◉', { visible: item.visible === false })}
      {stateControl(`${label}: ${item.frozen ? 'thaw' : 'freeze'}`, Boolean(item.frozen), '❄', { frozen: !item.frozen })}
      {stateControl(`${label}: ${item.locked ? 'unlock' : 'lock'}`, Boolean(item.locked), '⌑', { locked: !item.locked })}
    </div>
    <div className="cad-layer-row__identity">{color}{onActivate ? <button type="button" className="cad-layer-row__name" onClick={event => onActivate(item, event)}>{name}</button> : <span className="cad-layer-row__name">{name}</span>}</div>
    <CadLinetypePreview type={item.linetype || 'continuous'} color={item.color || 'currentColor'} label={item.linetype} />
    <CadLineweightPreview weight={item.lineweight ?? 0.25} color={item.color || 'currentColor'} label={item.lineweight ? `${item.lineweight} mm` : undefined} />
  </div>;
}

export function CadLayerPanel({ layers = [], activeLayerId, onActiveLayerChange, onLayerChange, onAddLayer, onDeleteLayer, onColorClick, title = 'Layers', filter, defaultFilter = '', onFilterChange, filterable = true, className, emptyLabel = 'No layers match this filter' }: CadAnyProps) {
  const [query, setQuery] = useControllableState(filter, defaultFilter, (nextValue, event) => onFilterChange?.(nextValue, event));
  const visibleLayers = useMemo(() => asArray(layers).filter(layer => itemLabel(layer).toLocaleLowerCase().includes(String(query || '').toLocaleLowerCase())), [layers, query]);
  return <section className={cx('cad-layer-panel', className)} aria-label={title}>
    <header className="cad-layer-panel__header"><h2>{title}</h2><span>{onAddLayer && <button type="button" aria-label="Add layer" onClick={onAddLayer}>+</button>}{onDeleteLayer && <button type="button" aria-label="Delete active layer" disabled={!activeLayerId} onClick={onDeleteLayer}>×</button>}</span></header>
    {filterable && <CadFilterBar value={query} onChange={setQuery} label="Filter layers" placeholder="Filter layers" />}
    <div className="cad-layer-panel__columns" aria-hidden="true"><span>State</span><span>Layer</span><span>Type</span><span>Weight</span></div>
    <div className="cad-layer-panel__rows" role="list">{visibleLayers.map((layer, index) => <CadLayerRow key={layer?.id || index} layer={layer} active={layer?.id === activeLayerId || layer?.active} onActivate={onActiveLayerChange ? (item, event) => onActiveLayerChange(item.id, item, event) : undefined} onLayerChange={onLayerChange} onColorClick={onColorClick} />)}{!visibleLayers.length && <p className="cad-layer-panel__empty">{emptyLabel}</p>}</div>
  </section>;
}

function CadTreeBranch({ node, level, selectedId, expandedIds, onSelect, onExpandedChange }: CadAnyProps) {
  const item = node || {};
  const children = asArray(item.children);
  const hasChildren = children.length > 0;
  const expanded = expandedIds.has(item.id);
  const selected = item.id === selectedId;
  const Icon = item.icon;
  const toggle = event => {
    if (!hasChildren) return;
    const next = new Set(expandedIds);
    if (expanded) next.delete(item.id); else next.add(item.id);
    onExpandedChange(next, item, event);
  };
  return <li className="cad-object-tree__branch">
    <div className={cx('cad-object-tree__entry', selected && 'cad-object-tree__entry--selected')}>
      {hasChildren ? <button type="button" className="cad-object-tree__expander" aria-label={`${expanded ? 'Collapse' : 'Expand'} ${itemLabel(item)}`} onClick={toggle}>{expanded ? '▾' : '▸'}</button> : <span className="cad-object-tree__spacer" />}
      <button type="button" className="cad-object-tree__label" disabled={item.disabled} onClick={event => onSelect?.(item, event)} onKeyDown={event => { if (event.key === 'ArrowRight' && hasChildren && !expanded) { event.preventDefault(); toggle(event); } if (event.key === 'ArrowLeft' && hasChildren && expanded) { event.preventDefault(); toggle(event); } }}>{Icon && <Icon size={13} aria-hidden="true" />}<span>{itemLabel(item)}</span>{item.meta && <small>{item.meta}</small>}</button>
    </div>
    {hasChildren && expanded && <ul>{children.map((child, index) => <CadTreeBranch key={child?.id || index} node={child} level={level + 1} selectedId={selectedId} expandedIds={expandedIds} onSelect={onSelect} onExpandedChange={onExpandedChange} />)}</ul>}
  </li>;
}

/** Model browser / block explorer tree with controlled selection and expansion. */
export function CadObjectTree({ nodes = [], selectedId, defaultSelectedId = '', onSelect, expandedIds, defaultExpandedIds, onExpandedChange, label = 'CAD object tree', className, ...props }: CadAnyProps) {
  const initialExpanded = defaultExpandedIds ?? asArray(nodes).filter(node => node?.expanded).map(node => node.id);
  const [currentSelectedId, setSelectedId] = useControllableState(selectedId, defaultSelectedId, (nextValue, item, event) => onSelect?.(nextValue, item, event));
  const [currentExpandedIds, setExpandedIds] = useControllableState(expandedIds, initialExpanded, (nextValue, item, event) => onExpandedChange?.(nextValue, item, event));
  const expandedSet = new Set(asArray(currentExpandedIds));
  return <ul {...props} className={cx('cad-object-tree', className)} aria-label={label}>{asArray(nodes).map((node, index) => <CadTreeBranch key={node?.id || index} node={node} level={1} selectedId={currentSelectedId} expandedIds={expandedSet} onSelect={(item, event) => setSelectedId(item.id, item, event)} onExpandedChange={(nextSet, item, event) => setExpandedIds([...nextSet], item, event)} />)}</ul>;
}

export function CadTaskProgress({ label, value = 0, status, onCancel, className }: CadAnyProps) {
  const normalizedValue = Math.max(0, Math.min(100, Number(value) || 0));
  return <section className={cx('cad-task-progress', className)} aria-label={label || 'Task progress'}>
    <div><strong>{label || 'Working'}</strong><output>{status || `${normalizedValue}%`}</output>{onCancel && <button type="button" onClick={onCancel}>Cancel</button>}</div>
    <progress value={normalizedValue} max="100" aria-label={label || 'Task progress'}>{normalizedValue}%</progress>
  </section>;
}

export function CadReferenceList({ references = [], onReload, onUnload, className, title = 'External references' }: CadAnyProps) {
  return <section className={cx('cad-reference-list', className)} aria-label={title}>
    <header><h2>{title}</h2><span>{asArray(references).length}</span></header>
    <ul>{asArray(references).map((reference, index) => <li key={reference?.id || index}><span><strong>{itemLabel(reference)}</strong><small>{reference?.path || reference?.detail}</small></span><em data-status={reference?.status || 'loaded'}>{reference?.status || 'loaded'}</em><span className="cad-reference-list__actions">{onReload && <button type="button" aria-label={`Reload ${itemLabel(reference)}`} onClick={event => onReload(reference, event)}>Reload</button>}{onUnload && <button type="button" aria-label={`Unload ${itemLabel(reference)}`} onClick={event => onUnload(reference, event)}>Unload</button>}</span></li>)}</ul>
  </section>;
}
