// Test-only stub for the `server-only` package.
//
// The real package unconditionally throws when resolved through plain
// Node/Vitest module resolution — it only becomes a no-op in a real Next.js
// build via webpack's `react-server` export condition, which Vitest doesn't
// apply. Every RSC-only module in this repo (`src/lib/supabase/server.ts`,
// `src/features/*/server/*.ts`) starts with `import "server-only"` so a
// stray Client Component import fails the real build loudly — this stub
// only relaxes that guard inside the test runner, aliased in
// `vitest.config.mts`. It changes nothing about production behavior.
export {};
