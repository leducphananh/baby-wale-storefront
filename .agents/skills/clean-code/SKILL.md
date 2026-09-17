---
name: clean-code
description: Baseline code-quality discipline for the storefront — small focused files, right layer, meaningful names, no dead or commented-out code, one home per business rule, justified abstractions, comments explain why. Apply continuously.
---

# Clean code (storefront)

## Apply when
Writing or editing any file in this repo — a continuous baseline, not a checklist.

## Rules

1. **Small, focused files.** One component, one hook, one data function, one schema
   group per file. UI + fetching + business rules in one file is a signal to split
   along the layers in `storefront-architecture`.
2. **Right layer.** RSC data functions in `server/`, client interactivity in
   `components/` leaves, schemas in `schemas/`, DTO/domain types in `types/`, pure
   formatting in `lib/format/`. Don't put a Supabase call in a component or business
   math in a Route Handler.
3. **Meaningful names.** `getStorefrontProductBySlug(slug)`, not `getData(s)`. Booleans
   read as yes/no (`isInStock`, `hasPriceChanged`). `qty` is fine in this domain;
   invented abbreviations are not.
4. **No dead code, no commented-out code.** Delete it; git history keeps it. A real
   comment explains a decision, not a fossil snippet.
5. **One home per business rule.** "How we format VND", "how sellable stock is
   labelled", "how a cart line maps to an RPC item" — each lives in exactly one place
   and is imported. Duplicated rules drift.
6. **Justify abstractions.** Build the generic/configurable version only when two real
   call sites need the variation. A shared `<Price>` used everywhere is earned; a
   speculative `<GenericProductThing>` is not.
7. **Comments explain *why*** — a business reason ("VN timezone so the order date is
   the local date") or a documented workaround — not *what* the code already says.
8. **Prefer editing a related existing file** over creating a new one for a small
   addition, within the size/layer rules.
9. **Formatting via the project tooling** (ESLint/Prettier once configured) — don't
   hand-format against it.

## Anti-patterns to reject in review

- A 400-line `utils.ts` grab-bag of unrelated helpers.
- Two functions computing "is this product in stock" with different rules.
- A heavily-configurable component built for one current use.
- Commented-out old implementations left "just in case".
- A `supabase` call sitting directly inside a `.tsx` component.
