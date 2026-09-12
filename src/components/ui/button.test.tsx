import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders as a native button by default", () => {
    render(<Button>Đặt hàng</Button>);
    expect(screen.getByRole("button", { name: "Đặt hàng" })).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Đặt hàng</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Đặt hàng" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled and marked busy while loading, and does not fire onClick", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Đang xử lý
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Đang xử lý" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders onto a single child via asChild instead of wrapping it in a <button>", () => {
    render(
      <Button asChild>
        <a href="/gio-hang">Xem giỏ hàng</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Xem giỏ hàng" });
    expect(link).toHaveAttribute("href", "/gio-hang");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
