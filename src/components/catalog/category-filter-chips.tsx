import * as React from "react";

import Link from "next/link";

import type { StorefrontCategory } from "@/features/catalog/types";
import { cn } from "@/lib/utils";

/**
 * In-page category filter for `/san-pham` — a horizontally scrollable chip
 * row (same hidden-scrollbar treatment as the product rail; this is filter
 * UI, not the frozen §9.3 product rail itself, but reuses the same
 * "native scroll, hidden bar" interaction for a consistent feel). Uses
 * `--radius-sm` (no pill radius — S2.4 §7.1 has no pill token) and the
 * frozen tint-selection treatment, not a colour-only indicator (the active
 * chip also gets a border + bold weight, not colour alone).
 */
export interface CategoryFilterChipsProps {
  categories: StorefrontCategory[];
  activeCategorySlug?: string;
}

function CategoryFilterChips({ categories, activeCategorySlug }: CategoryFilterChipsProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Lọc theo danh mục" className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      <Link
        href="/san-pham"
        aria-current={!activeCategorySlug ? "page" : undefined}
        className={cn(
          "shrink-0 rounded-sm border px-3 py-2 text-body-sm whitespace-nowrap",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
          !activeCategorySlug
            ? "border-primary bg-primary-tint font-semibold text-primary-pressed"
            : "border-border bg-surface text-text hover:bg-surface-subtle",
        )}
      >
        Tất cả
      </Link>
      {categories.map((category) => {
        const isActive = category.slug === activeCategorySlug;
        return (
          <Link
            key={category.categoryId}
            href={`/san-pham?danh-muc=${category.slug}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-sm border px-3 py-2 text-body-sm whitespace-nowrap",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
              isActive
                ? "border-primary bg-primary-tint font-semibold text-primary-pressed"
                : "border-border bg-surface text-text hover:bg-surface-subtle",
            )}
          >
            {category.name}
          </Link>
        );
      })}
    </nav>
  );
}

export { CategoryFilterChips };
