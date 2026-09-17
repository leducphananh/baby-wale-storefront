---
name: accessibility
description: Accessibility baseline for the customer storefront — semantic HTML, one meaningful H1 per page, keyboard nav, visible focus, labelled controls, accessible icon-button names, form errors tied to fields, dialog/drawer focus behavior, non-color-only status, image alt text, reduced-motion, sufficient contrast, an accessible checkout. A design constraint, not cleanup.
---

# Accessibility (storefront)

## Apply when
Building any page or interactive UI: navigation, product grid, product detail, cart
drawer, dialogs, forms, checkout, filters, pagination.

## Principle

Accessibility is a **design and build constraint from the start**, not a pass at the
end. It also overlaps with SEO (semantic structure) and mobile UX (touch + focus).

## Rules

1. **Semantic HTML.** Real `<button>`, `<a>`, `<nav>`, `<main>`, `<header>`,
   `<footer>`, `<ul>` for lists. No `<div onClick>`. Landmarks on every page.
2. **One meaningful `<h1>` per page** — the product name on a product page, the
   category/page name elsewhere — and a correct heading order below it (no skipped
   levels for styling).
3. **Keyboard operable.** Every interactive element is reachable and usable by keyboard
   in a logical order; no positive `tabindex`. Carousels, steppers, filters, menus all
   work without a mouse.
4. **Visible focus.** A clear `:focus-visible` style (a real focus ring token) on every
   interactive element — never `outline: none` without a replacement.
5. **Labelled controls.** Every input has an associated `<label>`; placeholder is not a
   label. Selects, checkboxes, radios (payment method) included.
6. **Accessible names for icon-only buttons** — cart, close, quantity +/−, remove — via
   `aria-label` in Vietnamese ("Xoá khỏi giỏ", "Tăng số lượng").
7. **Form errors are associated with their field** (`aria-describedby`, `aria-invalid`)
   and announced; the checkout error summary moves focus to the first problem.
8. **Dialogs and the cart drawer manage focus** — focus moves in on open, is trapped
   while open, returns to the trigger on close; `Esc` closes. Use accessible primitives
   rather than re-implementing.
9. **Status is never color-only** — `StockBadge`, price-changed and out-of-stock
   notices, order status all pair color with text and/or an icon.
10. **Product images have meaningful `alt`** (`next-image-storefront`); decorative
    images use `alt=""`.
11. **Respect `prefers-reduced-motion`** — no essential information conveyed only
    through animation; reduce/disable non-essential motion.
12. **Sufficient contrast** for body text, prices, badges, and focus rings against
    their backgrounds (WCAG AA). Confirm at S2.4 token approval.
13. **Accessible checkout** — the whole flow (form, payment choice, review, submit,
    errors, success) is keyboard- and screen-reader-navigable end to end.

## Anti-patterns to reject in review

- A page with no `<h1>` or with three `<h1>`s for visual size.
- `outline: none` on focus with nothing replacing it.
- An icon-only cart/close/remove button with no accessible name.
- A validation error shown only as red text with no association to the input.
- The cart drawer not returning focus to its trigger on close.
- Stock or order status conveyed by color alone.
