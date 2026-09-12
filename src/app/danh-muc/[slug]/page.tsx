import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Pagination } from "@/components/catalog/pagination";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Container } from "@/components/layout/container";
import { listStorefrontCategories } from "@/features/catalog/server/list-categories";
import { listStorefrontProducts } from "@/features/catalog/server/list-products";

const PAGE_SIZE = 24;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ trang?: string }>;
}

function parsePage(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

/**
 * `/danh-muc/[slug]` — the canonical category landing page (S0 C14). An
 * unknown slug renders `notFound()` — never a crash (§6 of this phase's
 * brief). A slug is only ever "known" if `list_storefront_categories()`
 * returned it, which already means it has >=1 active + web-visible product
 * — the "0-product category" case therefore only differs from "unknown
 * slug" if products change between the two calls, which self-heals to
 * `ProductGrid`'s own empty state on the next request, not a crash.
 */
export const revalidate = 300;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await listStorefrontCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return { title: "Danh mục" };
  }

  return {
    title: category.name,
    description: `Sản phẩm thuộc danh mục ${category.name} tại Baby Wale.`,
    alternates: { canonical: `/danh-muc/${slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { trang } = await searchParams;
  const page = parsePage(trang);

  const categories = await listStorefrontCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const productPage = await listStorefrontProducts({
    categorySlug: slug,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(productPage.totalCount / PAGE_SIZE));

  return (
    <Container className="flex flex-col gap-6 py-8">
      <h1 className="text-h1 text-text">{category.name}</h1>
      <p className="text-body-sm text-text-muted" aria-live="polite">
        {productPage.totalCount} sản phẩm
      </p>

      <ProductGrid
        products={productPage.items}
        emptyTitle="Danh mục này hiện chưa có sản phẩm"
        emptyDescription="Vui lòng quay lại sau hoặc xem toàn bộ sản phẩm."
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        buildHref={(targetPage) =>
          targetPage > 1 ? `/danh-muc/${slug}?trang=${targetPage}` : `/danh-muc/${slug}`
        }
      />
    </Container>
  );
}
