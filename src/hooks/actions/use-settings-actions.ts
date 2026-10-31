"use client"

import { useMemo } from "react"

import { SETTINGS_ID, useDatabase, type SettingsDoc } from "@/lib/db"

export function useSettingsActions() {
  const db = useDatabase()

  return useMemo(
    () => ({
      async update(
        patch: Partial<Omit<SettingsDoc, "id" | "schemaVersion" | "updatedAt">>
      ): Promise<void> {
        if (!db) throw new Error("The database is still opening")
        const doc = await db.settings.findOne(SETTINGS_ID).exec()
        await doc?.patch({ ...patch, updatedAt: new Date().toISOString() })
      },
    }),
    [db]
  )
}
