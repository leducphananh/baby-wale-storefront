import { describe, expect, it, vi } from "vitest";

const rpc = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ rpc }),
}));

const { POST } = await import("./route");

const validBody = {
  customerName: "Nguyễn Văn A",
  customerPhone: "0912345678",
  shippingAddress: "123 Lê Lợi, Q1, TP.HCM",
  paymentMethod: "cod",
  items: [{ productId: "3f8c9b2e-8f2d-4c1a-9e2f-1a2b3c4d5e70", slug: "s", name: "n", quantity: 2 }],
  idempotencyKey: "3f8c9b2e-8f2d-4c1a-9e2f-1a2b3c4d5e6f",
};

function postRequest(body: unknown) {
  return new Request("http://localhost/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/checkout", () => {
  it("400s with a Vietnamese message when the body fails server-side Zod validation", async () => {
    const res = await POST(postRequest({ ...validBody, customerPhone: "123" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("INVALID_CUSTOMER_DATA");
    expect(body.message).not.toMatch(/zod|expected|received/i);
  });

  it("calls create_storefront_order with only product_id/quantity per line — never a price", async () => {
    rpc.mockResolvedValueOnce({
      data: {
        order_number: "ORD-004",
        tracking_token: "abc123",
        total: 298000,
        subtotal: 298000,
        shipping_fee: 0,
        payment_method: "cod",
        status: "draft",
        created_at: "2026-09-15T13:39:36.573Z",
      },
      error: null,
    });

    const res = await POST(postRequest(validBody));
    expect(res.status).toBe(201);

    const [, args] = rpc.mock.calls[0];
    expect(args.p_items).toEqual([{ product_id: "3f8c9b2e-8f2d-4c1a-9e2f-1a2b3c4d5e70", quantity: 2 }]);
    expect(args.p_items[0]).not.toHaveProperty("unit_price");
    expect(args.p_items[0]).not.toHaveProperty("price");

    const body = await res.json();
    expect(body.order.order_number).toBe("ORD-004");
  });

  it("maps an RPC error (message = stable code, details = JSON) to the safe error contract, never the raw Postgres text", async () => {
    rpc.mockResolvedValueOnce({
      data: null,
      error: {
        message: "OUT_OF_STOCK",
        details: JSON.stringify({ productId: "p-1", productName: "Sữa bột Meiji" }),
      },
    });

    const res = await POST(postRequest(validBody));
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body).toEqual({ code: "OUT_OF_STOCK", message: '"Sữa bột Meiji" đã hết hàng.' });
  });

  it("falls back to ORDER_CREATE_FAILED (500) for an unrecognized error and never leaks it", async () => {
    rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "permission denied for table orders", details: null },
    });

    const res = await POST(postRequest(validBody));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ code: "ORDER_CREATE_FAILED", message: "Không thể tạo đơn hàng. Vui lòng thử lại." });
  });

  it("tolerates a non-JSON DETAIL without crashing", async () => {
    rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "PRODUCT_NOT_FOUND", details: "not json" },
    });

    const res = await POST(postRequest(validBody));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.code).toBe("PRODUCT_NOT_FOUND");
  });
});
