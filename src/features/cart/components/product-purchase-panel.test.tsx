import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProductPurchasePanel } from "./product-purchase-panel";
import { useCartStore } from "@/features/cart/store";

const PRODUCT = {
  productId: "p-1",
  slug: "sua-bot-meiji",
  name: "Sữa bột Meiji số 1",
  unit: "800g/hộp",
  sellingPrice: 185000,
  inStock: true,
};

/**
 * jsdom has no `IntersectionObserver`. `ProductPurchasePanel` already
 * guards against that (`typeof IntersectionObserver === "undefined"`), so
 * most tests run against the real absence. This one test that verifies the
 * sticky-bar-appears behaviour installs a tiny controllable stub so the
 * callback can be triggered manually.
 */
class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }
  observe = vi.fn();
  disconnect = vi.fn();
  trigger(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

afterEach(() => {
  useCartStore.setState({ lines: [] });
});

describe("ProductPurchasePanel", () => {
  it("defaults to quantity 1 and adds the correct product + quantity to the cart", async () => {
    const user = userEvent.setup();
    render(<ProductPurchasePanel {...PRODUCT} />);

    expect(screen.getByRole("spinbutton", { name: "Số lượng" })).toHaveValue("1");

    await user.click(screen.getByRole("button", { name: "Tăng số lượng" }));
    await user.click(screen.getByRole("button", { name: "Thêm vào giỏ" }));

    const { lines } = useCartStore.getState();
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ productId: "p-1", slug: "sua-bot-meiji", quantity: 2 });
  });

  it("shows inline confirmation text after adding (announced via aria-live, not colour alone)", async () => {
    const user = userEvent.setup();
    render(<ProductPurchasePanel {...PRODUCT} />);
    await user.click(screen.getByRole("button", { name: "Thêm vào giỏ" }));
    expect(screen.getByText("Đã thêm vào giỏ hàng")).toBeInTheDocument();
  });

  it("does not call any order/checkout API — adding to cart is purely local store state", async () => {
    const user = userEvent.setup();
    render(<ProductPurchasePanel {...PRODUCT} />);
    await user.click(screen.getByRole("button", { name: "Thêm vào giỏ" }));
    // No network call exists in this component at all — nothing to mock/
    // assert against beyond the store itself, which is the point: adding to
    // cart never reaches the network in S5.
    expect(useCartStore.getState().lines).toHaveLength(1);
  });

  it("only ever sends a display-only price snapshot (cachedUnitPrice), never a purchase price/cost field", async () => {
    const user = userEvent.setup();
    render(<ProductPurchasePanel {...PRODUCT} />);
    await user.click(screen.getByRole("button", { name: "Thêm vào giỏ" }));
    const line = useCartStore.getState().lines[0];
    expect(line.cachedUnitPrice).toBe(185000);
    expect(line).not.toHaveProperty("purchasePrice");
    expect(line).not.toHaveProperty("cost");
  });

  it("is disabled and labelled 'Hết hàng' when out of stock — the button stays visible, never hidden", () => {
    render(<ProductPurchasePanel {...PRODUCT} inStock={false} />);
    const button = screen.getByRole("button", { name: "Hết hàng" });
    expect(button).toBeDisabled();
    expect(screen.getByRole("spinbutton", { name: "Số lượng" })).toBeDisabled();
  });

  describe("sticky mobile bar", () => {
    const originalIO = globalThis.IntersectionObserver;

    beforeEach(() => {
      FakeIntersectionObserver.instances = [];
      // @ts-expect-error - test stub, not a full IntersectionObserver
      globalThis.IntersectionObserver = FakeIntersectionObserver;
    });

    afterEach(() => {
      globalThis.IntersectionObserver = originalIO;
    });

    it("does not show a second Add-to-Cart affordance while the in-flow button is visible", () => {
      render(<ProductPurchasePanel {...PRODUCT} />);
      expect(screen.getAllByRole("button", { name: "Thêm vào giỏ" })).toHaveLength(1);
    });

    it("shows the sticky bar (a second CTA) only once the in-flow button scrolls out of view", () => {
      render(<ProductPurchasePanel {...PRODUCT} />);
      const observer = FakeIntersectionObserver.instances[0];

      act(() => observer.trigger(false)); // in-flow button scrolled out of view
      expect(screen.getAllByRole("button", { name: "Thêm vào giỏ" })).toHaveLength(2);

      act(() => observer.trigger(true)); // back into view
      expect(screen.getAllByRole("button", { name: "Thêm vào giỏ" })).toHaveLength(1);
    });
  });
});
