"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen horizons-bg flex flex-col items-center justify-center p-6 text-black select-none">
      {/* Outer Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="bg-muted neo-border-thick neo-shadow-xl p-8 md:p-12 max-w-xl w-full text-center relative overflow-hidden"
      >
        {/* Floating background shapes */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [5, -5, 5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-6 -left-6 w-16 h-16 bg-accent neo-border -z-10"
        />
        <motion.div
          animate={{ y: [10, -10, 10], rotate: [-10, 10, -10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -bottom-8 -right-8 w-20 h-20 bg-secondary neo-border -z-10"
        />

        {/* Small Outlined Tag */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block bg-secondary text-black font-black text-xs px-3.5 py-1.5 neo-border shadow-[2px_2px_0px_#000] mb-6"
        >
          ⚠️ ERROR 404
        </motion.div>

        {/* Torn Calendar Page Illustration */}
        <div className="mb-8 relative flex justify-center">
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, -3, 3, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="cursor-pointer"
          >
            <svg viewBox="0 0 240 240" className="w-48 h-48 md:w-56 md:h-56 mx-auto drop-shadow-[8px_8px_0px_rgba(0,0,0,1)]">
              {/* Binder Header Spiral Bar */}
              <rect x="30" y="30" width="180" height="24" rx="6" fill="#FF9100" stroke="#000000" strokeWidth="6" />

              {/* Binder Rings */}
              <rect x="55" y="15" width="12" height="30" rx="6" fill="#52D167" stroke="#000000" strokeWidth="5" />
              <rect x="95" y="15" width="12" height="30" rx="6" fill="#52D167" stroke="#000000" strokeWidth="5" />
              <rect x="135" y="15" width="12" height="30" rx="6" fill="#52D167" stroke="#000000" strokeWidth="5" />
              <rect x="175" y="15" width="12" height="30" rx="6" fill="#52D167" stroke="#000000" strokeWidth="5" />

              {/* Torn Calendar Sheet */}
              <path d="M 40 60 
                       L 50 65 L 60 55 L 70 65 L 80 55 L 90 65 L 100 55 L 110 65 L 120 55 L 130 65 L 140 55 L 150 65 L 160 55 L 170 65 L 180 55 L 190 65 L 200 60
                       L 200 190 Q 200 210 180 210 
                       L 60 210 Q 40 210 40 190 
                       Z"
                fill="#FFFFFF" stroke="#000000" strokeWidth="6" />

              {/* Top Accent Header Line on the sheet */}
              <path d="M 40 85 L 200 85" stroke="#FF5B87" strokeWidth="12" strokeLinecap="square" />

              {/* Large Bold 404 */}
              <text x="120" y="155" textAnchor="middle" fontFamily="Fredoka, Outfit, sans-serif" fontWeight="900" fontSize="56" fill="#000000">404</text>

              {/* Sad Mouth */}
              <path d="M 105 178 Q 120 168 135 178" fill="none" stroke="#FF5B87" strokeWidth="4.5" strokeLinecap="round" />

              {/* Eyes */}
              <circle cx="102" cy="170" r="4.5" fill="#000000" />
              <circle cx="138" cy="170" r="4.5" fill="#000000" />
            </svg>
          </motion.div>
        </div>

        {/* Text Details */}
        <h1 className="horizons-logo-text text-4xl md:text-5xl lg:text-6xl tracking-tight select-none mb-4 uppercase">
          Torn Timeline
        </h1>

        <p className="text-base md:text-lg font-bold mb-8 max-w-md mx-auto leading-relaxed">
          We searched all 4,680 weeks of the average life expectancy, but this page was nowhere to be found. It might have been deleted, moved, or never existed in the first place.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05, x: 4, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-black font-black text-sm md:text-base px-6 py-4 neo-border neo-shadow flex items-center justify-center gap-2 hover:bg-orange-400 transition-colors w-48 cursor-pointer"
            >
              <Home className="w-5 h-5 stroke-[2.5px]" />
              HOME PAGE
            </motion.button>
          </Link>
          {/* <Link href="/calendar">
            <motion.button
              whileHover={{ scale: 1.05, x: 4, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-secondary text-black font-black text-sm md:text-base px-6 py-4 neo-border neo-shadow flex items-center justify-center gap-2 hover:bg-pink-400 transition-colors w-48 cursor-pointer"
            >
              <Calendar className="w-5 h-5 stroke-[2.5px]" />
              MY CALENDAR
            </motion.button>
          </Link> */}
        </div>
      </motion.div>
    </main>
  );
}
