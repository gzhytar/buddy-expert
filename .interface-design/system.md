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
| Konzultantské desatero / ilustrace | Image-forward principle cards, bounded aspect |

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
- **Konzultantské desatero list:** `ol.list-none space-y-4`; items `scroll-mt-20` for in-page anchor clearance.
- **Frame figure:** Container `rounded-xl border border-border/80 bg-[oklch(99%_0.01_95)] shadow-sm dark:bg-card`; caption `text-xs text-center text-muted-foreground`; inline `code` `rounded bg-muted px-1 font-mono text-[0.7rem]`.

---

## Reference cards — Konzultantské desatero & roles (extracted)

### Shared **article** shell (`OrientationPrincipleCard`, `ConsultingRoleCard`)

- Outer: `rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md motion-reduce:transition-none overflow-hidden`
- **Focus within:** `focus-within:ring-2 focus-within:ring-ring/60 focus-within:ring-offset-2 focus-within:ring-offset-background` (+ motion-reduce clears ring)
- **Body section padding:** `space-y-4 px-4 py-4 sm:px-5 sm:py-5`
- **Two-column grid (detail panels):** `grid gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6 lg:items-start max-w-5xl`
- **Footer meta strip:** `border-t border-border/60 bg-muted/10 px-4 py-2 sm:px-5 dark:bg-muted/5` + `text-[10px] leading-snug text-muted-foreground`

### Principle card — `OrientationPrincipleCard`

- **Left rail:** `border-l-4 border-l-primary/45` (desatero accent; role cards use phase rail instead)
- **Header:** same **hero** stack as `ConsultingRoleCard` — `relative isolate min-h-[168px] sm:min-h-[188px]`, absolute `PrincipleIllustration` `variant="hero"`, identical vignette + gradient readability layers, foreground `relative z-[1]` with title `drop-shadow-sm` and summary `text-[13px] font-medium leading-snug text-foreground/90 max-w-2xl`; `aria-describedby` when summary present; no meters row
- **Tips column:** section label `text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground`; body `text-[13px] leading-snug text-foreground/88 whitespace-pre-line`
- **Stories panel (“soft”):** `rounded-xl border border-muted-foreground/15 px-3 py-3 sm:px-4 sm:py-3.5 bg-muted/25 dark:bg-muted/15` + same label pattern as tips

### Consulting role card — `ConsultingRoleCard` (orientation roles)

- **Left rail:** `border-l-4` + `phaseLeftBorderClass(phaseKey)` → `lib/consulting-roles/card-content.ts` maps `contract-frame` / `company-diagnosis` / `leading-session` / `solution-creation` to `--jic-phase-*-border`; unknown → `border-l-border`
- **Header (hero, not sidebar):** `relative isolate min-h-[168px] sm:min-h-[188px] overflow-hidden border-b border-border/60`
  - **Image layer:** absolute inset `PrincipleIllustration` `variant="hero"`, `priority` when `illustrationPriority`; `min-h` matches header
  - **Readability stack (all `pointer-events-none`, `aria-hidden`):** vignette `bg-black/10 dark:bg-black/17`; horizontal gradients `from-background` / `via-background/93` / `to-background/78` (dark variants slightly stronger); `from-background/54 to-transparent` from right; vertical `from-background/52` fade from bottom
  - **Foreground:** `relative z-[1] space-y-2 px-4 py-3 sm:px-5 sm:py-4` → title `font-display text-base sm:text-lg font-semibold tracking-tight text-foreground drop-shadow-sm`; `summaryLine` `text-[13px] font-medium leading-snug text-foreground/90`; `whatItDoes` block uses inline label `font-medium text-foreground/80` (“Co role dělá:”) + `whitespace-pre-wrap` body `text-foreground/90`
  - **Meters:** `RoleStrengthMeters` sits in header under copy
- **Useful panel (emerald):** `rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08] px-3 py-3 sm:px-4 sm:py-3.5`; heading `text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-emerald-900/85 dark:text-emerald-200/95`; list `list-outside list-disc pl-4 text-[13px] leading-snug text-emerald-950/88 dark:text-emerald-50/88 marker:text-emerald-500/60 dark:marker:text-emerald-400/60`
- **Risks panel (amber):** same structure as useful with `amber-*` tokens (label “Rizika při přepálení”)
- **Self-eval (optional):** `showSelfEval` → `RoleSelfEvalControls` with `key` including sentiment for reset
- **Empty body:** if no useful/risk bullets, content grid omitted entirely

---

## PrincipleIllustration (extracted)

| Variant | Use |
|---------|-----|
| `card` | `aspect-[4/3]`, absolute fill `img`, paper-style wrapper `bg-[oklch(99%_0.01_95)] dark:bg-card` |
| `hero` | Full-bleed `object-cover` for orientation role / principle card headers; decorative (`alt=""`, `aria-hidden`) |
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
