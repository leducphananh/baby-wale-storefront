import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { listStorefrontCategories } from "@/features/catalog/server/list-categories";
import { listStorefrontProducts } from "@/features/catalog/server/list-products";
import { env } from "@/lib/env";
import { ShopClientView } from "@/features/catalog/components/shop-client-view";

const PAGE_SIZE = 24;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ trang?: string }>;
}

function parsePage(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: env.NEXT_PUBLIC_SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: `${env.NEXT_PUBLIC_SITE_URL}/danh-muc/${category.slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ShopClientView 
        products={productPage.items} 
        categories={categories} 
        activeCategorySlug={slug} 
        totalCount={productPage.totalCount}
        currentPage={page}
        totalPages={totalPages}
      />
    </>
  );
}
