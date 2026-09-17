import { NextResponse } from "next/server";
import { verifyIpnSignature } from "@/lib/vnpay/crypto";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());

  if (!query.vnp_SecureHash) {
    return NextResponse.json({ RspCode: "99", Message: "Missing signature" });
  }

  if (!verifyIpnSignature(query)) {
    return NextResponse.json({ RspCode: "97", Message: "Invalid signature" });
  }

  const txnRef = query.vnp_TxnRef; // Order number
  const responseCode = query.vnp_ResponseCode;
  const amount = parseInt(query.vnp_Amount || "0", 10) / 100;
  
  if (responseCode === "00") {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.rpc("record_storefront_online_payment", {
      p_order_number: txnRef,
      p_amount: amount,
      p_gateway: "VNPay",
      p_transaction_id: query.vnp_TransactionNo || "",
    });

    if (error) {
      if (error.message.includes("Order not found")) {
        return NextResponse.json({ RspCode: "01", Message: "Order not found" });
      }
      if (error.message.includes("Order status")) {
        return NextResponse.json({ RspCode: "02", Message: "Order already confirmed" });
      }
      return NextResponse.json({ RspCode: "99", Message: "Unknown error" });
    }
  }

  return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
}
