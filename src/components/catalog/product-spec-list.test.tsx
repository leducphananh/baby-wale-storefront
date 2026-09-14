import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductSpecList } from "./product-spec-list";

describe("ProductSpecList", () => {
  it("renders only the fields that are actually present", () => {
    render(<ProductSpecList unit="400g/hộp" originCountry={null} manufacturer={null} distributor="Anh Quân" />);
    expect(screen.getByText("Đơn vị")).toBeInTheDocument();
    expect(screen.getByText("400g/hộp")).toBeInTheDocument();
    expect(screen.getByText("Nhà phân phối")).toBeInTheDocument();
    expect(screen.getByText("Anh Quân")).toBeInTheDocument();
    expect(screen.queryByText("Xuất xứ")).not.toBeInTheDocument();
    expect(screen.queryByText("Nhà sản xuất")).not.toBeInTheDocument();
  });

  it("renders nothing (not an empty box) when no field is present", () => {
    const { container } = render(
      <ProductSpecList unit={null} originCountry={null} manufacturer={null} distributor={null} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("never renders purchase price, cost, or supplier fields — only the public contract's fields exist as props", () => {
    render(<ProductSpecList unit="400g/hộp" originCountry="Việt Nam" manufacturer="Meiji" distributor="Anh Quân" />);
    const text = screen.getByText("Thông số sản phẩm").parentElement?.textContent ?? "";
    expect(text).not.toMatch(/purchase|cost|supplier|sku|barcode/i);
  });
});
