import { Price } from "@/components/catalog/price";
import { Separator } from "@/components/ui/separator";
import type { OrderDetail, PaymentMethod } from "@/features/checkout/types";

/**
 * The read-only order view shared by the success page and the tracking
 * result (S2.1 §11.2: "renders the same read-only order view as the
 * success page"). Every figure comes straight from `OrderDetail` — the
 * order's own historical snapshot — never re-derived or re-fetched from the
 * current catalog (S8 §10/§12: tracking is a historical, read-only view).
 */
export interface OrderDetailViewProps {
  order: OrderDetail;
}

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  bank_transfer: "Chuyển khoản ngân hàng",
};

/**
 * S2.1 §12.2 (locked): a specific payment helper line per method, never a
 * paid/unpaid badge or "Đã thanh toán" claim at any point. Bank details
 * themselves are a still-unresolved stakeholder input (CLAUDE.md O8) — the
 * helper says a memo/confirmation step, not fabricated account numbers.
 */
const PAYMENT_METHOD_HELPER: Record<PaymentMethod, string> = {
  cod: "Bạn thanh toán bằng tiền mặt cho nhân viên khi nhận hàng.",
  bank_transfer:
    "Thông tin chuyển khoản sẽ được cửa hàng cung cấp khi xác nhận đơn. Nội dung chuyển khoản ghi mã đơn. Cửa hàng xác nhận khi nhận được thanh toán.",
};

/** S2.1 §12.1 (locked) — the only status that needs an extra helper line. */
const CANCELLED_LABEL = "Đã huỷ";

function OrderDetailView({ order }: OrderDetailViewProps) {
  return (
    <div className="flex w-full flex-col gap-6 text-left">
      <div>
        <p className="text-body-sm text-text-muted">Mã đơn hàng</p>
        <p className="text-h3 text-text">{order.orderNumber}</p>
      </div>

      <div aria-live="polite">
        <p className="text-body font-medium text-text">{order.status}</p>
        {order.status === CANCELLED_LABEL ? (
          <p className="text-body-sm text-text-muted">Vui lòng liên hệ cửa hàng nếu bạn cần hỗ trợ.</p>
        ) : null}
      </div>

      <div>
        <p className="text-body font-medium text-text">{PAYMENT_METHOD_LABEL[order.paymentMethod]}</p>
        <p className="text-body-sm text-text-muted">{PAYMENT_METHOD_HELPER[order.paymentMethod]}</p>
      </div>

      <div>
        <h2 className="text-h3 text-text">Sản phẩm</h2>
        <ul className="mt-2 flex flex-col divide-y divide-border">
          {order.items.map((item, index) => (
            // Items have no stable id from the RPC — index is safe here,
            // this list is never reordered/mutated client-side.
            <li key={index} className="flex items-center justify-between gap-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-body-sm text-text">{item.productName}</p>
                <p className="text-caption text-text-muted">
                  {item.quantity} × <Price amount={item.unitPrice} treatZeroAsUnavailable={false} />
                </p>
              </div>
              <Price amount={item.lineTotal} treatZeroAsUnavailable={false} className="shrink-0 font-medium" />
            </li>
          ))}
        </ul>
      </div>

      {order.note ? (
        <div>
          <p className="text-body-sm text-text-muted">Ghi chú</p>
          <p className="text-body-sm text-text">{order.note}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-text-muted">Tạm tính (hàng hoá)</span>
          <Price amount={order.subtotal} treatZeroAsUnavailable={false} />
        </div>
        <p className="text-caption text-text-muted">Phí vận chuyển: Nhân viên sẽ xác nhận</p>

        <Separator className="my-1" />

        <div className="flex items-center justify-between">
          <span className="text-body font-medium text-text">Tổng tiền hàng</span>
          <Price amount={order.total} role="total" treatZeroAsUnavailable={false} />
        </div>
      </div>
    </div>
  );
}

export { OrderDetailView, PAYMENT_METHOD_LABEL };
