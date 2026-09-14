"use client";

import { useSyncExternalStore } from "react";

// Never actually changes after mount, so no real subscription is needed —
// `useSyncExternalStore` re-renders once when the client snapshot (`true`)
// first differs from the server snapshot (`false`), which is exactly the
// "have we hydrated yet" signal this hook exists for.
function subscribe(): () => void {
  return () => {};
}

/**
 * True only once this render has happened on the client (cart-state rule 5:
 * "guard against SSR mismatch — render the cart count / contents only after
 * a hydration flag flips post-mount"). The server always renders the
 * `false` snapshot; `persist`'s `localStorage` read only happens in the
 * browser, so any consumer must wait for this flag before trusting the
 * store's real value — otherwise the server-rendered markup and the
 * client's first render disagree (a hydration warning) whenever the
 * visitor already has items in their cart.
 *
 * Uses `useSyncExternalStore` (React's primitive for exactly this "server
 * snapshot differs from client snapshot" case) rather than a `useState` +
 * `useEffect` pair, which the project's lint config flags as an
 * anti-pattern (`react-hooks/set-state-in-effect`) for good reason —
 * `useSyncExternalStore` resolves the mismatch in one render, not two.
 */
export function useHasHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
