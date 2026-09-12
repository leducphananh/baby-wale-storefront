import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Price } from "./price";

describe("Price", () => {
  it("renders a formatted VND amount", () => {
    render(<Price amount={185000} />);
    expect(screen.getByText("185.000 ₫")).toBeInTheDocument();
  });

  it("renders 'Liên hệ' for a zero (unpriced) amount, never '0 ₫'", () => {
    render(<Price amount={0} />);
    expect(screen.getByText("Liên hệ")).toBeInTheDocument();
    expect(screen.queryByText("0 ₫")).not.toBeInTheDocument();
  });
});
