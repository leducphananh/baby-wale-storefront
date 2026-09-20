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
      {/* Crisp Illustrated Baby Wale Icon */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform hover:scale-105"
      >
        {/* Soft circle container */}
        <circle cx="50" cy="50" r="48" fill="#FFF7F1" stroke="#FF8FA3" strokeWidth="2" />

        {/* Whale Water Spout */}
        <path d="M42 32 C40 19 31 15 34 11 C37 7 45 15 44 26" fill="#6FA8DC" />
        <path d="M44 32 C47 17 55 13 53 9 C51 5 43 14 42 26" fill="#B7D5F0" />
        <circle cx="34" cy="11" r="2.5" fill="#6FA8DC" />
        <circle cx="53" cy="9" r="2" fill="#6FA8DC" />
        <circle cx="44" cy="7" r="1.8" fill="#B7D5F0" />

        {/* Whale Body */}
        <path
          d="M16 56 C14 36 34 26 58 28 C74 30 84 40 84 54 C84 62 82 68 76 72 C70 76 56 78 40 76 C24 74 18 68 16 56 Z"
          fill="#3B82F6"
        />

        {/* Whale Belly */}
        <path d="M18 58 C22 68 34 76 52 76 C40 70 28 64 22 56 Z" fill="#FFFFFF" />
        <path d="M22 60 Q 28 66 38 70" stroke="#E6EEF8" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M28 63 Q 34 68 44 72" stroke="#E6EEF8" strokeWidth="1.2" strokeLinecap="round" />

        {/* Whale Tail */}
        <path
          d="M78 54 C82 50 88 44 92 46 C94 48 90 56 86 60 C89 64 94 70 91 72 C87 74 81 66 77 62 Z"
          fill="#2563EB"
        />

        {/* Whale Smile & Rosy Cheek */}
        <path d="M30 46 Q 34 43 38 46" stroke="#0D2B4E" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M22 54 Q 28 60 36 56" stroke="#0D2B4E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="53" rx="3.5" ry="2.2" fill="#FF8FA3" opacity="0.8" />

        {/* Sleeping Baby on Back */}
        <g transform="translate(48, 32)">
          <ellipse cx="14" cy="18" rx="8.5" ry="6" fill="#FF8FA3" transform="rotate(-15 14 18)" />
          <circle cx="19" cy="21" r="3.2" fill="#FF8FA3" />
          <circle cx="6" cy="12" r="8" fill="#FCE7D6" />
          <path d="M3 13 Q 5 15 7 13" stroke="#0D2B4E" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M7 16 Q 9 17.5 11 16" stroke="#0D2B4E" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <circle cx="4" cy="16" r="1.8" fill="#FF8FA3" opacity="0.8" />
          <path d="M6 4 C 8 2 10 5 8 7 C 7 8 8 10 6 10" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <circle cx="10" cy="19" r="2.2" fill="#FCE7D6" />
        </g>

        {/* Pink Heart */}
        <path
          d="M68 20 C68 18 65 16 63 18 C61 16 58 18 58 20 C58 23 63 26 63 26 C63 26 68 23 68 20 Z"
          fill="#FF8FA3"
        />

        {/* Waves at base */}
        <path
          d="M12 78 Q 24 74 36 78 T 60 78 T 84 78 T 92 78"
          stroke="#6FA8DC"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

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
