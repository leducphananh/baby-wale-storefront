/**
 * One shared VND formatter (vietnamese-ecommerce-ui: "integer VND, formatted
 * with thousands separators via one shared `formatVnd()`-style utility —
 * never manually formatted per component"). Pure presentation — the
 * authoritative amount always comes from the server/DB (CLAUDE.md §6).
 *
 * Deliberately does **not** decide what a `0` amount means — a genuine free
 * line total (future cart/checkout) and an unpriced product (§ below) are
 * different situations, and conflating them here would make a future $0
 * total silently say "Liên hệ". See `formatProductPrice` for the
 * product-selling-price-specific rule.
 */
export function formatVnd(amountVnd: number): string {
  return `${Math.round(amountVnd).toLocaleString("vi-VN")} ₫`;
}

/**
 * Product selling-price presentation (S4 decision, documented — not derived
 * from any prior approved copy, since this is the first phase that renders
 * a price). The real catalog currently has `selling_price = 0` for
 * essentially every product (S3 completion report §14) — a pre-existing
 * data-entry gap, not a real "free" price. Silently rendering "0 ₫" would
 * read as a real, absurd price to a customer. `0` is therefore presented as
 * **"Liên hệ"** ("contact us") rather than a price, which is truthful (no
 * price has actually been set) and standard Vietnamese retail convention for
 * an unpriced listing. This is a presentation rule only — it changes
 * nothing about the authoritative `selling_price` value itself, and does not
 * apply to `formatVnd` generally (a genuine `0` cart/order total must never
 * say "Liên hệ").
 */
export function formatProductPrice(sellingPriceVnd: number): string {
  if (sellingPriceVnd <= 0) {
    return "Liên hệ";
  }
  return formatVnd(sellingPriceVnd);
}
