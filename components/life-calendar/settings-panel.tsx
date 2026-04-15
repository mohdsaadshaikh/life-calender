"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import { Settings, Calendar, Clock, Download, Upload } from "lucide-react"
import { useLifeCalendarStore } from "@/lib/life-calendar-store"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

interface SettingsPanelProps {
  onClose: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { settings, setSettings, events, categories } = useLifeCalendarStore()
  const { toast } = useToast()
  const [birthDateInput, setBirthDateInput] = useState(new Date(settings.birthDate).toISOString().split("T")[0])

  const handleBirthDateChange = (value: string) => {
    setBirthDateInput(value)
    if (value) {
      setSettings({ birthDate: new Date(value) })
    }
  }

  const handleExport = () => {
    try {
      const data = {
        settings,
        events,
        categories,
        exportedAt: new Date().toISOString(),
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `life-calendar-backup-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "Calendar data exported successfully!",
      })
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export calendar data",
        variant: "destructive",
      })
    }
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read file. Please try again.",
        variant: "destructive",
      })
    }

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)

        // Validate the imported data structure
        if (!data.settings) {
          throw new Error("Invalid calendar file format")
        }

        if (data.settings) {
          setSettings({
            ...data.settings,
            birthDate: new Date(data.settings.birthDate),
          })
        }

        toast({
          title: "Success",
          description: "Calendar data imported successfully!",
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Invalid calendar file format"

        toast({
          title: "Import Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card neo-border-thick z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-panel-title"
    >
       {/* Header */}
       <div className="sticky top-0 bg-secondary p-4 border-b-3 border-border flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="bg-card neo-border p-2">
             <Settings className="w-5 h-5" />
           </div>
           <h2 id="settings-panel-title" className="text-xl font-bold">SETTINGS</h2>
         </div>
         <motion.button
           whileHover={{ scale: 1.1, rotate: 90 }}
           whileTap={{ scale: 0.9 }}
           onClick={onClose}
           className="bg-card neo-border neo-shadow px-4 py-2 font-bold"
           aria-label="Close settings panel"
         >
           CLOSE
         </motion.button>
       </div>

       <form className="p-6 space-y-8">
         {/* Birth Date - Fieldset */}
         <fieldset>
           <motion.legend initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 font-bold text-lg mb-3">
             <Calendar className="w-5 h-5" /> BIRTH DATE
           </motion.legend>
           <Input
             id="birth-date-input"
             type="date"
             value={birthDateInput}
             onChange={(e) => handleBirthDateChange(e.target.value)}
             className="neo-border neo-shadow font-mono text-lg p-4"
             required
             aria-required="true"
           />
         </fieldset>

         {/* Life Expectancy - Fieldset */}
         <fieldset>
           <motion.legend
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="flex items-center gap-2 font-bold text-lg mb-3"
           >
             <Clock className="w-5 h-5" /> LIFE EXPECTANCY
           </motion.legend>
           <div className="bg-muted neo-border p-4">
             <div className="flex justify-between mb-4">
               <label htmlFor="life-expectancy-slider" className="font-mono">Years</label>
               <span className="font-bold text-2xl" aria-live="polite">{settings.lifeExpectancy}</span>
             </div>
             <Slider
               id="life-expectancy-slider"
               value={[settings.lifeExpectancy]}
               onValueChange={([value]) => setSettings({ lifeExpectancy: value })}
               min={50}
               max={120}
               step={1}
               className="w-full"
               aria-label="Life expectancy in years"
             />
             <div className="flex justify-between mt-2 text-sm text-muted-foreground">
               <span>50</span>
               <span>120</span>
             </div>
           </div>
         </fieldset>

         {/* Data Management - Fieldset */}
         <fieldset>
           <motion.legend
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="font-bold text-lg mb-3"
           >
             DATA MANAGEMENT
           </motion.legend>
           <div className="space-y-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                className="w-full bg-primary neo-border neo-shadow p-4 font-bold flex items-center justify-center gap-3"
                aria-label="Export calendar data as JSON backup"
              >
                <Download className="w-5 h-5" />
                EXPORT BACKUP
              </motion.button>

              <label htmlFor="import-file-input" className="block">
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-secondary neo-border neo-shadow p-4 font-bold flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Upload className="w-5 h-5" />
                  IMPORT BACKUP
                </motion.div>
                <input 
                  id="import-file-input"
                  type="file" 
                  accept=".json" 
                  onChange={handleImport} 
                  className="hidden" 
                  aria-label="Upload calendar data from JSON backup file"
                />
              </label>
           </div>
         </fieldset>

         {/* Quick Stats - Fieldset */}
         <fieldset className="bg-foreground text-background neo-border p-6" disabled>
           <legend className="font-bold mb-4">QUICK STATS</legend>
           <div className="grid grid-cols-2 gap-4">
             <div className="bg-primary neo-border p-3 text-center">
               <p className="text-2xl font-bold text-foreground">{events.length}</p>
               <p className="text-xs font-bold text-foreground">Events</p>
             </div>
             <div className="bg-secondary neo-border p-3 text-center">
               <p className="text-2xl font-bold text-foreground">{categories.length}</p>
               <p className="text-xs font-bold text-foreground">Categories</p>
             </div>
             <div className="bg-accent neo-border p-3 text-center">
               <p className="text-2xl font-bold text-foreground">{settings.lifeExpectancy * 52}</p>
               <p className="text-xs font-bold text-foreground">Total Weeks</p>
             </div>
             <div className="bg-chart-4 neo-border p-3 text-center">
               <p className="text-2xl font-bold text-foreground">
                 {Math.floor(
                   (new Date().getTime() - new Date(settings.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 7),
                 )}
               </p>
               <p className="text-xs font-bold text-foreground">Weeks Lived</p>
             </div>
           </div>
         </fieldset>
       </form>
    </motion.div>
  )
}
