import { NextResponse } from "next/server";
import { verifyIpnSignature } from "@/lib/vnpay/crypto";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());

  if (!query.vnp_SecureHash) {
    return NextResponse.redirect(new URL("/loi-thanh-toan", request.url));
  }

  const isValid = verifyIpnSignature(query);
  if (!isValid) {
    // Invalid signature, could be tampered
    // We redirect to tracking or a generic page. We'll use the root or tracking.
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Regardless of success or failure, we redirect the customer to the success page.
  // The success page will read from sessionStorage to display the order.
  // The backend IPN will handle the actual payment status update.
  return NextResponse.redirect(new URL("/dat-hang-thanh-cong", request.url));
}
