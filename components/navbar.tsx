"use client"

import { motion } from "framer-motion"
import { Calendar, Menu, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Show } from "@clerk/nextjs"
import { Logo } from "@/components/ui/logo"

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
            <Logo />
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
            <Show when="signed-out">
              <Link href="/signin">
                <motion.button
                  whileHover={{ scale: 1.05, x: 4, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-primary-foreground neo-border neo-shadow px-6 py-2 font-bold hover:text-secondary-foreground transition-colors cursor-pointer"
                >
                  GET STARTED
                </motion.button>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/calendar">
                <motion.button
                  whileHover={{ scale: 1.05, x: 4, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary text-secondary-foreground neo-border neo-shadow px-6 py-2 font-bold hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  CALENDER
                </motion.button>
              </Link>
            </Show>
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
            <Show when="signed-out">
              <Link href="/signin" onClick={() => setIsOpen(false)}>
                <button className="w-full bg-primary text-primary-foreground neo-border neo-shadow px-6 py-3 font-bold mt-2 hover:text-secondary-foreground transition-colors cursor-pointer">
                  GET STARTED
                </button>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/calendar" onClick={() => setIsOpen(false)}>
                <button className="w-full bg-secondary text-secondary-foreground neo-border neo-shadow px-6 py-3 font-bold mt-2 hover:text-primary-foreground transition-colors cursor-pointer">
                  CALENDER
                </button>
              </Link>
            </Show>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
