import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CheckoutOrderReview } from "./checkout-order-review";
import type { CartLine } from "@/features/cart/store";

const lines: CartLine[] = [
  {
    productId: "p-1",
    slug: "sua-bot-meiji",
    name: "Sữa bột Meiji",
    imageUrl: null,
    unit: "hộp",
    quantity: 2,
    cachedUnitPrice: 185000,
    cachedAt: "2026-09-15T00:00:00.000Z",
  },
];

describe("CheckoutOrderReview", () => {
  it("renders every line's name, quantity, and line total", () => {
    render(<CheckoutOrderReview lines={lines} />);
    expect(screen.getByText("Sữa bột Meiji")).toBeInTheDocument();
    expect(screen.getByText(/2 hộp/)).toBeInTheDocument();
    // Line total = 2 * 185000 = 370000.
    expect(screen.getByText("370.000 ₫")).toBeInTheDocument();
  });

  it("links back to the cart for editing, rather than duplicating cart-edit UI", () => {
    render(<CheckoutOrderReview lines={lines} />);
    expect(screen.getByRole("link", { name: "Chỉnh sửa giỏ hàng" })).toHaveAttribute("href", "/gio-hang");
  });
});
