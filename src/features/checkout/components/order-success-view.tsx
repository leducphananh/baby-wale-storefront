"use client";

import * as React from "react";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/layout/empty-state";
import { Price } from "@/components/catalog/price";
import { Button } from "@/components/ui/button";
import { LAST_ORDER_SESSION_KEY } from "@/features/checkout/components/checkout-view";
import { OrderDetailView, PAYMENT_METHOD_LABEL } from "@/features/checkout/components/order-detail-view";
import type { OrderDetail, OrderLookupResponse, StorefrontOrderConfirmation } from "@/features/checkout/types";

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
 * `/dat-hang-thanh-cong` body (S2.4 §10.7 / S2.1 §11.1, frozen). Reads the
 * just-created order confirmation from `sessionStorage` (set once, by
 * `CheckoutView`, right after a committed `create_storefront_order()`
 * response) — never from the URL, and never shown before the server
 * actually confirmed the order (checkout-security rule 9: "never
 * optimistically show 'đặt hàng thành công'"). "ORDER RECEIVED" framing
 * only — never "paid", "delivered", or "guaranteed to ship"; no
 * celebratory animation.
 *
 * `create_storefront_order()`'s own confirmation (S0 E4 §11) has no line
 * items and a raw `status` enum, not a customer label — so once a
 * `tracking_token` is available, this view makes exactly one additional
 * `/api/orders/lookup` call (S8 §20's "one authoritative RPC") to render
 * the full `OrderDetailView` the same way the tracking page does (S2.1
 * §11.2: "renders the same read-only order view as the success page"). If
 * that enrichment isn't available (a `null` token on an idempotent replay,
 * or a transient lookup failure), the page still shows the safe minimal
 * confirmation rather than blocking on it — the order was already created
 * successfully regardless.
 *
 * `useSyncExternalStore`, not `useState` + `useEffect`, for the
 * `sessionStorage` read (same reasoning as `useHasHydrated`) — the server
 * always renders the `null` snapshot; `sessionStorage` only exists in the
 * browser.
 *
 * A direct visit / refresh with nothing in `sessionStorage` is an honest
 * "not found" state (`storefront-error-handling`: "not found" ≠ "error"),
 * not a crash or a fabricated confirmation.
 */
function OrderSuccessView() {
  const raw = React.useSyncExternalStore(subscribe, getOrderSnapshot, () => null);
  const [copied, setCopied] = React.useState(false);
  const [detail, setDetail] = React.useState<OrderDetail | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("clear_cart") === "true") {
        import("@/features/cart/store").then(({ useCartStore }) => {
          useCartStore.getState().clearSelected();
        });
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("clear_cart");
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);

  let confirmation: StorefrontOrderConfirmation | null = null;
  if (raw) {
    try {
      confirmation = JSON.parse(raw) as StorefrontOrderConfirmation;
    } catch {
      confirmation = null;
    }
  }

  const trackingToken = confirmation?.tracking_token ?? null;

  React.useEffect(() => {
    if (!trackingToken) return;
    let cancelled = false;

    fetch("/api/orders/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: trackingToken }),
    })
      .then((res) => res.json())
      .then((body: OrderLookupResponse) => {
        if (!cancelled) setDetail(body.order);
      })
      .catch(() => {
        // The minimal sessionStorage confirmation below still renders —
        // this enrichment is a courtesy, not the source of truth for
        // "the order was created".
      });

    return () => {
      cancelled = true;
    };
  }, [trackingToken]);

  if (confirmation === null) {
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
    trackingToken && typeof window !== "undefined"
      ? `${window.location.origin}/tra-cuu-don-hang?token=${trackingToken}`
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
        Đơn hàng <span className="font-medium text-text">{confirmation.order_number}</span> đã được ghi nhận. Nhân
        viên cửa hàng sẽ liên hệ để xác nhận.
      </p>

      {detail ? (
        <OrderDetailView order={detail} />
      ) : (
        <div className="mt-2 flex flex-col gap-1 text-body-sm text-text">
          <p>
            Tổng tiền hàng:{" "}
            <Price amount={confirmation.total} treatZeroAsUnavailable={false} className="font-medium" />
          </p>
          <p>Phương thức thanh toán: {PAYMENT_METHOD_LABEL[confirmation.payment_method]}</p>
        </div>
      )}

      {trackingUrl ? (
        <div className="mt-4 flex flex-col items-center gap-2">
          <Button onClick={handleCopy} size="lg">
            {copied ? "Đã sao chép" : "Sao chép liên kết theo dõi"}
          </Button>
          <p className="text-caption text-text-muted">Lưu lại đường dẫn này để theo dõi đơn hàng.</p>
          <p className="max-w-sm break-all text-caption text-text-muted" aria-live="polite">
            {trackingUrl}
          </p>
        </div>
      ) : (
        <p className="text-caption text-text-muted">
          Vui lòng lưu lại mã đơn hàng <span className="font-medium">{confirmation.order_number}</span> để liên hệ
          khi cần.
        </p>
      )}

      <div className="mt-2 flex flex-col items-center gap-3">
        <Button asChild variant="secondary">
          <Link href="/san-pham">Tiếp tục mua sắm</Link>
        </Button>
        {/* A distinct manual-lookup page, not a duplicate button pointing
            back at this same success page (S2.1 §11.1 forbids that) — useful
            for a later return visit from another device. */}
        <Link href="/tra-cuu-don-hang" className="text-caption text-text-muted hover:text-primary hover:underline">
          Tra cứu đơn hàng
        </Link>
      </div>
    </div>
  );
}

export { OrderSuccessView };
