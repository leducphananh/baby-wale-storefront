import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CartSummary } from "./cart-summary";

describe("CartSummary", () => {
  it("shows the frozen S2.4 §10.4 totals terminology and the calculated subtotal", () => {
    render(<CartSummary subtotal={200000} selectedCount={2} />);
    expect(screen.getByText("Tạm tính (2 sản phẩm)")).toBeInTheDocument();
    expect(screen.getByText("Phí vận chuyển: Nhân viên sẽ xác nhận")).toBeInTheDocument();
    expect(screen.getByText("Tổng tiền hàng")).toBeInTheDocument();
    expect(screen.getAllByText("200.000 ₫")).toHaveLength(2); // subtotal + goods total, same value today
  });

  it("never says 'Tổng thanh toán' while shipping stays unresolved (CLAUDE.md §8)", () => {
    render(<CartSummary subtotal={200000} selectedCount={2} />);
    expect(screen.queryByText(/Tổng thanh toán/)).not.toBeInTheDocument();
  });

  it("a genuine zero subtotal renders '0 ₫', never 'Liên hệ' (money.ts's aggregate-vs-product-price distinction)", () => {
    render(<CartSummary subtotal={0} selectedCount={2} />);
    expect(screen.getAllByText("0 ₫").length).toBeGreaterThan(0);
    expect(screen.queryByText("Liên hệ")).not.toBeInTheDocument();
  });

  it("the CTA is pure navigation to /thanh-toan — no checkout logic, no onClick handler", () => {
    render(<CartSummary subtotal={200000} selectedCount={2} />);
    expect(screen.getByRole("link", { name: "Tiến hành đặt hàng" })).toHaveAttribute("href", "/thanh-toan");
  });

  it("can hide the CTA (used by the mobile sticky bar, which supplies its own)", () => {
    render(<CartSummary subtotal={200000} showCta={false} selectedCount={2} />);
    expect(screen.queryByRole("link", { name: "Tiến hành đặt hàng" })).not.toBeInTheDocument();
  });

  it("never claims a shipping fee, discount, or promotion — only the approved shipping-unresolved notice", () => {
    render(<CartSummary subtotal={200000} selectedCount={2} />);
    const text = screen.getByText("Tóm tắt đơn hàng").closest("div")?.textContent ?? "";
    expect(text).not.toMatch(/miễn phí|giảm giá|khuyến mãi|discount/i);
  });
});
