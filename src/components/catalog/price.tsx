import * as React from "react";

import { formatProductPrice } from "@/lib/format/money";
import { cn } from "@/lib/utils";

/**
 * Shared price display — rendered the same way everywhere (visual-
 * consistency: "Price is rendered by Price everywhere"). Wraps
 * `formatProductPrice` (the "0 → Liên hệ" rule, S4) so every price on the
 * site goes through one decision point.
 */
export interface PriceProps extends React.ComponentPropsWithoutRef<"span"> {
  amount: number;
  /** Typography role — S2.4 §5 price hierarchy. */
  role?: "card" | "lg" | "total";
}

const ROLE_CLASS: Record<NonNullable<PriceProps["role"]>, string> = {
  card: "text-price-card",
  lg: "text-price-lg",
  total: "text-price-total",
};

function Price({ amount, role = "card", className, ...props }: PriceProps) {
  const label = formatProductPrice(amount);
  return (
    <span className={cn(ROLE_CLASS[role], "whitespace-nowrap text-text", className)} {...props}>
      {label}
    </span>
  );
}

export { Price };
