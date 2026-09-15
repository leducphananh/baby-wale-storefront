import { describe, expect, it } from "vitest";

import { checkoutFormSchema, checkoutRequestSchema, normalizeVietnamesePhone } from "./schema";

describe("normalizeVietnamesePhone", () => {
  it("passes through an already-canonical 0XXXXXXXXX number", () => {
    expect(normalizeVietnamesePhone("0912345678")).toBe("0912345678");
  });

  it("strips spaces/dashes/parens", () => {
    expect(normalizeVietnamesePhone("091 234 5678")).toBe("0912345678");
    expect(normalizeVietnamesePhone("091-234-5678")).toBe("0912345678");
  });

  it("folds a leading +84 to a local 0", () => {
    expect(normalizeVietnamesePhone("+84912345678")).toBe("0912345678");
  });

  it("folds a leading 84 (no +) to a local 0 when the length matches", () => {
    expect(normalizeVietnamesePhone("84912345678")).toBe("0912345678");
  });
});

describe("checkoutFormSchema", () => {
  const validValues = {
    customerName: "Nguyễn Văn A",
    customerPhone: "0912345678",
    shippingAddress: "123 Lê Lợi, Q1, TP.HCM",
    customerEmail: "",
    note: "",
    paymentMethod: "cod" as const,
  };

  it("accepts a fully valid submission", () => {
    const result = checkoutFormSchema.safeParse(validValues);
    expect(result.success).toBe(true);
  });

  it("rejects an empty name with a Vietnamese message", () => {
    const result = checkoutFormSchema.safeParse({ ...validValues, customerName: "  " });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Vui lòng nhập họ tên.");
  });

  it("rejects an invalid phone with a Vietnamese message", () => {
    const result = checkoutFormSchema.safeParse({ ...validValues, customerPhone: "123" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Số điện thoại không hợp lệ.");
  });

  it("normalizes the phone as part of validation", () => {
    const result = checkoutFormSchema.safeParse({ ...validValues, customerPhone: "+84 912 345 678" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.customerPhone).toBe("0912345678");
    }
  });

  it("rejects an empty shipping address", () => {
    const result = checkoutFormSchema.safeParse({ ...validValues, shippingAddress: "" });
    expect(result.success).toBe(false);
  });

  it("allows an empty email (optional)", () => {
    const result = checkoutFormSchema.safeParse({ ...validValues, customerEmail: "" });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed email", () => {
    const result = checkoutFormSchema.safeParse({ ...validValues, customerEmail: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown payment method", () => {
    const result = checkoutFormSchema.safeParse({ ...validValues, paymentMethod: "cash" });
    expect(result.success).toBe(false);
  });
});

describe("checkoutRequestSchema", () => {
  const base = {
    customerName: "Nguyễn Văn A",
    customerPhone: "0912345678",
    shippingAddress: "123 Lê Lợi, Q1, TP.HCM",
    paymentMethod: "cod" as const,
    idempotencyKey: "3f8c9b2e-8f2d-4c1a-9e2f-1a2b3c4d5e6f",
  };

  it("requires at least one item", () => {
    const result = checkoutRequestSchema.safeParse({ ...base, items: [] });
    expect(result.success).toBe(false);
  });

  it("requires a valid idempotency key (uuid)", () => {
    const result = checkoutRequestSchema.safeParse({
      ...base,
      idempotencyKey: "not-a-uuid",
      items: [{ productId: "3f8c9b2e-8f2d-4c1a-9e2f-1a2b3c4d5e70", slug: "s", name: "n", quantity: 1 }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid full request", () => {
    const result = checkoutRequestSchema.safeParse({
      ...base,
      items: [{ productId: "3f8c9b2e-8f2d-4c1a-9e2f-1a2b3c4d5e70", slug: "s", name: "n", quantity: 2 }],
    });
    expect(result.success).toBe(true);
  });
});
