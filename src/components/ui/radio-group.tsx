import * as React from "react";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Radio-group foundation — used later for `PaymentRow` (S2.4 §10.6), whose
 * selected state is frozen as border + radio + tint + check, never colour
 * alone. This primitive establishes the accessible radio control; the
 * bordered/tinted "row" wrapper is composed by the caller (e.g. a future
 * `PaymentRow` in the checkout phase) using the same selected-state classes
 * shown in the Storybook-less example below — kept out of this file since
 * `PaymentRow` itself is commerce scope, not S2.5.
 */
const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn("flex flex-col gap-2", className)} {...props} />
));
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "flex size-5 items-center justify-center rounded-full border border-border bg-surface",
      "data-[state=checked]:border-primary",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator>
      <Circle className="size-2.5 fill-primary text-primary" aria-hidden="true" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
