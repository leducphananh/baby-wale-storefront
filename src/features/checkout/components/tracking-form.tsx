"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { trackingFormSchema, type TrackingFormValues } from "@/features/checkout/tracking";

/**
 * S2.1 §11.2 (locked): one field, "Nhập mã theo dõi hoặc dán liên kết theo
 * dõi đơn hàng", submit "Tra cứu". Client Zod is UX only — the Route
 * Handler re-validates (`react-hook-form-zod`).
 */
export interface TrackingFormProps {
  onSubmit: (values: TrackingFormValues) => void | Promise<void>;
  loading: boolean;
  defaultValue?: string;
}

function TrackingForm({ onSubmit, loading, defaultValue }: TrackingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingFormSchema),
    defaultValues: { trackingInput: defaultValue ?? "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <fieldset disabled={loading} className="flex flex-col gap-4">
        <FormField
          label="Mã theo dõi đơn hàng"
          hint="Nhập mã theo dõi hoặc dán liên kết theo dõi đơn hàng"
          error={errors.trackingInput?.message}
        >
          {(field) => <Input {...field} {...register("trackingInput")} autoComplete="off" />}
        </FormField>

        <Button type="submit" size="lg" loading={loading}>
          {loading ? "Đang tra cứu…" : "Tra cứu"}
        </Button>
      </fieldset>
    </form>
  );
}

export { TrackingForm };
