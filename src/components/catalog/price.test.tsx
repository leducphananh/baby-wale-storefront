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

  describe("treatZeroAsUnavailable={false} (S6 — an aggregate cart/order total, not a single product's price)", () => {
    it("renders a real amount normally", () => {
      render(<Price amount={200000} treatZeroAsUnavailable={false} />);
      expect(screen.getByText("200.000 ₫")).toBeInTheDocument();
    });

    it("renders a genuine zero as '0 ₫', never 'Liên hệ' — money.ts: 'a genuine 0 cart/order total must never say Liên hệ'", () => {
      render(<Price amount={0} treatZeroAsUnavailable={false} />);
      expect(screen.getByText("0 ₫")).toBeInTheDocument();
      expect(screen.queryByText("Liên hệ")).not.toBeInTheDocument();
    });
  });
});
