import * as React from "react";

import { formatProductPrice, formatVnd } from "@/lib/format/money";
import { cn } from "@/lib/utils";

/**
 * Shared price display — rendered the same way everywhere (visual-
 * consistency: "Price is rendered by Price everywhere"). By default wraps
 * `formatProductPrice` (the "0 → Liên hệ" rule, S4) so every *product*
 * price on the site goes through one decision point.
 */
export interface PriceProps extends React.ComponentPropsWithoutRef<"span"> {
  amount: number;
  /** Typography role — S2.4 §5 price hierarchy. */
  role?: "card" | "lg" | "total";
  /**
   * `false` for an aggregate (a cart/order subtotal) rather than a single
   * product's listed price — `money.ts` is explicit that the "0 → Liên hệ"
   * rule is a per-product presentation choice and "does not apply to
   * `formatVnd` generally: a genuine 0 cart/order total must never say
   * 'Liên hệ'". Defaults `true`, so every existing call site (ProductCard,
   * Product Detail, …) is unaffected.
   */
  treatZeroAsUnavailable?: boolean;
}

const ROLE_CLASS: Record<NonNullable<PriceProps["role"]>, string> = {
  card: "font-extrabold text-sm sm:text-base text-primary",
  lg: "text-2xl sm:text-3xl font-black text-primary",
  total: "text-lg sm:text-xl font-bold text-primary",
};

function Price({ amount, role = "card", treatZeroAsUnavailable = true, className, ...props }: PriceProps) {
  const label = treatZeroAsUnavailable ? formatProductPrice(amount) : formatVnd(amount);
  return (
    <span className={cn(ROLE_CLASS[role], "whitespace-nowrap text-text", className)} {...props}>
      {label}
    </span>
  );
}

export { Price };
