"use client"

import { useCallback } from "react"

import {
  DEFAULT_SETTINGS,
  SETTINGS_ID,
  useRxQuery,
  type SettingsDoc,
} from "@/lib/db"

/** App settings. Defaults are returned until the stored document loads. */
export function useSettings(): SettingsDoc & { isLoading: boolean } {
  const { data, isLoading } = useRxQuery<SettingsDoc>(
    useCallback((db) => db.settings.findOne(SETTINGS_ID), [])
  )
  return { ...DEFAULT_SETTINGS, ...data[0], isLoading }
}
