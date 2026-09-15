import { NextResponse } from "next/server";

import { getStorefrontProductBySlug } from "@/features/catalog/server/get-product-by-slug";
import { revalidateRequestSchema } from "@/features/checkout/schema";
import type { RevalidateLineResult, RevalidateResponse } from "@/features/checkout/types";

/**
 * Friendly pre-submit cart check (`cart-state` rule 7, S0 "surfaced by
 * /api/checkout and /api/cart/revalidate"). Reuses the existing S3
 * `get_storefront_product_by_slug` RPC — no new backend surface. This is a
 * UX courtesy only: `create_storefront_order()` never trusts a client price
 * or stock claim regardless of what this endpoint says (`checkout-security`
 * rule 2/3). It cannot surface an exact "only N left" — S3's contract never
 * exposes a quantity (S0 B4) — that appears only from an actual checkout
 * attempt via `QUANTITY_ADJUSTMENT_REQUIRED`.
 */
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = revalidateRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, items: [] } satisfies RevalidateResponse, { status: 400 });
  }

  const items: RevalidateLineResult[] = await Promise.all(
    parsed.data.items.map(async (line) => {
      const product = await getStorefrontProductBySlug(line.slug).catch(() => null);

      if (!product) {
        return {
          productId: line.productId,
          name: line.name,
          status: "not_found",
          currentPrice: null,
        } as const;
      }

      if (!product.inStock) {
        return {
          productId: line.productId,
          name: product.name,
          status: "out_of_stock",
          currentPrice: product.sellingPrice,
        } as const;
      }

      if (product.sellingPrice !== line.cachedUnitPrice) {
        return {
          productId: line.productId,
          name: product.name,
          status: "price_changed",
          currentPrice: product.sellingPrice,
        } as const;
      }

      return {
        productId: line.productId,
        name: product.name,
        status: "ok",
        currentPrice: product.sellingPrice,
      } as const;
    }),
  );

  const response: RevalidateResponse = { ok: items.every((item) => item.status === "ok"), items };
  return NextResponse.json(response, { status: 200 });
}

// Always re-check live data — never cache a stock/price check.
export const dynamic = "force-dynamic";
