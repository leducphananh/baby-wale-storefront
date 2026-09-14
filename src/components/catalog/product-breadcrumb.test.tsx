import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductBreadcrumb } from "./product-breadcrumb";

describe("ProductBreadcrumb", () => {
  it("renders Home / Products / Category / Product with real names, category linked by slug", () => {
    render(
      <ProductBreadcrumb categoryName="Sữa bột" categorySlug="sua-bot" productName="Similac 400g" />,
    );
    expect(screen.getByRole("link", { name: "Trang chủ" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Sản phẩm" })).toHaveAttribute("href", "/san-pham");
    expect(screen.getByRole("link", { name: "Sữa bột" })).toHaveAttribute("href", "/danh-muc/sua-bot");
    expect(screen.getByText("Similac 400g")).toHaveAttribute("aria-current", "page");
  });

  it("omits the category crumb when the product has no category — never a broken/empty link", () => {
    render(<ProductBreadcrumb categoryName={null} categorySlug={null} productName="Similac 400g" />);
    expect(screen.queryByRole("link", { name: "" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sản phẩm" })).toBeInTheDocument();
  });

  it("never renders an internal id as visible breadcrumb text", () => {
    render(
      <ProductBreadcrumb categoryName="Sữa bột" categorySlug="sua-bot" productName="Similac 400g" />,
    );
    const text = screen.getByRole("navigation").textContent ?? "";
    expect(text).not.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}/i); // no UUID-shaped text
  });
});
