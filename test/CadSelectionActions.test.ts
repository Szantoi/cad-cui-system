import { describe, expect, it } from 'vitest';
import { matchesCadSelection, normalizeCadSelection, normalizeCadSelectionRule } from '../src/index';

describe('CAD selection action rules', () => {
  it('normalizes the transient host snapshot without engine objects', () => {
    const selection = normalizeCadSelection({
      ids: ['Line-01', 'line-01', '', 'Arc-02'],
      entityTypes: ['Line', 'ARC', 'line'],
      traits: ['Editable', 'Planar', 'editable'],
      source: ' data-grid '
    });

    expect(selection).toEqual({
      ids: ['Line-01', 'line-01', 'Arc-02'],
      entityTypes: ['line', 'arc'],
      traits: ['editable', 'planar'],
      source: 'data-grid',
      meta: undefined
    });
  });

  it('requires every selected entity to support a contextual action by default', () => {
    const rule = normalizeCadSelectionRule({
      count: 'any',
      entityTypes: ['line', 'arc'],
      traits: ['editable', 'planar']
    });

    expect(matchesCadSelection(rule, {
      ids: ['line-01', 'arc-02'],
      entityTypes: ['line', 'arc'],
      traits: ['editable', 'planar']
    })).toMatchObject({ matches: true, reason: '' });

    expect(matchesCadSelection(rule, {
      ids: ['line-01', 'block-03'],
      entityTypes: ['line', 'block'],
      traits: ['editable']
    })).toMatchObject({ matches: false, reason: 'ENTITY_TYPE_MISMATCH' });
  });

  it('reports why a selection-only command is unavailable', () => {
    const rule = { count: 'one' as const, entityTypes: ['block'], traits: ['editable'] };
    expect(matchesCadSelection(rule, { ids: [], entityTypes: [], traits: [] })).toMatchObject({
      matches: false,
      reason: 'SELECTION_REQUIRED'
    });
    expect(matchesCadSelection(rule, {
      ids: ['dimension-01'],
      entityTypes: ['dimension'],
      traits: ['locked']
    })).toMatchObject({
      matches: false,
      reason: 'ENTITY_TYPE_MISMATCH'
    });
  });
});
