# CLAUDE.md — Baby Wale Storefront

Always-on project rules for the **new customer-facing Baby Wale storefront** (Next.js
App Router). Detailed, topic-specific rules live in `.claude/skills/*/SKILL.md`; Claude
Code loads a skill's full instructions when the task matches. This file is the short
version that must never be forgotten, even when no skill fires. Sections marked
**[always]** apply to every change, no exceptions.

The authoritative architecture contract is
[`docs/S0-requirements-and-architecture.md`](docs/S0-requirements-and-architecture.md)
(the "S0 document"). This file summarizes and, where noted, **corrects** it. Do not
rewrite the S0 document; reference it.

---

## 1. What this project is

A **public, customer-facing e-commerce website** for Baby Wale — a mother & baby
retailer (diapers, formula/milk, baby care). Guest browsing and guest checkout.

**It is NOT the admin app.** The admin (`baby-store-web`, React + Vite) is a separate
repo, a separate deploy, a trusted internal tool. The storefront shares only the
Supabase backend. Never assume storefront code may touch or modify the admin repo
(see §12, `storefront-architecture`).

- Framework: **Next.js latest stable, App Router only, React Server Components by
  default.** TypeScript strict.
- Backend: the existing shared Supabase project. The storefront is a **lower-trust
  client** than the admin and reaches data through a **narrow, explicit public
  contract** only.
- Deploy target: **Vercel** (MVP). Ubuntu home server is a future portable option, not
  now.
- Language: **Vietnamese** for all customer-facing text. Code stays English.

**This is a public revenue surface.** Its attack surface, its handling of customer
data, and the correctness of money and stock outrank visual polish. When rules
conflict, resolve per §3.

---

## 2. Current phase — S2.5 complete (Design System Implementation); next is S3 (NOT started)

- **S0** — Requirements & Architecture — done (`docs/S0-requirements-and-architecture.md`).
- **S0.5** — Claude Code foundation & storefront skills — done (`CLAUDE.md`, `.claude/skills/*`).
- **S1** — Next.js foundation — done. Root layout + placeholder home, `not-found` /
  `error` / `robots`, `/api/health`, Zod-validated env, request-scoped anon Supabase
  server client, Vitest + RTL. No business feature, no visual design, no design tokens.
- **S2.1** — Information Architecture & User Flows — done
  (`docs/design/S2.1-information-architecture-and-user-flows.md`): IA tree, page
  inventory, navigation decision, all customer flows, price/stock recovery, error-state
  inventory, accessibility, conceptual component + state inventory. Includes the
  2026-09-10 approved refinements (two-tier sticky model; success-page save/share
  action; tracking accepts a token or pasted URL; **D1–D3 locked**, D4 open).
- **S2.2** — Visual Direction & Moodboard — **done**
  (`docs/design/S2.2-visual-direction-and-moodboard.md`): three visual directions, a
  comparison matrix, and a recommendation of **"Soft Trust Commerce"**; visual doctrine;
  direction (not tokens) for color roles, typography (keep Be Vietnam Pro),
  shape/elevation, photography, and every screen; anti-pattern list; structured
  moodboard; S2.3 brief. **Documentation only — no code, no final tokens, no Figma
  screens.**
- **S2.3** (incl. the **S2.3R** review/correction pass) — High-Fidelity Design — **done**
  (`docs/design/S2.3-high-fidelity-figma-design.md` + a Claude Design canvas **v3**:
  `claude.ai/code/artifact/378cf72c-a832-4c2d-8e36-c6ac30c74640`): build-ready hi-fi
  spec — **exploratory** token proposal (candidate hex, Be Vietnam Pro ramp,
  spacing/radius/elevation, grid), ~30 components with states, per-screen layouts
  (mobile 390 / desktop 1440), 4-tier completeness matrix, S2.4 handoff. Figma itself
  was not usable (connected account is a Starter/View seat). **S2.3R** pixel-inspected
  all 9 canvas artboards (headless Chrome, pre-installed) and fixed: unsupported
  "chính hãng" hero claim (→ mock copy), cart-badge contrast (→ Trust Blue, ≥4.5:1
  rule), 2 clipped artboards, 1 stretched control; recorded the 360px result and that
  the 1:1 image frame is unvalidated (no real photos). **No production code, no
  dependencies, no DB, no final tokens. DESIGN APPROVED remains OPEN.**
- **S2.4** — Design System & Design Approval — **done. DESIGN APPROVED V1.**
  (`docs/design/S2.4-design-system-and-approval.md` — **the authoritative design
  source of truth**, overriding S2.1–S2.3R wording where they conflict, §18 of that
  doc): frozen colour tokens (with recalculated contrast — the pink cart-badge is
  permanently rejected as text/numeral background, ≥4.5:1 rule codified), frozen Be
  Vietnam Pro type ramp, frozen 4px-base spacing incl. a ≤374px compact-mobile
  adaptation (2 columns preserved, no 1-column fallback), frozen radius/elevation,
  frozen control sizing, frozen 2/3/4-column responsive grid + sticky model, frozen
  `ProductCard` / `Header` / Product Detail / Cart / Checkout / Success-Tracking design
  contracts, a frozen content-claim contract (removed the unapproved "Giao hàng toàn
  quốc" claim — including from the canvas itself, now **v4**; "chính hãng" and a
  return-window remain gated), the 1:1 product-image frame approved for V1 with a
  mandatory pre-S4 real-image validation checkpoint, an
  icon direction (Lucide + matched custom SVGs, not installed), a Tailwind v4/shadcn
  S2.5 implementation mapping, and a Design-Change Governance process. **No production
  code, no dependencies, no DB change.**
- **S2.5** — Design System Implementation — **done**
  (`docs/design/S2.5-design-system-implementation.md`): every S2.4 token implemented
  in `src/app/globals.css` (Tailwind v4 `@theme` for colour/radius/shadow/container;
  typography roles as `@layer components` classes; Tailwind's default spacing scale
  already matches S2.4's; a custom `compact` variant for the ≤374px tier), the S1
  scaffold dark-mode block removed (light-only), `lucide-react` installed, and a
  shadcn-style primitive set hand-built on Radix + CVA in `src/components/ui`
  (`Button`, `Input`, `Textarea`, `Label`, `FormField`, `RadioGroup`, `Badge`,
  `Skeleton`, `Separator`, `Dialog`, `Sheet`) plus layout/site primitives in
  `src/components/layout` and `src/components/site` (`Container`, `Stack`, `Grid`,
  `SectionHeading`, `EmptyState`, `ErrorState`, `Header`, `CartIndicator`). No
  `ProductCard`/`PaymentRow`/`CategoryTile` (commerce scope, S3+). **No Supabase
  calls, no migrations, no RPC, no S3+ route/business logic.**
- **Next: S3** — Public Catalog Data Contract. **Not started.** Do not begin S3+ work
  until asked.

**The DESIGN APPROVED gate is now CLOSED — the design is a visual contract.**
Implementation must not casually change: primary colour, accent use, type scale, radius
language, shadow language, container width, `ProductCard`, the header system, the
checkout visual model, mobile navigation, or primary-CTA hierarchy (S2.4 §19). A real
issue found during implementation is raised as a **Design Deviation Proposal** (S2.4
§19), not a silent code fix.

### Stack & commands (as of S1)

- Next.js **16.3.4** (App Router, Turbopack), React **19.2.8**, TypeScript **5** strict,
  Tailwind CSS **v4** (CSS-config), ESLint **9** (`eslint-config-next`).
- Package manager: **Yarn 1.22.22** (`yarn.lock`). Do not add a second lockfile.
- Node **>= 20.9** (developed on 22.17).
- Supabase: `@supabase/ssr` + `@supabase/supabase-js`, anon key only. `zod` for env
  and (later) validation. **No `service_role`, no TanStack Query, no Zustand, no
  RHF yet** — added in the phase that first needs them.
- Design system (added S2.5): `lucide-react`, `class-variance-authority`, `clsx`,
  `tailwind-merge`, `@radix-ui/react-{slot,dialog,radio-group,separator,label}`. No
  `shadcn` CLI/`components.json` — the `src/components/ui` primitives follow the same
  pattern (owned code, not an installed package) so the CLI can extend them later.
- Scripts: `yarn dev` · `yarn build` · `yarn start` · `yarn lint` · `yarn typecheck`
  (`tsc --noEmit`) · `yarn test` (`vitest run`) · `yarn test:watch`.
- Key paths: `src/app/` (routes, incl. the design tokens in `globals.css`),
  `src/lib/env.ts` (validated public env), `src/lib/supabase/server.ts` (server anon
  client), `src/lib/utils.ts` (`cn()`), `src/components/ui/` (themed primitives),
  `src/components/layout/` + `src/components/site/` (layout/header primitives),
  `src/test/` (test setup), `vitest.config.mts`. Env: `.env.example` (committed
  placeholders), `.env.local` (gitignored). Feature folders (`src/features/*`) appear
  when features are built.
- Run `yarn lint && yarn typecheck && yarn test && yarn build` at the end of every
  phase (§12).

---

## 3. Priority order [always]

When rules or goals conflict, prioritize in this order:

1. **Security** — no secrets exposed, no RLS bypass, no trust of browser input, no
   privileged key on the storefront.
2. **Business correctness** — money, stock, order status, and lifecycle match real
   store operations and the backend invariants in §6.
3. **Data integrity** — orders/inventory/payments never end in a partial or
   inconsistent state; one atomic transaction per business operation.
4. **Customer privacy** — never expose one customer's data to another; minimal PII;
   unguessable identifiers.
5. **Checkout correctness** — authoritative pricing, stock validation, idempotency,
   never charge a stale/tampered total.
6. **Public data minimization** — expose only the explicit storefront DTO; nothing
   internal (COGS, purchase price, batches, suppliers, staff, reports).
7. **SEO correctness** — server-rendered content, correct canonical/metadata/sitemap,
   private pages `noindex`.
8. **Accessibility** — a design constraint from day one, not cleanup.
9. **Mobile-first UX** — the ~390px experience of browse → cart → checkout is the
   primary target.
10. **Performance** — minimal client JS, RSC by default, no N+1, correct caching.
11. **Visual consistency** — one design system; feature pages extend it, never fork it.
12. **Maintainability** — focused files, right layer, no duplicated business rules.
13. **Development speed** — last, never at the expense of 1–6.

Never sacrifice security, money/stock correctness, or customer privacy to ship faster.
If the architecture cannot guarantee a critical property, **stop and report** rather
than shipping a fragile version.

---

## 4. Storefront trust model [always]

**The browser is untrusted.** Never trust a browser-submitted value for any of:

price · subtotal · total · discount · order status · payment status · purchase price ·
batch IDs · COGS · unit cost · stock quantity · shipping fee / shipping accounting
result.

The browser **may** submit: product ID · quantity · customer contact info · shipping
info · selected payment method · idempotency key · slug / search / filter params.

**All authoritative financial and inventory decisions happen server-side / in the
database** (`create_storefront_order()` and the public read RPCs — designed in S0,
built in S6). The Next.js server is **not** automatically trusted enough to hold a
`service_role` key — see §7.

See `checkout-security`, `frontend-storefront-security`, `public-data-contract`.

---

## 5. Data-access architecture [always]

```
Catalog (home, listing, product, category)
    RSC → server Supabase client (anon key) → purpose-built public read RPC → safe DTO

Cart
    client only — Zustand + persist/localStorage (display state, non-authoritative)

Checkout
    client → Next.js Route Handler → transactional Postgres RPC (create_storefront_order)

Order lookup
    RSC / Route Handler → safe lookup RPC (get_storefront_order_by_token), no-store
```

- **Direct browser → Supabase is not the default.** No client `supabase.from(...)`
  without an explicit, documented architecture reason.
- **CORRECTION to S0 Part E (public data boundary).** The S0 document proposed
  `security_invoker` views plus `anon` RLS/`SELECT` on base tables
  (`products`, `categories`, `product_batches`). **Do not freeze that.** The storefront
  standard is: **Next.js RSC → server anon client → purpose-built public read RPC
  (`SECURITY DEFINER`) → storefront-safe DTO.** No public base-table `SELECT` is
  required unless a much later phase proves a very strong reason and it passes security
  review.
  - **`product_batches` must never be directly queryable by anonymous users.** The
    storefront does not expose exact batch stock, expiration dates, purchase price, lot
    numbers, or any inventory internals. Availability is a **boolean/label** derived
    server-side (`Còn hàng` / `Hết hàng`).
  - Conceptual RPCs (built in S3/S6, **not** S0.5): `list_storefront_products(...)`,
    `get_storefront_product_by_slug(...)`, `list_storefront_categories(...)`,
    `create_storefront_order(...)`, `get_storefront_order_by_token(...)`. Each returns
    **only** the explicit storefront-safe contract.

See `nextjs-data-access`, `public-data-contract`, `supabase-storefront`,
`nextjs-cache-correctness`.

---

## 6. Backend invariants the storefront MUST preserve [always]

The storefront shares the admin's Supabase backend. It must **never weaken** admin
hardening (all admin policies are `TO authenticated`; `anon` currently has nothing).

- **Inventory source of truth is `product_batches.remaining_quantity`.** Never
  introduce `products.stock` or any second stock number. The storefront **never**
  mutates inventory.
- **The storefront never calls** `complete_order`, `cancel_order`, `adjust_inventory`,
  `confirm_import_receipt`, or any admin/report RPC. **Customer checkout must not
  complete an order.**
- **Only `completed` orders are revenue / reporting reality.** A website checkout
  creates an `orders` row with `status = 'draft'` and `source = 'website'` — it does
  **not** deduct stock, is **not** revenue, is **not** a completed order.
- **COGS stays server-authoritative.** Never expose `order_item_batches.unit_cost`,
  `product_batches.purchase_price`, or `products.default_purchase_price` to the
  storefront in any form.
- **Historical order data is never rewritten by the storefront.** `order_items`
  price/quantity are historical snapshots.
- **Money is integer VND.** Never floating point for any authoritative money math.
  Client formatting is presentation only.
- **Business timezone is `Asia/Ho_Chi_Minh`.** DB timestamps stay UTC; business
  date/expiry semantics must preserve Vietnam date behavior.
- **Supplier ≠ Distributor.** `distributor` may be public product metadata.
  `supplier` / all purchasing data is internal — never exposed.

Never expose storefront access to: `suppliers`, `import_receipts`,
`import_receipt_items`, `purchase_invoices`, `purchase_invoice_files`,
`inventory_transactions`, `order_item_batches`, internal reports, alert internals,
staff `profiles`, internal notes, purchase prices, COGS.

Never expose another customer's name, phone, address, email, or order details. Guest
order lookup uses an **unguessable token** (store only its hash), never a sequential
`order_number` alone.

---

## 7. Supabase / server security [always]

- Storefront Supabase access uses the **anon / publishable key only**, via a
  per-request server client (`@supabase/ssr`) in RSC and Route Handlers.
- Privileged work is done by **purpose-built `SECURITY DEFINER` RPCs** with a fixed
  `search_path`, explicit `GRANT`/`REVOKE`, server-side validation, and minimal return
  data.
- **`service_role` must not exist in normal storefront architecture** — not in the
  browser, not on the Next.js server. If a future feature genuinely needs privileged
  server access it must be explicitly justified, server-only, narrow, reviewed, and
  **never** exposed via `NEXT_PUBLIC_*`.
- Public env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public by
  design). Any future secret is unprefixed and server-only. Never reuse production
  credentials in tests/CI.

See `supabase-storefront`, `frontend-storefront-security`.

---

## 8. Shipping-fee semantics — NOT finalized [always]

The admin financial model computes `orders.total` from order line totals.
`shipping_fee` is **not** financially integrated today.

For MVP architecture:

- The storefront may display: **"Phí vận chuyển sẽ được nhân viên xác nhận"**.
- The checkout **product subtotal is the authoritative merchandise subtotal**; the
  displayed total is goods-only.
- Do **not** silently fold shipping into product prices. Do **not** treat
  `shipping_fee` as product revenue/profit.
- Do **not** change `complete_order` or any report to fold `shipping_fee` into `total`
  without a coordinated admin + backend review (S9/S10).
- Shipping accounting semantics are a **known deferred decision** — finalized during
  the admin coordination / backend phase.

---

## 9. Locked S0 business decisions [always]

Approved unless a future user instruction explicitly changes them.

| # | Decision |
| --- | --- |
| **O1** | Product web visibility uses `products.is_web_visible` (recommended eventual default `false`). A product may be active internally but not published. **Never auto-publish every active product.** |
| **O2** | Website order lifecycle reuses `orders.status = 'draft'` + `orders.source = 'website'`. No `pending_confirmation` status unless later required. Customer label: **"Đơn mới – chờ xác nhận"**. Draft web orders don't reduce inventory, aren't revenue, aren't completed. |
| **O3** | Admin private image bucket stays **private**. A separate public storefront delivery bucket is added later, coordinated with admin. Never make the admin bucket public. |
| **O4** | Shipping fee confirmed by staff (see §8). Not financially integrated yet. |
| **O5** | Deploy on **Vercel** for MVP. Ubuntu home server is a future portable option. |
| **O6** | Best sellers: **not MVP.** Defer unless explicitly requested (needs a public-safe aggregate, never the internal report RPCs). |
| **O7** | Customer cancellation: **contact the store.** No self-service cancellation in MVP. |
| **O8** | Bank account details: not required yet; user will provide later. |
| **O9** | Use a dedicated Supabase **staging** project before real web orders, if practical. |
| **O10** | Customer authentication / RBAC is **not MVP.** Before customer Supabase Auth is enabled, admin authorization must stop treating generic `authenticated` membership as staff authorization (move to a dedicated staff/`admin_members` table + RLS against it; `customers.auth_user_id` later). **`profiles.role` is self-editable and must never become authorization-bearing.** |

---

## 10. State & data libraries [always]

- **RSC handles initial server state.** TanStack Query is **not** a default storefront
  dependency. Add it only if a real client-side server-state use case appears (e.g.
  order-status polling). Never mirror RSC-fetched data into TanStack Query.
- **Zustand** is expected **primarily for the cart and cart-drawer / client UI state.**
  Do not store server records globally in Zustand.
- **Catalog state** (`search`, `category`, `sort`, `page`) lives primarily in **URL
  search params**, not Zustand — shareable, back-button-correct, SSR-friendly,
  crawlable.
- **RHF + Zod** for interactive forms (checkout, order lookup). Client validation = UX;
  server validation = mandatory; DB constraints = business authority.

---

## 11. Design roadmap [always]

```
S0    Requirements & Architecture              ✅
S0.5  Claude Code Foundation & Storefront Skills ✅
S1    Next.js Foundation                       ✅

S2    UX & Visual Design
  S2.1  Information Architecture & User Flows  ✅
  S2.2  Visual Direction & Moodboard            ✅
  S2.3  High-Fidelity Design                    ✅
  S2.3R Visual Review & Corrections             ✅
  S2.4  Design System & Design Approval         ✅  DESIGN APPROVED V1

════════════════  DESIGN APPROVED GATE — CLOSED  ════════════════

S2.5  Design System Implementation (Tailwind v4 + shadcn-style UI primitives) ✅

S3    Public Catalog Data Contract  ← next
S4    Catalog Browse / Homepage
S5    Product Detail
S6    Shopping Cart
S7    Storefront Order Backend Contract
S8    Checkout
S9    Order Success & Tracking
S10   Admin Coordination
S11   Online Payment
S12   Customer Account / RBAC
S13   SEO, Security, Testing & Production Hardening
```

No feature UI implementation beyond project foundation begins before the **S2 design
approval gate** where relevant.

### Design approval gate — CLOSED (frozen at S2.4)

The approved design (`docs/design/S2.4-design-system-and-approval.md`) is now a
**visual contract**. Implementation must not casually: change visual direction; invent
a different typography system; introduce unrelated colors; change global radius/shadow
language; redesign `ProductCard` independently; redesign checkout independently.
**Changes to approved visual foundations require a Design Deviation Proposal (S2.4
§19) and explicit user approval.**

Final visual tokens (colors, spacing, radii, type scale) are now **frozen in
`docs/design/S2.4-design-system-and-approval.md`** — that document is authoritative
over any earlier exploratory value in S2.1–S2.3R. Skills describe *how to follow* the
approved tokens; they do not restate the token table.

---

## 12. Phase discipline [always]

- **Inspect before changing.** Read this file, the relevant skills, the existing repo
  structure, the S0 document, and (once it exists) the DB schema/types/RLS for the area
  you touch — every time.
- **Implement only the current phase.** Do not auto-start the next phase. Do not add
  speculative features. Do not do broad refactors that the phase didn't ask for.
- **Report DB changes and new dependencies explicitly** in the completion report.
- **Run verification once the project exists** (`lint` / `typecheck` / `test` /
  `build`) at the end of every phase; never claim completion if your own changes break
  them.
- **Produce a completion report** at the end of each phase (phase, features, files
  created/modified/deleted, DB changes or "none", dependencies or "none", architecture
  decisions, verification output, known limitations, recommended next phase) — then
  **stop** and wait to be asked.

---

## 13. Database change discipline [always]

The storefront's phases may later trigger **shared backend** migrations (they affect
both apps). When they do:

- Migrations are **additive** unless a destructive change is explicitly approved.
- **Never** reset a live Supabase project. Never drop tables, rename important columns,
  change historical relationships, or cascade-delete business data.
- **Never silently weaken RLS.** Every widening of public/`anon` access requires an
  explicit security review and is reported in the phase's completion report.
- Migration files stay reproducible. Admin compatibility is always considered.
- **S0.5 applies ZERO migrations.**

---

## 14. Cross-repo rule [always]

Storefront and admin are **separate repos**. Storefront Claude must not assume it can
modify the admin. If a storefront phase requires an admin change, **document it as an
Admin Coordination task** (S10 is the primary Admin Coordination phase) — never
silently alter the other repo.

---

## 15. Brand assets [always]

Reuse existing Baby Wale brand assets when supplied. **Do not regenerate the logo**
unless explicitly requested. Do not fabricate brand assets.

---

## 16. Skills index

`.claude/skills/` — focused, non-overlapping, actionable rules. Read the matching skill
before writing code in its area.

**Architecture:** `storefront-architecture`, `nextjs-app-router`,
`nextjs-server-components`, `nextjs-data-access`, `nextjs-cache-correctness`.
**Backend / data contract:** `public-data-contract`, `supabase-storefront`.
**Checkout / cart:** `checkout-security`, `cart-state`.
**Domain:** `baby-wale-domain`.
**SEO / images / performance:** `nextjs-seo`, `next-image-storefront`,
`storefront-performance`.
**Design:** `storefront-ui-design`, `design-system`, `figma-to-code`,
`visual-consistency`, `ecommerce-ux`, `mobile-first-storefront`, `accessibility`.
**Forms / errors:** `react-hook-form-zod`, `storefront-error-handling`.
**Security:** `frontend-storefront-security`.
**Testing:** `testing-nextjs-storefront`.
**Quality:** `typescript`, `clean-code`, `code-review`.
**Vietnamese commerce:** `vietnamese-ecommerce-ui`.
