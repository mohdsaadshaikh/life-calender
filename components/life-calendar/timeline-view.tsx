"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo, useState, useEffect } from "react";
import { useLifeCalendarStore } from "@/lib/life-calendar-store";
import { formatDate } from "@/lib/life-calendar-utils";
import type { WeekData, LifeEvent } from "@/lib/life-calendar-utils";

interface TimelineViewProps {
  onWeekClick: (week: WeekData) => void;
}

export function TimelineView({ onWeekClick }: TimelineViewProps) {
  const { events, settings, getWeeksData } = useLifeCalendarStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const { scrollYProgress } = useScroll(
    isHydrated && containerRef.current
      ? {
        target: containerRef,
        offset: ["start start", "end end"],
      }
      : {},
  );

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      ),
    [events],
  );

  const weeks = useMemo(() => getWeeksData(), [getWeeksData, settings]);

  const getWeekForEvent = (event: LifeEvent) => {
    const eventDate = new Date(event.startDate);
    return weeks.find(
      (w) => w.startDate <= eventDate && w.endDate >= eventDate,
    );
  };

  if (sortedEvents.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-card neo-border neo-shadow-lg p-8"
        >
          <p className="text-xl font-bold mb-2">NO EVENTS YET</p>
          <p className="text-muted-foreground">
            Click on a week in the grid view to add your first event!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative pb-20">
      {/* Timeline Line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-muted neo-border">
        <motion.div
          style={{ height: lineHeight }}
          className="w-full bg-primary"
        />
      </div>

      {/* Events */}
      <div className="space-y-12">
        {sortedEvents.map((event, index) => {
          const week = getWeekForEvent(event);
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`relative flex items-center ${isEven ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}
            >
              {/* Content */}
              <motion.div
                whileHover={{ scale: 1.02, rotate: isEven ? 1 : -1 }}
                onClick={() => week && onWeekClick(week)}
                className={`
                  ml-16 md:ml-0 md:w-[45%] cursor-pointer
                  ${isEven ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"}
                `}
              >
                <div
                  className="neo-border neo-shadow-lg p-6"
                  style={{ backgroundColor: event.color }}
                >
                  <span className="inline-block bg-card neo-border px-3 py-1 font-mono text-sm mb-3">
                    {formatDate(new Date(event.startDate))}
                    {event.endDate &&
                      ` - ${formatDate(new Date(event.endDate))}`}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm opacity-80">{event.description}</p>
                  )}
                  <div className="mt-3 flex items-center gap-2 justify-start md:justify-end">
                    <span className="bg-card/80 neo-border px-2 py-1 text-xs font-bold">
                      {event.category.name}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Center dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", delay: index * 0.1 }}
                viewport={{ once: true }}
                className="absolute left-6 md:left-1/2 md:-translate-x-1/2 w-6 h-6 neo-border bg-card z-10"
                style={{ borderColor: event.color }}
              >
                <div
                  className="absolute inset-1 neo-border"
                  style={{ backgroundColor: event.color }}
                />
              </motion.div>

              {/* Year indicator */}
              {week && (
                <div
                  className={`
                    hidden md:block md:w-[45%] text-muted-foreground font-mono
                    ${isEven ? "md:pl-8 text-left" : "md:pr-8 text-right"}
                  `}
                >
                  Year {week.yearNumber}, Week {week.weekNumber}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
