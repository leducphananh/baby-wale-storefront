import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CatalogPage, { generateMetadata } from "./page";

const listStorefrontCategories = vi.fn();
const listStorefrontProducts = vi.fn();

vi.mock("@/features/catalog/server/list-categories", () => ({
  listStorefrontCategories: () => listStorefrontCategories(),
}));
vi.mock("@/features/catalog/server/list-products", () => ({
  listStorefrontProducts: (...args: unknown[]) => listStorefrontProducts(...args),
}));

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

describe("CatalogPage (/san-pham)", () => {
  it("renders the product grid, result count, and category chips using only the S3 public functions", async () => {
    listStorefrontCategories.mockResolvedValueOnce([CATEGORY]);
    listStorefrontProducts.mockResolvedValueOnce({ items: [PRODUCT, { ...PRODUCT, productId: "p-2", totalCount: 2 }], totalCount: 2 });

    const ui = await CatalogPage({ searchParams: Promise.resolve({}) });
    render(ui);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Tất cả sản phẩm");
    expect(screen.getByText("2 sản phẩm")).toBeInTheDocument();
    expect(screen.getAllByText("Bỉm size M").length).toBeGreaterThan(0);
    expect(listStorefrontProducts).toHaveBeenCalledWith(
      expect.objectContaining({ categorySlug: undefined, limit: 24, offset: 0 }),
    );
  });

  it("passes the category slug through to the data layer and marks it active in the chips", async () => {
    listStorefrontCategories.mockResolvedValueOnce([CATEGORY]);
    listStorefrontProducts.mockResolvedValueOnce({ items: [PRODUCT], totalCount: 1 });

    const ui = await CatalogPage({ searchParams: Promise.resolve({ "danh-muc": "bim" }) });
    render(ui);

    expect(listStorefrontProducts).toHaveBeenCalledWith(
      expect.objectContaining({ categorySlug: "bim" }),
    );
    expect(screen.getByRole("link", { name: "Bỉm" })).toHaveAttribute("aria-current", "page");
  });

  it("renders the deliberate empty state instead of a blank page for no results", async () => {
    listStorefrontCategories.mockResolvedValueOnce([]);
    listStorefrontProducts.mockResolvedValueOnce({ items: [], totalCount: 0 });

    const ui = await CatalogPage({ searchParams: Promise.resolve({}) });
    render(ui);

    expect(screen.getByText("Chưa có sản phẩm phù hợp")).toBeInTheDocument();
  });

  it("computes offset from the page search param", async () => {
    listStorefrontCategories.mockResolvedValueOnce([]);
    listStorefrontProducts.mockResolvedValueOnce({ items: [], totalCount: 0 });

    await CatalogPage({ searchParams: Promise.resolve({ trang: "3" }) });

    expect(listStorefrontProducts).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 24, offset: 48 }),
    );
  });

  it("points a category-filtered URL's canonical at the dedicated /danh-muc page and marks it noindex (no duplicate-content page in the index)", async () => {
    const metadata = await generateMetadata({ searchParams: Promise.resolve({ "danh-muc": "bim" }) });
    expect(metadata.alternates?.canonical).toBe("/danh-muc/bim");
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });

  it("the unfiltered listing canonicalizes to itself and stays indexable", async () => {
    const metadata = await generateMetadata({ searchParams: Promise.resolve({}) });
    expect(metadata.alternates?.canonical).toBe("/san-pham");
    expect(metadata.robots).toBeUndefined();
  });
});
