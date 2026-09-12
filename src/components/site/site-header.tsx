import * as React from "react";

import { Menu } from "lucide-react";
import Link from "next/link";

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
 * - **Cart**: the icon/badge stay (frozen anatomy), `count={0}` (there is no
 *   cart yet — S6), linking to `/gio-hang`. That route doesn't exist until
 *   S6; visiting it lands on the existing, calm `not-found.tsx` — honest
 *   ("doesn't exist yet"), not fake ("appears to work").
 * - **"Tra cứu đơn hàng"**: omitted (optional slot) — that route is S8,
 *   further out than cart; not worth a 404 link yet.
 */
async function SiteHeader() {
  const categories = await listStorefrontCategories();

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
    <Input
      type="search"
      disabled
      placeholder="Tìm kiếm sản phẩm (sắp ra mắt)"
      aria-label="Tìm kiếm sản phẩm (sắp ra mắt)"
      className="w-full"
    />
  );

  const nav = (
    <nav aria-label="Điều hướng chính" className="flex items-center gap-6">
      <Link
        href="/san-pham"
        className="text-body-sm font-medium text-text hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        Sản phẩm
      </Link>
      {categories.length > 0 ? (
        <details className="group relative">
          <summary className="flex cursor-pointer list-none items-center gap-1 text-body-sm font-medium text-text marker:content-none hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
            Danh mục
          </summary>
          <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-md border border-border bg-surface p-2 shadow-overlay">
            <ul className="flex max-h-80 flex-col gap-0.5 overflow-y-auto">
              {categories.map((category) => (
                <li key={category.categoryId}>
                  <Link
                    href={`/danh-muc/${category.slug}`}
                    className="block rounded-xs px-2 py-1.5 text-body-sm text-text hover:bg-surface-subtle"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </details>
      ) : null}
    </nav>
  );

  const menuTrigger = (
    <Sheet>
      <SheetTrigger
        className="sm-target inline-flex size-11 items-center justify-center rounded-sm text-text hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:hidden"
        aria-label="Mở menu điều hướng"
      >
        <Menu className="size-6" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Điều hướng</SheetTitle>
        </SheetHeader>
        <ul className="flex flex-col gap-1">
          <li>
            <SheetClose asChild>
              <Link href="/" className="block rounded-sm px-2 py-3 text-body text-text hover:bg-surface-subtle">
                Trang chủ
              </Link>
            </SheetClose>
          </li>
          <li>
            <SheetClose asChild>
              <Link
                href="/san-pham"
                className="block rounded-sm px-2 py-3 text-body text-text hover:bg-surface-subtle"
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
                  className="block rounded-sm px-2 py-3 text-body text-text hover:bg-surface-subtle"
                >
                  {category.name}
                </Link>
              </SheetClose>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );

  return <Header logo={logo} search={search} nav={nav} menuTrigger={menuTrigger} cartHref="/gio-hang" cartCount={0} />;
}

export { SiteHeader };
