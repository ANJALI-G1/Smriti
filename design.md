# Design — AI Cognitive Companion for Elderly Dementia Patients (NER)

> Status: Hackathon MVP foundation document. Global design system and navigation only.
> Individual page designs will be provided one at a time and implemented against this system.

## 1. Design Principles

- **Clean** — minimal visual clutter; one primary action per screen for the patient view.
- **Intuitive** — no hidden menus or gestures; obvious next steps.
- **Modern but not trendy** — avoid design fads that reduce clarity (no tiny text, no low-contrast "minimalism").
- **Fast** — screens load quickly; feedback is immediate.
- **Accessible** — large touch targets, high contrast, readable fonts, voice support, designed for users with limited digital literacy and possible vision/motor decline.
- **Minimal cognitive load** — short sentences, one question/task visible at a time, consistent layout across games, gentle non-punitive feedback on mistakes.

Two distinct visual "modes" share the same design system:
- **Patient Mode** — extra-large text, big buttons, very few choices per screen, warm/calm tone.
- **Caregiver Mode** — denser information (dashboards, tables), still clean but standard "app" density since caregivers are digitally literate.

## 2. Visual Direction

- **Color strategy** (finalized — established by the Marketing Landing Page, defined as `brand.*` in `tailwind.config.js`): a warm ivory/off-white base (`brand.ivory` #FBF7F1, `brand.surface` #F4EFE6) with a deep teal primary accent (`brand.teal` #0F5E5E, `brand.tealDark` #0A4343, `brand.tealLight` #187B7B, `brand.tealSubtle` #E6F0F0) and a warm amber secondary accent (`brand.amber` #A55A00, `brand.amberLight` #D47814, `brand.amberSubtle` #FCF3E8) for highlights/callouts. Text uses `brand.charcoal` (#212B2B) for headings/body, `brand.slate` (#5A6565) and `brand.muted` (#7C8888) for secondary text. Borders use `brand.border`/`brand.borderDark`. Success states use standard `emerald` (Tailwind default), gentle errors use soft red tones — never harsh, high-saturation, or flashing colors, since these can be distressing for dementia patients. All in-app pages (Login onward) must reuse these tokens rather than introducing new colors.
- **Typography** (finalized): `Literata` (serif, via Google Fonts) for editorial headings — applied as the `font-editorial` / `font-serif` Tailwind family — paired with `Inter` (sans-serif) for body text and UI copy, applied as the default `font-sans`. **Patient Mode adds a third family, `font-elderly` (Atkinson Hyperlegible Next)**, used for its large body text/labels specifically for legibility (established building the Patient Interface); Patient Mode headings still use `font-serif`. Patient Mode uses large base sizes (≥20px body, ≥32px headings, buttons ≥24px text) within this type pairing. Caregiver Mode / marketing content can use standard web sizing (14–16px body).
- **Icons**: plain inline SVG only (a small shared set in `components/ui/Icon.jsx`) — no icon font/library (e.g. Material Symbols). Every icon-bearing action also carries a text label; icons are never the only cue.
- **Spacing**: Generous whitespace/padding, especially in Patient Mode — reduces visual crowding and misclicks. Consistent spacing scale (e.g., 4/8/16/24/32px increments via Tailwind defaults).
- **Border radius**: Soft, rounded corners (e.g., `rounded-xl`/`rounded-2xl`) on cards and buttons — friendlier, less clinical feel.
- **Shadows**: Subtle, soft shadows only for elevation cues (cards, modals) — no harsh drop shadows.
- **Buttons**: Large, high-contrast, clearly labeled with text (not icon-only) in Patient Mode. Primary/secondary/destructive variants defined once and reused.
- **Cards**: Used for game questions, family member entries, dashboard stat blocks — consistent padding/radius/shadow.
- **Forms**: Simple, vertical, one field focus at a time where possible (especially anything Aiton might need to interact with); caregiver forms can be more standard/compact.
- **Navigation**: Patient Mode has minimal navigation (home + maybe a back button) — avoid complex menus. Caregiver Mode has a simple sidebar or top nav with a few sections.
- **Responsive behavior**: Primary target is tablet/desktop. Layouts should not break on smaller screens, but elaborate mobile-specific redesigns are not required for MVP.

## 3. Design System (reusable components)

Defined once, reused across all pages as they're built:

- **Button**: `primary` (accent fill), `secondary` (outline/neutral), `destructive` (for delete actions in caregiver views). Consistent size scale: `lg` (Patient Mode default), `md` (Caregiver Mode default).
- **Input**: Text input, with label above, large touch target in Patient Mode contexts (e.g., login), standard size in Caregiver forms.
- **Card**: Container with consistent padding/radius/shadow; used for games, list items, dashboard stats.
- **Modal**: Centered overlay with dimmed background, used sparingly (e.g., confirm delete in caregiver view). In Patient Mode, prefer full-screen flows in general — **the one deliberate exception is authentication**: the patient login is a modal over the always-visible patient interface (not a redirect to a separate screen), so the elderly user is never suddenly moved to an unfamiliar screen just to sign in. That modal is minimal (one field, one large button, no dismiss action) and dims/disables the interface behind it without hiding it.
- **Navigation**: 
  - Patient Mode: simple top bar with app name/logo + logout; minimal/no side nav.
  - Caregiver Mode: top bar + simple sidebar or tab navigation (Dashboard / Patient Data / Reminders).
- **Loading state**: Simple centered spinner or skeleton with a friendly short message (e.g., "Getting your game ready..." for patient; standard skeleton for caregiver tables).
- **Error state**: Friendly, non-technical message with a retry action. Never show raw error codes/stack traces to Aiton.
- **Empty state**: Friendly illustration/message pattern for "no data yet" (e.g., no family members added yet, no sessions recorded yet).
- **Toast/notification**: Small, non-blocking confirmation (e.g., "Saved!", "Back online, syncing...") — auto-dismiss, no action required from Aiton.

## 4. Application Navigation

Actual implemented routes (superseding the earlier speculative sketch — kept flatter than first planned, since a hackathon MVP didn't need nested route trees):

```
/           -> Landing (marketing/entry, public)
/login      -> Caregiver login (public; patient does NOT use this route)
/caregiver  -> Caregiver Dashboard (redirect-gated: ProtectedRoute sends
               an unauthenticated or wrong-role visitor to /login or /patient)
/patient    -> Patient Interface (always renders; gated by an in-page
               login modal instead of a redirect — see design system's
               Modal entry above)
/patient/memories -> Patient Memories gallery (same gating as /patient;
               shares its auth/header/bottom-nav shell via
               components/patient/PatientAppShell.jsx rather than
               duplicating that logic)
```

Patient Mode and Caregiver Mode are gated by the `role` on the logged-in user (see architecture.md §4), but via two different mechanisms: the caregiver route redirects when unauthenticated, the patient route overlays a modal. Both reuse the same `AuthContext`/session.

## 5. User Experience (high-level, login → core product)

1. User lands on `/login`. Sees a very simple choice or form (e.g., "Login as Aiton" / "Caregiver Login").
2. **Patient path**: After login, Aiton sees `/home` — a warm welcome, today's suggested game as one large card/button, and (if enabled) a reminder banner. Tapping "Play" starts a game session (`/play/:gameId`). Game presents one question at a time, large text, optional voice read-aloud, big answer buttons. After the round(s), a simple, encouraging result screen appears (`/result`), then returns to `/home`.
3. **Caregiver path**: After login, caregiver sees `/caregiver/dashboard` — session count, correct/incorrect trend, alerts. Can navigate to `/caregiver/patient-data` to manage family members/routines that power the games.
4. Offline: if connectivity drops mid-session, the patient experience is unaffected (cached game continues, result stored locally); a subtle toast informs of offline status and later sync.

## 6. Page Inventory

| Page | Purpose | Priority | Status |
|---|---|---|---|
| Marketing Landing Page (`/`) | Public-facing editorial page introducing SMRITI, explaining the concept, and routing visitors toward the senior or caregiver experience | P1 | **Implemented** |
| Login | Simple login — **caregiver only**, behind `/login` | P0 | **Implemented** (behind `/login`; Aiton's login is a modal on the Patient Interface itself, not this page — see below) |
| Patient Home | Entry point after login; shows today's activity/game and reminders | P0 | **Implemented** (behind `/patient`, always renders; login modal overlay when unauthenticated) |
| Patient Memories | Filterable gallery of real memories/family members, tap-to-view detail | P1 | **Implemented** (behind `/patient/memories`, reachable via bottom nav) |
| Game Play Screen | Displays one active cognitive game session, question-by-question | P0 | Partially covered — the recognition card on Patient Home is a real interaction but uses one fixed prompt, not AI-generated games (see implementation.md C-T6) |
| Game Result Screen | Shows encouraging feedback after a session ends | P0 | Awaiting page specification |
| Caregiver Dashboard | Shows engagement stats, performance trends, alerts | P0 | **Implemented** (behind `/caregiver`, protected route) |
| Caregiver Patient Data | Manage family members, photos, routines | P0/P1 | Awaiting page specification |
| Reminders (Patient view) | Shows medication/meal reminders to Aiton | P1 | Awaiting page specification |
| Reminders (Caregiver management) | Add/edit reminders for Aiton | P1 | Awaiting page specification |

Note: the Marketing Landing Page was not in the original P0 core-journey scope (requirements.md focuses on the patient/caregiver in-app journeys), but was explicitly requested and built first. It also established the concrete global visual style — see the updated Visual Direction section below — so the in-app pages (Login onward) should reuse the same tokens, not invent new ones.

No page below Marketing Landing Page has a detailed visual design yet — each will be designed and implemented individually as specified, following the design system in this document.
