import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// `vi.mock` calls are hoisted above imports by Vitest.
const getStorefrontProductBySlug = vi.fn();
const listStorefrontProducts = vi.fn();
const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("@/features/catalog/server/get-product-by-slug", () => ({
  getStorefrontProductBySlug: (...args: unknown[]) => getStorefrontProductBySlug(...args),
}));
vi.mock("@/features/catalog/server/list-products", () => ({
  listStorefrontProducts: (...args: unknown[]) => listStorefrontProducts(...args),
}));
vi.mock("next/navigation", () => ({
  notFound: () => notFound(),
}));

import ProductDetailPage, { generateMetadata } from "./page";

const PRODUCT = {
  productId: "p-1",
  slug: "sua-bot-meiji",
  name: "Sữa bột Meiji số 1",
  brand: "Meiji",
  description: "Sữa công thức cho bé 0-12 tháng.",
  unit: "800g/hộp",
  originCountry: "Nhật Bản",
  manufacturer: "Meiji",
  distributor: "Anh Quân",
  categoryId: "cat-1",
  categorySlug: "sua-bot",
  categoryName: "Sữa bột",
  sellingPrice: 350000,
  inStock: true,
  updatedAt: "2026-09-02T00:00:00Z",
};

describe("ProductDetailPage (/san-pham/[slug])", () => {
  it("renders a valid public product: name, price, availability, description, spec list", async () => {
    getStorefrontProductBySlug.mockResolvedValueOnce(PRODUCT);
    listStorefrontProducts.mockResolvedValueOnce({ items: [], totalCount: 0 });

    const ui = await ProductDetailPage({ params: Promise.resolve({ slug: "sua-bot-meiji" }) });
    render(ui);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Sữa bột Meiji số 1");
    expect(screen.getByText("350.000 ₫")).toBeInTheDocument();
    expect(screen.getByText("Còn hàng")).toBeInTheDocument();
    expect(screen.getByText("Sữa công thức cho bé 0-12 tháng.")).toBeInTheDocument();
    expect(screen.getByText("Nhà phân phối")).toBeInTheDocument();
  });

  it("calls notFound() for an unknown/hidden/archived slug — the RPC returns null for all three (never a crash)", async () => {
    getStorefrontProductBySlug.mockResolvedValueOnce(null);

    await expect(
      ProductDetailPage({ params: Promise.resolve({ slug: "khong-ton-tai" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalledOnce();
    expect(listStorefrontProducts).not.toHaveBeenCalled();
  });

  it("omits the description section when there is none, rather than an empty block", async () => {
    getStorefrontProductBySlug.mockResolvedValueOnce({ ...PRODUCT, description: null });
    listStorefrontProducts.mockResolvedValueOnce({ items: [], totalCount: 0 });

    const ui = await ProductDetailPage({ params: Promise.resolve({ slug: "sua-bot-meiji" }) });
    render(ui);

    expect(screen.queryByText("Mô tả sản phẩm")).not.toBeInTheDocument();
  });

  it("fetches related products from the same category via the existing list function, excluding itself", async () => {
    getStorefrontProductBySlug.mockResolvedValueOnce(PRODUCT);
    listStorefrontProducts.mockResolvedValueOnce({
      items: [
        { ...PRODUCT, productId: "p-1" }, // itself — must be filtered out
        { ...PRODUCT, productId: "p-2", name: "Sữa bột Meiji số 2" },
      ],
      totalCount: 2,
    });

    const ui = await ProductDetailPage({ params: Promise.resolve({ slug: "sua-bot-meiji" }) });
    render(ui);

    expect(listStorefrontProducts).toHaveBeenCalledWith(
      expect.objectContaining({ categorySlug: "sua-bot" }),
    );
    expect(screen.getByText("Sản phẩm liên quan")).toBeInTheDocument();
    expect(screen.getByText("Sữa bột Meiji số 2")).toBeInTheDocument();
    // The product's own name legitimately appears twice by design (the
    // breadcrumb's current-page crumb + the H1) — it must NOT also appear a
    // third time as its own "related" card (which the un-filtered mock
    // would produce if the exclusion filter were broken).
    expect(screen.getAllByText("Sữa bột Meiji số 1")).toHaveLength(2);
  });

  it("skips the related-products call entirely when the product has no category", async () => {
    getStorefrontProductBySlug.mockResolvedValueOnce({ ...PRODUCT, categorySlug: null });

    const ui = await ProductDetailPage({ params: Promise.resolve({ slug: "sua-bot-meiji" }) });
    render(ui);

    expect(listStorefrontProducts).not.toHaveBeenCalled();
    expect(screen.queryByText("Sản phẩm liên quan")).not.toBeInTheDocument();
  });

  it("never renders forbidden/internal fields on the page", async () => {
    getStorefrontProductBySlug.mockResolvedValueOnce(PRODUCT);
    listStorefrontProducts.mockResolvedValueOnce({ items: [], totalCount: 0 });

    const ui = await ProductDetailPage({ params: Promise.resolve({ slug: "sua-bot-meiji" }) });
    const { container } = render(ui);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/purchase|cogs|supplier|sku|barcode|remaining|batch/i);
  });

  it("generateMetadata uses the real product name/description and a canonical URL; a hidden/unknown slug exposes no product metadata", async () => {
    getStorefrontProductBySlug.mockResolvedValueOnce(PRODUCT);
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "sua-bot-meiji" }) });
    expect(metadata.title).toBe("Sữa bột Meiji số 1 — Meiji");
    expect(metadata.alternates?.canonical).toBe("/san-pham/sua-bot-meiji");

    getStorefrontProductBySlug.mockResolvedValueOnce(null);
    const hiddenMetadata = await generateMetadata({ params: Promise.resolve({ slug: "an-hidden" }) });
    expect(hiddenMetadata.title).toBe("Sản phẩm");
    expect(hiddenMetadata.description).toBeUndefined();
  });
});
