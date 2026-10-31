import type { DateFormat, ThemeMode, WeekStart } from "@/lib/db"

export const DATE_FORMATS: DateFormat[] = [
  "dd MMM yyyy",
  "dd/MM/yyyy",
  "MMM dd, yyyy",
]

export const WEEK_STARTS: { value: WeekStart; label: string }[] = [
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
  { value: "monday", label: "Monday" },
]

export const THEME_LABELS: Record<ThemeMode, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
}

/** Renders a date in the given pattern so format options preview themselves. */
export function formatDatePattern(d: Date, pattern: DateFormat): string {
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yyyy = String(d.getFullYear())
  const MMM = d.toLocaleDateString("en-US", { month: "short" })
  switch (pattern) {
    case "dd/MM/yyyy":
      return `${dd}/${mm}/${yyyy}`
    case "MMM dd, yyyy":
      return `${MMM} ${dd}, ${yyyy}`
    case "dd MMM yyyy":
    default:
      return `${dd} ${MMM} ${yyyy}`
  }
}
