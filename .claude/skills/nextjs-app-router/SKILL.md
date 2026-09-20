---
name: nextjs-app-router
description: Next.js App Router conventions for the storefront — App Router only, route/layout structure, Route Handlers vs Server Actions, metadata placement, Vietnamese URL scheme. Read before adding or restructuring routes.
---

# Next.js App Router

## Apply when
Adding a route, layout, `route.ts` handler, `generateMetadata`, `sitemap.ts`,
`robots.ts`, or deciding Route Handler vs Server Action.

## Rules

1. **App Router only.** No Pages Router, no `pages/` directory, no `getServerSideProps`
   / `getStaticProps`. Route segments under `app/`.
2. **Server Components by default at every route and layout root.** Never put
   `"use client"` on a `page.tsx` or `layout.tsx`. Interactivity is an island at a leaf
   (see `nextjs-server-components`).
3. **Route Handlers (`app/api/**/route.ts`) for checkout, cart revalidation, and order
   lookup** — not Server Actions. Reasons: explicit versionable public API surface;
   straightforward request validation + logging; natural home for an idempotency key
   and (S13) rate limiting; reusable by a future mobile client; payment-gateway
   callbacks (S11) are Route Handlers anyway.
4. **Server Actions** are acceptable only for trivial, page-local, non-critical
   mutations (e.g. a newsletter signup) — never for the order transaction.
5. **Metadata lives in Server Components:** static `metadata` for fixed pages,
   `generateMetadata` for dynamic ones (product, category). Set `metadataBase`, a title
   template, and canonical URLs. See `nextjs-seo`.
6. **Vietnamese, diacritic-free URL paths** (planned scheme, implemented per phase):
   `/` · `/san-pham` · `/san-pham/[slug]` · `/danh-muc/[slug]` · `/gio-hang` ·
   `/thanh-toan` · `/dat-hang-thanh-cong/[token]` · `/tra-cuu-don-hang` ·
   `/tai-khoan` (S12). Filter/sort/search/pagination are **URL search params**
   (`?q=&danh-muc=&sap-xep=&trang=`), not stored in Zustand.
7. **Slugs are stable public identity.** Never route the catalog by UUID. Slug changes
   need redirects (later phase concern).
8. **`app/robots.ts` disallows** `/gio-hang`, `/thanh-toan`, `/dat-hang-thanh-cong`,
   `/tra-cuu-don-hang`, `/api`. `app/sitemap.ts` lists web-visible product + category
   slugs and static routes.
9. **Loading / error / not-found** use the framework files (`loading.tsx`,
   `error.tsx`, `not-found.tsx`) with real Vietnamese states — see
   `storefront-error-handling`.

## Anti-patterns to reject in review

- `"use client"` at the top of a `layout.tsx` or `page.tsx`.
- The order transaction implemented as a Server Action.
- Catalog routes keyed by product UUID instead of slug.
- Filter state kept in a client store while the URL stays `/san-pham` with no params.
- A cart or checkout page missing from the `robots.ts` disallow list.
