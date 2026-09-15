"use client";

import * as React from "react";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/layout/empty-state";
import { Price } from "@/components/catalog/price";
import { Button } from "@/components/ui/button";
import { LAST_ORDER_SESSION_KEY } from "@/features/checkout/components/checkout-view";
import type { PaymentMethod, StorefrontOrderConfirmation } from "@/features/checkout/types";

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  bank_transfer: "Chuyển khoản ngân hàng",
};

function subscribe(): () => void {
  return () => {};
}

function getOrderSnapshot(): string | null {
  try {
    return sessionStorage.getItem(LAST_ORDER_SESSION_KEY);
  } catch {
    return null;
  }
}

/**
 * `/dat-hang-thanh-cong` body (S2.4 §10.7, frozen). Reads the just-created
 * order confirmation from `sessionStorage` (set once, by `CheckoutView`,
 * right after a committed `create_storefront_order()` response) — never
 * from the URL, and never shown before the server actually confirmed the
 * order (checkout-security rule 9: "never optimistically show 'đặt hàng
 * thành công'"). "ORDER RECEIVED" framing only — never "paid", "delivered",
 * or "guaranteed to ship"; no celebratory animation.
 *
 * `useSyncExternalStore`, not `useState` + `useEffect` (same reasoning as
 * `useHasHydrated`) — the server always renders the `null` snapshot;
 * `sessionStorage` only exists in the browser.
 *
 * A direct visit / refresh with nothing in `sessionStorage` is an honest
 * "not found" state (`storefront-error-handling`: "not found" ≠ "error"),
 * not a crash or a fabricated confirmation.
 */
function OrderSuccessView() {
  const raw = React.useSyncExternalStore(subscribe, getOrderSnapshot, () => null);
  const [copied, setCopied] = React.useState(false);

  let order: StorefrontOrderConfirmation | null = null;
  if (raw) {
    try {
      order = JSON.parse(raw) as StorefrontOrderConfirmation;
    } catch {
      order = null;
    }
  }

  if (order === null) {
    return (
      <EmptyState
        titleAs="h1"
        title="Không tìm thấy thông tin đơn hàng gần đây"
        description="Nếu bạn vừa đặt hàng, vui lòng kiểm tra lại hoặc liên hệ cửa hàng để được hỗ trợ."
        action={
          <Button asChild variant="secondary">
            <Link href="/san-pham">Tiếp tục mua sắm</Link>
          </Button>
        }
      />
    );
  }

  const trackingUrl =
    order.tracking_token && typeof window !== "undefined"
      ? `${window.location.origin}/don-hang/theo-doi?token=${order.tracking_token}`
      : null;

  const handleCopy = async () => {
    if (!trackingUrl) return;
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setCopied(true);
    } catch {
      // Clipboard access can be denied — the link is still visible as text
      // below for manual copying, so this never blocks the customer.
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-md border border-border bg-surface px-6 py-10 text-center">
      <CheckCircle2 className="size-10 text-primary" aria-hidden="true" />
      <h1 className="text-h1 text-text">Đặt hàng thành công</h1>
      <p className="text-body text-text-muted">
        Đơn hàng <span className="font-medium text-text">{order.order_number}</span> đã được ghi nhận. Nhân viên
        cửa hàng sẽ liên hệ để xác nhận.
      </p>

      <div className="mt-2 flex flex-col gap-1 text-body-sm text-text">
        <p>
          Tổng tiền hàng: <Price amount={order.total} treatZeroAsUnavailable={false} className="font-medium" />
        </p>
        <p>Phương thức thanh toán: {PAYMENT_METHOD_LABEL[order.payment_method]}</p>
      </div>

      {trackingUrl ? (
        <div className="mt-4 flex flex-col items-center gap-2">
          <Button onClick={handleCopy} size="lg">
            {copied ? "Đã sao chép" : "Sao chép liên kết theo dõi"}
          </Button>
          <p className="max-w-sm break-all text-caption text-text-muted" aria-live="polite">
            {trackingUrl}
          </p>
        </div>
      ) : (
        <p className="text-caption text-text-muted">
          Vui lòng lưu lại mã đơn hàng <span className="font-medium">{order.order_number}</span> để liên hệ khi cần.
        </p>
      )}

      <Button asChild variant="secondary" className="mt-2">
        <Link href="/san-pham">Tiếp tục mua sắm</Link>
      </Button>
    </div>
  );
}

export { OrderSuccessView };
