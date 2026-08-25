import React, { useCallback, useId, useMemo } from 'react';
import { cx } from './cadUiUtils.js';

const text = value => String(value ?? '').trim();
const displayText = value => String(value ?? '');
const isRecord = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export const CAD_WORKSPACE_PRESET_ACTIONS = Object.freeze({
  SELECT: 'select',
  DRAFT_NAME_CHANGE: 'draft-name-change',
  SAVE_AS: 'save-as',
  LOAD: 'load',
  OVERWRITE: 'overwrite',
  DELETE: 'delete',
  EXPORT: 'export',
  IMPORT: 'import'
});

const presetSource = value => Array.isArray(value)
  ? value
  : Array.isArray(value?.presets)
    ? value.presets
    : [];

/**
 * Normalizes only the small identity and presentation surface needed by the
 * manager. Any host payload, version, scope, thumbnail, or renderer-specific
 * snapshot fields pass through untouched.
 */
export function normalizeCadWorkspacePresets(value = []) {
  const seenIds = new Set();
  return presetSource(value).reduce((presets, candidate, index) => {
    const source = typeof candidate === 'string' || typeof candidate === 'number'
      ? { id: String(candidate), name: String(candidate) }
      : candidate;
    if (!isRecord(source)) return presets;

    const id = text(source.id ?? source.key) || `preset-${index + 1}`;
    if (seenIds.has(id)) return presets;
    seenIds.add(id);

    const name = text(source.name ?? source.label ?? source.title) || `Preset ${presets.length + 1}`;
    const readOnly = Boolean(source.readOnly ?? source.locked ?? source.protected ?? source.system);
    const disabled = Boolean(source.disabled);

    presets.push({
      ...source,
      id,
      name,
      description: text(source.description ?? source.detail),
      disabled,
      readOnly,
      canOverwrite: !disabled && (source.canOverwrite === undefined ? !readOnly : Boolean(source.canOverwrite)),
      canDelete: !disabled && (source.canDelete === undefined ? !readOnly : Boolean(source.canDelete))
    });
    return presets;
  }, []);
}

export function getCadWorkspacePreset(value = [], presetId) {
  const id = text(presetId);
  return id ? normalizeCadWorkspacePresets(value).find(preset => preset.id === id) : undefined;
}

/** Case-insensitive duplicate detection for a Save as workflow. */
export function isCadWorkspacePresetNameTaken(value = [], name, { exceptId } = {}) {
  const normalizedName = text(name).toLocaleLowerCase();
  const excludedId = text(exceptId);
  return Boolean(normalizedName) && normalizeCadWorkspacePresets(value).some(preset => (
    preset.id !== excludedId && preset.name.toLocaleLowerCase() === normalizedName
  ));
}

const defaultStatusRole = tone => tone === 'error' || tone === 'warning' ? 'alert' : 'status';

/**
 * A fully controlled, persistence-agnostic workspace-preset surface.
 *
 * The host owns preset records, the selected ID, draft name, data validation,
 * file pickers, serialization, networking, and storage. This component only
 * emits explicit user intents, so it can be used with local files, a server,
 * browser storage, Electron, or any docking/renderer implementation. When the
 * host provides no presets, `emptyStateGuideLabel` and
 * `emptyStateGuideSteps` provide presentation-only, localizable copy for the
 * default first-save path; they never create or persist state.
 */
export function CadWorkspacePresetManager({
  presets = [],
  selectedPresetId = '',
  draftName = '',
  onSelectedPresetIdChange,
  onDraftNameChange,
  onSaveAs,
  onLoad,
  onOverwrite,
  onDelete,
  onExport,
  onImport,
  onAction,
  title = 'Workspace presets',
  description = 'Save, restore and exchange workspace arrangements.',
  presetListLabel = 'Saved presets',
  draftNameLabel = 'Preset name',
  draftNamePlaceholder = 'e.g. Focused drafting',
  saveAsLabel = 'Save as',
  loadLabel = 'Load',
  overwriteLabel = 'Overwrite',
  deleteLabel = 'Delete',
  exportLabel = 'Export',
  importLabel = 'Import',
  selectedLabel = 'Selected preset',
  noSelectionLabel = 'Choose a saved preset',
  emptyLabel = 'No saved presets yet.',
  emptyStateGuideLabel = 'First preset checklist',
  emptyStateGuideSteps,
  duplicateNameLabel = 'A preset with this name already exists.',
  readOnlyLabel = 'Protected preset',
  importDescription = 'The host chooses a file and validates its contents.',
  status,
  statusTone = 'neutral',
  busy = false,
  disabled = false,
  allowDuplicateNames = false,
  maxNameLength = 64,
  className,
  children,
  ...props
}) {
  const generatedId = useId();
  const titleId = `cad-workspace-preset-manager-${generatedId}-title`;
  const descriptionId = `cad-workspace-preset-manager-${generatedId}-description`;
  const nameId = `cad-workspace-preset-manager-${generatedId}-name`;
  const listId = `cad-workspace-preset-manager-${generatedId}-list`;
  const statusId = `cad-workspace-preset-manager-${generatedId}-status`;
  const normalizedPresets = useMemo(() => normalizeCadWorkspacePresets(presets), [presets]);
  const hasPresets = normalizedPresets.length > 0;
  const selectedId = text(selectedPresetId);
  const selectedPreset = useMemo(
    () => normalizedPresets.find(preset => preset.id === selectedId),
    [normalizedPresets, selectedId]
  );
  const normalizedDraftName = text(draftName);
  const defaultEmptyStateGuideSteps = useMemo(() => [
    'Name the current workspace below.',
    `Choose ${saveAsLabel} to store it.`,
    `Later, choose it from ${presetListLabel} and select ${loadLabel}.`
  ], [loadLabel, presetListLabel, saveAsLabel]);
  const resolvedEmptyStateGuideSteps = useMemo(() => {
    const steps = Array.isArray(emptyStateGuideSteps)
      ? emptyStateGuideSteps.map(step => text(step)).filter(Boolean)
      : [];
    return steps.length ? steps : defaultEmptyStateGuideSteps;
  }, [defaultEmptyStateGuideSteps, emptyStateGuideSteps]);
  const resolvedEmptyStateGuideLabel = text(emptyStateGuideLabel) || 'First preset checklist';
  const duplicateName = !allowDuplicateNames && isCadWorkspacePresetNameTaken(normalizedPresets, normalizedDraftName);
  const isDisabled = Boolean(disabled || busy);
  const canSelect = !isDisabled && hasPresets && typeof onSelectedPresetIdChange === 'function';
  const canEditDraftName = !isDisabled && typeof onDraftNameChange === 'function';
  const canSaveAs = !isDisabled && Boolean(normalizedDraftName) && !duplicateName && typeof onSaveAs === 'function';
  const canLoad = !isDisabled && Boolean(selectedPreset) && !selectedPreset.disabled && typeof onLoad === 'function';
  const canOverwrite = !isDisabled && Boolean(selectedPreset?.canOverwrite) && typeof onOverwrite === 'function';
  const canDelete = !isDisabled && Boolean(selectedPreset?.canDelete) && typeof onDelete === 'function';
  const canExport = !isDisabled && hasPresets && typeof onExport === 'function';
  const canImport = !isDisabled && typeof onImport === 'function';

  const publish = useCallback((type, event, overrides = {}) => {
    const action = {
      type,
      source: 'workspace-preset-manager',
      presets: normalizedPresets,
      selectedPresetId: selectedPreset?.id || '',
      preset: selectedPreset,
      name: normalizedDraftName,
      ...overrides
    };
    onAction?.(action, event);
    return action;
  }, [normalizedDraftName, normalizedPresets, onAction, selectedPreset]);

  const handleDraftNameChange = useCallback(event => {
    const value = event.target.value;
    const action = publish(CAD_WORKSPACE_PRESET_ACTIONS.DRAFT_NAME_CHANGE, event, { name: text(value) });
    onDraftNameChange?.(value, action, event);
  }, [onDraftNameChange, publish]);

  const handleSelectionChange = useCallback(event => {
    const id = text(event.target.value);
    const preset = normalizedPresets.find(candidate => candidate.id === id);
    const action = publish(CAD_WORKSPACE_PRESET_ACTIONS.SELECT, event, {
      selectedPresetId: id,
      preset
    });
    onSelectedPresetIdChange?.(id, preset, action, event);
  }, [normalizedPresets, onSelectedPresetIdChange, publish]);

  const handleSaveAs = useCallback(event => {
    event.preventDefault();
    if (!canSaveAs) return;
    const action = publish(CAD_WORKSPACE_PRESET_ACTIONS.SAVE_AS, event);
    onSaveAs?.(action, event);
  }, [canSaveAs, onSaveAs, publish]);

  const handleLoad = useCallback(event => {
    if (!canLoad) return;
    const action = publish(CAD_WORKSPACE_PRESET_ACTIONS.LOAD, event);
    onLoad?.(action, event);
  }, [canLoad, onLoad, publish]);

  const handleOverwrite = useCallback(event => {
    if (!canOverwrite) return;
    const action = publish(CAD_WORKSPACE_PRESET_ACTIONS.OVERWRITE, event);
    onOverwrite?.(action, event);
  }, [canOverwrite, onOverwrite, publish]);

  const handleDelete = useCallback(event => {
    if (!canDelete) return;
    const action = publish(CAD_WORKSPACE_PRESET_ACTIONS.DELETE, event);
    onDelete?.(action, event);
  }, [canDelete, onDelete, publish]);

  const handleExport = useCallback(event => {
    if (!canExport) return;
    const action = publish(CAD_WORKSPACE_PRESET_ACTIONS.EXPORT, event);
    onExport?.(action, event);
  }, [canExport, onExport, publish]);

  const handleImport = useCallback(event => {
    if (!canImport) return;
    const action = publish(CAD_WORKSPACE_PRESET_ACTIONS.IMPORT, event);
    onImport?.(action, event);
  }, [canImport, onImport, publish]);

  const describedBy = [description ? descriptionId : '', status ? statusId : ''].filter(Boolean).join(' ') || undefined;

  return <section
    {...props}
    className={cx('cad-workspace-preset-manager', className)}
    aria-labelledby={titleId}
    aria-describedby={describedBy}
    data-busy={busy ? 'true' : 'false'}
    data-has-presets={hasPresets ? 'true' : 'false'}
    data-selected-preset-id={selectedPreset?.id || undefined}
  >
    <header className="cad-workspace-preset-manager__header">
      <span className="cad-workspace-preset-manager__eyebrow" aria-hidden="true">WORKSPACE / PRESETS</span>
      <h2 id={titleId}>{title}</h2>
      {description && <p id={descriptionId} className="cad-workspace-preset-manager__description">{description}</p>}
    </header>

    <div className="cad-workspace-preset-manager__saved">
      <label htmlFor={listId}>{presetListLabel}</label>
      <select
        id={listId}
        className="cad-workspace-preset-manager__list"
        value={selectedPreset?.id || ''}
        disabled={!canSelect}
        onChange={handleSelectionChange}
      >
        <option value="">{noSelectionLabel}</option>
        {normalizedPresets.map(preset => <option key={preset.id} value={preset.id} disabled={preset.disabled}>
          {preset.name}{preset.readOnly ? ' · protected' : ''}
        </option>)}
      </select>
      {!hasPresets && <>
        <p className="cad-workspace-preset-manager__empty" role="status">{emptyLabel}</p>
        <ol className="cad-workspace-preset-manager__empty cad-workspace-preset-manager__empty-guide" aria-label={resolvedEmptyStateGuideLabel}>
          {resolvedEmptyStateGuideSteps.map((step, index) => <li key={`${index}-${step}`}>{step}</li>)}
        </ol>
      </>}
    </div>

    <div className="cad-workspace-preset-manager__selection" aria-live="polite">
      <span className="cad-workspace-preset-manager__selection-label">{selectedLabel}</span>
      {selectedPreset ? <div className="cad-workspace-preset-manager__selection-copy">
        <strong>{selectedPreset.name}</strong>
        {selectedPreset.description && <small>{selectedPreset.description}</small>}
        {selectedPreset.readOnly && <small className="cad-workspace-preset-manager__protected">{readOnlyLabel}</small>}
      </div> : <span className="cad-workspace-preset-manager__selection-empty">{noSelectionLabel}</span>}
    </div>

    <form className="cad-workspace-preset-manager__save" onSubmit={handleSaveAs}>
      <label htmlFor={nameId}>{draftNameLabel}</label>
      <div className="cad-workspace-preset-manager__save-controls">
        <input
          id={nameId}
          value={displayText(draftName)}
          maxLength={maxNameLength}
          placeholder={draftNamePlaceholder}
          disabled={!canEditDraftName}
          aria-invalid={duplicateName || undefined}
          aria-describedby={duplicateName ? `${nameId}-duplicate` : undefined}
          onChange={handleDraftNameChange}
        />
        <button type="submit" disabled={!canSaveAs} aria-label={`${saveAsLabel} ${normalizedDraftName || draftNameLabel}`}>{saveAsLabel}</button>
      </div>
      {duplicateName && <p id={`${nameId}-duplicate`} className="cad-workspace-preset-manager__validation" role="alert">{duplicateNameLabel}</p>}
    </form>

    <div className="cad-workspace-preset-manager__actions" aria-label="Selected preset actions">
      <button type="button" disabled={!canLoad} onClick={handleLoad}>{loadLabel}</button>
      <button type="button" disabled={!canOverwrite} onClick={handleOverwrite}>{overwriteLabel}</button>
      <button type="button" disabled={!canDelete} onClick={handleDelete}>{deleteLabel}</button>
    </div>

    <footer className="cad-workspace-preset-manager__transfer">
      <button type="button" disabled={!canExport} onClick={handleExport}>{exportLabel}</button>
      <button type="button" disabled={!canImport} onClick={handleImport}>{importLabel}</button>
      {importDescription && <small>{importDescription}</small>}
    </footer>

    {status && <p id={statusId} className="cad-workspace-preset-manager__status" data-tone={statusTone} role={defaultStatusRole(statusTone)}>{status}</p>}
    {children}
  </section>;
}

export const CadWorkspacePresetPanel = CadWorkspacePresetManager;
