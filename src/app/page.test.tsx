import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HomePage from "./page";

const listStorefrontCategories = vi.fn();
const listStorefrontProducts = vi.fn();

vi.mock("@/features/catalog/server/list-categories", () => ({
  listStorefrontCategories: () => listStorefrontCategories(),
}));
vi.mock("@/features/catalog/server/list-products", () => ({
  listStorefrontProducts: () => listStorefrontProducts(),
}));

const CATEGORY = {
  categoryId: "cat-1",
  slug: "bim",
  name: "Bỉm",
  description: null,
  productCount: 4,
};

const PRODUCT = {
  productId: "p-1",
  slug: "san-pham-moi",
  name: "Sữa bột Meiji số 1",
  brand: null,
  description: null,
  unit: "Hộp",
  originCountry: null,
  manufacturer: null,
  distributor: null,
  categoryId: "cat-1",
  categorySlug: "bim",
  categoryName: "Bỉm",
  sellingPrice: 185000,
  inStock: true,
  updatedAt: "2026-09-02T00:00:00Z",
};

describe("HomePage", () => {
  it("renders the hero heading, categories, and new products with a working CTA", async () => {
    listStorefrontCategories.mockResolvedValueOnce([CATEGORY]);
    listStorefrontProducts.mockResolvedValueOnce({ items: [PRODUCT], totalCount: 1 });

    render(await HomePage());

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Baby Wale");
    expect(screen.getByRole("link", { name: "Mua sắm ngay" })).toHaveAttribute("href", "/san-pham");
    expect(screen.getByText("Bỉm")).toBeInTheDocument();
    expect(screen.getByText("Sữa bột Meiji số 1")).toBeInTheDocument();
  });

  it("omits the categories and new-products sections when there is no data yet (no fabricated content)", async () => {
    listStorefrontCategories.mockResolvedValueOnce([]);
    listStorefrontProducts.mockResolvedValueOnce({ items: [], totalCount: 0 });

    render(await HomePage());

    expect(screen.queryByText("Danh mục sản phẩm")).not.toBeInTheDocument();
    expect(screen.queryByText("Sản phẩm mới")).not.toBeInTheDocument();
  });

  it("shows only the approved factual trust copy — never a fabricated shipping/guarantee claim", async () => {
    listStorefrontCategories.mockResolvedValueOnce([]);
    listStorefrontProducts.mockResolvedValueOnce({ items: [], totalCount: 0 });

    render(await HomePage());

    expect(screen.getByText("Thanh toán khi nhận hàng (COD) hoặc chuyển khoản")).toBeInTheDocument();
    expect(screen.queryByText(/miễn phí vận chuyển/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/giao hàng toàn quốc/i)).not.toBeInTheDocument();
  });
});
