import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PaymentMethodField } from "./payment-method-field";

describe("PaymentMethodField", () => {
  it("renders all supported payment methods", () => {
    render(<PaymentMethodField id="payment" value="cod" onChange={vi.fn()} />);

    expect(screen.getByText("Thanh toán khi nhận hàng (COD)")).toBeInTheDocument();
    expect(screen.getByText("Chuyển khoản ngân hàng")).toBeInTheDocument();
    expect(screen.getByText("Thanh toán qua VNPay")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("shows a check mark next to the selected option only", () => {
    render(<PaymentMethodField id="payment" value="cod" onChange={vi.fn()} />);
    const codRadio = screen.getByRole("radio", { name: /COD/ });
    const bankRadio = screen.getByRole("radio", { name: /Chuyển khoản/ });
    expect(codRadio).toHaveAttribute("data-state", "checked");
    expect(bankRadio).toHaveAttribute("data-state", "unchecked");
  });

  it("calls onChange with the selected method", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PaymentMethodField id="payment" value="cod" onChange={onChange} />);
    await user.click(screen.getByRole("radio", { name: /Chuyển khoản/ }));
    expect(onChange).toHaveBeenCalledWith("bank_transfer");
  });
});
