import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function LogoIcon({ className }: { className?: string }) {
  return (
    <img 
      src="/logo.png" 
      alt="Life Calendar Logo" 
      className={cn(
        "w-10 h-10 object-contain select-none flex-shrink-0 drop-shadow-[2px_2px_0px_#000]",
        className
      )}
    />
  );
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5 cursor-pointer", className)}>
      <LogoIcon />

      {!iconOnly && (
        <span className="font-extrabold text-lg md:text-xl tracking-wide text-black select-none uppercase font-sans">
          LIFE CALENDAR
        </span>
      )}
    </div>
  );
}
