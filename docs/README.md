# Baby Wale Storefront — docs

| Document | Purpose |
| --- | --- |
| [`S0-requirements-and-architecture.md`](S0-requirements-and-architecture.md) | **The authoritative architecture contract.** Backend audit, business decisions (O1–O10), storefront architecture, public data contract & RLS plan, required backend changes (F1–F13), admin compatibility checklist, S1–S13 roadmap, open decisions. Phases implement against this — do not rewrite it. |
| [`../CLAUDE.md`](../CLAUDE.md) | Always-on engineering rules: priorities, trust model, data-access architecture, backend invariants, locked decisions, roadmap, design approval gate, phase & DB discipline. Summarizes S0 and records two **corrections** to it (see below). |
| [`../.claude/skills/`](../.claude/skills/) | Focused, topic-specific rules loaded per task (Next.js App Router / RSC / data access / caching, public data contract, Supabase, checkout, cart, SEO, images, performance, security, design system, Figma-to-code, visual consistency, accessibility, forms, error handling, testing, Vietnamese commerce, domain, TypeScript, clean code, code review). |
| [`design/S2.1-information-architecture-and-user-flows.md`](design/S2.1-information-architecture-and-user-flows.md) | **S2.1 output.** Storefront IA tree, page inventory, navigation decision (header + hamburger; search & cart in the header), discovery/cart/checkout/tracking flows, price- and stock-change recovery, edge/error-state inventory, per-flow accessibility requirements, conceptual component + behavioral-state inventory, owner decisions, and the S2.2 design brief. IA + flows only — no visual design. |

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

**S2.1 — Information Architecture & User Flows — complete.** The customer experience is
now defined ahead of visual design:
[`design/S2.1-information-architecture-and-user-flows.md`](design/S2.1-information-architecture-and-user-flows.md)
— IA tree, page inventory, navigation (header + hamburger; search & cart promoted into
the header), discovery/cart/checkout/success/tracking flows, price- and stock-change
recovery, a full edge/error-state inventory, per-flow accessibility requirements, a
conceptual component + behavioral-state inventory, four owner decisions, and the S2.2
design brief. **Documentation only** — zero code, dependencies, or database changes; the
S1 foundation is untouched.

Earlier: **S1 — Next.js Foundation** delivered the technical scaffold (Next.js 16 App
Router + React 19 + TS strict + Tailwind v4, Yarn 1; root layout, placeholder home,
`not-found` / `error` / `robots`, `/api/health`, validated env, an anon Supabase server
client, Vitest + RTL). See the storefront `README.md` for setup and scripts.

**Next: S2.2 — Visual Direction & Moodboard** (not started). No storefront UI, color
palette, typography scale, or component visual design until the S2.4 DESIGN APPROVED
gate.

Zero database migrations to date; zero changes to the admin repo.
