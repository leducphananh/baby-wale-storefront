import * as React from "react";

import Link from "next/link";

/**
 * Product Detail breadcrumb — S2.4 §10.3 (frozen mobile hierarchy starts
 * with breadcrumb). Customer-facing names only — never an internal id/slug
 * as visible text. Uses `nav[aria-label]` + an ordered list, the standard
 * accessible breadcrumb pattern (accessibility skill: semantic HTML,
 * meaningful link names).
 */
export interface ProductBreadcrumbProps {
  categoryName?: string | null;
  categorySlug?: string | null;
  productName: string;
}

function ProductBreadcrumb({ categoryName, categorySlug, productName }: ProductBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="overflow-x-auto">
      <ol className="flex items-center gap-1.5 whitespace-nowrap text-caption text-text-muted">
        <li>
          <Link href="/" className="hover:text-primary">
            Trang chủ
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/san-pham" className="hover:text-primary">
            Sản phẩm
          </Link>
        </li>
        {categoryName && categorySlug ? (
          <>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/danh-muc/${categorySlug}`} className="hover:text-primary">
                {categoryName}
              </Link>
            </li>
          </>
        ) : null}
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="max-w-40 truncate text-text sm:max-w-none">
          {productName}
        </li>
      </ol>
    </nav>
  );
}

export { ProductBreadcrumb };
