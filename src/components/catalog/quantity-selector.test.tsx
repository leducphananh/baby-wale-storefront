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
});
