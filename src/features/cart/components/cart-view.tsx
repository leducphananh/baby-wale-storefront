"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  ArrowLeft,
} from "lucide-react";

import { selectCartSubtotal, useCartStore } from "@/features/cart/store";
import { useHasHydrated } from "@/features/cart/use-has-hydrated";
import { formatVnd } from "@/lib/format/money";
import { Skeleton } from "@/components/ui/skeleton";

export function CartView() {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  
  const lines = useCartStore((state) => state.lines);
  const subtotal = useCartStore(selectCartSubtotal);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const toggleAllSelection = useCartStore((state) => state.toggleAllSelection);

  // Automatically select all items on load if none are selected (for subtotal calculation matching reference)
  React.useEffect(() => {
    if (hasHydrated && lines.length > 0) {
      toggleAllSelection(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, lines.length]);

  const [inputCoupon, setInputCoupon] = React.useState("");
  // Mock coupon logic for visual parity
  const [couponDiscount, setCouponDiscount] = React.useState(0);
  const [appliedCoupon, setAppliedCoupon] = React.useState("");

  const shippingFee = 0; // Mock shipping fee
  const total = subtotal + shippingFee - couponDiscount;
  const freeShippingThreshold = 500000;
  
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim().toUpperCase() === "BABYWALE50") {
      setCouponDiscount(50000);
      setAppliedCoupon("BABYWALE50");
      setInputCoupon("");
    }
  };

  const applyCouponDirect = (code: string) => {
    if (code === "BABYWALE50") {
      setCouponDiscount(50000);
      setAppliedCoupon("BABYWALE50");
    }
  };

  // Price sync effect (from original CartView)
  React.useEffect(() => {
    if (!hasHydrated || lines.length === 0) return;

    const syncPrices = async () => {
      try {
        const response = await fetch("/api/cart/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: lines.map((line) => ({
              productId: line.productId,
              slug: line.slug,
              name: line.name,
              quantity: line.quantity,
              cachedUnitPrice: line.cachedUnitPrice,
            })),
          }),
        });

        if (!response.ok) return;

        const result = await response.json();
        const priceUpdates = (result.items || [])
          .filter((item: { status: string; currentPrice?: number; productId: string }) => item.status === "price_changed" && typeof item.currentPrice === "number")
          .map((item: { status: string; currentPrice?: number; productId: string }) => ({ productId: item.productId, newPrice: item.currentPrice as number }));

        if (priceUpdates.length > 0) {
          useCartStore.getState().updateLinePrices(priceUpdates);
        }
      } catch {
        // Silently fail
      }
    };

    const timeoutId = setTimeout(() => void syncPrices(), 0);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, lines.length > 0]);

  if (!hasHydrated) {
    return (
      <div className="flex flex-col gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" aria-hidden="true">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div id="baby-wale-empty-cart" className="max-w-4xl mx-auto px-4 py-12 text-center space-y-6">
        <nav aria-label="Breadcrumb" className="mb-4 text-left">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link></li>
            <li className="flex items-center space-x-2">
              <span className="text-border">/</span>
              <span className="text-foreground font-semibold">Giỏ hàng</span>
            </li>
          </ol>
        </nav>

        <div className="bg-card border border-border rounded-3xl p-10 sm:p-16 shadow-soft space-y-5">
          <div className="w-20 h-20 rounded-full bg-pastel-pink/60 text-secondary mx-auto flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Hãy khám phá các sản phẩm bỉm tã, sữa dinh dưỡng và đồ dùng an toàn cao cấp cho bé tại Baby Wale nhé!
          </p>
          <button
            id="empty-cart-shop-now-btn"
            onClick={() => router.push('/san-pham')}
            className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="baby-wale-cart-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link></li>
          <li className="flex items-center space-x-2">
            <span className="text-border">/</span>
            <span className="text-foreground font-semibold">Giỏ hàng</span>
          </li>
        </ol>
      </nav>

      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Giỏ Hàng Của Bạn ({lines.length} món)
        </h1>
        <button
          onClick={clear}
          className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 font-semibold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Xóa tất cả
        </button>
      </div>

      {/* Free Shipping Progress Callout */}
      <div className="p-4 rounded-2xl bg-pastel-pink/30 border border-pink-200/80">
        <div className="flex items-center justify-between text-xs mb-2">
          {remainingForFreeShipping > 0 ? (
            <span className="font-semibold text-foreground">
              Mua thêm <strong className="text-primary">{formatVnd(remainingForFreeShipping)}</strong> để được <span className="text-emerald-700 font-bold">Miễn phí giao hàng</span>!
            </span>
          ) : (
            <span className="font-bold text-emerald-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Bạn đã được Miễn phí giao hàng toàn quốc!
            </span>
          )}
          <span className="font-bold text-primary">{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-white/80 rounded-full h-2 overflow-hidden">
          <div
            className="bg-secondary h-full rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Cart Grid Layout: Product List (Left) + Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Line items */}
        <div className="lg:col-span-8 space-y-3.5">
          {lines.map((item) => (
            <div
              key={item.productId}
              className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-soft flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              {/* Product Thumbnail & Details */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <img
                  src={item.imageUrl || "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=200&q=80"}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-contain bg-white p-1 border border-border/80 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <h3
                    className="text-xs sm:text-sm font-bold text-foreground hover:text-primary cursor-pointer line-clamp-2"
                    onClick={() => router.push(`/san-pham/${item.slug}`)}
                  >
                    {item.name}
                  </h3>
                  {item.unit && (
                    <span className="inline-block text-[11px] font-medium bg-muted text-foreground px-2 py-0.5 rounded-md mt-1">
                      ĐVT: {item.unit}
                    </span>
                  )}
                  <div className="text-xs font-extrabold text-primary sm:hidden mt-1">
                    {formatVnd(item.cachedUnitPrice)}
                  </div>
                </div>
              </div>

              {/* Price & Quantity & Remove */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/60">
                <div className="hidden sm:block text-right">
                  <div className="text-xs text-muted-foreground">Đơn giá</div>
                  <div className="text-sm font-bold text-foreground">
                    {formatVnd(item.cachedUnitPrice)}
                  </div>
                </div>

                {/* Stepper */}
                <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden shadow-xs">
                  <button
                    onClick={() => decrementQuantity(item.productId)}
                    className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Giảm số lượng"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-black text-foreground min-w-[28px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => incrementQuantity(item.productId)}
                    className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Tăng số lượng"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[100px]">
                  <div className="text-[11px] text-muted-foreground hidden sm:block">Thành tiền</div>
                  <div className="text-sm font-black text-primary">
                    {formatVnd(item.cachedUnitPrice * item.quantity)}
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-rose-50 rounded-xl transition-colors"
                  aria-label="Xóa sản phẩm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <button
              onClick={() => router.push('/san-pham')}
              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Tiếp tục chọn thêm sản phẩm khác
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft space-y-4">
            <h3 className="font-extrabold text-base text-foreground pb-3 border-b border-border">
              Tóm Tắt Đơn Hàng
            </h3>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-bold text-foreground">{formatVnd(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-muted-foreground" /> Phí vận chuyển:
                </span>
                <span className="font-bold text-foreground">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold">Nhân viên sẽ xác nhận</span>
                  ) : (
                    formatVnd(shippingFee)
                  )}
                </span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-secondary-foreground bg-pastel-pink/50 p-2 rounded-xl font-bold">
                  <span>Mã giảm ({appliedCoupon}):</span>
                  <span>-{formatVnd(couponDiscount)}</span>
                </div>
              )}
            </div>

            {/* Voucher Coupon Form */}
            <div className="pt-2">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Nhập mã BABYWALE50"
                    className="w-full pl-8 pr-2 py-2 text-xs uppercase bg-muted/60 rounded-xl border border-border focus:border-ring focus:outline-none"
                  />
                  <Tag className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Áp dụng
                </button>
              </form>
              <span className="text-[10px] text-muted-foreground block mt-1">
                Gợi ý mã: <strong className="text-primary cursor-pointer" onClick={() => applyCouponDirect('BABYWALE50')}>BABYWALE50</strong> (Giảm 50.000₫)
              </span>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-border flex justify-between items-baseline">
              <span className="font-extrabold text-sm text-foreground">Tổng tiền hàng:</span>
              <span className="text-2xl font-black text-primary">{formatVnd(total)}</span>
            </div>

            {/* Primary Checkout Button */}
            <button
              id="proceed-to-checkout-btn"
              onClick={() => router.push('/thanh-toan')}
              className="w-full py-3.5 px-4 bg-primary text-primary-foreground font-bold text-sm rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98"
            >
              Tiến hành thanh toán
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust reassurance */}
            <div className="text-[11px] text-muted-foreground space-y-1.5 pt-2">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Cam kết bảo mật thông tin khách hàng tuyệt đối
              </p>
              <p className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-accent" />
                Được kiểm tra hàng trước khi thanh toán (COD)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
