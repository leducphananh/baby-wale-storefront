---
name: baby-wale-domain
description: Stable Baby Wale domain facts relevant to the storefront — retailer type, Supplier vs Distributor, selling price, guest checkout, web visibility, draft website order, no reservation, payment methods, deferred auth. Links to the S0 document as authoritative architecture. Read when building any customer-facing feature.
---

# Baby Wale domain (storefront)

## Apply when
Building any storefront feature, writing customer copy, or reasoning about order /
stock / pricing behavior.

## Authoritative context

The full contract is
[`docs/S0-requirements-and-architecture.md`](../../../docs/S0-requirements-and-architecture.md).
This skill is a short, stable summary — do not duplicate the whole document here, and
when the two disagree, S0 + CLAUDE.md corrections win.

## Stable facts

- **Baby Wale is a mother & baby retailer** (diapers, formula/milk, baby care). The
  storefront is its public shop; the admin app is the internal system of record.
- **Supplier ≠ Distributor.** `distributor` may appear as public product metadata.
  `supplier` and all purchasing data are internal — never on the storefront.
- **One storefront price:** `products.selling_price` (integer VND). `tiktok_price` /
  `shopee_price` / `default_purchase_price` are internal.
- **Guest checkout only in MVP.** No customer accounts, no customer Supabase Auth.
  Customer auth/RBAC is deferred (S12), gated on admin RBAC hardening; `profiles.role`
  is not authorization-bearing.
- **Product web visibility** is opt-in via `products.is_web_visible` (+ `status =
  'active'`). Never auto-publish every active product.
- **A website order is created as `orders.status = 'draft'`, `source = 'website'`.**
  It does not reduce inventory, is not revenue, is not a completed order. Admin reviews
  and runs `complete_order()` to fulfil. Customer-facing label:
  **"Đơn mới – chờ xác nhận"**.
- **No stock reservation in MVP.** Checkout validates sellable stock but does not
  reserve or decrement. Two customers can order the last unit; admin reconciles.
- **Inventory source of truth:** `product_batches.remaining_quantity`; sellable stock
  excludes expired batches. Storefront shows `Còn hàng` / `Hết hàng` only.
- **Payment methods:** COD and manual bank transfer. No gateway in MVP (S11). Placing
  an order creates no payment; the order is `unpaid` until admin records money after
  completion.
- **No discounts / coupons / loyalty** in the storefront roadmap through S12.
  `discount = 0` everywhere.
- **Historical order truth:** `order_items` price/quantity are snapshots; the
  storefront never rewrites order history.
- **Business timezone `Asia/Ho_Chi_Minh`**; DB timestamps UTC. **Integer VND**, never
  float.
- **Order lookup** is by an unguessable tracking token (hash stored), not by
  `order_number` alone.

## Anti-patterns to reject in review

- Treating a website `draft` order as revenue or as fulfilled.
- Showing `supplier`, cost, or batch data on a product page.
- Assuming a logged-in customer concept exists.
- Auto-listing every `status='active'` product on the storefront.
- Introducing a coupon field "for later".
