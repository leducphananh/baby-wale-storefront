import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductCard } from "./product-card";
import type { StorefrontProduct } from "@/features/catalog/types";

const BASE_PRODUCT: StorefrontProduct = {
  productId: "p-1",
  slug: "sua-bot-meiji-so-1",
  name: "Sữa bột Meiji số 1",
  brand: "Meiji",
  description: null,
  unit: "800g/hộp",
  originCountry: null,
  manufacturer: null,
  distributor: "Thư Hưng",
  categoryId: "cat-1",
  categorySlug: "sua-bot",
  categoryName: "Sữa bột",
  sellingPrice: 185000,
  inStock: true,
  updatedAt: "2026-09-02T00:00:00Z",
};

describe("ProductCard", () => {
  it("renders the public product fields and links to the product detail slug", () => {
    render(<ProductCard product={BASE_PRODUCT} />);

    expect(screen.getByText("Meiji")).toBeInTheDocument();
    expect(screen.getByText("Sữa bột Meiji số 1")).toBeInTheDocument();
    expect(screen.getByText("800g/hộp")).toBeInTheDocument();
    expect(screen.getByText("185.000 ₫")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/san-pham/sua-bot-meiji-so-1");
  });

  it("never renders internal/forbidden fields (sku, barcode, cost, supplier, quantity)", () => {
    render(<ProductCard product={BASE_PRODUCT} />);
    const card = screen.getByRole("link");
    const text = card.textContent ?? "";
    expect(text).not.toMatch(/sku/i);
    expect(text).not.toMatch(/barcode/i);
    expect(text).not.toMatch(/purchase|cost|cogs/i);
    expect(text).not.toMatch(/supplier/i);
    expect(text).not.toMatch(/remaining|quantity|batch/i);
  });

  it("shows the out-of-stock badge only when out of stock — no 'in stock' badge on cards", () => {
    const { rerender } = render(<ProductCard product={BASE_PRODUCT} />);
    expect(screen.queryByText("Còn hàng")).not.toBeInTheDocument();
    expect(screen.queryByText("Hết hàng")).not.toBeInTheDocument();

    rerender(<ProductCard product={{ ...BASE_PRODUCT, inStock: false }} />);
    expect(screen.getByText("Hết hàng")).toBeInTheDocument();
  });

  it("clamps a long product name without shifting the layout (reserved 2-line height)", () => {
    const longName =
      "Sữa bột công thức cao cấp dành cho trẻ sơ sinh và trẻ nhỏ từ 0 đến 12 tháng tuổi, hộp thiếc 900g nhập khẩu";
    render(<ProductCard product={{ ...BASE_PRODUCT, name: longName }} />);
    const nameEl = screen.getByText(longName);
    expect(nameEl.className).toMatch(/line-clamp-2/);
    expect(nameEl.className).toMatch(/min-h-10/);
  });

  it("shows 'Liên hệ' instead of '0 ₫' for an unpriced product", () => {
    render(<ProductCard product={{ ...BASE_PRODUCT, sellingPrice: 0 }} />);
    expect(screen.getByText("Liên hệ")).toBeInTheDocument();
    expect(screen.queryByText("0 ₫")).not.toBeInTheDocument();
  });

  it("renders the neutral missing-image placeholder, never a fabricated photo", () => {
    render(<ProductCard product={BASE_PRODUCT} />);
    // The placeholder icon wrapper is decorative (aria-hidden) — assert via
    // the image frame not containing an <img> (no real image URL exists yet).
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
