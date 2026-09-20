import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronRight, CheckCircle, ShieldCheck, Truck, HeartHandshake, Star } from "lucide-react";

import { listStorefrontCategories } from "@/features/catalog/server/list-categories";
import { listStorefrontProducts } from "@/features/catalog/server/list-products";
import { listStorefrontBestSellers } from "@/features/catalog/server/list-best-sellers";
import { ProductCard } from "@/components/catalog/product-card";

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
    <div id="baby-wale-home-page" className="space-y-12 sm:space-y-16 pb-8">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-pastel-pink/40 via-background to-background pt-6 sm:pt-10 pb-12 sm:pb-16 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-pink-200/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-xs font-bold text-primary">
                  Cửa Hàng Mẹ & Bé Chính Hãng Baby Wale
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.2]">
                Dịu Lành Cho Bé,{" "}
                <span className="text-primary underline decoration-secondary decoration-wavy decoration-2">
                  An Tâm
                </span>{" "}
                Cho Mẹ
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Baby Wale đồng hành cùng cha mẹ trong từng cữ sữa, giấc ngủ và bước đi chập chững đầu đời. 
                100% bỉm tã, bình sữa, sữa công thức và sản phẩm chăm sóc chuẩn chất lượng y khoa quốc tế.
              </p>

              {/* Call to actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/san-pham"
                  className="px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-primary/90 hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
                >
                  Mua sắm ngay
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#featured-categories-section"
                  className="px-5 py-3.5 rounded-2xl bg-white border border-border text-foreground font-bold text-sm hover:bg-muted/70 transition-colors"
                >
                  Khám phá danh mục
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-foreground/80 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Đầy đủ hóa đơn chứng từ
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Đổi trả 7 ngày linh hoạt
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Giao nhanh hỏa tốc 2H
                </span>
              </div>
            </div>

            {/* Right Visual Image Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative blob backgrounds */}
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-pastel-pink rounded-full filter blur-3xl opacity-60 -z-10" />
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-info/40 rounded-full filter blur-3xl opacity-50 -z-10" />

                {/* Hero Card Image */}
                <div className="relative bg-white p-3 sm:p-4 rounded-3xl shadow-card border border-border overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80"
                    alt="Bé yêu Baby Wale"
                    className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                    referrerPolicy="no-referrer"
                  />



                  {/* Floating badge 2: Genuine guarantee */}
                  <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-xs p-2.5 sm:p-3 rounded-2xl shadow-lg border border-border flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-muted-foreground uppercase">
                        Cam Kết
                      </span>
                      <span className="text-xs font-black text-foreground">
                        100% Chính Hãng
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories */}
      <section id="featured-categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Khám phá theo nhu cầu
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
              Danh Mục Sản Phẩm Cho Bé
            </h2>
          </div>
          <Link
            href="/san-pham"
            className="text-xs sm:text-sm font-bold text-primary hover:text-accent flex items-center gap-1 self-start sm:self-auto group transition-colors"
          >
            Xem tất cả danh mục
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.categoryId}
              href={`/danh-muc/${cat.slug}`}
              className="group cursor-pointer bg-card border border-border/80 hover:border-accent/40 rounded-2xl p-3 sm:p-4 text-center shadow-soft hover:shadow-card transition-all duration-300 flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-muted mb-3 flex items-center justify-center">
                {/* Fallback image if no image available for real category */}
                <img
                  src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=200&q=80"
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
                {cat.name}
              </h3>
              <span className="text-[11px] text-muted-foreground mt-1">
                {cat.productCount} sản phẩm
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-pastel-pink/30 border border-pink-200/60 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-secondary font-extrabold text-xs">
                <Sparkles className="w-3.5 h-3.5" /> Ưu Đãi Tháng Này
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground">
                Tã Dán Hữu Cơ & Bình Sữa PPSU Chuẩn Y Khoa
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
                Giảm tới 15% cho combo bỉm Merries & Moony Natural, tặng kèm khăn ướt Mamamy không mùi
                cho hóa đơn từ 799.000₫.
              </p>
              <Link
                href="/san-pham"
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all inline-flex items-center gap-1.5"
              >
                Khám phá ưu đãi
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="md:col-span-4 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80"
                alt="Combo Bỉm Sữa"
                className="w-48 sm:w-56 h-48 sm:h-56 object-cover rounded-2xl shadow-md border-4 border-white"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Products Discovery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Khám phá sản phẩm
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
              Sản Phẩm Nổi Bật
            </h2>
          </div>
          <Link
            href="/san-pham"
            className="text-xs sm:text-sm font-bold text-primary hover:text-accent flex items-center gap-1 self-start sm:self-auto group transition-colors"
          >
            Xem tất cả sản phẩm
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newProducts.items.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Shopping Benefits / Trust Section (Section 6 requirement) */}
      <section className="bg-muted/50 border-y border-border/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Lý do cha mẹ lựa chọn Baby Wale
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
              Tiêu Chuẩn Chăm Sóc Bé Yêu Từ Trái Tim
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Chúng tôi hiểu rằng mỗi sản phẩm tiếp xúc với làn da và cơ thể bé đều phải an toàn tuyệt đối.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-soft flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-pastel-pink/50 text-primary flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-base text-foreground mb-2">Sản Phẩm Chính Hãng 100%</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tất cả sản phẩm đều có tem phụ tiếng Việt, nguồn gốc xuất xứ rõ ràng từ các thương hiệu hàng đầu: Merries, Meiji, Hegen, Cetaphil.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-soft flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-info/40 text-accent flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-base text-foreground mb-2">Giao Hàng Nhanh & Đóng Gói Kỹ</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Đóng gói chuyên dụng chống va đập, bảo quản nhiệt độ chuẩn cho sữa công thức và giao hỏa tốc đến tận tay gia đình.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-soft flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-success flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-bold text-base text-foreground mb-2">Tư Vấn Tận Tâm Như Người Thân</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Đội ngũ tư vấn được đào tạo kiến thức chăm sóc trẻ sơ sinh, luôn sẵn sàng lắng nghe và giải đáp mọi băn khoăn của mẹ.
              </p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
