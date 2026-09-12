import type { MetadataRoute } from "next";

import { listStorefrontCategories } from "@/features/catalog/server/list-categories";
import { env } from "@/lib/env";

/**
 * Public catalog sitemap (S0 C13, nextjs-seo). Lists only routes that
 * actually exist today: home, the catalog listing, and every real category
 * (from `list_storefront_categories`, so an "empty" category — no active +
 * web-visible product — is naturally excluded, matching "never include
 * non-web-visible/archived products"). Product-detail URLs
 * (`/san-pham/[slug]`) are **not listed** — that route doesn't exist until
 * S5; listing URLs that 404 would be a worse sitemap than a smaller,
 * accurate one.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await listStorefrontCategories();
  const base = env.NEXT_PUBLIC_SITE_URL;

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/san-pham`, changeFrequency: "daily", priority: 0.9 },
    ...categories.map((category) => ({
      url: `${base}/danh-muc/${category.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
