import { describe, expect, it } from "vitest";

import { mapCheckoutErrorCode, statusForCheckoutErrorCode } from "./error-map";

describe("mapCheckoutErrorCode", () => {
  it("maps PRODUCT_NOT_FOUND to a Vietnamese message with no internals", () => {
    expect(mapCheckoutErrorCode("PRODUCT_NOT_FOUND")).toEqual({
      code: "PRODUCT_NOT_FOUND",
      message: "Sản phẩm không tồn tại.",
    });
  });

  it("interpolates the product name for PRODUCT_UNAVAILABLE when known", () => {
    const result = mapCheckoutErrorCode("PRODUCT_UNAVAILABLE", { productName: "Sữa bột Meiji" });
    expect(result.message).toBe('"Sữa bột Meiji" hiện không còn được bán.');
  });

  it("falls back to a generic message when no product name is known", () => {
    const result = mapCheckoutErrorCode("PRODUCT_UNAVAILABLE", {});
    expect(result.message).toBe("Sản phẩm hiện không còn được bán.");
  });

  it("includes the exact available quantity for QUANTITY_ADJUSTMENT_REQUIRED", () => {
    const result = mapCheckoutErrorCode("QUANTITY_ADJUSTMENT_REQUIRED", {
      available: 3,
      productName: "Sữa bột Meiji",
    });
    expect(result.message).toBe('Chỉ còn 3 sản phẩm "Sữa bột Meiji". Vui lòng điều chỉnh số lượng.');
  });

  it("maps INVALID_CUSTOMER_DATA to a field-specific message", () => {
    const result = mapCheckoutErrorCode("INVALID_CUSTOMER_DATA", { field: "customer_phone" });
    expect(result).toEqual({
      code: "INVALID_CUSTOMER_DATA",
      field: "customer_phone",
      message: "Số điện thoại không hợp lệ.",
    });
  });

  it("falls back to a generic message for an unrecognized field", () => {
    const result = mapCheckoutErrorCode("INVALID_CUSTOMER_DATA", { field: "something_new" });
    expect(result.message).toBe("Thông tin đơn hàng không hợp lệ. Vui lòng kiểm tra lại.");
  });

  it("never leaks a raw/unmapped code — falls back to ORDER_CREATE_FAILED", () => {
    const result = mapCheckoutErrorCode("permission denied for table orders");
    expect(result).toEqual({ code: "ORDER_CREATE_FAILED", message: "Không thể tạo đơn hàng. Vui lòng thử lại." });
  });
});

describe("statusForCheckoutErrorCode", () => {
  it("maps each code to a sensible HTTP status", () => {
    expect(statusForCheckoutErrorCode("PRODUCT_NOT_FOUND")).toBe(404);
    expect(statusForCheckoutErrorCode("PRODUCT_UNAVAILABLE")).toBe(409);
    expect(statusForCheckoutErrorCode("OUT_OF_STOCK")).toBe(409);
    expect(statusForCheckoutErrorCode("QUANTITY_ADJUSTMENT_REQUIRED")).toBe(409);
    expect(statusForCheckoutErrorCode("PRICE_CHANGED")).toBe(409);
    expect(statusForCheckoutErrorCode("INVALID_QUANTITY")).toBe(400);
    expect(statusForCheckoutErrorCode("INVALID_CUSTOMER_DATA")).toBe(400);
    expect(statusForCheckoutErrorCode("ORDER_CREATE_FAILED")).toBe(500);
  });
});
