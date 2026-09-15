import { Price } from "@/components/catalog/price";
import { Separator } from "@/components/ui/separator";

/**
 * Checkout totals — same frozen terminology as `CartSummary` (S2.4 §10.4,
 * reused at §10.5's "review" step): "Tạm tính (hàng hoá)", "Phí vận chuyển:
 * Nhân viên sẽ xác nhận" (plain text, not a value), "Tổng tiền hàng" (never
 * "Tổng thanh toán" while shipping stays unresolved — CLAUDE.md §8). No CTA
 * here — the page's own submit button is the only checkout action.
 */
export interface CheckoutSummaryProps {
  subtotal: number;
  className?: string;
}

function CheckoutSummary({ subtotal, className }: CheckoutSummaryProps) {
  return (
    <div className={className}>
      <h2 className="text-h3 text-text">Tóm tắt đơn hàng</h2>

      <div className="mt-4 flex flex-col gap-2" aria-live="polite">
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-text-muted">Tạm tính (hàng hoá)</span>
          <Price amount={subtotal} role="card" treatZeroAsUnavailable={false} />
        </div>
        <p className="text-caption text-text-muted">Phí vận chuyển: Nhân viên sẽ xác nhận</p>

        <Separator className="my-1" />

        <div className="flex items-center justify-between">
          <span className="text-body font-medium text-text">Tổng tiền hàng</span>
          <Price amount={subtotal} role="total" treatZeroAsUnavailable={false} />
        </div>
      </div>
    </div>
  );
}

export { CheckoutSummary };
