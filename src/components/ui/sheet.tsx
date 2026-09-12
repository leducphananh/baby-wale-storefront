import * as React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Sheet foundation — an edge-anchored `Dialog` (bottom sheet on mobile:
 * "Danh mục" / "Sắp xếp" triggers open one, S2.4 §2.1; a right-anchored panel
 * for a future cart drawer, §20 spec-only). Bottom sheets use `--radius-lg`
 * on the top corners only, per the frozen radius table (§7.1: "Bottom-sheet
 * top corners, hero surface"). Keyboard behaviour (focus trap, `Esc`, focus
 * return) comes from Radix's Dialog primitive, same as `Dialog`.
 */
const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-text/40", className)} {...props} />
));
SheetOverlay.displayName = "SheetOverlay";

const sheetContentVariants = cva("fixed z-50 border-border bg-surface p-6 shadow-overlay focus-visible:outline-none", {
  variants: {
    side: {
      bottom: "inset-x-0 bottom-0 max-h-[85vh] rounded-t-lg border-t",
      right: "inset-y-0 right-0 h-full w-full max-w-sm border-l",
    },
  },
  defaultVariants: {
    side: "bottom",
  },
});

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetContentVariants> {}

const SheetContent = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Content>, SheetContentProps>(
  ({ className, side, children, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(sheetContentVariants({ side }), className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="sm-target absolute right-4 top-4 rounded-xs text-text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
          <X className="size-5" aria-hidden="true" />
          <span className="sr-only">Đóng</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  ),
);
SheetContent.displayName = "SheetContent";

function SheetHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("mb-4 flex flex-col gap-1", className)} {...props} />;
}

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-h3 text-text", className)} {...props} />
));
SheetTitle.displayName = "SheetTitle";

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle };
