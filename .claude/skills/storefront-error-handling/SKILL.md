---
name: storefront-error-handling
description: Distinguish loading / empty / error / unavailable / out-of-stock / price-changed / validation / checkout-failure / checkout-success states and render each deliberately. Never show raw Postgres errors, SQLSTATE, Supabase internals, or stack traces. Customer messages are Vietnamese and actionable.
---

# Storefront error handling

## Apply when
Building any page or endpoint that can fail or that has more than a plain success
state: catalog, product, cart, checkout, order lookup, search.

## States to design separately

`loading` · `empty` (no results / empty cart) · `error` (unexpected, retryable) ·
`not found` (product/order doesn't exist) · `unavailable` (archived / not web-visible) ·
`out of stock` · `quantity adjustment required` · `price changed` · `validation error`
(field-level) · `checkout failure` · `checkout success`.

Each is visually and semantically distinct — a customer must know whether retrying
helps, whether to fix an input, or whether the item is simply gone.

## Rules

1. **Never expose raw internals.** No Postgres error text, `SQLSTATE`, Supabase client
   error objects, RPC raise strings, or stack traces reach the customer. The RPC raises
   with stable prefixes; the Route Handler maps prefix → error code → Vietnamese
   message; anything unmapped → a generic `ORDER_CREATE_FAILED` message + a server log.
2. **Use the stable error contract** (designed in S0 Part E7): `PRODUCT_NOT_FOUND`,
   `PRODUCT_UNAVAILABLE`, `OUT_OF_STOCK`, `QUANTITY_ADJUSTMENT_REQUIRED`,
   `PRICE_CHANGED`, `INVALID_QUANTITY`, `INVALID_CUSTOMER_DATA`, `DUPLICATE_CHECKOUT`
   (returns the original confirmation, not an error), `ORDER_CREATE_FAILED`,
   `RATE_LIMITED` (S13). Client maps each to a Vietnamese message.
3. **Expected domain rejections vs unexpected failures.** "Hết hàng" / "giá đã thay
   đổi" are expected — show a specific, calm message and a next step. A timeout / 500 is
   unexpected — show a generic retryable message; don't parse it as a domain error.
4. **"Not found" ≠ "error".** A missing product/order renders a not-found state
   (optionally 404/410), distinct from a network/server error state.
5. **Messages are Vietnamese and actionable** — name the problem and the fix
   ("Chỉ còn 3 sản phẩm. Vui lòng điều chỉnh số lượng."), not "Đã xảy ra lỗi".
6. **Errors are announced, not just colored** (`accessibility`) and, for forms,
   associated with the field (`react-hook-form-zod`).
7. **A top-level error boundary / `error.tsx`** catches render crashes with a
   recoverable Vietnamese "đã xảy ra sự cố" screen — a backstop, not a substitute for
   handling expected states locally.
8. **Log unexpected errors with context** (which endpoint, which product/order id) but
   **no PII** and no payment details (`frontend-storefront-security`).
9. **Never swallow errors** — no empty `catch {}`. Every failure surfaces or is
   deliberately handled with a comment.

## Anti-patterns to reject in review

- A toast showing `error.message` straight from Supabase.
- Out-of-stock rendered identically to a network error.
- "Đã xảy ra lỗi" as the only feedback for a fixable validation problem.
- `catch (e) { console.log(e) }` with no user-facing result.
- Postgres `RAISE` text or a stack trace visible in the checkout UI.
