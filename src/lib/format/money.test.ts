import { describe, expect, it } from "vitest";

import { formatProductPrice, formatVnd } from "./money";

describe("formatVnd", () => {
  it("formats an integer VND amount with thousands separators and the currency sign", () => {
    expect(formatVnd(185000)).toBe("185.000 ₫");
  });

  it("rounds a non-integer amount rather than showing decimals (money is integer VND)", () => {
    expect(formatVnd(185000.6)).toBe("185.001 ₫");
  });

  it("does not special-case zero — a genuine zero total is a real amount, not 'Liên hệ'", () => {
    expect(formatVnd(0)).toBe("0 ₫");
  });
});

describe("formatProductPrice", () => {
  it("formats a real selling price normally", () => {
    expect(formatProductPrice(185000)).toBe("185.000 ₫");
  });

  it("shows 'Liên hệ' instead of '0 ₫' for an unpriced product (S4 rule)", () => {
    expect(formatProductPrice(0)).toBe("Liên hệ");
  });

  it("treats a negative value the same as unpriced (defensive — should never happen server-side)", () => {
    expect(formatProductPrice(-1)).toBe("Liên hệ");
  });
});
