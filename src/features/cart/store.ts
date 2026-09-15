"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Cart store — client state only, the authoritative order is server-side
 * (`cart-state` skill). Line shape matches the skill's frozen spec exactly:
 * `{ productId, slug, name, imageUrl, unit, quantity, cachedUnitPrice,
 * cachedAt }`. `cachedUnitPrice`/`cachedAt` are **display-only** — they
 * exist to show "giá đã thay đổi" once cart-revalidation exists (S7+) and
 * are never sent as an authoritative value. `imageUrl` is always `null`
 * today — no public product image field/bucket exists yet (S3/S4/S5
 * finding).
 *
 * Introduced in S5 (the minimum needed for the Product Detail CTA);
 * extended in S6 with `incrementQuantity`/`decrementQuantity` (the cart
 * page's own quantity controls) and `selectCartSubtotal` (S6 — "Tạm tính").
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
  /** Quantity + 1. No inventory-backed max — S3 never exposes exact stock. */
  incrementQuantity: (productId: string) => void;
  /**
   * Quantity - 1, or **removes the line entirely** if it was already at 1
   * (S6 business rule — the same single action a "-" press at the floor
   * performs everywhere in this UI: below the minimum, there is no line).
   */
  decrementQuantity: (productId: string) => void;
  clear: () => void;
}

/** Integer, >= 1 — matches every quantity rule used across the storefront. */
function clampQuantity(quantity: number): number {
  const rounded = Math.floor(quantity);
  return Number.isFinite(rounded) && rounded >= 1 ? rounded : 1;
}

/**
 * Sanitizes whatever was actually in `localStorage` before it becomes live
 * state (S6 — persisted client data cannot be fully trusted; a customer can
 * edit it directly in devtools). A line missing a usable `productId` is
 * dropped (there is nothing safe to render or act on). Every other field is
 * coerced to a safe default rather than rejecting the whole line — losing
 * a product's cached name/unit is recoverable, losing the whole cart to one
 * bad field is not. Lines sharing a `productId` (which should never happen
 * from this store's own actions, but a hand-edited file could contain it)
 * are merged, matching `addItem`'s own identity rule.
 */
function sanitizeLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const merged = new Map<string, CartLine>();

  for (const candidate of raw) {
    if (!candidate || typeof candidate !== "object") continue;
    const item = candidate as Record<string, unknown>;

    const productId = typeof item.productId === "string" && item.productId.length > 0 ? item.productId : null;
    if (!productId) continue;

    const quantity = clampQuantity(Number(item.quantity));
    const priceCandidate = Number(item.cachedUnitPrice);
    const cachedUnitPrice = Number.isFinite(priceCandidate) && priceCandidate >= 0 ? priceCandidate : 0;

    const sanitized: CartLine = {
      productId,
      slug: typeof item.slug === "string" ? item.slug : "",
      name: typeof item.name === "string" ? item.name : "",
      imageUrl: typeof item.imageUrl === "string" ? item.imageUrl : null,
      unit: typeof item.unit === "string" ? item.unit : "",
      quantity,
      cachedUnitPrice,
      cachedAt: typeof item.cachedAt === "string" ? item.cachedAt : new Date().toISOString(),
    };

    const existing = merged.get(productId);
    if (existing) {
      existing.quantity = clampQuantity(existing.quantity + quantity);
    } else {
      merged.set(productId, sanitized);
    }
  }

  return Array.from(merged.values());
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

      incrementQuantity: (productId) =>
        set((state) => ({
          lines: state.lines.map((line) =>
            line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line,
          ),
        })),

      decrementQuantity: (productId) =>
        set((state) => {
          const line = state.lines.find((candidate) => candidate.productId === productId);
          if (!line) return state;
          if (line.quantity <= 1) {
            return { lines: state.lines.filter((candidate) => candidate.productId !== productId) };
          }
          return {
            lines: state.lines.map((candidate) =>
              candidate.productId === productId ? { ...candidate, quantity: candidate.quantity - 1 } : candidate,
            ),
          };
        }),

      clear: () => set({ lines: [] }),
    }),
    {
      name: "baby-wale-cart",
      // Only `lines` is meaningful to persist; the action functions are
      // recreated on every load regardless.
      partialize: (state) => ({ lines: state.lines }),
      // Sanitize whatever localStorage actually contained (S6 §18) before it
      // becomes live state — see `sanitizeLines`.
      merge: (persistedState, currentState) => ({
        ...currentState,
        lines: sanitizeLines((persistedState as { lines?: unknown } | undefined)?.lines),
      }),
    },
  ),
);

/** Total item count across all lines — what the header badge shows. */
export function selectCartCount(state: CartState): number {
  return state.lines.reduce((sum, line) => sum + line.quantity, 0);
}

/**
 * Display-only subtotal — `Σ(quantity × cachedUnitPrice)` (S6 §13). **Not
 * authoritative.** A future checkout (S7/S8) always re-reads the real
 * `selling_price` server-side; this value exists purely so the customer can
 * see an estimate on `/gio-hang` before that happens.
 */
export function selectCartSubtotal(state: CartState): number {
  return state.lines.reduce((sum, line) => sum + line.quantity * line.cachedUnitPrice, 0);
}
