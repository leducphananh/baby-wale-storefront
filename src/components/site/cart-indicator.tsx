"use client";

import * as React from "react";

import { ShoppingBag } from "lucide-react";

import { selectCartCount, useCartStore } from "@/features/cart/store";
import { useHasHydrated } from "@/features/cart/use-has-hydrated";
import { cn } from "@/lib/utils";

/**
 * Cart badge — S2.4 §4.1 / §10.2: the count indicator is `--color-primary` +
 * white (6.02:1), never the pink accent (rejected at 4.05:1 for text). The
 * count is also present as visible text, not colour-only (S2.4 §14).
 *
 * A small `"use client"` island (cart-state rule 6) — `Header`/`SiteHeader`
 * stay a server shell. When the caller passes an explicit `count` (a number,
 * including `0`), that value is used as-is — this is what every existing
 * test does, and stays fully deterministic for them. When `count` is
 * omitted, this component reads the live cart store itself, hydration-safe
 * (`useHasHydrated`): it renders "0 / no badge" until mounted, then the real
 * count, never mismatching the server-rendered markup.
 */
export interface CartIndicatorProps extends React.ComponentPropsWithoutRef<"a"> {
  count?: number;
}

const CartIndicator = React.forwardRef<HTMLAnchorElement, CartIndicatorProps>(
  ({ count: explicitCount, className, ...props }, ref) => {
    const hasHydrated = useHasHydrated();
    const liveCount = useCartStore(selectCartCount);
    const count = explicitCount ?? (hasHydrated ? liveCount : 0);

    return (
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
    );
  },
);
CartIndicator.displayName = "CartIndicator";

export { CartIndicator };
