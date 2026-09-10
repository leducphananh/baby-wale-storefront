# Baby Wale Storefront — docs

| Document | Purpose |
| --- | --- |
| [`S0-requirements-and-architecture.md`](S0-requirements-and-architecture.md) | **The authoritative architecture contract.** Backend audit, business decisions (O1–O10), storefront architecture, public data contract & RLS plan, required backend changes (F1–F13), admin compatibility checklist, S1–S13 roadmap, open decisions. Phases implement against this — do not rewrite it. |
| [`../CLAUDE.md`](../CLAUDE.md) | Always-on engineering rules: priorities, trust model, data-access architecture, backend invariants, locked decisions, roadmap, design approval gate, phase & DB discipline. Summarizes S0 and records two **corrections** to it (see below). |
| [`../.claude/skills/`](../.claude/skills/) | Focused, topic-specific rules loaded per task (Next.js App Router / RSC / data access / caching, public data contract, Supabase, checkout, cart, SEO, images, performance, security, design system, Figma-to-code, visual consistency, accessibility, forms, error handling, testing, Vietnamese commerce, domain, TypeScript, clean code, code review). |
| [`design/S2.1-information-architecture-and-user-flows.md`](design/S2.1-information-architecture-and-user-flows.md) | **S2.1 output.** Storefront IA tree, page inventory, navigation decision (header + hamburger; search & cart in the header), discovery/cart/checkout/tracking flows, price- and stock-change recovery, edge/error-state inventory, per-flow accessibility requirements, conceptual component + behavioral-state inventory, owner decisions, and the S2.2 design brief. IA + flows only — no visual design. Includes the 2026-09-10 approved refinements (two-tier sticky model; success-page save/share action; tracking accepts a token or pasted URL; D1–D3 locked). |
| [`design/S2.2-visual-direction-and-moodboard.md`](design/S2.2-visual-direction-and-moodboard.md) | **S2.2 output.** Three visual directions (Soft Trust Commerce / Playful Modern Family / Premium Calm Baby), a comparison matrix, and a recommendation of **Soft Trust Commerce**; the visual doctrine; direction (not tokens) for color roles, typography, shape/elevation, photography, `ProductCard`, Product Detail, header/search, cart, checkout, success/tracking, trust system, icons/illustration, motion, mobile, accessibility; an anti-pattern list; a structured moodboard; and the S2.3 high-fidelity design brief. Direction only — **no final tokens, no Figma screens** (S2.4 owns tokens). |
| [`design/S2.3-high-fidelity-figma-design.md`](design/S2.3-high-fidelity-figma-design.md) | **S2.3 output.** A build-ready high-fidelity design spec for Soft Trust Commerce: an **exploratory token proposal** (candidate hex, Be Vietnam Pro type ramp, spacing/radius/elevation, container/grid — all "PROPOSED, S2.4 to approve"), full **component anatomy + states** (~30 components), **per-screen layouts** (mobile 390 / desktop 1440) with measurements + text wireframes, responsive rules, accessibility decisions, a completeness matrix, a content-placeholder register, and the S2.4 handoff (14 verification questions). Figma was **not usable** this phase — the connected Figma account is a Starter/**View** seat (20 calls/month, no edit) — so the visual deliverable is a **Claude Design canvas**: [Baby Wale Storefront — Hi-Fi](https://claude.ai/code/artifact/378cf72c-a832-4c2d-8e36-c6ac30c74640) (north-star mobile + desktop Product Detail, Home, Catalog, Cart price-changed, Checkout, Success COD, a component/state sheet, a token board). **No production code, no dependencies, no DB, no final tokens.** |

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

**S2.3 — High-Fidelity Design — complete.**
[`design/S2.3-high-fidelity-figma-design.md`](design/S2.3-high-fidelity-figma-design.md)
turns the approved **Soft Trust Commerce** direction into a build-ready high-fidelity
spec: an **exploratory token proposal** (candidate hex, Be Vietnam Pro type ramp,
spacing / radius / elevation, container / grid — all "PROPOSED, S2.4 to approve"), full
component anatomy + states, per-screen layouts (mobile 390 / desktop 1440) with
measurements, responsive + accessibility decisions, a completeness matrix, a
content-placeholder register, and the S2.4 handoff. **Figma was not usable** (the
connected account is a Starter / **View** seat — 20 MCP calls/month, no edit), so the
visual deliverable is a **Claude Design canvas**:
[Baby Wale Storefront — Hi-Fi](https://claude.ai/code/artifact/378cf72c-a832-4c2d-8e36-c6ac30c74640)
— the north-star mobile + desktop Product Detail, Home, Catalog, Cart (price-changed),
Checkout, Success (COD), a component / state sheet, and a token board.

**Documentation + design canvas only** — zero production code, dependencies, or database
changes; **no final tokens** (S2.4 freezes them); the S1 foundation is untouched.

Earlier: **S2.2** recommended Soft Trust Commerce; **S2.1** defined the IA, navigation,
and all customer flows; **S1** delivered the Next.js 16 technical scaffold.

**Next: S2.4 — Design System & Design Approval** (not started). S2.4 audits the token
proposal, verifies contrast with the real brand colours, **freezes** the design system,
and produces the **DESIGN APPROVED** artifact. No storefront UI is built before that gate.

Zero database migrations to date; zero changes to the admin repo.
