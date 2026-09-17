import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { StorefrontProduct } from "../types";

export interface ListBestSellersOptions {
  limit?: number;
}

export async function listStorefrontBestSellers({ limit = 10 }: ListBestSellersOptions = {}): Promise<
  StorefrontProduct[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("list_storefront_best_sellers" as any, {
    p_limit: limit,
  });

  if (error) {
    console.error("list_storefront_best_sellers RPC failed:", error);
    return []; // Graceful degradation — best sellers section will just be empty
  }

  // The RPC returns a flat record matching StorefrontProduct shape exactly
  return (data || []).map((row: any) => ({
    productId: row.product_id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    description: null,
    unit: row.unit,
    originCountry: null,
    manufacturer: null,
    distributor: null,
    sellingPrice: row.selling_price,
    inStock: row.in_stock,
    categoryId: row.category_id,
    categorySlug: row.category_slug,
    categoryName: row.category_name,
    updatedAt: new Date().toISOString(),
  }));
}
