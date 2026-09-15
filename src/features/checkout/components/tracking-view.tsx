"use client";

import * as React from "react";

import { CheckoutIssueBanner } from "@/features/checkout/components/checkout-issue-banner";
import { OrderDetailView } from "@/features/checkout/components/order-detail-view";
import { TrackingForm } from "@/features/checkout/components/tracking-form";
import { extractTrackingToken, type TrackingFormValues } from "@/features/checkout/tracking";
import type { OrderDetail, OrderLookupResponse } from "@/features/checkout/types";

type LookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; order: OrderDetail }
  | { status: "not-found" }
  | { status: "error" };

export interface TrackingViewProps {
  /** From `?token=` on the page's own URL (a pasted tracking link) — pre-fills and auto-submits once. */
  initialToken?: string;
}

/**
 * `/tra-cuu-don-hang` body (S2.1 §11.2, locked). One request per lookup —
 * `/api/orders/lookup` → `get_storefront_order_by_token()` — no polling, no
 * repeated calls (S8 §20). The "not found" and "malformed input" cases
 * render the exact same combined, non-revealing message (never distinguish
 * them — avoids probing an unguessable token, S2.1 §11.2/S0 B13).
 */
function TrackingView({ initialToken }: TrackingViewProps) {
  const [state, setState] = React.useState<LookupState>({ status: "idle" });

  const lookup = React.useCallback(async (rawInput: string) => {
    const token = extractTrackingToken(rawInput);
    if (!token) {
      setState({ status: "not-found" });
      return;
    }

    setState({ status: "loading" });
    try {
      const response = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        setState({ status: "error" });
        return;
      }

      const body = (await response.json()) as OrderLookupResponse;
      setState(body.order ? { status: "found", order: body.order } : { status: "not-found" });
    } catch {
      setState({ status: "error" });
    }
  }, []);

  const handleSubmit = (values: TrackingFormValues) => lookup(values.trackingInput);

  React.useEffect(() => {
    if (!initialToken) return;
    // Deferred out of the effect's synchronous execution (react-hooks/set-
    // state-in-effect) — lookup() sets "loading" state before its first
    // await, same pattern already used in CheckoutView.
    const timeoutId = setTimeout(() => void lookup(initialToken), 0);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialToken]);

  const loading = state.status === "loading";

  return (
    <div className="flex flex-col gap-6">
      <TrackingForm onSubmit={handleSubmit} loading={loading} defaultValue={initialToken} />

      {state.status === "not-found" ? (
        <CheckoutIssueBanner
          tone="danger"
          message="Không tìm thấy đơn hàng với mã này. Vui lòng kiểm tra lại đường dẫn hoặc liên hệ cửa hàng."
        />
      ) : null}

      {state.status === "error" ? (
        <CheckoutIssueBanner tone="danger" message="Không thể tra cứu lúc này. Vui lòng thử lại sau." />
      ) : null}

      {state.status === "found" ? (
        <div className="rounded-md border border-border bg-surface p-4">
          <OrderDetailView order={state.order} />
        </div>
      ) : null}
    </div>
  );
}

export { TrackingView };
