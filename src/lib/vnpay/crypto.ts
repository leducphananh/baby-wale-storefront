import crypto from "crypto";
import { VNPAY_CONFIG } from "./config";

function sortObject(obj: Record<string, string | number>): Record<string, string> {
  const sorted: Record<string, string> = {};
  const str = [];
  let key;
  for (key in obj){
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    // VNPay standard encoding: encode spaces as + in the signature data
    sorted[str[key]] = encodeURIComponent(String(obj[str[key]])).replace(/%20/g, "+");
  }
  return sorted;
}

function stringifyParams(obj: Record<string, string>): string {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

export function buildPaymentUrl(params: {
  orderInfo: string;
  amount: number;
  ipAddr: string;
  txnRef: string;
  createDate: string; // YYYYMMDDHHmmss
}): string {
  const { tmnCode, hashSecret, url, returnUrl } = VNPAY_CONFIG;
  
  const rawParams: Record<string, string | number> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: params.txnRef,
    vnp_OrderInfo: params.orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: params.amount * 100, // VNPay requires amount * 100
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: params.ipAddr,
    vnp_CreateDate: params.createDate,
  };

  const sortedParams = sortObject(rawParams);
  const signData = stringifyParams(sortedParams);
  
  const hmac = crypto.createHmac("sha512", hashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  
  return `${url}?${signData}&vnp_SecureHash=${signed}`;
}

export function verifyIpnSignature(query: Record<string, string>): boolean {
  const { hashSecret } = VNPAY_CONFIG;
  const secureHash = query.vnp_SecureHash;
  
  const cleanQuery = { ...query };
  delete cleanQuery.vnp_SecureHash;
  delete cleanQuery.vnp_SecureHashType;
  
  const sorted = sortObject(cleanQuery);
  const signData = stringifyParams(sorted);
  
  const hmac = crypto.createHmac("sha512", hashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  
  return signed === secureHash;
}

export function getVNPayCreateDate(date: Date = new Date()): string {
  // Returns string format YYYYMMDDHHmmss for VNPay in Asia/Ho_Chi_Minh timezone
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
  const yyyy = tzDate.getFullYear().toString();
  const mm = (tzDate.getMonth() + 1).toString().padStart(2, '0');
  const dd = tzDate.getDate().toString().padStart(2, '0');
  const hh = tzDate.getHours().toString().padStart(2, '0');
  const min = tzDate.getMinutes().toString().padStart(2, '0');
  const ss = tzDate.getSeconds().toString().padStart(2, '0');
  return `${yyyy}${mm}${dd}${hh}${min}${ss}`;
}
