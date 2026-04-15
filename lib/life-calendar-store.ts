"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  LifeEvent,
  LifeCategory,
  CalendarSettings,
  WeekData,
} from "./life-calendar-utils";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_SETTINGS,
  generateWeeksData,
  generateId,
} from "./life-calendar-utils";

export interface Calendar {
  id: string;
  name: string;
  color: string;
  birthDate: Date;
  lifeExpectancy: number;
  isActive: boolean;
  createdAt: Date;
}

interface LifeCalendarState {
  // Calendars
  calendars: Calendar[];
  activeCalendarId: string | null;
  addCalendar: (
    calendar: Omit<Calendar, "id" | "createdAt" | "isActive">,
  ) => void;
  deleteCalendar: (id: string) => void;
  setActiveCalendar: (id: string) => void;
  updateCalendar: (id: string, updates: Partial<Calendar>) => void;
  getActiveCalendar: () => Calendar | null;

  // Settings
  settings: CalendarSettings;
  setSettings: (settings: Partial<CalendarSettings>) => void;

  // Events
  events: LifeEvent[];
  addEvent: (event: Omit<LifeEvent, "id">) => void;
  updateEvent: (id: string, event: Partial<LifeEvent>) => void;
  deleteEvent: (id: string) => void;

  // Categories
  categories: LifeCategory[];
  addCategory: (category: Omit<LifeCategory, "id">) => void;
  updateCategory: (id: string, category: Partial<LifeCategory>) => void;
  deleteCategory: (id: string) => void;

  // UI State
  selectedWeek: WeekData | null;
  setSelectedWeek: (week: WeekData | null) => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  viewMode: "grid" | "timeline" | "stats";
  setViewMode: (mode: "grid" | "timeline" | "stats") => void;

  // Calendar initialized
  isInitialized: boolean;
  initializeCalendar: (birthDate: Date, calendarName?: string) => void;

  // Get computed data
  getWeeksData: () => WeekData[];
}

export const useLifeCalendarStore = create<LifeCalendarState>()(
  persist(
    (set, get) => ({
      calendars: [],
      activeCalendarId: null,
      addCalendar: (calendarData) => {
        const newCalendar: Calendar = {
          ...calendarData,
          id: generateId(),
          isActive: true,
          createdAt: new Date(),
        };
        set((state) => ({
          calendars: [...state.calendars, newCalendar],
          activeCalendarId: newCalendar.id,
        }));
      },
      deleteCalendar: (id) =>
        set((state) => {
          const remainingCalendars = state.calendars.filter((c) => c.id !== id);
          return {
            calendars: remainingCalendars,
            activeCalendarId:
              state.activeCalendarId === id
                ? remainingCalendars[0]?.id || null
                : state.activeCalendarId,
          };
        }),
      setActiveCalendar: (id) => set({ activeCalendarId: id }),
      updateCalendar: (id, updates) =>
        set((state) => ({
          calendars: state.calendars.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),
      getActiveCalendar: () => {
        const { calendars, activeCalendarId } = get();
        return calendars.find((c) => c.id === activeCalendarId) || null;
      },

      settings: DEFAULT_SETTINGS,
      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      events: [],
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, id: generateId() }],
        })),
      updateEvent: (id, eventUpdate) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...eventUpdate } : e,
          ),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      categories: DEFAULT_CATEGORIES,
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, { ...category, id: generateId() }],
        })),
      updateCategory: (id, categoryUpdate) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...categoryUpdate } : c,
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),

      selectedWeek: null,
      setSelectedWeek: (week) => set({ selectedWeek: week }),
      zoomLevel: 1,
      setZoomLevel: (level) =>
        set({ zoomLevel: Math.max(0.5, Math.min(3, level)) }),
      viewMode: "grid",
      setViewMode: (mode) => set({ viewMode: mode }),

      isInitialized: false,
      initializeCalendar: (birthDate, calendarName = "My Life") => {
        const { calendars } = get();
        if (calendars.length === 0) {
          const newCalendar: Calendar = {
            id: generateId(),
            name: calendarName,
            color: "#7ed957",
            birthDate,
            lifeExpectancy: 90,
            isActive: true,
            createdAt: new Date(),
          };
          set({
            isInitialized: true,
            calendars: [newCalendar],
            activeCalendarId: newCalendar.id,
            settings: { ...DEFAULT_SETTINGS, birthDate },
          });
        }
      },

      getWeeksData: () => {
        const { settings, events } = get();
        return generateWeeksData(
          settings.birthDate,
          settings.lifeExpectancy,
          events,
        );
      },
    }),
    {
      name: "life-calendar-storage",
      partialize: (state) => ({
        calendars: state.calendars,
        activeCalendarId: state.activeCalendarId,
        settings: state.settings,
        events: state.events,
        categories: state.categories,
        isInitialized: state.isInitialized,
      }),
    },
  ),
);
