import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { CartItemRow } from "./cart-item-row";
import { useCartStore, type CartLine } from "@/features/cart/store";

const LINE: CartLine = {
  productId: "p-1",
  slug: "sua-bot-meiji",
  name: "Sữa bột Meiji số 1",
  imageUrl: null,
  unit: "800g/hộp",
  quantity: 2,
  cachedUnitPrice: 100000,
  cachedAt: "2026-09-14T00:00:00Z",
};

afterEach(() => {
  useCartStore.setState({ lines: [] });
});

describe("CartItemRow", () => {
  it("renders name, unit, unit price, quantity, and the line subtotal", () => {
    render(<CartItemRow line={LINE} />);
    expect(screen.getByText("Sữa bột Meiji số 1")).toBeInTheDocument();
    expect(screen.getByText("800g/hộp")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue("2");
    // Unit price (100.000 ₫) and line subtotal (200.000 ₫) both render.
    expect(screen.getByText("100.000 ₫")).toBeInTheDocument();
    expect(screen.getByText("200.000 ₫")).toBeInTheDocument();
  });

  it("has a meaningful, product-specific remove label — not just an icon", () => {
    render(<CartItemRow line={LINE} />);
    expect(screen.getByRole("button", { name: "Xóa Sữa bột Meiji số 1 khỏi giỏ hàng" })).toBeInTheDocument();
  });

  it("has product-specific quantity control labels (ambiguous on a page with multiple rows otherwise)", () => {
    render(<CartItemRow line={LINE} />);
    expect(screen.getByRole("button", { name: "Giảm số lượng Sữa bột Meiji số 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tăng số lượng Sữa bột Meiji số 1" })).toBeInTheDocument();
  });

  it("removing the item updates the store", async () => {
    const user = userEvent.setup();
    useCartStore.setState({ lines: [LINE] });
    render(<CartItemRow line={LINE} />);

    await user.click(screen.getByRole("button", { name: "Xóa Sữa bột Meiji số 1 khỏi giỏ hàng" }));
    expect(useCartStore.getState().lines).toEqual([]);
  });

  it("incrementing updates the store quantity", async () => {
    const user = userEvent.setup();
    useCartStore.setState({ lines: [LINE] });
    render(<CartItemRow line={LINE} />);

    await user.click(screen.getByRole("button", { name: "Tăng số lượng Sữa bột Meiji số 1" }));
    expect(useCartStore.getState().lines[0].quantity).toBe(3);
  });

  it("decrementing above 1 updates the quantity without removing the line", async () => {
    const user = userEvent.setup();
    useCartStore.setState({ lines: [LINE] });
    render(<CartItemRow line={LINE} />);

    await user.click(screen.getByRole("button", { name: "Giảm số lượng Sữa bột Meiji số 1" }));
    expect(useCartStore.getState().lines[0].quantity).toBe(1);
  });

  it("decrementing from quantity 1 removes the line (S6 business rule)", async () => {
    const user = userEvent.setup();
    const singleLine = { ...LINE, quantity: 1 };
    useCartStore.setState({ lines: [singleLine] });
    render(<CartItemRow line={singleLine} />);

    await user.click(screen.getByRole("button", { name: "Giảm số lượng Sữa bột Meiji số 1" }));
    expect(useCartStore.getState().lines).toEqual([]);
  });
});
