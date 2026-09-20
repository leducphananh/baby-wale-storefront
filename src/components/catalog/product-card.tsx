import * as React from "react";

import Link from "next/link";

import { Price } from "@/components/catalog/price";
import { ProductImage } from "@/components/catalog/product-image";
import { StockBadge } from "@/components/catalog/stock-badge";
import { AddToCartIconButton } from "@/components/catalog/add-to-cart-icon-button";
import type { StorefrontProduct } from "@/features/catalog/types";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: StorefrontProduct;
  priority?: boolean;
  className?: string;
}

function ProductCard({ product, priority, className }: ProductCardProps) {
  const imageUrl = product.imageStoragePath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storefront-images/${product.imageStoragePath}`
    : null;

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className={cn(
        "group relative flex w-full flex-col rounded-2xl bg-surface border border-border/80 transition-all duration-300 shadow-soft hover:shadow-card hover:border-accent/40 overflow-hidden cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        className,
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface-subtle flex items-center justify-center p-3">
        <ProductImage imageUrl={imageUrl} name={product.name} priority={priority} />

        {/* Temporary Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-surface/95 text-text text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
              Tạm hết hàng
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div>
          <div className="flex items-center justify-between text-[11px] text-text-muted font-medium mb-1">
            <span className="truncate max-w-[140px]">{product.brand || "Baby Wale"}</span>
            {/* Rating UI hidden for now per user feedback */}
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-text line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {product.unit ? (
            <p className="text-[11px] text-text-muted mt-1 line-clamp-1">{product.unit}</p>
          ) : null}
        </div>

        <div className="mt-3 pt-2.5 border-t border-border/60">
          <div className="flex items-baseline gap-1.5 mb-2.5">
            <Price amount={product.sellingPrice} role="card" />
          </div>

          <AddToCartIconButton product={product} />
        </div>
      </div>
    </Link>
  );
}

export { ProductCard };
