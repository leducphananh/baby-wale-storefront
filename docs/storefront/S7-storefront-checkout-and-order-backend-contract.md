# S7 — Storefront Checkout + Storefront Order Backend Contract

Implements S0's Part E4/E5 RPC design (F6–F11) and the customer-facing `/thanh-toan`
checkout flow. This is the storefront's second Supabase-touching phase (after S3) and
its first **write** path — everything before this phase was read-only.

## 1. Objective

Let a guest turn their client-side cart (S5/S6, still purely display state) into a
real, server-authoritative `orders` row, without ever trusting a browser-submitted
price, without auto-completing the order, and without duplicating the existing admin
order-lifecycle logic.

## 2. Database changes (additive only)

Three migrations, all applied live to the shared project (`jtkmycvkthciiskwptqv`) and
recorded in `supabase/migrations/`:

- `20260915120000_s7_storefront_order_backend_contract.sql` — nine additive columns on
  `orders` (S0 F6–F9: `source`, `customer_name_snapshot`/`customer_phone_snapshot`/
  `shipping_address_snapshot`, `recipient_name`, `shipping_fee`, `tracking_token_hash`,
  `idempotency_key`, `payment_method`) plus the two new functions.
- `20260915120500_s7_fix_stock_check_for_share_aggregate.sql` — a same-day fix: real
  black-box testing (not code review) caught `FOR SHARE is not allowed with aggregate
  functions`, a genuine Postgres rejection in the original stock-check query. Fixed by
  locking the candidate batch rows in a plain `SELECT ... FOR SHARE` subquery, then
  aggregating the locked set outside it. Locking semantics are unchanged.
- `20260915121000_s7_fix_completed_status_label.sql` — a second same-day fix: S0 Part
  E7's error-contract table gives `completed` the label "Đã xử lý / hoàn tất", but
  `docs/design/S2.4-design-system-and-approval.md` §10.8 — the project's authoritative
  design source of truth (CLAUDE.md §2) — freezes a different label, "Đơn hàng đã được
  xác nhận". Same precedent as S6 (cart totals terminology): S2.4 wins. `draft` and
  `cancelled` are unaffected — S0 and S2.4 agree on those two. The stale wording in
  `.claude/skills/vietnamese-ecommerce-ui/SKILL.md` was also corrected.

No table dropped, no existing column/constraint/RLS policy/grant touched, no existing
row rewritten (every new column is `DEFAULT`ed or stays `NULL` for historical rows).
Still needs manual mirroring into `baby-store-web/supabase/migrations/` (Admin
Coordination follow-up — not done here, CLAUDE.md §14, same open item as S3's
migration).

### Inspection performed before writing the migration

Per CLAUDE.md §12 ("inspect before changing... the existing Admin order workflow is
the canonical business behavior"), the live bodies of `create_order`, `complete_order`,
`cancel_order`, `update_order_draft`, and `record_order_payment` were read via
`pg_get_functiondef` before any code was written, along with the live `orders` /
`order_items` / `customers` / `products` column and constraint lists and the current
RLS policies on `orders` / `order_items` / `customers`. Findings that shaped the
design:

- `create_order()` calls `complete_order()` immediately after inserting `order_items`
  — it auto-completes and allocates FEFO stock. **This is why
  `create_storefront_order()` could not reuse or extend it**: a website checkout must
  never auto-complete (CLAUDE.md §6, S0 O2). The new function stops right after
  inserting `order_items`.
- `complete_order()`'s FEFO predicate (`remaining_quantity > 0 AND (expiration_date IS
  NULL OR expiration_date >= v_business_today)`, `v_business_today := (now() at time
  zone 'Asia/Ho_Chi_Minh')::date`) — reused verbatim for the stock check, exactly as
  S3 already reused it for `in_stock`.
- The `order_number` generation pattern (`pg_advisory_xact_lock(hashtext(...))` +
  `ORD-###`) — reused verbatim from `create_order()`.
- Every RLS policy on `orders` / `order_items` / `customers` is scoped `TO
  authenticated` only — `anon` has **zero** policy on any of the three, confirming
  `SECURITY DEFINER` is the only mechanism available for a guest write, not a choice
  made for convenience.
- `update_order_draft()` (an admin-only RPC) accepts a client-submitted `unit_price`
  directly — a valid pattern there because it's `authenticated`-only (staff-trusted),
  but confirms this is **not** a pattern to reuse for a guest-facing function.

## 3. `create_storefront_order()` — the RPC contract

```sql
create_storefront_order(
  p_customer_name text, p_customer_phone text, p_shipping_address text,
  p_customer_email text default null, p_note text default null,
  p_payment_method text, p_items jsonb, p_idempotency_key uuid
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp
```

(Every parameter defaults to `null` in the live signature — Postgres requires
defaulted parameters to be trailing, and S0's own declared order interleaves required
and optional ones. Supabase/PostgREST always calls this function with named arguments,
so parameter order was never part of the real call contract; only the body's explicit
null-checks are.)

Responsibilities, all server-authoritative (matches S0 §37):

1. **Idempotency first.** A missing `p_idempotency_key` is rejected
   (`INVALID_CUSTOMER_DATA`). A reused key returns the **original** order's
   confirmation instead of creating a second order — checked both up front and again
   inside the `orders` insert's own `unique_violation` handler, so a genuine
   concurrent double-submit (two requests racing past the first check) still resolves
   to one order, not two or a hard failure.
2. Customer fields validated: non-empty name/address, a valid `cod`/`bank_transfer`
   payment method, an optional-but-well-formed email, and a normalized Vietnamese
   phone (`+84`/`84`-prefix folded to a local `0XXXXXXXXX`, then `^0[0-9]{9}$`).
3. Items validated as a non-empty JSON array; each element needs a `product_id` and an
   integer `quantity >= 1`.
4. Each product is locked `FOR SHARE` and re-read from `products` — must exist
   (`PRODUCT_NOT_FOUND`), be `status = 'active'` **and** `is_web_visible`
   (`PRODUCT_UNAVAILABLE`).
5. Sellable stock is the same FEFO-safe batch sum S3 already uses, locked
   `FOR SHARE` (a check, not a reservation — S0 B9, documented in the migration
   comment): zero → `OUT_OF_STOCK`; less than requested → `QUANTITY_ADJUSTMENT_
   REQUIRED` with the real available count in the error's structured `DETAIL`.
6. `unit_price` is always `products.selling_price`, read at call time — **never** a
   client-submitted value (`p_items` only ever carries `product_id` + `quantity`).
7. `shipping_fee = 0` for MVP (CLAUDE.md §8 — not financially integrated).
8. Customer dedupe by normalized phone: `INSERT ... ON CONFLICT (phone) DO UPDATE SET
   updated_at = now()` — reuses the existing customer id without overwriting their
   stored name/email/address (the order's own `*_snapshot` columns already preserve
   what *this* order submitted; the `customers` row is an identity key, not a log).
9. `order_number` via the reused advisory-lock pattern; a random 24-byte hex
   `tracking_token` is generated, and only its SHA-256 hash
   (`extensions.digest(..., 'sha256')`) is ever persisted — the plaintext is returned
   once, to the caller, and nowhere else.
10. Inserts `orders` at `status = 'draft'`, `source = 'website'`, `payment_status =
    'unpaid'`, all `*_snapshot` fields, `shipping_fee`, `idempotency_key`,
    `payment_method` — then `order_items` (server-priced) — and **stops**. No
    `order_item_batches`, no `inventory_transactions`, no call to `complete_order()`.
11. Returns only `{order_number, tracking_token, total, subtotal, shipping_fee,
    payment_method, status, created_at}` — never the order UUID, COGS, batch data, or
    internal notes.

The whole function is one transaction — any `RAISE EXCEPTION` rolls everything back
(no partial order).

### Error contract

Every `RAISE EXCEPTION` sets `MESSAGE` to one of S0 Part E7's exact stable codes
(`PRODUCT_NOT_FOUND`, `PRODUCT_UNAVAILABLE`, `OUT_OF_STOCK`,
`QUANTITY_ADJUSTMENT_REQUIRED`, `INVALID_QUANTITY`, `INVALID_CUSTOMER_DATA`,
`ORDER_CREATE_FAILED`), and where there's structured context (e.g. the real sellable
quantity), a `DETAIL` of a small JSON object. PostgREST/`supabase-js` surface these as
`error.message` / `error.details` — the Route Handler reads `error.message` directly
as the code (no fragile string-prefix parsing) and `JSON.parse`s `error.details` when
present, then maps both to a Vietnamese customer message
(`src/features/checkout/error-map.ts`). `PRICE_CHANGED` is **not** raised by this
function — `p_items` never carries a client price for it to compare against, so
there's nothing to "mismatch" from the RPC's point of view; the friendly pre-submit
price-drift check is `/api/cart/revalidate`'s job (§6 below), reusing the existing S3
`get_storefront_product_by_slug` RPC rather than adding new backend surface for it.
`DUPLICATE_CHECKOUT` is not an error — see responsibility 1.

## 4. `get_storefront_order_by_token()`

```sql
get_storefront_order_by_token(p_token text) returns jsonb
language plpgsql security definer stable set search_path = public, pg_temp
```

Hashes the incoming token and looks up `orders.tracking_token_hash` — **never** by
`order_number` or id alone (CLAUDE.md §6). Returns `null` (not an error) for an
unknown or malformed token, so a guessed token can't be distinguished from a
malformed one. The returned JSON (camelCase — this function's own convention, since a
`jsonb`-returning function has no inherited column-name convention to match) is
`orderNumber`, a customer-facing `status` label, `paymentStatus`, `paymentMethod`,
`createdAt`, `subtotal`, `shippingFee`, `total`, `items` (`productName`, `quantity`,
`unitPrice`, `lineTotal` per line), and the `*_snapshot` contact/shipping fields —
never `customer_id`, the order UUID, `created_by`, COGS, `order_item_batches`, or
staff/internal notes.

This RPC is built (F11) but **not yet consumed by any page** — the S7 brief scoped the
success page to reading the just-created confirmation from `sessionStorage`
(§7 below), not a return-visit tracking page. A future `/don-hang/theo-doi` page (S9,
per CLAUDE.md's roadmap) is the intended consumer; `OrderSuccessView` already
constructs a `?token=` link for it (graceful future 404 until then, the same pattern
already used for every route built ahead of the page it links to since S4).

## 5. Security verification (real, black-box, against the live project)

Performed exactly like S3: real `curl` calls to the live PostgREST endpoint as `anon`,
using a real product temporarily given a test price and `is_web_visible = true`
(reverted after, alongside the two test orders/customers created — verified via
count/state queries, same pattern as every prior phase's live-data hygiene).

| Test | Result |
| --- | --- |
| Happy-path order creation (qty 2) | `201`-equivalent RPC success; `total = subtotal = 298000`, real `tracking_token` returned |
| Idempotent replay (same key) | Same `order_number`, same totals, `tracking_token: null` (not re-derivable — documented limitation, §9) |
| `QUANTITY_ADJUSTMENT_REQUIRED` (999 of 10 sellable) | `message: "QUANTITY_ADJUSTMENT_REQUIRED"`, `details: {"available":10, ...}` |
| `PRODUCT_NOT_FOUND` (random UUID) | `message: "PRODUCT_NOT_FOUND"` |
| `PRODUCT_UNAVAILABLE` (real but `is_web_visible = false`) | `message: "PRODUCT_UNAVAILABLE"` |
| `INVALID_CUSTOMER_DATA` (bad phone) | `message: "INVALID_CUSTOMER_DATA"`, `details: {"field":"customer_phone"}` |
| `INVALID_QUANTITY` (empty cart) | `message: "INVALID_QUANTITY"` |
| Missing idempotency key | `message: "INVALID_CUSTOMER_DATA"` |
| **Price-tampering attempt** (`p_items[0].unit_price: 1`) | Ignored — real `products.selling_price` (149000) charged regardless |
| `get_storefront_order_by_token` with the real token | Full safe confirmation returned |
| `get_storefront_order_by_token` with a bogus token | `null` — no existence leak |
| `anon` direct `SELECT` on `orders` | `401 permission denied for table orders` |
| `anon` direct `SELECT` on `customers` | `401` |
| `anon` direct `INSERT` on `orders` (`status: 'completed'`) | `401 permission denied for table orders` |
| `anon` direct `SELECT` on `product_batches` | `401` |

Every negative test 401s or is rejected at the database layer — `anon` cannot reach
`orders`/`order_items`/`customers`/`product_batches` except through the two new
`SECURITY DEFINER` functions, exactly as designed.

## 6. Checkout UI (`/thanh-toan`)

- `src/app/thanh-toan/page.tsx` — thin Server Component shell (same pattern as
  `/gio-hang`), `noindex`.
- `src/features/checkout/components/checkout-view.tsx` — the client orchestrator.
  Hydration-safe (`useHasHydrated`, same as `CartView`); an empty cart renders a calm
  `EmptyState`, not a crash or a silent redirect. Generates one idempotency key per
  mount (`crypto.randomUUID()`, `useRef`) and reuses it for every submit attempt on
  this page load, so a retry/double-click is the RPC's `UNIQUE` constraint's job, not
  the disabled button's.
- `/api/cart/revalidate` (`src/app/api/cart/revalidate/route.ts`) — called once on
  mount and again immediately before the real submit. Reuses the existing S3
  `get_storefront_product_by_slug` RPC to flag `price_changed` / `out_of_stock` /
  `not_found` lines before the customer commits. It **cannot** surface an exact
  "only N left" — S3's contract never exposes a quantity (S0 B4) — that only appears
  from an actual `QUANTITY_ADJUSTMENT_REQUIRED` at real checkout time, a narrower,
  transaction-scoped disclosure.
- `/api/checkout` (`src/app/api/checkout/route.ts`) — server Zod re-validates the
  request (mandatory layer, independent of whatever the client's RHF/Zod already did),
  then calls `create_storefront_order` with only `{product_id, quantity}` per line.
  Maps any RPC error via `error-map.ts`; never forwards `error.message`/`error.details`
  directly to the customer.
- `CheckoutForm` — React Hook Form + Zod (`checkoutFormSchema`,
  `react-hook-form-zod`): client validation is UX only, friendly Vietnamese messages,
  a `fieldset disabled={submitting}` pending-submit guard, and a server-field-error
  passthrough so `INVALID_CUSTOMER_DATA`'s `field` re-focuses the right input without
  wiping the form.
- `PaymentMethodField` — `PaymentRow` (S2.4 §10.6): border + radio + tint + check on
  selection, never colour alone; COD and bank transfer only.
- `CheckoutOrderReview` — a read-only, collapsed line list with a "Chỉnh sửa giỏ hàng"
  link back to `/gio-hang` rather than duplicating cart-editing UI.
- `CheckoutSummary` — the same S2.4 §10.4 totals terminology as `CartSummary`
  ("Tạm tính (hàng hoá)" / "Phí vận chuyển: Nhân viên sẽ xác nhận" / "Tổng tiền hàng"),
  sticky on desktop (`lg:sticky lg:top-24`) per §10.5's "form left, sticky order
  summary right".
- On a committed success, the confirmation is written to `sessionStorage` (a fixed
  key, never the URL), the cart is cleared, and the browser navigates to
  `/dat-hang-thanh-cong` — clearing happens **only** after the RPC returns success
  (`checkout-security` rule 8); a failed submission leaves the cart untouched.

### `/dat-hang-thanh-cong` (Order Success, S2.4 §10.7)

`OrderSuccessView` reads the confirmation via `useSyncExternalStore` (same pattern as
`useHasHydrated` — the server always renders the "nothing yet" snapshot, since
`sessionStorage` only exists in the browser). "ORDER RECEIVED" framing only — never
"paid"/"delivered"/"guaranteed to ship", no celebratory animation. Primary action is
"Sao chép liên kết theo dõi" (clipboard copy of a `?token=` URL); secondary is
"Tiếp tục mua sắm". A direct visit/refresh with nothing in `sessionStorage` renders an
honest "not found" state, not an error or a fabricated confirmation.

## 7. Egress / Supabase-request audit

- `/api/cart/revalidate` and `/api/checkout` are the **only** new Supabase-touching
  code in this phase; both are server-side (Route Handlers), never a direct
  browser → Supabase call.
- `/api/cart/revalidate` issues one `get_storefront_product_by_slug` call per distinct
  cart line (already true for the S3 RPC's own cost profile — no new query shape).
- `/api/checkout` issues exactly one `create_storefront_order` RPC call per submit
  attempt.
- No polling, no background job, no second state library. `CheckoutView`'s own
  mount-time revalidate is the only "extra" request beyond the two obviously-necessary
  ones (submit + success confirmation reuse of already-local data).

## 8. Known limitations (disclosed, not silently shipped)

- **S2.4 §10.5's "slim header"** (no commerce nav/cart/search) for checkout is **not**
  implemented — `/thanh-toan` renders inside the same global `SiteHeader`/`SiteFooter`
  every other route uses (the same simplification `/gio-hang` already made). A
  route-conditional header requires restructuring the global root layout, which is
  broader than this phase's scope; flagged here rather than silently deviating.
- **Idempotent replay cannot return the plaintext tracking token a second time** —
  only its hash is ever persisted (by design, CLAUDE.md §6), so a customer whose first
  successful response never reached their browser (a lost network response, not a
  failed order) has no way to recover the token from a retry. Their recovery path is
  contacting the store with their phone number/order number, matching O7 ("customer
  cancellation: contact the store" — the same "no self-service" posture, extended to
  this edge case).
- **`get_storefront_order_by_token()` has no consuming page yet** — built per F11, but
  the return-visit tracking page is S9's job per CLAUDE.md's roadmap. The success
  page's copied link points at it (graceful future 404 until then).
- **No live-browser screenshot of a populated cart's checkout form** — the same
  limitation disclosed in S6 (no Puppeteer/Playwright installed; a `localStorage`
  seeding trick is blocked by headless Chrome). Real screenshots were taken of the
  achievable states (`/thanh-toan` and `/dat-hang-thanh-cong` empty states, at 390px
  and 1440px) and match the existing site's visual baseline exactly (confirmed against
  a fresh `/gio-hang` screenshot for comparison — an identical, pre-existing
  right-edge capture artifact, not a regression). The populated-cart form/review/
  submit/error states are verified instead via 201 passing Vitest + RTL tests,
  including real `user-event` typing, clicking, and submitting.

## 9. Scope compliance

No payment gateway, no customer accounts, no admin UI change, no public image
infrastructure, no inventory-reservation subsystem, no second client state library, no
background job, no rate limiting (S12), no order-tracking page (S9). The storefront
still never calls `complete_order`, `cancel_order`, `adjust_inventory`, or any
admin/report RPC — a website order stays `draft`/`source='website'` until an admin
completes it manually, exactly as CLAUDE.md §6 and S0 O2 require.
