import type { CadAnyProps } from './cad-types.js';
export declare const CAD_WORKSPACE_MODEL_ID = "model";
/**
 * Makes a host-owned workspace profile list safe for the shared drawing-space
 * chrome. Snapshot and other application-specific metadata pass through
 * untouched: this kit deliberately does not know about a docking engine.
 */
export declare function normalizeCadWorkspaceProfiles(value: any, { modelId, modelName }?: {
    modelId?: string;
    modelName?: string;
}): any[];
export declare function nextCadWorkspaceLayoutName(profiles: any, { prefix, modelId }?: {
    prefix?: string;
    modelId?: string;
}): string;
export declare function createCadWorkspaceProfile(profiles: any, { id, name, modelId, modelName, prefix, ...metadata }?: CadAnyProps): any[];
export declare function renameCadWorkspaceProfile(profiles: any, id: any, name: any, { modelId, modelName }?: {
    modelId?: string;
    modelName?: string;
}): any[];
/** Returns both the remaining profiles and a safe active profile id. */
export declare function removeCadWorkspaceProfile(profiles: any, id: any, activeId: any, { modelId, modelName }?: {
    modelId?: string;
    modelName?: string;
}): {
    profiles: any[];
    activeId: any;
};
