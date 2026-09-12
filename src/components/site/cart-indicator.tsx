import * as React from "react";

import { ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Cart badge — S2.4 §4.1 / §10.2: the count indicator is `--color-primary` +
 * white (6.02:1), never the pink accent (rejected at 4.05:1 for text). The
 * count is also present as visible text, not colour-only (S2.4 §14).
 */
export interface CartIndicatorProps extends React.ComponentPropsWithoutRef<"a"> {
  count?: number;
}

const CartIndicator = React.forwardRef<HTMLAnchorElement, CartIndicatorProps>(
  ({ count = 0, className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "sm-target relative inline-flex size-11 items-center justify-center rounded-sm text-text",
        "hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        className,
      )}
      aria-label={count > 0 ? `Giỏ hàng, ${count} sản phẩm` : "Giỏ hàng"}
      {...props}
    >
      <ShoppingBag className="size-6" aria-hidden="true" />
      {count > 0 ? (
        <span
          className="text-caption absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-semibold text-white"
          aria-hidden="true"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </a>
  ),
);
CartIndicator.displayName = "CartIndicator";

export { CartIndicator };
