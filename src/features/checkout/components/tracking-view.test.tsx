import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TrackingView } from "./tracking-view";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const safeOrder = {
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

describe("TrackingView", () => {
  it("renders the found order on a successful lookup", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ order: safeOrder }) }),
    );
    const user = userEvent.setup();
    render(<TrackingView />);

    await user.type(screen.getByLabelText(/Mã theo dõi đơn hàng/), "d0844301...");
    await user.click(screen.getByRole("button", { name: "Tra cứu" }));

    expect(await screen.findByText("ORD-004")).toBeInTheDocument();
    expect(screen.getByText("Sữa bột Meiji")).toBeInTheDocument();
  });

  it("shows one combined, non-revealing message for a not-found token — never distinguishing 'malformed' from 'no such order'", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ order: null }) }));
    const user = userEvent.setup();
    render(<TrackingView />);

    await user.type(screen.getByLabelText(/Mã theo dõi đơn hàng/), "khong-ton-tai");
    await user.click(screen.getByRole("button", { name: "Tra cứu" }));

    expect(
      await screen.findByText(
        "Không tìm thấy đơn hàng với mã này. Vui lòng kiểm tra lại đường dẫn hoặc liên hệ cửa hàng.",
      ),
    ).toBeInTheDocument();
  });

  it("shows a retryable generic error on an unexpected backend failure — never a raw error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }));
    const user = userEvent.setup();
    render(<TrackingView />);

    await user.type(screen.getByLabelText(/Mã theo dõi đơn hàng/), "some-token");
    await user.click(screen.getByRole("button", { name: "Tra cứu" }));

    expect(await screen.findByText("Không thể tra cứu lúc này. Vui lòng thử lại sau.")).toBeInTheDocument();
  });

  it("auto-looks-up once from an initialToken (a pasted tracking link) without a second manual submit", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ order: safeOrder }) });
    vi.stubGlobal("fetch", fetchMock);

    render(<TrackingView initialToken="d0844301d4ddbdb8545e11ad4b7ba700dd730548a96d0677" />);

    expect(await screen.findByText("ORD-004")).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/orders/lookup",
      expect.objectContaining({
        body: JSON.stringify({ token: "d0844301d4ddbdb8545e11ad4b7ba700dd730548a96d0677" }),
      }),
    );
  });

  it("never issues more than one request for a single lookup (egress-conscious, no polling)", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ order: safeOrder }) });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<TrackingView />);

    await user.type(screen.getByLabelText(/Mã theo dõi đơn hàng/), "abc123");
    await user.click(screen.getByRole("button", { name: "Tra cứu" }));

    await screen.findByText("ORD-004");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
