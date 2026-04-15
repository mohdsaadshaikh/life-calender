"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const examples = [
  {
    title: "MY LIFE IN WEEKS",
    color: "bg-primary",
    description: "Track every week of your life journey",
    weeks: 80 * 52,
  },
  {
    title: "CAREER MILESTONES",
    color: "bg-secondary",
    description: "Document your professional achievements",
    weeks: 40 * 52,
  },
  {
    title: "TRAVEL ADVENTURES",
    color: "bg-accent",
    description: "Map your global explorations",
    weeks: 30 * 52,
  },
  {
    title: "RELATIONSHIPS",
    color: "bg-chart-4",
    description: "Celebrate meaningful connections",
    weeks: 50 * 52,
  },
]

export function ExamplesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 1], [200, -200])
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 0, 5])

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % examples.length)
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length)

  return (
    <section ref={ref} id="examples" className="py-20 md:py-32 px-4 md:px-8 relative overflow-hidden">
      {/* Parallax Background Shapes */}
      <motion.div
        style={{ x }}
        className="absolute top-20 -left-20 w-40 h-40 bg-secondary neo-border rotate-12 -z-10 opacity-50"
      />
      <motion.div
        style={{ x: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
        className="absolute bottom-40 -right-10 w-32 h-32 bg-primary neo-border -rotate-12 -z-10 opacity-50"
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          style={{ rotate }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="bg-accent text-accent-foreground neo-border neo-shadow px-4 py-2 font-bold inline-block mb-6">
            EXAMPLES
          </span>
          <h2 className="text-4xl md:text-6xl font-bold">
            SEE IT IN{" "}
            <span className="bg-primary text-primary-foreground neo-border px-4 inline-block transform rotate-1">
              ACTION
            </span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex"
            >
              {examples.map((example, i) => (
                <motion.div
                  key={example.title}
                  className="w-full flex-shrink-0 px-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={`${example.color} neo-border neo-shadow-xl p-6 md:p-8`}>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      {/* Calendar Preview */}
                      <div className="bg-card neo-border p-4 md:p-6">
                        <div className="grid grid-cols-26 gap-[2px] md:gap-1">
                          {Array.from({ length: 260 }).map((_, j) => (
                            <motion.div
                              key={j}
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              transition={{ delay: j * 0.002 }}
                              viewport={{ once: true }}
                              className={`aspect-square neo-border ${
                                j < Math.floor(Math.random() * 150 + 50) ? example.color : "bg-muted"
                              }`}
                              style={{ minWidth: "6px", minHeight: "6px" }}
                            />
                          ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="font-mono text-sm">WEEK 1</span>
                          <span className="font-mono text-sm">WEEK 52</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="text-center md:text-left">
                        <motion.h3
                          whileHover={{ scale: 1.05, rotate: -1 }}
                          className="text-3xl md:text-4xl font-bold mb-4 inline-block"
                        >
                          {example.title}
                        </motion.h3>
                        <p className="text-lg md:text-xl font-medium mb-6">{example.description}</p>
                        <div className="bg-card neo-border neo-shadow px-6 py-4 inline-block">
                          <span className="font-mono text-2xl font-bold">{example.weeks.toLocaleString()}</span>
                          <span className="block text-sm font-bold mt-1">WEEKS TRACKED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              className="bg-card neo-border neo-shadow p-4"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <div className="flex items-center gap-2">
              {examples.map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-4 h-4 neo-border ${i === currentIndex ? "bg-accent" : "bg-muted"}`}
                />
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              className="bg-card neo-border neo-shadow p-4"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}
