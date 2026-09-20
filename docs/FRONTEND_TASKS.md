# Frontend Tasks — `pr-jewellers`

Tracking file for the `fix/pr-1-bug-fixes` work and follow-ups. Branch HEAD at last update: `87e2e42`.

## ✅ Completed (committed & CI-green)

### Bug fixes

- **Price sort fix** — shared `computeProductPrice` helper in `src/utils/pricing.ts`; sorting accounts for weight × metal rate + making charges, not just `fixed_price`. Wired via `src/hooks/useProducts.ts` and `src/components/products/ProductGrid.tsx`; `src/components/products/ProductCard.tsx` reuses it.
- **Number input handling** — `ProductFormValues` (string-based number fields) in `src/hooks/useProductForm.ts`, with `formValuesToProduct` converting to numbers on submit. Updated `src/components/UpdateRecordsForm.tsx`, `src/components/shared/ImageUploader.tsx`, `src/utils/productValidation.ts`, `src/utils/categoryHelpers.ts`.
- **AddProduct navigate-in-render fix** — `<Navigate to="/" replace />` instead of `navigate('/')` during render in `src/pages/AddProduct.tsx`.
- **Health check improvements** — removed auto-run on mount, reset `error` on each check (`src/hooks/useProductForm.ts`); button green only on `status === 'success'`, red on error (`src/pages/AddProduct.tsx`).
- **WebSocket reconnect fix** — `isActive` guard + reset `isReconnecting` after a reconnect attempt in `src/hooks/useWebSocket.ts`.
- **Search null-description crash fix** — guarded `product.description` with `?? ''` in `src/hooks/useProducts.ts`.
- **`process.env` cleanup** — removed committed `process.env` file, added to `.gitignore`.
- **Metal prices memo stabilization** — stable `{ silver, gold }` object in `src/components/products/ProductGrid.tsx` so the sort memo doesn't churn on every price tick.

### Security fix (frontend side)

- **Mailgun key no longer shipped to the browser** — `src/services/contactApi.ts` now POSTs `{ name, email, message }` as JSON to `${API_CONFIG.hostUrl}/contact` (`src/services/apiConfig.ts`) instead of calling `api.mailgun.net` directly with `VITE_MAILGUN_*` secrets. Removed the `VITE_MAILGUN_*` declarations from `src/types/env.d.ts`. `src/pages/Contact.tsx` unchanged (same `sendMessage` signature).

### Refactor & dead-code cleanup

- Renamed `src/utils/mockData.ts` → `src/utils/categories.ts`; split form option arrays into `src/utils/formOptions.ts`; updated all imports and the `vi.mock` path in `src/utils/__tests__/categoryHelpers.test.ts`.
- Removed unused hooks: `src/hooks/useAPI.ts`, `src/hooks/useForm.ts`, `src/hooks/useImageUpload.ts`.
- Removed unused `src/redux/reducers/cartSlice.ts` and its wiring in `src/redux/reducers/rootReducer.ts`.
- Removed unused Redux actions (`setProducts`/`setLoading`/`setError`) and selectors (`selectProductById`/`selectProductsByCategory`) plus the orphaned `matchesCategorySlug` import in `src/redux/reducers/productsSlice.ts`.
- Removed unused utils `sortProducts` and `toSentenceCase` from `src/utils/index.ts`.
- Added `.gitattributes` to normalize line endings to LF.

**Verification:** `npm run ci:verify` (lint + typecheck + tests) passes; all 11 tests green. No remaining references to `VITE_MAILGUN` / `api.mailgun.net` in `src/`.

## ⚠️ Blocking before merge/deploy (Mailgun fix depends on backend)

- [ ] Backend `POST /contact` endpoint must be live — see `pr-jewellers-api` (BACKEND_TASKS.md).
- [ ] Confirm the route path and body shape match `src/services/contactApi.ts:13` (currently `${API_CONFIG.hostUrl}/contact`, JSON `{ name, email, message }`). Adjust the URL if the backend differs.
- [ ] Delete the `VITE_MAILGUN_*` build vars from the frontend's Cloudflare Pages settings.
- [ ] Do **not** merge to production before the backend endpoint is deployed, or the contact form will break.
- [ ] End-to-end test: submit the contact form on a preview deploy; confirm the request hits `/contact` (not `api.mailgun.net`) and no credentials appear in the payload/bundle.

## ⏭️ Follow-up PRs (not started)

### Small / low-risk

- [ ] `src/context/GlobalContext.tsx` (37 lines) — collapse to an inline `useLocation()` check in `src/App.tsx`; remove the provider wrapper in `src/main.tsx`.
- [ ] `src/utils/axios.ts` no-op response interceptor + `handleHealthCheck` wrapper — **UNVERIFIED**, confirm they are truly no-ops before removing.

### Medium

- [ ] vitest upgrade (`^0.34.6` → current) — may allow deleting `scripts/run-vitest.mjs` crypto polyfill. Risk: test-config breakage; re-verify all tests.
- [ ] Split `src/components/shared/Dropdown.tsx` into `Dropdown` + `CategoryDropdown` (flat / searchable / hierarchical modes). No test coverage — regression risk.
- [ ] Consolidate `react-icons` and `lucide-react` to one library. Both are actively used across many files — this is a UI refactor with visual-diff risk, not a dead-dep removal.

### Large / high-risk

- [ ] Redux Saga → `createAsyncThunk` / RTK Query. Touches `src/redux/store.ts` (remove `createSagaMiddleware`, `thunk: false`), deletes `src/redux/sagas/rootSaga.ts` + `src/redux/sagas/productsSaga.ts`, rewrites fetch actions in `src/redux/reducers/productsSlice.ts`, updates all dispatch sites, removes the `redux-saga` dependency. Needs manual testing of product loading.

## ❌ Intentionally skipped

- Admin client-side auth (`src/utils/appConfig.ts`) — confirmed intentional; not changing.
