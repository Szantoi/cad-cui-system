import { describe, expect, it } from 'vitest';
import {
  CAD_WORKSPACE_PRESET_ERROR_CODES,
  CAD_WORKSPACE_PRESET_SCHEMA,
  CAD_WORKSPACE_PRESET_VERSION,
  createCadWorkspacePreset,
  createCadWorkspacePresetSnapshot,
  exportCadWorkspacePreset,
  importCadWorkspacePreset,
  normalizeCadWorkspacePanelPreferences,
  normalizeCadWorkspacePreset,
  validateCadWorkspacePreset
} from '../src/index.js';

const PANEL_DECLARATIONS = [
  {
    id: 'tool-palette',
    label: 'Tool palette',
    defaultOpen: true,
    defaultDockZone: 'left',
    dockZones: ['left', 'right', 'bottom']
  },
  {
    id: 'layers',
    label: 'Layers',
    defaultOpen: true,
    defaultPlacement: 'dock',
    defaultDockZone: 'right',
    dockZones: ['left', 'right', 'bottom']
  }
];

const presetOptions = {
  panels: PANEL_DECLARATIONS,
  normalizePanelPreferences: normalizeCadWorkspacePanelPreferences
};

describe('CadWorkspacePreset', () => {
  it('creates a canonical, renderer-independent snapshot from live UI intent', () => {
    const circular = { retained: true };
    circular.self = circular;

    const snapshot = createCadWorkspacePresetSnapshot({
      id: ' Night shift / primary ',
      name: '  Night   shift  ',
      description: '  A focused drawing layout  ',
      savedAt: '2026-08-24T10:15:00+02:00',
      panelPreferences: {
        'tool-palette': {
          visible: false,
          mode: 'docked',
          zone: 'footer',
          hostPreference: 'preserve me'
        },
        layers: { open: true, placement: 'floating', dockZone: 'left' },
        unknownPanel: { open: true }
      },
      ui: {
        commandLineHeight: 216,
        focusMode: true,
        transient: undefined,
        circular
      },
      metadata: {
        author: 'CAD team',
        tags: ['office', undefined, 'night']
      }
    }, presetOptions);

    expect(snapshot).toEqual({
      schema: CAD_WORKSPACE_PRESET_SCHEMA,
      version: CAD_WORKSPACE_PRESET_VERSION,
      name: 'Night shift',
      panels: {
        'tool-palette': {
          dockZone: 'bottom',
          hostPreference: 'preserve me',
          open: false,
          placement: 'dock'
        },
        layers: { dockZone: 'left', open: true, placement: 'float' }
      },
      settings: {
        circular: { retained: true },
        commandLineHeight: 216,
        focusMode: true
      },
      metadata: { author: 'CAD team', tags: ['office', null, 'night'] },
      id: 'night-shift-primary',
      description: 'A focused drawing layout',
      savedAt: '2026-08-24T08:15:00.000Z'
    });

    expect(createCadWorkspacePreset({ name: 'Alias' })).toEqual(normalizeCadWorkspacePreset({ name: 'Alias' }));
  });

  it('exports stable portable JSON and imports the exact normalized snapshot', () => {
    const source = {
      id: 'construction-team',
      name: 'Construction team',
      savedAt: '2026-08-24T08:15:00.000Z',
      preferences: {
        'tool-palette': { open: true, placement: 'dock', dockZone: 'left' },
        layers: { open: false, placement: 'dock', dockZone: 'bottom' }
      },
      state: {
        commandLineHeight: 184,
        dockModes: { left: 'rail', right: 'open' }
      }
    };

    const first = exportCadWorkspacePreset(source, presetOptions);
    const second = exportCadWorkspacePreset(source, presetOptions);

    expect(first).toMatchObject({ ok: true, errors: [] });
    expect(first.json).toBe(second.json);
    expect(first.json).toContain('\n  "schema": "cad-cui-workspace-preset"');

    const imported = importCadWorkspacePreset(first.json, presetOptions);
    expect(imported).toEqual({ ok: true, preset: first.preset, errors: [] });
    expect(JSON.parse(first.json)).toEqual(first.preset);
  });

  it('returns structured errors for invalid JSON, incompatible versions, malformed fields, and unsafe keys', () => {
    expect(importCadWorkspacePreset('{"schema":')).toMatchObject({
      ok: false,
      errors: [{ code: CAD_WORKSPACE_PRESET_ERROR_CODES.INVALID_JSON }]
    });

    const incompatible = importCadWorkspacePreset(JSON.stringify({
      schema: CAD_WORKSPACE_PRESET_SCHEMA,
      version: CAD_WORKSPACE_PRESET_VERSION + 1,
      name: 'Future workspace'
    }));
    expect(incompatible).toMatchObject({
      ok: false,
      errors: [{ code: CAD_WORKSPACE_PRESET_ERROR_CODES.UNSUPPORTED_VERSION }]
    });

    const malformed = validateCadWorkspacePreset({
      schema: CAD_WORKSPACE_PRESET_SCHEMA,
      version: CAD_WORKSPACE_PRESET_VERSION,
      name: 'Malformed workspace',
      panels: []
    });
    expect(malformed).toMatchObject({
      ok: false,
      errors: [{ code: CAD_WORKSPACE_PRESET_ERROR_CODES.INVALID_FIELD, path: '$.panels' }]
    });

    const unsafe = importCadWorkspacePreset(`{
      "schema": "${CAD_WORKSPACE_PRESET_SCHEMA}",
      "version": ${CAD_WORKSPACE_PRESET_VERSION},
      "name": "Unsafe workspace",
      "settings": { "__proto__": { "polluted": true } }
    }`);
    expect(unsafe).toMatchObject({
      ok: false,
      errors: [{ code: CAD_WORKSPACE_PRESET_ERROR_CODES.UNSAFE_KEY, path: '$.settings.__proto__' }]
    });
  });

  it('accepts an already parsed JSON object for file transports that parse outside the UI kit', () => {
    const result = importCadWorkspacePreset({
      schema: CAD_WORKSPACE_PRESET_SCHEMA,
      version: CAD_WORKSPACE_PRESET_VERSION,
      name: 'Parsed preset',
      panels: {},
      settings: { commandLineHeight: 156 },
      metadata: {}
    });

    expect(result).toEqual({
      ok: true,
      preset: {
        schema: CAD_WORKSPACE_PRESET_SCHEMA,
        version: CAD_WORKSPACE_PRESET_VERSION,
        name: 'Parsed preset',
        panels: {},
        settings: { commandLineHeight: 156 },
        metadata: {}
      },
      errors: []
    });
  });
});
