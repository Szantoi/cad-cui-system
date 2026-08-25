import type { CadAnyProps } from './cad-types.js';
import React from 'react';
export declare const CAD_WORKSPACE_PRESET_ACTIONS: Readonly<{
    SELECT: "select";
    DRAFT_NAME_CHANGE: "draft-name-change";
    SAVE_AS: "save-as";
    LOAD: "load";
    OVERWRITE: "overwrite";
    DELETE: "delete";
    EXPORT: "export";
    IMPORT: "import";
}>;
/**
 * Normalizes only the small identity and presentation surface needed by the
 * manager. Any host payload, version, scope, thumbnail, or renderer-specific
 * snapshot fields pass through untouched.
 */
export declare function normalizeCadWorkspacePresets(value?: readonly any[]): any;
export declare function getCadWorkspacePreset(value: any[], presetId: any): any;
/** Case-insensitive duplicate detection for a Save as workflow. */
export declare function isCadWorkspacePresetNameTaken(value: readonly any[], name: any, { exceptId }?: CadAnyProps): any;
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
export declare function CadWorkspacePresetManager({ presets, selectedPresetId, draftName, onSelectedPresetIdChange, onDraftNameChange, onSaveAs, onLoad, onOverwrite, onDelete, onExport, onImport, onAction, title, description, presetListLabel, draftNameLabel, draftNamePlaceholder, saveAsLabel, loadLabel, overwriteLabel, deleteLabel, exportLabel, importLabel, selectedLabel, noSelectionLabel, emptyLabel, emptyStateGuideLabel, emptyStateGuideSteps, duplicateNameLabel, readOnlyLabel, importDescription, status, statusTone, busy, disabled, allowDuplicateNames, maxNameLength, className, children, ...props }: CadAnyProps): React.JSX.Element;
export declare const CadWorkspacePresetPanel: typeof CadWorkspacePresetManager;
