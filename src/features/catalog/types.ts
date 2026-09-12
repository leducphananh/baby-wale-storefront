/**
 * Public catalog DTOs — the exact shape of the S3 public catalog contract
 * (`list_storefront_categories`, `list_storefront_products`,
 * `get_storefront_product_by_slug`; see
 * `docs/storefront/S3-public-catalog-data-contract.md`).
 *
 * These are hand-written, not re-derived from `Database["public"]["Tables"]`
 * — they intentionally mirror the RPCs' `RETURNS TABLE` shape (the actual
 * public contract), not the base tables (S0 C11: "database contract → typed
 * application contract", never "admin table → select('*') → TypeScript
 * hides fields"). `Database["public"]["Functions"][...]["Returns"]` in
 * `src/types/database.ts` is the generated source of truth for the wire
 * shape; these are its documented, storefront-friendly names.
 */

export interface StorefrontCategory {
  categoryId: string;
  slug: string;
  name: string;
  description: string | null;
  /** Active + web-visible products currently in this category (not stock-filtered). */
  productCount: number;
}

export interface StorefrontProduct {
  productId: string;
  slug: string;
  name: string;
  brand: string | null;
  description: string | null;
  unit: string;
  originCountry: string | null;
  manufacturer: string | null;
  /** Public per CLAUDE.md §6 ("Supplier ≠ Distributor") — never `supplier`. */
  distributor: string | null;
  categoryId: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  /** The only price shown (S0 B2) — never `tiktok_price`/`shopee_price`/cost. */
  sellingPrice: number;
  /**
   * A boolean only (S0 B4: "Display (MVP): status label only, no exact
   * number") — derived server-side from the same non-expired-batch
   * predicate `complete_order()` uses for FEFO. Never a quantity.
   */
  inStock: boolean;
  updatedAt: string;
}

export interface StorefrontProductListItem extends StorefrontProduct {
  /** Total rows matching the filter, before `limit`/`offset` — for pagination. */
  totalCount: number;
}

export interface ListStorefrontProductsParams {
  categorySlug?: string;
  limit?: number;
  offset?: number;
}

export interface StorefrontProductPage {
  items: StorefrontProductListItem[];
  totalCount: number;
}
