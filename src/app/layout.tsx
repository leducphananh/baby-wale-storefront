import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import { env } from "@/lib/env";

import "./globals.css";

/**
 * Technical font foundation only — a clean, Vietnamese-capable sans loaded
 * through `next/font` (self-hosted, no layout-shift). The typography *scale*
 * (sizes, weights, roles) is defined at S2.4 Design Approval, not here.
 */
const bodyFont = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Baby Wale",
    template: "%s | Baby Wale",
  },
  description:
    "Baby Wale — cửa hàng mẹ và bé: bỉm, sữa và đồ dùng cho bé. Trang đang được xây dựng.",
  applicationName: "Baby Wale",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={bodyFont.variable}>
      <body>{children}</body>
    </html>
  );
}
