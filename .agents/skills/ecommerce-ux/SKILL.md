---
name: ecommerce-ux
description: Customer-facing commerce UX for Baby Wale — the browse → product detail → add to cart → cart → checkout flow must be excellent, commercial hierarchy (identity, image, price, availability, quantity, CTA, trust), don't overcrowd, out-of-stock stays visible and informative.
---

# E-commerce UX

## Apply when
Designing or building any customer-facing page or flow: homepage, catalog listing,
product detail, cart, checkout, order success/lookup.

## The critical flow

`browse → product detail → add to cart → cart → checkout → success`

Every step must be low-friction. This flow outranks marketing sections, filters, and
decoration in priority and polish. Test it end to end on mobile (`mobile-first-storefront`).

## Commercial hierarchy (product detail, top to bottom of importance)

1. **Product identity** — name, brand, key variant/size info.
2. **Images** — large, real, multiple angles.
3. **Price** — unambiguous, prominent, `Price` component, VND.
4. **Availability** — `Còn hàng` / `Hết hàng`, honest.
5. **Quantity** — stepper, min 1, stock-aware max (UX).
6. **Primary CTA** — "Thêm vào giỏ" (or disabled "Hết hàng"), unmistakable, thumb-reachable.
7. **Trust information** — origin/manufacturer/distributor, delivery & payment note,
   store contact, return/contact policy.

## Rules

1. **The primary CTA is always obvious and reachable** — on mobile it stays accessible
   (e.g. sticky action bar) without covering price/availability.
2. **Out-of-stock products stay visible** with `Hết hàng` and a disabled add button —
   never hidden (better UX, better SEO, preserves inbound links). No exact stock
   numbers.
3. **Don't overcrowd.** Each page has a clear job. Whitespace and a single clear next
   action beat a wall of badges, banners, and cross-sells.
4. **Cart is honest and editable** — line items with image/name/unit/qty/price, live
   subtotal, clear "tiến hành thanh toán", clear empty state, easy quantity change and
   remove.
5. **Checkout is short and reassuring** — minimal required fields (name, phone,
   address; email optional), clear payment-method choice (COD / bank transfer), the
   shipping-fee note ("sẽ được nhân viên xác nhận"), an explicit final review of items
   + subtotal, one submit that disables while pending.
6. **Surface every cart-revalidation issue before submit** — price changed, only n
   left, out of stock, unavailable — with a clear path to fix and re-confirm
   (`checkout-security`).
7. **Success page** confirms the order, shows `order_number`, the tracking link, next
   steps ("nhân viên sẽ liên hệ xác nhận"), and bank-transfer instructions when
   relevant.
8. **Empty, loading, and error states are designed**, not blank — for listing, cart,
   product, and lookup (`storefront-error-handling`).

## Anti-patterns to reject in review

- Hiding out-of-stock products instead of showing `Hết hàng`.
- A product page where the price or add-to-cart button is below three promo sections.
- A checkout form asking for more than the required fields.
- Silent quantity/price adjustments at checkout with no customer confirmation.
- A cart with no empty state and no obvious checkout button on mobile.
