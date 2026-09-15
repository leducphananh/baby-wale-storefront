import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import CartPage, { metadata } from "./page";
import { useCartStore } from "@/features/cart/store";

afterEach(() => {
  useCartStore.setState({ lines: [] });
});

describe("CartPage (/gio-hang)", () => {
  it("renders exactly one 'Giỏ hàng' page heading, with the cart view underneath", () => {
    render(<CartPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Giỏ hàng");
    // The client CartView renders under it (empty state, by default).
    expect(screen.getByText("Giỏ hàng đang trống")).toBeInTheDocument();
  });

  it("is not indexed — a private, non-shareable, per-browser page (nextjs-seo, defense in depth alongside robots.ts)", () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});
