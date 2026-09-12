import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Test-only config, kept separate from `next.config.ts` so the Next build is
 * untouched. Only the JSX transform and the `@/` alias are shared.
 *
 * `test.env` supplies deterministic, obviously-fake NEXT_PUBLIC_* values so a
 * stray import of `@/lib/env` (which validates at module load) doesn't fail on
 * load. No test contacts a real Supabase project (testing-nextjs-storefront).
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      // See src/test/stubs/server-only.ts — the real package unconditionally
      // throws under plain Node/Vitest resolution (it only no-ops via
      // webpack's `react-server` export condition in a real Next build).
      "server-only": path.resolve(import.meta.dirname, "./src/test/stubs/server-only.ts"),
    },
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    clearMocks: true,
    restoreMocks: true,
    css: false,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "https://stub.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "stub-anon-key-not-a-real-credential",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    },
  },
});
