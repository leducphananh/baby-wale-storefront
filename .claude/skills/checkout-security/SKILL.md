---
name: checkout-security
description: Checkout is the sole pricing/stock authority. Browser cart values are display state; the server recomputes everything, validates in three layers, uses one atomic transaction and an idempotency key, surfaces price changes, and never optimistically shows success. Read before any checkout or cart-revalidation code.
---

# Checkout security

## Apply when
Building or changing `/thanh-toan`, `/api/checkout`, `/api/cart/revalidate`,
`create_storefront_order()`, or any code that turns a cart into an order.

## Principle

**Browser cart values are display state only.** The customer's browser submits, per
line, **`product_id` + `quantity`** — plus contact/shipping fields, payment method,
and an idempotency key. Nothing else about money or stock is trusted.

## Rules

1. **Three validation layers, all required:**
   - **Client Zod** — instant UX feedback (shape, required fields, qty ≥ 1).
   - **Server Zod in the Route Handler** — mandatory request validation before the RPC.
   - **DB / business layer in the RPC** — authoritative: product exists, is
     `active` **and** `is_web_visible`, qty is a positive integer, sellable stock ≥ qty.
2. **The server loads the authoritative `selling_price`** from `products` at call time
   and computes `unit_price`, `line_total`, and `subtotal`. Any client-supplied price /
   subtotal / total / discount is ignored.
3. **Validate sellable stock** per line (non-expired batch sum) at checkout. Reject
   lines that exceed it (`OUT_OF_STOCK` / `QUANTITY_ADJUSTMENT_REQUIRED`). MVP does
   **not** reserve or decrement stock — document that this is a check, not a lock.
4. **Validate product web visibility.** A product that is archived / not web-visible /
   deleted → `PRODUCT_UNAVAILABLE`, order not created.
5. **One atomic transaction.** The whole order (customer resolve + `orders` +
   `order_items`) is a single RPC invocation. **Never partially create an order** —
   no "insert order in Next, then insert items". Any error rolls everything back.
6. **Idempotency.** The client generates a UUID when the checkout form mounts and sends
   it with the submit. `orders.idempotency_key` is `UNIQUE`; a replay (double-click,
   retry, refresh) returns the **original** confirmation, not a second order. Disabling
   the submit button while pending is the first line of defense only — the constraint
   is the guarantee.
7. **Price changes are surfaced, never silently charged.** If live price ≠ the cart's
   cached price, return `PRICE_CHANGED` with the new figure; the customer must see and
   accept the new total before an order is created. Same for quantity adjustments.
8. **Clear the cart only after committed success** (the RPC returned a confirmation).
   If checkout fails, the cart stays intact.
9. **Never optimistically show "đặt hàng thành công".** Show success only from the RPC
   confirmation. The success page reads the order back by token, `no-store`.
10. **The order is not revenue and not completed.** `create_storefront_order` produces
    a `draft` / `source='website'` order, `payment_status='unpaid'`, no payment row,
    no inventory movement. Admin completes it later.
11. **Never trust or accept** batch IDs, unit cost, COGS, `payment_status`, or an order
    UUID from the browser. The success/lookup response returns only the safe fields
    (`storefront-error-handling`, `public-data-contract`).
12. **Shipping fee is not folded in.** Displayed total is goods subtotal; show
    "Phí vận chuyển sẽ được nhân viên xác nhận" (CLAUDE.md §8).

## Anti-patterns to reject in review

- The RPC using `p_items[i].unit_price` / `p_subtotal` from the payload.
- Order rows created across multiple non-transactional calls.
- Cart cleared on submit, before the confirmation comes back.
- A client-side "order placed!" screen shown before the server responds.
- A higher current price charged without an explicit customer re-confirmation step.
- Relying only on a disabled button to prevent duplicate orders (no idempotency key).
