/**
 * The approved factual trust copy — S2.4 §15, the *only* trust statements
 * until the owner supplies more. One home for this text (clean-code) so the
 * footer, homepage, and Product Detail (S5) can never drift from each other
 * or from the frozen contract. `"Hỗ trợ: [OWNER CONTENT TBD]"` keeps the
 * literal placeholder marker — never replaced with an invented channel.
 *
 * Explicitly NOT here (S2.4 §15 "NOT assumed" list): "Giao hàng toàn quốc",
 * "100% chính hãng", "Miễn phí vận chuyển", any return/exchange window, any
 * certification/guarantee/review-count/social-proof claim.
 */
export const TRUST_COPY_LINES: readonly string[] = [
  "Thanh toán khi nhận hàng (COD) hoặc chuyển khoản",
  "Nhân viên xác nhận từng đơn trước khi xử lý",
  "Hỗ trợ: [OWNER CONTENT TBD]",
];
