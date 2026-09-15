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

/**
 * One historical order line, exactly as `get_storefront_order_by_token()`
 * returns it (S8) — `unitPrice`/`lineTotal` are the order's own snapshot
 * values (`order_items.unit_price`/`line_total`), **never** re-derived from
 * the current `products.selling_price` (S8 §10 — tracking is a historical
 * view).
 */
export interface OrderDetailItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

/**
 * The safe, read-only order view shared by the success page and the
 * tracking result (S2.1 §11.2: "renders the same read-only order view as
 * the success page"). `status` is already the customer-facing Vietnamese
 * label (S2.4 §10.8 / S2.1 §12.1, locked) — the RPC maps it, the frontend
 * never re-maps a raw enum. Deliberately excludes `paymentStatus` (S2.1
 * §12.2: never a paid/unpaid badge on success/tracking) and the
 * `customerNameSnapshot`/`customerPhoneSnapshot`/`shippingAddressSnapshot`
 * fields the RPC also returns (S8 §23 — minimum necessary customer data;
 * the order recipient already knows their own contact details).
 */
export interface OrderDetail {
  orderNumber: string;
  status: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  items: OrderDetailItem[];
  note: string | null;
}

export interface OrderLookupResponse {
  order: OrderDetail | null;
}
