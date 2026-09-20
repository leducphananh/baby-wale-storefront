import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStorefrontProductBySlug } from "@/features/catalog/server/get-product-by-slug";
import { listStorefrontProducts } from "@/features/catalog/server/list-products";
import { env } from "@/lib/env";
import { ProductDetailView } from "@/features/catalog/components/product-detail-view";

const RELATED_LIMIT = 5;

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);

  if (!product) {
    return { title: "Sản phẩm" };
  }

  const title = product.brand ? `${product.name} — ${product.brand}` : product.name;

  return {
    title,
    description: product.description?.slice(0, 160) || `${product.name} tại Baby Wale.`,
    alternates: { canonical: `/san-pham/${product.slug}` },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedPage = product.categorySlug
    ? await listStorefrontProducts({ categorySlug: product.categorySlug, limit: RELATED_LIMIT })
    : null;
  const relatedProducts = (relatedPage?.items ?? []).filter((item) => item.productId !== product.productId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} tại Baby Wale.`,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: {
      "@type": "Offer",
      price: product.sellingPrice,
      priceCurrency: "VND",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${env.NEXT_PUBLIC_SITE_URL}/san-pham/${product.slug}`,
    },
  };

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
      ...(product.categorySlug
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: product.categoryName,
              item: `${env.NEXT_PUBLIC_SITE_URL}/danh-muc/${product.categorySlug}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: `${env.NEXT_PUBLIC_SITE_URL}/san-pham/${product.slug}`,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: product.name,
              item: `${env.NEXT_PUBLIC_SITE_URL}/san-pham/${product.slug}`,
            },
          ]),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      
      <ProductDetailView 
        product={product} 
        relatedProducts={relatedProducts} 
        imageUrl={product.imageStoragePath ? `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storefront-images/${product.imageStoragePath}` : null} 
      />
    </>
  );
}
