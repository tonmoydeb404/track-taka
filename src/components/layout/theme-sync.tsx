"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"

import { useSettings } from "@/hooks"
import { useSettingsActions } from "@/hooks/actions"
import type { ThemeMode } from "@/lib/db"

/**
 * Keeps next-themes and the stored settings in step. Renders nothing.
 * The settings document wins once on load; after that a change on either
 * side (the Settings picker, or the D hotkey) is copied to the other.
 */
export function ThemeSync() {
  const settings = useSettings()
  const { update } = useSettingsActions()
  const { theme, setTheme } = useTheme()
  const synced = useRef(false)

  // next-themes → settings: the hotkey changes the theme without touching
  // settings. Declared first so that on the commit where settings first load,
  // it runs before `synced` flips and skips the not-yet-applied stored value.
  useEffect(() => {
    if (!synced.current || !theme || theme === settings.theme) return
    void update({ theme: theme as ThemeMode })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])

  // Settings → next-themes: once on load, then whenever the stored value changes
  useEffect(() => {
    if (settings.isLoading) return
    synced.current = true
    if (settings.theme !== theme) setTheme(settings.theme)
    // `theme` is deliberately left out: this direction only follows settings
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.isLoading, settings.theme, setTheme])

  return null
}
