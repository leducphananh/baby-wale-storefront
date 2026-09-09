---
name: design-system
description: How the storefront design system is structured and consumed — semantic tokens, one consistent spacing/type/radius/shadow/container/grid/breakpoint scale, defined component states for buttons/fields/cards/price/badges. Token VALUES are NOT frozen in S0.5 — S2.4 Design Approval sets them; this skill is how to follow them.
---

# Design system

## Apply when
Setting up Tailwind/theme config, building a shared UI primitive, or styling any
component.

## Status

**Do not freeze actual color / spacing / radius / shadow values in S0.5 or S1.** S2.4
Design Approval defines the real values. This skill defines the *shape* of the system
and the discipline for consuming it once approved.

## The system must define (values set at S2.4)

- **Semantic color tokens** — `bg`, `surface`, `border`, `text`, `text-muted`,
  `primary` (blue trust), `accent` (pink), `success`/`in-stock`, `danger`/`out-of-stock`,
  `focus-ring`. Components reference roles, never raw hex.
- **Spacing scale** — one consistent step set; all padding/margin/gap come from it.
- **Typography scale** — a fixed set of sizes/weights/line-heights with semantic names
  (display, h1–h3, body, small, price). One font stack with a real fallback.
- **Radii**, **border widths**, **shadow language** (a small, named set — e.g.
  `shadow-card`, `shadow-overlay`), used consistently.
- **Container widths**, the **product grid** definition, and **responsive
  breakpoints** (mobile-first, small → up — `mobile-first-storefront`).
- **Component states** for the shared primitives: `Button` (variants + hover/active/
  focus/disabled/loading), form `Field` (default/focus/error/disabled + associated
  message), `Card`, `Price` treatment (regular; room for a future compare-at), `Badge`
  / `StockBadge` (text + icon, never color-only).

## Rules

1. **Consume tokens, never arbitrary values.** No `bg-[#f5c6d0]`, no `p-[13px]`, no
   one-off `text-[19px]`. If a needed value doesn't exist as a token, that's a design
   question, not a Tailwind arbitrary value.
2. **No per-page visual system.** A feature page composes existing primitives and
   tokens; it does not introduce its own spacing rhythm, type sizes, or shadows
   (`visual-consistency`).
3. **One definition per concept.** Price formatting, the stock badge, the primary
   button — each exists once and is reused.
4. **States are complete.** Every interactive primitive has defined and implemented
   hover, focus-visible, active, disabled, and (where async) loading states.
5. **Mobile-first tokens.** Breakpoints scale up from the ~390px base; the base is not
   an afterthought.
6. **After S2.4, token values are a contract** — changing global radius/shadow/type/
   color language requires explicit user approval (CLAUDE.md §11).
7. **Follow approved tokens exactly when implementing from Figma** (`figma-to-code`) —
   map a Figma value to its matching token, don't approximate with an arbitrary class.

## Anti-patterns to reject in review

- Arbitrary Tailwind values (`w-[327px]`, `text-[#333]`) where a token exists or should.
- Two "primary button" implementations with slightly different padding.
- A page section defining its own heading sizes instead of the type scale.
- A `StockBadge` that conveys status by color alone.
- Committing final hex/spacing values as the token set before S2.4.
