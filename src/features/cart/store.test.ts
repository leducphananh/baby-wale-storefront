import { afterEach, describe, expect, it } from "vitest";

import { selectCartCount, selectCartSubtotal, useCartStore } from "./store";

const ITEM = {
  productId: "p-1",
  slug: "sua-bot-meiji",
  name: "Sữa bột Meiji số 1",
  imageUrl: null,
  unit: "800g/hộp",
  cachedUnitPrice: 185000,
};

afterEach(() => {
  useCartStore.setState({ lines: [] });
});

describe("useCartStore", () => {
  it("starts empty", () => {
    expect(useCartStore.getState().lines).toEqual([]);
  });

  it("adds a new line with quantity 1 by default", () => {
    useCartStore.getState().addItem(ITEM);
    const { lines } = useCartStore.getState();
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ productId: "p-1", quantity: 1, cachedUnitPrice: 185000 });
  });

  it("uses productId as line identity — adding the same product again merges quantity into one row, not two", () => {
    useCartStore.getState().addItem(ITEM);
    useCartStore.getState().addItem({ ...ITEM, quantity: 2 });

    const { lines } = useCartStore.getState();
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(3);
  });

  it("keeps different products as separate lines", () => {
    useCartStore.getState().addItem(ITEM);
    useCartStore.getState().addItem({ ...ITEM, productId: "p-2", name: "Sản phẩm khác" });
    expect(useCartStore.getState().lines).toHaveLength(2);
  });

  it("never trusts a lower price bound — cachedUnitPrice is a display-only snapshot, refreshed on re-add", () => {
    useCartStore.getState().addItem(ITEM);
    useCartStore.getState().addItem({ ...ITEM, cachedUnitPrice: 199000 });
    expect(useCartStore.getState().lines[0].cachedUnitPrice).toBe(199000);
  });

  describe("incrementQuantity", () => {
    it("adds 1 to the line's quantity", () => {
      useCartStore.getState().addItem(ITEM);
      useCartStore.getState().incrementQuantity("p-1");
      expect(useCartStore.getState().lines[0].quantity).toBe(2);
    });

    it("is a no-op for an unknown productId — never crashes", () => {
      useCartStore.getState().incrementQuantity("unknown");
      expect(useCartStore.getState().lines).toEqual([]);
    });
  });

  describe("decrementQuantity", () => {
    it("subtracts 1 above the floor", () => {
      useCartStore.getState().addItem({ ...ITEM, quantity: 3 });
      useCartStore.getState().decrementQuantity("p-1");
      expect(useCartStore.getState().lines[0].quantity).toBe(2);
    });

    it("removes the line entirely when decrementing from quantity 1 (S6 business rule)", () => {
      useCartStore.getState().addItem({ ...ITEM, quantity: 1 });
      useCartStore.getState().decrementQuantity("p-1");
      expect(useCartStore.getState().lines).toEqual([]);
    });

    it("does not affect other lines when removing one via decrement-from-1", () => {
      useCartStore.getState().addItem({ ...ITEM, quantity: 1 });
      useCartStore.getState().addItem({ ...ITEM, productId: "p-2", quantity: 5 });
      useCartStore.getState().decrementQuantity("p-1");
      const { lines } = useCartStore.getState();
      expect(lines).toHaveLength(1);
      expect(lines[0].productId).toBe("p-2");
    });
  });

  describe("setQuantity (updateQuantity)", () => {
    it("clamps to a positive integer", () => {
      useCartStore.getState().addItem(ITEM);

      useCartStore.getState().setQuantity("p-1", 2.7);
      expect(useCartStore.getState().lines[0].quantity).toBe(2);

      useCartStore.getState().setQuantity("p-1", -5);
      expect(useCartStore.getState().lines[0].quantity).toBe(1);

      useCartStore.getState().setQuantity("p-1", 0);
      expect(useCartStore.getState().lines[0].quantity).toBe(1);

      useCartStore.getState().setQuantity("p-1", NaN);
      expect(useCartStore.getState().lines[0].quantity).toBe(1);

      useCartStore.getState().setQuantity("p-1", Infinity);
      // Infinity is not a valid stored quantity — clamped, not stored as-is.
      expect(Number.isFinite(useCartStore.getState().lines[0].quantity)).toBe(true);
    });
  });

  it("removeItem removes exactly one line by productId", () => {
    useCartStore.getState().addItem(ITEM);
    useCartStore.getState().addItem({ ...ITEM, productId: "p-2" });
    useCartStore.getState().removeItem("p-1");
    const { lines } = useCartStore.getState();
    expect(lines).toHaveLength(1);
    expect(lines[0].productId).toBe("p-2");
  });

  it("clear() empties the cart (clearCart)", () => {
    useCartStore.getState().addItem(ITEM);
    useCartStore.getState().addItem({ ...ITEM, productId: "p-2" });
    useCartStore.getState().clear();
    expect(useCartStore.getState().lines).toEqual([]);
    expect(selectCartCount(useCartStore.getState())).toBe(0);
  });

  describe("business semantic totals", () => {
    it("Product A × 2 @ 100,000 → subtotal 200,000", () => {
      useCartStore.getState().addItem({ ...ITEM, cachedUnitPrice: 100000, quantity: 2 });
      expect(selectCartSubtotal(useCartStore.getState())).toBe(200000);
    });

    it("Product A × 3 + Product B × 2 → item count 5, subtotal is the sum of both lines", () => {
      useCartStore.getState().addItem({ ...ITEM, cachedUnitPrice: 100000, quantity: 3 });
      useCartStore.getState().addItem({ ...ITEM, productId: "p-2", cachedUnitPrice: 50000, quantity: 2 });

      expect(selectCartCount(useCartStore.getState())).toBe(5);
      expect(selectCartSubtotal(useCartStore.getState())).toBe(3 * 100000 + 2 * 50000);
    });

    it("selectCartCount sums quantity across lines, not the number of distinct products", () => {
      useCartStore.getState().addItem({ ...ITEM, quantity: 2 });
      useCartStore.getState().addItem({ ...ITEM, productId: "p-2", quantity: 3 });
      expect(selectCartCount(useCartStore.getState())).toBe(5);
    });
  });
});

/**
 * `sanitizeLines` isn't exported (it's an implementation detail of the
 * `persist` `merge` option) — exercised here through the same `merge`
 * function `persist` would call, by reading it off the store's own
 * `persist` API. This is the realistic integration point: a customer
 * hand-editing `localStorage` produces exactly this kind of malformed
 * input, and it must never reach `set()` unsanitized (S6 §18).
 */
describe("persisted-state sanitization (S6 §18 — malformed localStorage)", () => {
  function merge(persisted: unknown) {
    const mergeFn = useCartStore.persist.getOptions().merge;
    if (!mergeFn) throw new Error("merge option is not configured");
    return mergeFn(persisted, useCartStore.getState()) as { lines: unknown[] };
  }

  it("drops a line with no productId", () => {
    const result = merge({ lines: [{ name: "x", quantity: 1, cachedUnitPrice: 1000 }] });
    expect(result.lines).toEqual([]);
  });

  it("clamps an invalid quantity (negative/zero/NaN/Infinity) to a valid positive integer", () => {
    const result = merge({
      lines: [
        { productId: "p-1", quantity: -5, cachedUnitPrice: 1000 },
        { productId: "p-2", quantity: 0, cachedUnitPrice: 1000 },
        { productId: "p-3", quantity: NaN, cachedUnitPrice: 1000 },
        { productId: "p-4", quantity: Infinity, cachedUnitPrice: 1000 },
      ],
    });
    for (const line of result.lines as Array<{ quantity: number }>) {
      expect(Number.isInteger(line.quantity)).toBe(true);
      expect(line.quantity).toBeGreaterThanOrEqual(1);
      expect(Number.isFinite(line.quantity)).toBe(true);
    }
  });

  it("coerces an invalid cachedUnitPrice to a safe default rather than crashing or storing NaN", () => {
    const result = merge({
      lines: [{ productId: "p-1", quantity: 1, cachedUnitPrice: "not-a-number" }],
    });
    const [line] = result.lines as Array<{ cachedUnitPrice: number }>;
    expect(Number.isFinite(line.cachedUnitPrice)).toBe(true);
  });

  it("merges duplicate productIds instead of keeping two rows for the same product", () => {
    const result = merge({
      lines: [
        { productId: "p-1", quantity: 2, cachedUnitPrice: 1000 },
        { productId: "p-1", quantity: 3, cachedUnitPrice: 1200 },
      ],
    });
    expect(result.lines).toHaveLength(1);
    expect((result.lines[0] as { quantity: number }).quantity).toBe(5);
  });

  it("never throws on a completely corrupted structure — a non-array becomes an empty cart", () => {
    expect(() => merge({ lines: "not-an-array" })).not.toThrow();
    expect(merge({ lines: "not-an-array" }).lines).toEqual([]);

    expect(() => merge(null)).not.toThrow();
    expect(merge(null).lines).toEqual([]);

    expect(() => merge({ lines: [null, undefined, 42, "x"] })).not.toThrow();
    expect(merge({ lines: [null, undefined, 42, "x"] }).lines).toEqual([]);
  });
});
