---
name: next-image-storefront
description: Product imagery with next/image — real aspect ratios, responsive sizes, no layout shift, stable crawlable public URLs (never private admin signed URLs as the SEO delivery model), meaningful alt text, lazy by default, priority only for the LCP image. Design guidance; the public bucket is added later (O3).
---

# next/image for the storefront

## Apply when
Rendering any product / category / hero image, configuring `next.config` image
options, or deciding how storefront images are delivered.

## Rules

1. **Use `next/image`** for all content images. Set `width`/`height` (or `fill` + a
   sized container) that match the **real image aspect ratio** so no layout shift
   occurs while loading. Reserve the box before the image loads.
2. **Define responsive `sizes`** matching the actual layout (e.g. product grid card vs
   product-detail main image vs thumbnail) so the browser fetches an appropriately
   sized source. Never ship a 2000px file into a 180px card.
3. **Public, stable, crawlable URLs are the storefront delivery model.** Web images
   are served from a **public** storefront bucket / CDN path
   (`.../storage/v1/object/public/...`), added later (O3, S6/S9). Configure
   `images.remotePatterns` for that host (S1).
4. **Do NOT use the admin's private-bucket signed URLs** as the primary storefront
   image source — they expire, defeat CDN caching, can't be crawled, and don't play
   well with `next/image`. **Do NOT make the admin private bucket public** (O3).
5. **Meaningful `alt` text** — describe the product ("Sữa bột Meiji số 1, lon 800g"),
   not "image" / "product photo". Decorative-only images get `alt=""`.
6. **Lazy-load by default.** Only the hero / LCP image on a page gets `priority`, and
   only where genuinely above the fold. Do not `priority` every card in a grid.
7. **No cumulative layout shift** from images, fonts, or badges near images — the card
   and detail layouts have fixed image regions.
8. A custom `next/image` loader is unnecessary unless Supabase image transformations
   are adopted later — decide then, don't pre-build it.

## Anti-patterns to reject in review

- `<img>` with no dimensions causing layout shift in the product grid.
- Signed private-bucket URLs rendered on a public product page.
- Every product card image marked `priority`.
- `alt="product image"` on catalog cards.
- One `sizes="100vw"` used for thumbnails, cards, and the hero alike.
