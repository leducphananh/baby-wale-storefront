import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Page-content container — S2.4 §9.1: max-width **1200px** (`max-w-content`,
 * NOT the 1440px canvas artboard frame), with the frozen gutters (16px
 * mobile, 12px compact <=374px, 24-32px desktop, §6).
 */
function Container({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-content px-4 compact:px-3 lg:px-6 xl:px-8", className)}
      {...props}
    />
  );
}

export { Container };
