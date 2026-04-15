"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { X, Calendar, Tag, Type, AlignLeft, Palette, Trash2, Save } from "lucide-react"
import { z } from "zod"
import { useLifeCalendarStore } from "@/lib/life-calendar-store"
import type { WeekData, LifeEvent, LifeCategory } from "@/lib/life-calendar-utils"
import { formatDate } from "@/lib/life-calendar-utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface EventModalProps {
  week: WeekData | null
  event?: LifeEvent | null
  onClose: () => void
}

const PRESET_COLORS = [
  "#7ed957",
  "#ffde59",
  "#ff914d",
  "#5ce1e6",
  "#ff66c4",
  "#a855f7",
  "#38bdf8",
  "#f472b6",
  "#84cc16",
  "#f97316",
]

const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Start date is invalid"),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), "End date is invalid").optional(),
}).refine(
  (data) => {
    if (data.endDate && data.startDate) {
      return new Date(data.endDate) >= new Date(data.startDate)
    }
    return true
  },
  {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  }
)

export function EventModal({ week, event, onClose }: EventModalProps) {
  const { addEvent, updateEvent, deleteEvent, categories } = useLifeCalendarStore()
  const { toast } = useToast()

  const [title, setTitle] = useState(event?.title || "")
  const [description, setDescription] = useState(event?.description || "")
  const [startDate, setStartDate] = useState(
    event?.startDate
      ? new Date(event.startDate).toISOString().split("T")[0]
      : week?.startDate.toISOString().split("T")[0] || "",
  )
  const [endDate, setEndDate] = useState(event?.endDate ? new Date(event.endDate).toISOString().split("T")[0] : "")
  const [selectedCategory, setSelectedCategory] = useState<LifeCategory>(event?.category || categories[0])
  const [color, setColor] = useState(event?.color || selectedCategory.color)

  useEffect(() => {
    if (!event) {
      setColor(selectedCategory.color)
    }
  }, [selectedCategory, event])

  const handleSave = () => {
    try {
      const validatedData = eventSchema.parse({
        title,
        description: description || undefined,
        startDate,
        endDate: endDate || undefined,
      })

      const eventData = {
        title: validatedData.title,
        description: validatedData.description || "",
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
        category: selectedCategory,
        color,
      }

      if (event) {
        updateEvent(event.id, eventData)
        toast({
          title: "Success",
          description: "Event updated successfully!",
        })
      } else {
        addEvent(eventData)
        toast({
          title: "Success",
          description: "Event created successfully!",
        })
      }

      onClose()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors[0]?.message || "Validation error"
        toast({
          title: "Validation Error",
          description: message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save event",
          variant: "destructive",
        })
      }
    }
  }

  const handleDelete = () => {
    if (event) {
      deleteEvent(event.id)
      toast({
        title: "Success",
        description: "Event deleted successfully!",
      })
      onClose()
    }
  }

  if (!week) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -5, y: 50 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          exit={{ scale: 0.8, rotate: 5, y: 50 }}
          transition={{ type: "spring", damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card neo-border neo-shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b-3 border-border bg-primary">
            <h2 className="text-xl font-bold">{event ? "EDIT EVENT" : "ADD EVENT"}</h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="bg-card neo-border p-2"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Week Info */}
          <div className="p-4 bg-muted border-b-3 border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-bold">
                Year {week.yearNumber}, Week {week.weekNumber}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              {formatDate(week.startDate)} - {formatDate(week.endDate)}
            </p>
          </div>

          {/* Form */}
          <div className="p-4 space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-bold">
                <Type className="w-4 h-4" /> Title
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title..."
                className="neo-border"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-bold">
                <AlignLeft className="w-4 h-4" /> Description
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this event..."
                rows={3}
                className="neo-border"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="neo-border font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">End Date (optional)</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="neo-border font-mono"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-bold">
                <Tag className="w-4 h-4" /> Category
              </Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 neo-border font-bold text-sm transition-all ${
                      selectedCategory.id === cat.id ? "neo-shadow" : ""
                    }`}
                    style={{
                      backgroundColor: selectedCategory.id === cat.id ? cat.color : "transparent",
                    }}
                  >
                    {cat.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-bold">
                <Palette className="w-4 h-4" /> Color
              </Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((presetColor) => (
                  <motion.button
                    key={presetColor}
                    whileHover={{ scale: 1.2, rotate: 45 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setColor(presetColor)}
                    className={`w-10 h-10 neo-border ${
                      color === presetColor ? "neo-shadow ring-2 ring-foreground" : ""
                    }`}
                    style={{ backgroundColor: presetColor }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t-3 border-border flex gap-3">
            {event && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground neo-border neo-shadow px-4 py-3 font-bold flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                DELETE
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="bg-muted neo-border px-4 py-3 font-bold ml-auto"
            >
              CANCEL
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, x: 4, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={!title.trim()}
              className="bg-accent text-accent-foreground neo-border neo-shadow px-6 py-3 font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {event ? "UPDATE" : "SAVE"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
