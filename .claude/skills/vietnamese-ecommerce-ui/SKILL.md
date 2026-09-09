---
name: vietnamese-ecommerce-ui
description: Customer-facing Vietnamese retail conventions — natural shopping language (not admin/technical terms), integer VND formatting, Vietnamese date format, Asia/Ho_Chi_Minh business timezone, and translating internal order/stock enums into customer meaning. Apply to any customer-facing text or formatted value.
---

# Vietnamese e-commerce UI

## Apply when
Writing any customer-facing label/message/button, or formatting money, dates, phone
numbers, or statuses on the storefront.

## Rules

1. **All customer-facing text is Vietnamese**, in natural retail voice — warm, clear,
   concise. Code (identifiers, comments) stays English. This is a shop, not an admin
   tool: "Thêm vào giỏ", "Tiến hành thanh toán", "Sản phẩm bạn có thể thích".
2. **No admin / technical terminology leaks to customers.** Never show raw enum values
   (`draft`, `completed`, `unpaid`, `website`), table/column names, RPC names, or error
   codes. Translate to customer meaning.
3. **Money: integer VND**, formatted with thousands separators via one shared
   `formatVnd()` (`125.000 ₫` — pick one symbol convention and keep it site-wide).
   Never a raw number, never a decimal, never float math on money. Client formatting is
   presentation only; authoritative totals come from the server/DB.
4. **Dates** display `dd/MM/yyyy` (e.g. `09/09/2026`) via one shared helper — never
   `toString()`, never `MM/dd/yyyy`, never ISO in a customer view. Relative phrasing
   ("hôm nay", "2 ngày trước") is fine alongside the exact date.
5. **Business timezone is `Asia/Ho_Chi_Minh`.** DB timestamps are UTC; render and
   reason about business dates in VN time so an order placed late evening shows the
   right local date.
6. **Phone**: Vietnamese mobile format, displayed grouped (`0912 345 678`); validated
   and stored canonical `0XXXXXXXXX` via the one shared normalization function
   (`react-hook-form-zod`).
7. **Order status → customer label:**
   - `draft` (website order) → **"Đơn mới – chờ xác nhận"**
   - `completed` → **"Đã xử lý / hoàn tất"**
   - `cancelled` → **"Đã huỷ"**
8. **Stock → customer label:** sellable > 0 → **"Còn hàng"**; sellable 0 → **"Hết
   hàng"**. No numbers, no "Sắp hết hàng" (deferred, and never from `minimum_stock`).
9. **Payment method → customer label:** `cod` → "Thanh toán khi nhận hàng (COD)";
   `bank_transfer` → "Chuyển khoản ngân hàng".
10. **Consistent terminology site-wide** — one Vietnamese term per concept (Sản phẩm,
    Danh mục, Giỏ hàng, Đơn hàng, Thanh toán, Giao hàng). Check existing screens before
    coining a new label.
11. **Sort Vietnamese text locale-aware** (`localeCompare(b, 'vi')`) where the client
    sorts names, so diacritics order correctly.

## Anti-patterns to reject in review

- "Trạng thái: draft" or "source: website" shown to a customer.
- `125000` or `125000.0` displayed as a price.
- A date rendered `2026-09-09` or `09/09/2026` in US order.
- An error code (`OUT_OF_STOCK`) shown instead of "Sản phẩm đã hết hàng."
- Two different words for "cart" or "order" across pages.
