# TODO — CAD CUI System

Keep this list focused on product work that is not already implemented. Move a
completed item to `PROJECT_STATE.md` rather than leaving it here.

## Next: command-system integration

- [ ] Add a small `CadCuiProvider` example to the interactive playground so
      the grouped runtime registry and `commandStates` can be explored beside
      the standalone `CadWorkspaceRibbon`.
- [ ] Add an adapter example showing how a host maps `CadSelectionSetPanel`
      records to real drawing-entity IDs without coupling the component to a
      CAD engine.
- [ ] Exercise runtime `commandStates` with a `Map` and resolver-function test
      case in addition to the existing object-form coverage.

## Next: workspace depth

- [ ] Add visual-regression fixtures for every panel in its narrowest allowed
      left/right/bottom dock, including a relocated data grid, an expanded
      record-card view, and movable/collapsed navigation, selection-summary,
      and command-console viewport overlays.
- [ ] Add an optional third-party docking-library adapter example for mapping
      `CadWorkspacePanelManager` `{ open, placement, dockZone? }` intents;
      the built-in sandbox already demonstrates the engine-free multi-zone
      host integration.
- [ ] Add a large-catalogue host example for optionally persisting or scoping a
      panel-list `filter`; the built-in controlled/uncontrolled search remains
      a transient view of labels, descriptions, visibility, placement, and
      dock zones.
- [ ] Add a storage-adapter reference for synchronizing versioned
      `CadWorkspacePreset` records through a server or desktop profile, while
      preserving the current pure codec and controlled manager contract.
- [ ] Add a role- or project-default preset example for first-run hosts while
      retaining the manager's localizable, presentation-only first-save guide
      whenever no default preset is available.
- [ ] Add an explicit v1-to-next-version preset migration example, including
      a host policy for unsupported imported schemas and future fields.
- [ ] Add optional contextual ribbon groups for zero / one / many selected
      entities, driven entirely by host state.
- [ ] Add a reusable viewport coordinate-system control (UCS selector plus
      lock/reset actions) that complements the existing `CadUcsIndicator`.
- [ ] Add a reusable named-view manager with create, restore, rename and
      protected-view callbacks.

## Quality and delivery

- [x] Add a zero-warning ESLint gate, V8 coverage reporting, and GitHub Actions
      checks for lint, coverage, builds, and current `dist/` artifacts.
- [ ] Set coverage thresholds once the reported baseline has stabilized across
      the next feature increments.
- [ ] Add a release checklist or changeset flow if the package is prepared for
      external publishing.
- [ ] Commit the reviewed project-tracking documents (`PROJECT_MEMORY.md`,
      `PROJECT_STATE.md`, `TODO.md`) with their README links.
