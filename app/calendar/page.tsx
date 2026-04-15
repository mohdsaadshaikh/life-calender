"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useLifeCalendarStore } from "@/lib/life-calendar-store";
import { CalendarGrid } from "@/components/life-calendar/calendar-grid";
import { Toolbar } from "@/components/life-calendar/toolbar";
import { CalendarSwitcher } from "@/components/life-calendar/calendar-switcher";
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee";
import { ErrorBoundary } from "@/components/error-boundary";
import type { WeekData, LifeEvent } from "@/lib/life-calendar-utils";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

const OnboardingModal = dynamic(
  () =>
    import("@/components/life-calendar/onboarding-modal").then((mod) => ({
      default: mod.OnboardingModal,
    })),
  { ssr: false, loading: () => <LoadingPlaceholder /> },
);

function LoadingPlaceholder() {
  return (
    <div className="w-full h-96 bg-card neo-border rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-muted-foreground font-mono">Loading...</div>
    </div>
  );
}

function TypewriterLoader() {
  const text = "Loading your life calendar...";
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-primary neo-border neo-shadow p-6"
      >
        <Calendar className="w-12 h-12 text-primary-foreground" />
      </motion.div>
      <div className="bg-card neo-border neo-shadow px-8 py-4 min-w-[300px]">
        <span className="font-bold text-lg">{displayedText}</span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-3 h-6 bg-foreground ml-1 align-middle"
        />
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 neo-border"
            style={{
              backgroundColor:
                i === 0 ? "#7ed957" : i === 1 ? "#ffde59" : "#ff914d",
            }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const { isInitialized, viewMode, selectedWeek, setSelectedWeek } =
    useLifeCalendarStore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<LifeEvent | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isInitialized) {
      setShowOnboarding(true);
    }
  }, [mounted, isInitialized]);

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
    return <TypewriterLoader />;
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-background relative">
        <BuyMeCoffeeButton />

        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 z-30 bg-card neo-border-thick px-4 py-4"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.1, x: -4 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-muted neo-border p-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="bg-primary neo-border p-2">
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg md:text-xl">
                  MY LIFE CALENDAR
                </span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 lg:grid lg:grid-cols-[300px_1fr] lg:gap-8 lg:items-start">
          {/* Calendar Switcher Sidebar */}
          <div className="lg:sticky lg:top-20">
            <CalendarSwitcher />
          </div>

          {/* Calendar View */}
          <div className="space-y-6">
            {/* Toolbar */}
            <Toolbar onOpenSettings={() => setShowSettings(true)} />

            {/* View Content */}
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="calendar-export-area"
            >
              <Suspense fallback={<LoadingPlaceholder />}>
                {viewMode === "grid" && (
                  <CalendarGrid onWeekClick={handleWeekClick} />
                )}
                {viewMode === "timeline" && (
                  <TimelineView onWeekClick={handleWeekClick} />
                )}
                {viewMode === "stats" && <StatsDashboard />}
              </Suspense>
            </motion.div>
          </div>
        </div>

        {/* Panels and Modals */}
        <AnimatePresence>
          {showOnboarding && (
            <OnboardingModal onComplete={() => setShowOnboarding(false)} />
          )}
        </AnimatePresence>

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
      </main>
    </ErrorBoundary>
  );
}
