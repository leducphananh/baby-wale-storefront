import * as React from "react";

import { AlertTriangle, Info, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * One recoverable checkout issue — a cart-revalidation finding
 * (`/api/cart/revalidate`) or a mapped `/api/checkout` error. Tone follows
 * S2.4 §10.4's cart-recoverable-state palette, reused here since checkout
 * shares the same three severities: `info` = price changed (blue tint,
 * "never silently charged" — CLAUDE.md/checkout-security), `warning` =
 * stock adjustment needed (amber tint), `danger` = out of stock /
 * unavailable / not found (red tint). S2.4 never froze a separate "info"
 * token — its own wording is "blue-tint", which is exactly `--color-primary`
 * at tint strength, already defined; no new token is introduced here.
 */
export type CheckoutIssueTone = "info" | "warning" | "danger";

export interface CheckoutIssueBannerProps {
  tone: CheckoutIssueTone;
  message: string;
  className?: string;
}

const TONE_STYLES: Record<CheckoutIssueTone, { container: string; icon: React.ReactNode }> = {
  info: {
    container: "bg-primary-tint text-primary",
    icon: <Info className="size-4 shrink-0" aria-hidden="true" />,
  },
  warning: {
    container: "bg-warning-bg text-warning",
    icon: <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />,
  },
  danger: {
    container: "bg-danger-bg text-danger",
    icon: <XCircle className="size-4 shrink-0" aria-hidden="true" />,
  },
};

function CheckoutIssueBanner({ tone, message, className }: CheckoutIssueBannerProps) {
  const { container, icon } = TONE_STYLES[tone];
  return (
    <div
      role="alert"
      className={cn("flex items-start gap-2 rounded-sm px-3 py-2 text-body-sm", container, className)}
    >
      {icon}
      <span>{message}</span>
    </div>
  );
}

export { CheckoutIssueBanner };
