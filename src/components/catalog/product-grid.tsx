import * as React from "react";

import { PackageSearch } from "lucide-react";
import Link from "next/link";

import { Grid } from "@/components/layout/grid";
import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/catalog/product-card";
import type { StorefrontProduct } from "@/features/catalog/types";

/**
 * The catalog product grid, shared by `/san-pham` and `/danh-muc/[slug]`
 * (visual-consistency: one `ProductCard`/grid definition, not a per-route
 * variant). Owns its own empty state so both routes render it identically.
 */
export interface ProductGridProps {
  products: StorefrontProduct[];
  emptyTitle?: string;
  emptyDescription?: string;
}

function ProductGrid({
  products,
  emptyTitle = "Chưa có sản phẩm phù hợp",
  emptyDescription = "Vui lòng thử một danh mục khác hoặc quay lại toàn bộ sản phẩm.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<PackageSearch className="size-8" strokeWidth={1.5} />}
        title={emptyTitle}
        description={emptyDescription}
        action={
          <Button asChild variant="secondary">
            <Link href="/san-pham">Xem tất cả sản phẩm</Link>
          </Button>
        }
      />
    );
  }

  return (
    <Grid variant="catalog">
      {products.map((product, index) => (
        <ProductCard key={product.productId} product={product} priority={index === 0} />
      ))}
    </Grid>
  );
}

export { ProductGrid };
