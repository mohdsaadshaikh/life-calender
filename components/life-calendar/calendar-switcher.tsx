"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Check, X, Flame } from "lucide-react";
import { useLifeCalendarStore } from "@/lib/life-calendar-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateAge } from "@/lib/life-calendar-utils";

const colors = [
  "#FF9100", // Orange
  "#FF5B87", // Pink
  "#254ACF", // Purple
  "#52D167", // Green
  "#3B82F6", // Blue
  "#FF6B6B", // Rose
];

export function CalendarSwitcher() {
  const {
    calendars,
    activeCalendarId,
    addCalendar,
    deleteCalendar,
    setActiveCalendar,
    updateCalendar,
  } = useLifeCalendarStore();
  const [showNewCalendarForm, setShowNewCalendarForm] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAddCalendar = () => {
    if (newCalendarName.trim()) {
      addCalendar({
        name: newCalendarName,
        color: selectedColor,
        birthDate: new Date(1998, 5, 20), // default birthdate
        lifeExpectancy: 90,
      });
      setNewCalendarName("");
      setSelectedColor(colors[0]);
      setShowNewCalendarForm(false);
    }
  };

  const handleEditCalendar = (id: string) => {
    const calendar = calendars.find((c) => c.id === id);
    if (calendar) {
      setEditingId(id);
      setEditingName(calendar.name);
    }
  };

  const handleSaveEdit = (id: string) => {
    if (editingName.trim()) {
      updateCalendar(id, { name: editingName });
      setEditingId(null);
      setEditingName("");
    }
  };

  // Sort calendars so the active one is always #1 (or keep index order but active is styled gold)
  // Let's sort with active calendar first, then others, to mimic the leaderboard
  const sortedCalendars = [...calendars].sort((a, b) => {
    if (a.id === activeCalendarId) return -1;
    if (b.id === activeCalendarId) return 1;
    return 0;
  });

  return (
    <div className="bg-card neo-border-thick p-4 md:p-6 bg-[#FCFBF9] text-black">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-extrabold uppercase tracking-wider font-sans">
          STREAKS LEADERBOARD
        </h3>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewCalendarForm(!showNewCalendarForm)}
          className="bg-primary text-black neo-border p-1.5 flex items-center justify-center cursor-pointer"
          aria-label="Add Calendar"
        >
          <Plus className="w-5 h-5 stroke-[3px]" />
        </motion.button>
      </div>

      <p className="text-xs font-bold text-muted-foreground mb-4">
        Track weeks & milestones to get your streak for today
      </p>

      {/* New Calendar Form */}
      <AnimatePresence>
        {showNewCalendarForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-[#EFE8D8] neo-border overflow-hidden"
          >
            <div className="space-y-4">
              <Input
                placeholder="Calendar name (e.g., Habits, Work, Life)"
                value={newCalendarName}
                onChange={(e) => setNewCalendarName(e.target.value)}
                className="neo-border bg-white text-black font-bold"
              />
              <div className="flex gap-2 flex-wrap justify-center">
                {colors.map((color) => (
                  <motion.button
                    key={color}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 neo-border cursor-pointer ${selectedColor === color ? "ring-2 ring-black" : ""
                      }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddCalendar}
                  className="flex-1 bg-primary text-black font-extrabold neo-border cursor-pointer"
                >
                  <Check className="w-4 h-4 mr-2 stroke-[3px]" />
                  Create
                </Button>
                <Button
                  onClick={() => setShowNewCalendarForm(false)}
                  variant="outline"
                  className="flex-1 bg-white hover:bg-gray-100 font-extrabold neo-border cursor-pointer text-black"
                >
                  <X className="w-4 h-4 mr-2 stroke-[3px]" />
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendars List */}
      <div className="space-y-3">
        {sortedCalendars.map((calendar, index) => {
          const isActive = activeCalendarId === calendar.id;
          const age = calculateAge(calendar.birthDate || new Date(1998, 5, 20));
          const streakText = `${age.years || 26}d streak`;

          // Determine row style based on leaderboard rank (index)
          let rowClass = "bg-white hover:bg-[#FAF5E6] text-black";
          if (isActive) {
            // Rank 1
            rowClass = "bg-[#FF9100] text-black font-extrabold animate-pulse-subtle";
          } else if (index === 1) {
            // Rank 2
            rowClass = "bg-[#FF5B87] text-black font-extrabold";
          } else if (index === 2) {
            // Rank 3
            rowClass = "bg-[#254ACF] text-white font-extrabold";
          }

          return (
            <motion.div
              key={calendar.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`neo-border p-3 cursor-pointer flex items-center justify-between gap-2 transition-all select-none ${rowClass}`}
              onClick={() => {
                if (editingId !== calendar.id) {
                  setActiveCalendar(calendar.id);
                }
              }}
            >
              {editingId === calendar.id ? (
                <div className="flex gap-2 items-center w-full" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="neo-border text-sm flex-1 bg-[#FCFBF9] text-black font-bold"
                    autoFocus
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleSaveEdit(calendar.id)}
                    className="bg-green-500 text-white neo-border p-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3px]" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setEditingId(null)}
                    className="bg-red-500 text-white neo-border p-2 cursor-pointer"
                  >
                    <X className="w-4 h-4 stroke-[3px]" />
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Rank Circle */}
                    <div className="w-6 h-6 flex items-center justify-center font-black text-sm border-2 border-black rounded-full bg-white text-black select-none shrink-0">
                      {index + 1}
                    </div>
                    {/* Calendar Info */}
                    <span className="font-extrabold tracking-wide truncate max-w-[140px] font-sans">
                      {calendar.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Streak badge */}
                    <span className="text-xs font-black uppercase bg-black/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-current shrink-0" />
                      {streakText}
                    </span>

                    {/* Edit/Delete options */}
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCalendar(calendar.id);
                        }}
                        className="opacity-70 hover:opacity-100 p-1"
                        title="Edit Calendar"
                      >
                        <Edit2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                      </motion.button>
                      {calendars.length > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCalendar(calendar.id);
                          }}
                          className="opacity-70 hover:opacity-100 hover:text-red-500 p-1"
                          title="Delete Calendar"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {calendars.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-muted-foreground"
        >
          <p className="font-bold mb-4">No calendars yet</p>
          <Button
            onClick={() => setShowNewCalendarForm(true)}
            className="bg-primary text-black font-extrabold neo-border cursor-pointer"
          >
            Create first calendar
          </Button>
        </motion.div>
      )}
    </div>
  );
}
