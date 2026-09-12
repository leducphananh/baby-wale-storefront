import type { Metadata } from "next";

import { CategoryFilterChips } from "@/components/catalog/category-filter-chips";
import { Pagination } from "@/components/catalog/pagination";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Container } from "@/components/layout/container";
import { listStorefrontCategories } from "@/features/catalog/server/list-categories";
import { listStorefrontProducts } from "@/features/catalog/server/list-products";

const PAGE_SIZE = 24;

interface CatalogPageProps {
  searchParams: Promise<{ "danh-muc"?: string; trang?: string }>;
}

function parsePage(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function buildCatalogHref(categorySlug: string | undefined, page: number): string {
  const qs = new URLSearchParams();
  if (categorySlug) qs.set("danh-muc", categorySlug);
  if (page > 1) qs.set("trang", String(page));
  const query = qs.toString();
  return query ? `/san-pham?${query}` : "/san-pham";
}

/**
 * `/san-pham` — the main catalog listing (S0 C14 URL scheme). Category
 * filter and page live in URL search params (`?danh-muc=&trang=`), not
 * client state — shareable, back-button-correct, SSR-friendly, crawlable
 * (nextjs-app-router, storefront-performance). Uses `list_storefront_
 * products`/`list_storefront_categories` only — no direct base-table query
 * (nextjs-data-access).
 */
export const revalidate = 300;

export async function generateMetadata({ searchParams }: CatalogPageProps): Promise<Metadata> {
  const params = await searchParams;
  const categorySlug = params["danh-muc"];
  const page = parsePage(params.trang);

  if (categorySlug) {
    // This query-string form is a duplicate of the real canonical category
    // page — point there instead of indexing a second URL for the same
    // content (nextjs-seo: canonical discipline on filtered listings).
    return {
      title: "Tất cả sản phẩm",
      alternates: { canonical: `/danh-muc/${categorySlug}` },
      robots: { index: false, follow: true },
    };
  }

  return {
    title: "Tất cả sản phẩm",
    description: "Toàn bộ sản phẩm Baby Wale — bỉm, sữa và đồ dùng cho bé.",
    alternates: { canonical: page > 1 ? `/san-pham?trang=${page}` : "/san-pham" },
  };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const categorySlug = params["danh-muc"] || undefined;
  const page = parsePage(params.trang);

  const [categories, productPage] = await Promise.all([
    listStorefrontCategories(),
    listStorefrontProducts({
      categorySlug,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(productPage.totalCount / PAGE_SIZE));

  return (
    <Container className="flex flex-col gap-6 py-8">
      <h1 className="text-h1 text-text">Tất cả sản phẩm</h1>

      <CategoryFilterChips categories={categories} activeCategorySlug={categorySlug} />

      <p className="text-body-sm text-text-muted" aria-live="polite">
        {productPage.totalCount} sản phẩm
      </p>

      <ProductGrid products={productPage.items} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        buildHref={(targetPage) => buildCatalogHref(categorySlug, targetPage)}
      />
    </Container>
  );
}
