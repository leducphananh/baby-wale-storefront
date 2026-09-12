import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormField } from "./form-field";
import { Input } from "./input";

describe("FormField", () => {
  it("associates the visible label with the field via htmlFor/id", () => {
    render(
      <FormField label="Số điện thoại">
        {(field) => <Input {...field} type="tel" />}
      </FormField>,
    );
    expect(screen.getByLabelText("Số điện thoại")).toBeInTheDocument();
  });

  it("marks the field invalid and associates the error text via aria-describedby", () => {
    render(
      <FormField label="Số điện thoại" error="Số điện thoại không hợp lệ">
        {(field) => <Input {...field} type="tel" />}
      </FormField>,
    );
    const input = screen.getByLabelText("Số điện thoại");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const error = screen.getByRole("alert");
    expect(error).toHaveTextContent("Số điện thoại không hợp lệ");
    expect(describedBy).toContain(error.id);
  });
});
