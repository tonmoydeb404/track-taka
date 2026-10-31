import { AnalyticsShell } from "@/views/analytics"

export default function AnalyticsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AnalyticsShell>{children}</AnalyticsShell>
}
