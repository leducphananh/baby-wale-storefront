import * as React from "react";
import Link from "next/link";
import { Price } from "@/components/catalog/price";
import { ProductImage } from "@/components/catalog/product-image";
import { AddToCartIconButton } from "@/components/catalog/add-to-cart-icon-button";
import type { StorefrontProduct } from "@/features/catalog/types";

export interface ProductCardProps {
  product: StorefrontProduct;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority, className = "" }: ProductCardProps) {
  const imageUrl = product.imageStoragePath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storefront-images/${product.imageStoragePath}`
    : null;

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className={`group relative bg-card border border-border/80 rounded-2xl overflow-hidden shadow-soft hover:shadow-card hover:border-accent/40 transition-all duration-300 flex flex-col cursor-pointer ${className}`}
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted flex items-center justify-center p-3">
        <ProductImage imageUrl={imageUrl} name={product.name} priority={priority} />

        {!product.inStock && (
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/95 text-foreground text-xs font-bold px-3 py-1.5 rounded-lg shadow">
              Tạm hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category / Brand */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium mb-1">
            <span className="truncate max-w-[140px]">{product.brand || "Baby Wale"}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-foreground text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Quick Specification Highlight */}
          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
            {product.unit}
          </p>
        </div>

        {/* Pricing & Add to Cart */}
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
