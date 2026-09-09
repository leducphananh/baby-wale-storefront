import type { MetadataRoute } from "next";

import { env } from "@/lib/env";

/**
 * Minimal robots foundation. Real storefront pages do not exist yet; the
 * disallow list matches the future non-indexable routes (cart, checkout, order
 * pages, API) from nextjs-seo / nextjs-app-router. A sitemap is added once the
 * public catalog exists (S3+).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/gio-hang",
        "/thanh-toan",
        "/dat-hang-thanh-cong/",
        "/tra-cuu-don-hang",
        "/tai-khoan",
      ],
    },
    host: env.NEXT_PUBLIC_SITE_URL,
  };
}
