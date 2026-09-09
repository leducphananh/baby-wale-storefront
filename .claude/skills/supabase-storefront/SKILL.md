---
name: supabase-storefront
description: Using the shared Supabase backend as the lower-trust storefront client — preserve admin hardening, anon key only, no service_role, SECURITY DEFINER RPC requirements, additive migration discipline for a shared backend. Read before any Supabase schema, RPC, RLS, or grant change.
---

# Supabase for the storefront

## Apply when
Designing or changing an RPC, RLS policy, grant, view, bucket, or migration that
touches the shared Supabase project; or wiring a Supabase client.

## Context

The storefront **shares one Supabase project with the admin**. The admin is hardened:
RLS enabled everywhere, every policy `TO authenticated`, `anon` revoked on every base
table and view, every mutating RPC `authenticated`-only. Shared-backend changes affect
**both** apps.

## Rules

1. **Never weaken admin hardening.** Do not loosen an `authenticated` policy, re-grant
   `anon` on a base table, or broaden a mutating RPC's `EXECUTE` for storefront
   convenience. Storefront access is **additive** and lives behind new, narrow
   surfaces.
2. **Anon / publishable key only.** Per-request `createServerClient` (`@supabase/ssr`)
   in RSC and Route Handlers. **No `service_role`** on the server or the browser (see
   `frontend-storefront-security`, CLAUDE.md §7).
3. **The storefront never calls admin/report/lifecycle RPCs** — `complete_order`,
   `cancel_order`, `adjust_inventory`, `confirm_import_receipt`, `create_order`,
   `update_order_draft`, `record_order_payment`, any `get_revenue_*` / `get_profit_*` /
   `get_*_alert_*`. No direct mutation of `orders`, `order_items`, `customers`,
   `product_batches`, or any critical table.
4. **Storefront RPCs are purpose-built and minimal.** Each public RPC:
   - is `SECURITY DEFINER` with `SET search_path = public, pg_temp`;
   - has explicit `REVOKE EXECUTE FROM public` and `GRANT EXECUTE TO anon` (+
     `authenticated` where a logged-in customer path exists later);
   - validates every input server-side (shape, range, existence, visibility);
   - returns **only** the storefront-safe contract (`public-data-contract`) — never an
     order UUID, `created_by`, COGS, batch data, or internal notes;
   - does one job (list products, get product by slug, list categories, create order,
     look up order by token).
5. **`create_storefront_order()` is one transaction.** Server-reads price and sellable
   stock, computes every money figure, generates `order_number` + a random tracking
   token (stores only its hash), inserts `orders` (`status='draft'`,
   `source='website'`, `payment_status='unpaid'`) and `order_items` — no
   `order_item_batches`, no inventory write. Any raise rolls the whole thing back.
   Idempotency key is a `UNIQUE` column; a replay returns the original confirmation.
6. **Migrations for the shared backend are additive** (new columns with safe defaults,
   new views, new RPCs, new scoped policies). No drops, no renames of important
   columns, no cascade deletes. Every widening of `anon`/public access is called out
   for explicit security review and reported in the phase's completion report.
   **Never reset a live project.** Prefer a dedicated **staging** project before real
   web orders (O9).
7. **`product_batches` gets no `anon` policy, ever.** Sellable stock is computed inside
   a `SECURITY DEFINER` RPC and returned as a boolean/label.
8. **Regenerate `src/types/database.ts` independently** after any schema change; do not
   share a types package with the admin.

## Anti-patterns to reject in review

- `GRANT EXECUTE ON complete_order TO anon` or any lifecycle RPC exposed to the
  storefront.
- A storefront RPC without `SET search_path` or without explicit grant/revoke.
- An RPC returning `SELECT *` from `orders` / `products`.
- A migration that drops or renames a column, or that re-grants `anon` on a base table.
- Running a schema change straight against production with no staging path when one is
  practical.
