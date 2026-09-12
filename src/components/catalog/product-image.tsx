import * as React from "react";

import { Package } from "lucide-react";
import NextImage from "next/image";

import { cn } from "@/lib/utils";

/**
 * Product image frame — S2.4 §11 (frozen for V1): a square (1:1)
 * `object-fit: contain` frame, ~10% internal padding, on
 * `--color-surface-subtle`, `--radius-md`.
 *
 * `imageUrl` is always `undefined` today — S3 explicitly did not build a
 * public image bucket (no public image field exists on the storefront
 * product contract yet), so every card renders the missing-image state:
 * the identical neutral frame + a subtle line-icon motif, never a broken-
 * image glyph, a stock photo, or a fabricated render (S2.4 §11). The
 * `imageUrl` prop exists so this component doesn't need to change shape
 * once the public bucket ships (S7/S9) — only the call site does.
 */
export interface ProductImageProps {
  imageUrl?: string | null;
  /** The product name — used as the accessible alt text, or shown below the placeholder icon. */
  name: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

function ProductImage({ imageUrl, name, className, sizes, priority }: ProductImageProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-surface-subtle p-[10%]",
        className,
      )}
    >
      {imageUrl ? (
        <NextImage
          src={imageUrl}
          alt={name}
          fill
          sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"}
          priority={priority}
          className="object-contain"
        />
      ) : (
        <div className="flex flex-col items-center gap-1 text-text-muted" aria-hidden="true">
          <Package className="size-8" strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}

export { ProductImage };
