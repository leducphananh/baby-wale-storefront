import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("renders nothing when there is only one page", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} buildHref={(p) => `/san-pham?trang=${p}`} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the current page and hides Previous on page 1", () => {
    render(<Pagination currentPage={1} totalPages={3} buildHref={(p) => `/san-pham?trang=${p}`} />);
    expect(screen.getByText("Trang 1 / 3")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Trang trước" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Trang sau" })).toHaveAttribute("href", "/san-pham?trang=2");
  });

  it("hides Next on the last page", () => {
    render(<Pagination currentPage={3} totalPages={3} buildHref={(p) => `/san-pham?trang=${p}`} />);
    expect(screen.getByRole("link", { name: "Trang trước" })).toHaveAttribute("href", "/san-pham?trang=2");
    expect(screen.queryByRole("link", { name: "Trang sau" })).not.toBeInTheDocument();
  });

  it("shows both Previous and Next on a middle page", () => {
    render(<Pagination currentPage={2} totalPages={3} buildHref={(p) => `/san-pham?trang=${p}`} />);
    expect(screen.getByRole("link", { name: "Trang trước" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Trang sau" })).toBeInTheDocument();
  });
});
