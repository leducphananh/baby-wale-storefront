import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CartIndicator } from "./cart-indicator";
import { useCartStore } from "@/features/cart/store";

afterEach(() => {
  useCartStore.setState({ lines: [] });
});

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

  it("self-reads the live cart store when no explicit count is passed (S5)", () => {
    useCartStore.getState().addItem({
      productId: "p-1",
      slug: "sua-bot",
      name: "Sữa bột",
      imageUrl: null,
      unit: "Hộp",
      cachedUnitPrice: 100000,
      quantity: 2,
    });

    render(<CartIndicator href="/gio-hang" />);
    expect(screen.getByRole("link", { name: "Giỏ hàng, 2 sản phẩm" })).toBeInTheDocument();
  });

  it("an explicit count always wins over the store value (used by every other existing test/consumer)", () => {
    useCartStore.getState().addItem({
      productId: "p-1",
      slug: "sua-bot",
      name: "Sữa bột",
      imageUrl: null,
      unit: "Hộp",
      cachedUnitPrice: 100000,
      quantity: 5,
    });

    render(<CartIndicator href="/gio-hang" count={1} />);
    expect(screen.getByRole("link", { name: "Giỏ hàng, 1 sản phẩm" })).toBeInTheDocument();
  });
});
