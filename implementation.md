# Implementation Plan — AI Cognitive Companion for Elderly Dementia Patients (NER)

> Status: Hackathon MVP foundation document. Phased execution plan — no code written yet.
> Work proceeds one page/feature at a time per user instruction; this plan sequences that work.

## Phase 0 — Project Setup

| Task ID | Description | Priority | Dependencies | Expected Result | Status |
|---|---|---|---|---|---|
| P0-T1 | Initialize git repository | P0 | None | Repo initialized with `.gitignore` | Not Started |
| P0-T2 | Scaffold frontend (React + Vite + Tailwind) | P0 | P0-T1 | `frontend/` app runs locally (`npm run dev`) | Done — `frontend/` created via `npm create vite (react)`, Tailwind v3 + PostCSS + Autoprefixer configured, `react-router-dom` added |
| P0-T3 | Scaffold backend (Node.js + Express) | P0 | P0-T1 | `backend/` app runs locally with a health-check endpoint | Done — `backend/` created, Express + cors, `GET /api/health` returns `{status:"ok"}` |
| P0-T4 | Set up database (SQLite via Prisma or Knex) | P0 | P0-T3 | DB file created, ORM connected, migration tooling working | Done, with a substitution — see note below |
| P0-T5 | Define initial DB schema: `users`, `patients`, `family_members`, `routines`, `game_sessions`, `game_results`, `reminders` | P0 | P0-T4 | Migration applied, tables exist | Partially done — only `users` exists so far (needed for auth); the rest are created as each feature needs them, to avoid building unused schema ahead of time |
| P0-T6 | Configure environment variables (`.env`) for DB path, JWT secret, Anthropic API key | P0 | P0-T3 | `.env.example` committed, secrets not committed | Done — `backend/.env.example` and `frontend/.env.example`; real `.env` files gitignored |
| P0-T7 | Seed script: create demo users (`aiton`, `caregiver`) + sample family members/routines | P0 | P0-T5 | Running seed script populates demo data | Done for users (`aiton`/`aiton123` patient, `caregiver`/`caregiver123` caregiver) — seeded automatically on backend boot in `backend/src/db.js`, idempotent. Family/routine seed data still lives as mock data in `backend/src/routes/caregiver.js` (see C-T8 note) |

**Note on P0-T4 (database engine):** `architecture.md` calls for SQLite via a query builder/ORM. `better-sqlite3` (the natural choice) segfaults in this dev environment (native binding issue). Substituted Node's built-in `node:sqlite` (`DatabaseSync`), which is dependency-free and works reliably here — same SQLite file-based storage, just accessed via Node's native module instead of a third-party binding or ORM. No Prisma/Knex layer was added on top since the schema is currently one table; this can be revisited if the schema grows enough to want a query builder.

## Phase 1 — Foundation

| Task ID | Description | Priority | Dependencies | Expected Result | Status |
|---|---|---|---|---|---|
| F-T1 | Implement `POST /api/auth/login` (credential check, JWT issuance) | P0 | P0-T7 | Valid login returns token; invalid returns 401 | Done — `backend/src/routes/auth.js`; also added `GET /api/auth/me` (not currently used by the frontend, kept for future use) |
| F-T2 | Implement auth middleware protecting non-login routes | P0 | F-T1 | Requests without valid token receive 401 | Done — `backend/src/middleware/auth.js` (`requireAuth` + `requireRole(role)`); applied to `/api/caregiver/*` and `/api/patient/*` |
| F-T3 | Build application shell (routing, layout, role-based route gating for Patient vs Caregiver) | P0 | P0-T2, F-T1 | Navigating to a protected route without login redirects to `/login` | Done — see **Authentication & Routing** section below for full detail |
| F-T4 | Apply global design system (Tailwind theme: colors, fonts, spacing, base components: Button, Card, Input) | P0 | P0-T2 | Reusable component library exists per design.md §3 | Done — `ui/Button.jsx`, `ui/Toast.jsx`; extended with `positive`/`caution`/`concern` semantic colors for the caregiver dashboard (see design.md) |
| F-T4b | Implement Marketing Landing Page (`/`) — editorial public page explaining SMRITI, with an interactive senior/caregiver gateway preview | P1 | P0-T2 | Page renders per supplied HTML/CSS reference, built as React components on Tailwind, verified in build + browser | Done |
| F-T5 | Implement Login page (per design.md) | P0 | F-T1, F-T3, F-T4 | Aiton and caregiver can log in and land on correct home route | Done — `pages/LoginPage.jsx`; simple username/password form (no OAuth/MFA), reads `?redirect=` query param |

## Phase 2 — Core MVP

| Task ID | Description | Priority | Dependencies | Expected Result | Status |
|---|---|---|---|---|---|
| C-T1 | Backend: endpoint to fetch patient memory data (family members, routines) for game generation context | P0 | P0-T5 | `GET /api/patients/:id/context` returns structured data | Not Started |
| C-T2 | Backend: game generation endpoint calling Claude API with patient context to produce a "who is this person" game | P0 | C-T1 | `POST /api/games/generate` returns valid structured game JSON | Not Started |
| C-T3 | Backend: rule-based difficulty adjustment logic based on recent results | P0 | P0-T5 | Difficulty tier changes correctly given a sequence of results | Not Started |
| C-T4 | Backend: endpoints to record game results (`POST /api/sessions`, `POST /api/results`) | P0 | P0-T5 | Results persist correctly, linked to patient | Not Started |
| C-T5 | Frontend: Patient Home page | P0 | F-T3, F-T4 | Shows today's activity, launches game | Done — RecognitionGame and MemoryOfTheDay now use real data from `GET /api/patient/memories` (see **Patient Recognition Game (Real Data)** below). Remaining sections (memory ribbon, daily rhythm, rituals, contacts, voice prompts) are still seeded/mock in `frontend/src/data/patientMock.js` — out of scope for this task |
| C-T6 | Frontend: Game Play screen (question rendering, answer capture) | P0 | C-T2, F-T4 | Displays generated game, captures answers, shows next question | Partially done — the "Who is this?" recognition card is a fully interactive UI (select → confirm → correct/incorrect feedback) now driven by real caregiver-created family members instead of a hardcoded prompt, with deterministic (not AI) target/choice selection. Still no AI-generated question content (C-T2) and no dedicated Game Play screen/session flow |
| C-T7 | Frontend: Game Result screen | P0 | C-T4, F-T4 | Shows encouraging summary after session | Awaiting page spec |
| C-T8 | Backend: caregiver dashboard data endpoint (session counts, correct/incorrect ratio, simple trend, alerts) | P0 | C-T4 | `GET /api/caregiver/dashboard` returns aggregated stats | Partially real now — `memories` is real, DB-backed data (see **Add Memory Persistence** below); `todayStats`, `attentionItems`, `routineTimeline`, `aiInsight`, `cognitiveTrends` remain seeded/mock (not in scope for this task) since `game_sessions`/`routines` tables still don't exist |
| C-T9 | Frontend: Caregiver Dashboard page | P0 | C-T8, F-T4 | Displays stats and alerts correctly | Done — see **Caregiver Dashboard** and **Add Memory Persistence** sections below |
| C-T10 | Frontend: Caregiver Patient Data management page (add/edit family members, routines) | P1 | P0-T5, F-T4 | Caregiver can manage data feeding the games | Awaiting page spec |
| C-T11 | Reminders feature (backend + patient view + caregiver management) | P1 | P0-T5, F-T4 | Reminders visible to patient, manageable by caregiver | Awaiting page spec |

## Phase 3 — AI / Intelligence

| Task ID | Description | Priority | Dependencies | Expected Result | Status |
|---|---|---|---|---|---|
| AI-T1 | Design and test prompt template for game generation (structured JSON output, validated schema) | P0 | C-T1 | Reliable, parseable JSON returned across varied patient data | Not Started |
| AI-T2 | Add fallback/default game content if AI call fails or times out | P0 | AI-T1 | Demo never breaks due to AI outage; falls back gracefully | Not Started |
| AI-T3 | Prompt template for caregiver-facing plain-language performance summary | P1 | C-T8 | Caregiver dashboard shows an AI-generated summary sentence | Not Started |
| AI-T4 | Voice output (TTS) integration via Web Speech API on game question screens | P0 | C-T6 | Question is read aloud automatically or on button tap | Not Started |
| AI-T5 | Voice input (STT) integration via Web Speech API for answering | P1 | C-T6 | Aiton can answer by speaking; transcribed and matched to an option | Not Started |

## Phase 4 — UI Polish

| Task ID | Description | Priority | Dependencies | Expected Result | Status |
|---|---|---|---|---|---|
| U-T1 | Responsive check across tablet/desktop breakpoints for all built pages | P0 | Relevant pages built | No layout breakage at target sizes | Not Started |
| U-T2 | Implement loading states across async actions (game generation, dashboard fetch) | P0 | Relevant pages built | No blank screens during waits | Not Started |
| U-T3 | Implement error states (friendly messages, retry) | P0 | Relevant pages built | Errors never show raw technical detail to Aiton | Not Started |
| U-T4 | Implement empty states (no family members yet, no sessions yet) | P1 | Relevant pages built | Clear guidance shown instead of blank sections | Not Started |
| U-T5 | Add toasts for key confirmations (saved, back online/syncing) | P1 | Relevant pages built | Non-blocking feedback shown at right moments | Not Started |
| U-T6 | Visual pass: consistent spacing/typography/color across all pages per design.md | P1 | All P0 pages built | Consistent look and feel across the app | Not Started |

## Phase 5 — Testing

| Task ID | Description | Priority | Dependencies | Expected Result | Status |
|---|---|---|---|---|---|
| T-T1 | Manual test: full patient journey (login → play → result) | P0 | Phase 2 complete | Journey completes without errors | Not Started |
| T-T2 | Manual test: full caregiver journey (login → dashboard → patient data) | P0 | Phase 2 complete | Journey completes without errors | Not Started |
| T-T3 | Manual test: offline play + reconnect sync | P0 | Offline support implemented | Result recorded offline, synced correctly on reconnect, no duplicates | Not Started |
| T-T4 | Manual test: AI failure fallback | P0 | AI-T2 | Game still playable if AI call fails | Not Started |
| T-T5 | Cross-check acceptance criteria in requirements.md §9 | P0 | All above | Each acceptance criterion verified true | Not Started |

## Phase 6 — Deployment

| Task ID | Description | Priority | Dependencies | Expected Result | Status |
|---|---|---|---|---|---|
| D-T1 | Build production frontend bundle, served by Express backend | P0 | Phases 1–5 substantially complete | Single deployable artifact | Not Started |
| D-T2 | Deploy to chosen host (e.g., Render/Railway) with environment variables configured | P0 | D-T1 | App reachable via public URL | Not Started |
| D-T3 | Verify seeded demo data present in deployed environment | P0 | D-T2 | Aiton/caregiver login works in production | Not Started |
| D-T4 | Final smoke test of full demo flow on deployed URL | P0 | D-T3 | Demo flow works end-to-end on the live link | Not Started |

---

## Authentication & Routing (implemented with the Caregiver Dashboard)

**Backend** (`backend/`, Node.js + Express + `node:sqlite`):
- `users` table: `id, username, password_hash (bcrypt), role ('patient'|'caregiver'), display_name`. Seeded on boot: `aiton`/`aiton123` (patient), `caregiver`/`caregiver123` (caregiver, display name "Ban").
- `POST /api/auth/login` — checks credentials, returns a JWT (12h expiry) encoding `{id, username, role, displayName}`.
- `requireAuth` middleware — verifies the JWT from `Authorization: Bearer <token>`; `requireRole(role)` — 403s if the authenticated user's role doesn't match.
- `GET /api/caregiver/dashboard` — `requireAuth` + `requireRole('caregiver')`.
- `GET /api/patient/home` — `requireAuth` + `requireRole('patient')` (minimal placeholder endpoint, matches PatientHomePage).
- No OAuth, MFA, email verification, or password reset — matches requirements.md's explicit exclusions.

**Frontend** (`frontend/`, React + Vite):
- `context/AuthContext.jsx` — holds `{token, user}` in React state, persisted to `localStorage` under `smriti.auth`. On load, decodes the JWT payload (no re-fetch) and checks `exp`; expired/invalid tokens are dropped. Exposes `login(username, password)` and `logout()`.
- `components/auth/ProtectedRoute.jsx` — wraps a route element with a required `role`. Behavior: loading → spinner; unauthenticated → `<Navigate to="/login?redirect=<path>">`; authenticated but wrong role → `<Navigate to>` that role's own home (`/caregiver` or `/patient`); authenticated with matching role → renders the page.
- Routes (`App.jsx`): `/` (Landing, public), `/login` (public), `/caregiver` (protected, role `caregiver`, redirect-based via `ProtectedRoute`), `/patient` (**not** wrapped in `ProtectedRoute` — see **Patient Interface & Login Modal** below for why it uses a different auth pattern).
- `pages/LoginPage.jsx` — simple username/password form; reads `?redirect=`; demo credentials shown on the page for hackathon convenience. This is the caregiver login route; the patient never navigates here (see below).
- Landing page entry points into the caregiver flow (`Navbar`'s "ASHA / Care Portal", the gateway card's "View Caregiver Console" button, `FinalCTA`'s "Request Caregiver Access") all call the same `enterCaregiverApp()` — if already authenticated as caregiver, `navigate('/caregiver')` directly; otherwise `navigate('/login?redirect=/caregiver')`. The Dual Gateway section's own senior/caregiver preview toggle (scroll + demo screen swap) is unchanged and separate from this real navigation. The equivalent patient entry points (DualGateway's "Launch Tablet Simulation", `FinalCTA`'s "Launch SMRITI Tablet Mode") call `enterPatientApp()`, which just `navigate('/patient')` unconditionally — that page decides for itself whether to show its login modal.
- **Caregiver logout** (`CaregiverDashboardPage`): calls `logout()` then `window.location.assign('/')` — a full page reload rather than React Router's `navigate()`. This was a deliberate fix: `navigate()` right after clearing auth state races `ProtectedRoute`'s own auth-driven redirect (both fire from state updates in the same event handler), which was intermittently landing the user on `/login?redirect=/caregiver` instead of `/`. A full reload sidesteps the SPA race entirely and is fine for a logout action.

**Tests performed** (Playwright against the running dev servers, backend on :4000 / frontend on :5173):
1. Logged out → click "Caregiver" on landing → `/login?redirect=%2Fcaregiver` → log in → `/caregiver`. **Pass.**
2. Already authenticated as caregiver → click "Caregiver" on landing → goes straight to `/caregiver`, no login screen. **Pass.**
3. Direct visit to `/caregiver` while logged out → redirected to `/login?redirect=%2Fcaregiver` → log in → redirected back to `/caregiver` (destination preserved). **Pass.**
4. Log in as patient (`aiton`) → lands on `/patient` → manually visit `/caregiver` → redirected to `/patient`, dashboard never renders. **Pass.**
5. From the caregiver dashboard, click "Log out" → session cleared, lands on `/` → `/caregiver` is no longer reachable (redirects to `/login`). **Pass.**

Also verified: production build (`npm run build`) succeeds, `oxlint` passes (only pre-existing idiomatic warnings, e.g. "setState in effect" for data fetching), no console errors in-browser, and the dashboard renders correctly at both desktop (1400px) and mobile (390px) widths.

## Caregiver Dashboard

Implemented at `/caregiver` (`pages/CaregiverDashboardPage.jsx`), fetching its data from `GET /api/caregiver/dashboard` on mount, with loading and error+retry states.

**Components** (`components/caregiver/`): `CaregiverHeader` (patient switcher popover, offline/sync demo toggle, notification bell, logout), `PatientHero`, `TodayStats` (4 metric cards), `AttentionAlert` (amber alert card with a real "mark as reviewed" state — local only), `AiInsight` ("SMRITI Noticed" card), `RoutineTimeline` (daily schedule with a real "verify" resolve action on the missed item — local only), `TodayActivity`, `CognitiveTrends` (5 sparkline domains, 7d/30d toggle), `MemoryBank` (**now real, DB-backed** — see below), `OfflineProvenance`, `FloatingAddButton` + `AddMemoryModal` (**now real, DB-backed** — see below), `BottomNav` (mobile). Shared `ui/Toast.jsx` added to the design system for lightweight confirmations.

Multi-patient switching, "add person" onboarding, and the full patient profile drawer from the HTML reference are still toast-only — only Aiton exists as a real patient, and building out parallel fake patients is out of scope. Attention-alert review and routine-verify are also still local-only (explicitly out of scope for this task — see below).

## Add Memory Persistence (Caregiver Dashboard's "Add Memory")

Turned the previously fake "Save & Sync to Tablet" button into a real, end-to-end persisted feature: caregiver UI → `POST /api/caregiver/memories` → SQLite → `GET /api/caregiver/memories` (and the dashboard endpoint) → caregiver UI. This is the first genuinely persistent, non-mock feature in the app beyond login, and is the dependency the Patient recognition game will eventually need (a caregiver has to be able to record a real family member before the patient can be quizzed on them).

**Database** (`backend/src/db.js`) — two new tables, both referencing the existing `users` table (role='patient') rather than inventing a separate patient concept:
- `family_members`: `id`, `patient_id` (FK → `users.id`), `name`, `relationship`, `photo_url`, `created_at`, `updated_at`.
- `memories`: `id`, `patient_id` (FK → `users.id`), `family_member_id` (nullable FK → `family_members.id`), `type` (`photo`/`voice`/`place`/`song`, CHECK-constrained), `title`, `description`, `image_url`, `created_at`, `updated_at`.
- `PRAGMA foreign_keys = ON` added. Both tables use `CREATE TABLE IF NOT EXISTS`, so this is safe against both a fresh database and the existing dev `app.db` (verified — see Tests below).
- The 3 memories that used to be hardcoded in the dashboard's mock payload (Rina, Wooden Veranda Garden, Autumn Harvest Song) are now seeded as real rows on first boot (idempotent, same pattern as `seedUser`) — so the dashboard still looks populated out of the box, but everything in Memory Bank is now one real table, not a mix of fake + real.

**API** (`backend/src/routes/caregiver.js`), both `requireAuth` + `requireRole('caregiver')`:
- `POST /api/caregiver/memories` — body `{ type, title, description? }`. Validates `type` is one of the 4 allowed values, `title` is required/non-empty/≤200 chars after trimming, `description` is optional text ≤1000 chars. For `type: 'photo'`, upserts a matching `family_members` row (by name) and links `family_member_id`. Returns `201` with the full created record (joined with its family member, if any). All queries are parameterized (`db.prepare(...).run(?, ?, ...)`) — verified resistant to injection (see Tests).
- `GET /api/caregiver/memories` — returns all memories for the resolved patient, newest first, each joined with its family member's name/relationship.
- **Authorization model**: the patient a write applies to is *resolved server-side* (`SELECT id FROM users WHERE role='patient' LIMIT 1` — there's exactly one in this MVP), never taken from the client as the source of truth. If a request body names a different `patientId`, the server rejects it with `403` rather than silently using its own resolved patient — this is what "a caregiver can't write to an unauthorized patient" means concretely here, and it was verified with a forged `patientId: 999` (see Tests). This is simpler than a caregiver↔patient assignment table and correct for the current single-patient MVP; it would need revisiting if multi-patient caregiving is ever built.
- `GET /api/caregiver/dashboard`'s `memories` field now comes from the same `getMemoriesForPatient()` query instead of a hardcoded array — one source of truth for both endpoints.

**Frontend**:
- `api/client.js` — added `caregiverApi.createMemory(token, {type, title, description})` and `caregiverApi.getMemories(token)`.
- `AddMemoryModal.jsx` — rewritten to accept an `onSubmitMemory` async callback instead of a fire-and-forget `onSave`. Submission states: button shows a spinner + "Saving…" and the whole form (`<fieldset disabled>`) is inert while in flight; a guard (`if (isSubmitting) return`) blocks double-submit from a double-click or double-Enter; on success the form resets and the modal closes; on failure the modal **stays open**, shows the real error inline (`role="alert"`), and the caregiver can just fix the input and retry — nothing is silently swallowed or faked.
- `CaregiverDashboardPage.jsx` — `onSubmitMemory` calls `caregiverApi.createMemory`, then re-runs the existing `loadDashboard()` (rather than locally splicing the new item in) so the dashboard's `memories` list is always exactly what the database has, then shows the existing success toast.
- `MemoryBank.jsx` — updated to render the real field shape (`title`/`description`/`type`/`familyMemberName`/`familyMemberRelationship`/`createdAt`) instead of the old mock shape. Added an empty state ("No memories added yet…") for correctness on a hypothetical empty patient. Memories without a known local photo asset (i.e. anything a caregiver adds — there's no image upload yet) honestly render an icon tile rather than a fake photo.

**A real bug found and fixed along the way**: `FloatingAddButton` (the actual "Add Memory" trigger) was `z-30` while `BottomNav`'s full-width fixed bar was `z-40` — the nav bar sat on top of and completely swallowed clicks on the button at desktop widths. This pre-dates this task (from the original caregiver page build) but was only caught here because this task required actually clicking the button through real browser automation rather than just screenshotting the page. Fixed by raising the button to `z-50`. (`MemoryBank`'s "+ Add memory" text is a separate, pre-existing toast-only pointer to the real button — left as-is, out of scope.)

**Tests performed** (curl for the API/DB layer, Playwright driving the real browser UI for the end-to-end path — both against the running dev servers):
- `POST` with no token → `401`. `POST`/`GET` authenticated as the patient (`aiton`) → `403`.
- `POST` as caregiver with valid data → `201`, full record returned, and independently confirmed on disk by opening `app.db` directly with a separate read-only connection (not just re-querying through the same server) — the row was really there.
- `POST` with `patientId: 999` → `403`, and confirmed no row was inserted (count unchanged).
- `POST` with missing/whitespace-only `title` → `400`; invalid `type` → `400`.
- SQL injection payload in `title` (`Robert'); DROP TABLE memories;--`) → stored as inert literal text, table intact, row count incremented normally — confirms parameterized queries hold.
- Full UI-driven flow: log in as caregiver through the real login form → open the Add Memory modal via the actual floating button → fill in a realistic family photo entry → submit → button shows "Saving…" and is disabled → modal closes → success toast appears → the new memory is visible in Memory Bank **without a manual refresh** → **refreshed the browser** → memory still there → fetched `GET /api/caregiver/memories` directly from the page's own session token and confirmed the new memory is in the response with the correct `patientId`.
- Failure path: intercepted the `POST` to return a `500`, confirmed the modal shows the real error text, stays open, does **not** show the success toast, and does **not** close; then removed the interception and retried the same submission, which succeeded normally.
- Regression check: landing page, login page, and patient page all still return `200` and render; full `npm run build` and `oxlint` both clean (only the same pre-existing idiomatic warnings from before this task, unrelated to these files).
- Test data created during verification was deleted afterward — the dev database is back to exactly the 3 seeded memories.

**Explicitly not done in this task** (per the brief's scope restrictions): attention-alert "mark as reviewed" and routine "verify" persistence, patient switching, image upload for memories (`image_url`/`photo_url` columns exist but nothing writes to them yet), the Patient recognition game consuming this data, and anything AI/voice-related.

## Memory/Family-Member Photo Upload

Added real local image upload to the Add Memory feature — the `image_url`/`photo_url` columns from the previous task went from always-`null` to actually storing a path to a real file on disk, end to end: caregiver upload → local disk → DB path → Memory Bank → Patient RecognitionGame.

**Backend**:
- `middleware/upload.js` (new) — `multer` (disk storage) config. Files land in `backend/uploads/memories/`, named `crypto.randomUUID() + extension` — the extension is chosen server-side from the **detected MIME type** (a whitelist of `image/jpeg`/`image/png`/`image/webp` → `.jpg`/`.png`/`.webp`), never from the caregiver's original filename, so renaming a file can't smuggle a different type through and nothing path-traversal-shaped ever reaches disk. 5MB size cap. Exports `deleteUploadedFile(url)`, which re-derives the filename from the stored path, resolves it back under the upload directory, and only unlinks if that resolution actually stays inside it — deleting via a stored value can't be tricked into touching an arbitrary file.
- `server.js` — added `app.use('/uploads', express.static(...))` to serve them; only the DB-stored relative path is ever trusted, not client input.
- **Where the image is stored — decided per memory `type`**, matching the existing photo/place/voice/song model rather than adding new columns: for `type: 'photo'` the image belongs to the *person*, so it's written to `family_members.photo_url` (reusable across every memory that references that family member); for every other type there's no family member, so it's written directly to `memories.image_url`. `models/memories.js`'s shared `MEMORY_SELECT` now also joins `family_members.photo_url` as `familyMemberPhotoUrl`, so both the caregiver and patient endpoints return it without duplicating the join logic.
- **New endpoint**: `PATCH /api/caregiver/memories/:id` (`requireAuth` + `requireRole('caregiver')`) — edits title/description/type, and for photo memories the family member's name/relationship, plus the image (replace or `removeImage: true` to clear). First loads the memory via the new `getMemoryOwnedByPatient(id, patientId)` — resolving the patient the same server-side way `POST` already did — and 404s if it doesn't belong to them, so the id in the URL can't be used to touch another patient's row even in a future multi-patient setup. `patientId` in the request body is read and explicitly discarded, never applied. Replacing or removing an image deletes the old physical file via `deleteUploadedFile`.
- `POST /api/caregiver/memories` extended: the modal now collects the family member's name and relationship as fields **separate from the memory's own title** (previously the memory `title` field was overloaded to hold the person's name) — both were already separate columns (`family_members.name` vs `memories.title`), so this is a client/route contract change, not a schema change. Upsert-by-name logic for the family member is unchanged from the previous task, just extended to also carry the photo and relationship.
- Both routes accept the request as either `multipart/form-data` (when an image is attached) or plain JSON (when it isn't) — the existing `express.json()` middleware only engages for JSON bodies, and multer's `upload.single('image')` only engages for multipart ones, so neither interferes with the other and the old JSON-only contract still works unchanged for image-less requests.

**Frontend**:
- `api/client.js` — `request()` now detects a `FormData` body and skips setting `Content-Type` itself (so the browser can set the multipart boundary); added `resolveAssetUrl(path)` (prefixes the backend origin, since uploaded files are served by the backend, not the Vite dev server) and `caregiverApi.updateMemory`.
- `AddMemoryModal.jsx` — rewritten to also serve as an **edit** form (`editingMemory` prop; parent remounts it via a bumped `key` so its internal state always starts fresh) with: a file picker + live preview (via `URL.createObjectURL`, revoked on change/unmount so it doesn't leak), "Change photo"/"Remove photo" actions, and separate "Family Member's Name"/"Relationship" fields shown only for the `photo` type, alongside the (now always-present, separate) "Memory Title". Client-side type/size validation gives immediate feedback; the server-side check remains the actual source of truth.
- `MemoryBank.jsx` — thumbnails now resolve the real uploaded image (family member photo for `photo` type, memory image otherwise) via `resolveAssetUrl`, falling back to the same known-name demo assets as before and then to the icon tile; added a per-memory "Edit" button wired to open the modal in edit mode.
- `RecognitionGame.jsx` and `MemoryOfTheDay.jsx` (Patient side) — both now resolve `member.photoUrl` / `memory.imageUrl` / `memory.familyMemberPhotoUrl` through `resolveAssetUrl` instead of only ever falling back to the hardcoded known-name assets, so a caregiver-uploaded photo actually appears for the patient, not just an icon.

**Tests performed** (curl for validation/security, Playwright for the real end-to-end UI flow):
- Created a photo memory with a real uploaded PNG via `curl -F` → `201`, file confirmed on disk with a UUID filename, and confirmed served correctly (`Content-Type: image/png`, correct byte size) via the static route.
- Rejected: a `.txt` file declared as `image/png` in its filename but sent with its true `text/plain` content-type → `400`; a `.png`-named file sent with `text/plain` content-type → `400` (proves the extension in a filename doesn't influence acceptance); a 6MB file against the 5MB cap → `400`, with no orphaned partial file left on disk afterward.
- Created a non-`photo` (place) memory with an image → confirmed it landed on `memories.image_url`, not `family_members.photo_url`.
- `PATCH`: edited title/description with no image change (image untouched); replaced an existing image (confirmed the *old* file was deleted from disk, not just orphaned); removed an image via `removeImage: true` (confirmed `imageUrl`/`photoUrl` cleared to `null` **and** the physical file deleted); edited a family member's name/relationship on a photo memory (photo preserved).
- Security: no token → `401`; patient token → `403`; nonexistent memory id → `404`; confirmed `GET /api/patient/memories` returns the real uploaded photo path for a family member, proving the full chain (caregiver upload → DB → patient-facing API) actually connects.
- Full real-browser flow: logged in as caregiver → opened Add Memory → selected a file → **saw the live preview** → filled name/relationship/title/description → saved → new memory appeared in Memory Bank with a real (non-icon) thumbnail, not a toast-only claim → opened it via the new Edit button → confirmed fields were pre-filled → changed the relationship and replaced the photo → saved → change reflected → reopened, clicked "Remove photo", saved → Memory Bank correctly fell back to the icon tile (no broken image, no stale preview) → logged out, logged in as the patient → RecognitionGame's target was that same newest family member, using their real uploaded photo where one was still set.
- Regression: landing/login/caregiver/patient pages all still `200`; production build and `oxlint` both clean; all test data (memories, family member, uploaded files) removed afterward, back to the same 6 seeded memories from the previous task.

**Known limitations**:
- File-type validation trusts the client-declared multipart `Content-Type` for the image part (a standard, minimal approach) rather than sniffing the file's actual magic bytes — a sufficiently malicious client could still lie about content-type to smuggle a non-image file with an image extension. Acceptable for this MVP; would need a magic-byte check (or a dedicated library) to fully close.
- No image cropping/resizing — an uploaded photo is stored and served exactly as provided (up to 5MB).
- Switching an existing memory's `type` away from `photo` in an edit doesn't currently detach or clean up its `family_member_id` link — out of scope for this task, and harmless (the link just goes unused) rather than incorrect.

## Patient Interface & Login Modal

Implemented at `/patient` (`pages/PatientPage.jsx`). Unlike the caregiver flow, this route is **never redirect-gated** — the page always renders the full patient UI, and authentication is an in-page modal overlay, per the requirement that an elderly user should never be bounced to a different screen just to log in.

**How it works:**
- `PatientPage` reads `{isAuthenticated, isLoading, user}` from the same `AuthContext` used everywhere else (no second auth system). It computes `isUnlocked = isAuthenticated && user.role === 'patient'`.
- The interface (header, hero, recognition game, memory sections, bottom nav) always renders. When `!isUnlocked`, its wrapping `<div>` gets `pointer-events-none`, a slight `opacity-90` dim, `aria-hidden`, and the native `inert` attribute — so it's visible and legible behind the modal but not interactive or reachable by keyboard/screen-reader, without needing a focus-trap library.
- `PatientLoginModal` renders on top whenever `!isUnlocked`. It's a single password field (username is fixed to the seeded demo patient, `aiton` — "minimal input fields" per the brief) plus one large "Log In" button, calling the same `login()` from `AuthContext` that the caregiver login page uses. No new backend endpoint was needed — `POST /api/auth/login` already exists and already seeds the `aiton` user.
- On success, the modal needs no explicit close logic: `login()` updates `AuthContext` state, `PatientPage` re-renders with `isUnlocked = true`, and the modal's `isOpen` prop goes false. The user stays on `/patient` throughout.
- On failure, the modal shows a single fixed friendly sentence ("That password doesn't look right. Let's try again.") regardless of the underlying API error — the raw backend message is never shown, per the brief's explicit instruction not to expose "401 Unauthorized" style text.
- If a **caregiver** session hits `/patient`, `PatientPage` redirects to `/caregiver` (a plain `<Navigate>`, not a modal) — the patient tablet view has no reason to show a caregiver's data.
- **Logout**: the small "Log out" link in the patient header calls `logout()` then `window.location.reload()` — not a route navigation. This reloads the same `/patient` URL with the session already cleared, so the page comes back up showing the login modal again, exactly matching the "stay put, modal reappears" requirement (and sidesteps the same navigate()-vs-auth-redirect race noted for the caregiver dashboard, which doesn't even apply here since there's no redirect to race).

**Components** (`components/patient/`): `PatientHeader`, `MorningHero`, `RecognitionGame` (the "Who is this?" card — real select/confirm interaction, one hardcoded prompt), `AskSmriti` (voice orb + suggestion chips, toast-only), `MemoryRibbon` (4 keepsake tiles), `DailyRhythm` (5-step timeline), `CuratedRituals` (3 ritual cards, toast-only "Begin"/"Listen"), `MemoryOfTheDay` (real 3-response interaction with feedback text, ported from the reference HTML's `respondMemory` logic), `PeopleCloseToYou`, `OfflineBanner`, `PatientBottomNav`, and `PatientLoginModal`. Mock content lives in `frontend/src/data/patientMock.js` (no backend endpoint yet — nothing in requirements.md required one for this page, and the existing `GET /api/patient/home` stub is enough to prove the role-protected pattern if a real one is needed later).

**Design system additions**: a new `font-elderly` Tailwind family (Atkinson Hyperlegible Next, added to `index.html`'s Google Fonts link) for this page's large body/label text — chosen specifically for legibility, not decoration. Headlines still use the existing `font-serif` (Literata). A small shared `components/ui/Icon.jsx` was added (a handful of inline-SVG paths) instead of pulling in the reference HTML's Material Symbols icon font, to keep one icon approach across the app. No new colors were needed — the reference HTML's Material You token palette was mapped onto the existing `brand.*` tokens (teal ≈ primary, amber ≈ secondary, the existing `brand.positive` green ≈ tertiary) rather than importing a second color system; see design.md.

**Tests performed** (Playwright, fresh browser contexts per scenario):
1. Landing → click "Launch SMRITI Tablet Mode" → `/patient` → login modal appears over the visible (dimmed) interface → log in with `aiton123` → modal closes → interface fully interactive, greeting shows "Aiton". **Pass.**
2. Revisit `/patient` with a stored valid session → interface loads directly, no modal. **Pass.**
3. Wrong password → friendly error text shown inside the modal, modal stays open, interface remains visible behind it. **Pass.**
4. Click "Log out" → modal reappears, still on `/patient` (confirmed via URL — no route change occurred). **Pass.**
5. Refresh the browser after login → session persists (same `AuthContext`/localStorage mechanism as caregiver) → modal does not reappear → greeting still shows "Aiton". **Pass.**
6. (Bonus regression) A caregiver session visiting `/patient` is redirected to `/caregiver` rather than seeing Aiton's data. **Pass.**

Also verified: production build and `oxlint` both clean (only the same pre-existing idiomatic warnings from before), no console errors, and the page renders correctly at 1400px and 390px widths — large touch targets and generous spacing held up on mobile.

## Patient Recognition Game (Real Data)

Connected the Patient page's "Who is this?" game and "Memory of the Day" to the real `family_members`/`memories` data created via the Caregiver Dashboard's Add Memory feature (previous task), replacing their hardcoded content. No AI/LLM involved — target and distractor selection is fully deterministic.

**Backend**:
- Extracted the memory-table query helpers (`getPatientUser`, `getMemoryById`, `getMemoriesForPatient`) out of `routes/caregiver.js` into a new shared `backend/src/models/memories.js`, adding `getFamilyMembersForPatient(patientId)` alongside them — so the schema/queries from the previous task have exactly one implementation, imported by both `routes/caregiver.js` and the new `routes/patient.js` usage, per "don't duplicate the database model."
- New `GET /api/patient/memories` (`requireAuth` + `requireRole('patient')`) returns `{ familyMembers, memories }` for the authenticated patient. Critically, there is no `patientId` parameter anywhere in this route — the id is always `req.user.id` from the verified JWT, so "a patient can't request another patient's data by changing a parameter" is true because there's no parameter to change, not because of an added check that could be forgotten.
- `frontend/src/api/client.js` gained `patientApi.getMemories(token)`.
- **Bug fixed**: `ORDER BY created_at DESC` alone isn't a reliable "newest first" ordering — SQLite's `datetime('now')` has one-second resolution, so two rows created within the same second (very plausible: a caregiver adding two family members back-to-back, exactly what the E2E test below does) tied, and the tie-break was effectively arbitrary. Found this because the recognition game confidently named the *wrong* person as "correct" in a real browser test. Fixed by adding `, id DESC` as a secondary sort key in both `getMemoriesForPatient` and `getFamilyMembersForPatient`.

**Frontend data flow**: `PatientPage.jsx` fetches `patientApi.getMemories()` once the patient is unlocked (`useEffect` on `isUnlocked`), tracking `{status: 'idle'|'loading'|'success'|'error', familyMembers, memories}` in state, with a `loadMemories` retry function. `RecognitionGame` and `MemoryOfTheDay` receive `status`/data as props and own their own loading/empty/error rendering — the rest of the page (hero, voice orb, rituals, etc., all untouched) renders immediately regardless, so this doesn't gate the whole page behind a spinner.

**RecognitionGame logic** (`components/patient/RecognitionGame.jsx`, fully rewritten): family members come back newest-first; the target is always `familyMembers[0]` (the caregiver's most recently added person), with up to 2 more as shuffled distractors — no fabricated people. Four data states, each preserving the existing card layout:
- **0 family members** — calm "Something Familiar" message, no options, no fake choices.
- **Exactly 1** — a gentle single-person introduction ("This is X. Your Y.") with one confirm button instead of a multi-choice list, since there's nothing real to compare against.
- **2+** — the original multi-choice interaction, now with a real correct/incorrect distinction that didn't exist before (the old version always congratulated regardless of selection): a correct pick shows the existing warm "Yes, this is X!" success state; an incorrect pick shows a new, gentle, non-punitive correction box naming the right answer ("That's alright — this is X, your Y. Let's remember together.") — no red, no "wrong" language, consistent with the app's existing "no hurry or score" framing.
- **loading/error** — a shared `CalmMessage` component (reused for both) with a "Try again" retry button on error; error text is always the fixed friendly string, never the raw HTTP status/body.

Images: no new external hosts. A person with a real local photo asset (currently just `rina`, matched by lowercased name) shows it; everyone else — which today means every family member a caregiver actually creates, since there's no photo upload yet — shows a plain icon avatar. This is a real, honest limitation, not a fallback that could be mistaken for a photo.

**MemoryOfTheDay**: light-touch update only, per the task's "trivial reuse" scope. Picks one real memory (preferring a non-`photo` type, e.g. a place or song, so it doesn't just duplicate the recognition target) from the same fetched data and swaps in its title/description/image; the three response buttons and their feedback text are unchanged (generic, not memory-specific — tailoring per-memory feedback would need generation logic that's out of scope). Renders nothing at all if there's no memory yet, rather than a placeholder card.

**Removed**: `recognitionPrompt` and `memoryOfTheDay` exports from `patientMock.js` (now genuinely unused — every other export there is still used by untouched sections).

**A second real bug found and fixed**: none beyond the ordering issue above — but worth noting the *test* methodology issue it took to find it: a page-wide `isVisible('text=Rina')` check during verification kept false-failing because the separate, untouched "People Close To You" section further down the same page legitimately still shows its own hardcoded mock contact named "Rina" — a reminder that "no fake data" checks need to be scoped to the section actually under test, not the whole page, when unrelated mock sections coexist on it.

**Tests performed** (Playwright driving the real browser, plus direct curl/SQLite checks, against the running dev servers):
1. Logged in as caregiver through the real UI, created two new family members ("Maya", "Biren") via the actual Add Memory modal → confirmed both persisted via an independent `GET /api/caregiver/memories` call.
2. Logged in as the patient through the real login modal → RecognitionGame showed the real names (Maya, Rina with her real relationship, Biren) — the old hardcoded "Ban (My Daughter-in-law)" option is gone.
3. Selected the correct target (Biren, the most recently added) → confirmed the existing success feedback ("Yes, this is Biren!").
4. Selected a different, incorrect option → confirmed the new gentle correction feedback, correctly naming Biren.
5. Refreshed the browser → same real data still present (session + data both survive).
6. **Zero memories**: a fresh patient account with nothing created yet → calm empty state, verified scoped specifically to the RecognitionGame section (not a page-wide text search, for the reason noted above).
7. **Exactly one family member**: same fresh account with one person added directly in the DB → single-person introduction UI, confirm button gives the warm greeting, no multi-choice list rendered.
8. **Cross-patient isolation**: with two patient accounts existing simultaneously, confirmed via the page's own session token that the second account's `GET /api/patient/memories` returns *only* its own (empty) data — none of Aiton's Rina/Maya/Biren — and, separately, that Aiton's own session shows no trace of the second account's data either. The temporary second account was created and queried directly in SQLite (never through the caregiver's Add Memory flow, which resolves "the" patient by `role='patient' LIMIT 1` and would have been ambiguous with two patients present — a known, accepted limitation of this single-patient MVP) and fully deleted afterward.
9. **API failure**: intercepted `GET /api/patient/memories` to return `500` → calm fallback shown, no raw status code or error body visible → removed the interception → "Try again" recovered normally.
10. Explicit security checks via curl: no token → `401`; caregiver token → `403`; patient's own token → `200`; a forged `?patientId=999` query parameter on the patient's own authenticated request → silently ignored, response still scoped to their own data (there being no such parameter read by the route at all).
11. Regression: landing, login, caregiver dashboard (including its memory bank, which shares the same underlying table/model) and patient page all still `200` and functionally correct; production build and `oxlint` both clean.
12. All test data (the temporary second patient account, duplicate memory rows from repeated test runs) removed afterward — Aiton's data now reflects exactly what a real caregiver session created (Rina, Maya, Biren, plus the pre-existing Wooden Veranda Garden / Autumn Harvest Song / and one memory the user themselves had already added while exploring the app).

## Patient Memories Page

Added a dedicated, full `/patient/memories` page — a real destination (not a toast placeholder) reachable via the existing bottom nav's "Memories" tab, showing every real memory and family member from `GET /api/patient/memories` in a calm, filterable gallery, with a tap-to-view detail modal. No backend changes were needed — the existing endpoint already returned everything used here.

**Architecture decision — shared shell**: `PatientPage.jsx` and the new page both need identical auth-gating (login modal overlay, never a redirect), the fixed header/bottom nav, toast plumbing, and the `GET /api/patient/memories` fetch. Rather than duplicate ~60 lines of that across two pages, extracted it into `components/patient/PatientAppShell.jsx` (a render-props component: `<PatientAppShell activeTab="home|memories">{({patientName, isUnlocked, showToast, memoriesState, loadMemories}) => ...}</PatientAppShell>`). `PatientPage.jsx` was rewritten to use it — **verified to render and behave identically to before** (see Tests below); `PatientBottomNav.jsx` gained an `activeTab` prop (previously hardcoded to always highlight "Home") so it can correctly highlight whichever page is active, and "Home"/"Memories" now perform real `navigate()` calls instead of showing a toast — "Activities"/"Me" remain unchanged toast placeholders.

**Route**: `/patient/memories` added in `App.jsx`, deliberately **not** wrapped in `ProtectedRoute` — same reasoning as `/patient` itself (patient auth is a modal overlay, not a redirect; see architecture.md's Authentication section). Visiting it directly while logged out shows the interface's calm idle state (matching `RecognitionGame`'s existing pattern) dimmed behind the login modal, not a crash or a blank page.

**Components** (`components/patient/memories/`): `memoryTypeMeta.js` (shared label/badge/icon per real `type` value, and the category filter list), `MemoryCard.jsx` (reusable card; exports `memoryDisplayName`/`memorySubtitle` helpers reused by the detail modal), `MemoriesUtilityBar.jsx`, `MemoriesHeader.jsx` (title + functional category tabs with live counts), `FamiliarToYou.jsx` (a calm 3-item teaser — most recent photo/place/song-or-voice memory, never padded with fakes), `MemoriesGrid.jsx` (the filtered card grid, with a per-category empty message), `PeopleIKnowSection.jsx` (real `familyMembers`, each captioned with their own associated memory's real description when one exists — never an invented bio), `MemoryDetailModal.jsx`, `recallResponses.js` (extracted from `MemoryOfTheDay.jsx` so both places share the exact same three-response copy instead of drifting). Also added `utils/formatDate.js` (the SQLite-timestamp formatter, extracted from being duplicated a second time — `MemoryBank.jsx`'s existing copy was deliberately left alone to avoid touching a just-shipped, already-tested caregiver feature for a cosmetic dedupe).

**Reference → real data mapping, and deliberate simplifications**:
- The reference's four content categories map directly onto the real `memories.type` enum: People ↔ `photo`, Places ↔ `place`, Songs ↔ `song`, plus **Voice Notes ↔ `voice`** (replacing the reference's fictional "Warm Moments" category, which has no equivalent in the schema — the category filter only offers buckets that are real and functional, per the brief's "no cosmetic controls that don't work").
- The reference's separate "Familiar to You" / "People I Know" / "Places I Love" / "Moments" / "Songs" sections were consolidated into **one filterable grid + one dedicated People section**, rather than one hand-built section per category. This is a deliberate simplification per the brief's own elderly-friendly guidance ("do not make the interface unnecessarily complicated just because the reference contains many elements") — the filter tabs already let the patient narrow to any one category; a separate hard-coded section per type would just be the same data shown twice for no added clarity.
- **Omitted entirely, with no fabricated substitute**: the reference's biographical quote ("Aiton was born in the misty pine hills…") — there is no bio field anywhere in the schema, and inventing one would violate the brief's explicit "do not invent information that isn't in the database." Per the brief's instruction to *stop and report* rather than invent a schema for this, this is that report: a real bio would need a new column (e.g. `users.bio` or a small `patient_profile` table) — out of scope here.
- **Reused verbatim**: `OfflineBanner.jsx` — the reference's "Offline Mesh Guarantee" footer is the exact same message already implemented and shown on the Home page; no reason to rebuild it.
- **Images**: strictly `resolveAssetUrl(memory.imageUrl) || resolveAssetUrl(memory.familyMemberPhotoUrl)` → icon fallback. Deliberately **does not** use the `KNOWN_IMAGES`/`KNOWN_PORTRAITS` local-name-lookup fallback that `RecognitionGame.jsx`/`MemoryOfTheDay.jsx` already use on the Home page — those still resolve to `lh3.googleusercontent.com` placeholder URLs (`landingImages.js` hasn't been migrated to local assets yet), and this task's brief explicitly forbids introducing Googleusercontent URLs. Net effect: on this page, only memories with a real caregiver-uploaded file show a photo; everything else (including the seeded demo rows like "Rina") honestly shows the icon tile, even though those same rows show a stock photo elsewhere in the app. This is intentional and stricter than the pre-existing components, not an inconsistency I overlooked.
- **Voice/song "playback"**: never faked. Opening a `voice` or `song` memory's detail shows a plain sentence ("Listening to this one isn't available yet — it will be added soon.") instead of any player UI; "Hear \[Name\]'s Voice" buttons on family member cards show the same honest message via the existing toast pattern. No Web Speech API, no audio element, no fake progress bar.
- **Memory details / "View Photo"**: tapping a card's image or its "View memory" action opens the same `MemoryDetailModal` — showing the real image large, type badge, title, family relationship (if any), description (if any), and creation date (gracefully omitting any of these that are `null`, never fabricating a placeholder value) — plus the same gentle non-evaluative three-response recall prompt already established by `MemoryOfTheDay`, reused rather than reinvented.
- **AI/voice assistant**: not touched. The reference's header "Listen / Read aloud" button and the utility bar's matching button both show the same honest "not available yet" toast already used elsewhere in the Patient interface (e.g. the header mic button) — no Claude calls, no TTS/STT.

**Tests performed** (Playwright driving the real browser against the running dev servers, using the actual real data already present — including memories a person had genuinely created while exploring the app between tasks):
1. Logged in as the patient, clicked "Memories" in the bottom nav → URL became `/patient/memories`, page rendered with real memory titles/images that exist nowhere in any mock file.
2. Confirmed at least one real uploaded image (a place-type memory with a genuine photo) rendered as an actual `<img>`, not an icon.
3. Category filter: clicking "Sacred Songs" showed only song-type memories and hid a place-type one; clicking "Places I Know" showed the real place memory; switching back to "All Keepsakes" restored everything — all driven by real `type` values, no cosmetic no-op buttons.
4. Tapped a memory card → detail modal opened showing its real description from the API; used the recall prompt → got the existing established feedback text; closed the modal.
5. Opened a song-type memory specifically → confirmed the honest "not available yet" message appears and **no** play/pause button of any kind is rendered — then confirmed a family member's "Hear \[Name\]'s Voice" button shows the same honest toast rather than pretending to play anything.
6. Responsive: 1280px, 1024px (tablet), and 390px (mobile) all confirmed with **zero horizontal overflow** at any width; visually confirmed cards stack to one column on mobile with large touch targets preserved.
7. **Regression** — the reason the shared-shell refactor exists to be tested this carefully: confirmed the Home page's `RecognitionGame` still renders with real data and its answer interaction still works exactly as before; `MemoryOfTheDay` still renders; the bottom nav correctly shows "Home" as active there and "Memories" as active on the new page; round-tripped Home → Memories → Home via the bottom nav; confirmed the caregiver dashboard (a completely separate route/page, untouched) still loads correctly; confirmed the landing page is unaffected; zero console/page errors across every one of these flows.
8. Confirmed via direct `curl` that both `GET /api/caregiver/memories` and `GET /api/patient/memories` still return `200` — the backend was not modified for this task at all, exactly as instructed.

Also verified: production build and `oxlint` both clean — two new lint warnings reviewed and judged benign rather than fixed: `MemoryCard.jsx` exporting two small named helpers alongside its default component triggers the same "only-export-components" fast-refresh warning `AuthContext.jsx` already has (an established, tolerated pattern in this codebase); `PatientAppShell.jsx`'s call to `children({...})` (a standard React render-props pattern) triggers oxlint's "refs" rule, which appears to be a heuristic false positive — the component's one actual `useRef` is only ever touched inside an event handler, never during render.

**Explicitly left non-functional, honestly** (not implemented, not faked): voice/song playback, the AI voice assistant / "Listen aloud" (visual only, toasts), a patient-facing "add a memory" flow (the reference frames this as a caregiver/CHW action, which already exists on the Caregiver Dashboard — the patient-side button here just says so), and a biographical "about me" quote (no data source; would need a new schema field).

## Working Agreement Going Forward

- Pages/features are implemented **one at a time**, only when the user provides a design/spec for that page.
- Before each page: re-read `architecture.md`, `requirements.md`, `design.md`, this file.
- After each page: update `Status` column above, and update other docs only if a meaningful architectural decision was introduced (per project rule — no silent architecture changes).
