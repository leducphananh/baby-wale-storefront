import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its text content", () => {
    render(<Badge variant="danger">Hết hàng</Badge>);
    expect(screen.getByText("Hết hàng")).toBeInTheDocument();
  });

  it("renders an accompanying icon so status is not colour-only", () => {
    render(
      <Badge variant="success" icon={<span data-testid="icon" />}>
        Còn hàng
      </Badge>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("Còn hàng")).toBeInTheDocument();
  });
});
