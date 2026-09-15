import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TrackingForm } from "./tracking-form";

describe("TrackingForm", () => {
  it("shows a Vietnamese validation error and does not submit when empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TrackingForm onSubmit={onSubmit} loading={false} />);

    await user.click(screen.getByRole("button", { name: "Tra cứu" }));

    expect(
      await screen.findByText("Vui lòng nhập mã theo dõi hoặc dán liên kết theo dõi đơn hàng."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits the entered token/URL as typed", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TrackingForm onSubmit={onSubmit} loading={false} />);

    await user.type(screen.getByLabelText(/Mã theo dõi đơn hàng/), "d0844301d4ddbdb8545e11ad4b7ba700dd730548a96d0677");
    await user.click(screen.getByRole("button", { name: "Tra cứu" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({
      trackingInput: "d0844301d4ddbdb8545e11ad4b7ba700dd730548a96d0677",
    });
  });

  it("pre-fills from defaultValue (a pasted-link auto-lookup)", () => {
    render(<TrackingForm onSubmit={vi.fn()} loading={false} defaultValue="abc123" />);
    expect(screen.getByLabelText(/Mã theo dõi đơn hàng/)).toHaveValue("abc123");
  });

  it("disables the field and button while loading (pending-submit guard)", () => {
    render(<TrackingForm onSubmit={vi.fn()} loading />);
    expect(screen.getByLabelText(/Mã theo dõi đơn hàng/)).toBeDisabled();
    expect(screen.getByRole("button", { name: /Đang tra cứu/ })).toBeDisabled();
  });
});
