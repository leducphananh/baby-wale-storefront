import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { CartView } from "@/features/cart/components/cart-view";

/**
 * `/gio-hang` — Shopping Cart (S6). A thin Server Component shell (S6 §21):
 * the heading is static, everything else is inherently client/localStorage-
 * dependent, so it's the one client boundary (`CartView`), not the page.
 *
 * `noindex` — already disallowed in `robots.ts` (S4); the metadata flag is
 * defense in depth, matching `nextjs-seo`'s rule for cart/checkout/order
 * pages. Purely client state — no `revalidate`/cache tier applies (there is
 * no server data fetch on this route at all).
 */
export const metadata: Metadata = {
  title: "Giỏ hàng",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <Container className="flex flex-col gap-6 py-8">
      <h1 className="text-h1 text-text">Giỏ hàng</h1>
      <CartView />
    </Container>
  );
}
