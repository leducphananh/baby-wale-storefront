import { describe, expect, it, vi } from "vitest";

const getStorefrontProductBySlug = vi.fn();
vi.mock("@/features/catalog/server/get-product-by-slug", () => ({
  getStorefrontProductBySlug: (...args: unknown[]) => getStorefrontProductBySlug(...args),
}));

const { POST } = await import("./route");

function postRequest(body: unknown) {
  return new Request("http://localhost/api/cart/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const line = {
  productId: "3f8c9b2e-8f2d-4c1a-9e2f-1a2b3c4d5e70",
  slug: "sua-bot-meiji",
  name: "Sữa bột Meiji",
  quantity: 2,
  cachedUnitPrice: 185000,
};

describe("POST /api/cart/revalidate", () => {
  it("reports ok:true when every line matches the live price and is in stock", async () => {
    getStorefrontProductBySlug.mockResolvedValueOnce({
      name: "Sữa bột Meiji",
      sellingPrice: 185000,
      inStock: true,
    });

    const res = await POST(postRequest({ items: [line] }));
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.items[0].status).toBe("ok");
  });

  it("flags price_changed when the live price differs from the cached one", async () => {
    getStorefrontProductBySlug.mockResolvedValueOnce({
      name: "Sữa bột Meiji",
      sellingPrice: 199000,
      inStock: true,
    });

    const res = await POST(postRequest({ items: [line] }));
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.items[0]).toMatchObject({ status: "price_changed", currentPrice: 199000 });
  });

  it("flags out_of_stock when the product is no longer sellable", async () => {
    getStorefrontProductBySlug.mockResolvedValueOnce({
      name: "Sữa bột Meiji",
      sellingPrice: 185000,
      inStock: false,
    });

    const res = await POST(postRequest({ items: [line] }));
    const body = await res.json();
    expect(body.items[0].status).toBe("out_of_stock");
  });

  it("flags not_found when the product can no longer be looked up (archived/deleted/unknown)", async () => {
    getStorefrontProductBySlug.mockResolvedValueOnce(null);

    const res = await POST(postRequest({ items: [line] }));
    const body = await res.json();
    expect(body.items[0]).toMatchObject({ status: "not_found", currentPrice: null });
  });

  it("400s on a malformed body instead of throwing", async () => {
    const res = await POST(postRequest({ items: "not-an-array" }));
    expect(res.status).toBe(400);
  });
});
