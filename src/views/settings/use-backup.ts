"use client"

import { useCallback, useEffect, useState } from "react"

import { useSettings, useSettingsActions } from "@/hooks"
import { getDatabase } from "@/lib/db"

import {
  BACKUP_APP,
  BACKUP_VERSION,
  parseBackup,
  type BackupFile,
} from "./backup-format"

export type ImportResult = {
  accounts: number
  transactions: number
  budgets: number
}

/** Backup, restore and wipe for the local database, plus storage info. */
export function useBackup() {
  const { lastBackupAt } = useSettings()
  const settingsActions = useSettingsActions()

  /** Downloads every document as JSON and records the backup time. */
  const exportBackup = useCallback(async (): Promise<void> => {
    const db = await getDatabase()
    const [accounts, transactions, budgets, settings] = await Promise.all([
      db.accounts.find().exec(),
      db.transactions.find().exec(),
      db.budgets.find().exec(),
      db.settings.find().exec(),
    ])
    const now = new Date().toISOString()
    const payload: BackupFile = {
      app: BACKUP_APP,
      version: BACKUP_VERSION,
      exportedAt: now,
      accounts: accounts.map((d) => d.toJSON() as BackupFile["accounts"][0]),
      transactions: transactions.map(
        (d) => d.toJSON() as BackupFile["transactions"][0]
      ),
      budgets: budgets.map((d) => d.toJSON() as BackupFile["budgets"][0]),
      settings: settings.map((d) => d.toJSON() as BackupFile["settings"][0]),
    }
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      })
    )
    const a = document.createElement("a")
    a.href = url
    a.download = `track-taka-backup-${now.slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    await settingsActions.update({ lastBackupAt: now })
  }, [settingsActions])

  /** Validates a backup file and merges it into the database by id. */
  const importBackup = useCallback(
    async (file: File): Promise<ImportResult> => {
      let raw: unknown
      try {
        raw = JSON.parse(await file.text())
      } catch {
        throw new Error("That file isn't a readable backup (invalid JSON).")
      }
      const data = parseBackup(raw)
      const db = await getDatabase()

      // Accounts first so transactions never point at a missing account.
      const results = [
        await db.accounts.bulkUpsert(data.accounts),
        await db.transactions.bulkUpsert(data.transactions),
        await db.budgets.bulkUpsert(data.budgets),
      ]
      const failed = results.reduce((n, r) => n + r.error.length, 0)
      if (failed > 0) {
        throw new Error(
          `${failed} record${failed === 1 ? "" : "s"} couldn't be imported. The file may be damaged.`
        )
      }
      return {
        accounts: results[0].success.length,
        transactions: results[1].success.length,
        budgets: results[2].success.length,
      }
    },
    []
  )

  /** Removes every account, transaction and budget. Settings are kept. */
  const deleteAllData = useCallback(async (): Promise<void> => {
    const db = await getDatabase()
    await db.transactions.find().remove()
    await db.budgets.find().remove()
    await db.accounts.find().remove()
  }, [])

  return {
    lastBackupAt,
    exportBackup,
    importBackup,
    deleteAllData,
  }
}

/** Whether the browser promised not to evict this site's data. null = unknown. */
export function usePersistedStorage(): boolean | null {
  const [persisted, setPersisted] = useState<boolean | null>(null)
  useEffect(() => {
    let cancelled = false
    if (!navigator.storage?.persisted) return
    navigator.storage.persisted().then((p) => {
      if (!cancelled) setPersisted(p)
    })
    return () => {
      cancelled = true
    }
  }, [])
  return persisted
}
