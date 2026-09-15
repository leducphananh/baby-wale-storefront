import { z } from "zod";

/**
 * Order tracking — S2.1 §11.2 (locked): one field that accepts **either** a
 * raw tracking token **or** a full Baby Wale tracking URL the customer
 * pasted. Token-only lookup (`S0 B13`) — never `order_number` alone, never
 * an `order_number` + `phone` fallback (explicitly out of MVP scope).
 */

/**
 * Extracts the token to send to `get_storefront_order_by_token()`. If the
 * input parses as an absolute URL with a `token` query param, that value is
 * used; otherwise the trimmed input itself is treated as a raw token. Pure
 * and side-effect free — shared by the client form and the server route
 * handler (defense in depth: a URL that slips past the client is still
 * normalized server-side before the RPC call).
 */
export function extractTrackingToken(rawInput: string): string {
  const trimmed = rawInput.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    const fromQuery = url.searchParams.get("token");
    if (fromQuery && fromQuery.trim().length > 0) {
      return fromQuery.trim();
    }
  } catch {
    // Not a parseable absolute URL — fall through and treat the whole
    // input as a raw token.
  }

  return trimmed;
}

export const trackingFormSchema = z.object({
  trackingInput: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập mã theo dõi hoặc dán liên kết theo dõi đơn hàng."),
});

export type TrackingFormValues = z.infer<typeof trackingFormSchema>;

export const trackingLookupRequestSchema = z.object({
  token: z.string().trim().min(1),
});
