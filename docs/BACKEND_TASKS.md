# Backend Tasks — `pr-jewellers-api`

Tracking file for the backend work needed to complete the Mailgun secret-exposure fix.
This file lives in the frontend repo for convenience — **move it to `pr-jewellers-api`** and keep it updated there.

> Context: the frontend previously called `api.mailgun.net` directly from the browser using
> `VITE_MAILGUN_*` env vars, which are inlined into the client bundle and therefore public.
> The frontend has been changed (`pr-jewellers` PR #94) to POST the contact form to the backend
> instead. The backend must now hold the Mailgun secret and make the email call server-side.

## Frontend contract (already implemented on `pr-jewellers`)

- The frontend POSTs to `${API_CONFIG.hostUrl}/contact` — resolved from
  `src/services/apiConfig.ts` (`hostUrl: 'https://backend-server.pavanjewellers.in'`).
- Method: `POST`
- `Content-Type: application/json`
- Body: `{ "name": string, "email": string, "message": string }`
- On success the frontend uses `response.data` (any JSON is fine; a `{ success: true }` is enough).
- On failure it reads `response.data.message` for the toast text, so return
  `{ "message": "<reason>" }` with a non-2xx status on errors.

> ⚠️ If you choose a different route than `/contact`, update the URL in
> `src/services/contactApi.ts` on the frontend to match.

## ⬜ To do

### 1. Add the contact endpoint

- [ ] Implement `POST /contact` accepting JSON `{ name, email, message }`.
- [ ] Validate all three fields are present and non-empty; return `400` with `{ message }` otherwise.
- [ ] Read Mailgun config from **server** env vars (NOT prefixed `VITE_`):
  - `MAILGUN_API_KEY`
  - `MAILGUN_DOMAIN_NAME`
  - `MAILGUN_SENDING_MAIL`
  - the store recipient email (e.g. `STORE_CONTACT_EMAIL`)
- [ ] Call Mailgun `POST https://api.mailgun.net/v3/${MAILGUN_DOMAIN_NAME}/messages` with
  HTTP Basic auth (`username: 'api'`, `password: MAILGUN_API_KEY`), form-encoded body:
  - `from` = `MAILGUN_SENDING_MAIL`
  - `to` = store recipient email
  - `subject` = `Contact Form Submission`
  - `text` = `message`
  - `reply-to` = `email`
- [ ] Return `{ success: true }` (2xx) on success; `{ message }` (non-2xx) on failure.

### 2. Security & config

- [ ] **Rotate the existing Mailgun key** — the old key is already exposed in previously
  deployed frontend bundles and must be considered compromised.
- [ ] Store the new key + domain + sending mail as server env vars / secrets on the backend host.
- [ ] Configure **CORS** to allow the frontend origin(s) (production + Cloudflare Pages previews).
- [ ] Consider spam/abuse protection on this now-public endpoint (rate limiting and/or a
  Cloudflare Turnstile / captcha check). Not required for the fix, but recommended.

### 3. Verification

- [ ] Unit/integration test the endpoint (valid payload → email sent; missing fields → 400).
- [ ] End-to-end: submit the contact form from a frontend preview deploy; confirm the email
  arrives and the browser network request goes to `/contact` (not `api.mailgun.net`) with
  no Mailgun credentials in the payload.

## Coordination

- Deploy the backend endpoint **before** merging/deploying `pr-jewellers` PR #94 to production,
  otherwise the contact form will break (the frontend no longer talks to Mailgun directly).
- After the frontend is deployed, remove the `VITE_MAILGUN_*` build vars from the frontend's
  Cloudflare Pages settings.
