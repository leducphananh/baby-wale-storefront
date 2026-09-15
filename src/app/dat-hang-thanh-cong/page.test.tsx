import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import OrderSuccessPage, { metadata } from "./page";

describe("OrderSuccessPage (/dat-hang-thanh-cong)", () => {
  it("renders the calm not-found state when nothing was just checked out in this session", () => {
    render(<OrderSuccessPage />);
    expect(screen.getByText("Không tìm thấy thông tin đơn hàng gần đây")).toBeInTheDocument();
  });

  it("is not indexed (nextjs-seo)", () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});
