import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { CheckoutView } from "@/features/checkout/components/checkout-view";
import { getAccountData } from "@/features/account/server/get-account-data";

/**
 * `/thanh-toan` — Checkout (S7). A thin Server Component shell, same
 * pattern as `/gio-hang` (S6 §21): the heading is static, everything else
 * depends on client cart/localStorage state, so `CheckoutView` is the one
 * client boundary.
 *
 * `noindex` for the same reason as `/gio-hang` — a private, per-browser,
 * non-shareable page (`nextjs-seo`).
 *
 * Known limitation (disclosed in the S7 completion report, not silently
 * shipped): S2.4 §10.5 freezes a distinct "slim header" for checkout
 * (no commerce nav/cart/search). This page still renders inside the root
 * layout's normal `SiteHeader`/`SiteFooter` — the same header every other
 * route uses (as `/gio-hang` already does) — because a route-conditional
 * header requires restructuring the global root layout, a broader change
 * than this phase's scope.
 */
export const metadata: Metadata = {
  title: "Thanh toán",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const { user, profile } = await getAccountData();

  const initialValues = {
    customerName: profile?.name ?? user?.user_metadata?.full_name ?? "",
    customerPhone: profile?.phone ?? "",
    shippingAddress: profile?.address ?? "",
    customerEmail: profile?.email ?? user?.email ?? "",
  };

  return (
    <Container className="flex flex-col gap-6 py-8">
      <h1 className="text-h1 text-text">Thanh toán</h1>
      <CheckoutView initialValues={initialValues} />
    </Container>
  );
}
