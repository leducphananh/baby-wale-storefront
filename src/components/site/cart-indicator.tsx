"use client";

import * as React from "react";
import Link from "next/link";
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
export interface CartIndicatorProps extends Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> {
  count?: number;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const CartIndicator = React.forwardRef<HTMLElement, CartIndicatorProps>(
  ({ count: explicitCount, className, href, onClick, ...props }, ref) => {
    const hasHydrated = useHasHydrated();
    const liveCount = useCartStore(selectCartCount);
    const count = explicitCount ?? (hasHydrated ? liveCount : 0);

    const classes = cn(
      "relative p-2.5 sm:px-3.5 sm:py-2 bg-primary text-primary-foreground hover:bg-primary-hover rounded-2xl flex items-center gap-2 transition-transform active:scale-95 shadow-sm",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus cursor-pointer",
      className,
    );

    const ariaLabel = count > 0 ? `Giỏ hàng, ${count} sản phẩm` : "Giỏ hàng";
    const content = (
      <>
        <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
        <span className="hidden sm:inline font-bold text-xs">Giỏ hàng</span>
        <span
          className="bg-secondary text-secondary-foreground font-black text-xs px-2 py-0.5 rounded-full shadow-xs"
          aria-hidden="true"
        >
          {count > 99 ? "99+" : count}
        </span>
      </>
    );

    if (href) {
      return (
        <Link ref={ref as any} href={href} className={classes} aria-label={ariaLabel} onClick={onClick} {...props}>
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref as any} className={classes} aria-label={ariaLabel} onClick={onClick} {...props as any}>
        {content}
      </button>
    );
  },
);
CartIndicator.displayName = "CartIndicator";

export { CartIndicator };
