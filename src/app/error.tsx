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
  return (
    <main className="flex min-h-dvh flex-col justify-center bg-bg py-16">
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
    </main>
  );
}
