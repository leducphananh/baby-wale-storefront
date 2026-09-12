import * as React from "react";

import { cn } from "@/lib/utils";

/** Textarea foundation — same rules as `Input` (S2.4 §8, §14). */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentPropsWithoutRef<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "text-input-role flex min-h-24 w-full rounded-sm border border-border bg-surface px-3 py-2",
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
Textarea.displayName = "Textarea";

export { Textarea };
