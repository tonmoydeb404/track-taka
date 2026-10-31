"use client"

import { SlidersHorizontal } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

import { useSettings, useSettingsActions } from "@/hooks"
import type { DateFormat, WeekStart } from "@/lib/db"

import { InstallAppGroup } from "../components/install-app"
import {
  SettingsDetailHeader,
  SettingsGroup,
  SettingsRow,
} from "../components/settings-ui"
import { ThemePicker } from "../components/theme-picker"
import { DATE_FORMATS, formatDatePattern, WEEK_STARTS } from "../utils"

// A select that reads as a value in a row, not a boxed field
const VALUE_SELECT =
  "w-auto min-w-0 gap-1.5 border-0 bg-transparent px-0 text-base shadow-none dark:bg-transparent dark:hover:bg-transparent"

export function GeneralSection() {
  const settings = useSettings()
  const actions = useSettingsActions()
  const today = new Date()

  async function updateSettings(
    patch: Parameters<typeof actions.update>[0]
  ): Promise<void> {
    try {
      await actions.update(patch)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't save the setting")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <SettingsDetailHeader
        icon={SlidersHorizontal}
        title="General"
        description="How the app looks and how dates are shown."
      />

      <div className="flex flex-col gap-6">
        <div>
          <ThemePicker
            value={settings.theme}
            onChange={(theme) => updateSettings({ theme })}
          />
          <p className="px-1 pt-2 text-sm text-muted-foreground">
            System follows your phone or computer&rsquo;s light and dark
            setting.
          </p>
        </div>

        <SettingsGroup>
          <SettingsRow
            label="Currency"
            description="Fixed to Bangladeshi Taka (BDT)"
          >
            ৳ Taka
          </SettingsRow>
          <SettingsRow label="Date format">
            <Select
              value={settings.dateFormat}
              onValueChange={(v) =>
                updateSettings({ dateFormat: v as DateFormat })
              }
            >
              <SelectTrigger className={VALUE_SELECT} aria-label="Date format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {DATE_FORMATS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {formatDatePattern(today, f)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsRow>
          <SettingsRow label="Week starts on">
            <Select
              value={settings.weekStart}
              onValueChange={(v) =>
                updateSettings({ weekStart: v as WeekStart })
              }
            >
              <SelectTrigger
                className={VALUE_SELECT}
                aria-label="Week starts on"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {WEEK_STARTS.map((w) => (
                  <SelectItem key={w.value} value={w.value}>
                    {w.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsRow>
        </SettingsGroup>

        <InstallAppGroup />
      </div>
    </div>
  )
}
