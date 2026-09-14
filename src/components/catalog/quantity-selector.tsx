"use client";

import * as React from "react";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Quantity stepper — min 1, integer only. **No inventory-backed max** — the
 * storefront never exposes exact stock (`in_stock` is a boolean only, S3),
 * so `maxHint` is a soft, UX-only ceiling to stop a runaway input value,
 * never real stock enforcement (that's `/api/cart/revalidate` + the
 * checkout RPC, S6/S7). Fully controlled — the caller owns the value so it
 * can share it between the in-flow and sticky Add-to-Cart bars (S2.4 §10.3:
 * never two independent quantities for the same product on one page).
 */
export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  maxHint?: number;
  className?: string;
}

const MIN = 1;

function clamp(value: number, maxHint: number): number {
  const rounded = Math.round(value);
  if (!Number.isFinite(rounded)) return MIN;
  return Math.min(Math.max(rounded, MIN), maxHint);
}

function QuantitySelector({ value, onChange, disabled, maxHint = 99, className }: QuantitySelectorProps) {
  return (
    <div className={cn("inline-flex h-11 items-stretch rounded-sm border border-border", className)}>
      <button
        type="button"
        disabled={disabled || value <= MIN}
        onClick={() => onChange(clamp(value - 1, maxHint))}
        aria-label="Giảm số lượng"
        className="sm-target flex w-11 items-center justify-center text-text disabled:pointer-events-none disabled:opacity-40 hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        role="spinbutton"
        aria-valuemin={MIN}
        aria-valuemax={maxHint}
        aria-valuenow={value}
        aria-label="Số lượng"
        disabled={disabled}
        value={value}
        onChange={(event) => {
          const parsed = Number.parseInt(event.target.value, 10);
          if (event.target.value === "") {
            onChange(MIN);
            return;
          }
          if (Number.isFinite(parsed)) {
            onChange(clamp(parsed, maxHint));
          }
        }}
        onBlur={(event) => onChange(clamp(Number.parseInt(event.target.value, 10) || MIN, maxHint))}
        className="text-input-role w-11 border-x border-border bg-surface text-center text-text tabular-nums outline-none disabled:opacity-40"
      />

      <button
        type="button"
        disabled={disabled || value >= maxHint}
        onClick={() => onChange(clamp(value + 1, maxHint))}
        aria-label="Tăng số lượng"
        className="sm-target flex w-11 items-center justify-center text-text disabled:pointer-events-none disabled:opacity-40 hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export { QuantitySelector };
