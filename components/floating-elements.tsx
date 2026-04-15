"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

export function FloatingElements() {
  const { scrollY } = useScroll()
  const [mounted, setMounted] = useState(false)
  const yTransform1 = useTransform(scrollY, [0, 3000], [0, -400])
  const rotateTransform1 = useTransform(scrollY, [0, 3000], [0, 120])
  const yTransform2 = useTransform(scrollY, [0, 3000], [0, 250])
  const rotateTransform2 = useTransform(scrollY, [0, 3000], [45, -60])
  const yTransform3 = useTransform(scrollY, [0, 3000], [100, -150])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const shapes = [
    { color: "bg-primary/40", size: "w-6 h-6 md:w-10 md:h-10", initialX: "5%", initialY: "20%" },
    { color: "bg-secondary/40", size: "w-5 h-5 md:w-8 md:h-8", initialX: "92%", initialY: "30%" },
    { color: "bg-accent/40", size: "w-8 h-8 md:w-12 md:h-12", initialX: "88%", initialY: "60%" },
    { color: "bg-chart-4/40", size: "w-4 h-4 md:w-6 md:h-6", initialX: "8%", initialY: "70%" },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute ${shape.color} ${shape.size} neo-border`}
          style={{
            left: shape.initialX,
            top: shape.initialY,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Parallax scrolling shapes - simplified */}
      <motion.div
        className="absolute w-16 h-16 md:w-24 md:h-24 bg-primary/15 neo-border"
        style={{
          left: "12%",
          top: "15%",
          y: yTransform1,
          rotate: rotateTransform1,
        }}
      />
      <motion.div
        className="absolute w-12 h-12 md:w-20 md:h-20 bg-secondary/15 neo-border"
        style={{
          right: "18%",
          top: "45%",
          y: yTransform2,
          rotate: rotateTransform2,
        }}
      />
      <motion.div
        className="absolute w-10 h-10 md:w-16 md:h-16 bg-accent/15 neo-border"
        style={{
          left: "22%",
          top: "65%",
          y: yTransform3,
        }}
      />
    </div>
  )
}
