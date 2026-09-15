import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { mapCheckoutErrorCode, statusForCheckoutErrorCode } from "@/features/checkout/error-map";
import { checkoutRequestSchema } from "@/features/checkout/schema";
import type { CheckoutErrorCode, StorefrontOrderConfirmation } from "@/features/checkout/types";

/**
 * The storefront's only order-write path (`checkout-security`). Server Zod
 * re-validates the request (mandatory layer 2 — never trust that the
 * client's RHF/Zod actually ran); `create_storefront_order()` is the
 * authoritative layer 3 — it re-prices every line from `products` and
 * re-checks sellable stock itself, so nothing here (or in the client) is
 * ever treated as the real price/stock, including the pre-submit
 * `/api/cart/revalidate` check. One RPC call = one atomic transaction.
 */
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(json);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { code: "INVALID_CUSTOMER_DATA", message: firstIssue?.message ?? "Thông tin đơn hàng không hợp lệ." },
      { status: 400 },
    );
  }

  const { customerName, customerPhone, shippingAddress, customerEmail, note, paymentMethod, items, idempotencyKey } =
    parsed.data;

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_storefront_order", {
    p_customer_name: customerName,
    p_customer_phone: customerPhone,
    p_shipping_address: shippingAddress,
    p_customer_email: customerEmail && customerEmail.length > 0 ? customerEmail : undefined,
    p_note: note && note.length > 0 ? note : undefined,
    p_payment_method: paymentMethod,
    // Only product_id + quantity — never a price (checkout-security rule 1).
    p_items: items.map((item) => ({ product_id: item.productId, quantity: item.quantity })),
    p_idempotency_key: idempotencyKey,
  });

  if (error) {
    // The RPC's error contract (S7 migration): MESSAGE is a stable S0 E7
    // code, DETAIL (when present) is small structured JSON context. Never
    // forward `error.message`/`error.details` to the customer directly.
    let detail: Record<string, unknown> = {};
    try {
      detail = error.details ? JSON.parse(error.details) : {};
    } catch {
      detail = {};
    }
    const mapped = mapCheckoutErrorCode(error.message, detail);
    return NextResponse.json(mapped, { status: statusForCheckoutErrorCode(mapped.code as CheckoutErrorCode) });
  }

  return NextResponse.json({ order: data as unknown as StorefrontOrderConfirmation }, { status: 201 });
}

// A checkout submission is never cached.
export const dynamic = "force-dynamic";
