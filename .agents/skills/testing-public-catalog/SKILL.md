---
name: testing-pr-jewellers-catalog
description: Run public catalog browser tests against the real backend in pr-jewellers.
---

# Local setup
- From the repo, put the available NVM Node bin directory on PATH before running `npm run dev -- --host 0.0.0.0`; Vite normally serves http://localhost:5173.
- Public homepage, catalog, and categories require no login. Product reads use the backend configured in `src/services/apiConfig.ts`; do not invent records if it is unavailable.
- Header Category → Explore Collection opens a category-specific `/products/:slug` route. The catalog offers Category, Metal Type, and Sort By controls.
- Check responsive behavior with Chrome's device toolbar at explicit CSS dimensions. Desktop browser zoom can set a desired CSS width; verify `innerWidth` rather than assuming physical display resolution equals viewport width.
- For a keyboard CTA check, use Tab until the actual link has the visible focus outline, then Enter; hidden carousel controls may occur earlier in the tab order.

## Devin Secrets Needed
None for public catalog browsing. Do not use admin write actions or change real backend products to prepare a read-only test.
