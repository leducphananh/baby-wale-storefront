import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StockBadge } from "./stock-badge";

describe("StockBadge", () => {
  it("shows the frozen 'Còn hàng' label with an icon when in stock (not colour-only)", () => {
    render(<StockBadge inStock />);
    expect(screen.getByText("Còn hàng")).toBeInTheDocument();
  });

  it("shows the frozen 'Hết hàng' label when out of stock", () => {
    render(<StockBadge inStock={false} />);
    expect(screen.getByText("Hết hàng")).toBeInTheDocument();
  });

  it("never shows a raw enum/number — only the two customer labels exist", () => {
    render(<StockBadge inStock={false} />);
    expect(screen.queryByText(/out_of_stock/i)).not.toBeInTheDocument();
  });
});
