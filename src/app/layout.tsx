import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { env } from "@/lib/env";

import "./globals.css";

/**
 * Be Vietnam Pro loaded through `next/font` (self-hosted, no layout-shift).
 * The typography *scale* (sizes, weights, roles) is frozen at S2.4 and
 * implemented in `globals.css` (S2.5) — this only loads the font file.
 */
const bodyFont = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={bodyFont.variable}>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
