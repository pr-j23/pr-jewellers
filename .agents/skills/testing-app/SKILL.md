---
name: testing-pr-jewellers-responsive-grids
description: Verify public product-grid layout changes at explicit CSS breakpoints using real backend data.
---

# Runtime setup
- Public homepage and catalog browsing requires no authentication; products load from the backend configured in `src/services/apiConfig.ts`. Do not invent product records when the backend is unavailable.
- Put the installed NVM Node bin directory on PATH if npm is missing, then run `npm run dev -- --host 0.0.0.0` from the repo. Vite normally serves port 5173.
- Use Chrome responsive emulation with explicit CSS dimensions for breakpoint checks; a maximized physical window does not guarantee a particular CSS viewport width.
- Validate widths with `innerWidth`; pair screenshots with read-only `gridTemplateColumns` and card bounding boxes to distinguish actual occupied columns from an empty trailing track.
- On catalog pages, select the grid containing product `h3` elements rather than the first `.grid`, since the filter bar also uses a grid class.
- Use the homepage CTA to reach the catalog at the same width. Verify narrower breakpoint regressions independently.

## Devin Secrets Needed
None for public catalog browsing. Avoid modifying real backend records for read-only layout tests.
