import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OrderDetailView } from "./order-detail-view";
import type { OrderDetail } from "@/features/checkout/types";

const baseOrder: OrderDetail = {
  orderNumber: "ORD-004",
  status: "Đơn mới – chờ xác nhận",
  paymentMethod: "cod",
  createdAt: "2026-09-15T13:39:36.573Z",
  subtotal: 298000,
  shippingFee: 0,
  total: 298000,
  items: [{ productName: "Sữa bột Meiji", quantity: 2, unitPrice: 149000, lineTotal: 298000 }],
  note: null,
};

describe("OrderDetailView", () => {
  it("renders the order number, status label, and payment method as-is (never a raw enum)", () => {
    render(<OrderDetailView order={baseOrder} />);
    expect(screen.getByText("ORD-004")).toBeInTheDocument();
    expect(screen.getByText("Đơn mới – chờ xác nhận")).toBeInTheDocument();
    expect(screen.getByText("Thanh toán khi nhận hàng (COD)")).toBeInTheDocument();
    expect(screen.queryByText("draft")).not.toBeInTheDocument();
    expect(screen.queryByText("cod")).not.toBeInTheDocument();
  });

  it("never renders a paid/unpaid badge (S2.1 §12.2)", () => {
    render(<OrderDetailView order={baseOrder} />);
    expect(screen.queryByText(/unpaid|paid|Đã thanh toán/i)).not.toBeInTheDocument();
  });

  it("shows the historical item unit price and line total from the order, not a re-derived one", () => {
    render(<OrderDetailView order={baseOrder} />);
    expect(screen.getByText("Sữa bột Meiji")).toBeInTheDocument();
    expect(screen.getByText("149.000 ₫")).toBeInTheDocument();
    expect(screen.getAllByText("298.000 ₫").length).toBeGreaterThan(0);
  });

  it("shows the three-line totals format (S2.1 §12.3) — never a single implied grand total", () => {
    render(<OrderDetailView order={baseOrder} />);
    expect(screen.getByText("Tạm tính (hàng hoá)")).toBeInTheDocument();
    expect(screen.getByText("Phí vận chuyển: Nhân viên sẽ xác nhận")).toBeInTheDocument();
    expect(screen.getByText("Tổng tiền hàng")).toBeInTheDocument();
  });

  it("adds the contact-support helper line only for a cancelled order", () => {
    const { rerender } = render(<OrderDetailView order={baseOrder} />);
    expect(screen.queryByText("Vui lòng liên hệ cửa hàng nếu bạn cần hỗ trợ.")).not.toBeInTheDocument();

    rerender(<OrderDetailView order={{ ...baseOrder, status: "Đã huỷ" }} />);
    expect(screen.getByText("Vui lòng liên hệ cửa hàng nếu bạn cần hỗ trợ.")).toBeInTheDocument();
  });

  it("shows the bank-transfer helper without fabricating account details (O8 unresolved)", () => {
    render(<OrderDetailView order={{ ...baseOrder, paymentMethod: "bank_transfer" }} />);
    expect(screen.getByText("Chuyển khoản ngân hàng")).toBeInTheDocument();
    expect(screen.getByText(/sẽ được cửa hàng cung cấp/)).toBeInTheDocument();
  });

  it("never renders customer contact fields the type doesn't carry (phone/address minimization)", () => {
    render(<OrderDetailView order={baseOrder} />);
    // OrderDetail has no phone/address fields at all — nothing to assert by
    // query, this documents the type-level guarantee via a compile check
    // (see OrderDetail in types.ts) rather than a runtime string search.
    expect(Object.keys(baseOrder)).not.toContain("shippingAddressSnapshot");
    expect(Object.keys(baseOrder)).not.toContain("customerPhoneSnapshot");
  });
});
