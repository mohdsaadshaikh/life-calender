"use client";

import { useRef, useMemo, useCallback } from "react";
import { useLifeCalendarStore } from "@/lib/life-calendar-store";
import { CALENDAR_COLORS } from "@/lib/life-calendar-utils";
import type { WeekData } from "@/lib/life-calendar-utils";

interface CalendarGridProps {
  onWeekClick: (week: WeekData) => void;
}

export function CalendarGrid({ onWeekClick }: CalendarGridProps) {
  const { settings, zoomLevel, getWeeksData, selectedWeek, categories } =
    useLifeCalendarStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const weeks = useMemo(() => getWeeksData(), [getWeeksData, settings]);

  const years = useMemo(() => {
    const grouped: WeekData[][] = [];
    for (let i = 0; i < settings.lifeExpectancy; i++) {
      grouped.push(weeks.slice(i * 52, (i + 1) * 52));
    }
    return grouped;
  }, [weeks, settings.lifeExpectancy]);

  const getWeekColor = useCallback((week: WeekData) => {
    if (week.events.length > 0) {
      return week.events[0].color;
    }
    if (week.isCurrent) return CALENDAR_COLORS.WEEK_CURRENT;
    if (week.isPast) return CALENDAR_COLORS.WEEK_PAST;
    return CALENDAR_COLORS.WEEK_FUTURE;
  }, []);

  const cellSize = 18 * zoomLevel;
  const gap = 2 * zoomLevel;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Scrollable grid container */}
      <div
        ref={containerRef}
        className="overflow-auto p-1 bg-transparent border-0 max-w-full w-full max-h-[550px]"
      >
        <div className="flex justify-start lg:justify-start w-max">
          {/* Year column */}
          <div className="flex flex-col mr-2" style={{ gap }}>
            <div
              style={{ height: cellSize }}
              className="flex items-center justify-end pr-2"
            >
              <span className="text-[10px] font-mono font-bold text-muted-foreground">
                YEAR
              </span>
            </div>
            {years.map((_, yearIndex) => (
              <div
                key={yearIndex}
                style={{ height: cellSize }}
                className="flex items-center justify-end pr-2"
              >
                <span className="text-[10px] font-mono font-bold">
                  {yearIndex + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Weeks grid wrapper */}
          <div>
            {/* Week numbers header */}
            <div className="flex mb-1" style={{ gap }}>
              {Array.from({ length: 52 }).map((_, i) => (
                <div
                  key={i}
                  style={{ width: cellSize, height: cellSize }}
                  className="flex items-center justify-center"
                >
                  {(i + 1) % 4 === 0 && (
                    <span className="text-[8px] font-mono text-muted-foreground">
                      {i + 1}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Calendar grid buttons */}
            <div className="flex flex-col" style={{ gap }}>
              {years.map((yearWeeks, yearIndex) => (
                <div key={yearIndex} className="flex" style={{ gap }}>
                  {yearWeeks.map((week) => (
                    <button
                      key={week.globalWeekNumber}
                      onClick={() => onWeekClick(week)}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: getWeekColor(week),
                      }}
                      className={`
                          neo-border transition-all relative cursor-pointer
                          ${week.isCurrent ? "ring-2 ring-accent ring-offset-1" : ""}
                          ${selectedWeek?.globalWeekNumber === week.globalWeekNumber ? "ring-2 ring-foreground" : ""}
                          ${week.isFuture && week.events.length === 0 ? "bg-muted/30" : ""}
                          hover:scale-110 hover:z-10
                        `}
                      title={`Year ${week.yearNumber}, Week ${week.weekNumber}`}
                      aria-label={`Week ${week.weekNumber} of Year ${week.yearNumber}${week.isCurrent ? " (current)" : ""}${week.events.length > 0 ? ` (${week.events.length} event${week.events.length > 1 ? "s" : ""})` : ""}`}
                      aria-pressed={selectedWeek?.globalWeekNumber === week.globalWeekNumber}
                    >
                      {week.events.length > 1 && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent neo-border text-[6px] flex items-center justify-center font-bold">
                          {week.events.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend (Outside scroll container and centered) */}
      <div className="flex flex-wrap gap-4 md:gap-6 justify-center items-center w-full mt-4 border-t-2 border-dashed border-black/10 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 neo-border" style={{ backgroundColor: CALENDAR_COLORS.WEEK_PAST }} />
          <span className="text-sm font-bold">Lived</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 neo-border ring-2 ring-accent ring-offset-1" style={{ backgroundColor: CALENDAR_COLORS.WEEK_CURRENT }} />
          <span className="text-sm font-bold">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 neo-border bg-muted/30" />
          <span className="text-sm font-bold">Future</span>
        </div>
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2">
            <div
              className="w-4 h-4 neo-border"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-sm font-bold">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
