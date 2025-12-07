# Dropdown Hierarchy Rework

This note captures how the shared `Dropdown` component now powers both the legacy flat select and the new multi-level category picker.

## Data Inputs

- **Flat mode** (default): pass `options`, `initialOption`, `searchable`, etc. Behaviour is unchanged.
- **Hierarchical mode**: supply the `hierarchicalData` prop with
  - `parents`: ordered list of top-level categories (excluding `all`)
  - `subCategoryMap`: parent slug → child array, used to build flyouts
  - `searchIndex`: flattened `{ value, label, rawLabel, parentSlug, parentName, type, searchTerms }` for contextual search
  - `labelLookup`: slug → metadata; enables `Parent › Child` labeling and quick slug-to-meta resolution.

`selectedValue` is also required in hierarchical mode so the dropdown can render the currently active parent/child label.

## Rendering Flow

1. **Base button**: identical styling for both modes. Label shows the selected item (e.g., `Necklaces › Pendants`).
2. **Wrapper sizing**: parent list uses a natural width (`min-w-[12rem]`); the flyout is positioned absolutely to the right (`w-56`, `z-30`) and the wrapper uses `overflow-visible` so the panel is never clipped.
3. **Search**:
   - Typing filters over `searchIndex`, allowing child hits to bubble up with parent context.
   - Selecting from search calls `handleSelection` with normalized `{ value, label }` just like flat mode.
4. **Hover / Flyout**:
   - Parent rows display a chevron only when subcategories exist.
   - Hovering a parent toggles `hoveredParentSlug`; the corresponding child list renders as a separate card to the right.
   - Parents without children act as immediate selectable rows; no flyout is shown.
5. **Hover lock**:
   - Moving the mouse between parent list and child panel used to collapse the flyout. We now defer resetting the hover state via a short timeout (`hoverTimeoutRef`). Entering either column cancels the timeout; leaving the entire dropdown triggers the reset. This mimics standard mega-menu UX and keeps the panel open while traversing.
6. **Accessibility / cleanup**:
   - Outside clicks still close the dropdown.
   - The hover timeout is cleared on unmount to avoid lingering timers.

## Integration Notes

- `ProductFilter` passes the hierarchical props derived from `src/mockData/index.js` (see `topLevelCategories`, `subCategoryMap`, etc.).
- Other consumers can continue using flat mode; they simply omit `hierarchicalData` and `selectedValue`.
- The component remains responsible for rendering only; filtering logic lives in `useProducts`, which now understands parent slugs map to their children.

### Future Enhancements

- Keyboard navigation for the flyout (aria menus) to match hover UX.
- Optional delay before opening the flyout for steadier cursor movement.
- Sharing this helper as a dedicated `CategoryDropdown` wrapper if more complex behavior is needed without impacting the base dropdown API.

