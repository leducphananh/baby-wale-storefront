---
name: public-data-contract
description: The explicit storefront-safe DTO boundary. What the public product/category contract MAY contain and what it must NEVER contain. Encodes the S0 correction — no anonymous direct base-table / product_batches access. Read before designing any public read RPC, view, or DTO.
---

# Public data contract

## Apply when
Designing or changing a public read RPC, a storefront DTO type, a catalog query, or
anything that decides which product/category fields reach the browser.

## Correction to S0 Part E (authoritative)

The S0 document proposed `security_invoker` views + `anon` RLS/`SELECT` on
`products` / `categories` / `product_batches`. **That is not the storefront standard.**

- The storefront exposes **purpose-built `SECURITY DEFINER` public read RPCs** that
  return an explicit DTO. Conceptually: `list_storefront_products(...)`,
  `get_storefront_product_by_slug(...)`, `list_storefront_categories(...)`.
- **No public base-table `SELECT` is granted** unless a much later phase proves a very
  strong reason and passes security review.
- **`product_batches` is NEVER directly queryable by anonymous users.** No exact batch
  stock, no expiration dates, no purchase price, no lot numbers, no inventory
  internals reach the storefront. (Designed in S0, RPCs built S3/S6 — not S0.5.)

## Public product DTO — MAY contain

`id` (needed for cart line + RPC input) · `slug` · `name` · `brand` · `description` ·
`selling_price` (the **only** price) · `unit` · `origin` / `origin_country` ·
`manufacturer` · `distributor` · `category` (`{ id, slug, name }`) · public image
URL(s) · `in_stock` boolean (and optionally a coarse label) · `updated_at` if needed
for SEO / cache.

## Public product DTO — MUST NOT contain

`default_purchase_price` · `tiktok_price` (unless explicitly made public later) ·
`shopee_price` (unless explicitly made public later) · `source_description` /
internal source notes · `sku` · `barcode` · `supplier` / any supplier field ·
`minimum_stock` · batch IDs · exact batch quantities · `remaining_quantity` numbers ·
batch `purchase_price` · `expiration_date` / `manufacture_date` · import / receipt /
invoice data · `inventory_transactions` · `order_item_batches` · COGS / `unit_cost` ·
`created_by` / staff data · internal notes.

## Rules

1. **Availability is a boolean/label, not a number.** `in_stock` = server-computed
   `sellable_quantity > 0`, where sellable stock excludes expired batches (predicate
   from `complete_order`'s FEFO rule). Show `Còn hàng` / `Hết hàng`. `Sắp hết hàng` is
   deferred and must not be derived from `minimum_stock`.
2. **One price only** — `products.selling_price`. `tiktok_price` / `shopee_price` are
   channel-internal.
3. **The DTO is defined as an explicit TypeScript type** (`src/types/storefront.ts`),
   not `Database['public']['Tables']['products']['Row']`. Adding a field to the DTO is
   a deliberate, reviewed change.
4. **Categories DTO**: `{ id, slug, name, description?, product_count? }` over
   categories with ≥1 web-visible product.
5. **Filter to web-visible rows**: `status = 'active' AND is_web_visible` (O1).
   Archived / non-visible products 404/410 on the storefront.
6. **Supplier ≠ Distributor.** `distributor` is public product metadata; `supplier` is
   internal purchasing data. Never map one to the other.
7. **Every new public field is challenged**: "could a competitor or a bad actor misuse
   this?" If it reveals cost, margin, sourcing, stock depth, or staff, it stays out.

## Anti-patterns to reject in review

- An `anon` `GRANT SELECT` on `products`, `categories`, or `product_batches`.
- A DTO that spreads a full generated row and then "picks" fields in the component.
- Returning `sellable_quantity: 3` to the browser instead of `in_stock: true`.
- Exposing `tiktok_price` / `shopee_price` / `minimum_stock` "because the admin has
  them".
- Deriving a "low stock" customer badge from `minimum_stock`.
