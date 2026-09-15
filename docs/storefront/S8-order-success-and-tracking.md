# S8 — Order Success & Order Tracking

Completes the customer-facing order lifecycle after S7's checkout: a richer, self-
sufficient success page, and a new guest order-tracking page. No database schema
change — reuses `get_storefront_order_by_token()` (S7) exactly as built.

## 1. Objective

Checkout → Success → (customer saves the tracking link) → later, `/tra-cuu-don-hang`
→ lookup → the same customer-safe order view. Guest tracking only, token-based, no
customer accounts.

## 2. Inspection performed before writing anything

Re-read `docs/design/S2.1-information-architecture-and-user-flows.md` §11–§12 in
full (the locked order-success/tracking flow and status/payment copy contract) and
the live `get_storefront_order_by_token()` body (already known — written in S7,
unchanged here). Two real findings shaped the design:

- **S2.1 §11.2 is explicit that tracking is token-only** — "one field that accepts
  either a raw tracking token or a full Baby Wale tracking URL," never an
  `order_number` + phone fallback (S0 B13 explicitly recommends against it, to avoid
  order enumeration). The S8 brief offered "order code + phone verification" as one
  *possible* model to consider; S2.1's already-locked decision and the actual S7 RPC
  signature (`get_storefront_order_by_token(p_token text)`, no phone parameter) both
  confirm token-only is correct — no RPC change needed or made.
- **A real label conflict, same category as S7's**: S0 Part E7 listed `completed` →
  "Đã xử lý / hoàn tất"; **S2.1 §12.1 independently locks a different wording**,
  "Đơn hàng đã được xác nhận" (**D1**) — and this is the exact wording S7's own fix
  migration already chose (it followed S2.4 §10.8, which agrees with S2.1). No further
  change was needed; this is recorded here as confirmation, not a new fix.
- **S2.1 §12.2 (locked) forbids a paid/unpaid badge anywhere on success/tracking** —
  "prefer showing method + instructions, not a paid/unpaid badge." The S7 success page
  already didn't show one; S8's shared `OrderDetailView` (§5) preserves this by
  deliberately not accepting or rendering `paymentStatus` at all, even though the RPC
  still returns it.

## 3. No database changes

Per S8 §33 ("Prefer NO database schema changes") and because `get_storefront_order_
by_token()` was already safe and sufficient: zero new migrations. The function's
return shape (camelCase JSON: `orderNumber`, `status` — already the mapped customer
label — `paymentStatus`, `paymentMethod`, `createdAt`, `subtotal`, `shippingFee`,
`total`, `items[{productName, quantity, unitPrice, lineTotal}]`, and the
`*Snapshot` contact/shipping fields) is consumed as-is.

## 4. New server surface

`src/app/api/orders/lookup/route.ts` (POST `{token}`) — the only new backend-touching
code. Calls `get_storefront_order_by_token()` server-side (never a direct browser →
Supabase RPC call, same Route Handler boundary `/api/checkout` established in S7).
Always responds `200` with `{order: null}` for a malformed, empty, or unknown token —
**the identical shape either way** (S2.1 §11.2: "one combined, non-revealing
message... avoids probing"). Only a genuine unexpected backend failure is a `500`,
with a generic Vietnamese message, never the raw Postgres/RPC error.

`extractTrackingToken()` (`src/features/checkout/tracking.ts`) — a pure function
shared by the client form and the Route Handler: if the input parses as an absolute
URL with a `token` query param, that value is used; otherwise the trimmed input is
treated as a raw token. Applied both client-side (before submit) and server-side
(defense in depth, in case a URL slips through unchanged).

## 5. Shared read-only order view

`OrderDetailView` (`src/features/checkout/components/order-detail-view.tsx`) — used
by **both** the success page and the tracking result, per S2.1 §11.2's "renders the
same read-only order view as the success page." Renders: order number; the
already-mapped status label (plus a "Vui lòng liên hệ cửa hàng nếu bạn cần hỗ trợ."
helper only when the status is "Đã huỷ"); the payment method label + a method-specific
helper line (bank-transfer's helper describes a confirmation step, not fabricated
account details — CLAUDE.md O8 is still unresolved); the item list using the order's
own historical `unitPrice`/`lineTotal` (never re-fetched from `products.selling_price`
— S8 §10/§12, the type itself has no field for a "current price"); and the three-line
totals format from S2.1 §12.3 ("Tạm tính (hàng hoá)" / "Phí vận chuyển: Nhân viên sẽ
xác nhận" / "Tổng tiền hàng"). Deliberately omits `paymentStatus`, and the
`customerNameSnapshot`/`customerPhoneSnapshot`/`shippingAddressSnapshot` fields the
RPC also returns — the frontend `OrderDetail` type has no fields for them at all (S8
§23: minimum necessary customer data).

## 6. Order success page (`/dat-hang-thanh-cong`)

`create_storefront_order()`'s own confirmation (S0 E4 §11) has no line items and a
raw `status` enum — not enough, on its own, for S2.1 §11.1's full "order summary"
requirement. `OrderSuccessView` now makes exactly **one** additional
`/api/orders/lookup` call (using the `tracking_token` it just received) to render the
full `OrderDetailView`, satisfying S8 §20's "one authoritative RPC" egress budget. If
that enrichment isn't available (a `null` token on an idempotent replay, or a
transient failure) the page still shows the safe minimal confirmation — the order was
already created successfully regardless, and this is disclosed as a real limitation
(§9). CTA hierarchy follows S2.4 §10.7 / S2.1 §11.1 exactly (primary: "Sao chép liên
kết theo dõi"; secondary: "Tiếp tục mua sắm") over the S8 brief's own example
hierarchy, which inverted it — the same "frozen design doc wins over a phase brief's
restated wording" precedent already applied in S6 and S7. A third, clearly
de-emphasized text link to `/tra-cuu-don-hang` was added for a later return visit —
not a duplicate "Theo dõi đơn hàng" button pointing back at this same page, which
S2.1 §11.1 explicitly forbids.

**Fixed a real S7 bug in passing**: the success page's copied tracking link pointed at
a placeholder path, `/don-hang/theo-doi`, invented in S7 because the real page didn't
exist yet. It now points at the real `/tra-cuu-don-hang?token=...` this phase builds.

## 7. Order tracking page (`/tra-cuu-don-hang`)

`TrackingForm` (RHF + Zod, one field, "Tra cứu" submit) + `TrackingView`
(idle/loading/found/not-found/error states) + the page itself, which reads an
optional `?token=` search param and auto-runs one lookup on mount (a customer who
followed a copied/pasted tracking link lands directly on their result, no extra
click). `noindex` (S2.1 explicitly lists tracking alongside cart/checkout/success as
non-indexable). Wired into the global entry points S2.1 §5 specifies: a quiet desktop
header link (the `Header` primitive's existing `trackOrder` slot, built in S2.5 but
left unwired — its own comment said "that route is S8"), a mobile hamburger-drawer
entry, and a footer link.

## 8. Egress / Supabase-request audit

- `/api/orders/lookup` issues exactly one RPC call per request — no polling, no
  repeated calls, no N+1.
- The tracking page issues at most one lookup per page load (a manual submit, or the
  one auto-lookup from a `?token=`, never both for the same visit).
- The success page issues exactly one enrichment lookup, once, when a tracking token
  is available.
- No catalog, product-image, or customer-table fetch anywhere in this phase's new
  code (confirmed by the repo-wide grep sweep in §11).

## 9. Known limitations (disclosed, not silently shipped)

- **No live-browser screenshot of the tracking page's async "found"/"not-found"
  result state.** Headless Chrome's `--screenshot` captures immediately after the
  page-load event, before the client-side auto-lookup `fetch` (dispatched from a
  `useEffect`) resolves — the same category of limitation already disclosed in S5/S6/
  S7 (no Puppeteer/Playwright available to wait for an async render). The static idle
  and pre-fill states were screenshotted successfully at 390/768/1440px and match the
  design system. The actual lookup behavior (found, not-found, price/status
  correctness) was instead verified two ways: (1) a real end-to-end call against the
  live Next.js dev server and the live database — creating one real temporary test
  order via `create_storefront_order`, then hitting the real `/api/orders/lookup`
  route with its real token, a URL-wrapped version of that token, and a bogus token,
  confirming the exact expected JSON in each case (cleaned up after, same live-data
  hygiene as every prior phase); (2) 236 passing Vitest/RTL tests, including explicit
  assertions that the found order actually renders after a real `user-event` submit
  and after the auto-lookup effect fires.
- **The S7-documented idempotent-replay token limitation is unchanged and still
  relevant**: if a customer's first checkout response never reached their browser,
  there is still no way to recover the plaintext token — S8 did not (and per its own
  instructions, should not) weaken the token model to work around this. Their
  recovery path remains contacting the store (O7).
- **S7's "normal global header instead of S2.4's frozen slim checkout header"
  limitation is unchanged** — S8 did not touch `/thanh-toan`'s layout at all beyond
  what §6/§7 describe, per the explicit instruction not to risk a root-layout
  restructure for a cosmetic gain.
- **Rate limiting is not implemented** (S8 §21/CLAUDE.md defer this to S12/S13). The
  tracking token is a random 24-byte value (48 hex characters, 192 bits of entropy) —
  not practically brute-forceable — and the lookup response is identical for
  "malformed" and "not found," so there is no enumeration signal today; a dedicated
  rate-limiting layer is still a real, separate hardening item for later.

## 10. Scope compliance

No customer accounts, no payment gateway, no inventory reservation, no public image
infrastructure, no admin UI change, no polling/realtime tracking, no new client state
library (`useState`/`useSyncExternalStore` only, matching the rest of the checkout
feature), no database schema change.
