import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductGrid } from "./product-grid";
import type { StorefrontProduct } from "@/features/catalog/types";

const PRODUCT: StorefrontProduct = {
  productId: "p-1",
  slug: "san-pham-1",
  name: "Sản phẩm 1",
  brand: null,
  description: null,
  unit: "Hộp",
  originCountry: null,
  manufacturer: null,
  distributor: null,
  categoryId: null,
  categorySlug: null,
  categoryName: null,
  sellingPrice: 100000,
  inStock: true,
  updatedAt: "2026-09-02T00:00:00Z",
};

describe("ProductGrid", () => {
  it("renders a ProductCard per product", () => {
    render(<ProductGrid products={[PRODUCT]} />);
    expect(screen.getByText("Sản phẩm 1")).toBeInTheDocument();
  });

  it("renders a deliberate empty state with a way back to the full catalog — never a blank grid", () => {
    render(<ProductGrid products={[]} />);
    expect(screen.getByText("Chưa có sản phẩm phù hợp")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Xem tất cả sản phẩm" })).toHaveAttribute("href", "/san-pham");
  });

  it("accepts a custom empty-state message for a category-specific context", () => {
    render(<ProductGrid products={[]} emptyTitle="Danh mục này hiện chưa có sản phẩm" />);
    expect(screen.getByText("Danh mục này hiện chưa có sản phẩm")).toBeInTheDocument();
  });
});
