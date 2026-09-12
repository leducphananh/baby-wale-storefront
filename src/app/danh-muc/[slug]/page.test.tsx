import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// `vi.mock` calls are hoisted above imports by Vitest, so the static import
// of `./page` below already resolves against these mocks.
const listStorefrontCategories = vi.fn();
const listStorefrontProducts = vi.fn();
const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("@/features/catalog/server/list-categories", () => ({
  listStorefrontCategories: () => listStorefrontCategories(),
}));
vi.mock("@/features/catalog/server/list-products", () => ({
  listStorefrontProducts: (...args: unknown[]) => listStorefrontProducts(...args),
}));
vi.mock("next/navigation", () => ({
  notFound: () => notFound(),
}));

import CategoryPage from "./page";

const CATEGORY = { categoryId: "cat-1", slug: "bim", name: "Bỉm", description: null, productCount: 1 };
const PRODUCT = {
  productId: "p-1",
  slug: "bim-size-m",
  name: "Bỉm size M",
  brand: null,
  description: null,
  unit: "Gói",
  originCountry: null,
  manufacturer: null,
  distributor: null,
  categoryId: "cat-1",
  categorySlug: "bim",
  categoryName: "Bỉm",
  sellingPrice: 250000,
  inStock: true,
  updatedAt: "2026-09-02T00:00:00Z",
};

describe("CategoryPage (/danh-muc/[slug])", () => {
  it("renders the category name as the page heading and its products", async () => {
    listStorefrontCategories.mockResolvedValueOnce([CATEGORY]);
    listStorefrontProducts.mockResolvedValueOnce({ items: [PRODUCT], totalCount: 1 });

    const ui = await CategoryPage({
      params: Promise.resolve({ slug: "bim" }),
      searchParams: Promise.resolve({}),
    });
    render(ui);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Bỉm");
    expect(screen.getByText("Bỉm size M")).toBeInTheDocument();
  });

  it("renders a category-specific empty state when the category currently has no matching products", async () => {
    listStorefrontCategories.mockResolvedValueOnce([CATEGORY]);
    listStorefrontProducts.mockResolvedValueOnce({ items: [], totalCount: 0 });

    const ui = await CategoryPage({
      params: Promise.resolve({ slug: "bim" }),
      searchParams: Promise.resolve({}),
    });
    render(ui);

    expect(screen.getByText("Danh mục này hiện chưa có sản phẩm")).toBeInTheDocument();
  });

  it("calls notFound() for an unknown slug — never crashes, never a raw error", async () => {
    listStorefrontCategories.mockResolvedValueOnce([CATEGORY]);

    await expect(
      CategoryPage({
        params: Promise.resolve({ slug: "khong-ton-tai" }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalledOnce();
    expect(listStorefrontProducts).not.toHaveBeenCalled();
  });
});
