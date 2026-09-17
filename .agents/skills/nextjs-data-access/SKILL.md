---
name: nextjs-data-access
description: The concrete storefront data paths — catalog via RSC + public RPC, cart client-only, checkout via Route Handler + RPC, order lookup via safe RPC. Which layer fetches what, and why direct browser→Supabase is not the default. Read before writing any data-fetching code.
---

# Storefront data access

## Apply when
Writing any code that reads or writes storefront data: catalog pages, cart, checkout,
order lookup, search, a new Route Handler, or a Supabase client.

## The paths

| Use case | Path | Cache |
| --- | --- | --- |
| Home, catalog listing, product detail, category | **RSC → `src/lib/supabase/server.ts` (anon key) → public read RPC → DTO** | ISR / revalidate tiers (`nextjs-cache-correctness`) |
| Cart contents | **client only** — Zustand + `persist` (`cart-state`) | n/a (localStorage) |
| Cart revalidation before checkout | **client → `POST /api/cart/revalidate` → RPC / server fn** | `no-store` |
| Place order | **client → `POST /api/checkout` → `create_storefront_order()` RPC** | `no-store` |
| Order lookup by token | **RSC or `GET /api/orders/[token]` → `get_storefront_order_by_token()` RPC** | `no-store` |

## Rules

1. **Catalog reads go through purpose-built public read RPCs**
   (`list_storefront_products`, `get_storefront_product_by_slug`,
   `list_storefront_categories` — designed in S0, built S3). They return only the
   storefront-safe DTO. **Do not** grant `anon` `SELECT` on `products` / `categories` /
   `product_batches` to make a view work (this overrides S0 Part E — see CLAUDE.md §5,
   `public-data-contract`).
2. **`product_batches` is never reachable by anonymous callers.** Availability comes
   back from the RPC as a boolean / label only.
3. **One server Supabase client**: per-request `createServerClient` from
   `@supabase/ssr`, anon/publishable key, wired to the Next cookie store (ready for
   customer sessions in S12 without a rewrite). Used by every RSC data function and
   Route Handler. Never a `service_role` client.
4. **No client `supabase.from(...)` by default.** If a genuine interactive read need
   appears (e.g. type-ahead suggestions), add a read-only browser client hitting a
   safe public RPC/view then — documented, behind RLS that is already safe. Default:
   reads via RSC, writes via Route Handlers.
5. **Route Handlers validate then orchestrate.** Parse the body with a server Zod
   schema, then call exactly one RPC. No business math in the handler. Map RPC error
   prefixes to the stable error contract + Vietnamese messages
   (`storefront-error-handling`).
6. **Checkout / cart-revalidate / order-lookup are `no-store`.** They must always read
   live price, stock, and status. Never serve them from a cached catalog snapshot.
7. **Server data functions are typed at both ends** — explicit input and DTO return
   type from `src/types/storefront.ts`, never leaking generated row types with internal
   columns.
8. **Search and pagination are server-side** (DB `ILIKE` / RPC args, `?trang=N`). Never
   filter or paginate the catalog client-side.

## Anti-patterns to reject in review

- A catalog page that queries `storefront_products` view via `anon` `SELECT` on base
  tables instead of calling a public RPC.
- `create_storefront_order` logic partly in `/api/checkout/route.ts`.
- Checkout or order-lookup responses cached / revalidated instead of `no-store`.
- A browser Supabase client added for a feature that RSC could render.
- Returning a raw `products` row (with `default_purchase_price`, `tiktok_price`, …) to
  the client because "the component only reads `name` and `selling_price`".
