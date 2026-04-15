"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useLifeCalendarStore } from "@/lib/life-calendar-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const colors = [
  "#7ed957",
  "#ffde59",
  "#ff914d",
  "#5ce1e6",
  "#ff66c4",
  "#a855f7",
  "#38bdf8",
  "#f472b6",
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
        birthDate: new Date(1990, 0, 1),
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

  return (
    <div className="bg-card neo-border p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">My Calendars</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewCalendarForm(!showNewCalendarForm)}
          className="bg-primary text-primary-foreground neo-border p-2"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* New Calendar Form */}
      <AnimatePresence>
        {showNewCalendarForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-muted neo-border overflow-hidden"
          >
            <div className="space-y-4">
              <Input
                placeholder="Calendar name (e.g., Career, Travel, Goals)"
                value={newCalendarName}
                onChange={(e) => setNewCalendarName(e.target.value)}
                className="neo-border"
              />
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 neo-border ${selectedColor === color ? "ring-2 ring-foreground" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddCalendar}
                  className="flex-1 bg-primary text-primary-foreground"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Create
                </Button>
                <Button
                  onClick={() => setShowNewCalendarForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendars List */}
      <div className="space-y-2">
        {calendars.map((calendar) => (
          <motion.div
            key={calendar.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`neo-border p-3 cursor-pointer transition-all ${
              activeCalendarId === calendar.id
                ? "bg-primary bg-opacity-20 ring-2 ring-primary"
                : "hover:bg-muted"
            }`}
            onClick={() => {
              if (editingId !== calendar.id) {
                setActiveCalendar(calendar.id);
              }
            }}
          >
            {editingId === calendar.id ? (
              <div className="flex gap-2 items-center">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="neo-border text-sm flex-1"
                  autoFocus
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveEdit(calendar.id);
                  }}
                  className="bg-green-500 text-white neo-border p-2"
                >
                  <Check className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-4 h-4 neo-border rounded-full"
                    style={{ backgroundColor: calendar.color }}
                  />
                  <span className="font-bold">{calendar.name}</span>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCalendar(calendar.id);
                    }}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                  {calendars.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCalendar(calendar.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {calendars.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-muted-foreground"
        >
          <p className="font-medium mb-4">No calendars yet</p>
          <Button
            onClick={() => setShowNewCalendarForm(true)}
            className="bg-primary text-primary-foreground"
          >
            Create your first calendar
          </Button>
        </motion.div>
      )}
    </div>
  );
}
