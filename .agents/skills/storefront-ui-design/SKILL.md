---
name: storefront-ui-design
description: Baby Wale visual direction — cute, clean, warm, trustworthy, modern e-commerce. What to avoid (childish overload, gradient/pink excess, giant rounded cards, random shadows, AI-generic landing look). Brand cues to lean on. Final tokens are FROZEN in docs/design/S2.4-design-system-and-approval.md (DESIGN APPROVED V1).
---

# Storefront UI design direction

## Apply when
Making any visual decision, or implementing screens against the approved design.

## Status — DESIGN APPROVED V1

**Direction: Soft Trust Commerce, frozen at S2.4.** Final tokens (colors, spacing,
radii, type scale) live in **`docs/design/S2.4-design-system-and-approval.md`** — read
it before touching any visual value. This skill states the *feel* and guardrails; it
does not restate the token table.

## Desired feel

Cute **+** clean **+** warm **+** trustworthy **+** modern e-commerce. A mother & baby
shop that feels caring and safe, and also competent to take a payment.

## Brand cues to lean on

- Baby Wale whale / baby identity (reuse the existing logo asset — do not regenerate,
  CLAUDE.md §15).
- **Blue as the trust foundation**, **pink as an accent** (not the dominant color).
- Soft neutral / pastel surfaces, generous whitespace.
- Strong product imagery carrying the page.
- Clean commercial hierarchy (identity → image → price → availability → CTA).

## Avoid

- Childish visual overload; too many playful elements competing.
- Excessive gradients; pink everywhere; everything a giant rounded card.
- Random/arbitrary shadows and colors; every section styled differently.
- The AI-generic landing-page look (huge hero gradient, three emoji feature cards,
  vague copy).

## Rules

1. **One coherent system across every page** — homepage, catalog, product, cart,
   checkout share the same type, spacing, radius, shadow, and color language
   (`visual-consistency`, `design-system`).
2. **Restraint over decoration.** Whitespace, typography, and real product photos do
   the work; effects are minimal and consistent.
3. **Commerce hierarchy first** (`ecommerce-ux`) — visual polish never buries price,
   availability, or the primary CTA.
4. **Accessibility is part of the design** (`accessibility`) — contrast, focus states,
   non-color status, touch targets are design decisions, not later fixes.
5. **The approved design is a contract** (CLAUDE.md §11, S2.4 §19) — implement it
   faithfully from `docs/design/S2.4-design-system-and-approval.md`; do not re-style it
   while coding. A real problem is a Design Deviation Proposal (S2.4 §19), not a silent
   fix.

## Anti-patterns to reject in review

- A new page introducing its own gradient/color/radius language.
- Pink used as the primary brand color, or as a fill behind text/a numeral, anywhere.
- Decorative shadows/blobs added ad hoc per component.
- Placeholder "lorem + emoji card" sections shipped as real UI.
- Hex values / spacing values invented or approximated instead of read from
  `docs/design/S2.4-design-system-and-approval.md`.
