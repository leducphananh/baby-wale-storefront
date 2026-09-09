# Baby Wale Storefront

The public, customer-facing e-commerce website for **Baby Wale**, a mother & baby
retailer (diapers, formula/milk, baby care). Guest browsing and guest checkout.

This is **not** the admin app. The admin (`baby-store-web`) is a separate repo and a
separate deploy; the two share only the Supabase backend. See
[`CLAUDE.md`](./CLAUDE.md) and [`docs/S0-requirements-and-architecture.md`](./docs/S0-requirements-and-architecture.md)
for the full architecture contract.

## Status

**S1 — Next.js foundation.** Technical scaffold only: layout, placeholder home,
`not-found` / `error` / `robots`, `/api/health`, validated env, an anon Supabase server
client, and a test foundation. **No catalog, cart, checkout, or order features yet, and
no final visual design** — UX and visual direction are designed in S2 (S2.1 → S2.4)
before any storefront UI is built.

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 — App Router only, React Server Components by default, Turbopack |
| Language | TypeScript 5 (`strict`) |
| UI | React 19, Tailwind CSS v4 (CSS-based config). shadcn/ui is **not** initialized yet — deferred to the phase that needs it, after design tokens exist (S2.4). |
| Font | Be Vietnam Pro via `next/font` (Latin + Vietnamese subsets) — technical foundation only, not a typography scale |
| Backend | Supabase (shared project) via `@supabase/ssr` + `@supabase/supabase-js`, **anon/publishable key only** |
| Validation | Zod (env now; request/form validation later) |
| Tests | Vitest + React Testing Library + jsdom |
| Package manager | Yarn 1 (`yarn.lock`) — do not add a second lockfile |
| Deploy | Vercel (MVP) |

## Prerequisites

- Node.js **>= 20.9** (developed on 22.17)
- Yarn **1.x** (`corepack enable` or a global install)

## Setup

```bash
yarn install
cp .env.example .env.local   # then fill in real values
yarn dev                     # http://localhost:3000
```

`.env.local` is gitignored. Nothing in S1 actually calls Supabase, so placeholder
values are enough until catalog work (S3).

## Environment variables

All storefront env vars are `NEXT_PUBLIC_*` — **public by design**, inlined into the
browser bundle. Never put a service-role key, database password, or any private secret
in a `NEXT_PUBLIC_*` variable. Validated at startup by `src/lib/env.ts`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Shared Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon/publishable key |
| `NEXT_PUBLIC_SITE_URL` | no (defaults to `http://localhost:3000`) | Public origin for `metadataBase`, canonical URLs, robots host |

## Scripts

| Command | Does |
| --- | --- |
| `yarn dev` | Dev server |
| `yarn build` | Production build |
| `yarn start` | Serve the production build |
| `yarn lint` | ESLint (`eslint-config-next`) |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn test` | `vitest run` (once, CI-safe) |
| `yarn test:watch` | Vitest watch mode |

Run `yarn lint && yarn typecheck && yarn test && yarn build` at the end of every phase.

## Architecture principles

Full detail in [`CLAUDE.md`](./CLAUDE.md) and [`.claude/skills/`](./.claude/skills/).
The essentials:

- **Server Components by default;** `"use client"` only at interactive leaves. No
  `"use client"` on a route or layout root.
- **Catalog data:** RSC → server anon Supabase client → purpose-built public read RPC →
  safe DTO. No direct browser → Supabase. No `anon` access to base tables;
  `product_batches` is never exposed.
- **Checkout** (later): client → Route Handler → one transactional Postgres RPC. The
  browser is untrusted — the server recomputes every price, total, and stock decision.
- **No `service_role` key** anywhere — not in the browser, not on the server.
- **No customer authentication** — guest only. No `AuthProvider`, no login pages. RBAC
  and customer accounts are S12.
- **No cart, checkout, catalog, or order code yet.** No TanStack Query (RSC is the
  server-state strategy). Zustand is introduced with the cart (S6).
- **Money is integer VND;** business timezone `Asia/Ho_Chi_Minh`.
- **Design gate:** after **S2.4** the approved design is a visual contract. Until then,
  no final colors, typography scale, radius/shadow language, or component visual design.

## Project layout

```
src/
  app/
    layout.tsx           # Server Component — <html lang="vi">, metadata, font
    page.tsx             # S1 placeholder home
    not-found.tsx        # accessible 404
    error.tsx            # client error backstop (no stack traces to users)
    robots.ts            # disallow api/cart/checkout/order/account routes
    globals.css          # neutral foundation styles — no brand tokens
    api/health/route.ts  # GET /api/health -> { "status": "ok" }
  lib/
    env.ts               # Zod-validated NEXT_PUBLIC_* env
    supabase/server.ts    # request-scoped anon client (server-only)
  test/
    setup.ts             # RTL + jest-dom
```

Feature folders (`src/features/*`) are created when features are built, not before.
