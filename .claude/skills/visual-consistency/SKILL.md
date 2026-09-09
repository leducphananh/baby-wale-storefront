---
name: visual-consistency
description: Prevent the "homepage looks like Site A, product page like Site B, checkout like Site C" failure. Every page reuses the approved Header/Footer/Container/ProductCard/Price/StockBadge/Button/Inputs/typography/spacing/iconography/radius/shadow. New features extend the system, never fork it.
---

# Visual consistency

## Apply when
Building any new page or section, or reviewing one. Especially when a design "feels a
bit different" from the rest of the site.

## The failure this prevents

AI-built storefronts commonly drift: each screen is internally fine but the set looks
like three different websites — different nav treatment, different card style,
different button, different spacing rhythm, different price formatting.

## Rules

1. **Reuse the approved shared components on every page:** `Header`, `Footer`,
   `Container` (page width + gutters), `ProductCard`, `Price`, `StockBadge`, `Button`,
   form inputs, and the shared typography components. Do not hand-roll a page-local
   variant.
2. **One spacing rhythm, one type scale, one radius, one shadow language, one icon
   set** across the whole site — all from `design-system` tokens.
3. **A new feature page extends the system.** If it needs something new, add it to the
   shared primitives / tokens (a reviewed change), don't create a parallel design
   language inside the feature folder.
4. **The product card is defined once.** Homepage strips, category pages, search
   results, and related-products all render the same `ProductCard`. No "homepage
   card" vs "listing card".
5. **Price is rendered by `Price` everywhere** — same format, same currency treatment,
   same emphasis (`vietnamese-ecommerce-ui`).
6. **Availability is rendered by `StockBadge` everywhere** — same labels
   (`Còn hàng` / `Hết hàng`), text + icon, never color-only.
7. **Header and footer are identical on every route** (server shell + small client
   cart island) — no page ships its own nav.
8. **If two screens must differ**, that difference is a deliberate, approved design
   decision recorded in Figma / with the user — not an implementation drift.

## Anti-patterns to reject in review

- A second product-card component created for one section.
- Checkout using a different button style / input style than the rest of the site.
- A section with its own heading sizes or spacing scale.
- Price shown as a raw number in one place and via `Price` elsewhere.
- A page-local header/nav variant.
