import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Status / badge foundation — S2.4 §4.1 ("Frozen consequences") and §14.
 *
 * Any badge/chip/pill carrying text or a numeral must clear >=4.5:1, so every
 * variant here is a TINT background + matching dark text (never a solid
 * colour fill with white text — that rule is what rejected the pink cart
 * badge in S2.3R). Status is never colour-only: pass an `icon` so the
 * distinction also reads by shape, per the accessibility contract (§14).
 *
 * `neutral` and `info` are safe general-purpose tags. `accent` (pink
 * tint + berry text, 8.93:1) is available for small *decorative* tags only —
 * never for a count/numeral, and never the solid `--color-accent` fill,
 * which fails contrast for text (§4.1).
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-xs px-2 py-1 text-caption font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-surface-subtle text-text",
        info: "bg-primary-tint text-primary-pressed",
        success: "bg-success-bg text-success",
        warning: "bg-warning-bg text-warning",
        danger: "bg-danger-bg text-danger",
        accent: "bg-accent-tint text-accent-text",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** A small Lucide icon reinforcing the status by shape, not colour alone. */
  icon?: React.ReactNode;
}

function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
