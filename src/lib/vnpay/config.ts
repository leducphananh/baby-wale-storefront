export const VNPAY_CONFIG = {
  tmnCode: process.env.VNPAY_TMN_CODE || "",
  hashSecret: process.env.VNPAY_HASH_SECRET || "",
  url: process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/vnpay/return`,
};
