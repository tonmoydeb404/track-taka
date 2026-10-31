import { AppShell } from "@/components/layout"
import { AccountsProvider } from "@/hooks/data"
import { DatabaseProvider } from "@/lib/db"

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <DatabaseProvider>
      <AccountsProvider>
        <AppShell>{children}</AppShell>
      </AccountsProvider>
    </DatabaseProvider>
  )
}
