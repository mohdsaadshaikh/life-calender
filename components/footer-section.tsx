"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { ArrowRight, Calendar, Github, Twitter, Instagram } from "lucide-react"

export function FooterSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState("")

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])

  return (
    <footer ref={ref} className="py-20 md:py-32 px-4 md:px-8 bg-foreground text-background relative overflow-hidden">
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

          {/* Email Signup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-background text-foreground neo-border neo-shadow px-6 py-4 font-mono text-lg flex-1 focus:outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.05, x: 8, y: -8 }}
              whileTap={{ scale: 0.95 }}
              className="bg-accent text-accent-foreground neo-border neo-shadow-lg px-8 py-4 font-bold text-lg flex items-center justify-center gap-2 group"
            >
              GET STARTED
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Footer Links */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary neo-border p-2">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">LIFE CALENDAR</span>
            </div>
            <p className="opacity-70 text-sm">Visualize your life week by week. Map your milestones and moments.</p>
          </motion.div>

          {/* Links */}
          {[
            { title: "PRODUCT", links: ["Features", "Pricing", "Examples", "Updates"] },
            { title: "COMPANY", links: ["About", "Blog", "Careers", "Press"] },
            { title: "SUPPORT", links: ["Help Center", "Contact", "Privacy", "Terms"] },
          ].map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold mb-4 text-secondary">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5 }}
                      className="opacity-70 hover:opacity-100 transition-opacity inline-block"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-background/20"
        >
          <span className="opacity-70 text-sm mb-4 md:mb-0">© 2026 Life Calendar. All rights reserved.</span>
          <div className="flex gap-4">
            {[Github, Twitter, Instagram].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.2, rotate: 10, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="bg-background text-foreground neo-border p-3"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}
