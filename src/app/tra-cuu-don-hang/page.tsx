import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { TrackingView } from "@/features/checkout/components/tracking-view";

interface TrackingPageProps {
  searchParams: Promise<{ token?: string }>;
}

/**
 * `/tra-cuu-don-hang` — Order Tracking (S8, S2.1 §11.2). A thin Server
 * Component shell; the lookup itself is entirely client-driven (a form
 * submit or an auto-lookup from a pasted `?token=` link), so `TrackingView`
 * is the one client boundary. `noindex` — S2.1 explicitly lists tracking
 * alongside cart/checkout/success as non-indexable (§19.9 SEO note); a
 * `?token=` URL is also per-customer, non-shareable-as-a-generic-page
 * content.
 */
export const metadata: Metadata = {
  title: "Tra cứu đơn hàng",
  description: "Nhập mã theo dõi hoặc dán liên kết theo dõi để kiểm tra tình trạng đơn hàng.",
  robots: { index: false, follow: false },
};

export default async function TrackingPage({ searchParams }: TrackingPageProps) {
  const params = await searchParams;

  return (
    <Container className="flex flex-col gap-6 py-8">
      <div>
        <h1 className="text-h1 text-text">Tra cứu đơn hàng</h1>
        <p className="text-body-sm text-text-muted">
          Nhập mã theo dõi hoặc dán liên kết theo dõi đơn hàng bạn đã lưu để kiểm tra tình trạng đơn hàng.
        </p>
      </div>
      <TrackingView initialToken={params.token} />
    </Container>
  );
}
