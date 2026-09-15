import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { OrderSuccessView } from "@/features/checkout/components/order-success-view";

/**
 * `/dat-hang-thanh-cong` — Order Success (S7). A thin Server Component
 * shell; the confirmation itself only exists in `sessionStorage` right
 * after checkout, so `OrderSuccessView` is the one client boundary.
 *
 * `noindex` — a private, per-order, non-shareable-by-URL page (the tracking
 * link a customer might share is a distinct, explicit token URL construct
 * inside `OrderSuccessView`, not this page's own URL — `nextjs-seo`).
 */
export const metadata: Metadata = {
  title: "Đặt hàng thành công",
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage() {
  return (
    <Container className="flex flex-col gap-6 py-8">
      <OrderSuccessView />
    </Container>
  );
}
