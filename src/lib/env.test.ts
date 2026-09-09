import { describe, expect, it } from "vitest";

import { parsePublicEnv } from "./env";

const validSource = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  NEXT_PUBLIC_SITE_URL: "https://babywale.example",
};

describe("parsePublicEnv", () => {
  it("accepts a well-formed environment", () => {
    expect(parsePublicEnv(validSource)).toEqual(validSource);
  });

  it("defaults NEXT_PUBLIC_SITE_URL to localhost when unset", () => {
    const parsed = parsePublicEnv({
      NEXT_PUBLIC_SUPABASE_URL: validSource.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: validSource.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
    expect(parsed.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });

  it("throws a readable error when the Supabase URL is missing", () => {
    expect(() =>
      parsePublicEnv({ NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key" }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it("throws when the Supabase URL is not a URL", () => {
    expect(() =>
      parsePublicEnv({ ...validSource, NEXT_PUBLIC_SUPABASE_URL: "not-a-url" }),
    ).toThrow(/Invalid storefront environment variables/);
  });

  it("throws when the anon key is empty", () => {
    expect(() =>
      parsePublicEnv({ ...validSource, NEXT_PUBLIC_SUPABASE_ANON_KEY: "" }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  });
});
