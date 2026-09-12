import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind class conflicts (e.g. a
 * caller overriding a component's default `bg-*`). Shared by every UI
 * primitive in `src/components/ui` (design-system).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
