import { z } from "zod";

/** Canonical Vietnamese mobile shape — matches `create_storefront_order()` exactly. */
export const vietnamesePhoneRegex = /^0[0-9]{9}$/;

/**
 * Normalizes a Vietnamese mobile number to canonical `0XXXXXXXXX`. One pure,
 * unit-tested function shared by the client schema and mirrored by the RPC
 * (`react-hook-form-zod` rule 2) — strips everything but digits/`+`, folds a
 * leading `+84`/`84` to a local `0`-prefixed number.
 */
export function normalizeVietnamesePhone(raw: string): string {
  let digits = raw.replace(/[^0-9+]/g, "");
  if (digits.startsWith("+84")) {
    digits = "0" + digits.slice(3);
  } else if (digits.startsWith("84") && digits.length === 11) {
    digits = "0" + digits.slice(2);
  }
  return digits;
}

/** The interactive checkout form — customer/shipping/payment fields only. */
export const checkoutFormSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập họ tên.")
    .max(200, "Họ tên quá dài."),
  customerPhone: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập số điện thoại.")
    .transform(normalizeVietnamesePhone)
    .refine((value) => vietnamesePhoneRegex.test(value), "Số điện thoại không hợp lệ."),
  shippingAddress: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập địa chỉ nhận hàng.")
    .max(500, "Địa chỉ quá dài."),
  customerEmail: z
    .union([z.email("Địa chỉ email không hợp lệ."), z.literal("")])
    .optional(),
  note: z.string().trim().max(500, "Ghi chú quá dài.").optional(),
  paymentMethod: z.enum(["cod", "bank_transfer"], "Vui lòng chọn phương thức thanh toán."),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const checkoutItemSchema = z.object({
  productId: z.uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().min(1),
});

/** The full `/api/checkout` request body — form fields + cart lines + idempotency key. */
export const checkoutRequestSchema = checkoutFormSchema.extend({
  items: z.array(checkoutItemSchema).min(1, "Giỏ hàng đang trống."),
  idempotencyKey: z.uuid(),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

const revalidateLineSchema = z.object({
  productId: z.uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().min(1),
  cachedUnitPrice: z.number().nonnegative(),
});

/** The `/api/cart/revalidate` request body. */
export const revalidateRequestSchema = z.object({
  items: z.array(revalidateLineSchema).min(1),
});

export type RevalidateRequest = z.infer<typeof revalidateRequestSchema>;
