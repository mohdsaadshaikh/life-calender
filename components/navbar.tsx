"use client"

import { motion } from "framer-motion"
import { Calendar, Menu, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-card neo-border neo-shadow flex items-center justify-between px-4 py-3 md:px-6">
          <Link href="/">
            <motion.div whileHover={{ scale: 1.1, }} className="flex items-center gap-2">
              <div className="bg-primary neo-border p-2">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg md:text-xl">LIFE CALENDAR</span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            {["Features", "Examples", "About"].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? 2 : -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 font-bold hover:bg-secondary neo-border transition-colors"
              >
                {item}
              </motion.a>
            ))}
            <Link href="/calendar">
              <motion.button
                whileHover={{ scale: 1.05, x: 4, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="bg-accent text-accent-foreground neo-border neo-shadow px-6 py-2 font-bold"
              >
                GET STARTED
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden neo-border p-2 bg-secondary"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="bg-card neo-border border-t-0 neo-shadow p-4 flex flex-col gap-2 mt-0">
            {["Features", "Examples", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-4 py-3 font-bold hover:bg-secondary neo-border transition-colors text-center"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
            <Link href="/calendar" onClick={() => setIsOpen(false)}>
              <button className="w-full bg-accent text-accent-foreground neo-border neo-shadow px-6 py-3 font-bold mt-2">
                GET STARTED
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
