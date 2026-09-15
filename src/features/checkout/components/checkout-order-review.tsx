import Link from "next/link";

import { Price } from "@/components/catalog/price";
import type { CartLine } from "@/features/cart/store";

/**
 * Collapsed, read-only order review (S2.4 §10.5: "collapsed order summary"
 * near the top of the single-page checkout). Editing quantity/removing a
 * line is deliberately out of scope here — "Chỉnh sửa giỏ hàng" sends the
 * customer back to `/gio-hang`, the one place that already owns cart-editing
 * logic (no duplicated cart-mutation UI, `cart-state`).
 */
export interface CheckoutOrderReviewProps {
  lines: CartLine[];
}

function CheckoutOrderReview({ lines }: CheckoutOrderReviewProps) {
  return (
    <section aria-labelledby="checkout-order-review-heading" className="rounded-md border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <h2 id="checkout-order-review-heading" className="text-h3 text-text">
          Đơn hàng của bạn
        </h2>
        <Link href="/gio-hang" className="text-body-sm text-primary hover:underline">
          Chỉnh sửa giỏ hàng
        </Link>
      </div>

      <ul className="mt-3 flex flex-col divide-y divide-border">
        {lines.map((line) => (
          <li key={line.productId} className="flex items-center justify-between gap-3 py-2">
            <div className="min-w-0">
              <p className="truncate text-body-sm text-text">{line.name}</p>
              <p className="text-caption text-text-muted">
                {line.quantity} {line.unit} × <Price amount={line.cachedUnitPrice} treatZeroAsUnavailable={false} />
              </p>
            </div>
            <Price
              amount={line.quantity * line.cachedUnitPrice}
              treatZeroAsUnavailable={false}
              className="shrink-0 font-medium"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export { CheckoutOrderReview };
