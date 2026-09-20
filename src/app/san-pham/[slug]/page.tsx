import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Price } from "@/components/catalog/price";
import { ProductBreadcrumb } from "@/components/catalog/product-breadcrumb";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductRail } from "@/components/catalog/product-rail";
import { ProductSpecList } from "@/components/catalog/product-spec-list";
import { StockBadge } from "@/components/catalog/stock-badge";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProductPurchasePanel } from "@/features/cart/components/product-purchase-panel";
import { getStorefrontProductBySlug } from "@/features/catalog/server/get-product-by-slug";
import { listStorefrontProducts } from "@/features/catalog/server/list-products";
import { TRUST_COPY_LINES } from "@/lib/content/trust-copy";
import { env } from "@/lib/env";

const RELATED_LIMIT = 5;

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * `/san-pham/[slug]` — Product Detail (S5). Data comes from exactly one
 * source: `get_storefront_product_by_slug()` (S3), already wrapped by
 * `getStorefrontProductBySlug`. A hidden/archived/unknown slug returns
 * `null` for all three cases on purpose — `notFound()` renders identically
 * for each, never revealing which one it was (nextjs-data-access,
 * public-data-contract).
 *
 * Same descriptive-content cache tier as the rest of the catalog (S4):
 * price + stock are shown here too, so the shorter blended tier applies,
 * not the 1h "pure content" tier.
 */
export const revalidate = 300;

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);

  if (!product) {
    // No product content/metadata is exposed for a hidden or unknown slug —
    // `notFound()` in the page component below renders the real 404.
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

  // "Related" = other web-visible products in the same category — reuses
  // the existing `list_storefront_products` RPC (no new query/RPC), the
  // same one every other catalog page already calls. Skipped entirely when
  // the product has no category, rather than falling back to an unrelated
  // set (no fabricated recommendations).
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
    <Container className="flex flex-col gap-8 py-6 lg:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ProductBreadcrumb
        categoryName={product.categoryName}
        categorySlug={product.categorySlug}
        productName={product.name}
      />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="lg:w-1/2">
          {/* No product image field exists yet — S3/S4 finding, no public
              image bucket (O3/F13). Every product shows the neutral
              placeholder frame until that ships. */}
          <div className="rounded-3xl border border-border/80 p-2 shadow-soft bg-surface">
            <ProductGallery 
              images={product.imageStoragePath ? [`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storefront-images/${product.imageStoragePath}`] : []} 
              productName={product.name} 
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:w-1/2">
          <div className="flex flex-col gap-2">
            {product.brand && (
              <div className="self-start">
                <span className="text-primary font-bold uppercase tracking-wider bg-primary-tint/40 px-2.5 py-0.5 rounded-md text-xs">
                  {product.brand}
                </span>
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text leading-snug">{product.name}</h1>
          </div>

          <div className="p-4 rounded-2xl bg-surface-subtle border border-border/80">
            <Price amount={product.sellingPrice} role="lg" />
          </div>

          <div className="flex items-center gap-3">
            <StockBadge inStock={product.inStock} />
            {product.unit ? <span className="text-sm font-medium text-text-muted">ĐVT: {product.unit}</span> : null}
          </div>

          <div className="pt-2">
            <ProductPurchasePanel
              productId={product.productId}
              slug={product.slug}
              name={product.name}
              unit={product.unit}
              sellingPrice={product.sellingPrice}
              inStock={product.inStock}
              imageUrl={product.imageStoragePath ? `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storefront-images/${product.imageStoragePath}` : null}
            />
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface-subtle p-5 mt-4">
            <span className="text-xs font-bold text-text mb-1">Cam kết từ Baby Wale:</span>
            {TRUST_COPY_LINES.map((line) => (
              <div key={line} className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-success-bg text-success flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-xs text-text">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {product.description ? (
        <div className="flex flex-col gap-3 lg:max-w-4xl bg-surface p-6 sm:p-8 rounded-3xl border border-border/80 shadow-soft">
          <h2 className="text-xl font-bold text-text border-b border-border pb-3">Mô tả sản phẩm</h2>
          <p className="text-sm leading-relaxed whitespace-pre-line text-text/90">{product.description}</p>
        </div>
      ) : null}

      <ProductSpecList
        unit={product.unit}
        originCountry={product.originCountry}
        manufacturer={product.manufacturer}
        distributor={product.distributor}
      />

      {relatedProducts.length > 0 ? (
        <div className="flex flex-col gap-4">
          <SectionHeading title="Sản phẩm liên quan" />
          <ProductRail products={relatedProducts} />
        </div>
      ) : null}
    </Container>
  );
}
