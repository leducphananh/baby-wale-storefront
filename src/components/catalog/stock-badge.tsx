import * as React from "react";

import { CheckCircle2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

/**
 * Shared stock badge (visual-consistency: "Availability is rendered by
 * StockBadge everywhere — same labels, text + icon, never colour-only").
 * Labels are frozen customer copy (`vietnamese-ecommerce-ui` §8) — never a
 * raw enum, never a number. `ProductCard`'s contract (S2.4 §10.1) only shows
 * this for the out-of-stock case ("no 'in stock' badge on listing cards");
 * the `inStock` variant exists here for reuse on Product Detail (S5).
 */
export interface StockBadgeProps {
  inStock: boolean;
  className?: string;
}

function StockBadge({ inStock, className }: StockBadgeProps) {
  if (inStock) {
    return (
      <Badge variant="success" icon={<CheckCircle2 className="size-3.5" aria-hidden="true" />} className={className}>
        Còn hàng
      </Badge>
    );
  }
  return (
    <Badge variant="danger" icon={<XCircle className="size-3.5" aria-hidden="true" />} className={className}>
      Hết hàng
    </Badge>
  );
}

export { StockBadge };
