"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useLifeCalendarStore } from "@/lib/life-calendar-store";
import { CalendarGrid } from "@/components/life-calendar/calendar-grid";
import { CalendarSwitcher } from "@/components/life-calendar/calendar-switcher";
import { ErrorBoundary } from "@/components/error-boundary";
import type { WeekData, LifeEvent } from "@/lib/life-calendar-utils";
import { calculateAge, safeFormatDate } from "@/lib/life-calendar-utils";
import { Calendar, ArrowLeft, Flame, LogOut, Plus, Keyboard, HelpCircle, BarChart3, Clock, GitBranch, Search, ZoomIn, ZoomOut } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/components/ui/logo";

// Lazy load heavy components
const StatsDashboard = dynamic(
  () =>
    import("@/components/life-calendar/stats-dashboard").then((mod) => ({
      default: mod.StatsDashboard,
    })),
  { loading: () => <LoadingPlaceholder /> },
);

const TimelineView = dynamic(
  () =>
    import("@/components/life-calendar/timeline-view").then((mod) => ({
      default: mod.TimelineView,
    })),
  { loading: () => <LoadingPlaceholder /> },
);

const EventModal = dynamic(
  () =>
    import("@/components/life-calendar/event-modal").then((mod) => ({
      default: mod.EventModal,
    })),
  { ssr: false, loading: () => <LoadingPlaceholder /> },
);

const SettingsPanel = dynamic(
  () =>
    import("@/components/life-calendar/settings-panel").then((mod) => ({
      default: mod.SettingsPanel,
    })),
  { ssr: false, loading: () => <LoadingPlaceholder /> },
);

const WeekDetailsPanel = dynamic(
  () =>
    import("@/components/life-calendar/week-details-panel").then((mod) => ({
      default: mod.WeekDetailsPanel,
    })),
  { ssr: false, loading: () => <LoadingPlaceholder /> },
);


function LoadingPlaceholder() {
  return (
    <div className="w-full h-96 bg-[#FCFBF9] neo-border rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-muted-foreground font-mono">Loading...</div>
    </div>
  );
}

function RetroLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6F0E5] gap-6 horizons-bg select-none">
      {/* Rotating Logo Icon */}
      <motion.div
        animate={{ 
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.08, 1, 1.08, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3.5, 
          ease: "easeInOut" 
        }}
      >
        <LogoIcon className="w-16 h-16 shadow-[4px_4px_0px_#000] border-[4px]" />
      </motion.div>

      {/* Retro Striped Progress Bar */}
      <div className="w-64 h-6 bg-[#FCFBF9] border-[3px] border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_#000] relative">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
          className="absolute inset-y-0 w-1/2 h-full bg-[#7ed957] border-r-[3px] border-black"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.08) 8px, rgba(0,0,0,0.08) 16px)"
          }}
        />
      </div>

      {/* Pulsing Text */}
      <div className="text-center font-black uppercase text-sm tracking-widest font-mono text-black/70">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Mapping your timeline...
        </motion.span>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const {
    isInitialized,
    viewMode,
    setViewMode,
    selectedWeek,
    setSelectedWeek,
    calendars,
    activeCalendarId,
    getWeeksData,
    zoomLevel,
    setZoomLevel,
    resetStore,
  } = useLifeCalendarStore();

  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<LifeEvent | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if the user just signed up (detected by query param)
    const params = new URLSearchParams(window.location.search);
    if (params.get("signup") === "true") {
      resetStore();
      router.push("/calendar/onboarding");

      // Clean up the URL parameter to avoid re-triggering on manual refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [resetStore, router]);

  useEffect(() => {
    if (mounted && !isInitialized) {
      router.push("/calendar/onboarding");
    }
  }, [mounted, isInitialized, router]);

  // Extract active calendar details
  const activeCalendar = calendars.find((c) => c.id === activeCalendarId) || null;
  const calendarName = activeCalendar ? activeCalendar.name : "My Life";
  const birthDate = activeCalendar ? new Date(activeCalendar.birthDate) : new Date(1998, 5, 20);
  const lifeExpectancy = activeCalendar ? activeCalendar.lifeExpectancy : 90;

  const age = calculateAge(birthDate);
  const weeksLived = age.weeks;
  const totalWeeks = lifeExpectancy * 52;
  const percentageLived = Math.min(100, Math.max(0, (weeksLived / totalWeeks) * 100));

  // Keyboard navigation WASD & Arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't navigate if user is typing in a modal or input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        showEventModal ||
        showSettings ||
        window.location.pathname.endsWith("/onboarding")
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const weeks = getWeeksData();
      if (weeks.length === 0) return;

      let nextIndex = -1;
      if (!selectedWeek) {
        if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
          setSelectedWeek(weeks[0]);
        }
        return;
      }

      const currentIndex = weeks.findIndex(
        (w) => w.globalWeekNumber === selectedWeek.globalWeekNumber
      );

      if (key === "a" || e.key === "ArrowLeft") {
        nextIndex = Math.max(0, currentIndex - 1);
      } else if (key === "d" || e.key === "ArrowRight") {
        nextIndex = Math.min(weeks.length - 1, currentIndex + 1);
      } else if (key === "w" || e.key === "ArrowUp") {
        nextIndex = Math.max(0, currentIndex - 52);
      } else if (key === "s" || e.key === "ArrowDown") {
        nextIndex = Math.min(weeks.length - 1, currentIndex + 52);
      }

      if (nextIndex !== -1) {
        e.preventDefault();
        setSelectedWeek(weeks[nextIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedWeek, setSelectedWeek, getWeeksData, showEventModal, showSettings]);

  const handleWeekClick = (week: WeekData) => {
    setSelectedWeek(week);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEditEvent = (event: LifeEvent) => {
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleCloseEventModal = () => {
    setShowEventModal(false);
    setEditingEvent(null);
  };

  if (!mounted) {
    return <RetroLoader />;
  }

  return (
    <ErrorBoundary>
      <main className="h-screen horizons-bg p-4 md:p-6 lg:p-8 flex flex-col gap-6 text-black">
        {/* Header Section (Outlined retro title style) */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 w-full max-w-[1600px] mx-auto select-none">
          <div className="flex items-center gap-4">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.1, x: -4 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#FCFBF9] neo-border p-2 cursor-pointer flex items-center justify-center"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-5 h-5 stroke-[3px]" />
              </motion.button>
            </Link>
            <div className="flex flex-col leading-none">
              <h1 className="horizons-logo-text text-4xl md:text-5xl lg:text-6xl tracking-tight select-none">
                {calendarName.toUpperCase()}
              </h1>
            </div>
          </div>

          {/* Navigation Guide Capsule (Moved to top header) */}
          <div className="bg-white neo-border px-4 py-2 flex items-center justify-center gap-2.5 font-extrabold text-xs tracking-wide select-none shadow-[2px_2px_0px_#000]">
            <span className="uppercase text-neutral-500 shrink-0 text-[10px]">USE</span>
            <div className="flex gap-0.5">
              {["W", "A", "S", "D"].map((key) => (
                <kbd
                  key={key}
                  className="px-1.5 py-0.5 border border-black rounded bg-white text-black font-black text-[9px] shadow-[1px_1px_0px_#000] select-none"
                >
                  {key}
                </kbd>
              ))}
            </div>
            <span className="uppercase text-neutral-500 shrink-0 text-[10px]">OR</span>
            <span className="bg-white border border-black rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider select-none shadow-[1px_1px_0px_#000]">
              MOUSE
            </span>
            <span className="uppercase text-black tracking-wider shrink-0 text-[10px]">TO NAVIGATE</span>
          </div>

          {/* Subtitle */}
          <div className="font-extrabold text-sm md:text-lg tracking-wider font-mono bg-white/40 neo-border px-6 py-2 select-none">
            IT&apos;S! TIME! TO! PLAN!
          </div>
        </header>

        {/* Dashboard Main Grid Layout */}
        <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
          {/* Column 1: Sidebar with Streaks Leaderboard and Nexus Progress Card (lg:col-span-4 xl:col-span-3) */}
          <section className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            <CalendarSwitcher />

            {/* Life Progress Card (Stacked below Switcher) */}
            <div className="bg-[#0C0A09] text-white neo-border-thick p-6 flex flex-col justify-between relative overflow-hidden min-h-[250px]">
              {/* Stylized Hourglass SVG Background */}
              <div className="absolute -top-2 -right-2 pointer-events-none opacity-15">
                <svg className="w-32 h-32 stroke-white fill-none stroke-[1.5]" viewBox="0 0 24 24">
                  <path d="M5 2h14" />
                  <path d="M5 22h14" />
                  <path d="M19 2v4c0 3-2 5-4 6c2 1 4 3 4 6v4" />
                  <path d="M5 2v4c0 3 2 5 4 6c-2 1-4 3-4 6v4" />
                  {/* Falling sand */}
                  <path d="M12 11.5v6" strokeDasharray="1 1" />
                  {/* Sand in top bulb */}
                  <path d="M7 6.5c1.5 1 3.5 1 5 1s3.5 0 5-1V6H7v.5z" fill="white" className="opacity-40" />
                  {/* Sand in bottom bulb */}
                  <path d="M6 19.5c1.5-1 3.5-1.5 6-1.5s4.5.5 6 1.5V20H6v-.5z" fill="white" className="opacity-70" />
                </svg>
              </div>


              <div>
                <h3 className="text-2xl font-black tracking-tight">{calendarName} Progress</h3>
                <p className="text-xs text-neutral-400 font-bold uppercase select-none mt-1">
                  {safeFormatDate(birthDate)} • <span className="font-extrabold text-white/80">{age.years}y {age.months}m</span>
                </p>
              </div>

              {/* Progress bar container */}
              <div className="relative z-10 space-y-2 mt-4">
                <div className="flex justify-between items-end text-xs font-black uppercase">
                  <span>Lived progress</span>
                  <span className="font-mono text-sm">{percentageLived.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-[#1C1917] border-3 border-white rounded-xl h-8 p-1 flex items-center overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentageLived}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-white h-full rounded-lg"
                  />
                </div>
                <div className="text-[10px] text-neutral-400 font-extrabold uppercase text-right tracking-wider select-none mt-1">
                  {weeksLived}/{totalWeeks} WEEKS COMPLETED
                </div>
              </div>


            </div>
          </section>

          {/* Column 2: Spacious Main Content Area (lg:col-span-8 xl:col-span-9) */}
          <section className="lg:col-span-8 xl:col-span-9 flex flex-col">
            <div className="bg-[#FCFBF9] neo-border-thick p-4 md:p-6 flex-1 flex flex-col">
              {/* Sleek Toolbar header containing titles, zoom slider, and view switches */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b-2 border-dashed border-black">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-wide font-display">
                    {viewMode === "grid" && "My Weeks of Life"}
                    {viewMode === "timeline" && "Life Timeline"}
                    {viewMode === "stats" && "Life Analytics"}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Magnifying Glass Zoom Controls */}
                  {viewMode === "grid" && (
                    <div className="flex items-center gap-1 bg-[#EFE8D8] border-2 border-black rounded-xl px-2.5 py-1 shadow-[2px_2px_0px_#000]">
                      <Search className="w-4 h-4 text-black mr-1" />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setZoomLevel(zoomLevel - 0.25)}
                        disabled={zoomLevel <= 0.5}
                        className="p-1 border border-black rounded bg-white text-black hover:bg-secondary disabled:opacity-40 cursor-pointer flex items-center justify-center"
                        aria-label="Zoom out"
                      >
                        <ZoomOut className="w-3.5 h-3.5 stroke-[2.5px]" />
                      </motion.button>
                      <span className="font-mono text-xs font-black min-w-[40px] text-center select-none">
                        {Math.round(zoomLevel * 100)}%
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setZoomLevel(zoomLevel + 0.25)}
                        disabled={zoomLevel >= 3}
                        className="p-1 border border-black rounded bg-white text-black hover:bg-secondary disabled:opacity-40 cursor-pointer flex items-center justify-center"
                        aria-label="Zoom in"
                      >
                        <ZoomIn className="w-3.5 h-3.5 stroke-[2.5px]" />
                      </motion.button>
                    </div>
                  )}

                  {/* View Toggles */}
                  <div className="flex items-center border-2 border-black rounded-xl overflow-hidden bg-white shadow-[2px_2px_0px_#000]">
                    {[
                      { id: "grid" as const, label: "Grid" },
                      { id: "timeline" as const, label: "Timeline" },
                      { id: "stats" as const, label: "Stats" },
                    ].map((mode) => (
                      <motion.button
                        key={mode.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewMode(mode.id)}
                        className={`px-3 py-1.5 text-xs font-black uppercase border-r-2 border-black last:border-r-0 cursor-pointer transition-all ${viewMode === mode.id
                          ? "bg-primary text-black"
                          : "bg-white text-black hover:bg-[#EFE8D8]"
                          }`}
                      >
                        {mode.label}
                      </motion.button>
                    ))}
                  </div>

                  {/* Add Event Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddEvent}
                    className="bg-primary text-black border-2 border-black rounded-xl px-4 py-1.5 text-xs font-black uppercase cursor-pointer shadow-[2px_2px_0px_#000]"
                  >
                    Add Event
                  </motion.button>

                  {/* Settings Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSettings(true)}
                    className="bg-white hover:bg-[#EFE8D8] border-2 border-black rounded-xl px-4 py-1.5 text-xs font-black uppercase cursor-pointer shadow-[2px_2px_0px_#000]"
                  >
                    Settings
                  </motion.button>
                </div>
              </div>

              {/* View Content Area */}
              <div className="flex-1 flex flex-col justify-start">
                <Suspense fallback={<LoadingPlaceholder />}>
                  {viewMode === "grid" && (
                    <CalendarGrid onWeekClick={handleWeekClick} />
                  )}
                  {viewMode === "timeline" && (
                    <TimelineView onWeekClick={handleWeekClick} />
                  )}
                  {viewMode === "stats" && <StatsDashboard />}
                </Suspense>
              </div>
            </div>
          </section>
        </div>





        <AnimatePresence>
          {showSettings && (
            <SettingsPanel onClose={() => setShowSettings(false)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedWeek && !showEventModal && (
            <WeekDetailsPanel
              week={selectedWeek}
              onClose={() => setSelectedWeek(null)}
              onAddEvent={handleAddEvent}
              onEditEvent={handleEditEvent}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEventModal && (
            <EventModal
              week={selectedWeek}
              event={editingEvent}
              onClose={handleCloseEventModal}
            />
          )}
        </AnimatePresence>

        {/* Floating User Profile Button */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-white neo-border p-1.5 shadow-[4px_4px_0px_0px_#000] hover:scale-105 transition-transform">
          <UserButton />
        </div>
      </main>
    </ErrorBoundary>
  );
}
