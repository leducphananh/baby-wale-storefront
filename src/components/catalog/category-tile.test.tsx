import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CategoryTile } from "./category-tile";
import type { StorefrontCategory } from "@/features/catalog/types";

const CATEGORY: StorefrontCategory = {
  categoryId: "cat-1",
  slug: "bim",
  name: "Bỉm",
  description: null,
  productCount: 12,
};

describe("CategoryTile", () => {
  it("renders the real category name and product count, linking by slug", () => {
    render(<CategoryTile category={CATEGORY} />);
    expect(screen.getByText("Bỉm")).toBeInTheDocument();
    expect(screen.getByText("12 sản phẩm")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/danh-muc/bim");
  });
});
