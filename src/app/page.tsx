import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronRight, CheckCircle, ShieldCheck } from "lucide-react";

import { CategoryTile } from "@/components/catalog/category-tile";
import { ProductRail } from "@/components/catalog/product-rail";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { listStorefrontCategories } from "@/features/catalog/server/list-categories";
import { listStorefrontProducts } from "@/features/catalog/server/list-products";
import { listStorefrontBestSellers } from "@/features/catalog/server/list-best-sellers";
import { TRUST_COPY_LINES } from "@/lib/content/trust-copy";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Baby Wale — Cửa hàng mẹ & bé",
  description:
    "Baby Wale — cửa hàng mẹ và bé: bỉm, sữa và đồ dùng cho bé. Đặt hàng dễ dàng, nhân viên xác nhận từng đơn trước khi xử lý.",
};

export default async function HomePage() {
  const [categories, newProducts, bestSellers] = await Promise.all([
    listStorefrontCategories(),
    listStorefrontProducts({ limit: 8 }),
    listStorefrontBestSellers({ limit: 8 }),
  ]);

  return (
    <div className="space-y-12 sm:space-y-16 pb-8">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-tint via-background to-background pt-6 sm:pt-10 pb-12 sm:pb-16 border-b border-border/60">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-primary-tint shadow-xs">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-xs font-bold text-primary">
                  Cửa Hàng Mẹ & Bé Baby Wale
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text tracking-tight leading-[1.2]">
                Dịu Lành Cho Bé,{" "}
                <span className="text-primary underline decoration-secondary decoration-wavy decoration-2">
                  An Tâm
                </span>{" "}
                Cho Mẹ
              </h1>

              <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-xl mx-auto lg:mx-0">
                Baby Wale đồng hành cùng cha mẹ trong từng cữ sữa, giấc ngủ và bước đi chập chững đầu đời. 
                Bỉm, sữa và đồ dùng cho bé. Đặt hàng dễ dàng — nhân viên Baby Wale xác nhận từng đơn.
              </p>

              {/* Call to actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Button asChild className="px-6 py-6 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95">
                  <Link href="/san-pham" className="flex items-center gap-2">
                    Mua sắm ngay
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="px-6 py-6 rounded-2xl transition-colors">
                  <Link href="#danh-muc">Khám phá danh mục</Link>
                </Button>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-text/80 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Xác nhận từng đơn hàng
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                  COD hoặc chuyển khoản
                </span>
              </div>
            </div>

            {/* Right Visual Image Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative blob backgrounds */}
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary-tint rounded-full filter blur-3xl opacity-60 -z-10" />
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-info/40 rounded-full filter blur-3xl opacity-50 -z-10" />

                {/* Hero Card Image */}
                <div className="relative bg-surface p-3 sm:p-4 rounded-3xl shadow-card border border-border overflow-hidden">
                  <div className="relative w-full h-80 sm:h-96 overflow-hidden rounded-2xl bg-surface-subtle">
                    <Image
                      src="/hero_background.jpg"
                      alt="Bé yêu Baby Wale"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  <div className="absolute bottom-6 right-6 bg-surface/95 backdrop-blur-xs p-2.5 sm:p-3 rounded-2xl shadow-lg border border-border flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-success-bg text-success flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-text-muted uppercase">
                        An Tâm
                      </span>
                      <span className="text-xs font-black text-text">
                        Baby Wale
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Featured Categories */}
      {categories.length > 0 && (
        <section id="danh-muc">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
              <div>
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Khám phá theo nhu cầu
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text mt-1">
                  Danh Mục Sản Phẩm Cho Bé
                </h2>
              </div>
              <Link
                href="/san-pham"
                className="text-xs sm:text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1 self-start sm:self-auto group transition-colors"
              >
                Xem tất cả sản phẩm
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {categories.slice(0, 12).map((category) => (
                <CategoryTile key={category.categoryId} category={category} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 3. Best Sellers */}
      {bestSellers.length > 0 && (
        <section>
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Tuyển chọn dành riêng cho bé
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text mt-1">
                  Sản Phẩm Được Mẹ Tin Chọn
                </h2>
              </div>
              <Link
                href="/san-pham"
                className="text-xs sm:text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1 self-start sm:self-auto group transition-colors"
              >
                Xem tất cả
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            
            <ProductRail products={bestSellers} />
          </Container>
        </section>
      )}

      {/* 4. New Products */}
      {newProducts.items.length > 0 && (
        <section>
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Cập nhật liên tục
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text mt-1">
                  Sản Phẩm Mới Về
                </h2>
              </div>
              <Link
                href="/san-pham"
                className="text-xs sm:text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1 self-start sm:self-auto group transition-colors"
              >
                Xem tất cả
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <ProductRail products={newProducts.items} />
          </Container>
        </section>
      )}

      {/* 5. Trust Section */}
      <section className="bg-surface-subtle border-y border-border/80 py-12">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Lý do cha mẹ lựa chọn Baby Wale
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text mt-1">
              Tiêu Chuẩn Chăm Sóc Bé Yêu
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-2">
              Chúng tôi hiểu rằng mỗi sản phẩm tiếp xúc với làn da và cơ thể bé đều phải an toàn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRUST_COPY_LINES.map((line, idx) => (
              <div key={idx} className="bg-surface p-6 rounded-2xl border border-border shadow-soft flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary-tint/50 text-primary flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-base text-text mb-2">{line}</h3>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
