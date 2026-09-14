"use client";

import * as React from "react";

import { ProductImage } from "@/components/catalog/product-image";
import { cn } from "@/lib/utils";

/**
 * Product Detail gallery — S2.4 §10.3/§11: the same 1:1 `contain` frame as
 * everywhere else, thumbnails **only** when multiple images exist (never on
 * a listing card). No layout shift when switching images — the frame is a
 * fixed `aspect-square` box regardless of which image is selected.
 *
 * `images` is always empty today: `StorefrontProduct` (S3) has no image
 * field at all — no public image bucket exists yet (S3/S4 finding, still
 * open, O3/F13). This component is built to the frozen contract's full
 * shape (main image + thumbnail strip) so only the call site changes once
 * real image URLs exist; right now every product renders the single neutral
 * placeholder frame via `ProductImage`, and the thumbnail strip simply
 * never renders (0 or 1 images).
 */
export interface ProductGalleryProps {
  images: string[];
  productName: string;
}

function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const selectedImage = images[selectedIndex] ?? null;

  return (
    <div className="flex flex-col gap-3">
      <ProductImage imageUrl={selectedImage} name={productName} priority sizes="(min-width: 1024px) 40vw, 100vw" />

      {images.length > 1 ? (
        <div role="group" aria-label="Ảnh sản phẩm" className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Xem ảnh ${index + 1} trên ${images.length}`}
                aria-current={isSelected}
                className={cn(
                  "size-16 shrink-0 overflow-hidden rounded-sm border-2 bg-surface-subtle p-1",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  isSelected ? "border-primary" : "border-transparent hover:border-border",
                )}
              >
                <ProductImage imageUrl={image} name={`${productName} — ảnh ${index + 1}`} className="p-0" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export { ProductGallery };
