import { describe, expect, it, vi } from "vitest";

import { getStorefrontProductBySlug } from "./get-product-by-slug";

const rpc = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ rpc }),
}));

describe("getStorefrontProductBySlug", () => {
  it("maps the single row to a StorefrontProduct DTO", async () => {
    rpc.mockResolvedValueOnce({
      data: [
        {
          product_id: "p-1",
          slug: "similac-total-protection-0-400g",
          name: "Similac Total Protection 0+ 400g",
          brand: null,
          description: null,
          unit: "400g/hộp",
          origin_country: null,
          manufacturer: null,
          distributor: "Anh Quân",
          category_id: "cat-1",
          category_slug: "sua-bot",
          category_name: "Sữa bột",
          selling_price: 185000,
          in_stock: true,
          updated_at: "2026-09-02T09:55:34.441+00:00",
        },
      ],
      error: null,
    });

    const result = await getStorefrontProductBySlug("similac-total-protection-0-400g");

    expect(rpc).toHaveBeenCalledWith("get_storefront_product_by_slug", {
      p_slug: "similac-total-protection-0-400g",
    });
    expect(result).toMatchObject({ productId: "p-1", inStock: true, sellingPrice: 185000 });
  });

  it("returns null for a hidden/archived/unknown slug (RPC returns zero rows for all three)", async () => {
    rpc.mockResolvedValueOnce({ data: [], error: null });
    expect(await getStorefrontProductBySlug("khong-ton-tai")).toBeNull();
  });

  it("throws a readable error instead of leaking a raw Supabase error object", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { message: "connection reset" } });
    await expect(getStorefrontProductBySlug("x")).rejects.toThrow(/connection reset/);
  });
});
