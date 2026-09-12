import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Generic flex-layout primitive. `gap` values are Tailwind's default 4px
 * spacing scale, which already equals the frozen S2.4 §6 base scale
 * (`gap-3` = 12px, `gap-4` = 16px, `gap-8` = 32px, …) — see the mapping note
 * in `globals.css`.
 */
const stackVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col",
    },
    gap: {
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      6: "gap-6",
      8: "gap-8",
      12: "gap-12",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    wrap: {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
    },
  },
  defaultVariants: {
    direction: "col",
    gap: 4,
    wrap: "nowrap",
  },
});

export interface StackProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof stackVariants> {}

function Stack({ className, direction, gap, align, justify, wrap, ...props }: StackProps) {
  return (
    <div
      className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)}
      {...props}
    />
  );
}

export { Stack };
