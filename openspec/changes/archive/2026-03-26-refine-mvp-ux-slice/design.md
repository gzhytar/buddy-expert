## Context

`ProductSpecification.md` defines a broad MVP (orientation, preparation, reflection, optional buddy). This change narrows **first delivery** to a **reflection-first vertical slice** supported by **read-only orientation** content, matching `openspec/config.yaml` (Next.js, Auth.js, Postgres-compatible data, psychological-safety guardrails). There is no application codebase yet; this design sets the initial shape for implementation.

## Goals / Non-Goals

**Goals:**

- Ship one **end-to-end expert journey**: complete and persist a **post-consultation reflection** using JIC principles and situational roles as shared language.
- Provide **orientation surfaces** (mission/frame summary, ten principles, sixteen roles grouped by phase) so reflection is grounded in the framework without a heavy onboarding wizard in slice 1.
- Use a **Postgres-compatible** schema from day one so local SQLite (dev) and Neon (Vercel) differ only by `DATABASE_URL`.
- Keep UX **lightweight and optional-depth** to reduce reflection-vs-burden and checklist risks from `ProductSpecification.md` §17–18.

**Non-Goals:**

- Pre-consultation preparation workflow, buddy handoff, consilium, YTracker integration, analytics dashboards, or formal performance scoring.
- Storing client-identifying or CRM data; consultation identifiers in slice 1 are **expert-owned labels** (e.g. title + date), not YTracker IDs.
- Completing full role-card content (useful manifestations, overheating risks) for all sixteen roles in v1 unless content is already available—structure and key examples can ship first.

## Decisions

1. **Routing (App Router)**  
   - **Decision**: Public or authenticated **orientation** under a stable segment (e.g. `/orientation` with subroutes or anchors for frame, principles, roles). **Reflection** under `/reflections` with `new` and optional `[id]` for edit/review.  
   - **Rationale**: Clear separation of reference material vs. workflow; supports deep links from reflection UI into orientation.  
   - **Alternatives**: Single long page for everything (rejected: hurts focus and mobile use).

2. **Reflection data model**  
   - **Decision**: Persist a **ReflectionSession** (or equivalent) per expert: optional consultation label, occurred-at timestamp, multi-select principle keys/ids, multi-select role ids, per selected role a **calibration** enum (`underused` | `balanced` | `overused`), frame-alignment free text or Likert + comment, learning note text, timestamps, user id.  
   - **Rationale**: Matches ProductSpec flow §12.3 and calibration model §9.2; queryable for future patterns without building analytics in slice 1.  
   - **Alternatives**: Unstructured single text blob (rejected: loses shared language and testability).

3. **Principles and roles as data**  
   - **Decision**: Seed **ten principles** and **sixteen roles** (with phase grouping: Contract and frame; Company diagnosis; Leading the session; Solution creation) from product source content; expose via read API or server components.  
   - **Rationale**: One source of truth for labels used in reflection pickers and orientation pages.  
   - **Alternatives**: Hardcode only in UI (rejected: duplication between orientation and reflection).

4. **ORM**  
   - **Decision**: **Drizzle** with SQL migrations compatible with SQLite and Postgres (shared schema, environment-specific URL).  
   - **Rationale**: Lightweight, explicit SQL, aligns with “Postgres-compatible from the start” in config; Prisma remains a valid swap if team standard emerges.  
   - **Alternatives**: Prisma (acceptable; slightly heavier for a small schema).

5. **Auth timing**  
   - **Decision**: **Auth.js (NextAuth v5)** with a provider suitable for internal JIC use (exact provider TBD: e.g. email magic link, corporate IdP). Reflection list and create **require** authenticated expert identity. Orientation may be **authenticated-only** in slice 1 to avoid public leakage of internal frame copy, or selectively public if stakeholders require—default **authenticated**.  
   - **Rationale**: Reflections are personal/professional data; multi-user safety.  
   - **Alternatives**: Single demo user without auth (rejected for realism of MVP test).

6. **Forms and validation**  
   - **Decision**: **React Hook Form + Zod**; server actions or route handlers validate the same schemas.  
   - **Rationale**: Matches `openspec/config.yaml` and keeps client/server rules aligned.

## Risks / Trade-offs

- **[Risk] Concept overload in one screen** → **Mitigation**: Stepper or short sections; progressive disclosure; sensible defaults; limit simultaneous prompts (ProductSpec §18.1 D).
- **[Risk] Perceived surveillance** → **Mitigation**: Copy and UI stress self-development; no manager views or scores in slice 1; access control only for the owning expert.
- **[Risk] Czech role names confuse some users** → **Mitigation**: Keep official names as primary; optional short Czech→context descriptions where product content allows.
- **[Trade-off] Thin orientation** → Experts get less narrative than full onboarding; acceptable for validating the reflection loop first.

## Migration Plan

- **Initial deploy**: Run migrations against Neon; set `DATABASE_URL` in Vercel; seed principles/roles.  
- **Rollback**: Revert deployment; database rollback via migration down or restore snapshot if needed (document in runbook when app exists).  
- **Content updates**: Principle/role copy changes via migrations or admin-only seed in later iterations—not blocking slice 1.

## Open Questions

- Which **Auth.js provider(s)** match JIC IT (Azure AD, Google workspace, email)?
- Final **canonical Czech/English** mix for UI labels for this audience.
- Whether **orientation** must be readable without login for recruitment demos—product/security decision.
