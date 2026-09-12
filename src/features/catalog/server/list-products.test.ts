import { describe, expect, it, vi } from "vitest";

import { listStorefrontProducts } from "./list-products";

const rpc = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ rpc }),
}));

const ROW = {
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
  total_count: 1,
};

describe("listStorefrontProducts", () => {
  it("maps rows to DTOs and applies the default page size", async () => {
    rpc.mockResolvedValueOnce({ data: [ROW], error: null });

    const result = await listStorefrontProducts();

    expect(rpc).toHaveBeenCalledWith("list_storefront_products", {
      p_category_slug: undefined,
      p_limit: 24,
      p_offset: 0,
    });
    expect(result.totalCount).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      productId: "p-1",
      slug: "similac-total-protection-0-400g",
      sellingPrice: 185000,
      inStock: true,
      distributor: "Anh Quân",
    });
    // Never a purchase-price/cost/supplier/batch field on the mapped DTO.
    expect(result.items[0]).not.toHaveProperty("purchasePrice");
    expect(result.items[0]).not.toHaveProperty("supplier");
  });

  it("passes through an explicit category filter and pagination", async () => {
    rpc.mockResolvedValueOnce({ data: [], error: null });

    await listStorefrontProducts({ categorySlug: "sua-bot", limit: 12, offset: 24 });

    expect(rpc).toHaveBeenCalledWith("list_storefront_products", {
      p_category_slug: "sua-bot",
      p_limit: 12,
      p_offset: 24,
    });
  });

  it("reports zero total when the page is empty", async () => {
    rpc.mockResolvedValueOnce({ data: [], error: null });
    const result = await listStorefrontProducts();
    expect(result).toEqual({ items: [], totalCount: 0 });
  });

  it("throws a readable error instead of leaking a raw Supabase error object", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { message: "timeout" } });
    await expect(listStorefrontProducts()).rejects.toThrow(/timeout/);
  });
});
