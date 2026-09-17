---
name: react-hook-form-zod
description: Interactive storefront forms (checkout, order lookup) use React Hook Form + Zod. Client validation is UX; server validation is mandatory; the DB/RPC is the business authority. Preserve field values on recoverable errors, friendly Vietnamese messages, a pending-submit guard, no reliance on a disabled button for security.
---

# React Hook Form + Zod (storefront)

## Apply when
Building or changing the checkout form, the order-lookup form, or any other interactive
customer input form.

## The three layers

| Layer | Purpose | Authority |
| --- | --- | --- |
| Client Zod (RHF resolver) | instant feedback, good messages | **UX only** |
| Server Zod (Route Handler) | reject malformed requests before the RPC | **mandatory** |
| DB constraints + RPC validation | business invariants (price, stock, visibility, phone) | **authoritative** |

## Rules

1. **Every form has a Zod schema** shared conceptually with the server check. The
   client uses it via the RHF resolver; the Route Handler re-validates the parsed body
   with the server schema. Never ship a form whose only validation is client-side.
2. **Phone normalization is one pure, unit-tested function** (`vietnamese-ecommerce-ui`)
   used by the client schema and echoed by the RPC. Store the canonical `0XXXXXXXXX`
   form.
3. **Validation messages are friendly Vietnamese**, field-specific, and actionable
   ("Số điện thoại không hợp lệ", "Vui lòng nhập địa chỉ nhận hàng").
4. **Preserve entered values on a recoverable server error.** A `PRICE_CHANGED`,
   `QUANTITY_ADJUSTMENT_REQUIRED`, or transient `ORDER_CREATE_FAILED` must not wipe the
   customer's name/phone/address. Re-render the form populated, with the issue shown.
5. **Pending-submit guard.** Disable the submit control while `isSubmitting` /
   the request is in flight so the customer can't double-click. This is the **first**
   line of defense only — the real duplicate-order guarantee is the idempotency key +
   `UNIQUE` constraint (`checkout-security`). Never call a mutation "safe" because the
   button was disabled.
6. **No security decision depends on a disabled/hidden control.** Server + DB enforce;
   the UI only reflects.
7. **Map server error codes to field errors where attributable** (e.g.
   `INVALID_CUSTOMER_DATA` → the relevant field) and to a form-level message otherwise
   — never show a raw error string (`storefront-error-handling`).
8. **Accessible** — associated labels, `aria-invalid` / `aria-describedby`, focus moved
   to the first error (`accessibility`).

## Anti-patterns to reject in review

- A checkout form with client Zod but no server-side re-validation in the handler.
- A server error clearing the whole form.
- Duplicate-submit "prevented" only by `disabled` with no idempotency key.
- Phone validation logic inlined in the schema instead of the shared tested function.
- English or raw-code error text shown to the customer.
