"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { checkoutFormSchema, type CheckoutFormValues } from "@/features/checkout/schema";
import { PaymentMethodField } from "@/features/checkout/components/payment-method-field";

/**
 * Contact/shipping/payment fields (S2.4 §10.5's single-page checkout body).
 * Client Zod here is UX only — the Route Handler re-validates the same
 * shape, and `create_storefront_order()` is the real authority
 * (`react-hook-form-zod`). Submit stays in-flow, no sticky bottom bar
 * (§10.5 — unlike Cart's always-sticky mobile CTA).
 */
export interface CheckoutFormProps {
  onSubmit: (values: CheckoutFormValues) => void | Promise<void>;
  submitting: boolean;
  /** Field-level error surfaced from a server response (INVALID_CUSTOMER_DATA). */
  serverFieldError?: { field?: string; message: string };
}

function CheckoutForm({ onSubmit, submitting, serverFieldError }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      shippingAddress: "",
      customerEmail: "",
      note: "",
      paymentMethod: "cod",
    },
  });

  const serverFieldKey = mapServerFieldToFormField(serverFieldError?.field);
  React.useEffect(() => {
    if (serverFieldKey && serverFieldError) {
      setError(serverFieldKey, { type: "server", message: serverFieldError.message });
    }
  }, [serverFieldKey, serverFieldError, setError]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <fieldset disabled={submitting} className="flex flex-col gap-5">
        <FormField label="Họ và tên" required error={errors.customerName?.message}>
          {(field) => <Input {...field} {...register("customerName")} autoComplete="name" />}
        </FormField>

        <FormField label="Số điện thoại" required error={errors.customerPhone?.message}>
          {(field) => <Input {...field} {...register("customerPhone")} type="tel" autoComplete="tel" />}
        </FormField>

        <FormField label="Địa chỉ nhận hàng" required error={errors.shippingAddress?.message}>
          {(field) => (
            <Textarea {...field} {...register("shippingAddress")} autoComplete="street-address" rows={3} />
          )}
        </FormField>

        <FormField label="Email" hint="Không bắt buộc" error={errors.customerEmail?.message}>
          {(field) => <Input {...field} {...register("customerEmail")} type="email" autoComplete="email" />}
        </FormField>

        <FormField label="Ghi chú" hint="Không bắt buộc" error={errors.note?.message}>
          {(field) => <Textarea {...field} {...register("note")} rows={2} />}
        </FormField>

        <FormField label="Phương thức thanh toán" required error={errors.paymentMethod?.message}>
          {(field) => (
            <Controller
              control={control}
              name="paymentMethod"
              render={({ field: controllerField }) => (
                <PaymentMethodField
                  id={field.id}
                  aria-describedby={field["aria-describedby"]}
                  value={controllerField.value}
                  onChange={controllerField.onChange}
                />
              )}
            />
          )}
        </FormField>

        <Button type="submit" size="lg" loading={submitting} className="mt-2">
          {submitting ? "Đang xử lý…" : "Đặt hàng"}
        </Button>
      </fieldset>
    </form>
  );
}

function mapServerFieldToFormField(field: string | undefined): keyof CheckoutFormValues | undefined {
  switch (field) {
    case "customer_name":
      return "customerName";
    case "customer_phone":
      return "customerPhone";
    case "shipping_address":
      return "shippingAddress";
    case "customer_email":
      return "customerEmail";
    case "payment_method":
      return "paymentMethod";
    default:
      return undefined;
  }
}

export { CheckoutForm };
