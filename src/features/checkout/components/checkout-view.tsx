"use client";

import * as React from "react";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { selectCartSubtotal, useCartStore } from "@/features/cart/store";
import { useHasHydrated } from "@/features/cart/use-has-hydrated";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { CheckoutIssueBanner, type CheckoutIssueTone } from "@/features/checkout/components/checkout-issue-banner";
import { CheckoutOrderReview } from "@/features/checkout/components/checkout-order-review";
import { CheckoutSummary } from "@/features/checkout/components/checkout-summary";
import type { CheckoutFormValues } from "@/features/checkout/schema";
import type {
  CheckoutErrorResponse,
  RevalidateLineResult,
  RevalidateResponse,
  StorefrontOrderConfirmation,
} from "@/features/checkout/types";

/** sessionStorage key the success page reads — never the URL (no token/PII in it). */
export const LAST_ORDER_SESSION_KEY = "bw-last-order";

const ISSUE_TONE: Record<Exclude<RevalidateLineResult["status"], "ok">, CheckoutIssueTone> = {
  price_changed: "info",
  out_of_stock: "danger",
  not_found: "danger",
};

function issueMessage(item: RevalidateLineResult): string {
  switch (item.status) {
    case "price_changed":
      return `Giá "${item.name}" đã thay đổi thành ${formatIssuePrice(item.currentPrice)}.`;
    case "out_of_stock":
      return `"${item.name}" đã hết hàng.`;
    case "not_found":
      return `"${item.name}" hiện không còn được bán.`;
    default:
      return "";
  }
}

function formatIssuePrice(amount: number | null): string {
  if (amount === null) return "—";
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
}

/**
 * `/thanh-toan` body — the checkout orchestrator (S2.4 §10.5). Mirrors
 * `CartView`'s hydration-safety pattern (cart-state rule 5): nothing about
 * the cart is read until `useHasHydrated()` flips.
 *
 * Idempotency key (S0 E6, checkout-security rule 6): generated exactly once
 * per mount via `useRef`, sent with every submit attempt on this page load
 * — a retry/double-click reuses the same key so the RPC's `UNIQUE`
 * constraint, not the disabled button, is what actually prevents a
 * duplicate order.
 */
function CheckoutView() {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const lines = useCartStore((state) => state.lines);
  const subtotal = useCartStore(selectCartSubtotal);
  const clearCart = useCartStore((state) => state.clear);

  const idempotencyKeyRef = React.useRef<string>(crypto.randomUUID());

  const [issues, setIssues] = React.useState<RevalidateLineResult[]>([]);
  const [checkingIssues, setCheckingIssues] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<CheckoutErrorResponse | null>(null);

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
      setIssues(result.items.filter((item) => item.status !== "ok"));
      return result;
    } catch {
      // A failed pre-check doesn't block checkout — create_storefront_order()
      // is still the real authority (checkout-security).
      return null;
    } finally {
      setCheckingIssues(false);
    }
  }, [lines]);

  React.useEffect(() => {
    if (!hasHydrated || lines.length === 0) return;
    // Deferred out of the effect's synchronous execution (react-hooks/set-
    // state-in-effect) — revalidate() sets loading state before its first
    // await. Only re-runs when hydration completes; the submit handler
    // re-checks freshly regardless.
    const timeoutId = setTimeout(() => void revalidate(), 0);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, lines.length > 0]);

  const handleSubmit = async (values: CheckoutFormValues) => {
    setSubmitError(null);

    const fresh = await revalidate();
    if (fresh && !fresh.ok) {
      // Surfaced via the `issues` banner already set by revalidate(); stop
      // here rather than submitting a cart the customer hasn't re-confirmed
      // (checkout-security rule 7).
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          items: lines.map((line) => ({ productId: line.productId, slug: line.slug, name: line.name, quantity: line.quantity })),
          idempotencyKey: idempotencyKeyRef.current,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        setSubmitError(body as CheckoutErrorResponse);
        return;
      }

      const confirmation = (body as { order: StorefrontOrderConfirmation }).order;
      try {
        sessionStorage.setItem(LAST_ORDER_SESSION_KEY, JSON.stringify(confirmation));
      } catch {
        // sessionStorage can throw in a locked-down browser context — the
        // order is already committed server-side either way; the success
        // page has its own fallback state for a missing confirmation.
      }
      // Clear only after the RPC returned a committed confirmation
      // (cart-state rule 8 / checkout-security rule 8).
      clearCart();
      router.push("/dat-hang-thanh-cong");
    } catch {
      setSubmitError({ code: "ORDER_CREATE_FAILED", message: "Không thể tạo đơn hàng. Vui lòng thử lại." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasHydrated) {
    return (
      <div className="flex flex-col gap-4" aria-hidden="true">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="size-8" strokeWidth={1.5} />}
        title="Giỏ hàng đang trống"
        description="Hãy thêm sản phẩm vào giỏ hàng trước khi thanh toán."
        action={
          <Button asChild variant="secondary">
            <Link href="/san-pham">Tiếp tục mua sắm</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <div className="flex flex-1 flex-col gap-6">
        <CheckoutOrderReview lines={lines} />

        {issues.length > 0 ? (
          <div className="flex flex-col gap-2" aria-live="polite">
            {issues.map((item) => {
              const status = item.status;
              if (status === "ok") return null;
              return <CheckoutIssueBanner key={item.productId} tone={ISSUE_TONE[status]} message={issueMessage(item)} />;
            })}
          </div>
        ) : null}

        {submitError ? (
          <CheckoutIssueBanner
            tone={submitError.code === "PRICE_CHANGED" ? "info" : submitError.code === "QUANTITY_ADJUSTMENT_REQUIRED" ? "warning" : "danger"}
            message={submitError.message}
          />
        ) : null}

        <CheckoutForm
          onSubmit={handleSubmit}
          submitting={submitting || checkingIssues}
          serverFieldError={submitError?.field ? { field: submitError.field, message: submitError.message } : undefined}
        />
      </div>

      <CheckoutSummary
        subtotal={subtotal}
        className="rounded-md border border-border bg-surface p-4 lg:sticky lg:top-24 lg:w-80 lg:shrink-0"
      />
    </div>
  );
}

export { CheckoutView };
