import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { CartDrawer } from "@/features/cart/components/cart-drawer";
import { env } from "@/lib/env";

import "./globals.css";

/**
 * Nunito loaded through `next/font` for the AI Studio reference UI.
 */
const bodyFont = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

/**
 * `SiteHeader` (categories for nav) renders on every route via this layout.
 * Matches the page-level tier (S4 catalog pages use `revalidate = 300`) so
 * the header's own data request isn't the thing forcing a fully dynamic
 * render — see the pages' own `revalidate` exports for the tier rationale
 * (nextjs-cache-correctness).
 */
export const revalidate = 300;

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Baby Wale",
    template: "%s | Baby Wale",
  },
  description:
    "Baby Wale — cửa hàng mẹ và bé: bỉm, sữa và đồ dùng cho bé. Đặt hàng dễ dàng, nhân viên xác nhận từng đơn trước khi xử lý.",
  applicationName: "Baby Wale",
  openGraph: {
    title: "Baby Wale — Cửa hàng Mẹ và Bé",
    description: "Baby Wale — cửa hàng mẹ và bé: bỉm, sữa và đồ dùng cho bé.",
    url: env.NEXT_PUBLIC_SITE_URL,
    siteName: "Baby Wale",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Baby Wale",
    url: env.NEXT_PUBLIC_SITE_URL,
    description: "Cửa hàng mẹ và bé: bỉm, sữa và đồ dùng cho bé.",
  };

  return (
    <html lang="vi" className={bodyFont.variable}>
      <body className="flex min-h-dvh flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CartDrawer />
      </body>
    </html>
  );
}
