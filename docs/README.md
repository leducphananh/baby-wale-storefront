# Baby Wale Storefront — docs

| Document | Purpose |
| --- | --- |
| [`S0-requirements-and-architecture.md`](S0-requirements-and-architecture.md) | **The authoritative architecture contract.** Backend audit, business decisions (O1–O10), storefront architecture, public data contract & RLS plan, required backend changes (F1–F13), admin compatibility checklist, S1–S13 roadmap, open decisions. Phases implement against this — do not rewrite it. |
| [`../CLAUDE.md`](../CLAUDE.md) | Always-on engineering rules: priorities, trust model, data-access architecture, backend invariants, locked decisions, roadmap, design approval gate, phase & DB discipline. Summarizes S0 and records two **corrections** to it (see below). |
| [`../.claude/skills/`](../.claude/skills/) | Focused, topic-specific rules loaded per task (Next.js App Router / RSC / data access / caching, public data contract, Supabase, checkout, cart, SEO, images, performance, security, design system, Figma-to-code, visual consistency, accessibility, forms, error handling, testing, Vietnamese commerce, domain, TypeScript, clean code, code review). |
| [`design/S2.1-information-architecture-and-user-flows.md`](design/S2.1-information-architecture-and-user-flows.md) | **S2.1 output.** Storefront IA tree, page inventory, navigation decision (header + hamburger; search & cart in the header), discovery/cart/checkout/tracking flows, price- and stock-change recovery, edge/error-state inventory, per-flow accessibility requirements, conceptual component + behavioral-state inventory, owner decisions, and the S2.2 design brief. IA + flows only — no visual design. Includes the 2026-09-10 approved refinements (two-tier sticky model; success-page save/share action; tracking accepts a token or pasted URL; D1–D3 locked). |
| [`design/S2.2-visual-direction-and-moodboard.md`](design/S2.2-visual-direction-and-moodboard.md) | **S2.2 output.** Three visual directions (Soft Trust Commerce / Playful Modern Family / Premium Calm Baby), a comparison matrix, and a recommendation of **Soft Trust Commerce**; the visual doctrine; direction (not tokens) for color roles, typography, shape/elevation, photography, `ProductCard`, Product Detail, header/search, cart, checkout, success/tracking, trust system, icons/illustration, motion, mobile, accessibility; an anti-pattern list; a structured moodboard; and the S2.3 high-fidelity design brief. Direction only — **no final tokens, no Figma screens** (S2.4 owns tokens). |
| [`design/S2.3-high-fidelity-figma-design.md`](design/S2.3-high-fidelity-figma-design.md) | **S2.3 output + S2.3R corrections (§13–§14).** A build-ready high-fidelity design spec for Soft Trust Commerce: an **exploratory token proposal** (candidate hex, Be Vietnam Pro type ramp, spacing/radius/elevation, container/grid — all "PROPOSED, S2.4 to approve"), full **component anatomy + states** (~30 components), **per-screen layouts** (mobile 390 / desktop 1440), responsive + accessibility decisions, a 4-tier screen-completeness matrix, a content-placeholder register, and the S2.4 handoff. Figma was **not usable** (connected account is a Starter/**View** seat), so the visual deliverable is a **Claude Design canvas (v3)**: [Baby Wale Storefront — Hi-Fi](https://claude.ai/code/artifact/378cf72c-a832-4c2d-8e36-c6ac30c74640). **S2.3R** rendered all 9 artboards with headless Chrome and fixed: the unsupported "chính hãng" hero claim (→ neutral mock copy), the cart-badge contrast (→ Trust Blue, ≥4.5:1 rule), two clipped artboards, and a stretched quantity stepper; it also recorded the 360px stress result and the owner-review questions (R1–R7). Its **exploratory** token values are now superseded by S2.4 (below). **No production code, no dependencies, no DB.** |
| [`design/S2.4-design-system-and-approval.md`](design/S2.4-design-system-and-approval.md) | **DESIGN APPROVED — BABY WALE STOREFRONT V1.** The authoritative design source of truth: **frozen** colour tokens (with recalculated contrast — the pink cart-badge is permanently rejected, ≥4.5:1 codified for any text/numeral badge), the frozen Be Vietnam Pro type ramp, frozen spacing/grid (incl. a ≤374px compact-mobile rule that keeps 2 columns), frozen radius/elevation/control-sizing, frozen responsive + sticky-model rules, frozen design contracts for `ProductCard` / `Header` / Product Detail / Cart / Checkout / Success-Tracking / status labels, a frozen content-claim contract (the unapproved "Giao hàng toàn quốc" claim is removed; "chính hãng" and a return-window stay gated), the 1:1 product-image frame approved for V1 with a mandatory pre-S4 real-image validation checkpoint, an icon-strategy decision (Lucide + matched custom SVGs, not installed), a Tailwind v4/shadcn S2.5 mapping, a source-of-truth hierarchy, and a Design-Change Governance process. **Overrides S2.1–S2.3R wherever they conflict. No production code, no dependencies, no DB.** |
| [`design/S2.5-design-system-implementation.md`](design/S2.5-design-system-implementation.md) | **S2.5 output.** A short implementation reference (not a token source — S2.4 stays authoritative): where every S2.4 token lives in `src/app/globals.css` (Tailwind v4 `@theme` + typography as `@layer components` classes + a custom `compact` ≤374px variant), the shadcn-style primitive set in `src/components/ui` / `layout` / `site` (Radix + CVA, hand-built rather than CLI-installed), and what remains prohibited. Notes one open flag: the S2.5 brief named a `480px` breakpoint the S2.4 doc does not define — not added, reported rather than invented. **First production code and dependencies of the project** (`lucide-react`, Radix primitives, CVA, `clsx`/`tailwind-merge`) — no Supabase, no DB, no S3+ business logic. |
| [`storefront/S3-public-catalog-data-contract.md`](storefront/S3-public-catalog-data-contract.md) | **S3 output.** The storefront's first Supabase-touching phase: an additive migration on the **shared** project (`products.slug`/`categories.slug` + backfill, `products.is_web_visible` per locked O1, an admin-compat auto-slug trigger) and three new `SECURITY DEFINER` functions (`list_storefront_categories`, `list_storefront_products`, `get_storefront_product_by_slug`) implementing CLAUDE.md §5's RPC-only correction to S0 Part E — zero `anon` grant on any base table/view, ever. `in_stock` is a boolean using `complete_order()`'s own FEFO-safe predicate. Verified with real black-box PostgREST negative tests against the live database (not mocked). Documents two real issues found and fixed in-phase (a Supabase default-privilege grant leak; an admin-compatibility break) and an explicit Admin Coordination follow-up (mirroring the migration into the admin repo's tracked history). Typed data-access layer in `src/features/catalog/`. No catalog UI, no cart, no checkout, no order RPC. |

## Corrections to S0 recorded in CLAUDE.md and the skills

1. **Public data boundary (overrides S0 Part E).** The storefront standard is
   `RSC → server anon Supabase client → purpose-built SECURITY DEFINER public read RPC
   → safe DTO`. No `anon` `SELECT`/RLS on `products` / `categories` / `product_batches`
   base tables by default. **`product_batches` is never directly queryable by
   anonymous users.** See `public-data-contract`, `supabase-storefront`,
   `nextjs-data-access`.
2. **Shipping-fee semantics are not finalized.** `orders.total` is line-item derived in
   the admin financial model; `shipping_fee` is not financially integrated. MVP shows
   "Phí vận chuyển sẽ được nhân viên xác nhận"; subtotal is the authoritative
   merchandise total; no change to `complete_order` / reports without a coordinated
   admin + backend review. See CLAUDE.md §8.

## Current phase

**S3 complete — Public Catalog Data Contract.**
[`storefront/S3-public-catalog-data-contract.md`](storefront/S3-public-catalog-data-contract.md)
is the storefront's first phase to touch Supabase: an additive migration on the
**shared** project (`products.slug`/`categories.slug` + Vietnamese-safe backfill,
`products.is_web_visible boolean DEFAULT false` per the locked O1 decision, an
admin-compatibility auto-slug trigger) plus three new `anon`-executable
`SECURITY DEFINER` functions implementing CLAUDE.md §5's correction to S0 Part E —
`anon` gets **zero** grant on any base table or view, ever, verified with real
black-box PostgREST calls against the live database (positive + 15 negative
security tests). `in_stock` is a boolean computed with `complete_order()`'s own
FEFO-safe predicate — never an exact quantity. Two real issues were found and
fixed in-phase (a Supabase default-privilege grant that leaked `EXECUTE` on a
helper function to `anon`; an admin `create-product` NOT NULL regression). A typed
data-access layer landed in `src/features/catalog/`. No catalog UI, no cart, no
checkout, no order RPC. **Next: S4 — Catalog Browse / Homepage.**

Earlier: **S2.5 complete — Design System Implementation.**
[`design/S2.5-design-system-implementation.md`](design/S2.5-design-system-implementation.md)
implemented every frozen S2.4 token in `src/app/globals.css` and Tailwind v4, removed
the S1 scaffold's dark-mode block (light-only), and added a themed, shadcn-style
primitive set (`Button`, `Input`, `Textarea`, `Label`, `FormField`, `RadioGroup`,
`Badge`, `Skeleton`, `Separator`, `Dialog`, `Sheet`, `Container`, `Stack`, `Grid`,
`SectionHeading`, `EmptyState`, `ErrorState`, `Header`, `CartIndicator`) built on
Radix + `class-variance-authority`, plus `lucide-react` for icons.

Earlier still: **DESIGN APPROVED — Baby Wale Storefront V1 (S2.4 complete).**
[`design/S2.4-design-system-and-approval.md`](design/S2.4-design-system-and-approval.md)
freezes the design system: final colour tokens (with recalculated contrast; the pink
cart-badge is permanently rejected, ≥4.5:1 required for any text/numeral badge), the
final Be Vietnam Pro type ramp, final spacing/grid (incl. a ≤374px compact-mobile rule
that keeps 2 columns), final radius/elevation/control-sizing, final responsive and
sticky-model rules, final design contracts for `ProductCard` / `Header` / Product
Detail / Cart / Checkout / Success-Tracking / customer status labels, a final
content-claim contract (the unapproved **"Giao hàng toàn quốc"** claim is removed —
**"chính hãng" and a return window stay gated** pending owner approval), the **1:1**
product-image frame approved for V1 (with a mandatory real-image validation checkpoint
before S4), an icon-strategy decision (**Lucide** + matched custom SVGs — not
installed), a **Tailwind v4 / shadcn S2.5 implementation mapping**, the
**source-of-truth hierarchy** (S2.4 → S2.3/S2.3R → the canvas → S2.2 → S2.1), and a
**Design-Change Governance** process (a "Design Deviation Proposal" is required before
any global visual rule changes again).

**This document is now authoritative** over every earlier exploratory value in
S2.1–S2.3R. **The DESIGN APPROVED gate is CLOSED** — implementation may compose the
frozen system but must not casually change primary colour, type scale, radius/shadow
language, container, `ProductCard`, the header system, the checkout model, mobile
navigation, or CTA hierarchy.

Earlier still: **S2.3 + S2.3R** produced the high-fidelity spec and a pixel-inspected
Claude Design canvas ([Baby Wale Storefront — Hi-Fi](https://claude.ai/code/artifact/378cf72c-a832-4c2d-8e36-c6ac30c74640) —
republished as **v4** at S2.4 to remove the unapproved "Giao hàng toàn quốc" line);
**S2.2** recommended Soft Trust Commerce; **S2.1** defined the IA, navigation, and all
customer flows; **S1** delivered the Next.js 16 technical scaffold.

Three additive database migrations to date (S3, `supabase/migrations/`), applied to
the shared Supabase project — see `storefront/S3-public-catalog-data-contract.md`.
Zero changes to the admin repo's files (the migration is not yet mirrored into
`baby-store-web/supabase/migrations/` — an open Admin Coordination follow-up).
