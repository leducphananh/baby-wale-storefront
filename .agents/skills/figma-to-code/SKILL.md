---
name: figma-to-code
description: Turning the approved design evidence into code faithfully — inspect the real source (no editable Figma file exists; use S2.4 tokens + S2.3/S2.3R specs + the Claude Design canvas), preserve hierarchy/typography/spacing/component states/image ratios/responsive behavior, reuse design tokens, never approximate layouts or invent arbitrary Tailwind values, never redesign an approved screen while implementing it. Applies from S2.4 (DESIGN APPROVED) onward.
---

# Figma-to-code

## Apply when
Implementing any screen or component against the approved design (S2.4 onward).

## Principle

**The approved design is a visual contract.** Implementation reproduces it; it does not
reinterpret it. **Source-of-truth order** (S2.4 §18): (1) `docs/design/S2.4-design-
system-and-approval.md` — tokens + component contracts; (2) `docs/design/S2.3-
high-fidelity-figma-design.md` (incl. S2.3R) — anatomy + screen specs; (3) the Claude
Design canvas v3 — rendered visual evidence; (4) S2.2 doctrine; (5) S2.1 IA. **No
editable Figma file exists** (the connected account is a Starter/View seat) — that is
not a blocker; if one is built later it must implement this hierarchy, not redefine it.

## Rules

1. **Inspect the real source** — the S2.4 doc's frozen tokens/contracts, the S2.3/S2.3R
   anatomy and screen specs, and the canvas's rendered artboards — before writing code.
   Do not implement from memory or invent a layout the sources don't specify.
2. **Preserve hierarchy** — the same visual and DOM order of identity, image, price,
   availability, CTA, supporting info.
3. **Preserve typography** — map each text style to the design-system type token
   (`design-system`). Same size/weight/line-height/letter-spacing relationships.
4. **Preserve spacing** — read auto-layout gaps/padding and map them to spacing tokens.
   Don't eyeball "about 16px".
5. **Preserve component states** — build every state shown or specified (hover, focus,
   active, disabled, loading, error, selected), not just the default frame.
6. **Preserve image ratios** — cards, detail images, and thumbnails keep the Figma
   aspect ratios; wire them into `next/image` sized boxes (`next-image-storefront`).
7. **Preserve responsive behavior** — implement the mobile frame and the desktop frame
   as designed; if only one is given, follow `mobile-first-storefront` and confirm
   breakpoints rather than inventing a layout.
8. **Reuse design tokens** — when Figma shows a value that matches a token, use the
   token. **Do not invent an arbitrary Tailwind value** (`p-[13px]`, `bg-[#eef]`) when
   a matching token exists; a genuine mismatch is a design question, not a workaround.
9. **Do not redesign while implementing.** No "I'll improve this spacing / swap this
   color / rearrange this section" during the build. A real problem is a **Design
   Deviation Proposal** (S2.4 §19), not a silent change — it goes back to the user for
   approval before any global rule changes.
10. **Reuse approved shared components** (`Header`, `Footer`, `Container`,
    `ProductCard`, `Price`, `StockBadge`, `Button`, inputs) — don't re-create a
    one-off version to match a frame that was drawn with the shared component
    (`visual-consistency`).

## Anti-patterns to reject in review

- Layout built "close enough" by eye instead of from auto-layout values.
- Arbitrary Tailwind values standing in for existing tokens.
- Only the default state implemented; hover/focus/error missing.
- A screen silently "improved" away from the approved design.
- A bespoke card component duplicating `ProductCard` for one page.
