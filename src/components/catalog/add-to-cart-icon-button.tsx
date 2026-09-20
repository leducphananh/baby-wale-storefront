"use client";

import * as React from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/features/cart/store";
import type { StorefrontProduct } from "@/features/catalog/types";

interface AddToCartIconButtonProps {
  product: StorefrontProduct;
}

export function AddToCartIconButton({ product }: AddToCartIconButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the product link
    e.stopPropagation();
    if (!product.inStock) return;
    addItem({
      productId: product.productId,
      slug: product.slug,
      name: product.name,
      imageUrl: product.imageStoragePath ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storefront-images/${product.imageStoragePath}` : null,
      unit: product.unit || "Cái",
      cachedUnitPrice: product.sellingPrice,
      quantity: 1,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={!product.inStock}
      className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 ${
        product.inStock
          ? "bg-muted text-primary hover:bg-primary hover:text-primary-foreground active:scale-98"
          : "bg-muted/60 text-muted-foreground cursor-not-allowed"
      }`}
    >
      <ShoppingBag className="w-3.5 h-3.5" />
      {product.inStock ? "Thêm vào giỏ" : "Hết hàng"}
    </button>
  );
}
