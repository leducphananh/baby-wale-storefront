---
name: nextjs-seo
description: Storefront SEO — metadata/generateMetadata, canonical URLs, sitemap, robots, OG tags, Product JSON-LD, category metadata, noindex for cart/checkout/order pages, meaningful stable slugs, server-rendered content, and not indexing arbitrary filter permutations. Design guidance now; implemented per phase (S3–S4, S13).
---

# Next.js SEO

## Apply when
Adding `metadata` / `generateMetadata`, `sitemap.ts`, `robots.ts`, JSON-LD, canonical
links, OG images, or any indexable page. Do not implement SEO features in S0.5/S1
beyond the `robots.ts` stub.

## Rules

1. **Server-render meaningful content.** Product name, price, description, availability,
   and category context are in the server HTML — not injected client-side after
   hydration. This is both an SEO and a performance rule.
2. **Metadata via the App Router API.** Root: `metadataBase`, title template
   `%s | Baby Wale`, default description, default OG. Product page:
   `generateMetadata` → title = product name (+ brand), description trimmed from
   `description`, canonical = `/san-pham/[slug]`, OG image = the public primary image.
   Category page: title = category name, canonical = `/danh-muc/[slug]`.
3. **Canonical discipline on listings.** `?trang=N` is canonical to itself. `?q=` and
   multi-facet combinations get `robots: { index: false, follow: true }` — do not let
   infinite filter permutations into the index. Category + single-sort pages stay
   indexable.
4. **`app/robots.ts`** allows the catalog; **disallows** `/gio-hang`, `/thanh-toan`,
   `/dat-hang-thanh-cong`, `/tra-cuu-don-hang`, `/api`. Those pages also carry
   `robots: { index: false }` metadata (defense in depth).
5. **`app/sitemap.ts`** lists all web-visible product slugs + category slugs + static
   routes, `lastModified` from `updated_at`.
6. **Product JSON-LD** (`Product` + `Offer`): `priceCurrency: "VND"`, `price` =
   `selling_price`, `availability` from sellable stock
   (`InStock` / `OutOfStock`), `brand`, image URL(s). No cost, no internal fields.
   Designed now, implemented in S4.
7. **Slugs are meaningful and stable.** Diacritic-free kebab-case from the product /
   category name. A slug is public URL identity — a change needs a redirect. Never
   expose UUIDs in URLs.
8. **`Organization`, breadcrumb, and other structured data** are S13 scope — don't
   scatter partial implementations earlier.

## Anti-patterns to reject in review

- Product content rendered only after a client fetch, leaving the server HTML empty.
- Every `?q=` / `?danh-muc=` / `?sap-xep=` combination indexable.
- Cart / checkout / order-success pages missing from both `robots.ts` and page
  metadata.
- JSON-LD with a `priceCurrency` other than `VND`, or leaking internal fields.
- A sitemap that includes non-web-visible or archived products.
