"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { PageHeader } from "@/components/common/page-header"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

import { SettingsNav } from "./settings-nav"

/**
 * Frame for every /dashboard/settings page.
 * Phone: the section cards at /dashboard/settings, each section on its own page
 * with a back link. lg+: the cards become a side nav next to the section.
 */
export function SettingsShell({ children }: { children: ReactNode }) {
  const isIndex = usePathname() === ROUTES.settings

  return (
    <div className="page-stack">
      <div className={cn(!isIndex && "max-lg:hidden")}>
        <PageHeader title="Settings" subtitle="Preferences and your data" />
      </div>
      <div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start lg:gap-10">
        <SettingsNav
          className={cn(!isIndex && "max-lg:hidden", "lg:sticky lg:top-8")}
        />
        <div className={cn("min-w-0 lg:max-w-2xl", isIndex && "max-lg:hidden")}>
          {children}
        </div>
      </div>
    </div>
  )
}
