import { SettingsShell } from "@/views/settings"

export default function SettingsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SettingsShell>{children}</SettingsShell>
}
