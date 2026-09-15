"use client";

import * as React from "react";

import { Trash2 } from "lucide-react";

import { Price } from "@/components/catalog/price";
import { ProductImage } from "@/components/catalog/product-image";
import { QuantitySelector } from "@/components/catalog/quantity-selector";
import type { CartLine } from "@/features/cart/store";
import { useCartStore } from "@/features/cart/store";

/**
 * One cart line — S6 §9: image/placeholder, name, unit, unit price,
 * quantity controls, line subtotal, remove action. Two rows on every
 * viewport (details row, then controls row) rather than one packed row —
 * this is what keeps 320px readable without horizontal scroll (S6 §11/§23),
 * not a desktop layout merely shrunk.
 *
 * Quantity: typed input and the "+"/"-" buttons above the floor all go
 * through `setQuantity` (whatever integer `QuantitySelector` computes).
 * Pressing "-" exactly at quantity 1 is wired to the store's
 * `decrementQuantity` instead (`onDecrementBelowMin`) — that's the one case
 * `setQuantity` can't express correctly (it would just clamp back to 1,
 * silently discarding the customer's "remove this" intent); this store
 * action is the one place that business rule is expressed.
 */
export interface CartItemRowProps {
  line: CartLine;
}

function CartItemRow({ line }: CartItemRowProps) {
  const setQuantity = useCartStore((state) => state.setQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <li className="flex gap-3 border-b border-border py-4 last:border-b-0">
      <div className="w-20 shrink-0 sm:w-24">
        <ProductImage imageUrl={line.imageUrl} name={line.name} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-product-card-name line-clamp-2 text-text">{line.name}</p>
            {line.unit ? <p className="text-caption text-text-muted">{line.unit}</p> : null}
            <Price amount={line.cachedUnitPrice} role="card" className="mt-1 block" />
          </div>

          <button
            type="button"
            onClick={() => removeItem(line.productId)}
            aria-label={`Xóa ${line.name} khỏi giỏ hàng`}
            className="sm-target flex size-9 shrink-0 items-center justify-center rounded-sm text-text-muted hover:bg-danger-bg hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <QuantitySelector
            value={line.quantity}
            onChange={(quantity) => setQuantity(line.productId, quantity)}
            onDecrementBelowMin={() => decrementQuantity(line.productId)}
            itemLabel={line.name}
          />
          <Price
            amount={line.quantity * line.cachedUnitPrice}
            role="card"
            treatZeroAsUnavailable={false}
            className="font-semibold"
          />
        </div>
      </div>
    </li>
  );
}

export { CartItemRow };
