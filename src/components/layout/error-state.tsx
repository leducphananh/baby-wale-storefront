import * as React from "react";

import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Error-presentation foundation — the danger tint, never a full-page red
 * treatment (S2.4 §10.4's "no whole-page red" rule generalizes here). Used
 * by `app/error.tsx` and any future recoverable-error surface
 * (storefront-error-handling); never shows a raw error message or stack.
 */
export interface ErrorStateProps extends React.ComponentPropsWithoutRef<"div"> {
  title: string;
  /** Heading level for `title` (default `"h2"`) — see `EmptyState`'s `titleAs`. */
  titleAs?: "h1" | "h2" | "h3";
  description?: string;
  action?: React.ReactNode;
}

function ErrorState({
  title,
  titleAs: Title = "h2",
  description,
  action,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-md bg-danger-bg px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      <AlertTriangle className="mb-2 size-8 text-danger" aria-hidden="true" />
      <Title className="text-h3 text-text">{title}</Title>
      {description ? <p className="text-body-sm max-w-sm text-text-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export { ErrorState };
