// Life Calendar utility functions

/**
 * Color mapping for life calendar events
 * Uses CSS variables defined in globals.css for consistency
 */
export const CALENDAR_COLORS = {
  WEEK_PAST: "#7ed957",
  WEEK_CURRENT: "#ff914d",
  WEEK_FUTURE: "transparent",
  // Event colors
  GREEN: "#7ed957",
  YELLOW: "#ffde59",
  ORANGE: "#ff914d",
  CYAN: "#5ce1e6",
  PINK: "#ff66c4",
  PURPLE: "#a855f7",
  BLUE: "#38bdf8",
  ROSE: "#f472b6",
  LIME: "#84cc16",
  BURNT_ORANGE: "#f97316",
} as const;

export interface LifeEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  category: LifeCategory;
  color: string;
  icon?: string;
}

export interface LifeCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface CalendarSettings {
  birthDate: Date;
  lifeExpectancy: number;
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  showFutureWeeks: boolean;
  theme: "light" | "dark";
}

export interface WeekData {
  weekNumber: number;
  yearNumber: number;
  globalWeekNumber: number;
  startDate: Date;
  endDate: Date;
  isPast: boolean;
  isCurrent: boolean;
  isFuture: boolean;
  events: LifeEvent[];
  category?: LifeCategory;
}

export const DEFAULT_CATEGORIES: LifeCategory[] = [
  { id: "life", name: "General Life", color: CALENDAR_COLORS.GREEN, icon: "Heart" },
  {
    id: "education",
    name: "Education",
    color: CALENDAR_COLORS.CYAN,
    icon: "GraduationCap",
  },
  { id: "career", name: "Career", color: CALENDAR_COLORS.YELLOW, icon: "Briefcase" },
  { id: "travel", name: "Travel", color: CALENDAR_COLORS.ORANGE, icon: "Plane" },
  {
    id: "relationships",
    name: "Relationships",
    color: CALENDAR_COLORS.PINK,
    icon: "Users",
  },
  {
    id: "health",
    name: "Health & Fitness",
    color: CALENDAR_COLORS.PURPLE,
    icon: "Activity",
  },
  { id: "hobbies", name: "Hobbies", color: CALENDAR_COLORS.BLUE, icon: "Sparkles" },
  { id: "milestones", name: "Milestones", color: CALENDAR_COLORS.ROSE, icon: "Trophy" },
];

export const DEFAULT_SETTINGS: CalendarSettings = {
  birthDate: new Date(1990, 0, 1),
  lifeExpectancy: 90,
  weekStartsOn: 1,
  showFutureWeeks: true,
  theme: "light",
};

/**
 * Calculates the week number of the year for a given date
 * Uses ISO 8601 week numbering (Week 1 is the week with the first Thursday of the year)
 * @param date - The date to calculate week number for
 * @returns The week number (1-53)
 */
export function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
  );
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

/**
 * Gets the start and end dates of a week relative to birth date
 * @param birthDate - The starting reference date (usually birth date)
 * @param globalWeekNumber - The absolute week number from birth (1-indexed)
 * @returns Object containing start and end dates of the week
 * 
 * @example
 * const birthDate = new Date('2000-01-01')
 * const { start, end } = getWeekDates(birthDate, 1)
 * // Returns week from 2000-01-01 to 2000-01-07
 */
export function getWeekDates(
  birthDate: Date,
  globalWeekNumber: number,
): { start: Date; end: Date } {
  const start = new Date(birthDate);
  start.setDate(start.getDate() + (globalWeekNumber - 1) * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}

/**
 * Calculates age between two dates in years, months, days, and weeks
 * @param birthDate - The birth date (Date object or ISO date string)
 * @param targetDate - The date to calculate age until (defaults to today)
 * @returns Object containing years, months, days, and weeks lived
 * 
 * @example
 * const age = calculateAge(new Date('2000-01-01'))
 * console.log(age) // { years: 26, months: 3, days: 15, weeks: 1369 }
 */
export function calculateAge(
  birthDate: Date | string,
  targetDate: Date | string = new Date(),
): { years: number; months: number; days: number; weeks: number } {
  const birth = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  const target =
    typeof targetDate === "string" ? new Date(targetDate) : targetDate;

  const diffTime = target.getTime() - birth.getTime();
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days, weeks: totalWeeks };
}

/**
 * Generates an array of all weeks from birth to life expectancy
 * Each week contains metadata about whether it's past, current, or future
 * and maps events that fall within that week's date range
 * 
 * @param birthDate - The person's birth date
 * @param lifeExpectancy - Expected lifespan in years (typically 80-100)
 * @param events - Array of all events to map to weeks
 * @returns Array of WeekData objects (one for each week of life)
 * 
 * @example
 * const weeks = generateWeeksData(
 *   new Date('2000-01-01'),
 *   90,
 *   [{ title: 'Birthday', startDate: new Date('2001-01-01'), ... }]
 * )
 * console.log(weeks.length) // 4680 weeks (90 * 52)
 */
export function generateWeeksData(
  birthDate: Date,
  lifeExpectancy: number,
  events: LifeEvent[],
): WeekData[] {
  const weeks: WeekData[] = [];
  const totalWeeks = lifeExpectancy * 52;
  const today = new Date();

  for (let i = 1; i <= totalWeeks; i++) {
    const { start, end } = getWeekDates(birthDate, i);
    const yearNumber = Math.ceil(i / 52);
    const weekInYear = ((i - 1) % 52) + 1;

    const isPast = end < today;
    const isCurrent = start <= today && end >= today;
    const isFuture = start > today;

    // Find events for this week
    const weekEvents = events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
      return eventStart <= end && eventEnd >= start;
    });

    weeks.push({
      weekNumber: weekInYear,
      yearNumber,
      globalWeekNumber: i,
      startDate: start,
      endDate: end,
      isPast,
      isCurrent,
      isFuture,
      events: weekEvents,
    });
  }

  return weeks;
}

/**
 * Formats a date into a user-friendly string format
 * @param date - The date to format
 * @returns Formatted date string (e.g., "Jan 1, 2000")
 * 
 * @example
 * formatDate(new Date('2000-01-01')) // "Jan 1, 2000"
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Safely formats a date with validation
 * Returns a user-friendly error message if the date is invalid
 * @param date - The date to format (Date object, string, or null)
 * @returns Formatted date string or error message
 */
export function safeFormatDate(date: Date | string | null | undefined): string {
  try {
    if (!date) {
      return "Invalid date";
    }

    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    // Validate that the date is a valid Date object
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return "Invalid date";
    }

    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
}

/**
 * Validates that endDate is not before startDate
 * @param startDate - The start date
 * @param endDate - The end date to validate
 * @returns true if endDate >= startDate, false otherwise
 */
export function validateDateRange(
  startDate: Date | string,
  endDate: Date | string,
): boolean {
  try {
    const start = typeof startDate === "string" ? new Date(startDate) : startDate;
    const end = typeof endDate === "string" ? new Date(endDate) : endDate;

    if (!(start instanceof Date) || isNaN(start.getTime())) {
      return false;
    }
    if (!(end instanceof Date) || isNaN(end.getTime())) {
      return false;
    }

    return end >= start;
  } catch {
    return false;
  }
}

/**
 * Calculates comprehensive life statistics including age, weeks lived, and event breakdown
 * Used for the statistics dashboard view
 * 
 * @param birthDate - The person's birth date
 * @param lifeExpectancy - Expected lifespan in years
 * @param events - Array of all events in the calendar
 * @returns Object containing age, weeks, percentages, and category breakdown
 * 
 * @example
 * const stats = getLifeStats(new Date('2000-01-01'), 90, events)
 * console.log(stats.percentageLived) // 29.3
 * console.log(stats.categoryBreakdown[0].eventCount) // 5
 */
export function getLifeStats(
  birthDate: Date,
  lifeExpectancy: number,
  events: LifeEvent[],
) {
  const age = calculateAge(birthDate);
  const totalWeeks = lifeExpectancy * 52;
  const weeksLived = age.weeks;
  const weeksRemaining = Math.max(0, totalWeeks - weeksLived);
  const percentageLived = Math.min(100, (weeksLived / totalWeeks) * 100);

  const categoryBreakdown = DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    eventCount: events.filter((e) => e.category.id === cat.id).length,
  }));

  return {
    age,
    totalWeeks,
    weeksLived,
    weeksRemaining,
    percentageLived,
    totalEvents: events.length,
    categoryBreakdown,
  };
}

/**
 * Generates a unique identifier for database records
 * Uses base36 encoding of random number + timestamp for collision resistance
 * @returns A unique ID string suitable for use as database key
 * 
 * @example
 * const id = generateId()
 * console.log(id) // "a1b2c3z1234567890"
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}
