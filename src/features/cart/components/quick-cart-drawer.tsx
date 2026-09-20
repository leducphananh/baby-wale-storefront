"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCartStore, selectCartCount, selectCartSubtotal } from "@/features/cart/store";
import { useHasHydrated } from "@/features/cart/use-has-hydrated";
import { formatVnd } from "@/lib/format/money";

interface QuickCartDrawerProps {
  children?: React.ReactNode;
}

export function QuickCartDrawer({ children }: QuickCartDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const lines = useCartStore((state) => state.lines);
  const cartCount = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const updateQuantity = useCartStore((state) => state.setQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const removeFromCart = useCartStore((state) => state.removeItem);

  if (!hasHydrated) return <>{children}</>;

  const freeShippingThreshold = 499000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      {/* We need to use VisuallyHidden or just sr-only to fix radix accessibility warnings for missing Title/Description */}
      <SheetContent side="right" className="w-full sm:max-w-md p-0 border-0 shadow-2xl flex flex-col bg-white">
        <SheetTitle className="sr-only">Giỏ hàng của bạn</SheetTitle>
        <SheetDescription className="sr-only">Quick view of your cart items</SheetDescription>
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg text-primary">
              Giỏ hàng của bạn ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
            aria-label="Đóng giỏ hàng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-4 py-3 bg-pastel-pink/30 border-b border-pink-100">
          {remainingForFreeShipping > 0 ? (
            <p className="text-xs text-foreground font-medium mb-1.5">
              Mua thêm <span className="font-bold text-primary">{formatVnd(remainingForFreeShipping)}</span> để được <strong className="text-emerald-700">Miễn Phí Giao Hàng Toàn Quốc</strong>!
            </p>
          ) : (
            <p className="text-xs text-emerald-700 font-bold mb-1.5 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Bạn đã đủ điều kiện Miễn Phí Vận Chuyển!
            </p>
          )}
          <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {lines.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-bold text-foreground text-base">Giỏ hàng đang trống</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Khám phá những món đồ chăm sóc tốt nhất cho bé yêu từ Baby Wale nhé!
              </p>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push('/san-pham');
                }}
                className="mt-4 px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:bg-primary/90 transition-colors"
              >
                Mua sắm ngay
              </button>
            </div>
          ) : (
            lines.map((line) => (
              <div
                key={line.productId}
                className="flex gap-3 p-2.5 rounded-xl border border-border/70 hover:border-accent/40 bg-white transition-all shadow-xs"
              >
                {line.imageUrl ? (
                  <img
                    src={line.imageUrl}
                    alt={line.name}
                    className="w-18 h-18 rounded-lg object-cover bg-muted shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-18 h-18 rounded-lg bg-muted shrink-0 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4
                      className="text-xs font-bold text-foreground line-clamp-2 hover:text-accent cursor-pointer"
                      onClick={() => {
                        setOpen(false);
                        router.push(`/san-pham/${line.slug}`);
                      }}
                    >
                      {line.name}
                    </h4>
                    <span className="inline-block text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded mt-1">
                      {line.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-dashed border-border/60">
                    <span className="text-xs font-bold text-primary">
                      {formatVnd(line.cachedUnitPrice)}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
                        <button
                          onClick={() => decrementQuantity(line.productId)}
                          className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Giảm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-2 text-foreground min-w-[20px] text-center">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => incrementQuantity(line.productId)}
                          className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Tăng"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(line.productId)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {lines.length > 0 && (
          <div className="p-4 border-t border-border bg-background/80 backdrop-blur-xs space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Tạm tính:</span>
              <span className="font-extrabold text-lg text-primary">{formatVnd(subtotal)}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              *Phí vận chuyển và mã ưu đãi được tính tại bước thanh toán.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                id="view-full-cart-btn"
                onClick={() => {
                  setOpen(false);
                  router.push('/gio-hang');
                }}
                className="w-full py-2.5 px-3 border border-primary text-primary font-bold text-xs rounded-xl hover:bg-primary/5 transition-colors text-center"
              >
                Xem giỏ hàng
              </button>
              <button
                id="proceed-checkout-quick-btn"
                onClick={() => {
                  setOpen(false);
                  router.push('/thanh-toan');
                }}
                className="w-full py-2.5 px-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                Thanh toán
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
