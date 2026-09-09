---
name: storefront-architecture
description: Top-level storefront architecture — system topology, trust boundaries, the four data paths, service-role ban, repo boundary with the admin, and phase discipline. Read before any structural decision or new feature.
---

# Storefront architecture

## Apply when
Making any structural decision: adding a route, a data path, a Supabase call, a
Route Handler, a background job, an env var, or a new top-level folder. Also whenever
deciding "where should this logic live".

## The system

```
                 Supabase Cloud project (ONE, shared with admin)
                                   │
        ┌──────────────────────────┴──────────────────────────┐
   Admin (baby-store-web)                       Storefront (this repo)
   React + Vite SPA                             Next.js App Router (RSC)
   trusted staff, authenticated                 public + guest, mostly anon
   full admin RLS surface                       narrow public contract only
```

- **One backend, two apps.** Shared catalog, inventory ledger, order book. The
  storefront is the **lower-trust** client and must never weaken admin hardening.
- **Separate repos.** This repo does not import from the admin and must never modify
  it. Admin-side needs are Admin Coordination tasks (S10). See CLAUDE.md §14.

## Rules

1. **Four data paths, nothing else by default** (see `nextjs-data-access` for detail):
   - Catalog → RSC → server anon Supabase client → **public read RPC** → safe DTO.
   - Cart → **client only** (Zustand + persist).
   - Checkout → client → **Route Handler** → transactional Postgres RPC.
   - Order lookup → RSC / Route Handler → **safe lookup RPC** (`no-store`).
2. **No direct browser → Supabase** (`supabase.from(...)` in a client component)
   without an explicit, documented architecture reason approved in review.
3. **No `service_role` key anywhere** — not in the browser, not on the Next server.
   Privileged work is done by narrow `SECURITY DEFINER` RPCs called with the anon key.
   A future genuine need is justified, server-only, narrow, reviewed, never
   `NEXT_PUBLIC_*`. See `supabase-storefront`, `frontend-storefront-security`.
4. **The business transaction is a Postgres RPC**, not Next code. A Route Handler only
   validates request shape and orchestrates one RPC call. This keeps the invariant
   enforceable outside Next and reusable by a future mobile client.
5. **Feature-folder layout** (planned, created in S1): `src/features/<domain>/` with
   `server/` **only** for modules that must never run in the browser (import the server
   Supabase client or read secrets); `components/` for UI with `"use client"` at
   leaves; plus `schemas/`, `types/`. No blanket `server/` folders with nothing
   server-only. `src/lib/` for client/library glue (`supabase/server.ts`, `env.ts`,
   `format/`), `src/types/` for generated `database.ts` + public DTO types.
6. **Generated Supabase types are regenerated independently** into this repo. No shared
   npm package with the admin. Authoritative business logic stays in Postgres — do not
   re-implement order/pricing/stock rules in TypeScript.
7. **Inspect before changing; implement only the current phase; do not auto-chain
   phases.** Report DB changes and dependencies explicitly. See CLAUDE.md §12–§13.

## Anti-patterns to reject in review

- A client component calling `supabase.from('products')` "to save a round-trip".
- A `service_role` client added to a Route Handler because an RPC felt like more work.
- Multi-step order creation (insert order in Next, then insert items) instead of one
  atomic RPC.
- Re-implementing price/subtotal/stock logic in TS because "the server already
  validates it anyway".
- A phase that also scaffolds the next phase's routes "to save time later".
