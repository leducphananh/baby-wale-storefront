---
name: figma-to-code
description: Turning an approved Figma design into code faithfully — inspect the real Figma, preserve hierarchy/typography/spacing/component states/image ratios/responsive behavior, reuse design tokens, never approximate layouts or invent arbitrary Tailwind values, never redesign an approved screen while implementing it. Applies from S2.4 onward.
---

# Figma-to-code

## Apply when
Implementing any screen or component from a Figma design after S2.4 Design Approval.

## Principle

**An approved Figma design is a visual contract.** Implementation reproduces it; it
does not reinterpret it.

## Rules

1. **Inspect the actual Figma file** (frames, layers, auto-layout, constraints, the
   variables/tokens panel) before writing code. Do not implement from a screenshot or
   memory when the file is available.
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
   color / rearrange this section" during the build. Changes to an approved screen go
   back to the user for approval (CLAUDE.md §11).
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
