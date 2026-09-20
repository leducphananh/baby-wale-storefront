---
name: storefront-performance
description: Storefront performance discipline — minimize client JS, RSC by default, no giant global provider tree, image optimization, no N+1 product queries, server pagination, URL-driven filters, cache descriptive data, never cache checkout/order truth, no unnecessary TanStack Query, lazy-load heavy client widgets, avoid hydration mismatch.
---

# Storefront performance

## Apply when
Adding a client library, a provider, a data query, a filter, pagination, or any
client-heavy widget; reviewing bundle size or page speed.

## Rules

1. **Minimize client JavaScript.** RSC by default; `"use client"` at interactive
   leaves only (`nextjs-server-components`). Every added client dependency is
   challenged.
2. **No giant global provider tree.** Wrap only what needs it (e.g. a toaster,
   later a cart hydration guard). Do not add a top-level `QueryClientProvider` /
   context stack the storefront doesn't need.
3. **No N+1 product queries.** Catalog listing and product detail fetch categories,
   images, and stock in the same RPC / query, not one round-trip per card.
4. **Server-side pagination** (`?trang=N`, fixed page size ~24) — never load the whole
   catalog and slice on the client.
5. **URL-driven filters/sort/search** (`nextjs-app-router`) — server re-renders the
   listing; no client-side catalog filtering.
6. **Cache descriptive data** per the tiers in `nextjs-cache-correctness`. **Never**
   cache checkout, cart-revalidation, or order-lookup responses.
7. **TanStack Query is not a default dependency** (CLAUDE.md §10). Do not add it to
   "manage" data the RSC already delivered.
8. **Lazy-load expensive client-only widgets** (`next/dynamic`) — image galleries with
   zoom, any carousel, map pickers — so they don't block first render.
9. **Avoid hydration mismatch.** No `Date.now()` / `Math.random()` / `localStorage` /
   `window` read during render; gate client-only values behind a mounted flag
   (`cart-state`).
10. **Optimize images** (`next-image-storefront`): correct `sizes`, lazy by default,
    `priority` only for the LCP image, fixed aspect-ratio boxes.
11. **Keep RSC payloads lean** — return the DTO, not wide rows; don't pass large
    unused objects across the server→client boundary.

## Anti-patterns to reject in review

- A product grid that fires one stock query per card.
- `<QueryClientProvider>` added at the root for a storefront with no client
  server-state.
- Client-side `.filter()` over the full catalog for the category filter.
- A carousel/gallery library eagerly imported into the product page bundle.
- `revalidate` set on `/api/checkout` or the order-success page.
