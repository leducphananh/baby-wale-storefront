import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Button foundation — S2.4 §8 (control sizing), §14 (accessibility),
 * §3 ("one primary CTA colour, everywhere, always" — the frozen restraint
 * rule, §4.2). `primary` is the only solid brand-colour button; `accent`
 * (pink) is intentionally NOT a variant here — pink never competes with the
 * primary CTA (design-system, storefront-ui-design).
 *
 * Sizes map to the frozen heights: `lg` = 48px primary button, `md` = 40px
 * secondary/compact button, `sm` = 36px *visual* height with the hit area
 * expanded to the required >=44x44 critical touch target via `sm-target`.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-sm text-button-role",
    "transition-colors disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-pressed",
        secondary:
          "border border-border bg-surface text-text hover:bg-surface-subtle active:bg-surface-subtle",
        ghost: "bg-transparent text-primary hover:bg-primary-tint active:bg-primary-tint",
      },
      size: {
        lg: "h-12 px-6",
        md: "h-10 px-4",
        sm: "sm-target h-9 px-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render the styling onto the single child element instead of a `<button>`
   * (e.g. a `Link`). Not intended to combine with `loading` — an `asChild`
   * link takeover has nothing to spin.
   */
  asChild?: boolean;
  /** Shows a spinner and sets `aria-busy`; the button stays disabled while true. */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, disabled, children, ...props },
    ref,
  ) => {
    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
        >
          {children}
        </Slot>
      );
    }
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
