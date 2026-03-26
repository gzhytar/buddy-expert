## 1. Project bootstrap

- [x] 1.1 Initialize Next.js (App Router) + TypeScript with Tailwind CSS and ESLint baseline
- [x] 1.2 Add Radix UI primitives, React Hook Form, Zod, and shared UI layout (app shell, navigation to orientation and reflections)
- [x] 1.3 Configure Drizzle (or Prisma) with SQLite for local dev and document `DATABASE_URL` swap for Neon Postgres

## 2. Data model and seed content

- [x] 2.1 Define schema for principles, roles (with phase grouping), and reflection sessions (user ownership, consultation label, occurred-at, selections, calibrations, alignment, learning note, status/timestamps)
- [x] 2.2 Add migrations compatible with SQLite and Postgres
- [x] 2.3 Seed ten principles and sixteen roles with stable ids and display names per `ProductSpecification.md` §9.1–9.2

## 3. Authentication

- [x] 3.1 Integrate Auth.js (NextAuth v5) with session available in server components and route handlers
- [x] 3.2 Protect reflection routes and orientation per design default (authenticated-only); enforce ownership on reflection read/write

## 4. Orientation (orientation-basics spec)

- [x] 4.1 Implement `/orientation` (or equivalent) with mission and service-frame summary page
- [x] 4.2 Implement principles list UI reading from seeded data
- [x] 4.3 Implement roles catalog UI with four phase sections reading from seeded data
- [x] 4.4 Verify responsive layout and baseline accessibility (headings, landmarks, keyboard nav)

## 5. Reflection workflow (consultation-reflection spec)

- [x] 5.1 Implement reflections list page showing current user’s sessions with summary fields
- [x] 5.2 Implement multi-step or sectioned “new reflection” flow: consultation context → principles → roles + calibration → frame alignment → learning note
- [x] 5.3 Add Zod schemas shared between client form and server persistence; handle save draft vs. complete per product rules
- [x] 5.4 Implement persistence (create, update, complete) and success confirmation
- [x] 5.5 Add navigation from reflection flow to orientation (principles/roles) without losing draft state (e.g. new tab or return path with draft autosave)
- [x] 5.6 Add authorization checks so other users cannot load or mutate foreign reflections

## 6. Verification and handoff

- [x] 6.1 Manually test full slice: login → orientation skim → create reflection → list → reopen
- [x] 6.2 Run `/opsx:verify` (or `openspec verify`) against this change when tooling is available
- [x] 6.3 Document env vars (database, auth secrets) for local and Vercel/Neon deployment
