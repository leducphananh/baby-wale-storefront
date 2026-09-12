import * as React from "react";

import Link from "next/link";

import { Price } from "@/components/catalog/price";
import { ProductImage } from "@/components/catalog/product-image";
import { StockBadge } from "@/components/catalog/stock-badge";
import type { StorefrontProduct } from "@/features/catalog/types";
import { cn } from "@/lib/utils";

/**
 * `ProductCard` — frozen design contract, S2.4 §10.1. **One component**,
 * reused unchanged across Home, Catalog, Category, and rail contexts —
 * container width may vary, the card never does. No Add-to-Cart (cart is
 * S6); the whole card links to Product Detail (`/san-pham/[slug]`, S5 — see
 * the note below). Never renders `sku`/`barcode`/purchase price/channel
 * prices/inventory internals — only fields the `StorefrontProduct` DTO
 * actually carries (public-data-contract).
 *
 * Product Detail (S5) doesn't exist yet in S4. The card still links there —
 * a graceful 404 (the existing polished `not-found.tsx`) is the honest,
 * forward-compatible outcome until S5 ships, not a fake/dead link.
 */
export interface ProductCardProps {
  product: StorefrontProduct;
  /** Only the LCP image on a page should be eager/priority (next-image-storefront). */
  priority?: boolean;
  className?: string;
}

function ProductCard({ product, priority, className }: ProductCardProps) {
  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className={cn(
        "group flex w-full flex-col rounded-sm bg-surface",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        className,
      )}
    >
      <ProductImage imageUrl={null} name={product.name} priority={priority} />

      <div className="flex flex-1 flex-col gap-1 pt-3">
        {product.brand ? (
          <span className="text-caption text-text-muted">{product.brand}</span>
        ) : null}

        <span className="text-product-card-name line-clamp-2 min-h-10 text-text">
          {product.name}
        </span>

        {product.unit ? <span className="text-caption text-text-muted">{product.unit}</span> : null}

        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <Price amount={product.sellingPrice} role="card" />
          {!product.inStock ? <StockBadge inStock={false} className="whitespace-nowrap" /> : null}
        </div>
      </div>
    </Link>
  );
}

export { ProductCard };
