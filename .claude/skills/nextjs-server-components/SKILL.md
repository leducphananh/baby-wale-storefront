---
name: nextjs-server-components
description: RSC-by-default discipline and the server/client boundary — where "use client" is allowed, server-only module protection, keeping client bundles small, no server data duplicated into client state. Read before adding "use client" or a client library.
---

# Next.js Server Components & the server/client boundary

## Apply when
Adding `"use client"`, importing a client library, deciding whether a component needs
to be interactive, or wiring data from a Server Component into a Client Component.

## Rules

1. **Server Component by default.** Add `"use client"` only when the component
   genuinely needs one of: React state, effects, event handlers, browser APIs,
   `localStorage`, or an interactive client-only library.
2. **`"use client"` at interactive leaves only.** Never make an entire page or layout a
   Client Component because one child needs interaction. Push the boundary down: a
   server page renders a server product view and mounts a small
   `<AddToCartButton>` / `<QuantityStepper>` / `<CartDrawer>` client island.
3. **Async Server Components fetch initial data** for catalog, product, and category
   pages — directly `await` the server data function. No client-side fetch-on-mount for
   first render, no loading spinner for data the server already has.
4. **Server-only modules must never be importable by a Client Component.** The server
   Supabase client, anything reading env secrets, and server data functions live under
   a `server/` folder and/or start with `import "server-only"`. A `"use client"` file
   importing one is a build-time error to fix, not to work around.
5. **Do not duplicate server-fetched data into TanStack Query or a client store.** Pass
   it as props / rendered markup. Client state is for genuinely client-owned data
   (cart, UI toggles). See CLAUDE.md §10, `cart-state`.
6. **Keep client bundles small.** Prefer server rendering of static markup; lazy-load
   heavy client-only widgets (`next/dynamic`, `ssr: false` only where required);
   don't ship a date/i18n/carousel library to the client when a server render or CSS
   handles it.
7. **No `localStorage` / `window` / `document` access in a Server Component** or in
   module top-level code that runs on the server. Guard client-only reads behind a
   mounted/hydrated flag (see `cart-state`).
8. **Serializable props only** across the server→client boundary — no functions, class
   instances, or Supabase client objects passed into a Client Component.

## Anti-patterns to reject in review

- `"use client"` on a route file so a single button can have an `onClick`.
- A Client Component importing `src/lib/supabase/server.ts`.
- `useEffect(() => { fetch(...) }, [])` in a page to load data the RSC could `await`.
- Catalog data fetched by the server and then re-fetched / cached again by TanStack
  Query on the client.
- A 200 KB carousel/animation library shipped to render a hero the server could output
  as static HTML.
