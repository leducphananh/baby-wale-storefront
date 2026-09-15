"use client";

import * as React from "react";

import Link from "next/link";

import { Price } from "@/components/catalog/price";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

/**
 * Cart summary — S2.4 §10.4's frozen totals terminology (not just this
 * phase's own brief, which under-specifies it): "Tạm tính (hàng hoá)",
 * "Phí vận chuyển: Nhân viên sẽ xác nhận" (plain text, not a value —
 * CLAUDE.md §8, shipping is not financially integrated), and
 * "Tổng tiền hàng" — **never** "Tổng thanh toán" while shipping stays
 * unresolved. Numerically the subtotal and the goods total are the same
 * value today (no shipping is added anywhere in this codebase) — both
 * lines are shown anyway because S2.4 froze both labels for this screen.
 *
 * `treatZeroAsUnavailable={false}` on both `Price`s: this is an aggregate
 * (money.ts's own documented distinction), never "Liên hệ" even if every
 * line happened to be unpriced.
 *
 * The "Tiến hành đặt hàng" CTA is pure navigation to `/thanh-toan` — that
 * route doesn't exist until S8; landing on the existing calm `not-found.tsx`
 * is the same honest, forward-compatible pattern S4/S5 already established
 * for `/gio-hang` and `/san-pham/[slug]` before their own phases shipped.
 * No checkout logic of any kind lives here.
 */
export interface CartSummaryProps {
  subtotal: number;
  /** Renders the CTA — omit on the mobile sticky bar, which supplies its own. */
  showCta?: boolean;
  className?: string;
}

function CartSummary({ subtotal, showCta = true, className }: CartSummaryProps) {
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

      {showCta ? (
        <Button asChild size="lg" className="mt-4 w-full">
          <Link href="/thanh-toan">Tiến hành đặt hàng</Link>
        </Button>
      ) : null}
    </div>
  );
}

export { CartSummary };
