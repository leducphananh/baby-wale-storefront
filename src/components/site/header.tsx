import * as React from "react";

import { Container } from "@/components/layout/container";
import { CartIndicator } from "@/components/site/cart-indicator";

/**
 * Header structural foundation — S2.4 §10.2 / §8: sticky always, mobile
 * 104px (56 top row + 48 full-width search row — search is never hidden
 * behind an icon), desktop 64px (logo, nav, centered search, a quiet
 * "Tra cứu đơn hàng" link, cart). No login/account entry (guest MVP).
 *
 * This component is presentational only: it lays out the frozen structure
 * and heights and accepts slots for logo/nav/search/menu content. Real
 * navigation destinations, search behaviour, and the mobile nav sheet's
 * contents are wired by the storefront phase that needs them (S3+) — not
 * invented here.
 */
export interface HeaderProps {
  logo: React.ReactNode;
  search: React.ReactNode;
  cartHref: string;
  cartCount?: number;
  menuTrigger?: React.ReactNode;
  nav?: React.ReactNode;
  trackOrder?: React.ReactNode;
  account?: React.ReactNode;
}

import { Truck, ShieldCheck, PhoneCall } from "lucide-react";
import Link from "next/link";
import { QuickCartDrawer } from "@/features/cart/components/quick-cart-drawer";

function Header({ logo, search, cartHref, cartCount, menuTrigger, nav, trackOrder, account }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-md border-b border-border shadow-xs">
      {/* Top Announcement Bar (Desktop) */}
      <div className="bg-primary text-primary-foreground text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-accent-tint">
              <Truck className="w-3.5 h-3.5 text-secondary" />
              Miễn phí giao hàng toàn quốc từ 499.000₫
            </span>
            <span className="flex items-center gap-1.5 text-info">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              100% Sản phẩm chính hãng nguồn gốc rõ ràng
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs text-white/90">
            {trackOrder}
            <span className="text-white/30">|</span>
            <Link
              href="/ve-chung-toi"
              className="hover:text-secondary transition-colors"
            >
              Về Baby Wale
            </Link>
            <span className="text-white/30">|</span>
            <Link
              href="/lien-he"
              className="hover:text-secondary transition-colors flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3 text-secondary" />
              Hotline: 1900 8899
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3 sm:gap-6">
          {/* Mobile Hamburger & Logo */}
          <div className="flex items-center gap-3">
            <div className="lg:hidden">{menuTrigger}</div>
            {logo}
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {nav}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden lg:block">
            {search}
          </div>

          {/* Right Action Icons: Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {account}
            <div className="flex items-center">
              <QuickCartDrawer>
                <CartIndicator href={cartHref} count={cartCount} />
              </QuickCartDrawer>
            </div>
          </div>
        </div>
        
        {/* Mobile Search Row */}
        <div className="lg:hidden pb-3">
          {search}
        </div>
      </div>
    </header>
  );
}

export { Header };
