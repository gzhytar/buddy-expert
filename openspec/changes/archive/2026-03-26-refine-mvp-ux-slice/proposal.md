## Why

The product MVP in `ProductSpecification.md` lists orientation, preparation, reflection, and optional buddy together as “must include,” which risks parallel build-out without a shippable, testable experience. We need an explicit **first vertical slice**—one complete expert journey in the app—so we can validate adoption, guardrails (psychological safety, low friction), and alignment with the JIC frame before widening scope.

## What Changes

- **Refine MVP sequencing**: Treat **post-consultation reflection** as **MVP slice 1**—a full, saveable flow from “I finished a consultation” through principles, roles used, calibration, frame check, and a short learning note.
- **Thin orientation for slice 1**: Provide **minimum viable orientation** in support of that slice only—enough context to use principles and roles reflectively (mission/frame summary, principle list, role catalog as reference), not a full onboarding program in v1.
- **Defer to slice 2+** (still in the broader product roadmap, not this slice’s ship bar): **pre-consultation preparation** (roles to strengthen/downregulate, intention) and **buddy handoff** as separate increments after reflection is proven in use.
- **Non-goals unchanged** at product level (no YTracker replacement, no surveillance scoring, no full LMS); this change only **sharpens delivery order** and **defines requirements** for the first slice.

## Capabilities

### New Capabilities

- `orientation-basics`: Read-oriented access to JIC mission/service frame summary, the ten principles, and the situational roles model so experts can reflect with shared language (no checklist scoring).
- `consultation-reflection`: End-to-end expert flow to capture a reflection for a completed consultation—relevant principles, roles used, calibration (underuse / balanced / overuse), alignment with the JIC frame, and a short learning note—with persistence per expert.

### Modified Capabilities

<!-- No existing specs under openspec/specs/; nothing to modify at spec level. -->

## Impact

- **Application**: Next.js (App Router) routes, forms, and navigation scoped to orientation surfaces and the reflection workflow; eventual preparation and buddy features stay out of slice-1 requirements.
- **Data**: Expert-scoped storage for reflection records; schema should remain Postgres-compatible for Neon per project config.
- **Auth**: Auth.js (NextAuth v5) as soon as multi-user persistence is required; slice may start with a minimal auth story if specs demand per-expert data.
- **Dependencies**: Aligns implementation tasks with Tailwind, Radix, React Hook Form, and Zod as in `openspec/config.yaml`.
