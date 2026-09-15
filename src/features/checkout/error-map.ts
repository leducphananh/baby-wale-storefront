import "server-only";

import type { CheckoutErrorCode, CheckoutErrorDetail, CheckoutErrorResponse } from "@/features/checkout/types";

/**
 * S0 E7's error contract → friendly Vietnamese (`storefront-error-handling`
 * rule 1: never expose a raw RPC code or Postgres message to the customer).
 * `code` here is exactly the `MESSAGE` the RPC raises with (`create_storefront_order()`'s
 * own documented convention); `detail`, when present, is that RAISE's parsed
 * `DETAIL` JSON.
 */
export function mapCheckoutErrorCode(
  code: string,
  detail: CheckoutErrorDetail = {},
): CheckoutErrorResponse {
  switch (code as CheckoutErrorCode) {
    case "PRODUCT_NOT_FOUND":
      return { code: "PRODUCT_NOT_FOUND", message: "Sản phẩm không tồn tại." };
    case "PRODUCT_UNAVAILABLE":
      return {
        code: "PRODUCT_UNAVAILABLE",
        message: detail.productName
          ? `"${detail.productName}" hiện không còn được bán.`
          : "Sản phẩm hiện không còn được bán.",
      };
    case "OUT_OF_STOCK":
      return {
        code: "OUT_OF_STOCK",
        message: detail.productName ? `"${detail.productName}" đã hết hàng.` : "Sản phẩm đã hết hàng.",
      };
    case "QUANTITY_ADJUSTMENT_REQUIRED":
      return {
        code: "QUANTITY_ADJUSTMENT_REQUIRED",
        message: `Chỉ còn ${detail.available ?? 0} sản phẩm${
          detail.productName ? ` "${detail.productName}"` : ""
        }. Vui lòng điều chỉnh số lượng.`,
      };
    case "PRICE_CHANGED":
      return {
        code: "PRICE_CHANGED",
        message: `Giá sản phẩm${
          detail.productName ? ` "${detail.productName}"` : ""
        } đã thay đổi. Vui lòng xem lại đơn hàng.`,
      };
    case "INVALID_QUANTITY":
      return { code: "INVALID_QUANTITY", message: "Số lượng không hợp lệ." };
    case "INVALID_CUSTOMER_DATA":
      return {
        code: "INVALID_CUSTOMER_DATA",
        field: detail.field,
        message: fieldMessage(detail.field),
      };
    default:
      // Unmapped/unexpected — never leak the raw code or Postgres text.
      return { code: "ORDER_CREATE_FAILED", message: "Không thể tạo đơn hàng. Vui lòng thử lại." };
  }
}

const FIELD_MESSAGES: Record<string, string> = {
  customer_name: "Vui lòng nhập họ tên.",
  customer_phone: "Số điện thoại không hợp lệ.",
  shipping_address: "Vui lòng nhập địa chỉ nhận hàng.",
  customer_email: "Địa chỉ email không hợp lệ.",
  payment_method: "Vui lòng chọn phương thức thanh toán.",
  idempotency_key: "Không thể xử lý yêu cầu, vui lòng tải lại trang.",
};

function fieldMessage(field: string | undefined): string {
  if (field && FIELD_MESSAGES[field]) {
    return FIELD_MESSAGES[field];
  }
  return "Thông tin đơn hàng không hợp lệ. Vui lòng kiểm tra lại.";
}

/** HTTP status to pair with each code — used by the Route Handler only. */
export function statusForCheckoutErrorCode(code: CheckoutErrorCode): number {
  switch (code) {
    case "PRODUCT_NOT_FOUND":
      return 404;
    case "PRODUCT_UNAVAILABLE":
    case "OUT_OF_STOCK":
    case "QUANTITY_ADJUSTMENT_REQUIRED":
    case "PRICE_CHANGED":
      return 409;
    case "INVALID_QUANTITY":
    case "INVALID_CUSTOMER_DATA":
      return 400;
    case "ORDER_CREATE_FAILED":
    default:
      return 500;
  }
}
