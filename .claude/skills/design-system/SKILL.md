---
name: design-system
description: How the storefront design system is structured and consumed — semantic tokens, one consistent spacing/type/radius/shadow/container/grid/breakpoint scale, defined component states for buttons/fields/cards/price/badges. Token VALUES are FROZEN in docs/design/S2.4-design-system-and-approval.md (DESIGN APPROVED V1); this skill is how to follow them.
---

# Design system

## Apply when
Setting up Tailwind/theme config, building a shared UI primitive, or styling any
component.

## Status — DESIGN APPROVED V1 (frozen at S2.4)

**`docs/design/S2.4-design-system-and-approval.md` is the authoritative token source** —
final colors (with contrast verification), the Be Vietnam Pro type ramp, the 4px-base
spacing scale (incl. the ≤374px compact-mobile adaptation), radii, elevation, control
sizing, the responsive grid, and every component's design contract. **Do not restate
the token table here or in code comments** — read that document. This skill covers only
the *discipline* for consuming it. **S2.5 wired every token into `src/app/globals.css`
and Tailwind v4** (`docs/design/S2.5-design-system-implementation.md`) plus a themed
primitive set in `src/components/ui` / `layout` / `site` — reuse those, don't
re-derive a value or a second `Button`/`Input`/`Container`.

## The system defines (values frozen in the S2.4 doc — read it, don't guess)

- **Semantic color tokens** — `--color-bg`, `--color-surface`, `--color-surface-subtle`,
  `--color-text`, `--color-text-muted`, `--color-border`, `--color-primary(-hover/
  -pressed/-tint)`, `--color-accent(-tint/-text)`, `--color-success(-bg)`,
  `--color-warning(-bg)`, `--color-danger(-bg)`, `--color-focus`. Components reference
  roles, never raw hex. **`--color-accent` is never a fill behind text or a numeral**
  (fails AA at ~4.05:1) — only a tint-with-dark-text pairing or a non-text dot.
- **Spacing scale** `2/4/8/12/16/20/24/32/40/48/64`; mobile gutter 16 (compact ≤374px:
  12), grid gap 12/20 (compact: 10/20).
- **Typography scale** — semantic roles (display, h1–h3, body, body-sm, caption,
  product-name-card/pdp, price-large/card/total, button, label, input), one font
  (Be Vietnam Pro), tabular numerals on every price role.
- **Radii** `xs 6 / sm 10 / md 14 / lg 20`. **Elevation** `flat / raise / overlay` — one
  shadow language, `ProductCard` default is `flat`.
- **Container** desktop max-width 1200px. **Grid** 2 col mobile / 3 col tablet / 4 col
  desktop. **Breakpoints** `768 / 1024 / 1280` (Tailwind's default `md`/`lg`/`xl`,
  unmodified — the S2.4 doc defines no `480` tier), plus a custom `compact` variant for
  the ≤374px case (`@media (max-width: 374px)`, not a standard min-width breakpoint).
- **Component states** for every shared primitive (`Button`, `Field`, `ProductCard`,
  `PaymentRow`, badges, …) — see the S2.4 doc §10 for the frozen contract per component.

## Rules

1. **Consume tokens, never arbitrary values.** No `bg-[#f5c6d0]`, no `p-[13px]`, no
   one-off `text-[19px]`. If a needed value doesn't exist as a token, that's a Design
   Deviation Proposal (S2.4 §19), not a Tailwind arbitrary value.
2. **No per-page visual system.** A feature page composes existing primitives and
   tokens; it does not introduce its own spacing rhythm, type sizes, or shadows
   (`visual-consistency`).
3. **One definition per concept.** Price formatting, the stock badge, the primary
   button — each exists once and is reused.
4. **States are complete.** Every interactive primitive implements the states frozen
   in the S2.4 doc — hover, focus-visible, active, disabled, and (where async) loading.
5. **Mobile-first tokens.** Breakpoints scale up from the ~390px base (compact rules
   apply ≤374px — 2 columns are preserved, never 1).
6. **Token values are now a contract.** Changing global color/radius/shadow/type
   language requires a **Design Deviation Proposal** (S2.4 §19) and explicit user
   approval — not a code-review nit, a governance step.
7. **Follow approved tokens exactly when implementing from Figma or the S2.3/S2.4
   evidence** (`figma-to-code`) — map a value to its matching token, don't approximate
   with an arbitrary class.

## Anti-patterns to reject in review

- Arbitrary Tailwind values (`w-[327px]`, `text-[#333]`) where a token exists or should.
- Two "primary button" implementations with slightly different padding.
- A page section defining its own heading sizes instead of the type scale.
- A `StockBadge` or count badge that conveys status by color alone, or uses
  `--color-accent` behind text/a numeral.
- Re-deriving hex/spacing values instead of reading `docs/design/S2.4-design-system-and-approval.md`.
