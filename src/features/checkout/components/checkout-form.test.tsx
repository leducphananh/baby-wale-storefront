import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { CheckoutForm } from "./checkout-form";

/**
 * jsdom has no `ResizeObserver`, which `@radix-ui/react-use-size` (used by
 * the radio indicator inside `PaymentMethodField`) needs. Same local-stub
 * pattern already established for `IntersectionObserver`
 * (`product-purchase-panel.test.tsx`) — not a global polyfill.
 */
class FakeResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("CheckoutForm", () => {
  let originalRO: typeof ResizeObserver | undefined;
  beforeAll(() => {
    originalRO = globalThis.ResizeObserver;
    globalThis.ResizeObserver = FakeResizeObserver;
  });
  afterAll(() => {
    globalThis.ResizeObserver = originalRO as typeof ResizeObserver;
  });

  it("shows Vietnamese validation errors and does not call onSubmit when required fields are empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CheckoutForm onSubmit={onSubmit} submitting={false} />);

    await user.click(screen.getByRole("button", { name: "Đặt hàng" }));

    expect(await screen.findByText("Vui lòng nhập họ tên.")).toBeInTheDocument();
    expect(screen.getByText("Vui lòng nhập số điện thoại.")).toBeInTheDocument();
    expect(screen.getByText("Vui lòng nhập địa chỉ nhận hàng.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits normalized, valid values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CheckoutForm onSubmit={onSubmit} submitting={false} />);

    await user.type(screen.getByLabelText(/^Họ và tên/), "Nguyễn Văn A");
    await user.type(screen.getByLabelText(/^Số điện thoại/), "0912345678");
    await user.type(screen.getByLabelText(/^Địa chỉ nhận hàng/), "123 Lê Lợi, Q1, TP.HCM");

    await user.click(screen.getByRole("button", { name: "Đặt hàng" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      customerName: "Nguyễn Văn A",
      customerPhone: "0912345678",
      shippingAddress: "123 Lê Lợi, Q1, TP.HCM",
      paymentMethod: "cod",
    });
  });

  it("disables every field while submitting (pending-submit guard — react-hook-form-zod rule 5)", () => {
    render(<CheckoutForm onSubmit={vi.fn()} submitting />);
    expect(screen.getByLabelText(/^Họ và tên/)).toBeDisabled();
    expect(screen.getByRole("button", { name: /Đang xử lý/ })).toBeDisabled();
  });

  it("surfaces a server-side field error (e.g. INVALID_CUSTOMER_DATA) on the right field", () => {
    render(
      <CheckoutForm
        onSubmit={vi.fn()}
        submitting={false}
        serverFieldError={{ field: "customer_phone", message: "Số điện thoại không hợp lệ." }}
      />,
    );
    expect(screen.getByText("Số điện thoại không hợp lệ.")).toBeInTheDocument();
  });
});
