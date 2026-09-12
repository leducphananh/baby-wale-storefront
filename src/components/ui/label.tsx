import * as React from "react";

import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

/**
 * Visible label foundation — S2.4 §14: every field has a label ABOVE it,
 * always visible. Placeholder text is never a substitute (design-system).
 */
const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn("text-label-role mb-1 block text-text", className)}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
