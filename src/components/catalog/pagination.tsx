import * as React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

/**
 * Catalog pagination — real `<Link>`s (server-rendered, crawlable, no
 * client JS, no infinite scroll — nextjs-app-router/storefront-performance),
 * not numbered pages (kept simple for S4: current page + prev/next is
 * sufficient and stays usable at 320px with no horizontal overflow).
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Builds the href for a given page number, preserving other query params. */
  buildHref: (page: number) => string;
}

function Pagination({ currentPage, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label="Phân trang" className="flex items-center justify-between gap-3 pt-2">
      {hasPrev ? (
        <Link
          href={buildHref(currentPage - 1)}
          rel="prev"
          aria-label="Trang trước"
          className="sm-target inline-flex h-10 items-center gap-1 rounded-sm border border-border bg-surface px-3 text-body-sm text-text hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Trước
        </Link>
      ) : (
        <span aria-hidden="true" className="inline-flex h-10 items-center px-3 text-body-sm text-text-muted opacity-50">
          <ChevronLeft className="size-4" />
          Trước
        </span>
      )}

      <span className="text-body-sm text-text-muted" aria-live="polite">
        Trang {currentPage} / {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={buildHref(currentPage + 1)}
          rel="next"
          aria-label="Trang sau"
          className="sm-target inline-flex h-10 items-center gap-1 rounded-sm border border-border bg-surface px-3 text-body-sm text-text hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Sau
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" className="inline-flex h-10 items-center px-3 text-body-sm text-text-muted opacity-50">
          Sau
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}

export { Pagination };
