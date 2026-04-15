# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start Commands

```bash
# Development server (runs on http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Project Overview

**Life Calendar** is a Next.js 16 web application that helps users visualize their life as a grid of weeks. Users can:
- Create multiple life calendars with custom birth dates and life expectancies
- Add events/milestones to specific weeks with categories and colors
- View their life in three modes: grid (default), timeline, or statistics dashboard
- Export calendars as images
- Manage categories and customize display settings

**Tech Stack:**
- Next.js 16 (App Router, dynamic imports for code splitting)
- React 19 with TypeScript
- State Management: Zustand with localStorage persistence
- Styling: Tailwind CSS 4 with Neobrutalism design theme
- Component Library: 57 Shadcn UI components (built on Radix UI primitives)
- Animation: Framer Motion
- Forms: React Hook Form + Zod validation

## Architecture

### Data Flow

1. **State Management** (`lib/life-calendar-store.ts`):
   - Single Zustand store for all app state with localStorage persistence
   - Manages: calendars, events, categories, UI state (zoom, view mode, selected week)
   - Key types stored: `Calendar`, `LifeEvent`, `LifeCategory`, `CalendarSettings`

2. **Business Logic** (`lib/life-calendar-utils.ts`):
   - `generateWeeksData()`: Converts birth date + events into array of 52 * lifeExpectancy weeks
   - Week calculations include: past/current/future classification, date ranges, event mapping
   - Type definitions for `WeekData`, `LifeEvent`, `LifeCategory`, `CalendarSettings`

3. **Main Page Structure** (`app/calendar/page.tsx`):
   - Client component ("use client") that orchestrates all modals and panels
   - Uses dynamic imports for heavy components: StatsDashboard, TimelineView, EventModal, SettingsPanel, WeekDetailsPanel, OnboardingModal
   - Shows loading placeholder during Suspense transitions
   - Manages UI state (onboarding, settings, event editing) via local state

4. **Core Components** (in `components/life-calendar/`):
   - `calendar-grid.tsx`: Renders grid of colored week cells (52 cols × lifeExpectancy rows)
   - `timeline-view.tsx`: Horizontal timeline showing events across life
   - `stats-dashboard.tsx`: Displays aggregate statistics and analytics
   - `event-modal.tsx`: Dialog for creating/editing events with form validation
   - `week-details-panel.tsx`: Slide-out panel showing events for selected week
   - `settings-panel.tsx`: App configuration (theme, settings)
   - `calendar-switcher.tsx`: Sidebar for managing multiple calendars
   - `toolbar.tsx`: View mode switcher, zoom controls
   - `onboarding-modal.tsx`: Initial setup flow to capture birth date

5. **Landing Page** (`app/page.tsx`):
   - Marketing homepage with hero, features, examples, testimonial, footer
   - Links to `/calendar` for app entry point

### Key Files

| File | Purpose |
|------|---------|
| `lib/life-calendar-store.ts` | Zustand store - all app state and actions |
| `lib/life-calendar-utils.ts` | Type definitions and week data generation logic |
| `app/calendar/page.tsx` | Main app orchestrator with modals/panels |
| `components/life-calendar/*.tsx` | Feature-specific components |
| `components/ui/*.tsx` | Shadcn UI primitives (Radix-based) |
| `app/globals.css` | Neobrutalism theme colors and styles |

## Important Patterns & Conventions

### State Management
- Use `useLifeCalendarStore()` hook to access store anywhere
- Store is persisted to localStorage under key `"life-calendar-storage"`
- Only certain state is persisted (calendars, events, categories, settings, isInitialized)
- `getActiveCalendar()` returns currently selected calendar

### Component Patterns
- Use dynamic imports for heavy features (stats, timeline, modals) to improve initial load
- Wrap dynamic imports with Suspense + `<LoadingPlaceholder />`
- Use `"use client"` at top of components that need interactivity
- Prefer `framer-motion` for entrance/exit animations on modals and sections

### Week Data
- Weeks are 0-indexed around the year (0-51)
- `globalWeekNumber` is the absolute week number since birth (0 to ~4680)
- Each `WeekData` has `isPast/isCurrent/isFuture` flags
- Events are stored globally and mapped to weeks by date range

### Type Safety
- `TypeScript` set to strict mode but `ignoreBuildErrors: true` in next.config (should be fixed)
- All data types defined in `lib/life-calendar-utils.ts`
- Use `Omit<Type, 'key'>` for constructor inputs (auto-generated fields)

### Styling
- Tailwind CSS 4 with `@tailwindcss/postcss`
- Neobrutalism theme uses: `#7ed957` (green), `#5ce1e6` (cyan), `#ffde59` (yellow), `#ff914d` (orange), `#ff66c4` (pink)
- Custom classes in `globals.css`: `neo-border`, `neo-shadow`, `neo-border-thick`
- Mobile-first responsive: `md:` and `lg:` breakpoints

## Development Notes

### LocalStorage Persistence
- Auto-persisted via Zustand middleware
- Restored on next app load
- Clear with `localStorage.clear()` in browser console to reset

### Multiple Calendars
- Users can create multiple independent calendars
- Each calendar has its own birth date, life expectancy, and color
- Switch between calendars via `CalendarSwitcher` component
- Only one calendar is "active" at a time

### Events & Categories
- 6 default categories: General Life, Education, Career, Travel, Relationships, Health & Fitness
- Custom categories can be added
- Each event must have a category and color
- Event duration can span multiple weeks via `startDate` and `endDate`

### Performance Optimizations
- Zoom level (0.5x - 3x) dynamically adjusts week cell size and gap
- Grid uses `useMemo` for weeks grouping to avoid recalculations
- Dynamic imports reduce initial bundle size
- useCallback prevents unnecessary re-renders of color getters

### Accessibility Issues (Known)
- Missing ARIA labels on icon buttons
- Modal focus management not implemented
- Color-only differentiation in grid (no text labels)
- Export feature is stubbed (functionality incomplete, but UI present)

### Export Functionality
- Currently a stub - UI exists but no implementation
- Should export calendar grid as PNG/PDF when clicked
- Uses container element: `.calendar-export-area` (for screenshot lib targeting)

## Common Tasks

### Adding a New Event Category
1. Add to `DEFAULT_CATEGORIES` in `lib/life-calendar-utils.ts`
2. New calendars will inherit this category automatically
3. Existing calendars can add it via `addCategory()` in store

### Changing Theme Colors
- Update Neobrutalism palette in `app/globals.css`
- Main colors used: `#7ed957`, `#5ce1e6`, `#ffde59`, `#ff914d`, `#ff66c4`
- Also referenced in calendar-grid.tsx and category defaults

### Adding a New View Mode
1. Create new component in `components/life-calendar/` (e.g., `my-view.tsx`)
2. Import and dynamic-load in `app/calendar/page.tsx`
3. Add case to `viewMode === "my-view"` in render logic
4. Add new option to view mode switcher in `toolbar.tsx`
5. Update store type: `viewMode: "grid" | "timeline" | "stats" | "my-view"`

### Testing a Feature
- No test framework configured (issue mentioned in CODE_REVIEW_AND_FIX_PLAN.md)
- Manual testing required; focus on edge cases (leap years, life expectancy boundaries, event overlaps)
