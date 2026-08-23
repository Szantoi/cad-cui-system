import React, { useId, useMemo } from 'react';
import { CadAngleInput, CadNumericInput, CadShortcutHint, CadToolButton, CadUnitInput } from './CadCommandUi.jsx';
import { asArray, cx, itemLabel, useControllableState } from './cadUiUtils.js';

const DEFAULT_DYNAMIC_FIELDS = Object.freeze({
  point: Object.freeze([{ id: 'x', label: 'X', unit: 'mm' }, { id: 'y', label: 'Y', unit: 'mm' }, { id: 'z', label: 'Z', unit: 'mm' }]),
  polar: Object.freeze([{ id: 'distance', label: 'Distance', unit: 'mm' }, { id: 'angle', label: 'Angle', type: 'angle', unit: '°' }]),
  displacement: Object.freeze([{ id: 'deltaX', label: 'ΔX', unit: 'mm' }, { id: 'deltaY', label: 'ΔY', unit: 'mm' }, { id: 'deltaZ', label: 'ΔZ', unit: 'mm' }])
});

const DEFAULT_SNAP_MODES = Object.freeze([
  { id: 'endpoint', label: 'Endpoint', glyph: '□', shortcut: 'END' },
  { id: 'midpoint', label: 'Midpoint', glyph: '△', shortcut: 'MID' },
  { id: 'center', label: 'Center', glyph: '○', shortcut: 'CEN' },
  { id: 'node', label: 'Node', glyph: '◆', shortcut: 'NOD' },
  { id: 'quadrant', label: 'Quadrant', glyph: '◇', shortcut: 'QUA' },
  { id: 'intersection', label: 'Intersection', glyph: '×', shortcut: 'INT' },
  { id: 'perpendicular', label: 'Perpendicular', glyph: '⊥', shortcut: 'PER' },
  { id: 'tangent', label: 'Tangent', glyph: '◒', shortcut: 'TAN' },
  { id: 'nearest', label: 'Nearest', glyph: '•', shortcut: 'NEA' },
  { id: 'parallel', label: 'Parallel', glyph: '∥', shortcut: 'PAR' }
]);

const DEFAULT_CONSTRAINTS = Object.freeze([
  { id: 'coincident', label: 'Coincident', glyph: '⊙' },
  { id: 'horizontal', label: 'Horizontal', glyph: '↔' },
  { id: 'vertical', label: 'Vertical', glyph: '↕' },
  { id: 'parallel', label: 'Parallel', glyph: '∥' },
  { id: 'perpendicular', label: 'Perpendicular', glyph: '⊥' },
  { id: 'tangent', label: 'Tangent', glyph: '◒' },
  { id: 'concentric', label: 'Concentric', glyph: '◎' },
  { id: 'equal', label: 'Equal', glyph: '=' },
  { id: 'fix', label: 'Fix', glyph: '▣' }
]);

const DEFAULT_SCALES = Object.freeze(['1:1', '1:2', '1:5', '1:10', '1:20', '1:50', '1:100']);
const DEFAULT_VIEWS = Object.freeze([
  { id: 'top', label: 'Top' }, { id: 'bottom', label: 'Bottom' }, { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' }, { id: 'left', label: 'Left' }, { id: 'right', label: 'Right' }, { id: 'isometric', label: 'Isometric' }
]);

const normalizeOptions = items => asArray(items).map((item, index) => typeof item === 'string' ? { id: item, label: item } : { ...item, id: item?.id || `${itemLabel(item)}-${index}`, label: itemLabel(item) });

/**
 * Cursor-adjacent coordinate input. It owns only temporary UI draft values;
 * the host decides where the overlay is positioned and what a submission does.
 */
export function CadDynamicInput({ mode = 'point', fields, value, defaultValue = {}, onChange, onSubmit, prompt = 'Specify point', unit = 'mm', visible = true, submitLabel = 'Accept', className, children, ...props }) {
  const generatedId = useId();
  const resolvedFields = asArray(fields).length ? asArray(fields) : (DEFAULT_DYNAMIC_FIELDS[mode] || DEFAULT_DYNAMIC_FIELDS.point);
  const fieldDefaults = useMemo(() => resolvedFields.reduce((result, field) => field?.id && field.value !== undefined ? { ...result, [field.id]: field.value } : result, {}), [resolvedFields]);
  const resolvedDefaultValue = useMemo(() => ({ ...fieldDefaults, ...(defaultValue && typeof defaultValue === 'object' ? defaultValue : {}) }), [defaultValue, fieldDefaults]);
  const [values, setValues] = useControllableState(value, resolvedDefaultValue, (nextValue, field, event) => onChange?.(nextValue, field, event));
  const resolvedValues = { ...fieldDefaults, ...(values && typeof values === 'object' ? values : {}) };
  const updateField = (field, nextValue, event) => setValues({ ...resolvedValues, [field.id]: nextValue }, field, event);
  if (!visible) return null;
  return <form {...props} className={cx('cad-dynamic-input', className)} data-mode={mode} aria-label={prompt} onSubmit={event => { event.preventDefault(); onSubmit?.(resolvedValues, event); }}>
    <output className="cad-dynamic-input__prompt">{prompt}</output>
    <div className="cad-dynamic-input__fields">
      {resolvedFields.map((field, index) => {
        const common = {
          key: field.id || index,
          id: `cad-dynamic-${generatedId}-${field.id || index}`,
          label: field.label || field.id,
          value: resolvedValues[field.id] ?? '',
          min: field.min,
          max: field.max,
          step: field.step,
          disabled: field.disabled,
          unit: field.unit || unit,
          onValueChange: (nextValue, event) => updateField(field, nextValue, event),
          showSteppers: false
        };
        if (field.type === 'angle') return <CadAngleInput {...common} unit={field.unit || '°'} />;
        if (field.type === 'unit') return <CadUnitInput {...common} />;
        return <CadNumericInput {...common} />;
      })}
      {children}
    </div>
    {onSubmit && <button type="submit" className="cad-dynamic-input__submit">{submitLabel}<span aria-hidden="true">↵</span></button>}
  </form>;
}

/** Object-snap chooser for endpoint/midpoint/intersection-style drafting. */
export function CadObjectSnapMenu({ modes = DEFAULT_SNAP_MODES, activeIds, defaultActiveIds = [], multiple = true, onChange, onClose, label = 'Object snaps', className, ...props }) {
  const normalizedModes = useMemo(() => normalizeOptions(modes), [modes]);
  const [currentActiveIds, setActiveIds] = useControllableState(activeIds, defaultActiveIds, (nextValue, item, event) => onChange?.(nextValue, item, event));
  const selected = new Set(asArray(currentActiveIds));
  const toggle = (item, event) => {
    if (item.disabled) return;
    const next = multiple
      ? selected.has(item.id) ? [...selected].filter(id => id !== item.id) : [...selected, item.id]
      : selected.has(item.id) ? [] : [item.id];
    setActiveIds(next, item, event);
  };
  return <aside {...props} className={cx('cad-object-snap-menu', className)} aria-label={label}>
    <header><strong>{label}</strong>{onClose && <button type="button" aria-label={`Close ${label}`} onClick={onClose}>×</button>}</header>
    <div className="cad-object-snap-menu__grid" role="group" aria-label={label}>
      {normalizedModes.map(item => <button key={item.id} type="button" className="cad-object-snap-menu__item" data-active={selected.has(item.id) ? 'true' : 'false'} aria-pressed={selected.has(item.id)} disabled={item.disabled} title={[item.label, item.shortcut].filter(Boolean).join(' · ')} onClick={event => toggle(item, event)}>
        <span className="cad-object-snap-menu__glyph" aria-hidden="true">{item.glyph || '•'}</span><span>{item.label}</span>{item.shortcut && <CadShortcutHint shortcut={item.shortcut} />}
      </button>)}
    </div>
  </aside>;
}

/** Compact context toolbar intended for a selected object or active grip. */
export function CadGripToolbar({ tools = [], selectionCount, label = 'Selection tools', onAction, onDismiss, className, ...props }) {
  return <aside {...props} className={cx('cad-grip-toolbar', className)} aria-label={label}>
    {selectionCount !== undefined && <output className="cad-grip-toolbar__selection">{selectionCount} selected</output>}
    <div role="group" aria-label={label}>{asArray(tools).map((tool, index) => tool?.type === 'separator'
      ? <span key={tool.id || index} className="cad-grip-toolbar__separator" role="separator" />
      : <CadToolButton key={tool?.id || index} icon={tool?.icon} label={itemLabel(tool)} shortcut={tool?.shortcut} tone={tool?.tone} active={tool?.active} toggle={tool?.toggle} disabled={tool?.disabled} compact onClick={event => { tool?.onClick?.(tool, event); onAction?.(tool, event); }} />)}</div>
    {onDismiss && <button type="button" className="cad-grip-toolbar__dismiss" aria-label={`Dismiss ${label}`} onClick={onDismiss}>×</button>}
  </aside>;
}

/** Parametric constraint strip. The active array lets a host represent modes or selected constraints. */
export function CadConstraintBar({ constraints = DEFAULT_CONSTRAINTS, activeIds, defaultActiveIds = [], onChange, onAction, label = 'Geometric constraints', className, ...props }) {
  const normalizedConstraints = useMemo(() => normalizeOptions(constraints), [constraints]);
  const [currentActiveIds, setActiveIds] = useControllableState(activeIds, defaultActiveIds, (nextValue, item, event) => onChange?.(nextValue, item, event));
  const selected = new Set(asArray(currentActiveIds));
  const toggle = (item, event) => {
    if (item.disabled) return;
    const next = selected.has(item.id) ? [...selected].filter(id => id !== item.id) : [...selected, item.id];
    setActiveIds(next, item, event);
    onAction?.(item, event);
  };
  return <div {...props} className={cx('cad-constraint-bar', className)} role="group" aria-label={label}>
    {normalizedConstraints.map(item => <button key={item.id} type="button" data-active={selected.has(item.id) ? 'true' : 'false'} aria-label={item.label} aria-pressed={selected.has(item.id)} disabled={item.disabled} title={item.label} onClick={event => toggle(item, event)}><span aria-hidden="true">{item.glyph || '•'}</span><small>{item.shortLabel || item.label}</small></button>)}
  </div>;
}

export function CadAnnotationScalePicker({ scales = DEFAULT_SCALES, value, defaultValue, onChange, label = 'Annotation scale', onManage, id, selectProps = {}, disabled = false, className, ...props }) {
  const generatedId = useId();
  const selectId = id || `cad-annotation-scale-${generatedId}`;
  const options = useMemo(() => normalizeOptions(scales), [scales]);
  const initialValue = defaultValue ?? options[0]?.id ?? '';
  const [selectedId, setSelectedId] = useControllableState(value, initialValue, (nextValue, scale, event) => onChange?.(nextValue, scale, event));
  return <div {...props} className={cx('cad-annotation-scale-picker', className)}><label htmlFor={selectId}>{label}</label><select {...selectProps} id={selectId} value={selectedId} disabled={disabled || selectProps.disabled} onChange={event => { const scale = options.find(item => item.id === event.target.value); setSelectedId(event.target.value, scale, event); selectProps.onChange?.(event); }}>{options.map(option => <option key={option.id} value={option.id} disabled={option.disabled}>{option.label}</option>)}</select>{onManage && <button type="button" disabled={disabled} onClick={onManage}>Manage</button>}</div>;
}

export function CadViewPresetPicker({ presets = DEFAULT_VIEWS, value, defaultValue, onChange, label = 'View preset', id, selectProps = {}, disabled = false, className, ...props }) {
  const generatedId = useId();
  const selectId = id || `cad-view-preset-${generatedId}`;
  const options = useMemo(() => normalizeOptions(presets), [presets]);
  const initialValue = defaultValue ?? options[0]?.id ?? '';
  const [selectedId, setSelectedId] = useControllableState(value, initialValue, (nextValue, preset, event) => onChange?.(nextValue, preset, event));
  return <div {...props} className={cx('cad-view-preset-picker', className)}><label htmlFor={selectId}>{label}</label><select {...selectProps} id={selectId} value={selectedId} disabled={disabled || selectProps.disabled} onChange={event => { const preset = options.find(item => item.id === event.target.value); setSelectedId(event.target.value, preset, event); selectProps.onChange?.(event); }}>{options.map(option => <option key={option.id} value={option.id} disabled={option.disabled}>{option.label}</option>)}</select></div>;
}

/** Readout for polar tracking, ortho and typed distances near the cursor. */
export function CadPolarTracker({ angle, distance, increment, active, defaultActive = false, onActiveChange, className, label = 'Polar tracking', ...props }) {
  const [isActive, setActive] = useControllableState(active, defaultActive, (nextValue, event) => onActiveChange?.(nextValue, event));
  return <div {...props} className={cx('cad-polar-tracker', isActive && 'cad-polar-tracker--active', className)} role="group" aria-label={label}>
    <button type="button" aria-pressed={isActive} onClick={event => setActive(!isActive, event)}><span className="cad-polar-tracker__ray" aria-hidden="true" />POLAR</button>
    {angle !== undefined && <span><small>∠</small>{angle}{increment && <em>/{increment}</em>}</span>}
    {distance !== undefined && <span><small>D</small>{distance}</span>}
  </div>;
}

/** Visual object-snap marker for an on-canvas overlay. */
export function CadObjectSnapMarker({ type = 'endpoint', label, active = true, className, style, ...props }) {
  const glyph = DEFAULT_SNAP_MODES.find(item => item.id === type)?.glyph || '•';
  return <span {...props} className={cx('cad-object-snap-marker', active && 'cad-object-snap-marker--active', className)} data-type={type} style={style} role={label ? 'img' : undefined} aria-label={label || undefined}><span aria-hidden="true">{glyph}</span>{label && <small>{label}</small>}</span>;
}

/** Focusable selection grip. The host handles pointer movement and geometry edits. */
export function CadSelectionGrip({ label = 'Selection grip', variant = 'square', active = false, disabled = false, onPointerDown, onClick, className, ...props }) {
  return <button {...props} type="button" className={cx('cad-selection-grip', active && 'cad-selection-grip--active', className)} data-variant={variant} aria-label={label} disabled={disabled} onPointerDown={onPointerDown} onClick={onClick}><span aria-hidden="true" /></button>;
}
