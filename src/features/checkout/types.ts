/**
 * Checkout DTOs — the shapes moving between the cart, `/api/cart/revalidate`,
 * `/api/checkout`, and `create_storefront_order()` / `get_storefront_order_by_token()`
 * (S7, `docs/S0-requirements-and-architecture.md` Part E4/E5/E7).
 */

export type PaymentMethod = "cod" | "bank_transfer";

/** What the client ever submits for a line — never a price (`checkout-security`). */
export interface CheckoutLineInput {
  productId: string;
  slug: string;
  name: string;
  quantity: number;
  /** Sent to `/api/cart/revalidate` only, to detect drift — never to `/api/checkout`. */
  cachedUnitPrice: number;
}

/**
 * `not_found` covers both "doesn't exist" and "archived/not web-visible" —
 * `get_storefront_product_by_slug` deliberately never distinguishes the two
 * to an anon caller (S3), so this endpoint can't either.
 */
export type RevalidateLineStatus = "ok" | "price_changed" | "out_of_stock" | "not_found";

export interface RevalidateLineResult {
  productId: string;
  name: string;
  status: RevalidateLineStatus;
  /** The real current price, when the product could be looked up. */
  currentPrice: number | null;
}

export interface RevalidateResponse {
  ok: boolean;
  items: RevalidateLineResult[];
}

/** S0 E7's exact stable error codes. */
export type CheckoutErrorCode =
  | "PRODUCT_NOT_FOUND"
  | "PRODUCT_UNAVAILABLE"
  | "OUT_OF_STOCK"
  | "QUANTITY_ADJUSTMENT_REQUIRED"
  | "PRICE_CHANGED"
  | "INVALID_QUANTITY"
  | "INVALID_CUSTOMER_DATA"
  | "ORDER_CREATE_FAILED";

export interface CheckoutErrorDetail {
  productId?: string;
  productName?: string;
  available?: number;
  field?: string;
  [key: string]: unknown;
}

export interface CheckoutErrorResponse {
  code: CheckoutErrorCode;
  /** Vietnamese, customer-facing — never a raw code or Postgres message. */
  message: string;
  /** Present only for INVALID_CUSTOMER_DATA — lets the form focus the right field. */
  field?: string;
}

/** The exact safe confirmation `create_storefront_order()` returns (S0 E4 §11). */
export interface StorefrontOrderConfirmation {
  order_number: string;
  /** Plaintext, shown once. `null` on an idempotent replay (see the S7 migration). */
  tracking_token: string | null;
  total: number;
  subtotal: number;
  shipping_fee: number;
  payment_method: PaymentMethod;
  status: string;
  created_at: string;
}
