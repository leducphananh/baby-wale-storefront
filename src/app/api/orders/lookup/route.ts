import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { extractTrackingToken, trackingLookupRequestSchema } from "@/features/checkout/tracking";
import type { OrderDetail, OrderLookupResponse } from "@/features/checkout/types";
import { rateLimit } from "@/lib/rate-limit";

/**
 * The storefront's only order-read path for a guest (S8 §19). Calls the
 * existing `get_storefront_order_by_token()` (S7) server-side — never a
 * direct browser → Supabase RPC call, matching the same Route Handler
 * boundary `/api/checkout` already established.
 *
 * Always responds `200` with `{ order: null }` for a malformed, empty, or
 * unknown token — the same shape either way, never a different status code
 * or message (S2.1 §11.2: "one combined, non-revealing message... do not
 * distinguish malformed vs no such order — avoids probing"). Only a genuine
 * unexpected backend failure is a `500`.
 */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  // Allow 15 lookups per minute per IP to deter enumeration
  const { success, remaining, reset } = rateLimit(`lookup_${ip}`, 15, 60000); 

  if (!success) {
    return NextResponse.json(
      { code: "RATE_LIMITED", message: "Bạn tra cứu quá nhanh. Vui lòng thử lại sau giây lát." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = trackingLookupRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ order: null } satisfies OrderLookupResponse, { status: 200 });
  }

  const token = extractTrackingToken(parsed.data.token);
  if (!token) {
    return NextResponse.json({ order: null } satisfies OrderLookupResponse, { status: 200 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_storefront_order_by_token", { p_token: token });

  if (error) {
    // Unexpected backend failure only — a not-found/malformed token is a
    // normal `null` return from the RPC itself, handled below.
    return NextResponse.json(
      { code: "ORDER_CREATE_FAILED", message: "Không thể tra cứu lúc này. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { order: (data as unknown as OrderDetail | null) ?? null } satisfies OrderLookupResponse,
    { status: 200 },
  );
}

// A tracking lookup is never cached.
export const dynamic = "force-dynamic";
