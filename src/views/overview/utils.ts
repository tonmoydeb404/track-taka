/** Greeting for the current time of day. */
export function greetingFor(d: Date): string {
  const h = d.getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

/** Short month label from a 'YYYY-MM' key, e.g. 'Nov'. */
export function shortMonth(month: string): string {
  const [y, m] = month.split("-").map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short" })
}
