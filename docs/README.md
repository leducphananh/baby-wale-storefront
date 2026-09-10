# Baby Wale Storefront — docs

| Document | Purpose |
| --- | --- |
| [`S0-requirements-and-architecture.md`](S0-requirements-and-architecture.md) | **The authoritative architecture contract.** Backend audit, business decisions (O1–O10), storefront architecture, public data contract & RLS plan, required backend changes (F1–F13), admin compatibility checklist, S1–S13 roadmap, open decisions. Phases implement against this — do not rewrite it. |
| [`../CLAUDE.md`](../CLAUDE.md) | Always-on engineering rules: priorities, trust model, data-access architecture, backend invariants, locked decisions, roadmap, design approval gate, phase & DB discipline. Summarizes S0 and records two **corrections** to it (see below). |
| [`../.claude/skills/`](../.claude/skills/) | Focused, topic-specific rules loaded per task (Next.js App Router / RSC / data access / caching, public data contract, Supabase, checkout, cart, SEO, images, performance, security, design system, Figma-to-code, visual consistency, accessibility, forms, error handling, testing, Vietnamese commerce, domain, TypeScript, clean code, code review). |
| [`design/S2.1-information-architecture-and-user-flows.md`](design/S2.1-information-architecture-and-user-flows.md) | **S2.1 output.** Storefront IA tree, page inventory, navigation decision (header + hamburger; search & cart in the header), discovery/cart/checkout/tracking flows, price- and stock-change recovery, edge/error-state inventory, per-flow accessibility requirements, conceptual component + behavioral-state inventory, owner decisions, and the S2.2 design brief. IA + flows only — no visual design. Includes the 2026-09-10 approved refinements (two-tier sticky model; success-page save/share action; tracking accepts a token or pasted URL; D1–D3 locked). |
| [`design/S2.2-visual-direction-and-moodboard.md`](design/S2.2-visual-direction-and-moodboard.md) | **S2.2 output.** Three visual directions (Soft Trust Commerce / Playful Modern Family / Premium Calm Baby), a comparison matrix, and a recommendation of **Soft Trust Commerce**; the visual doctrine; direction (not tokens) for color roles, typography, shape/elevation, photography, `ProductCard`, Product Detail, header/search, cart, checkout, success/tracking, trust system, icons/illustration, motion, mobile, accessibility; an anti-pattern list; a structured moodboard; and the S2.3 high-fidelity design brief. Direction only — **no final tokens, no Figma screens** (S2.4 owns tokens). |

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

**S2.2 — Visual Direction & Moodboard — complete.**
[`design/S2.2-visual-direction-and-moodboard.md`](design/S2.2-visual-direction-and-moodboard.md)
explores three visual directions and **recommends "Soft Trust Commerce"** (light warm
surfaces, blue as the trust anchor, pink as a small accent, photography-forward,
restrained shapes/shadows, one calm blue primary CTA, quiet factual trust cues). It sets
*direction* — color roles, typography (keep Be Vietnam Pro), shape/elevation,
photography, and per-screen guidance — plus an anti-pattern list, a structured moodboard,
and the S2.3 high-fidelity brief. **No final tokens, no Figma screens** (S2.4 owns
tokens). It also applied approved refinements back into the S2.1 doc (two-tier sticky
model; success-page save/share action; tracking accepts a token or pasted URL; D1–D3
locked, D4 open).

**Documentation only** — zero code, dependencies, or database changes; the S1 foundation
is untouched.

Earlier: **S2.1** defined the IA, navigation, and all customer flows;
**S1** delivered the Next.js 16 technical scaffold (see the storefront `README.md`).

**Next: S2.3 — High-Fidelity Figma Design** (not started). No storefront UI, final color
palette, typography scale, or component tokens until the S2.4 DESIGN APPROVED gate.

Zero database migrations to date; zero changes to the admin repo.
