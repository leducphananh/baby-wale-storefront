import React from "react";
import { cn } from "@/lib/utils";

interface BabyWaleLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export function BabyWaleLogo({
  size = "md",
  showText = true,
  className = "",
  onClick,
}: BabyWaleLogoProps) {
  const dimensions = {
    sm: { icon: 34, title: "text-lg", sub: "text-[10px]" },
    md: { icon: 44, title: "text-xl", sub: "text-[11px]" },
    lg: { icon: 58, title: "text-2xl", sub: "text-xs" },
    xl: { icon: 84, title: "text-3xl", sub: "text-sm" },
  }[size];

  return (
    <div
      id="baby-wale-brand-logo"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2.5 select-none transition-transform duration-200 active:scale-95",
        onClick ? "cursor-pointer hover:opacity-95" : "",
        className
      )}
    >
      <img
        src="/logo.png"
        alt="Baby Wale Logo"
        width={dimensions.icon}
        height={dimensions.icon}
        className="shrink-0 drop-shadow-sm transition-transform hover:scale-105 rounded-full object-cover"
      />

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span
              className={cn("font-extrabold tracking-tight text-primary leading-none", dimensions.title)}
            >
              Baby Wale
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block mb-1"></span>
          </div>
          <span className={cn("text-muted-foreground font-semibold tracking-wide", dimensions.sub)}>
            Mẹ An Tâm • Bé Khôn Lớn
          </span>
        </div>
      )}
    </div>
  );
}
