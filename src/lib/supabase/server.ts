import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Request-scoped Supabase client for Server Components and Route Handlers.
 *
 * - anon / publishable key only — never the service-role key (CLAUDE.md §7,
 *   supabase-storefront).
 * - Wired to the Next cookie store so a customer session works later (S12)
 *   with no rewrite. There is no customer auth today.
 * - `import "server-only"` makes this module fail the build if a Client
 *   Component ever imports it.
 * - Typed against the generated `Database` (S0 C11 — regenerated
 *   independently in this repo, see `src/types/database.ts`) so every
 *   `.rpc(...)` call is checked against the real public catalog contract
 *   (S3) — `anon` can only reach `list_storefront_categories`,
 *   `list_storefront_products`, `get_storefront_product_by_slug`; every
 *   other function 401s at the database, not just "isn't called from here".
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component render — cookies are read-only
            // there. Safe to ignore once session refresh runs in middleware
            // (added with customer auth in S12).
          }
        },
      },
    },
  );
}
