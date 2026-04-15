"use client"

import { motion } from "framer-motion"
import { useLifeCalendarStore } from "@/lib/life-calendar-store"
import { getLifeStats } from "@/lib/life-calendar-utils"
import { useMemo } from "react"
import { Calendar, Clock, Target, TrendingUp, Award, Zap, BarChart3 } from "lucide-react"

export function StatsDashboard() {
  const { settings, events, categories } = useLifeCalendarStore()

  const stats = useMemo(
    () => getLifeStats(settings.birthDate, settings.lifeExpectancy, events),
    [settings.birthDate, settings.lifeExpectancy, events],
  )

  const statCards = [
    {
      icon: Calendar,
      label: "AGE",
      value: `${stats.age.years}y ${stats.age.months}m`,
      subvalue: `${stats.age.weeks.toLocaleString()} weeks`,
      color: "bg-primary",
    },
    {
      icon: Clock,
      label: "WEEKS LIVED",
      value: stats.weeksLived.toLocaleString(),
      subvalue: `${stats.percentageLived.toFixed(1)}% of life`,
      color: "bg-secondary",
    },
    {
      icon: Target,
      label: "WEEKS REMAINING",
      value: stats.weeksRemaining.toLocaleString(),
      subvalue: `Based on ${settings.lifeExpectancy} years`,
      color: "bg-accent",
    },
    {
      icon: Award,
      label: "TOTAL EVENTS",
      value: stats.totalEvents.toString(),
      subvalue: "Milestones recorded",
      color: "bg-chart-4",
    },
  ]

  const progressData = [
    { label: "Life Progress", value: stats.percentageLived, color: "#7ed957" },
    {
      label: "Days This Year",
      value: ((new Date().getMonth() * 30 + new Date().getDate()) / 365) * 100,
      color: "#ffde59",
    },
    { label: "Current Month", value: (new Date().getDate() / 30) * 100, color: "#ff914d" },
  ]

  return (
    <div className="space-y-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20, rotate: i % 2 === 0 ? -3 : 3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
            className={`${stat.color} neo-border neo-shadow-lg p-4 md:p-6`}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-card neo-border w-12 h-12 flex items-center justify-center mb-4"
            >
              <stat.icon className="w-6 h-6" />
            </motion.div>
            <p className="text-xs font-bold mb-1 opacity-80">{stat.label}</p>
            <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
            <p className="text-xs mt-1 opacity-70">{stat.subvalue}</p>
          </motion.div>
        ))}
      </div>

      {/* Life Progress Bars */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card neo-border neo-shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary neo-border p-2">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold">LIFE PROGRESS</h3>
        </div>

        <div className="space-y-6">
          {progressData.map((item, i) => (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">{item.label}</span>
                <span className="font-mono text-sm">{item.value.toFixed(1)}%</span>
              </div>
              <div className="h-6 bg-muted neo-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                  className="h-full neo-border-thick"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-foreground text-background neo-border neo-shadow-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary neo-border p-2">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-bold">EVENTS BY CATEGORY</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.categoryBreakdown.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.05 }}
              whileHover={{ scale: 1.1 }}
              className="text-center p-4 neo-border"
              style={{ backgroundColor: cat.color }}
            >
              <p className="text-3xl font-bold text-foreground">{cat.eventCount}</p>
              <p className="text-xs font-bold text-foreground mt-1">{cat.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-secondary neo-border neo-shadow-lg p-8 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          className="inline-block mb-4"
        >
          <Zap className="w-12 h-12" />
        </motion.div>
        <p className="text-xl md:text-2xl font-bold italic">
          "The way we spend our days is the way we spend our lives."
        </p>
        <p className="mt-3 font-medium opacity-70">- Annie Dillard</p>
      </motion.div>
    </div>
  )
}
