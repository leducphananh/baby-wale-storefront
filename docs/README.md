# Baby Wale Storefront — docs

| Document | Purpose |
| --- | --- |
| [`S0-requirements-and-architecture.md`](S0-requirements-and-architecture.md) | **The authoritative architecture contract.** Backend audit, business decisions (O1–O10), storefront architecture, public data contract & RLS plan, required backend changes (F1–F13), admin compatibility checklist, S1–S13 roadmap, open decisions. Phases implement against this — do not rewrite it. |
| [`../CLAUDE.md`](../CLAUDE.md) | Always-on engineering rules: priorities, trust model, data-access architecture, backend invariants, locked decisions, roadmap, design approval gate, phase & DB discipline. Summarizes S0 and records two **corrections** to it (see below). |
| [`../.claude/skills/`](../.claude/skills/) | Focused, topic-specific rules loaded per task (Next.js App Router / RSC / data access / caching, public data contract, Supabase, checkout, cart, SEO, images, performance, security, design system, Figma-to-code, visual consistency, accessibility, forms, error handling, testing, Vietnamese commerce, domain, TypeScript, clean code, code review). |

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

**S0.5 — Claude Code Foundation & Storefront Skills.** No Next.js app, no
`package.json`, no dependencies, no database migrations yet. S1 scaffolds the Next.js
project.
