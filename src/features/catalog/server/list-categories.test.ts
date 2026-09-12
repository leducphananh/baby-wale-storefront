import { describe, expect, it, vi } from "vitest";

import { listStorefrontCategories } from "./list-categories";

/**
 * Unit/mock test — never contacts the real database (testing-nextjs-
 * storefront). Verifies the snake_case RPC row -> camelCase DTO mapping;
 * the RPC's own access control (anon can only reach these three functions)
 * was verified separately against the live project via real PostgREST
 * calls, documented in the S3 completion report, not re-asserted here.
 */
const rpc = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ rpc }),
}));

describe("listStorefrontCategories", () => {
  it("maps RPC rows to StorefrontCategory DTOs", async () => {
    rpc.mockResolvedValueOnce({
      data: [
        {
          category_id: "cat-1",
          slug: "bim",
          name: "Bỉm",
          description: null,
          product_count: 4,
        },
      ],
      error: null,
    });

    const result = await listStorefrontCategories();

    expect(rpc).toHaveBeenCalledWith("list_storefront_categories");
    expect(result).toEqual([
      { categoryId: "cat-1", slug: "bim", name: "Bỉm", description: null, productCount: 4 },
    ]);
  });

  it("returns an empty array when there are no web-visible categories yet", async () => {
    rpc.mockResolvedValueOnce({ data: [], error: null });
    expect(await listStorefrontCategories()).toEqual([]);
  });

  it("throws a readable error instead of leaking a raw Supabase error object", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { message: "connection reset" } });
    await expect(listStorefrontCategories()).rejects.toThrow(/connection reset/);
  });
});
