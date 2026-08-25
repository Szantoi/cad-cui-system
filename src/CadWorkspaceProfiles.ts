import type { CadAnyProps } from './cad-types';
import { toTrimmedString as text } from './cadValueUtils';

export const CAD_WORKSPACE_MODEL_ID = 'model';

const profileId = value => {
  const normalized = text(value).toLowerCase();
  return /^[a-z0-9][a-z0-9-]{0,63}$/.test(normalized) ? normalized : '';
};

const profileName = (value, fallback) => text(value).replace(/\s+/g, ' ').slice(0, 48) || fallback;

/**
 * Makes a host-owned workspace profile list safe for the shared drawing-space
 * chrome. Snapshot and other application-specific metadata pass through
 * untouched: this kit deliberately does not know about a docking engine.
 */
export function normalizeCadWorkspaceProfiles(value, { modelId = CAD_WORKSPACE_MODEL_ID, modelName = 'Model' } = {}) {
  const normalizedModelId = profileId(modelId) || CAD_WORKSPACE_MODEL_ID;
  const source = Array.isArray(value) ? value : Array.isArray(value?.profiles) ? value.profiles : [];
  const seen = new Set();
  const profiles = source.reduce((items, candidate, index) => {
    const id = profileId(candidate?.id) || (index === 0 ? normalizedModelId : '');
    if (!id || seen.has(id)) return items;
    seen.add(id);
    items.push({
      ...candidate,
      id,
      name: profileName(candidate?.name ?? candidate?.label, id === normalizedModelId ? modelName : `Layout ${items.length}`),
      system: id === normalizedModelId || Boolean(candidate?.system)
    });
    return items;
  }, []);
  const modelIndex = profiles.findIndex(profile => profile.id === normalizedModelId);
  const model = modelIndex >= 0
    ? { ...profiles[modelIndex], id: normalizedModelId, name: profileName(profiles[modelIndex].name, modelName), system: true }
    : { id: normalizedModelId, name: modelName, system: true };
  return [model, ...profiles.filter(profile => profile.id !== normalizedModelId)];
}

export function nextCadWorkspaceLayoutName(profiles, { prefix = 'Layout', modelId = CAD_WORKSPACE_MODEL_ID } = {}) {
  const normalized = normalizeCadWorkspaceProfiles(profiles, { modelId });
  const usedNames = new Set(normalized.map(profile => profile.name.toLocaleLowerCase()));
  let index = Math.max(1, normalized.filter(profile => profile.id !== modelId).length + 1);
  let name = `${text(prefix) || 'Layout'} ${index}`;
  while (usedNames.has(name.toLocaleLowerCase())) {
    index += 1;
    name = `${text(prefix) || 'Layout'} ${index}`;
  }
  return name;
}

export function createCadWorkspaceProfile(profiles: any, { id, name, modelId = CAD_WORKSPACE_MODEL_ID, modelName = 'Model', prefix = 'Layout', ...metadata }: CadAnyProps = {}) {
  const normalized = normalizeCadWorkspaceProfiles(profiles, { modelId, modelName });
  const occupiedIds = new Set(normalized.map(profile => profile.id));
  const baseId = profileId(id) || 'layout';
  let nextId = baseId;
  let index = 1;
  while (occupiedIds.has(nextId)) {
    index += 1;
    nextId = `${baseId}-${index}`;
  }
  return [...normalized, {
    ...metadata,
    id: nextId,
    name: profileName(name, nextCadWorkspaceLayoutName(normalized, { prefix, modelId })),
    system: false
  }];
}

export function renameCadWorkspaceProfile(profiles, id, name, { modelId = CAD_WORKSPACE_MODEL_ID, modelName = 'Model' } = {}) {
  const normalizedId = profileId(id);
  if (!normalizedId || !text(name)) return normalizeCadWorkspaceProfiles(profiles, { modelId, modelName });
  return normalizeCadWorkspaceProfiles(profiles, { modelId, modelName }).map(profile => profile.id === normalizedId
    ? { ...profile, name: profileName(name, profile.name) }
    : profile);
}

/** Returns both the remaining profiles and a safe active profile id. */
export function removeCadWorkspaceProfile(profiles, id, activeId, { modelId = CAD_WORKSPACE_MODEL_ID, modelName = 'Model' } = {}) {
  const normalized = normalizeCadWorkspaceProfiles(profiles, { modelId, modelName });
  const normalizedId = profileId(id);
  const remaining = normalizedId && normalizedId !== modelId
    ? normalized.filter(profile => profile.id !== normalizedId)
    : normalized;
  const nextActiveId = remaining.some(profile => profile.id === activeId)
    ? activeId
    : modelId;
  return { profiles: remaining, activeId: nextActiveId };
}
