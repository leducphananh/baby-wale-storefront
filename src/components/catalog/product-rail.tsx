import * as React from "react";

import { ProductCard } from "@/components/catalog/product-card";
import type { StorefrontProduct } from "@/features/catalog/types";

/**
 * Horizontal product rail — S2.4 §2.2/§9.3 (frozen): approved **only** for
 * Home "Sản phẩm mới" and PDP "Sản phẩm liên quan" (S5). Native scroll stays
 * fully enabled (touch/wheel/keyboard); only the visual scrollbar is hidden
 * (`.no-scrollbar`, never `overflow: hidden`). A partial next card stays
 * visible at the trailing edge as a discoverability cue. No auto-rotation —
 * moves only on user input. Desktop converts to a normal grid. Same
 * `ProductCard`, same minimum width, as everywhere else (§2.3).
 */
export interface ProductRailProps {
  products: StorefrontProduct[];
}

function ProductRail({ products }: ProductRailProps) {
  return (
    <div
      className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 compact:gap-2.5 lg:grid lg:snap-none lg:grid-cols-4 lg:gap-4 lg:overflow-visible"
    >
      {products.map((product) => (
        <div
          key={product.productId}
          // Fixed, not viewport-relative — S2.4 §2.3's 160-171px safe
          // minimum must hold at 320px too, not just ~390px. w-42 = 168px,
          // sm:w-55 = 220px — the 4px spacing scale, not arbitrary values.
          className="w-42 shrink-0 snap-start sm:w-55 lg:w-auto"
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

export { ProductRail };
