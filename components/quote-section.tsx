"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

export function QuoteSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 0, 5]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      ref={ref}
      className="py-20 md:py-32 px-4 md:px-8 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          style={{ scale, rotate }}
          className="bg-card neo-border neo-shadow-xl p-8 md:p-16 relative"
        >
          {/* Quote Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
            viewport={{ once: true }}
            className="absolute -top-8 -left-8 bg-accent neo-border p-4"
          >
            <Quote className="w-8 h-8" />
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-center leading-tight mb-8"
          >
            <span className="bg-primary text-primary-foreground neo-border px-2 inline-block transform -rotate-1">
              {'"Your time is'}
            </span>{" "}
            limited, don't waste it living{" "}
            <span className="bg-secondary neo-border px-2 inline-block transform rotate-1">
              someone else's life.{'"'}
            </span>
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="font-mono text-lg md:text-xl">— STEVE JOBS</span>
          </motion.div>

        
        </motion.div>
      </div>
    </section>
  );
}
