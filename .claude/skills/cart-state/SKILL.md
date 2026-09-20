---
name: cart-state
description: Cart is client state, not server authority. Zustand + persist/localStorage, hydration-safe rendering, productId line identity, non-authoritative display snapshots, quantity rules, and clearing only after a committed order. Read before building or changing the cart.
---

# Cart state

## Apply when
Building or changing the cart store, cart drawer, `/gio-hang`, the header cart
indicator, the quantity stepper, or checkout's read of the cart.

## Principle

The cart is **per-browser client state**. The authoritative order is server-side. The
cart holds display snapshots only.

## Rules

1. **Zustand + `persist` middleware → `localStorage`.** Nothing else needs global
   client state in MVP. Do not store server records or catalog lists in Zustand
   (CLAUDE.md §10).
2. **Line shape:** `{ productId, slug, name, imageUrl, unit, quantity, cachedUnitPrice,
   cachedAt }`. The snapshot fields are **display-only**; `cachedUnitPrice` exists
   purely to detect drift and show "giá đã thay đổi". They are never sent as
   authoritative values to checkout.
3. **Line identity is primarily `productId`.** Adding an existing product increments
   its quantity.
4. **Quantity:** integer, min `1`; a `max` from last-known sellable stock is **UX
   only**. Real enforcement is `/api/cart/revalidate` and the checkout RPC.
5. **Hydration-safe.** The store is client-only. Guard against SSR mismatch: render the
   cart count / cart contents only after a `useHasHydrated()` flag flips post-mount
   (`persist` `onRehydrateStorage`). The server renders a neutral placeholder
   ("Giỏ hàng"). **Never read `localStorage` in an RSC.**
6. **Header cart indicator** is a small `"use client"` island subscribing to the store
   for the count; the header itself stays a server shell.
7. **Checkout submits `{ productId, quantity }` per line only.** The client calls
   `/api/cart/revalidate` first and surfaces every non-`OK` line (price changed, only
   n left, out of stock, unavailable) before it will submit.
8. **The cart survives a failed checkout.** Clear it **only** after the checkout RPC
   returns a committed confirmation.
9. **Removing an unavailable product** is an explicit user action after revalidation
   flags it — don't silently drop lines.

## Anti-patterns to reject in review

- Cart count rendered during SSR / before hydration, causing a hydration warning.
- `cachedUnitPrice` passed to `create_storefront_order` as the price to charge.
- Catalog query results cached in the Zustand store.
- Cart cleared in the submit handler instead of after the success confirmation.
- A `max` quantity attribute treated as real stock enforcement.
