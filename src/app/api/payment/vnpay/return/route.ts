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
    return NextResponse.redirect(new URL("/", request.url));
  }

  const responseCode = query.vnp_ResponseCode;
  
  if (responseCode === "00") {
    // Payment successful!
    // Since localhost cannot receive the IPN webhook from VNPAY, 
    // we proactively update the order status here as a fallback/guarantee.
    const txnRef = query.vnp_TxnRef; 
    const amount = parseInt(query.vnp_Amount || "0", 10) / 100;
    
    if (txnRef && amount > 0) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.rpc("record_storefront_online_payment", {
        p_order_number: txnRef,
        p_amount: amount,
        p_gateway: "VNPay",
        p_transaction_id: query.vnp_TransactionNo || "",
      });
    }

    return NextResponse.redirect(new URL("/dat-hang-thanh-cong?clear_cart=true", request.url));
  } else {
    // Payment cancelled or failed (e.g. 24 for Cancel, other codes for failures)
    // Redirect back to checkout page so they can retry. Cart is still intact.
    return NextResponse.redirect(new URL("/thanh-toan?error=vnpay_failed", request.url));
  }
}
