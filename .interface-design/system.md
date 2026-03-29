# buddY expert — interface design system

**Status:** Initialized; patterns extracted from codebase (2026-03-29).  
**Source of truth for tokens:** `app/globals.css` (`:root`, dark `prefers-color-scheme`, `@theme inline`).

---

## Product snapshot

- **Who:** JIC experts using a reflective / learning layer (Czech UI).
- **Jobs to be done:** Prepare, reflect, align on a shared consulting language; browse orientation content (principles, situational roles).
- **Feel (target):** Calm, readable, slightly editorial — not a generic SaaS dashboard. Warm paper-like background tint with cool ink for body; display type adds human weight without playfulness overload.

---

## Domain anchors (expand in explore/propose)

| Concept | Notes |
|--------|--------|
| Konzultační karty / fáze | Zakázka, diagnostika, vedení, tvorba — encoded as phase accent borders |
| Role states | Podužitá / vyvážená / přepálená — vocabulary in copy |
| Reflexe & příprava | Learning layer, not ops tooling |
| Ilustrace k rolím a principům | Image-forward cards, bounded aspect |

---

## Color world (in code today)

- **Canvas:** `--background` — very light warm paper (oklch hue ~95 light / ~260 dark family for text).
- **Ink:** `--foreground`, hierarchy via `--muted-foreground`.
- **Surfaces:** `--card`, `--muted`, `--accent` — small lightness steps, same hue family as borders.
- **Structure:** `--border` — low-chroma separation; section rules use `border-border` / `border-border/60`.
- **Brand / action:** `--primary`, `--ring` — blue-violet family (~260 hue).
- **JIC phase accents:** `--jic-phase-*-border` — distinct hues per phase on card left edge only.

---

## Signature (current)

**Phase-colored left rail on consulting role cards** (`border-l-4` + `phaseLeftBorderClass`) ties the UI to the physical JIC card metaphor without painting whole surfaces in rainbow hues.

---

## Typography

| Role | Stack |
|------|--------|
| Display / titles | Fraunces (`--font-fraunces` → `font-display`) |
| Body / UI | Source Sans 3 (`--font-source-sans` → `font-sans`) |

**Patterns in use:** `tracking-tight` on headings; section labels as small uppercase with `tracking-wider` and `text-muted-foreground`.

**Card / dense body (orientation + wizards):** `text-[13px]` with `leading-snug` or `leading-relaxed`; labels `text-[10px] sm:text-[11px]` uppercase semibold. Strong emphasis in prose: `strong` + `text-foreground` on `text-muted-foreground` paragraphs.

---

## Depth strategy

**Committed:** Subtle **borders** + **very light shadows** on elevated content only.

- Cards: `border border-border`, `shadow-sm`, `hover:shadow-md` (see `ConsultingRoleCard`).
- Inset / “strip” headers: `bg-muted/10`, `border-b border-border/60` — hierarchy without heavy elevation jumps.
- **Avoid:** Large drop shadows, harsh solid outlines, unrelated hue per surface.

---

## Radius & motion

- **Radius:** `--radius-md` 0.5rem, `--radius-lg` 0.75rem; cards often `rounded-xl` where content warrants softer corners.
- **Motion:** `step-in` keyframe (short translate + fade), `cubic-bezier(0.16, 1, 0.3, 1)`; respect `prefers-reduced-motion` (animation disabled in theme).

---

## Spacing (working scale)

Tailwind-driven; common multiples in orientation UI:

- **Micro:** `gap-1.5`, `space-y-1.5` (label to body)
- **Component:** `gap-4`, `px-4 py-4` / `sm:px-5 sm:py-5`
- **Section:** `space-y-8`, `space-y-12`, `pb-2` on section headers with `border-b`

Treat **4** as the default rhythm step unless density requires 3 or 5.

---

## Shell & navigation (extracted)

| Piece | Where | Pattern |
|--------|--------|---------|
| **Column layout** | `AppShell` | `flex min-h-full flex-col`; `main` `mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6` |
| **Header width** | `SiteHeader` | Inner `max-w-5xl` (wider than reading column — nav breathes) |
| **Sticky header** | `SiteHeader` | `sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md`; `motion-reduce:backdrop-blur-none` |
| **Bar height** | `SiteHeader` | `h-14`; brand `font-display text-lg font-semibold tracking-tight` |
| **Nav links (md+)** | `SiteHeader` | `rounded-md px-3 py-2 text-sm font-medium`; active `bg-accent text-accent-foreground`; idle `text-muted-foreground hover:bg-muted hover:text-foreground` |
| **Nav links (mobile)** | `SiteHeader` | Second row `border-t border-border/80 py-2`; `text-xs` full-width chips |
| **Match active route** | `SiteHeader` | Exact `pathname === item.href`, or nested: `pathname.startsWith(item.href + "/")` |

---

## Orientation pages (extracted)

- **Hub (`/orientation`):** `space-y-8`; titles `space-y-2`; `Card` inside `Link` with `block rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`; card `hover:shadow-md` + `motion-reduce:transition-none`.
- **Child pages:** Breadcrumb `nav` + `Button variant="ghost" size="sm" asChild` → `Link` with `← Orientace` (keep Czech consistent).
- **Principles list:** `ol.list-none space-y-4`; items `scroll-mt-20` for in-page anchor clearance.
- **Frame figure:** Container `rounded-xl border border-border/80 bg-[oklch(99%_0.01_95)] shadow-sm dark:bg-card`; caption `text-xs text-center text-muted-foreground`; inline `code` `rounded bg-muted px-1 font-mono text-[0.7rem]`.

---

## Reference cards — principles & roles (extracted)

Shared **article** shell (see `OrientationPrincipleCard`, `ConsultingRoleCard`):

- Outer: `rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md motion-reduce:transition-none overflow-hidden`
- **Left rail:** principles → `border-l-4 border-l-primary/45`; roles → `border-l-4` + `phaseLeftBorderClass` → CSS vars in `lib/consulting-roles/card-content.ts` (`contract-frame` → zakázka, `company-diagnosis` → diagnostika, `leading-session` → vedení, `solution-creation` → tvorba; unknown phase → `border-l-border`)
- **Focus within:** `focus-within:ring-2 focus-within:ring-ring/60 focus-within:ring-offset-2 focus-within:ring-offset-background` (+ motion-reduce clears ring)
- **Header strip:** `flex flex-row items-center justify-between gap-4 sm:gap-5 border-b border-border/60 bg-muted/10 px-4 py-3 sm:px-5 sm:py-4 dark:bg-muted/5`
- **Title block:** `min-w-0 flex-1 space-y-1.5`; title `font-display text-base font-semibold sm:text-lg tracking-tight`; optional summary `text-[13px] font-medium leading-snug text-foreground/80 sm:max-w-xl`
- **Illustration column:** `w-[160px] sm:w-[180px] lg:w-[200px] shrink-0` + `PrincipleIllustration` `variant="card"` and `rounded-lg border-border/50 shadow-sm`
- **Body:** `space-y-4 px-4 py-4 sm:px-5 sm:py-5`
- **Two-column grid (tips / stories or useful / risks):** `grid gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6 lg:items-start max-w-5xl`
- **“Soft” panel (stories):** `rounded-xl border border-muted-foreground/15 px-3 py-3 sm:px-4 sm:py-3.5 bg-muted/25 dark:bg-muted/15`
- **Warning panel (role risks):** `rounded-xl border border-amber-500/20 bg-amber-500/[0.04] dark:bg-amber-500/[0.08]`; headings + list `amber-*` tints for hierarchy
- **List bullets (useful):** `list-disc list-outside pl-4 marker:text-primary/70`
- **Footer meta strip:** `border-t border-border/60 bg-muted/10 px-4 py-2 sm:px-5 dark:bg-muted/5` + `text-[10px] text-muted-foreground`

---

## PrincipleIllustration (extracted)

| Variant | Use |
|---------|-----|
| `card` | `aspect-[4/3]`, absolute fill `img`, paper-style wrapper `bg-[oklch(99%_0.01_95)] dark:bg-card` |
| `sidebar` | `min-h` breakpoints; `object-contain` + `p-2`; optional `density="compact"` |
| `inline` | `size-20 sm:size-24` wizard thumbnails |
| **Missing / broken** | Dashed `border-border`, `bg-muted/30`, `ImageIcon`, `text-[11px]` hint |

---

## Wizards — preparation & reflection (extracted)

- Page wrapper: `space-y-8`; top `nav` `flex flex-wrap items-center justify-between gap-3`
- Header: `space-y-3`; eyebrow `text-sm text-muted-foreground`; title `font-display text-3xl font-semibold tracking-tight`
- Step indicators: `flex flex-wrap gap-2` `aria-label="Průběh"`; active/inactive pill classes shared between both wizards
- Step body: `animate-step-in space-y-6`
- Inline errors: `rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200` (reflection uses `role="alert"` on one variant)
- Footer actions: `border-t border-border pt-6` + `flex flex-wrap items-center justify-between gap-3`; button groups `flex gap-2`
- Links in copy: `text-primary underline underline-offset-2`

---

## Role selector rows (extracted)

- `RoleRowShell`: `motion.li` with optional layout animation; base `rounded-md border border-border/80 bg-card p-3` (Framer + `useReducedMotion` parity with rest of app)

---

## shadcn primitives in repo (extracted)

- **Card** (`components/ui/card.tsx`): default `rounded-lg border border-border bg-card shadow-sm`; `CardHeader` `gap-1.5 p-6`; `CardTitle` `font-display text-xl font-semibold leading-tight`; `CardDescription` `text-sm text-muted-foreground`
- **Button** (`components/ui/button.tsx`): `rounded-md`, `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`, `duration-200`, `motion-reduce:transition-none`

---

## Rejected defaults (for this product)

| Default | Replacement |
|---------|-------------|
| Sidebar + dense data grid | Topic-led orientation pages, narrative cards |
| Neon multi-accent UI | Single primary + phase accents only where metaphor demands |
| Inter / system-only sans | Fraunces + Source Sans 3 for distinct editorial + readable UI |

---

## Next steps

1. After any major visual change, re-run **extract** or patch this file; run **audit** against new UI.
2. When direction shifts, refresh **Domain anchors**, **Signature**, and **Rejected defaults** so codegen doesn’t drift.
