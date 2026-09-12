import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { StorefrontProduct } from "@/features/catalog/types";

/**
 * A single active + web-visible product by slug
 * (`get_storefront_product_by_slug`, S3). Returns `null` for an archived,
 * non-web-visible, or unknown slug — the RPC returns zero rows for all
 * three cases on purpose (never distinguishes "doesn't exist" from "not
 * public" to an anon caller); the caller (S4/S5) renders `notFound()`.
 * RSC-only.
 */
export async function getStorefrontProductBySlug(
  slug: string,
): Promise<StorefrontProduct | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_storefront_product_by_slug", {
    p_slug: slug,
  });

  if (error) {
    throw new Error(`Failed to load storefront product "${slug}": ${error.message}`);
  }

  const row = data?.[0];
  if (!row) {
    return null;
  }

  return {
    productId: row.product_id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    description: row.description,
    unit: row.unit,
    originCountry: row.origin_country,
    manufacturer: row.manufacturer,
    distributor: row.distributor,
    categoryId: row.category_id,
    categorySlug: row.category_slug,
    categoryName: row.category_name,
    sellingPrice: row.selling_price,
    inStock: row.in_stock,
    updatedAt: row.updated_at,
  };
}
