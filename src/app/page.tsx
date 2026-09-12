import type { Metadata } from "next";
import Link from "next/link";

import { CategoryTile } from "@/components/catalog/category-tile";
import { ProductRail } from "@/components/catalog/product-rail";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { listStorefrontCategories } from "@/features/catalog/server/list-categories";
import { listStorefrontProducts } from "@/features/catalog/server/list-products";

/**
 * Storefront homepage (S4) — a real shopping entry point: hero → categories
 * → new products → trust info. Reuses the S2.5 primitives and the S2.4
 * approved content-claim contract (§15) — no fabricated years-in-business,
 * customer counts, certifications, discounts, or shipping promises
 * (`storefront-ui-design`, `public-data-contract`).
 *
 * Descriptive-content cache tier (nextjs-cache-correctness): products/
 * categories here also carry price + stock, so this page uses the shorter
 * blended tier (5 min), not the 1h "pure content" tier.
 */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Baby Wale — Cửa hàng mẹ & bé",
  description:
    "Baby Wale — cửa hàng mẹ và bé: bỉm, sữa và đồ dùng cho bé. Đặt hàng dễ dàng, nhân viên xác nhận từng đơn trước khi xử lý.",
};

export default async function HomePage() {
  const [categories, newProducts] = await Promise.all([
    listStorefrontCategories(),
    listStorefrontProducts({ limit: 8 }),
  ]);

  return (
    <div className="flex flex-col gap-12 pb-16 lg:gap-16">
      {/* Hero */}
      <section className="bg-surface-subtle">
        <Container className="flex flex-col items-start gap-4 py-12 lg:py-20">
          <h1 className="text-display text-text">Baby Wale — mẹ &amp; bé, mua sắm an tâm</h1>
          <p className="text-body max-w-lg text-text-muted">
            Bỉm, sữa và đồ dùng cho bé. Đặt hàng dễ dàng — nhân viên Baby Wale xác nhận
            từng đơn trước khi xử lý.
          </p>
          <Button asChild size="lg">
            <Link href="/san-pham">Mua sắm ngay</Link>
          </Button>
        </Container>
      </section>

      {/* Categories */}
      {categories.length > 0 ? (
        <Container className="flex flex-col gap-4">
          <SectionHeading title="Danh mục sản phẩm" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 12).map((category) => (
              <CategoryTile key={category.categoryId} category={category} />
            ))}
          </div>
        </Container>
      ) : null}

      {/* New products */}
      {newProducts.items.length > 0 ? (
        <Container className="flex flex-col gap-4">
          <SectionHeading
            title="Sản phẩm mới"
            action={
              <Link href="/san-pham" className="text-body-sm font-medium text-primary hover:underline">
                Xem tất cả
              </Link>
            }
          />
          <ProductRail products={newProducts.items} />
        </Container>
      ) : null}

      {/* Trust / service info — S2.4 §15 approved copy only */}
      <Container>
        <div className="grid grid-cols-1 gap-4 rounded-md border border-border bg-surface p-6 sm:grid-cols-3">
          <p className="text-body-sm text-text">Thanh toán khi nhận hàng (COD) hoặc chuyển khoản</p>
          <p className="text-body-sm text-text">Nhân viên xác nhận từng đơn trước khi xử lý</p>
          <p className="text-body-sm text-text">Hỗ trợ: [OWNER CONTENT TBD]</p>
        </div>
      </Container>
    </div>
  );
}
