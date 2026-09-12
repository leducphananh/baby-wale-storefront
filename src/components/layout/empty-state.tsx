import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Empty-state foundation — reused by future empty-cart / empty-search /
 * empty-order-history screens (several are S2.4 §20 spec-only). Never a
 * fabricated illustration or stock photo — an icon (Lucide or a matched
 * custom SVG, S2.4 §12) is the only decoration.
 */
export interface EmptyStateProps extends React.ComponentPropsWithoutRef<"div"> {
  icon?: React.ReactNode;
  title: string;
  /**
   * Heading level for `title` (default `"h2"`, for use inside an already-
   * headed page/section, e.g. an empty cart). Pass `"h1"` when this is the
   * page's only heading (e.g. a full-page 404) — S2.4 §14 logical DOM order.
   */
  titleAs?: "h1" | "h2" | "h3";
  description?: string;
  action?: React.ReactNode;
}

function EmptyState({
  icon,
  title,
  titleAs: Title = "h2",
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-md bg-surface-subtle px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="mb-2 text-text-muted" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <Title className="text-h3 text-text">{title}</Title>
      {description ? <p className="text-body-sm max-w-sm text-text-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export { EmptyState };
