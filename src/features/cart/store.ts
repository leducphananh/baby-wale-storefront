"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Cart store — client state only, the authoritative order is server-side
 * (`cart-state` skill). Line shape matches the skill's frozen spec exactly:
 * `{ productId, slug, name, imageUrl, unit, quantity, cachedUnitPrice,
 * cachedAt }`. `cachedUnitPrice`/`cachedAt` are **display-only** — they
 * exist to show "giá đã thay đổi" once cart-revalidation exists (S6+) and
 * are never sent as an authoritative value. `imageUrl` is always `null`
 * today — no public product image field/bucket exists yet (S3/S4 finding).
 *
 * Introduced in S5 (Product Detail), not S6 — the S5 phase brief explicitly
 * authorizes "the minimum cart state infrastructure needed for the Product
 * Detail CTA", matching CLAUDE.md §10's "Zustand ... added in the phase
 * that first needs it." The full `/gio-hang` cart page, quantity edits from
 * the cart, and `/api/cart/revalidate` remain S6 scope.
 */
export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  unit: string;
  quantity: number;
  /** Display-only price snapshot at the moment this line was added/updated. */
  cachedUnitPrice: number;
  /** ISO timestamp of the last add/update — for a future "giá đã thay đổi" check. */
  cachedAt: string;
}

export interface AddCartLineInput {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  unit: string;
  cachedUnitPrice: number;
  quantity?: number;
}

interface CartState {
  lines: CartLine[];
  addItem: (input: AddCartLineInput) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

/** Integer, >= 1 — matches every quantity rule used across the storefront. */
function clampQuantity(quantity: number): number {
  const rounded = Math.floor(quantity);
  return Number.isFinite(rounded) && rounded >= 1 ? rounded : 1;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],

      addItem: (input) =>
        set((state) => {
          const quantityToAdd = clampQuantity(input.quantity ?? 1);
          const cachedAt = new Date().toISOString();
          const existingIndex = state.lines.findIndex((line) => line.productId === input.productId);

          if (existingIndex === -1) {
            const newLine: CartLine = {
              productId: input.productId,
              slug: input.slug,
              name: input.name,
              imageUrl: input.imageUrl,
              unit: input.unit,
              quantity: quantityToAdd,
              cachedUnitPrice: input.cachedUnitPrice,
              cachedAt,
            };
            return { lines: [...state.lines, newLine] };
          }

          // Line identity is productId — adding an existing product
          // increments its quantity rather than creating a duplicate line
          // (cart-state rule 3), and refreshes the display-only price
          // snapshot to the value just seen.
          return {
            lines: state.lines.map((line, index) =>
              index === existingIndex
                ? {
                    ...line,
                    quantity: clampQuantity(line.quantity + quantityToAdd),
                    cachedUnitPrice: input.cachedUnitPrice,
                    cachedAt,
                  }
                : line,
            ),
          };
        }),

      removeItem: (productId) =>
        set((state) => ({ lines: state.lines.filter((line) => line.productId !== productId) })),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines: state.lines.map((line) =>
            line.productId === productId ? { ...line, quantity: clampQuantity(quantity) } : line,
          ),
        })),

      clear: () => set({ lines: [] }),
    }),
    {
      name: "baby-wale-cart",
      // Only `lines` is meaningful to persist; the action functions are
      // recreated on every load regardless.
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

/** Total item count across all lines — what the header badge shows. */
export function selectCartCount(state: CartState): number {
  return state.lines.reduce((sum, line) => sum + line.quantity, 0);
}
