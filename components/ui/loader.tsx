"use client";

import { motion } from "framer-motion";
import { LogoIcon } from "@/components/ui/logo";

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loader({
  message = "Loading...",
  fullScreen = true,
}: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6 select-none p-6 text-black">
      {/* Rotating & Scaling Logo Icon */}
      <motion.div
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.08, 1, 1.08, 1],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 3.5,
          ease: "easeInOut",
        }}
      >
        <LogoIcon className="w-16 h-16 drop-shadow-[4px_4px_0px_#000]" />
      </motion.div>

      {/* Retro Striped Progress Bar */}
      <div className="w-64 h-6 bg-[#FCFBF9] border-[3px] border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_#000] relative">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.8,
            ease: "linear",
          }}
          className="absolute inset-y-0 w-1/2 h-full bg-[#7ed957] border-r-[3px] border-black"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.08) 8px, rgba(0,0,0,0.08) 16px)",
          }}
        />
      </div>

      {/* Pulsing Text */}
      <div className="text-center font-black uppercase text-sm tracking-widest font-mono text-black/80">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {message}
        </motion.span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F6F0E5] horizons-bg">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full h-96 flex items-center justify-center bg-[#FCFBF9] neo-border rounded-xl">
      {content}
    </div>
  );
}
