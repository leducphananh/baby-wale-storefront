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
  /** e.g. a hamburger `SheetTrigger` wired by the caller — not built here. */
  menuTrigger?: React.ReactNode;
  /** Desktop nav slot ("Sản phẩm" / "Danh mục", S2.4 §10.2). */
  nav?: React.ReactNode;
  /** Desktop quiet "Tra cứu đơn hàng" link slot. */
  trackOrder?: React.ReactNode;
}

function Header({ logo, search, cartHref, cartCount, menuTrigger, nav, trackOrder }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      {/* Mobile (< lg): 56px top row + 48px search row = 104px */}
      <div className="lg:hidden">
        <Container className="flex h-14 items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {menuTrigger}
            {logo}
          </div>
          <CartIndicator href={cartHref} count={cartCount} />
        </Container>
        <Container className="flex h-12 items-center">{search}</Container>
      </div>

      {/* Desktop (>= lg): 64px, single row */}
      <Container className="hidden h-16 items-center gap-6 lg:flex">
        {logo}
        {nav}
        <div className="flex-1">{search}</div>
        {trackOrder}
        <CartIndicator href={cartHref} count={cartCount} />
      </Container>
    </header>
  );
}

export { Header };
