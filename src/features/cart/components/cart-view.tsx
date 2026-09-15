"use client";

import * as React from "react";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/layout/empty-state";
import { Price } from "@/components/catalog/price";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CartItemRow } from "@/features/cart/components/cart-item-row";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { selectCartSubtotal, useCartStore } from "@/features/cart/store";
import { useHasHydrated } from "@/features/cart/use-has-hydrated";

/**
 * `/gio-hang` body — the only client boundary on the page (the route's
 * `page.tsx` stays a Server Component, S6 §21). Hydration-safe: the cart
 * only exists in `localStorage`, read on the client, so this renders a
 * neutral skeleton until `useHasHydrated()` flips — never guesses "empty"
 * vs "has items" from the server (cart-state rule 5, reused from S5).
 *
 * Sticky mobile CTA (S2.4 §9.2/§10.4, unconditional — unlike Product
 * Detail's scroll-triggered bar, Cart's mobile sticky Checkout bar is
 * always present, not conditional on scroll position): the desktop summary
 * card (`showCta`) and the mobile fixed bottom bar are two different DOM
 * regions gated by responsive visibility classes, exactly the pattern
 * `Header` already uses for its own mobile/desktop rows — never both
 * visible at the same viewport.
 */
function CartView() {
  const hasHydrated = useHasHydrated();
  const lines = useCartStore((state) => state.lines);
  const subtotal = useCartStore(selectCartSubtotal);

  if (!hasHydrated) {
    return (
      <div className="flex flex-col gap-4" aria-hidden="true">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="size-8" strokeWidth={1.5} />}
        title="Giỏ hàng đang trống"
        description="Hãy thêm sản phẩm bạn cần vào giỏ hàng."
        action={
          <Button asChild variant="secondary">
            <Link href="/san-pham">Tiếp tục mua sắm</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-24 lg:flex-row lg:items-start lg:pb-0">
      <ul className="flex-1">
        {lines.map((line) => (
          <CartItemRow key={line.productId} line={line} />
        ))}
      </ul>

      {/* Desktop: the summary card, CTA included, sits beside the items —
          S2.4 doesn't freeze a sticky desktop cart summary (only Checkout's
          does), so this is a normal in-flow panel, not sticky. */}
      <CartSummary
        subtotal={subtotal}
        className="hidden rounded-md border border-border bg-surface p-4 lg:block lg:w-80 lg:shrink-0"
      />

      {/* Mobile: the always-present sticky bottom bar is the only place the
          CTA appears at this width. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-overlay lg:hidden">
        <div className="mx-auto flex max-w-content items-center justify-between gap-3">
          <div aria-live="polite">
            <span className="text-caption text-text-muted">Tổng tiền hàng</span>
            <Price amount={subtotal} role="total" treatZeroAsUnavailable={false} className="block" />
          </div>
          <Button asChild size="lg">
            <Link href="/thanh-toan">Tiến hành đặt hàng</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export { CartView };
