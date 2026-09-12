import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CategoryFilterChips } from "./category-filter-chips";
import type { StorefrontCategory } from "@/features/catalog/types";

const CATEGORIES: StorefrontCategory[] = [
  { categoryId: "cat-1", slug: "bim", name: "Bỉm", description: null, productCount: 4 },
  { categoryId: "cat-2", slug: "sua-bot", name: "Sữa bột", description: null, productCount: 2 },
];

describe("CategoryFilterChips", () => {
  it("renders an 'All' chip plus one chip per category, slug-linked", () => {
    render(<CategoryFilterChips categories={CATEGORIES} />);
    expect(screen.getByRole("link", { name: "Tất cả" })).toHaveAttribute("href", "/san-pham");
    expect(screen.getByRole("link", { name: "Bỉm" })).toHaveAttribute("href", "/san-pham?danh-muc=bim");
    expect(screen.getByRole("link", { name: "Sữa bột" })).toHaveAttribute(
      "href",
      "/san-pham?danh-muc=sua-bot",
    );
  });

  it("marks the active category current, not by colour alone (aria-current)", () => {
    render(<CategoryFilterChips categories={CATEGORIES} activeCategorySlug="bim" />);
    expect(screen.getByRole("link", { name: "Bỉm" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Tất cả" })).not.toHaveAttribute("aria-current");
  });

  it("renders nothing when there are no categories yet", () => {
    const { container } = render(<CategoryFilterChips categories={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
