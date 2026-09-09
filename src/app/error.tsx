"use client";

/**
 * Route-level error backstop. A Client Component by App Router contract — kept
 * tiny so it does not pull the route tree client-side. No stack trace or raw
 * error text is ever shown to the customer (storefront-error-handling).
 */
export default function RouteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-3 px-6 py-16">
      <h1 className="text-xl font-semibold">Đã xảy ra sự cố</h1>
      <p className="text-sm opacity-70">
        Xin lỗi vì sự bất tiện. Vui lòng thử lại sau giây lát.
      </p>
      <button
        type="button"
        onClick={reset}
        className="self-start rounded border px-3 py-1.5 text-sm"
      >
        Thử lại
      </button>
    </main>
  );
}
