import type { NextConfig } from "next";

/**
 * Foundation config. The only non-default is a narrow allow-list for the future
 * Supabase PUBLIC storage host (storefront web images, delivered from a
 * dedicated public bucket in a later phase — O3 / next-image-storefront).
 *
 * - No wildcard hosts.
 * - The private admin image bucket is never referenced or made public.
 * - No image is fetched in S1.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

if (supabaseUrl) {
  try {
    const { hostname } = new URL(supabaseUrl);
    remotePatterns.push({
      protocol: "https",
      hostname,
      pathname: "/storage/v1/object/public/**",
    });
  } catch {
    // Malformed URL — src/lib/env.ts reports this with a readable message.
  }
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
};

export default nextConfig;
