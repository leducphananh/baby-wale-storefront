import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Section heading foundation (`--type-h2`, S2.4 §5) — an optional trailing
 * action (e.g. a future "Xem tất cả" link) never outranks the heading
 * visually; it uses the `ghost` button/link treatment, not a competing CTA.
 */
export interface SectionHeadingProps extends React.ComponentPropsWithoutRef<"div"> {
  title: string;
  action?: React.ReactNode;
}

function SectionHeading({ title, action, className, ...props }: SectionHeadingProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)} {...props}>
      <h2 className="text-h2 text-text">{title}</h2>
      {action}
    </div>
  );
}

export { SectionHeading };
