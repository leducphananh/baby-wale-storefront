"use client";

import { Container } from "@/components/layout/container";
import { ErrorState } from "@/components/layout/error-state";
import { Button } from "@/components/ui/button";

/**
 * Route-level error backstop. A Client Component by App Router contract — kept
 * tiny so it does not pull the route tree client-side. No stack trace or raw
 * error text is ever shown to the customer (storefront-error-handling).
 * Restyled on the S2.4 design system (S2.5) — still no business logic.
 */
export default function RouteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // A plain <div>, not <main> — this renders inside the root layout's
  // <main> (error.tsx is a sibling of page.tsx at the same route segment,
  // and the parent layout still wraps it), so a second <main> here would
  // be an invalid nested landmark (accessibility).
  return (
    <div className="flex min-h-[60dvh] flex-col justify-center bg-bg py-16">
      <Container className="max-w-xl">
        <ErrorState
          titleAs="h1"
          title="Đã xảy ra sự cố"
          description="Xin lỗi vì sự bất tiện. Vui lòng thử lại sau giây lát."
          action={
            <Button variant="primary" onClick={reset}>
              Thử lại
            </Button>
          }
        />
      </Container>
    </div>
  );
}
