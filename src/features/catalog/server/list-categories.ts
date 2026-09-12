import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { StorefrontCategory } from "@/features/catalog/types";

/**
 * Categories that currently have >=1 active, web-visible product
 * (`list_storefront_categories`, S3). RSC-only — never called from a Client
 * Component (nextjs-data-access).
 */
export async function listStorefrontCategories(): Promise<StorefrontCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("list_storefront_categories");

  if (error) {
    throw new Error(`Failed to load storefront categories: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    categoryId: row.category_id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    productCount: row.product_count,
  }));
}
