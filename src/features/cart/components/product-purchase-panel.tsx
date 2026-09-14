"use client";

import * as React from "react";

import { QuantitySelector } from "@/components/catalog/quantity-selector";
import { Price } from "@/components/catalog/price";
import { StockBadge } from "@/components/catalog/stock-badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";

/**
 * Product Detail purchase panel — quantity + "Thêm vào giỏ", plus the
 * frozen sticky-mobile-bar behaviour (S2.4 §10.3/§9.2): the bottom bar
 * appears **only** once the in-flow CTA scrolls out of view (tracked via
 * `IntersectionObserver` on the real in-flow button, not a guessed scroll
 * offset), and never coexists with it — by construction, exactly one of
 * the two is ever rendered. One shared `quantity` state serves both, so
 * there is never a second, disagreeing quantity for the same product.
 *
 * Out-of-stock: the button stays visible, disabled, and labelled "Hết
 * hàng" (never hidden) — S2.4 §10.3's OOS variant.
 *
 * Only `productId`/`slug`/`name`/`unit`/`sellingPrice`/`inStock` are read
 * from the product — the exact `StorefrontProduct` public DTO shape, never
 * an internal field. `cachedUnitPrice` sent to the cart store is a
 * display-only snapshot (`cart-state` rule 2) — checkout (S7/S8) always
 * re-reads the authoritative price server-side; this component never
 * pretends the cart is an order.
 */
export interface ProductPurchasePanelProps {
  productId: string;
  slug: string;
  name: string;
  unit: string;
  sellingPrice: number;
  inStock: boolean;
}

function ProductPurchasePanel({
  productId,
  slug,
  name,
  unit,
  sellingPrice,
  inStock,
}: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = React.useState(1);
  const [justAdded, setJustAdded] = React.useState(false);
  const [inFlowVisible, setInFlowVisible] = React.useState(true);
  const inFlowButtonRef = React.useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const feedbackTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => {
    const node = inFlowButtonRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => setInFlowVisible(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => () => clearTimeout(feedbackTimeoutRef.current), []);

  function handleAddToCart() {
    addItem({
      productId,
      slug,
      name,
      imageUrl: null,
      unit,
      cachedUnitPrice: sellingPrice,
      quantity,
    });
    setJustAdded(true);
    clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(() => setJustAdded(false), 2500);
  }

  const ctaLabel = inStock ? "Thêm vào giỏ" : "Hết hàng";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-label-role text-text">Số lượng</span>
        <QuantitySelector value={quantity} onChange={setQuantity} disabled={!inStock} />
      </div>

      <div ref={inFlowButtonRef}>
        <Button size="lg" className="w-full" disabled={!inStock} onClick={handleAddToCart}>
          {ctaLabel}
        </Button>
      </div>

      <p className="min-h-5 text-body-sm text-success" aria-live="polite">
        {justAdded ? "Đã thêm vào giỏ hàng" : null}
      </p>

      {!inFlowVisible ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-overlay lg:hidden">
          <div className="mx-auto flex max-w-content items-center gap-3">
            <div className="min-w-0 flex-1">
              <span className="block truncate text-caption text-text-muted">{name}</span>
              <Price amount={sellingPrice} role="card" />
            </div>
            {!inStock ? <StockBadge inStock={false} /> : null}
            <Button size="lg" disabled={!inStock} onClick={handleAddToCart}>
              {ctaLabel}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { ProductPurchasePanel };
