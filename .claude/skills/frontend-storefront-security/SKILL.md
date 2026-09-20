---
name: frontend-storefront-security
description: Storefront frontend/server security — XSS and safe rendering, no untrusted HTML, URL/search-param validation, secret handling (no service_role, no NEXT_PUBLIC secrets), checkout tampering, order enumeration, rate-limit-ready endpoints, idempotency, PII handling, no private data in client logs, unguessable tracking tokens.
---

# Storefront security

## Apply when
Handling user input, URL/search params, rendering user-influenced content, wiring
secrets/env, designing an endpoint, logging, or anything touching customer PII or
order identifiers.

## Rules

1. **Secrets.** Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are
   public. **No `service_role` key** in the browser or on the Next server (CLAUDE.md
   §7). Any future secret is unprefixed, server-only, never in a `NEXT_PUBLIC_*` var,
   never in client bundles or logs. `.env.local` gitignored; only `.env.example` with
   placeholders is committed. Never reuse production credentials in tests/CI.
2. **The browser is untrusted** (`checkout-security`). Price, totals, discount, status,
   payment status, batch IDs, COGS, stock — never accepted from the client. Server/DB
   recompute and decide.
3. **XSS / safe rendering.** Render text as React children. **No
   `dangerouslySetInnerHTML`** for product descriptions, customer notes, or any
   user/admin-authored content without a sanitizer (DOMPurify) and a documented reason
   — default is plain text. No untrusted HTML, ever.
4. **Validate every URL and search-param value** as attacker-controlled: `slug`,
   `token`, `?q`, `?danh-muc`, `?sap-xep`, `?trang`. Parse with Zod / an allow-list
   (sort keys, page as a positive int, query length-capped and delimiter-sanitized
   before an `ILIKE`). Never string-concatenate a param into a query filter — use the
   query builder / parameterized RPC args.
5. **Order enumeration.** Guest order lookup is by an **unguessable tracking token**
   (32 bytes, URL-safe); the DB stores **only its SHA-256 hash**. Never allow lookup by
   sequential `order_number` alone. `order_number` is a display/memo reference only.
6. **Tracking tokens and any other identifiers handed to customers are unguessable**
   and not logged. They live in the success URL and the customer's hands only.
7. **Idempotency.** Checkout carries a client-generated UUID; `orders.idempotency_key`
   is `UNIQUE`; replays return the original confirmation (`checkout-security`).
8. **Rate-limit-ready endpoints.** `/api/checkout`, `/api/cart/revalidate`, and the
   lookup endpoint are shaped so a rate limiter (S13) can wrap them: bounded payloads,
   a stable client key, fast rejection, structured `RATE_LIMITED` response.
9. **PII handling.** Customer name/phone/address/email appear only where needed. Never
   put PII or order tokens in query strings that get logged/referrer-leaked, in
   analytics events, or in client-side `console` logs. Server logs carry ids, not
   payloads.
10. **No private data in client logs or error messages** — no customer records,
    payment details, tokens, or Supabase internals in `console.*` or user-facing text
    (`storefront-error-handling`).
11. **Route/UI gating is not authorization.** `noindex` and hidden buttons are UX;
    real enforcement is RLS + `SECURITY DEFINER` RPC contracts.
12. **Dependencies are attack surface** — don't add a package for something the stack
    already covers.

## Anti-patterns to reject in review

- A `service_role` key in any env var or a `NEXT_PUBLIC_`-prefixed secret.
- `dangerouslySetInnerHTML` for a product description or customer note.
- `?trang=` / `?q=` used unvalidated in a query.
- Order lookup accepting `ORD-001` with no token.
- Storing the plaintext tracking token in the DB.
- `console.log(order)` with customer contact details.
