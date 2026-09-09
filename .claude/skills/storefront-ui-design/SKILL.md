---
name: storefront-ui-design
description: Baby Wale visual direction — cute, clean, warm, trustworthy, modern e-commerce. What to avoid (childish overload, gradient/pink excess, giant rounded cards, random shadows, AI-generic landing look). Brand cues to lean on. Final tokens are NOT set here — S2.4 Design Approval defines them.
---

# Storefront UI design direction

## Apply when
Making any visual decision before S2.4, or implementing screens after design approval.

## Status

**Do not invent final visual tokens (colors, spacing, radii, type scale) in S0.5/S1.**
S2 Design Discovery and **S2.4 Design Approval** define them. This skill sets
*direction and guardrails* so early scaffolding and moodboard work stay on-brand.

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
5. **After S2.4, the approved design is a contract** (CLAUDE.md §11) — implement it
   faithfully; do not re-style it while coding.

## Anti-patterns to reject in review

- A new page introducing its own gradient/color/radius language.
- Pink used as the primary brand color across large surfaces.
- Decorative shadows/blobs added ad hoc per component.
- Placeholder "lorem + emoji card" sections shipped as real UI.
- Final hex values / spacing scales committed as "the tokens" before S2.4.
