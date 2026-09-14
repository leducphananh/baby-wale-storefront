import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProductGallery } from "./product-gallery";

describe("ProductGallery", () => {
  it("shows the neutral missing-image placeholder when there are no images (no fabricated photo)", () => {
    render(<ProductGallery images={[]} productName="Sữa bột Meiji số 1" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    // No thumbnail strip for 0 images.
    expect(screen.queryByRole("group", { name: "Ảnh sản phẩm" })).not.toBeInTheDocument();
  });

  it("renders no thumbnail strip for a single image either — only when multiple images exist", () => {
    render(<ProductGallery images={["/a.jpg"]} productName="Sữa bột Meiji số 1" />);
    expect(screen.queryByRole("group", { name: "Ảnh sản phẩm" })).not.toBeInTheDocument();
  });

  it("shows a thumbnail per image with meaningful accessible names, and lets you select one", async () => {
    const user = userEvent.setup();
    render(<ProductGallery images={["/a.jpg", "/b.jpg"]} productName="Sữa bột Meiji số 1" />);

    const thumb1 = screen.getByRole("button", { name: "Xem ảnh 1 trên 2" });
    const thumb2 = screen.getByRole("button", { name: "Xem ảnh 2 trên 2" });
    expect(thumb1).toHaveAttribute("aria-current", "true");
    expect(thumb2).toHaveAttribute("aria-current", "false");

    await user.click(thumb2);
    expect(thumb2).toHaveAttribute("aria-current", "true");
    expect(thumb1).toHaveAttribute("aria-current", "false");
  });
});
