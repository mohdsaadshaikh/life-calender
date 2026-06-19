"use client";

import { motion, useScroll, useTransform, type TargetAndTransition } from "framer-motion";
import { useRef, useMemo } from "react";
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";

function AnimatedCalendarGrid() {
  const colors = [
    "#FF9100", // Brand Orange
    "#FF5B87", // Brand Pink
    "#254ACF", // Brand Purple
    "#52D167", // Brand Green
    "#FFFDF5", // Brand Cream
    "#ffffff",
  ];

  const boxes = useMemo(() => {
    const items = [];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 12; col++) {
        const isFilled = Math.random() > 0.35;
        items.push({
          color: isFilled
            ? colors[Math.floor(Math.random() * (colors.length - 1))]
            : "#ffffff",
          filled: isFilled,
          delay: (row + col) * 0.02,
        });
      }
    }
    return items;
  }, []);

  return (
    <div className="grid grid-cols-12 gap-1.5 md:gap-2 p-4 md:p-6">
      {boxes.map((box, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: box.delay + 0.5,
            duration: 0.4,
            type: "spring",
            stiffness: 200,
          }}
          whileHover={{
            scale: 1.3,
            rotate: 5,
            zIndex: 10,
            transition: { duration: 0.2 },
          }}
          className="aspect-square neo-border cursor-pointer relative"
          style={{ backgroundColor: box.color }}
        >
          {box.filled && (
            <motion.div
              className="absolute inset-0 bg-black/10"
              animate={{ opacity: [0, 0.2, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function FloatingShape({
  className,
  animate,
  delay = 0,
}: {
  className: string;
  animate: TargetAndTransition;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute neo-border ${className}`}
      animate={animate}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -10]);

  const features = [
    { icon: Calendar, text: "Track every week" },
    { icon: Clock, text: "Visualize time" },
    { icon: Target, text: "Set milestones" },
    { icon: Zap, text: "Stay motivated" },
  ];

  return (
    <section
      ref={ref}
      className="min-h-screen relative pt-32 pb-20 px-4 md:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div style={{ y, opacity, scale }} className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -100, rotate: -10 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="inline-block bg-secondary neo-border neo-shadow px-4 py-2 mb-6"
            >
              <span className="flex items-center gap-2 font-bold">
                <Sparkles className="w-5 h-5" />
                VISUALIZE YOUR LIFE
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-6"
            >
              <motion.span style={{ rotate }} className="inline-block">
                START A
              </motion.span>
              <br />
              <span className="bg-primary text-primary-foreground neo-border px-4 inline-block transform -rotate-1">
                VISUAL
              </span>
              <br />
              <span className="text-chart-4">JOURNEY</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl max-w-md mb-8 font-medium"
            >
              Map your milestones and moments in a unique timeline. See your
              entire life at a glance - every week, every year, every memory.
            </motion.p>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? 3 : -3 }}
                  className="bg-muted neo-border px-3 py-2 flex items-center gap-2"
                >
                  <feature.icon className="w-4 h-4" />
                  <span className="font-bold text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button - Links to calendar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/calendar">
                <motion.button
                  whileHover={{ scale: 1.05, x: 8, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-primary-foreground neo-border neo-shadow-lg px-8 py-4 font-bold text-lg flex items-center justify-center gap-2 group"
                >
                  START YOUR CALENDAR
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - Animated 2D Calendar Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            <motion.div
              className="neo-border neo-shadow-xl bg-card overflow-hidden"
              whileHover={{ rotate: -1, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatedCalendarGrid />

              {/* Year labels */}
              <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around py-6 pointer-events-none">
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map((year, i) => (
                  <motion.span
                    key={year}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 0.5, x: 0 }}
                    transition={{ delay: 1 + i * 0.05 }}
                    className="text-[8px] md:text-xs font-bold"
                  >
                    {year}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Decorative floating shapes */}
            {/* <FloatingShape
              className="w-12 h-12 md:w-16 md:h-16 bg-secondary -top-6 -right-6"
              animate={{ y: [-5, 5], rotate: [0, 10, 0] }}
              delay={0}
            />
            <FloatingShape
              className="w-8 h-8 md:w-12 md:h-12 bg-primary -bottom-4 -right-4"
              animate={{ y: [5, -5], rotate: [0, -15, 0] }}
              delay={0.5}
            />
            <FloatingShape
              className="w-10 h-10 md:w-14 md:h-14 bg-accent -top-4 -left-4"
              animate={{ x: [-5, 5], rotate: [0, 20, 0] }}
              delay={1}
            /> */}

            {/* Stats badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary neo-border neo-shadow px-4 py-2"
            >
              <span className="font-bold text-sm text-primary-foreground">
                4680 WEEKS OF LIFE
              </span>
            </motion.div>

            {/* Interactive badge */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary neo-border px-3 py-1"
            >
              <span className="font-bold text-xs">INTERACTIVE</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="bg-card neo-border neo-shadow px-4 py-3"
        >
          <span className="font-bold text-sm">SCROLL DOWN</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
