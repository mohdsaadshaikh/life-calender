"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Calendar, Plus, Palette, Globe, Heart, Star } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "MULTIPLE CALENDARS",
    description: "Create personalized calendars such as career, travel, and relationships.",
    color: "bg-primary",
    tags: ["My Life", "Career", "Goals", "Travels"],
  },
  {
    icon: Plus,
    title: "ADD EVENTS",
    description: "Capture significant moments by adding events with milestones and achievements.",
    color: "bg-secondary",
    events: ["Road Trip in Italy", "Cherry Blossom Trip", "Sailing the Coast"],
  },
  {
    icon: Palette,
    title: "CUSTOMIZE",
    description: "Color-code and label your events to categorize different experiences.",
    color: "bg-accent",
    colors: ["#7ed957", "#ffde59", "#ff914d", "#5ce1e6", "#ff66c4"],
  },
]

const stats = [
  { icon: Globe, value: "50K+", label: "USERS" },
  { icon: Heart, value: "1M+", label: "EVENTS" },
  { icon: Star, value: "4.9", label: "RATING" },
]

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50])
  const rotate = useTransform(scrollYProgress, [0, 1], [10, -10])

  return (
    <section ref={ref} id="features" className="py-20 md:py-32 px-4 md:px-8 relative overflow-hidden bg-muted">
      {/* Parallax Background */}
      <motion.div
        style={{ y: y1, rotate }}
        className="absolute top-40 -left-20 w-60 h-60 bg-primary neo-border -z-10 opacity-30"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-20 -right-20 w-48 h-48 bg-accent neo-border rotate-45 -z-10 opacity-30"
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="bg-primary text-primary-foreground neo-border neo-shadow px-4 py-2 font-bold inline-block mb-6">
            FEATURES
          </span>
          <h2 className="text-4xl md:text-6xl font-bold">
            POWERFUL <span className="bg-secondary neo-border px-4 inline-block transform -rotate-2">TOOLS</span>
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, rotate: i % 2 === 0 ? -5 : 5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, rotate: i % 2 === 0 ? 2 : -2 }}
              className="bg-card neo-border neo-shadow-lg p-6 md:p-8"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className={`${feature.color} neo-border w-16 h-16 flex items-center justify-center mb-6`}
              >
                <feature.icon className="w-8 h-8" />
              </motion.div>

              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground font-medium mb-6">{feature.description}</p>

              {/* Feature-specific content */}
              {feature.tags && (
                <div className="flex flex-wrap gap-2">
                  {feature.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      whileHover={{ scale: 1.1, }}
                      className="bg-muted neo-border px-3 py-1 font-bold text-sm"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              )}

              {feature.events && (
                <div className="space-y-2">
                  {feature.events.map((event) => (
                    <motion.div
                      key={event}
                      whileHover={{ x: 10 }}
                      className="bg-muted neo-border px-4 py-2 font-medium"
                    >
                      {event}
                    </motion.div>
                  ))}
                </div>
              )}

              {feature.colors && (
                <div className="flex gap-2">
                  {feature.colors.map((color) => (
                    <motion.div
                      key={color}
                      whileHover={{ scale: 1.3,  }}
                      className="w-10 h-10 neo-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-foreground text-background neo-border neo-shadow-xl p-8 md:p-12"
        >
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <motion.div
                  whileHover={{  scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-primary neo-border w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                >
                  <stat.icon className="w-8 h-8 text-primary-foreground" />
                </motion.div>
                <motion.span
                  className="text-4xl md:text-5xl font-bold block"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", delay: i * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.span>
                <span className="font-bold text-sm md:text-base opacity-80">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
