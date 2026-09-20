import type { Metadata } from "next";
import { ContactClientView } from "./contact-client-view";

export const metadata: Metadata = {
  title: "Liên hệ & Cửa hàng",
  description: "Liên hệ và hệ thống cửa hàng Baby Wale.",
};

export default function ContactPage() {
  return <ContactClientView />;
}
