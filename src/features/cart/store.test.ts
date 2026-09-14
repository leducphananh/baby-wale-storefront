import { afterEach, describe, expect, it } from "vitest";

import { selectCartCount, useCartStore } from "./store";

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

  it("uses productId as line identity — adding the same product again increments quantity instead of duplicating", () => {
    useCartStore.getState().addItem(ITEM);
    useCartStore.getState().addItem({ ...ITEM, quantity: 2 });

    const { lines } = useCartStore.getState();
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(3);
  });

  it("never trusts/stores a lower price bound — cachedUnitPrice is a display-only snapshot, refreshed on re-add", () => {
    useCartStore.getState().addItem(ITEM);
    useCartStore.getState().addItem({ ...ITEM, cachedUnitPrice: 199000 });
    expect(useCartStore.getState().lines[0].cachedUnitPrice).toBe(199000);
  });

  it("clamps quantity to a positive integer", () => {
    useCartStore.getState().addItem({ ...ITEM, quantity: 0 });
    expect(useCartStore.getState().lines[0].quantity).toBe(1);

    useCartStore.getState().setQuantity("p-1", 2.7);
    expect(useCartStore.getState().lines[0].quantity).toBe(2);

    useCartStore.getState().setQuantity("p-1", -5);
    expect(useCartStore.getState().lines[0].quantity).toBe(1);
  });

  it("removes a line by productId", () => {
    useCartStore.getState().addItem(ITEM);
    useCartStore.getState().removeItem("p-1");
    expect(useCartStore.getState().lines).toEqual([]);
  });

  it("clear() empties the cart", () => {
    useCartStore.getState().addItem(ITEM);
    useCartStore.getState().addItem({ ...ITEM, productId: "p-2" });
    useCartStore.getState().clear();
    expect(useCartStore.getState().lines).toEqual([]);
  });

  it("selectCartCount sums quantity across lines, not line count", () => {
    useCartStore.getState().addItem({ ...ITEM, quantity: 2 });
    useCartStore.getState().addItem({ ...ITEM, productId: "p-2", quantity: 3 });
    expect(selectCartCount(useCartStore.getState())).toBe(5);
  });
});
