"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Calendar, Edit } from "lucide-react"
import { useLifeCalendarStore } from "@/lib/life-calendar-store"
import type { WeekData, LifeEvent } from "@/lib/life-calendar-utils"
import { formatDate, calculateAge } from "@/lib/life-calendar-utils"

interface WeekDetailsPanelProps {
  week: WeekData
  onClose: () => void
  onAddEvent: () => void
  onEditEvent: (event: LifeEvent) => void
}

export function WeekDetailsPanel({ week, onClose, onAddEvent, onEditEvent }: WeekDetailsPanelProps) {
  const { settings } = useLifeCalendarStore()

  const ageAtWeek = calculateAge(settings.birthDate, week.startDate)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card neo-border-thick z-40 overflow-y-auto"
      >
        {/* Header */}
        <div
          className="sticky top-0 p-4 border-b-3 border-border flex items-center justify-between"
          style={{
            backgroundColor: week.events.length > 0 ? week.events[0].color : "#7ed957",
          }}
        >
          <div>
            <h2 className="text-xl font-bold">
              YEAR {week.yearNumber}, WEEK {week.weekNumber}
            </h2>
            <p className="text-sm font-mono opacity-80">
              {formatDate(week.startDate)} - {formatDate(week.endDate)}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1}}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="bg-card neo-border p-2"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="p-6 space-y-6">
          {/* Age at this week */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted neo-border p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="font-bold">AGE AT THIS WEEK</span>
            </div>
            <p className="text-3xl font-bold">
              {ageAtWeek.years} years, {ageAtWeek.months} months
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Week #{week.globalWeekNumber.toLocaleString()} of your life
            </p>
          </motion.div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2"
          >
            {week.isPast && <span className="bg-primary neo-border px-3 py-1 font-bold text-sm">PAST</span>}
            {week.isCurrent && (
              <span className="bg-accent neo-border px-3 py-1 font-bold text-sm animate-pulse">CURRENT WEEK</span>
            )}
            {week.isFuture && <span className="bg-muted neo-border px-3 py-1 font-bold text-sm">FUTURE</span>}
          </motion.div>

          {/* Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">EVENTS ({week.events.length})</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddEvent}
                className="bg-accent text-accent-foreground neo-border neo-shadow px-4 py-2 font-bold text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                ADD
              </motion.button>
            </div>

            {week.events.length === 0 ? (
              <div className="bg-muted neo-border p-6 text-center">
                <p className="text-muted-foreground mb-3">No events for this week</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onAddEvent}
                  className="bg-primary neo-border neo-shadow px-4 py-2 font-bold text-sm"
                >
                  ADD YOUR FIRST EVENT
                </motion.button>
              </div>
            ) : (
              <div className="space-y-3">
                {week.events.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ x: 8 }}
                    onClick={() => onEditEvent(event)}
                    className="neo-border neo-shadow p-4 cursor-pointer hover:neo-shadow-lg transition-all"
                    style={{ backgroundColor: event.color }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm opacity-80 mt-1 line-clamp-2">{event.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="bg-card/80 neo-border px-2 py-0.5 text-xs font-bold">
                            {event.category.name}
                          </span>
                          <span className="text-xs font-mono opacity-70">{formatDate(new Date(event.startDate))}</span>
                        </div>
                      </div>
                      <button className="p-2 bg-card/50 neo-border">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Navigation hints */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-4 border-t-3 border-border"
          >
            <p className="text-sm text-muted-foreground text-center">
              Click on any week in the grid to view its details
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
