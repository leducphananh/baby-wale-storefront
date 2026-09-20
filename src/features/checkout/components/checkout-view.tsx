"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

import { selectCartSubtotal, useCartStore } from "@/features/cart/store";
import { useHasHydrated } from "@/features/cart/use-has-hydrated";
import { formatVnd } from "@/lib/format/money";
import { Skeleton } from "@/components/ui/skeleton";
import type { CheckoutFormValues } from "@/features/checkout/schema";
import type {
  CheckoutErrorResponse,
  RevalidateLineResult,
  RevalidateResponse,
  StorefrontOrderConfirmation,
} from "@/features/checkout/types";

export const LAST_ORDER_SESSION_KEY = "bw-last-order";

export interface CheckoutViewProps {
  initialValues?: Partial<CheckoutFormValues>;
}

export function CheckoutView({ initialValues }: CheckoutViewProps) {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  
  const allLines = useCartStore((state) => state.lines);
  const selectedProductIds = useCartStore((state) => state.selectedProductIds);
  const lines = React.useMemo(() => {
    const selectedSet = new Set(selectedProductIds);
    return allLines.filter((line) => selectedSet.has(line.productId));
  }, [allLines, selectedProductIds]);
  const subtotal = useCartStore(selectCartSubtotal);
  const clearSelected = useCartStore((state) => state.clearSelected);

  const idempotencyKeyRef = React.useRef<string>(typeof window !== "undefined" ? crypto.randomUUID() : "");

  // Form State
  const [formData, setFormData] = React.useState({
    fullName: initialValues?.customerName || "",
    phoneNumber: initialValues?.customerPhone || "",
    email: initialValues?.customerEmail || "",
    streetAddress: initialValues?.shippingAddress || "",
    ward: "",
    district: "",
    city: "Hồ Chí Minh",
    notes: "",
  });

  const [shippingMethod, setShippingMethod] = React.useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = React.useState<"cod" | "bank_transfer" | "vnpay" | "momo">("cod");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Mock coupon logic
  const couponDiscount = 0;
  const couponCode = "";
  
  const shippingFee = 0; // Base shipping fee mock
  const effectiveShipping = shippingMethod === "express" ? shippingFee + 25000 : shippingFee;
  const finalTotal = subtotal + effectiveShipping - couponDiscount;

  const [issues, setIssues] = React.useState<RevalidateLineResult[]>([]);
  const [checkingIssues, setCheckingIssues] = React.useState(false);

  const revalidate = React.useCallback(async (): Promise<RevalidateResponse | null> => {
    setCheckingIssues(true);
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
      if (!response.ok) return null;
      const result = (await response.json()) as RevalidateResponse;

      const priceUpdates = result.items
        .filter((item) => item.status === "price_changed" && typeof item.currentPrice === "number")
        .map((item) => ({ productId: item.productId, newPrice: item.currentPrice as number }));

      if (priceUpdates.length > 0) {
        useCartStore.getState().updateLinePrices(priceUpdates);
      }

      setIssues(result.items.filter((item) => item.status !== "ok"));
      return result;
    } catch {
      return null;
    } finally {
      setCheckingIssues(false);
    }
  }, [lines]);

  React.useEffect(() => {
    if (!hasHydrated || lines.length === 0) return;
    const timeoutId = setTimeout(() => void revalidate(), 0);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, lines.length > 0]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("error") === "vnpay_failed") {
        setSubmitError("Giao dịch thanh toán bị huỷ hoặc thất bại. Vui lòng đặt lại.");
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("error");
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);

  if (!hasHydrated) {
    return (
      <div className="flex flex-col gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" aria-hidden="true">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Không có sản phẩm nào để thanh toán</h2>
        <p className="text-xs text-muted-foreground">Giỏ hàng của bạn đang trống.</p>
        <button
          onClick={() => router.push('/san-pham')}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl"
        >
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên";
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Vui lòng nhập số điện thoại nhận hàng";
    } else if (!/^[0-9]{9,11}$/.test(formData.phoneNumber.replace(/\s+/g, ""))) {
      errors.phoneNumber = "Số điện thoại không hợp lệ (9-11 số)";
    }
    if (!formData.streetAddress.trim()) errors.streetAddress = "Vui lòng nhập địa chỉ nhà, tên đường";
    if (!formData.district.trim()) errors.district = "Vui lòng nhập quận/huyện";
    if (!formData.city.trim()) errors.city = "Vui lòng nhập tỉnh/thành phố";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    const fresh = await revalidate();
    if (fresh && !fresh.ok) {
      setSubmitError("Thông tin sản phẩm đã thay đổi, vui lòng kiểm tra lại đơn hàng.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullAddress = [
        formData.streetAddress,
        formData.ward,
        formData.district,
        formData.city,
      ]
        .filter(Boolean)
        .join(", ");

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.fullName,
          customerPhone: formData.phoneNumber,
          shippingAddress: fullAddress,
          customerEmail: formData.email || undefined,
          notes: formData.notes || undefined,
          paymentMethod: paymentMethod === "vnpay" ? "vnpay" : "cod",
          items: lines.map((line) => ({ productId: line.productId, slug: line.slug, name: line.name, quantity: line.quantity })),
          idempotencyKey: idempotencyKeyRef.current,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        setSubmitError((body as CheckoutErrorResponse).message || "Không thể tạo đơn hàng.");
        return;
      }

      const confirmation = (body as { order: StorefrontOrderConfirmation }).order;
      const paymentUrl = (body as { paymentUrl?: string }).paymentUrl;
      try {
        sessionStorage.setItem(LAST_ORDER_SESSION_KEY, JSON.stringify(confirmation));
      } catch {
        // Ignored
      }
      
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        clearSelected();
        router.push("/dat-hang-thanh-cong");
      }
    } catch {
      setSubmitError("Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="baby-wale-checkout-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
          <li><Link href="/gio-hang" className="hover:text-primary transition-colors">Giỏ hàng</Link></li>
          <li className="flex items-center space-x-2">
            <span className="text-border">/</span>
            <span className="text-foreground font-semibold">Thanh toán an toàn</span>
          </li>
        </ol>
      </nav>

      <div className="pb-3 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Thanh Toán Đơn Hàng
        </h1>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          Môi trường thanh toán mã hóa an toàn 256-bit SSL
        </p>
      </div>

      {submitError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium">
          {submitError}
        </div>
      )}
      
      {issues.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-sm font-medium flex flex-col gap-1">
          <span>Một số sản phẩm trong giỏ hàng đã thay đổi thông tin:</span>
          <ul className="list-disc list-inside">
            {issues.map((issue) => (
              <li key={issue.productId}>{issue.name} - {issue.status}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Payment Details (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer & Shipping Address */}
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Thông Tin Giao Hàng
              </h3>

              <Link href="/dang-nhap" className="text-xs text-primary hover:underline font-semibold">
                Đăng nhập để tích điểm
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-foreground block mb-1">
                  Họ và tên người nhận <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Thị Mai"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                    validationErrors.fullName
                      ? "border-destructive bg-rose-50/50"
                      : "border-border bg-white focus:border-ring"
                  }`}
                />
                {validationErrors.fullName && (
                  <span className="text-[11px] text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.fullName}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Số điện thoại <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="0912 345 678"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                    validationErrors.phoneNumber
                      ? "border-destructive bg-rose-50/50"
                      : "border-border bg-white focus:border-ring"
                  }`}
                />
                {validationErrors.phoneNumber && (
                  <span className="text-[11px] text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.phoneNumber}
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Email nhận thông báo đơn hàng
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-xs focus:outline-none focus:border-ring"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-foreground block mb-1">
                  Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  placeholder="Số 45 ngõ 12, đường Lê Lợi"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                    validationErrors.streetAddress
                      ? "border-destructive bg-rose-50/50"
                      : "border-border bg-white focus:border-ring"
                  }`}
                />
                {validationErrors.streetAddress && (
                  <span className="text-[11px] text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.streetAddress}
                  </span>
                )}
              </div>

              {/* Ward */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Phường / Xã</label>
                <input
                  type="text"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  placeholder="Phường Bến Nghé"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-xs focus:outline-none focus:border-ring"
                />
              </div>

              {/* District */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Quận / Huyện <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Quận 1"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                    validationErrors.district
                      ? "border-destructive bg-rose-50/50"
                      : "border-border bg-white focus:border-ring"
                  }`}
                />
                {validationErrors.district && (
                  <span className="text-[11px] text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.district}
                  </span>
                )}
              </div>

              {/* City */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-foreground block mb-1">
                  Tỉnh / Thành phố <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="TP. Hồ Chí Minh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-xs focus:outline-none focus:border-ring"
                />
              </div>

              {/* Delivery Notes */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-foreground block mb-1">
                  Ghi chú cho shipper (Không bắt buộc)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ví dụ: Gọi trước khi giao, gửi bảo vệ tòa nhà nếu vắng nhà..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-xs focus:outline-none focus:border-ring"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Method */}
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft space-y-4">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2 pb-3 border-b border-border">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                2
              </span>
              Phương Thức Vận Chuyển
            </h3>

            <div className="space-y-3">
              <label
                onClick={() => setShippingMethod("standard")}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  shippingMethod === "standard"
                    ? "border-primary bg-pastel-pink/20 ring-1 ring-primary"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-foreground">
                      Giao Hàng Tiêu Chuẩn (Toàn quốc 2 - 3 ngày)
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Đóng thùng chống sốc cẩn thận, theo dõi lộ trình SMS
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">
                  {shippingFee === 0 ? "Nhân viên sẽ xác nhận" : formatVnd(shippingFee)}
                </span>
              </label>

              <label
                onClick={() => setShippingMethod("express")}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  shippingMethod === "express"
                    ? "border-primary bg-pastel-pink/20 ring-1 ring-primary"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-accent" />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                      Giao Hỏa Tốc 2H (Nội thành HCM & Hà Nội)
                      <span className="text-[10px] bg-secondary text-secondary-foreground font-black px-1.5 py-0.5 rounded">
                        SIÊU TỐC
                      </span>
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Tài xế giao ngay trong 2 giờ sau khi đặt hàng
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">
                  {formatVnd(shippingFee + 25000)}
                </span>
              </label>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft space-y-4">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2 pb-3 border-b border-border">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                3
              </span>
              Phương Thức Thanh Toán
            </h3>

            <div className="space-y-3">
              {/* COD */}
              <label
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-primary bg-pastel-pink/20 ring-1 ring-primary"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-foreground">
                    Thanh toán khi nhận hàng (COD)
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Kiểm tra sản phẩm trước khi thanh toán tiền mặt cho shipper.
                  </p>
                </div>
              </label>

              {/* VNPAY */}
              <label
                onClick={() => setPaymentMethod("vnpay")}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "vnpay"
                    ? "border-primary bg-pastel-pink/20 ring-1 ring-primary"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <CreditCard className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-foreground">
                    Cổng thanh toán VNPAY-QR
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Hỗ trợ tất cả ngân hàng tại Việt Nam và thẻ quốc tế Visa/Mastercard.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Submit (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft space-y-4 lg:sticky lg:top-24">
            <h3 className="font-extrabold text-base text-foreground pb-3 border-b border-border">
              Chi Tiết Đơn Hàng ({lines.length} món)
            </h3>

            {/* Line items mini preview */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {lines.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={item.imageUrl || "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=200&q=80"}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-border"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-foreground truncate">
                      {item.name}
                    </h5>
                    {item.unit && (
                      <span className="text-[10px] text-muted-foreground">
                        ĐVT: {item.unit}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-primary shrink-0">
                    {formatVnd(item.cachedUnitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost breakdown */}
            <div className="pt-3 border-t border-border space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-bold text-foreground">{formatVnd(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-bold text-foreground">
                  {effectiveShipping === 0 ? "Nhân viên sẽ xác nhận" : formatVnd(effectiveShipping)}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-secondary-foreground font-bold">
                  <span>Mã giảm giá ({couponCode}):</span>
                  <span>-{formatVnd(couponDiscount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-border flex justify-between items-baseline text-foreground">
                <span className="font-extrabold text-sm">Tổng thanh toán:</span>
                <span className="text-xl font-black text-primary">{formatVnd(finalTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="submit-order-btn"
              type="submit"
              disabled={isSubmitting || checkingIssues}
              className="w-full py-4 px-4 bg-primary text-primary-foreground font-bold text-sm rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting || checkingIssues ? (
                <span>Đang xử lý đơn hàng...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  Đặt hàng ngay • {formatVnd(finalTotal)}
                </>
              )}
            </button>

            {/* Guarantees */}
            <div className="text-[11px] text-muted-foreground space-y-1 pt-1">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Hỗ trợ đổi trả miễn phí trong 7 ngày nếu lỗi sản phẩm
              </p>
              <p className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-accent" />
                Kiểm tra sản phẩm & hóa đơn trước khi thanh toán
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
