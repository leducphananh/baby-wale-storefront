import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import TrackingPage, { metadata } from "./page";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("TrackingPage (/tra-cuu-don-hang)", () => {
  it("renders exactly one page heading and the tracking form", async () => {
    const jsx = await TrackingPage({ searchParams: Promise.resolve({}) });
    render(jsx);
    expect(screen.getByRole("heading", { level: 1, name: "Tra cứu đơn hàng" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tra cứu" })).toBeInTheDocument();
  });

  it("is not indexed — the same private-page treatment as cart/checkout/success (S2.1)", () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });

  it("passes a token search param through to the tracking view for auto-lookup", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          order: {
            orderNumber: "ORD-004",
            status: "Đơn mới – chờ xác nhận",
            paymentMethod: "cod",
            createdAt: "2026-09-15T13:39:36.573Z",
            subtotal: 298000,
            shippingFee: 0,
            total: 298000,
            items: [],
            note: null,
          },
        }),
      }),
    );

    const jsx = await TrackingPage({ searchParams: Promise.resolve({ token: "abc123" }) });
    render(jsx);

    expect(await screen.findByText("ORD-004")).toBeInTheDocument();
  });
});
