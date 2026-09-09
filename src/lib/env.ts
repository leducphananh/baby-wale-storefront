import { z } from "zod";

/**
 * Runtime-validated storefront environment.
 *
 * Every variable here is a `NEXT_PUBLIC_*` value — public by design and shipped
 * to the browser (the Supabase project URL + anon/publishable key, the site
 * origin). A service-role key, database password, or any private secret is
 * never read here and never exposed to the client (CLAUDE.md §7,
 * frontend-storefront-security).
 *
 * `parsePublicEnv` is a pure function so it is unit-testable without touching
 * the real process environment. `env` is the eager, validated singleton used by
 * the app; an invalid or missing value fails fast at module load with a
 * readable message.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function parsePublicEnv(
  source: Partial<Record<keyof PublicEnv, string | undefined>>,
): PublicEnv {
  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: source.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: source.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: source.NEXT_PUBLIC_SITE_URL,
  });

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid storefront environment variables:\n${details}\n` +
        "Copy .env.example to .env.local and provide the values.",
    );
  }

  return result.data;
}

// Explicit per-key references so Next.js can inline the values into the client
// bundle when one of these is read from a Client Component in a later phase.
export const env = parsePublicEnv({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
