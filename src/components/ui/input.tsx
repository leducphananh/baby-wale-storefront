import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Input foundation — S2.4 §8 (44px min field height), §14 (error = text +
 * visual cue, never colour alone — pass `aria-invalid` and pair it with a
 * visible error message via `FormField`, not this component alone).
 * Placeholder is decorative only; always render a `Label` above this field.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "text-input-role flex h-11 w-full rounded-sm border border-border bg-surface px-3",
        "text-text placeholder:text-text-muted",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-[invalid=true]:border-danger",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
