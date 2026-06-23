import React from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function LogoIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-10 h-10 rounded-full bg-[#FF9209] border-[3px] border-black flex items-center justify-center flex-shrink-0 select-none shadow-[2px_2px_0px_#000]",
        className
      )}
    >
      <Calendar className="w-[50%] h-[50%] text-black stroke-[3px]" />
    </div>
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
