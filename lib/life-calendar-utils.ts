// Life Calendar utility functions

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
  { id: "life", name: "General Life", color: "#7ed957", icon: "Heart" },
  {
    id: "education",
    name: "Education",
    color: "#5ce1e6",
    icon: "GraduationCap",
  },
  { id: "career", name: "Career", color: "#ffde59", icon: "Briefcase" },
  { id: "travel", name: "Travel", color: "#ff914d", icon: "Plane" },
  {
    id: "relationships",
    name: "Relationships",
    color: "#ff66c4",
    icon: "Users",
  },
  {
    id: "health",
    name: "Health & Fitness",
    color: "#a855f7",
    icon: "Activity",
  },
  { id: "hobbies", name: "Hobbies", color: "#38bdf8", icon: "Sparkles" },
  { id: "milestones", name: "Milestones", color: "#f472b6", icon: "Trophy" },
];

export const DEFAULT_SETTINGS: CalendarSettings = {
  birthDate: new Date(1990, 0, 1),
  lifeExpectancy: 90,
  weekStartsOn: 1,
  showFutureWeeks: true,
  theme: "light",
};

export function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
  );
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

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

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}
