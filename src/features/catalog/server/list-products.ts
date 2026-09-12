import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  ListStorefrontProductsParams,
  StorefrontProductListItem,
  StorefrontProductPage,
} from "@/features/catalog/types";

const DEFAULT_PAGE_SIZE = 24;

/**
 * Paginated, active + web-visible products (`list_storefront_products`, S3).
 * Newest-first only — additional sort orders and search are added in S4 as
 * new optional RPC parameters (see the S3 doc §"Deferred to S4"); this
 * function's shape can grow additively without a breaking change here.
 * RSC-only.
 */
export async function listStorefrontProducts(
  params: ListStorefrontProductsParams = {},
): Promise<StorefrontProductPage> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("list_storefront_products", {
    p_category_slug: params.categorySlug ?? undefined,
    p_limit: params.limit ?? DEFAULT_PAGE_SIZE,
    p_offset: params.offset ?? 0,
  });

  if (error) {
    throw new Error(`Failed to load storefront products: ${error.message}`);
  }

  const items: StorefrontProductListItem[] = (data ?? []).map((row) => ({
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
    totalCount: row.total_count,
  }));

  return {
    items,
    // The RPC returns `total_count` on every row (a window-function
    // trick, matching this project's existing admin RPC convention); zero
    // rows means zero matches, not "unknown".
    totalCount: items[0]?.totalCount ?? 0,
  };
}
