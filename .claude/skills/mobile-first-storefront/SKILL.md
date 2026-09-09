---
name: mobile-first-storefront
description: Mobile is the primary target (~390px). Design and build from the small breakpoint up, not desktop-first-then-stack. Usable touch targets, thumb-reachable primary actions, the critical browse→checkout flow must be excellent on a phone.
---

# Mobile-first storefront

## Apply when
Laying out any page or component, choosing breakpoints, sizing interactive elements,
or reviewing responsive behavior.

## Principle

The primary customer is on a phone at **~390px wide**. Design the small layout first
and enhance upward. A desktop layout that merely stacks into a narrow column on mobile
is not acceptable.

## Rules

1. **Base styles target ~390px.** Breakpoints (`sm`, `md`, `lg`) add columns / spacing
   / density as the viewport grows — they don't undo a desktop assumption.
2. **The critical flow is excellent on mobile:** browse → product detail → add to cart
   → cart → checkout → success. Verify each step at 390px before calling a feature
   done.
3. **Touch targets are usable** — interactive elements have an adequate hit area
   (≈44×44px min) and enough spacing that adjacent targets aren't mis-tapped. This
   includes quantity steppers, remove buttons, filter chips, and pagination.
4. **The primary action is thumb-reachable** — "Thêm vào giỏ" on product detail and
   "Thanh toán" in cart/checkout are within easy reach (bottom-anchored / sticky where
   appropriate) without hiding price or availability.
5. **Content order is mobile-sensible** — on product detail, image → identity → price →
   availability → CTA come before long descriptive prose and related products.
6. **No horizontal scroll** at 390px (except deliberate carousels). Long product names,
   prices, and badges wrap or truncate gracefully.
7. **Tap, not hover, is the baseline interaction.** Nothing essential is hover-only;
   image zoom, tooltips, and menus work by tap.
8. **Forms are mobile-friendly** — correct `inputmode` / `type` (`tel` for phone),
   labels visible, error messages inline, the keyboard doesn't obscure the submit.
9. **Test real density** — a product grid is 2-up (or 1-up) on mobile, not a squeezed
   4-up.

## Anti-patterns to reject in review

- A layout authored at `lg` and only patched with `max-` overrides for small screens.
- 28px icon buttons packed together in the cart.
- The add-to-cart button only reachable after scrolling past promos on mobile.
- Horizontal page scroll at 390px from a fixed-width element or long unbroken text.
- Hover-only product-image zoom with no tap equivalent.
