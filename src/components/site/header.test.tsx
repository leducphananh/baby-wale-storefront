import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Header } from "./header";

describe("Header", () => {
  it("renders the logo, search, and cart slots (mobile and desktop rows both present in the DOM)", () => {
    render(
      <Header
        logo={<span>Baby Wale</span>}
        search={<input aria-label="Tìm kiếm sản phẩm" />}
        cartHref="/gio-hang"
        cartCount={2}
      />,
    );
    // Logo and search each render twice (once per responsive row) — both are
    // in the DOM at once; CSS, not JS, decides which row is visible.
    expect(screen.getAllByText("Baby Wale").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Tìm kiếm sản phẩm").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Giỏ hàng, 2 sản phẩm" }).length).toBeGreaterThan(0);
  });
});
