import { pgTable, varchar, timestamp, integer, boolean, text } from "drizzle-orm/pg-core";

/**
 * Calendars Table
 * Maps to the Calendar interface
 */
export const calendars = pgTable("calendars", {
  id: varchar("id", { length: 128 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 50 }).notNull(),
  birthDate: timestamp("birth_date", { mode: "date" }).notNull(),
  lifeExpectancy: integer("life_expectancy").notNull().default(90),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

/**
 * Categories Table
 * Maps to the LifeCategory interface.
 * calendarId is nullable to support default global categories.
 */
export const categories = pgTable("categories", {
  id: varchar("id", { length: 128 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 50 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  calendarId: varchar("calendar_id", { length: 128 }).references(() => calendars.id, { onDelete: "cascade" }),
});

/**
 * Events Table
 * Maps to the LifeEvent interface
 */
export const events = pgTable("events", {
  id: varchar("id", { length: 128 }).primaryKey(),
  calendarId: varchar("calendar_id", { length: 128 }).notNull().references(() => calendars.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull().default(""),
  startDate: timestamp("start_date", { mode: "date" }).notNull(),
  endDate: timestamp("end_date", { mode: "date" }),
  categoryId: varchar("category_id", { length: 128 }).references(() => categories.id, { onDelete: "set null" }),
  color: varchar("color", { length: 50 }).notNull(),
  icon: varchar("icon", { length: 50 }),
});

/**
 * Global Settings Table
 * Maps to CalendarSettings and global state (e.g. activeCalendarId)
 */
export const globalSettings = pgTable("global_settings", {
  id: integer("id").primaryKey(), // Enforced single row (e.g., id = 1)
  activeCalendarId: varchar("active_calendar_id", { length: 128 }).references(() => calendars.id, { onDelete: "set null" }),
  weekStartsOn: integer("week_starts_on").notNull().default(1), // 0 = Sunday, 1 = Monday
  showFutureWeeks: boolean("show_future_weeks").notNull().default(true),
  theme: varchar("theme", { length: 20 }).notNull().default("light"),
});

// Relations can be added here if you want to use drizzle relations query API later.
export type DbCalendar = typeof calendars.$inferSelect;
export type NewDbCalendar = typeof calendars.$inferInsert;

export type DbCategory = typeof categories.$inferSelect;
export type NewDbCategory = typeof categories.$inferInsert;

export type DbEvent = typeof events.$inferSelect;
export type NewDbEvent = typeof events.$inferInsert;

export type DbGlobalSettings = typeof globalSettings.$inferSelect;
export type NewDbGlobalSettings = typeof globalSettings.$inferInsert;
