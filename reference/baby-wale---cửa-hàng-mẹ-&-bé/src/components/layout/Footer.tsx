import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BabyWaleLogo } from '../common/BabyWaleLogo';
import { CATEGORIES } from '../../data/categories';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Phone,
  Mail,
  MapPin,
  Clock,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <footer className="bg-white border-t border-border mt-16 pt-12 pb-24 md:pb-12">
      {/* 4 Trust Highlights Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 rounded-3xl bg-background border border-border/80">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pastel-pink/60 flex items-center justify-center text-primary shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-foreground">100% Chính Hãng</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Nhập khẩu chính ngạch từ Nhật, Úc, Châu Âu
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-info/40 flex items-center justify-center text-primary shrink-0">
              <Truck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-foreground">Giao Hàng Hỏa Tốc</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Nội thành 2H, toàn quốc 1-3 ngày
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-warning shrink-0">
              <RotateCcw className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-foreground">Đổi Trả Dễ Dàng</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Miễn phí đổi trả trong 7 ngày nếu lỗi sản phẩm
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-success shrink-0">
              <Headphones className="w-5 h-5 text-success" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-foreground">Tận Tâm Đồng Hành</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Dược sĩ & chuyên viên tư vấn mẹ & bé 24/7
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-border/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BabyWaleLogo size="md" onClick={() => navigateTo('home')} />
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Baby Wale ra đời từ tình yêu vô điều kiện dành cho trẻ thơ. Chúng tôi tuyển chọn những
              sản phẩm an toàn, chất lượng hàng đầu thế giới để mỗi người mẹ luôn an tâm trên hành trình
              nuôi con lớn khôn.
            </p>

            <div className="space-y-2 text-xs text-foreground/80">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span>120 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span className="font-bold text-primary">1900 8899</span>
                <span className="text-muted-foreground">(Cước gọi 1.000đ/phút)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span>cskh@babywale.vn</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>8:00 - 21:30 hàng ngày (kể cả Thứ Bảy, CN)</span>
              </p>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">Danh Mục Sản Phẩm</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateTo('shop', { category: cat.slug })}
                    className="hover:text-primary transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">Hỗ Trợ Khách Hàng</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <button
                  onClick={() => navigateTo('orders')}
                  className="hover:text-primary transition-colors"
                >
                  Tra cứu đơn hàng
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-primary transition-colors"
                >
                  Chính sách giao hàng & kiểm hàng
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-primary transition-colors"
                >
                  Chính sách bảo hành & đổi trả
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-primary transition-colors"
                >
                  Câu hỏi thường gặp (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-primary transition-colors"
                >
                  Hướng dẫn mua hàng & thanh toán
                </button>
              </li>
            </ul>
          </div>

          {/* About & Certification */}
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">Về Baby Wale</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-primary transition-colors"
                >
                  Câu chuyện thương hiệu
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-primary transition-colors"
                >
                  Hệ thống cửa hàng
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-primary transition-colors"
                >
                  Cam kết chất lượng
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-primary transition-colors"
                >
                  Liên hệ hợp tác phân phối
                </button>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-border/60">
              <span className="text-[11px] font-bold text-foreground block mb-1">
                Phương thức thanh toán
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-bold bg-muted px-2 py-1 rounded text-primary">
                  COD (Tiền mặt)
                </span>
                <span className="text-[10px] font-bold bg-muted px-2 py-1 rounded text-primary">
                  Chuyển khoản QR
                </span>
                <span className="text-[10px] font-bold bg-muted px-2 py-1 rounded text-primary">
                  VNPAY
                </span>
                <span className="text-[10px] font-bold bg-muted px-2 py-1 rounded text-primary">
                  MoMo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Baby Wale Vietnam. Bản quyền thuộc về Baby Wale Store.</p>
          <p className="flex items-center gap-1">
            Đồng hành cùng cha mẹ với trọn vẹn yêu thương <Heart className="w-3.5 h-3.5 text-secondary fill-secondary" />
          </p>
        </div>
      </div>
    </footer>
  );
};
