import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LAST_ORDER_SESSION_KEY } from "./checkout-view";
import { OrderSuccessView } from "./order-success-view";

afterEach(() => {
  sessionStorage.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const confirmation = {
  order_number: "ORD-004",
  tracking_token: "d0844301d4ddbdb8545e11ad4b7ba700dd730548a96d0677",
  total: 298000,
  subtotal: 298000,
  shipping_fee: 0,
  payment_method: "cod" as const,
  status: "draft",
  created_at: "2026-09-15T13:39:36.573Z",
};

const detail = {
  orderNumber: "ORD-004",
  status: "Đơn mới – chờ xác nhận",
  paymentMethod: "cod" as const,
  createdAt: "2026-09-15T13:39:36.573Z",
  subtotal: 298000,
  shippingFee: 0,
  total: 298000,
  items: [{ productName: "Sữa bột Meiji", quantity: 2, unitPrice: 149000, lineTotal: 298000 }],
  note: null,
};

/** A lookup that never resolves — the minimal confirmation view stays as-is. */
function stubPendingLookup() {
  vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
}

describe("OrderSuccessView", () => {
  it("renders ORDER RECEIVED framing, never 'paid'/'delivered' (S2.4 §10.7), from a real committed confirmation", () => {
    stubPendingLookup();
    sessionStorage.setItem(LAST_ORDER_SESSION_KEY, JSON.stringify(confirmation));
    render(<OrderSuccessView />);

    expect(screen.getByText("Đặt hàng thành công")).toBeInTheDocument();
    expect(screen.getByText("ORD-004")).toBeInTheDocument();
    expect(screen.getByText("298.000 ₫")).toBeInTheDocument();
    expect(screen.queryByText(/đã thanh toán|đã giao|đảm bảo/i)).not.toBeInTheDocument();
  });

  it("shows a calm 'not found' state — not an error — when nothing was just checked out", () => {
    render(<OrderSuccessView />);
    expect(screen.getByText("Không tìm thấy thông tin đơn hàng gần đây")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tiếp tục mua sắm" })).toHaveAttribute("href", "/san-pham");
  });

  it("enriches with the full order detail (items, status label) via one /api/orders/lookup call", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ order: detail }) });
    vi.stubGlobal("fetch", fetchMock);
    sessionStorage.setItem(LAST_ORDER_SESSION_KEY, JSON.stringify(confirmation));

    render(<OrderSuccessView />);

    expect(await screen.findByText("Sữa bột Meiji")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/orders/lookup",
      expect.objectContaining({ body: JSON.stringify({ token: confirmation.tracking_token }) }),
    );
  });

  it("falls back to the minimal confirmation if the enrichment lookup fails — the order is still confirmed", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    sessionStorage.setItem(LAST_ORDER_SESSION_KEY, JSON.stringify(confirmation));

    render(<OrderSuccessView />);

    expect(screen.getByText("Đặt hàng thành công")).toBeInTheDocument();
    expect(screen.getByText("298.000 ₫")).toBeInTheDocument();
  });

  it("copies a tracking link pointing at /tra-cuu-don-hang (never the order UUID) to the clipboard on request", async () => {
    stubPendingLookup();
    sessionStorage.setItem(LAST_ORDER_SESSION_KEY, JSON.stringify(confirmation));
    const user = userEvent.setup();
    // Defined AFTER userEvent.setup(), which installs its own clipboard
    // stub for copy/paste emulation and would otherwise clobber this mock.
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });

    render(<OrderSuccessView />);

    await user.click(screen.getByRole("button", { name: "Sao chép liên kết theo dõi" }));

    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining(`/tra-cuu-don-hang?token=${confirmation.tracking_token}`),
    );
    expect(await screen.findByText("Đã sao chép")).toBeInTheDocument();
  });

  it("falls back to showing just the order number when there is no plaintext token (an idempotent replay)", () => {
    sessionStorage.setItem(LAST_ORDER_SESSION_KEY, JSON.stringify({ ...confirmation, tracking_token: null }));
    render(<OrderSuccessView />);
    expect(screen.queryByRole("button", { name: "Sao chép liên kết theo dõi" })).not.toBeInTheDocument();
    expect(screen.getByText(/lưu lại mã đơn hàng/)).toBeInTheDocument();
  });

  it("also offers a link to the manual tracking page for a later return visit", () => {
    stubPendingLookup();
    sessionStorage.setItem(LAST_ORDER_SESSION_KEY, JSON.stringify(confirmation));
    render(<OrderSuccessView />);
    expect(screen.getByRole("link", { name: "Tra cứu đơn hàng" })).toHaveAttribute("href", "/tra-cuu-don-hang");
  });
});
