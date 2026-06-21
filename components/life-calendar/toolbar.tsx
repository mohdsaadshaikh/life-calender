"use client"

import { motion } from "framer-motion"
import { Grid3X3, GitBranch, BarChart3, Settings, ZoomIn, ZoomOut, Download, Share2 } from "lucide-react"
import { useLifeCalendarStore } from "@/lib/life-calendar-store"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

interface ToolbarProps {
  onOpenSettings: () => void
}

export function Toolbar({ onOpenSettings }: ToolbarProps) {
  const { viewMode, setViewMode, zoomLevel, setZoomLevel } = useLifeCalendarStore()
  const { toast } = useToast()

  const viewOptions = [
    { id: "grid" as const, icon: Grid3X3, label: "Grid View" },
    { id: "timeline" as const, icon: GitBranch, label: "Timeline View" },
    { id: "stats" as const, icon: BarChart3, label: "Statistics" },
  ]

  const handleExportImage = async () => {
    toast({
      title: "Export Feature",
      description: "PNG/PDF export coming soon!",
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "My Life Calendar",
        text: "Check out my life calendar visualization!",
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Copied!",
        description: "Calendar link copied to clipboard",
      })
    }
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card neo-border neo-shadow-lg p-3 flex flex-wrap items-center justify-between gap-4"
      >
        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          {viewOptions.map((option) => (
            <Tooltip key={option.id}>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewMode(option.id)}
                  className={`p-3 neo-border transition-all ${viewMode === option.id ? "bg-primary neo-shadow" : "bg-muted hover:bg-secondary"
                    }`}
                  aria-label={option.label}
                  aria-pressed={viewMode === option.id}
                >
                  <option.icon className="w-5 h-5" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent className="neo-border ">
                <p className="font-bold">{option.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Zoom Controls */}
        {viewMode === "grid" && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold hidden sm:block">ZOOM</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setZoomLevel(zoomLevel - 0.25)}
              disabled={zoomLevel <= 0.5}
              className="p-2 neo-border bg-muted hover:bg-secondary disabled:opacity-50"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </motion.button>
            <span className="font-mono w-16 text-center neo-border px-2 py-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setZoomLevel(zoomLevel + 0.25)}
              disabled={zoomLevel >= 3}
              className="p-2 neo-border bg-muted hover:bg-secondary disabled:opacity-50"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </motion.button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleExportImage}
                className="p-3 neo-border bg-secondary hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
                aria-label="Export as image (coming soon)"
              >
                <Download className="w-5 h-5" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent className="neo-border">
              <p className="font-bold">Export as Image (Coming Soon)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-3 neo-border bg-secondary hover:bg-primary"
                aria-label="Share calendar"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent className="neo-border ">
              <p className="font-bold">Share</p>
            </TooltipContent>
          </Tooltip>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onOpenSettings}
            className="p-3 neo-border bg-accent neo-shadow"
            aria-label="Open settings"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
