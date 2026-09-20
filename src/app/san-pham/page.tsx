import type { Metadata } from "next";

import { listStorefrontCategories } from "@/features/catalog/server/list-categories";
import { listStorefrontProducts } from "@/features/catalog/server/list-products";
import { ShopClientView } from "@/features/catalog/components/shop-client-view";

const PAGE_SIZE = 24;

interface CatalogPageProps {
  searchParams: Promise<{ "danh-muc"?: string; trang?: string; "tu-khoa"?: string }>;
}

function parsePage(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function buildCatalogHref(categorySlug: string | undefined, page: number, searchKeyword?: string): string {
  const qs = new URLSearchParams();
  if (categorySlug) qs.set("danh-muc", categorySlug);
  if (searchKeyword) qs.set("tu-khoa", searchKeyword);
  if (page > 1) qs.set("trang", String(page));
  const query = qs.toString();
  return query ? `/san-pham?${query}` : "/san-pham";
}

export const revalidate = 300;

export async function generateMetadata({ searchParams }: CatalogPageProps): Promise<Metadata> {
  const params = await searchParams;
  const categorySlug = params["danh-muc"];
  const page = parsePage(params.trang);

  if (categorySlug) {
    return {
      title: "Tất cả sản phẩm",
      alternates: { canonical: `/danh-muc/${categorySlug}` },
      robots: { index: false, follow: true },
    };
  }

  return {
    title: "Tất cả sản phẩm",
    description: "Toàn bộ sản phẩm Baby Wale — bỉm, sữa và đồ dùng cho bé.",
    alternates: { canonical: buildCatalogHref(undefined, page, params["tu-khoa"]) },
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
      search: params["tu-khoa"],
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(productPage.totalCount / PAGE_SIZE));

  return (
    <ShopClientView 
      products={productPage.items} 
      categories={categories} 
      activeCategorySlug={categorySlug || null} 
      totalCount={productPage.totalCount}
      currentPage={page}
      totalPages={totalPages}
      searchKeyword={params["tu-khoa"]}
    />
  );
}
