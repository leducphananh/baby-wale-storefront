import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CartView } from "./cart-view";
import { useCartStore, type CartLine } from "@/features/cart/store";

const LINE_A: CartLine = {
  productId: "p-1",
  slug: "san-pham-a",
  name: "Sản phẩm A",
  imageUrl: null,
  unit: "Hộp",
  quantity: 2,
  cachedUnitPrice: 100000,
  cachedAt: "2026-09-14T00:00:00Z",
};

const LINE_B: CartLine = {
  productId: "p-2",
  slug: "san-pham-b",
  name: "Sản phẩm B",
  imageUrl: null,
  unit: "Gói",
  quantity: 1,
  cachedUnitPrice: 50000,
  cachedAt: "2026-09-14T00:00:00Z",
};

afterEach(() => {
  useCartStore.setState({ lines: [] });
});

describe("CartView", () => {
  it("shows the polished empty state when there are no lines, with a link back to the catalog", () => {
    render(<CartView />);
    expect(screen.getByText("Giỏ hàng đang trống")).toBeInTheDocument();
    expect(screen.getByText("Hãy thêm sản phẩm bạn cần vào giỏ hàng.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tiếp tục mua sắm" })).toHaveAttribute("href", "/san-pham");
    // No checkout CTA while empty — nothing to check out.
    expect(screen.queryByRole("link", { name: "Tiến hành đặt hàng" })).not.toBeInTheDocument();
  });

  it("does not invent a promotion, discount, or shipping promise in the empty state", () => {
    render(<CartView />);
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/miễn phí vận chuyển|giảm giá|khuyến mãi/i);
  });

  it("renders one row per cart line and the correct overall subtotal", () => {
    useCartStore.setState({ lines: [LINE_A, LINE_B] });
    render(<CartView />);

    expect(screen.getByText("Sản phẩm A")).toBeInTheDocument();
    expect(screen.getByText("Sản phẩm B")).toBeInTheDocument();
    // 2*100.000 + 1*50.000 = 250.000, shown for both "Tạm tính" and "Tổng tiền hàng"
    // in the desktop panel, plus once more in the mobile sticky bar.
    expect(screen.getAllByText("250.000 ₫").length).toBeGreaterThanOrEqual(2);
  });

  it("renders the checkout CTA in exactly two DOM regions (desktop panel + mobile sticky bar), CSS-gated like Header — never both visible at the same viewport", () => {
    useCartStore.setState({ lines: [LINE_A] });
    render(<CartView />);
    expect(screen.getAllByRole("link", { name: "Tiến hành đặt hàng" })).toHaveLength(2);
  });

  it("the checkout CTA is pure navigation — /thanh-toan, no order/checkout logic on this page", () => {
    useCartStore.setState({ lines: [LINE_A] });
    render(<CartView />);
    for (const link of screen.getAllByRole("link", { name: "Tiến hành đặt hàng" })) {
      expect(link).toHaveAttribute("href", "/thanh-toan");
    }
  });
});
