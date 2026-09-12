# Requirements — AI Cognitive Companion for Elderly Dementia Patients (NER)

> Status: Hackathon MVP foundation document. Source of truth for scope.

## 1. Product Goal

Build a working demo of an AI-powered, offline-capable cognitive companion that:
- Turns an elderly dementia patient's own memories (family, photos, routines, regional/cultural context) into personalized cognitive games.
- Adapts difficulty based on performance.
- Works with voice interaction for accessibility.
- Functions with limited/no connectivity and syncs later.
- Gives caregivers visibility into engagement and cognitive trends.

The goal for the hackathon is a **working, demoable product** that clearly shows this loop end-to-end for one patient (Aiton), not a production-ready platform.

## 2. Target User

- **Primary user: Aiton** — an elderly dementia patient in the North Eastern Region, limited digital literacy, benefits from large UI, simple language, and voice interaction.
- **Secondary user: Caregiver/family member/health worker** — monitors Aiton's engagement and cognitive performance, manages Aiton's memory data (photos, names, routines) and reminders.

## 3. Core User Journey

**Patient (Aiton) journey:**
1. Login (simple, one-tap or simple credential entry) → lands on a friendly home screen.
2. Sees today's suggested activity/game or reminder.
3. Plays a personalized memory game (e.g., identify family member from photo, recall daily routine, sequence a familiar regional task).
4. Gets immediate, encouraging feedback (correct/incorrect, gentle tone).
5. Game difficulty adjusts based on performance.
6. Session result is saved (locally if offline, synced when online).

**Caregiver journey:**
1. Login → caregiver dashboard.
2. Views Aiton's recent engagement (sessions played, streaks) and cognitive performance trends.
3. Views alerts (e.g., no activity in X days, performance decline).
4. Manages patient memory data (add family member, upload photo, add routine item) so future games use it.
5. Manages reminders (e.g., medication, meals).

## 4. Functional Requirements

- **FR-001**: The system shall allow a user to log in as "Aiton" (patient) using a simple username/password or single-tap demo login.
- **FR-002**: The system shall allow a caregiver to log in separately and see a caregiver-specific dashboard view.
- **FR-003**: The system shall store patient personal data: family members (name, relationship, photo), daily routines, and regional/cultural facts relevant to NER.
- **FR-004**: The caregiver shall be able to add/edit/delete family member entries (name, relationship, photo) via the caregiver UI.
- **FR-005**: The caregiver shall be able to add/edit/delete routine items (e.g., "tea at 4pm") via the caregiver UI.
- **FR-006**: The system shall generate at least one type of personalized cognitive game using the patient's stored memory data (e.g., "Who is this person?" using an uploaded family photo).
- **FR-007**: The system shall generate game content dynamically via an AI (LLM) call using the patient's data as context.
- **FR-008**: The system shall present games through a simple, large-button, high-contrast UI suitable for elderly users.
- **FR-009**: The system shall support voice input (answer via speech) and voice output (question read aloud) using the browser's speech APIs.
- **FR-010**: The system shall record each game session's result (correct/incorrect, response time, difficulty level) tied to the patient.
- **FR-011**: The system shall adjust game difficulty based on recent performance (rule-based: e.g., 3 correct in a row → increase difficulty; 2 wrong → decrease).
- **FR-012**: The system shall function without an internet connection for: viewing/playing a cached game, and recording results locally.
- **FR-013**: The system shall automatically sync locally-stored game results to the backend when connectivity is restored.
- **FR-014**: The caregiver dashboard shall display: number of sessions played, correct/incorrect ratio, and a simple trend (e.g., last 7 days) for the patient.
- **FR-015**: The caregiver dashboard shall display simple alerts (e.g., "No activity in the last 3 days") based on stored session data.
- **FR-016**: The system shall support reminders (e.g., medication, meals) visible to the patient and manageable by the caregiver.
- **FR-017**: The system shall log the user out and protect all non-login routes behind authentication.

## 5. Non-Functional Requirements

- **Performance**: Game screens should load within ~2 seconds on a typical broadband/demo connection; AI-generated game content should return within ~5 seconds (show a loading state if longer).
- **Reliability**: Core demo flow (login → play game → see result → caregiver sees update) must work consistently for the live demo; prefer deterministic fallback content if the AI call fails.
- **Responsiveness**: UI must work well on tablet and desktop screen sizes (primary demo devices); mobile-friendly is a bonus, not required for MVP.
- **Usability**: UI must use large fonts, high-contrast colors, and minimal steps per screen, appropriate for elderly users with limited digital literacy.
- **Offline Reliability**: Cached game(s) and reminders must remain accessible with no network; sync must not lose or duplicate data when connectivity returns.
- **Security**: Passwords hashed; auth required for all data endpoints; no sensitive data exposed in plaintext logs.

## 6. MVP Scope

### P0 — Must Have (required for the demo)
- Aiton login (simple).
- Caregiver login (simple).
- Seeded demo data for Aiton (a few family members with photos, a few routine items).
- One working personalized game type (photo-based "who is this" recognition), AI-generated using Aiton's data.
- Difficulty adjustment (rule-based) across a few rounds.
- Game result recorded and visible on caregiver dashboard (sessions count, correct/incorrect trend).
- Basic offline support: last-fetched game playable offline; result queued and synced when back online.
- Voice output for reading the question aloud (minimum: TTS). Voice input if time permits (STT).
- Basic caregiver alert (e.g., no activity in N days) — even if simplified logic.

### P1 — Should Have (build if time permits)
- Second game type (e.g., routine sequencing, or daily schedule recall).
- Voice input (speech-to-text) for answering games.
- Reminders feature (view/manage medication or meal reminders).
- Caregiver ability to add/edit family members and routines through UI (vs. seeded only).
- Multilingual UI text (e.g., English + one regional language toggle).

### P2 — Nice to Have (only after MVP works)
- More game types (attention, sequencing, emotional engagement games).
- Rich caregiver analytics (charts, longer trend history).
- Push notifications for reminders.
- Full multilingual voice support across regional languages.
- Emotion/sentiment tracking during sessions.

## 7. Out of Scope

- Real clinical/diagnostic functionality (this is NOT a medical diagnostic tool).
- Multi-patient/multi-tenant support beyond the single demo user (Aiton) + one caregiver.
- OAuth, MFA, email verification, password reset flows.
- Native mobile apps (iOS/Android) — web/PWA only.
- Integration with real hospital/EHR systems.
- Real-time video calling or telehealth features.
- Production-grade scalability, load balancing, or multi-region deployment.
- Automated ML-based (non-rule-based) difficulty adaptation.

## 8. Authentication Requirements

- One seeded demo patient user: **Aiton** (`username: aiton`).
- One seeded demo caregiver user (`username: caregiver`).
- Simple username/password login form (or single-tap "Login as Aiton" demo button for speed during live demo).
- Session persisted via JWT or cookie; user stays logged in until logout or token expiry.
- No self-registration, no password reset, no OAuth, no MFA.

## 9. Acceptance Criteria

- **Login**: Given valid Aiton credentials, when submitted, the user is redirected to the patient home screen within 2 seconds. Given invalid credentials, an error message is shown.
- **Game generation**: Given Aiton has at least one family member with a photo stored, when a game session starts, the system generates a "who is this" question using that data and displays it correctly.
- **Difficulty adjustment**: Given Aiton answers 3 consecutive questions correctly, the next question is generated at a higher difficulty tier (verifiable via a visible difficulty indicator or logged value).
- **Offline play**: Given the device is offline and a game was previously loaded, when Aiton plays it, the game functions and the result is stored locally without error.
- **Sync**: Given locally stored results exist and connectivity is restored, when the app detects the connection, results are sent to the backend and appear in the caregiver dashboard without duplication.
- **Caregiver dashboard**: Given Aiton has completed at least one session, when the caregiver logs in, the dashboard shows an updated session count and correct/incorrect ratio reflecting that session.
- **Alerts**: Given no sessions were recorded for Aiton in the last 3 days, when the caregiver views the dashboard, an alert message is displayed.
