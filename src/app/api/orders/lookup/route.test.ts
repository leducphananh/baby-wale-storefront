import { describe, expect, it, vi } from "vitest";

const rpc = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ rpc }),
}));

const { POST } = await import("./route");

function postRequest(body: unknown) {
  return new Request("http://localhost/api/orders/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

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

describe("POST /api/orders/lookup", () => {
  it("calls get_storefront_order_by_token with the extracted token and returns the safe order", async () => {
    rpc.mockResolvedValueOnce({ data: safeOrder, error: null });

    const res = await POST(postRequest({ token: "d0844301d4ddbdb8545e11ad4b7ba700dd730548a96d0677" }));
    expect(res.status).toBe(200);
    expect(rpc).toHaveBeenCalledWith("get_storefront_order_by_token", {
      p_token: "d0844301d4ddbdb8545e11ad4b7ba700dd730548a96d0677",
    });
    const body = await res.json();
    expect(body.order).toEqual(safeOrder);
  });

  it("extracts a token from a pasted tracking URL before calling the RPC (defense in depth)", async () => {
    rpc.mockResolvedValueOnce({ data: safeOrder, error: null });

    await POST(postRequest({ token: "https://babywale.vn/tra-cuu-don-hang?token=abc123" }));
    expect(rpc).toHaveBeenCalledWith("get_storefront_order_by_token", { p_token: "abc123" });
  });

  it("returns { order: null } with 200 (never a distinguishing status) when the RPC finds nothing", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: null });

    const res = await POST(postRequest({ token: "unknown-token" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ order: null });
  });

  it("returns { order: null } with 200 for an empty/malformed token — same shape as not-found (no probing signal)", async () => {
    const res = await POST(postRequest({ token: "   " }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ order: null });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("returns { order: null } for a missing/malformed request body", async () => {
    const res = await POST(postRequest({}));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ order: null });
  });

  it("maps an unexpected RPC error to a generic 500 — never a raw Postgres message", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { message: "connection reset" } });

    const res = await POST(postRequest({ token: "some-token" }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.message).toBe("Không thể tra cứu lúc này. Vui lòng thử lại sau.");
    expect(JSON.stringify(body)).not.toMatch(/connection reset/);
  });
});
