"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore, selectCartCount, selectCartSubtotal } from "@/features/cart/store";
import { useHasHydrated } from "@/features/cart/use-has-hydrated";
import { CartItemRow } from "@/features/cart/components/cart-item-row";
import { Price } from "@/components/catalog/price";

interface QuickCartDrawerProps {
  children?: React.ReactNode;
}

export function QuickCartDrawer({ children }: QuickCartDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const hasHydrated = useHasHydrated();
  const lines = useCartStore((state) => state.lines);
  const cartCount = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);

  if (!hasHydrated) return <>{children}</>;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
          <SheetTitle className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Giỏ hàng của bạn
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-black">
              {cartCount}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-text-muted">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p>Giỏ hàng của bạn đang trống</p>
              <Button variant="primary" onClick={() => setOpen(false)} asChild>
                <Link href="/san-pham">Tiếp tục mua sắm</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {lines.map((line) => (
                <div key={line.productId} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <CartItemRow line={line} />
                </div>
              ))}
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-border p-4 bg-surface-subtle">
            <div className="flex justify-between items-center mb-4">
              <span className="text-text font-medium">Tạm tính:</span>
              <span className="text-lg font-bold text-primary">
                <Price amount={subtotal} role="card" treatZeroAsUnavailable={false} />
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" asChild onClick={() => setOpen(false)}>
                <Link href="/gio-hang">Xem giỏ hàng</Link>
              </Button>
              <Button variant="primary" asChild onClick={() => setOpen(false)}>
                <Link href="/thanh-toan">Thanh toán</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
