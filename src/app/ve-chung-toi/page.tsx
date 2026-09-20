import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Heart,
  Award,
  Truck,
  ArrowRight,
} from "lucide-react";
import { BabyWaleLogo } from "@/components/layout/baby-wale-logo";

export const metadata: Metadata = {
  title: "Về Baby Wale",
  description: "Câu chuyện thương hiệu và sứ mệnh của Baby Wale.",
};

export default function AboutPage() {
  return (
    <div id="baby-wale-about-page" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-12 text-left">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link></li>
          <li className="flex items-center space-x-2">
            <span className="text-border">/</span>
            <span className="text-foreground font-semibold">Về Baby Wale</span>
          </li>
        </ol>
      </nav>

      {/* Hero Brand Introduction */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <BabyWaleLogo className="justify-center mb-2 mx-auto" />
        <span className="text-xs font-bold text-secondary uppercase tracking-widest block">
          Câu chuyện thương hiệu
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground leading-tight">
          Nơi Cha Mẹ Trao Gửi Niềm Tin Trọn Vẹn
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Được truyền cảm hứng từ hình ảnh chú cá voi mẹ dịu dàng nâng đỡ cá voi con giữa đại dương bao la, 
          Baby Wale ra đời với một sứ mệnh duy nhất: <strong>Đem lại sự an toàn và bình yên tuyệt đối cho từng khoảnh khắc lớn khôn của trẻ sơ sinh và trẻ nhỏ.</strong>
        </p>
      </div>

      {/* Narrative Section with Image */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-soft">
        <div className="md:col-span-6 space-y-4">
          <span className="text-xs font-extrabold text-primary uppercase block">
            Khởi đầu từ tình yêu của người làm cha mẹ
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Không Có Sự Thỏa Hiệp Nào Về Độ An Toàn Của Con
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Chúng tôi hiểu cảm giác lo âu của một người mẹ khi chọn chiếc bình sữa đầu tiên cho con, nỗi băn khoăn về chất lượng bỉm có gây hăm đỏ hay không, hay nguồn gốc hộp sữa công thức có thực sự chuẩn nội địa.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Tại Baby Wale, mỗi sản phẩm trước khi xuất hiện trên kệ hàng đều trải qua quy trình thẩm định 5 bước khắt khe: từ kiểm tra pháp lý tem nhãn, giấy kiểm định y tế, thành phần không chứa hóa chất độc hại, đến trực tiếp trải nghiệm thực tế.
          </p>
        </div>

        <div className="md:col-span-6">
          <img
            src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80"
            alt="Mẹ và bé Baby Wale"
            className="w-full h-80 object-cover rounded-2xl shadow-md border-4 border-white"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* 4 Core Pillars */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
            Giá trị cốt lõi
          </span>
          <h2 className="text-2xl font-extrabold text-foreground mt-1">
            4 Nguyên Tắc Vàng Của Baby Wale
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-border shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pastel-pink/50 text-primary flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-sm text-foreground">100% Chính Hãng</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nhập khẩu chính ngạch, hóa đơn đỏ đầy đủ, bồi hoàn 200% nếu phát hiện hàng giả, hàng nhái.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-info/40 text-accent flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Date Luôn Mới Nhất</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tất cả sữa, thực phẩm dinh dưỡng và bỉm tã luôn đảm bảo hạn sử dụng xa trên 18 tháng.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-success flex items-center justify-center font-bold">
              <Truck className="w-5 h-5 text-success" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Đóng Gói Chuyên Nghiệp</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Thùng carton chịu lực chống va đập, bọc màng khí dày, bảo vệ trọn vẹn sản phẩm khi tới tay.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-warning flex items-center justify-center font-bold">
              <Heart className="w-5 h-5 text-warning" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Tư Vấn Tận Tâm</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Đội ngũ chuyên viên hiểu rõ tâm lý cha mẹ, luôn lắng nghe và tư vấn đúng nhu cầu thực tế.
            </p>
          </div>
        </div>
      </div>

      {/* CTA to Shop */}
      <div className="bg-pastel-pink/30 border border-pink-200 rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-black text-foreground">
          Sẵn Sàng Mang Những Điều Dịu Lành Nhất Cho Bé?
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Khám phá bộ sưu tập sản phẩm chăm sóc bé yêu đạt chuẩn an toàn quốc tế ngay hôm nay.
        </p>
        <Link
          href="/san-pham"
          className="px-6 py-3 bg-primary text-primary-foreground font-bold text-xs sm:text-sm rounded-xl hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-sm"
        >
          Khám phá cửa hàng Baby Wale
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
