import * as React from "react";

import { Tag } from "lucide-react";
import Link from "next/link";

import type { StorefrontCategory } from "@/features/catalog/types";
import { cn } from "@/lib/utils";

/**
 * `CategoryTile` — frozen V1, S2.4 §10.9: icon/simple-graphic-led, no
 * custom photography required, **one visual language / one surface tone**
 * (no rainbow per-category colours — every tile uses the same neutral icon
 * and surface). Category names are the real database values returned by
 * `list_storefront_categories()` — never invented, never the S2.3 mock
 * wording.
 */
export interface CategoryTileProps {
  category: StorefrontCategory;
  className?: string;
}

function CategoryTile({ category, className }: CategoryTileProps) {
  return (
    <Link
      href={`/danh-muc/${category.slug}`}
      className={cn(
        "flex flex-col items-center gap-2 rounded-md border border-border bg-surface px-3 py-4 text-center",
        "hover:border-primary hover:bg-primary-tint",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-sm bg-surface-subtle text-primary" aria-hidden="true">
        <Tag className="size-5" strokeWidth={1.75} />
      </span>
      <span className="text-body-sm font-medium text-text">{category.name}</span>
      <span className="text-caption text-text-muted">{category.productCount} sản phẩm</span>
    </Link>
  );
}

export { CategoryTile };
