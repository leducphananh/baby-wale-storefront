---
name: code-review
description: Project-specific self-review checklist for storefront changes before calling them done — security/trust, business correctness, data contract, server/client boundary, checkout, SEO/a11y/mobile, states, quality, verification. Distinct from the built-in /code-review command.
---

# Code review checklist (storefront)

## Apply when
Finishing an implementation task and self-reviewing, or reviewing a change in this
repo. (For the interactive multi-effort tool, use the `/code-review` command; this is
the mental checklist while working.)

## Checklist

**Security & trust**
- [ ] No `service_role` key anywhere; no secret in a `NEXT_PUBLIC_*` var
      (`frontend-storefront-security`).
- [ ] No browser-supplied price/total/status/stock/COGS/batch trusted; server/DB
      decides (`checkout-security`).
- [ ] URL/search params validated (Zod / allow-list); no string-concatenated query
      filters.
- [ ] No `dangerouslySetInnerHTML` without a sanitizer + reason.
- [ ] Order identifiers are unguessable tokens (hash stored), not `order_number` alone.

**Data contract**
- [ ] Catalog reads go through a public read RPC; no `anon` `SELECT` on base tables;
      `product_batches` not exposed (`public-data-contract`).
- [ ] The DTO contains only safe fields — no cost, supplier, batch, `minimum_stock`,
      `tiktok_price`/`shopee_price`, staff data.
- [ ] Availability is a boolean/label, not a number.

**Boundary & architecture**
- [ ] Server Components by default; `"use client"` only at interactive leaves; no
      `"use client"` route/layout root.
- [ ] No server-only module imported by a client component.
- [ ] Server-fetched data not duplicated into TanStack Query / a store; TanStack Query
      not added without cause.
- [ ] New code in the right layer; no `supabase.from` in a component.

**Business correctness**
- [ ] Integer VND only; no float money math.
- [ ] Website order is `draft` / `source='website'`; storefront never calls
      `complete_order` / `cancel_order` / `adjust_inventory`.
- [ ] Shipping fee not folded into totals; note shown instead (CLAUDE.md §8).
- [ ] One atomic RPC for order creation; idempotency key present.

**Caching**
- [ ] Checkout / cart-revalidate / order-lookup are `no-store`.
- [ ] Catalog uses the right revalidate tier; cache tags where a future webhook needs
      them.

**SEO / a11y / mobile**
- [ ] Meaningful server-rendered content; correct `generateMetadata` / canonical;
      private pages `noindex` + in `robots.ts`.
- [ ] One `<h1>`; semantic HTML; labelled controls; visible focus; icon-button names;
      status not color-only.
- [ ] Works at ~390px; touch targets adequate; primary CTA reachable.

**States**
- [ ] loading / empty / not-found / unavailable / out-of-stock / price-changed /
      validation / failure / success each handled; no raw Postgres/Supabase errors
      shown; messages Vietnamese and actionable.

**Quality**
- [ ] No dead / commented-out code; files focused; naming per conventions; no
      duplicated business rule.
- [ ] No `any` / unjustified casts; DTO types separate from generated row types.

**Verification** (once the project exists)
- [ ] `lint`, `typecheck`, `test`, `build` all green for your changes.
- [ ] Tests added/updated; no test hits live Supabase.

## Anti-patterns to reject

- Marking a task done without running lint/typecheck/build.
- "It looks right in the browser" as the whole review.
- A widening of `anon`/public access with no security note in the completion report.
