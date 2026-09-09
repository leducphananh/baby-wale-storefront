---
name: testing-nextjs-storefront
description: Future testing principles for the storefront — unit (helpers/validation/formatting), component (ProductCard, cart, checkout forms), integration (public catalog RPCs, create_storefront_order, idempotency, stock, price recompute), E2E (browse→cart→checkout→success), security (public cannot read private data), concurrency (scarce stock, duplicate checkout). Tests never hit production Supabase. Tooling is added in S1/S13, not now.
---

# Testing (Next.js storefront)

## Apply when
Planning test coverage for a phase, or adding tests once the runner exists. **Do not
install testing tools in S0.5.** The runner + RTL foundation is set up in S1; deeper
layers (integration/E2E/security/concurrency) in later phases per the roadmap.

## Principles

### Unit
Pure helpers and logic: `formatVnd`, date/timezone formatting, phone normalization
(table-driven — every prefix form + invalid cases), Zod schemas, DTO mappers, sort/
filter param parsing.

### Component
`ProductCard`, `Price`, `StockBadge`, quantity stepper, cart line / cart drawer,
checkout form, order-lookup form. Assert via accessible role / label / text, not class
names or `data-testid`. Mock at the data-function / Route-Handler boundary.

### Integration
The public catalog RPCs (return only the safe DTO), `create_storefront_order`
(empty cart, bad/hidden product, price recompute, phone normalization, snapshot
population), idempotency replay returns the original order, out-of-stock rejection,
`get_storefront_order_by_token`. Run against a **disposable / local** database.

### E2E
The critical flow: browse → product detail → add to cart → cart → checkout → success,
on a mobile viewport.

### Security
Negative tests: an anonymous caller **cannot** read `orders`, `customers`,
`product_batches` columns, cost fields, suppliers, or any internal data — directly or
through a view/RPC. The public contract exposes exactly what it should and nothing
more.

### Concurrency
Scarce stock (two checkouts for the last unit — documented no-reservation behavior),
duplicate/racing checkout with the same idempotency key produces one order.

## Rules

1. **No unit or component test contacts live Supabase**, mutates a remote row, uploads
   to Storage, or creates a real auth user. Mock at the feature data-access boundary or
   with a small local fake of the exact call chain — never a generic "fake Supabase".
2. **Tests never use production credentials.** Deterministic, obviously-fake env values.
3. **Deterministic** — no `Math.random()`, no real wall-clock as identity, no broad
   snapshot tests. Time/timezone tests set the clock locally and restore it.
4. **Integration/E2E use a disposable database**, never production or the shared
   project.
5. **Test behavior, not implementation** — accessible queries, observable outcomes.
6. **Add/adjust tests alongside the change** once the runner exists; a phase isn't done
   with failing tests caused by its own changes.

## Anti-patterns to reject in review

- A component test that lets the real Supabase client load and call out.
- Integration tests pointed at the shared/production Supabase project.
- Randomized fixtures or `Date.now()` used as an id.
- A generic chainable fake Supabase client maintained as a second client.
- Installing Vitest/Playwright during S0.5.
