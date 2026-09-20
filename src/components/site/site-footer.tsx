import * as React from "react";

import Link from "next/link";

import { Container } from "@/components/layout/container";
import { TRUST_COPY_LINES } from "@/lib/content/trust-copy";

/**
 * Site footer — S2.4 approved factual trust copy (§15) only. No fabricated
 * phone number, address, Zalo ID, certification, or delivery/shipping
 * promise (CLAUDE.md §8/§15, public-data-contract). "Hỗ trợ" keeps the
 * literal `[OWNER CONTENT TBD]` marker from the frozen contract rather than
 * inventing a channel.
 */
import { Heart, ShieldCheck, MapPin, Phone, Mail, Clock } from "lucide-react";

function SiteFooter() {
  return (
    <footer className="bg-surface border-t border-border mt-16 pt-12 pb-24 md:pb-12">
      {/* Trust Highlights Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 p-6 rounded-3xl bg-background border border-border/80">
          {TRUST_COPY_LINES.map((line, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-tint/60 flex items-center justify-center text-primary shrink-0">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center h-full">
                <h4 className="font-bold text-xs sm:text-sm text-text">{line}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-border/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="text-h3 text-text block mb-4">
              Baby Wale
            </Link>
            <p className="text-xs text-text-muted leading-relaxed max-w-sm">
              Baby Wale ra đời từ tình yêu vô điều kiện dành cho trẻ thơ. Cửa hàng mẹ & bé.
            </p>

            <div className="space-y-2 text-xs text-text/80">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span>[OWNER CONTENT TBD]</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span className="font-bold text-primary">[OWNER CONTENT TBD]</span>
              </p>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold text-sm text-text mb-3">Danh Mục Sản Phẩm</h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>
                <Link href="/san-pham" className="hover:text-primary transition-colors">
                  Tất cả sản phẩm
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-sm text-text mb-3">Hỗ Trợ Khách Hàng</h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>
                <Link href="/tra-cuu-don-hang" className="hover:text-primary transition-colors">
                  Tra cứu đơn hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Certification */}
          <div>
            <h4 className="font-bold text-sm text-text mb-3">Về Baby Wale</h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Trang chủ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} Baby Wale Vietnam. Bản quyền thuộc về Baby Wale Store.</p>
          <p className="flex items-center gap-1">
            Đồng hành cùng cha mẹ với trọn vẹn yêu thương <Heart className="w-3.5 h-3.5 text-secondary fill-secondary" />
          </p>
        </div>
      </div>
    </footer>
  );
}

export { SiteFooter };
