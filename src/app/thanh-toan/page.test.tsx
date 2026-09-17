import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import CheckoutPage, { metadata } from "./page";
import { useCartStore } from "@/features/cart/store";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

afterEach(() => {
  useCartStore.setState({ lines: [], selectedProductIds: [] });
});

describe("CheckoutPage (/thanh-toan)", () => {
  it("renders exactly one 'Thanh toán' page heading, with the checkout view underneath", () => {
    render(<CheckoutPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Thanh toán" })).toBeInTheDocument();
    // Empty cart by default — CheckoutView renders its own empty state.
    expect(screen.getByText("Chưa có sản phẩm nào được chọn")).toBeInTheDocument();
  });

  it("is not indexed — a private, non-shareable, per-browser page (nextjs-seo)", () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});
