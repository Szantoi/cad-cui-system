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

- [ ] Add optional contextual ribbon groups for zero / one / many selected
      entities, driven entirely by host state.
- [ ] Add a reusable viewport coordinate-system control (UCS selector plus
      lock/reset actions) that complements the existing `CadUcsIndicator`.
- [ ] Add a reusable named-view manager with create, restore, rename and
      protected-view callbacks.

## Quality and delivery

- [ ] Perform manual visual QA of the playground at wide, tablet and narrow
      viewport widths before publishing a release.
- [ ] Add a release checklist or changeset flow if the package is prepared for
      external publishing.
- [ ] Commit the reviewed project-tracking documents (`PROJECT_MEMORY.md`,
      `PROJECT_STATE.md`, `TODO.md`) with their README links.
