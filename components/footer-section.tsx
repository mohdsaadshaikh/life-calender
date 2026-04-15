"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Calendar, Clock, Target, Heart, Sparkles } from "lucide-react"
import Link from "next/link"

export function FooterSection() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])

  const wisdomCards = [
    {
      icon: Clock,
      title: "TIME IS YOUR MOST PRECIOUS ASSET",
      description: "You have roughly 4,680 weeks in a lifetime. Make each one count by living intentionally and with purpose.",
      color: "bg-primary",
    },
    {
      icon: Sparkles,
      title: "LIVE IN THE PRESENT MOMENT",
      description: "Your life isn't about the destination. It's about the moments you're living right now. Cherish them.",
      color: "bg-accent",
    },
    {
      icon: Target,
      title: "SET MEANINGFUL MILESTONES",
      description: "Define what matters to you. Goals give direction to your life and transform dreams into reality.",
      color: "bg-secondary",
    },
    {
      icon: Heart,
      title: "CONNECT WITH WHAT MATTERS",
      description: "Your relationships, health, and passions are what make life meaningful. Invest in them.",
      color: "bg-chart-2",
    },
  ]

  return (
    <footer ref={ref} className="pt-20 md:pt-32 pb-12 px-4 md:px-8 bg-foreground text-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-20 gap-2 h-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="aspect-square border border-background/20" />
          ))}
        </div>
      </div>

      <motion.div style={{ y, scale }} className="max-w-7xl mx-auto relative z-10">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
            START YOUR{" "}
            <motion.span
              whileHover={{ rotate: -3, scale: 1.05 }}
              className="bg-primary text-primary-foreground neo-border px-4 inline-block"
            >
              JOURNEY
            </motion.span>
            <br />
            <span className="text-secondary">TODAY</span>
          </motion.h2>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 opacity-80">
            Join thousands of people visualizing their life stories. Create your first calendar in seconds.
          </p>

          {/* Get Started Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link href="/calendar">
              <motion.button
                whileHover={{ scale: 1.05, x: 8, y: -8 }}
                whileTap={{ scale: 0.95 }}
                className="bg-accent text-accent-foreground neo-border neo-shadow-lg px-8 py-4 font-bold text-lg flex items-center justify-center gap-2 group mx-auto"
              >
                GET STARTED
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Life Wisdom Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-center mb-12"
          >
            WISDOM FOR A MEANINGFUL LIFE
          </motion.h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wisdomCards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className={`${card.color} neo-border neo-shadow p-6 text-foreground`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="mb-4 inline-block"
                  >
                    <div className="bg-foreground text-background neo-border p-3">
                      <Icon className="w-6 h-6" />
                    </div>
                  </motion.div>

                  <h4 className="font-bold text-sm mb-3 text-foreground leading-tight">
                    {card.title}
                  </h4>

                  <p className="text-sm opacity-90 leading-relaxed">
                    {card.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div> */}

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center pt-12 border-t border-background/20"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="w-4 h-4" />
            <span className="opacity-70 text-sm">© 2026 Life Calendar. Visualize your story.</span>
          </div>
          <p className="opacity-50 text-xs">
            Every week counts. Every moment matters. Make your life count.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  )
}
