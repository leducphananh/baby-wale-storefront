# Storefront Phase S3 — Public Catalog Data Contract

**Status: DONE.** First storefront phase to touch Supabase. This document does not
duplicate `docs/S0-requirements-and-architecture.md` ("S0") — S0 remains the
architecture/business source of truth; this records what was actually built,
audited, and verified for the public catalog contract.

**A numbering note:** S0's own roadmap (Part H) was written before the design
phases were expanded into S2.1–S2.5. S0's "S2 — Public catalog data contract" is
*this* phase (today's **S3**); S0's "S3 — Catalog browse" is today's **S4**; S0's
"S6 — Order backend contract" is today's **S7**. References below to "S0 F1–F4"
etc. use S0's own item numbers, not its stale phase numbers.

## 1. Purpose

Give the storefront a secure, minimal, explicit read contract for products and
categories — implemented so that `anon` (the storefront's only credential) can
never reach admin-internal data even if it bypasses the Next.js app entirely and
calls PostgREST directly. No catalog UI, no cart, no checkout, no order RPC.

## 2. Public threat model

Assumed: an attacker inspects network requests and the JS bundle, calls
PostgREST directly with the public anon key, tries wider `?select=`, tries
calling admin RPCs, tries listing/reading Storage objects, enumerates ids. Every
one of these was **tested for real** against the live project (§16), not assumed
safe because the Next.js app doesn't expose a button for it.

## 3. Current database sources (audited, not assumed)

Audited via: the admin repo's 36 tracked migrations (`baby-store-web/supabase/
migrations/`), its generated `src/types/database.ts`, `src/features/products/**`
and `src/features/purchase-invoices/**` (Storage access patterns), its
`CLAUDE.md`, and — critically — **the live database itself**
(`baby-store-management`, project `jtkmycvkthciiskwptqv`, the same project this
repo's `.env.local` already points at): `list_tables`, direct `information_schema`
/ `pg_catalog` queries for grants/RLS/defaults, `pg_get_functiondef` for
`complete_order()`'s real FEFO predicate, and real row counts. The live schema
matched the admin repo's tracked migrations and generated types exactly before
this phase's changes (36/36 migrations, identical grant state) — S0 §"the
database is the final authority" was followed literally, not just cited.

Real data at audit time: **179 products** (178 `active`), **27 categories**,
**163 product images**, only **3 product batches** (on a single product — most
of the catalog currently has zero recorded stock; a real, pre-existing data-
completeness gap, not something this phase caused or needed to fix).
`selling_price` is `0` on every sampled product — pricing hasn't been entered
yet for this catalog; the contract correctly surfaces whatever is there, it does
not fabricate a price.

## 4. Public objects

Three new `SECURITY DEFINER` functions, granted `EXECUTE` to `anon` +
`authenticated` only (never a table/view grant — see §6):

| Function | Purpose |
| --- | --- |
| `list_storefront_categories()` | Categories with ≥1 active + web-visible product, with that count. |
| `list_storefront_products(p_category_slug, p_limit, p_offset)` | Paginated (default 24, hard-capped 60), newest-first, active + web-visible products. Optional category filter. |
| `get_storefront_product_by_slug(p_slug)` | A single active + web-visible product. Zero rows for archived/hidden/unknown — never distinguishes the three to the caller. |

Plus one internal support function, `slugify(text)` (Vietnamese-safe kebab-case
slug generator — `unaccent` + lowercase + hyphenate), granted to `authenticated`
only (admin tooling, S9), **not anon** — the storefront only ever reads stored
slugs, it never generates one.

## 5. Public fields

| Object | Field | Public? | Reason |
| --- | --- | --- | --- |
| product | `product_id` | ✅ | Needed for a future cart line / RPC input (S6/S7). |
| product | `slug` | ✅ | URL (S0 F1). |
| product | `name` | ✅ | Core content. |
| product | `brand` | ✅ | Core content. |
| product | `description` | ✅ | Core content. |
| product | `unit` | ✅ | Core content (e.g. "400g/hộp"). |
| product | `origin_country` | ✅ | S0 E2 draft shape. |
| product | `manufacturer` | ✅ | S0 E2 draft shape. |
| product | `distributor` | ✅ | CLAUDE.md §6: "Supplier ≠ Distributor" — distributor may be public. |
| product | `category_id` / `category_slug` / `category_name` | ✅ | Navigation. |
| product | `selling_price` | ✅ | S0 B2 — the **only** price. |
| product | `in_stock` (boolean) | ✅ | S0 B4 — label only, never a quantity. |
| product | `updated_at` | ✅ | Cache/sitemap `lastModified` (S4+). |
| category | `category_id`, `slug`, `name`, `description`, `product_count` | ✅ | Navigation. |

## 6. Fields intentionally NOT exposed

`sku`, `barcode`, `default_purchase_price`, `tiktok_price`, `shopee_price`,
`minimum_stock`, `source_description`, `status` (raw), `created_at`/`created_by`
— never selected by any of the three functions. Nothing from `product_batches`
(`remaining_quantity`, `purchase_price`, `lot_number`, `expiration_date`,
`manufacture_date`, `import_item_id`), `suppliers`, `import_receipts`,
`import_receipt_items`, `purchase_invoices`, `purchase_invoice_files`,
`inventory_transactions`, `order_item_batches`, `orders`, `order_items`,
`order_payments`, `customers`, `profiles`, or any report RPC (COGS, gross
profit, revenue). Confirmed by reading every function body (§4) and by a live
negative test (§16) — not by "the function just doesn't happen to select it."

## 7. Product visibility semantics

**`products.is_web_visible boolean NOT NULL DEFAULT false`** (S0 O1, locked at
`CLAUDE.md` §9 — S0 Part B itself still said "needs stakeholder confirmation
before [this phase]," but `CLAUDE.md`'s locked-decisions table already recorded
it as approved before this phase started, so it was implemented directly, not
re-opened). A product is on the storefront only when `status = 'active' AND
is_web_visible`. All 178 active products defaulted to `is_web_visible = false`
on migration — **nothing publishes automatically.** No admin UI toggle exists
yet (planned S9); until then, visibility is set directly in SQL, which is how
this phase's own verification (§16) turned rows on and back off.

## 8. Availability semantics

`in_stock` is computed **inside** the `SECURITY DEFINER` function body using the
**exact same predicate** `complete_order()` uses for FEFO allocation — copied
verbatim from the live function definition (`pg_get_functiondef`), not
re-derived:

```sql
exists (
  select 1 from product_batches pb
  where pb.product_id = p.id
    and pb.remaining_quantity > 0
    and (pb.expiration_date is null or pb.expiration_date >= v_business_today)
)
-- v_business_today := (now() at time zone 'Asia/Ho_Chi_Minh')::date
```

This matches S0 B4's explicit warning: **`product_inventory_overview.
stock_quantity` was deliberately NOT reused** — it counts expired physical
stock, which would overstate availability. Verified against real data: the one
product with real batches (3 batches — 1 expired 2026-08-19, 2 valid through
2026-09/10-19) correctly returned `in_stock: true` counting only the 2 valid
batches; the three batch-less products correctly returned `in_stock: false`.
Only the boolean is returned — never `remaining_quantity`, batch ids, lot
numbers, or expiry dates (S0 B4: "status label only, no exact number").

## 9. Image exposure strategy

**Not built in this phase — deliberately.** Audited the current image
architecture: `product_images` (`storage_path`, `is_primary`, no "role"/"type"
column — there is no schema-level distinction between a shopper photo and any
other image type) backed by the **private** `product-images` Storage bucket,
read by admin exclusively via `createSignedUrls` (1h TTL) — confirmed by
reading `get-product-images.ts` / `get-products.ts`, never `getPublicUrl`.
Live-tested (§16): the bucket is unreachable via the public Storage path
(`404 Bucket not found`, not even an existence disclosure) and object listing
via the anon key returns an RLS-filtered empty result — no public read path
exists today, exactly matching S0 A5 / `CLAUDE.md` O3.

S0 C7/F13 plans the fix — a separate public bucket (`product-images-public`) +
an admin "publish" step — but schedules it at S0's "S6" (**today's S7**, Order
Backend Contract), not this phase. This phase's brief also explicitly
de-prioritizes images ("the existing approved missing-image visual foundation
from S2.5 is sufficient... do not fabricate product imagery"). **Flagged as an
open item (§19), not solved here**: building it no later than whichever phase
first renders a real photo (S4/S5, not S7) is the sane target — see §19.

## 10. Storage strategy

No Storage change in this phase. `product-images` and `purchase-invoices` stay
exactly as they are (private, signed-URL-only, admin-only) — verified live,
not just read from migration comments (§16).

## 11. RLS policies

**None added.** This phase deliberately does **not** follow S0 Part E's
original sketch (`security_invoker` views + new `anon` RLS policies directly on
`products`/`categories`/`product_batches`) — `CLAUDE.md` §5 explicitly corrects
that proposal ("Do not freeze that... No public base-table SELECT is
required"). Every existing RLS policy on every table is untouched. `anon`'s
table-level grants remain exactly what they were before this phase: **zero**,
on every table and view, verified live before and after (§16).

## 12. Grants

| Grantee | Object | Privilege |
| --- | --- | --- |
| `anon` | `list_storefront_categories()` | EXECUTE |
| `anon` | `list_storefront_products(text,int,int)` | EXECUTE |
| `anon` | `get_storefront_product_by_slug(text)` | EXECUTE |
| `anon` | *(everything else — every table, view, and other function)* | **none** |
| `authenticated` | the three functions above, plus `slugify(text)` | EXECUTE |

**A real platform-level finding, fixed in-phase (not left for later):** this
Supabase project has an `ALTER DEFAULT PRIVILEGES` rule (verified via
`pg_default_acl`, not assumed) that grants `EXECUTE` on **every newly created
function** in `public` directly to `anon`/`authenticated`/`service_role` —
independent of any `GRANT`/`REVOKE ... FROM PUBLIC` in the creating migration
(`REVOKE ... FROM PUBLIC` is a no-op against it; only `REVOKE ... FROM anon`
works). The three intended-public functions were unaffected (their `anon`
access was wanted anyway), but `slugify()` — meant for `authenticated` only —
silently picked up `anon` EXECUTE at creation. Caught by re-reading the raw
`pg_proc.proacl` after applying (not trusting `information_schema`'s summary
view), fixed with an explicit `REVOKE EXECUTE ... FROM anon` in a follow-up
migration, and re-verified. **Recommendation (not applied — a project-wide
default-privilege change is bigger than this phase should decide alone):**
either add `ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE
EXECUTE ON FUNCTIONS FROM anon` once, project-wide, or keep remembering the
explicit per-function `REVOKE ... FROM anon` in every future migration that
adds a function not meant for anon.

Default privileges for **tables** were also inspected and are the same shape
(`anon`/`authenticated` get full `arwdDxtm` on any *new* table by default) —
not exploited by this phase (no new table was created) but worth knowing before
any future phase adds one.

## 13. Supabase client usage

`src/lib/supabase/server.ts` (from S1) is now typed against the regenerated
`Database` (`createServerClient<Database>`), so every `.rpc(...)` call is
checked against the real function signatures at compile time. No new client
variant was added — no client-side/browser Supabase client exists (S0 C5: RSC
only for MVP). Every catalog data-access function is `import "server-only"`
(RSC-only, fails the build if ever imported from a Client Component).

## 14. Type generation

Regenerated independently in this repo (`src/types/database.ts`, S0 C11 — no
shared package with the admin repo) directly from the live project, **after**
this phase's migration, so it reflects the real post-migration schema
(`slug`, `is_web_visible`, and the four new functions all present). Not
hand-edited. The application-facing DTOs
(`src/features/catalog/types.ts` — `StorefrontProduct`, `StorefrontCategory`,
…) are hand-written to mirror the RPCs' actual `RETURNS TABLE` shape (the real
public contract), not derived from the base-table types — matching S0 C11:
"database contract → typed application contract," never "admin table →
`select('*')` → TypeScript hides fields."

## 15. Data-access functions

```
src/features/catalog/
  types.ts                          StorefrontProduct / StorefrontCategory / … DTOs
  server/
    list-categories.ts              listStorefrontCategories()
    list-products.ts                listStorefrontProducts({ categorySlug?, limit?, offset? })
    get-product-by-slug.ts          getStorefrontProductBySlug(slug)
```

Each: RSC-only, calls exactly one `.rpc(...)`, maps snake_case → camelCase,
throws a plain `Error` with the Supabase message on failure (no raw error
object leaked; S4+ decides the user-facing Vietnamese mapping, out of scope
here). No `select('*')` anywhere (verified, §17). No business logic
duplicated — availability math lives entirely in the database function, never
recomputed in TypeScript.

Deliberately **not** built (S4 scope, per the phase brief's explicit
boundary): search (`p_search`), additional sort orders, a demo/preview catalog
page. Adding `p_search` later is an additive, backward-compatible parameter
change to `list_storefront_products` (a new optional trailing parameter with a
default), not a breaking one.

## 16. Security negative tests

**Real, black-box, against the live PostgREST API with the real anon key**
(`.env.local`'s `NEXT_PUBLIC_SUPABASE_ANON_KEY`) — exactly what a browser or an
attacker bypassing the Next.js app would see. Not mocked, not assumed from
reading grants alone.

| # | Test | Result |
| --- | --- | --- |
| 1–3 | Positive: the three storefront RPCs, after temporarily flipping 4 real products `is_web_visible = true` (reverted after, §18) | Correct DTO shapes; zero purchase/cost/supplier/batch fields; `in_stock` correctly `true`/`false` against real batch data (§8) |
| 4–6 | Direct `SELECT` on `products` / `product_batches` / `categories` | `401 42501 permission denied` |
| 7 | Direct `SELECT` on `orders`, `customers`, `suppliers`, `purchase_invoices`, `order_payments`, `order_item_batches`, `inventory_transactions`, `import_receipts`, `profiles` | `401 42501 permission denied` on every one |
| 8 | Direct `SELECT` on `product_inventory_overview` (internal reporting view) | `401 42501 permission denied` |
| 9 | Call `complete_order`, `cancel_order`, `adjust_inventory`, `confirm_import_receipt`, `create_order`, `record_order_payment`, `update_order_draft` with **correctly-shaped** (fake-valued) params — a first pass with an empty `{}` body was discarded as inconclusive (PostgREST's signature-matching 404 doesn't prove a permission check ran) and redone properly | `401 42501 permission denied` on every one |
| 10 | Call `get_revenue_summary`, `get_profit_summary` (correctly-shaped), `get_inventory_value_summary` (no-arg) | `401 42501 permission denied` on every one |
| 11 | `get_storefront_product_by_slug` for a real, currently-hidden product | `200`, `[]` — no error, no data |
| 12 | `get_storefront_product_by_slug` for a slug that has never existed | `200`, `[]` — **identical** response to #11 (no existence-leak side channel) |
| 13 | `?select=*,purchase_price,sku` on an RPC call, attempting to widen the declared output columns | `400 42703 column does not exist` — the RPC's return columns can't be widened by the caller |
| 14 | List objects in the `product-images` bucket via the anon key | `200`, `[]` (RLS-filtered — Storage's own table-level-grant + RLS model, distinct from but consistent with "no public access") |
| 15 | Public-path Storage read on a real (private) object path | `400 Bucket not found` — the bucket isn't even acknowledged to exist via the public path |

## 17. Application data layer

- Supabase errors: wrapped in a plain `Error`, never returned raw to a caller.
- Types: `yarn typecheck` passes against the real regenerated `Database` type —
  every `.rpc()` call and its params/return shape is compiler-checked.
- `select('*')`: zero occurrences against any sensitive base table (grepped
  the whole `src/` tree — the only "sensitive" hits are inside the generated
  `database.ts` type file itself, which is data-shape metadata, never queried
  directly, and one doc-comment/test-assertion explicitly checking a field is
  *absent*).
- Zero `.from(...)` calls anywhere in `src/` — every read goes through `.rpc()`
  to one of the three whitelisted functions.

## 18. Admin compatibility

**One real regression found and fixed before it could ship** (not merely
"checked and assumed fine"): the admin's `create-product.ts` inserts a new
product without a `slug` (the column didn't exist when that code was written).
After making `slug NOT NULL` with no column default, every future "Add
product" from the admin UI would have failed a `NOT NULL` violation
immediately. Fixed with a `BEFORE INSERT` trigger (`set_slug_from_name()`,
fires on `products` and `categories`) that fills `slug` from `name` via the
same `slugify()` + numeric-suffix dedupe rule as the backfill — **only** when
the caller left it `NULL`; an explicit slug is never overridden. Verified with
a real (rolled-back, never committed) test insert reproducing the admin's
exact payload shape, and a second test proving the collision suffix
(`-2`) works against a genuinely pre-existing category name.

Otherwise confirmed unchanged: `anon`'s table grants (§11), every existing RLS
policy, every existing RPC body/grant, `product_inventory_overview` /
`customer_order_summary` / `reportable_orders`, the two Storage buckets. The
live migration history (`list_migrations`) matched the admin repo's tracked
36 files exactly before this phase; three new files were added after
(`20260912120000`, `20260912120500`, `20260912121000`) — **applied to the live
project and recorded in this repo's own `supabase/migrations/`, not yet copied
into `baby-store-web/supabase/migrations/`** (CLAUDE.md §14 — storefront Claude
does not write into the admin repo). **Admin Coordination follow-up:** copy
these three files into the admin repo's tracked migration history so it stays
a complete record of the live schema.

## 19. Known limitations / open items

- **Image delivery has no public path yet** (§9) — every product will render
  the S2.5 missing-image placeholder until the public bucket + publish step
  (S0 F13) exists. Recommend building it before S4/S5 render a real photo,
  not waiting for S0's originally-sketched "S6"/today's S7.
- **Default-privilege leak pattern** (§12) — fixed for `slugify()`, but the
  underlying project-wide default-privilege rule is unchanged; every future
  new function needs an explicit `REVOKE ... FROM anon` unless a project-wide
  fix is applied. Recommend that fix as its own reviewed change.
- **The S3 phase brief named a `480px` breakpoint carried over from the S2.5
  brief; not relevant here** (no UI in this phase) — noted only so it isn't
  silently re-introduced by a future phase without checking the S2.4 doc.
- **Migration file not yet mirrored into the admin repo** (§18) — a manual
  follow-up, not automated by this phase (cross-repo rule).
- **`selling_price` is 0 for essentially the whole catalog** — real,
  pre-existing data-entry gap, not a contract bug; S4/S5 will render "0 ₫"
  faithfully until prices are entered.
- **`O6` (best-sellers) remains undecided** — not built, not needed until S4.

## 20. Future S4/S5 dependencies

S4 (Catalog Browse) needs: search (`p_search`, additive param on
`list_storefront_products`), additional sort orders, possibly the `gin_trgm`
index (S0 F5) if `ILIKE` search is slow at real catalog size, and a real
catalog UI consuming `listStorefrontProducts`/`listStorefrontCategories`. S5
(Product Detail) needs `getStorefrontProductBySlug` (already built) plus
`generateMetadata`/JSON-LD (S0 C13) and the image bucket (§9/§19). Neither is
started here.
