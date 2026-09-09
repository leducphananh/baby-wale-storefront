import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

/**
 * Request-scoped Supabase client for Server Components and Route Handlers.
 *
 * - anon / publishable key only — never the service-role key (CLAUDE.md §7,
 *   supabase-storefront).
 * - Wired to the Next cookie store so a customer session works later (S12)
 *   with no rewrite. There is no customer auth today.
 * - `import "server-only"` makes this module fail the build if a Client
 *   Component ever imports it.
 *
 * S1 creates the client but issues no query — the storefront public read RPCs
 * do not exist yet (built S3+). See nextjs-data-access, public-data-contract.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
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
