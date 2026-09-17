---
name: typescript
description: TypeScript discipline for the storefront — strict mode, no any / no unsafe casts, explicit types on data-access and RPC boundaries, DTO types separate from generated row types, discriminated unions for real state variants, integer VND typed clearly.
---

# TypeScript (storefront)

## Apply when
Writing or reviewing any `.ts` / `.tsx` file.

## Rules

1. **`strict: true` always.** No `any`, no `@ts-ignore` / `@ts-expect-error` without a
   one-line justification, no unsafe casts, no gratuitous non-null `!`. An unavoidable
   cast carries a comment explaining why it is safe.
2. **Explicit types on every boundary.** Server data functions, Route Handler
   input/output, RPC wrappers, and Zod-inferred form types all have named, explicit
   param and return types.
3. **The public DTO is its own type** in `src/types/storefront.ts` — not
   `Database['public']['Tables']['products']['Row']`. Generated row types (with
   internal columns) never cross into component props (`public-data-contract`).
4. **Discriminated unions for real variants** — cart-line revalidation status, checkout
   result, order status, async UI state — instead of a bag of optional booleans.
5. **Money is integer VND.** Type it as `number` with a clear name (`priceVnd`,
   `subtotalVnd`) or a branded type; never `float`-shaped, never formatted-string-typed
   in the data layer.
6. **Derive, don't duplicate.** Prefer `z.infer`, `Pick`, `Omit`, and generated types
   over hand-maintained parallel shapes.
7. **No `enum`s for domain status** — use string-literal unions matching real DB
   values; never invent a frontend-only status the schema doesn't have.
8. **`unknown` at untrusted inputs** (parsed JSON, params) then narrow with Zod — never
   assert a shape onto external data.

## Anti-patterns to reject in review

- `any` or `as SomeType` on a Supabase/RPC result to make it compile.
- Component props typed as a generated table row.
- Optional-boolean soup where a union models the states.
- A hand-written `Product` interface drifting from the generated types.
- A frontend-only order status string with no DB backing.
