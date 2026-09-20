import * as React from "react";

import { Menu, User } from "lucide-react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { Header } from "@/components/site/header";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { listStorefrontCategories } from "@/features/catalog/server/list-categories";

/**
 * Wires the S2.5 `Header` primitive with real storefront content — S2.4
 * §10.2's frozen anatomy, composed here (not redesigned).
 *
 * - **Logo**: a text wordmark (no Baby Wale logo asset exists in this repo
 *   — CLAUDE.md §15 forbids fabricating one, so a plain wordmark stands in
 *   until a real asset is supplied).
 * - **Search**: rendered (frozen anatomy requires the row) but `disabled` —
 *   `list_storefront_products` has no `p_search` parameter yet (S3 explicitly
 *   deferred it to whichever phase implements it), and adding one is a new
 *   additive migration, which this phase's "no DB change by default" rule
 *   reserves for a deliberate, separately-reviewed step. A disabled field
 *   with an honest label is not fake functionality — it does not claim to
 *   search.
 * - **Nav**: "Sản phẩm" (`/san-pham`) plus "Danh mục" as a native `<details>`
 *   disclosure listing real categories — no new dropdown/Popover primitive
 *   added to the design system for this (a native element needs no client
 *   JS and is keyboard-operable by default).
 * - **Cart**: `cartCount` is left unset so `CartIndicator` self-reads the
 *   real Zustand cart store (S5, `cart-state` skill) — the badge now
 *   reflects whatever "Thêm vào giỏ" has actually added. Links to
 *   `/gio-hang`, which doesn't exist until S6; visiting it lands on the
 *   existing, calm `not-found.tsx` — honest ("doesn't exist yet"), not fake.
 * - **"Tra cứu đơn hàng"**: wired (S8) — a quiet desktop `trackOrder` link
 *   plus a mobile hamburger-drawer entry, both pointing at
 *   `/tra-cuu-don-hang` (S2.1 §5: footer + hamburger + a de-emphasized
 *   header link, never a prominent header CTA).
 */
async function SiteHeader() {
  const categories = await listStorefrontCategories();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Text wordmark — no Baby Wale logo asset exists in this repo yet
  // (CLAUDE.md §15: reuse the real asset, never fabricate one).
  const logo = (
    <Link
      href="/"
      className="text-h3 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      Baby Wale
    </Link>
  );

  const search = (
    <form action="/san-pham" className="w-full">
      <Input
        type="search"
        name="tu-khoa"
        placeholder="Tìm kiếm sản phẩm theo tên, thương hiệu..."
        aria-label="Tìm kiếm sản phẩm"
        className="w-full"
      />
    </form>
  );

  const nav = (
    <nav aria-label="Điều hướng chính" className="flex items-center gap-2 text-sm font-semibold">
      <Link
        href="/"
        className="px-3.5 py-2 rounded-xl text-text hover:text-primary hover:bg-surface-subtle transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        Trang chủ
      </Link>
      {categories.length > 0 ? (
        <details className="group relative">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3.5 py-2 rounded-xl text-text marker:content-none hover:text-primary hover:bg-surface-subtle transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
            Danh mục
          </summary>
          <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-border bg-surface py-2 shadow-overlay">
            <ul className="flex max-h-80 flex-col gap-0.5 overflow-y-auto">
              {categories.map((category) => (
                <li key={category.categoryId}>
                  <Link
                    href={`/danh-muc/${category.slug}`}
                    className="block px-3.5 py-2.5 text-xs font-semibold text-text hover:bg-surface-subtle hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </details>
      ) : null}
      <Link
        href="/san-pham"
        className="px-3.5 py-2 rounded-xl text-text hover:text-primary hover:bg-surface-subtle transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        Sản phẩm
      </Link>
    </nav>
  );

  const trackOrder = (
    <Link
      href="/tra-cuu-don-hang"
      className="hover:text-secondary transition-colors"
    >
      Kiểm tra đơn hàng
    </Link>
  );

  const account = (
    <Link
      href={user ? "/tai-khoan" : "/dang-nhap"}
      className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl text-text hover:bg-surface-subtle transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      aria-label="Tài khoản"
    >
      <div className="w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center text-primary font-bold overflow-hidden border border-border">
        <User className="size-4" aria-hidden="true" />
      </div>
      <div className="hidden xl:flex flex-col text-left">
        <span className="text-[11px] text-text-muted leading-tight">Xin chào,</span>
        <span className="text-xs font-bold text-primary truncate max-w-[90px]">
          Tài khoản
        </span>
      </div>
    </Link>
  );

  const menuTrigger = (
    <Sheet>
      <SheetTrigger
        className="inline-flex size-11 items-center justify-center rounded-xl text-text hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:hidden"
        aria-label="Mở menu điều hướng"
      >
        <Menu className="size-6" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <ul className="flex flex-col gap-1 mt-4">
          <li>
            <SheetClose asChild>
              <Link href="/" className="block rounded-xl px-4 py-3 font-semibold text-text hover:bg-surface-subtle">
                Trang chủ
              </Link>
            </SheetClose>
          </li>
          <li>
            <SheetClose asChild>
              <Link
                href="/san-pham"
                className="block rounded-xl px-4 py-3 font-semibold text-text hover:bg-surface-subtle"
              >
                Tất cả sản phẩm
              </Link>
            </SheetClose>
          </li>
          {categories.map((category) => (
            <li key={category.categoryId}>
              <SheetClose asChild>
                <Link
                  href={`/danh-muc/${category.slug}`}
                  className="block rounded-xl px-4 py-3 font-semibold text-text hover:bg-surface-subtle"
                >
                  {category.name}
                </Link>
              </SheetClose>
            </li>
          ))}
          <li>
            <SheetClose asChild>
              <Link
                href="/tra-cuu-don-hang"
                className="block rounded-xl px-4 py-3 font-semibold text-text hover:bg-surface-subtle"
              >
                Tra cứu đơn hàng
              </Link>
            </SheetClose>
          </li>
        </ul>
      </SheetContent>
    </Sheet>
  );

  return (
    <Header
      logo={logo}
      search={search}
      nav={nav}
      menuTrigger={menuTrigger}
      trackOrder={trackOrder}
      account={account}
      cartHref="" // No longer navigates, opens drawer
      cartCount={undefined}
    />
  );
}

export { SiteHeader };
