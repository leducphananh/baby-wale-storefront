import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { QuantitySelector } from "./quantity-selector";

describe("QuantitySelector", () => {
  it("shows the current value and has accessible +/- controls", () => {
    render(<QuantitySelector value={1} onChange={vi.fn()} />);
    expect(screen.getByRole("spinbutton", { name: "Số lượng" })).toHaveValue("1");
    expect(screen.getByRole("button", { name: "Giảm số lượng" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tăng số lượng" })).toBeInTheDocument();
  });

  it("increments on +", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={1} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Tăng số lượng" }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("cannot go below 1 — the decrement button is disabled at the minimum", async () => {
    const onChange = vi.fn();
    render(<QuantitySelector value={1} onChange={onChange} />);
    expect(screen.getByRole("button", { name: "Giảm số lượng" })).toBeDisabled();
  });

  it("decrements normally above the minimum", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={3} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Giảm số lượng" }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("clamps a soft maxHint (UX only — never inventory-backed)", () => {
    render(<QuantitySelector value={5} onChange={vi.fn()} maxHint={5} />);
    expect(screen.getByRole("button", { name: "Tăng số lượng" })).toBeDisabled();
  });

  it("disables all controls when disabled", () => {
    render(<QuantitySelector value={1} onChange={vi.fn()} disabled />);
    expect(screen.getByRole("button", { name: "Giảm số lượng" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Tăng số lượng" })).toBeDisabled();
    expect(screen.getByRole("spinbutton", { name: "Số lượng" })).toBeDisabled();
  });

  it("rejects a non-integer/invalid typed value, falling back to a valid integer", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantitySelector value={1} onChange={onChange} />);
    const input = screen.getByRole("spinbutton", { name: "Số lượng" });
    await user.clear(input);
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(1);
  });

  describe("itemLabel (S6 — disambiguates multiple rows on one page, e.g. the cart)", () => {
    it("uses the generic labels when omitted (Product Detail — unchanged from before S6)", () => {
      render(<QuantitySelector value={1} onChange={vi.fn()} />);
      expect(screen.getByRole("button", { name: "Giảm số lượng" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Tăng số lượng" })).toBeInTheDocument();
      expect(screen.getByRole("spinbutton", { name: "Số lượng" })).toBeInTheDocument();
    });

    it("includes the item name in every control's accessible name when provided", () => {
      render(<QuantitySelector value={1} onChange={vi.fn()} itemLabel="Sữa bột Meiji" />);
      expect(screen.getByRole("button", { name: "Giảm số lượng Sữa bột Meiji" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Tăng số lượng Sữa bột Meiji" })).toBeInTheDocument();
      expect(screen.getByRole("spinbutton", { name: "Số lượng Sữa bột Meiji" })).toBeInTheDocument();
    });
  });

  describe("onDecrementBelowMin (S6 — the cart's 'decrement from 1 removes the line' rule)", () => {
    it("without it, the decrement button stays disabled at the minimum (Product Detail behaviour, unchanged)", () => {
      render(<QuantitySelector value={1} onChange={vi.fn()} />);
      expect(screen.getByRole("button", { name: "Giảm số lượng" })).toBeDisabled();
    });

    it("with it, the decrement button stays enabled at the minimum and calls the callback instead of onChange", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onDecrementBelowMin = vi.fn();
      render(
        <QuantitySelector value={1} onChange={onChange} onDecrementBelowMin={onDecrementBelowMin} />,
      );

      const decrementButton = screen.getByRole("button", { name: "Giảm số lượng" });
      expect(decrementButton).not.toBeDisabled();

      await user.click(decrementButton);
      expect(onDecrementBelowMin).toHaveBeenCalledOnce();
      expect(onChange).not.toHaveBeenCalled();
    });

    it("above the minimum, decrementing still goes through onChange as normal, even with the callback provided", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onDecrementBelowMin = vi.fn();
      render(
        <QuantitySelector value={3} onChange={onChange} onDecrementBelowMin={onDecrementBelowMin} />,
      );

      await user.click(screen.getByRole("button", { name: "Giảm số lượng" }));
      expect(onChange).toHaveBeenCalledWith(2);
      expect(onDecrementBelowMin).not.toHaveBeenCalled();
    });
  });
});
