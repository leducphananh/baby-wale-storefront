---
name: nextjs-cache-correctness
description: Display cache vs transaction authority. Which storefront data may be stale (catalog copy, display price, stock badge) and which must always be live (checkout, order lookup). TTL tiers and on-demand revalidation. Read before setting revalidate/cache options.
---

# Next.js cache correctness

## Apply when
Setting `revalidate`, `cache`, `fetch` cache options, `dynamic`, `revalidateTag` /
`revalidatePath`, or deciding whether a page can be static/ISR.

## The core distinction

**Display cache ≠ transaction authority.** A stale *displayed* price is tolerable; a
stale *charged* price is not.

## Tiers

| Data | Strategy |
| --- | --- |
| Product descriptive content (name, description, brand, images, category) | ISR, e.g. `revalidate = 3600`, + on-demand `revalidateTag('product:<id>')` / `revalidateTag('catalog')` from a future admin webhook. Safe to be stale. |
| Display price on catalog / detail | Same cache family, shorter (e.g. `revalidate = 600`). Display-only. |
| Sellable-stock badge (`Còn hàng` / `Hết hàng`) | `revalidate = 60`–`120`, or reuse the 10-min cache and accept minor lag. **Never presented as a guarantee.** |
| Cart revalidation, checkout, order lookup | **`no-store` / fully dynamic.** Always live. |

## Rules

1. **Checkout is the sole pricing and stock authority.** `create_storefront_order()`
   re-reads `selling_price` and sellable stock transactionally at call time. Never
   charge from cached catalog state.
2. **Never cache** `/api/checkout`, `/api/cart/revalidate`, `/api/orders/[token]`, or
   the order-success page. Mark them `no-store` / `export const dynamic = 'force-dynamic'`.
3. **Tag catalog reads** so a future admin publish webhook can `revalidateTag` a single
   product or the whole catalog instead of waiting for the TTL.
4. **A stale stock badge must never block or mislead checkout.** The badge is a hint;
   the revalidate endpoint and the RPC decide real availability, and the customer sees
   `QUANTITY_ADJUSTMENT_REQUIRED` / `OUT_OF_STOCK` if it changed.
5. **Price drift is surfaced, never absorbed.** If cached display price ≠ live price at
   revalidation/checkout, return `PRICE_CHANGED` with the new figure; the customer must
   accept the new total before the order is created (`checkout-security`).
6. **Do not make a page dynamic just to be safe** when it only shows descriptive
   catalog content — that throws away SEO and speed. Pick the right tier.

## Anti-patterns to reject in review

- `create_storefront_order` trusting a `unit_price` that came from the cached catalog.
- The order-success page rendered with ISR / a `revalidate` value.
- A product page forced `dynamic` because "stock might change" instead of a short
  `revalidate` on the badge.
- No cache tags, so the only way to refresh a corrected price is the hour-long TTL.
