import { cn } from "@/lib/utils";

/**
 * Loading-skeleton foundation. Uses `--color-surface-subtle` (never a raw
 * grey) and a slow, reduced-motion-safe pulse — `globals.css` already
 * collapses all animation durations under `prefers-reduced-motion` (S2.4
 * §13).
 */
function Skeleton({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-sm bg-surface-subtle", className)}
      role="presentation"
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
