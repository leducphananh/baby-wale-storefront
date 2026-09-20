"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, selectCartCount, selectCartSubtotal } from "@/features/cart/store";
import { formatVnd } from "@/lib/format/money";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";

export function CartDrawer() {
  const router = useRouter();
  const {
    isCartDrawerOpen,
    setCartDrawerOpen,
    lines: cart,
    incrementQuantity,
    decrementQuantity,
    removeItem: removeFromCart,
  } = useCartStore();
  
  const cartCount = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);

  // We only want to calculate subtotal for all lines here for simplicity in drawer
  const totalDrawerSubtotal = cart.reduce((sum, item) => sum + item.quantity * item.cachedUnitPrice, 0);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 499000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalDrawerSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((totalDrawerSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-primary/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg text-primary">
                Giỏ hàng của bạn ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setCartDrawerOpen(false)}
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
            {cart.length === 0 ? (
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
                    setCartDrawerOpen(false);
                    router.push("/san-pham");
                  }}
                  className="mt-4 px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Mua sắm ngay
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 p-2.5 rounded-xl border border-border/70 hover:border-accent/40 bg-white transition-all shadow-xs"
                >
                  {/* Since imageUrl is null, we show a fallback */}
                  <div className="w-18 h-18 rounded-lg overflow-hidden bg-muted shrink-0 flex items-center justify-center border border-border/50">
                    <ShoppingBag className="w-6 h-6 text-muted-foreground/40" />
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4
                        className="text-xs font-bold text-foreground line-clamp-2 hover:text-accent cursor-pointer"
                        onClick={() => {
                          setCartDrawerOpen(false);
                          router.push(`/san-pham/${item.slug}`);
                        }}
                      >
                        {item.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-dashed border-border/60">
                      <span className="text-xs font-bold text-primary">
                        {formatVnd(item.cachedUnitPrice)}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
                          <button
                            onClick={() => decrementQuantity(item.productId)}
                            className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Giảm"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-2 text-foreground min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => incrementQuantity(item.productId)}
                            className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Tăng"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
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
          {cart.length > 0 && (
            <div className="p-4 border-t border-border bg-background/80 backdrop-blur-xs space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Tạm tính:</span>
                <span className="font-extrabold text-lg text-primary">{formatVnd(totalDrawerSubtotal)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                *Phí vận chuyển và mã ưu đãi được tính tại bước thanh toán.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  id="view-full-cart-btn"
                  onClick={() => {
                    setCartDrawerOpen(false);
                    router.push("/gio-hang");
                  }}
                  className="w-full py-2.5 px-3 border border-primary text-primary font-bold text-xs rounded-xl hover:bg-primary/5 transition-colors text-center"
                >
                  Xem giỏ hàng
                </button>
                <button
                  id="proceed-checkout-quick-btn"
                  onClick={() => {
                    setCartDrawerOpen(false);
                    router.push("/thanh-toan");
                  }}
                  className="w-full py-2.5 px-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Thanh toán
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
