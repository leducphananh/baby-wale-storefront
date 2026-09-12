import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Responsive grid foundation — S2.4 §9.1 (2/3/4-column product grid) + §6
 * (frozen gap values, including the <=374px compact tier). This is a layout
 * shell only — it does not know about products; S3+ composes `ProductCard`
 * (§10.1, not built in S2.5) inside it.
 *
 * `variant="catalog"` is the frozen listing grid: 2 columns up to 767px
 * (**never** 1 column, even in the compact tier, §6), 3 at `md` (768px),
 * 4 at `lg` (1024px). `variant="auto"` is a generic responsive grid for
 * non-catalog use (e.g. a category-tile grid, §10.9) with the same gap scale
 * but no fixed column contract.
 */
const gridVariants = cva("grid", {
  variants: {
    variant: {
      catalog: "grid-cols-2 gap-x-3 gap-y-5 compact:gap-x-2.5 md:grid-cols-3 lg:grid-cols-4",
      auto: "grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4",
    },
  },
  defaultVariants: {
    variant: "catalog",
  },
});

export interface GridProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof gridVariants> {}

function Grid({ className, variant, ...props }: GridProps) {
  return <div className={cn(gridVariants({ variant }), className)} {...props} />;
}

export { Grid };
