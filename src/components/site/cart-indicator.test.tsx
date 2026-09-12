import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CartIndicator } from "./cart-indicator";

describe("CartIndicator", () => {
  it("announces the item count in its accessible name, not colour alone", () => {
    render(<CartIndicator href="/gio-hang" count={3} />);
    expect(screen.getByRole("link", { name: "Giỏ hàng, 3 sản phẩm" })).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("falls back to a plain label and hides the badge when the cart is empty", () => {
    render(<CartIndicator href="/gio-hang" />);
    expect(screen.getByRole("link", { name: "Giỏ hàng" })).toBeInTheDocument();
  });

  it("caps the visible badge at 99+", () => {
    render(<CartIndicator href="/gio-hang" count={150} />);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });
});
