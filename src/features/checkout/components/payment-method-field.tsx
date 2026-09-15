import * as React from "react";

import { Check } from "lucide-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/features/checkout/types";

/**
 * `PaymentRow` (S2.4 §10.6, frozen): selected state = border + radio + tint
 * + check — never colour alone. MVP methods only: COD and bank transfer
 * (CLAUDE.md — no payment gateway, no online payment). No fake
 * payment-success state anywhere in this component.
 */
export interface PaymentMethodFieldProps {
  value: PaymentMethod | undefined;
  onChange: (value: PaymentMethod) => void;
  error?: string;
  id: string;
  "aria-describedby"?: string;
}

const OPTIONS: { value: PaymentMethod; label: string; description: string }[] = [
  {
    value: "cod",
    label: "Thanh toán khi nhận hàng (COD)",
    description: "Thanh toán bằng tiền mặt khi nhận hàng.",
  },
  {
    value: "bank_transfer",
    label: "Chuyển khoản ngân hàng",
    description: "Nhân viên sẽ liên hệ để cung cấp thông tin chuyển khoản.",
  },
];

function PaymentMethodField({ value, onChange, id, ...ariaProps }: PaymentMethodFieldProps) {
  return (
    <RadioGroup
      id={id}
      value={value}
      onValueChange={(next) => onChange(next as PaymentMethod)}
      className="gap-3"
      {...ariaProps}
    >
      {OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors",
              selected ? "border-primary bg-primary-tint" : "border-border bg-surface",
            )}
          >
            <RadioGroupItem value={option.value} className="mt-0.5" />
            <span className="flex-1">
              <span className="flex items-center gap-1.5 text-body font-medium text-text">
                {option.label}
                {selected ? <Check className="size-4 text-primary" aria-hidden="true" /> : null}
              </span>
              <span className="block text-body-sm text-text-muted">{option.description}</span>
            </span>
          </label>
        );
      })}
    </RadioGroup>
  );
}

export { PaymentMethodField };
