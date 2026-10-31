"use client"

import { format, formatDistanceToNow } from "date-fns"
import { Database, Download, HardDrive, Trash2, Upload } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

import { useConfirm } from "@/components/common/confirm-dialog"
import { SyncStatus } from "@/components/layout/sync-status"

import {
  SettingsActionRow,
  SettingsDetailHeader,
  SettingsGroup,
  SettingsRow,
} from "../components/settings-ui"
import { useBackup, usePersistedStorage } from "../use-backup"

function errorMessage(e: unknown, fallback: string): string {
  return e instanceof Error ? e.message : fallback
}

export function DataSection() {
  const confirm = useConfirm()
  const { lastBackupAt, exportBackup, importBackup, deleteAllData } =
    useBackup()
  const persisted = usePersistedStorage()
  const fileInput = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  async function run(task: () => Promise<void>, fallback: string) {
    setBusy(true)
    try {
      await task()
    } catch (e) {
      toast.error(errorMessage(e, fallback))
    } finally {
      setBusy(false)
    }
  }

  function download() {
    return run(async () => {
      await exportBackup()
      toast.success("Backup downloaded")
    }, "Couldn't create the backup")
  }

  async function onFile(file: File | undefined) {
    if (fileInput.current) fileInput.current.value = ""
    if (!file) return
    const ok = await confirm({
      title: "Import this backup?",
      description:
        "Records from the file are merged into your data. Items with the same ID are replaced by the file's version; nothing else is deleted.",
      confirmLabel: "Import",
    })
    if (!ok) return
    await run(async () => {
      const r = await importBackup(file)
      toast.success(
        `Imported ${r.transactions} transactions, ${r.accounts} accounts and ${r.budgets} budgets`
      )
    }, "Couldn't import the backup")
  }

  async function deleteAll() {
    const ok = await confirm({
      title: "Delete all your data?",
      description:
        "Every transaction, account and budget saved on this device will be removed for good. Download a backup first if you might want it back.",
      confirmLabel: "Delete everything",
      destructive: true,
    })
    if (!ok) return
    await run(async () => {
      await deleteAllData()
      toast.success("All data deleted")
    }, "Couldn't delete your data")
  }

  const storageNote =
    persisted === null
      ? "Storage protection can't be checked in this browser"
      : persisted
        ? "Protected: the browser won't clear it automatically"
        : "Not protected: the browser may clear it when space is low"

  return (
    <div className="flex flex-col gap-6">
      <SettingsDetailHeader
        icon={Database}
        title="Data"
        description="Everything is kept on this device. Cloud sync isn't available yet."
      />

      <div className="flex flex-col gap-6">
        <SettingsGroup>
          <SettingsRow label="Status">
            <SyncStatus />
          </SettingsRow>
          <SettingsRow label="Device storage" description={storageNote}>
            <HardDrive className="size-5" aria-hidden="true" />
          </SettingsRow>
        </SettingsGroup>

        <SettingsGroup
          title="Backup"
          note="Your records exist only on this device. A backup file is your safety net."
        >
          <SettingsActionRow
            icon={<Download className="size-5 text-primary" />}
            label="Download a backup"
            description={
              lastBackupAt
                ? `Last backup ${formatDistanceToNow(new Date(lastBackupAt), { addSuffix: true })} · ${format(new Date(lastBackupAt), "d MMM yyyy")}`
                : "You haven't made a backup yet"
            }
            onClick={download}
            disabled={busy}
            chevron={false}
          />
          <SettingsActionRow
            icon={<Upload className="size-5 text-primary" />}
            label="Import a backup"
            description="Merge a Track Taka backup file into your data"
            onClick={() => fileInput.current?.click()}
            disabled={busy}
            chevron={false}
          />
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            tabIndex={-1}
            aria-label="Backup file"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </SettingsGroup>

        <SettingsGroup
          title="Danger zone"
          note="This can't be undone. Download a backup first."
        >
          <SettingsActionRow
            icon={<Trash2 className="size-5" />}
            label="Delete all data"
            description="Remove everything from this device"
            tone="destructive"
            onClick={deleteAll}
            disabled={busy}
            chevron={false}
          />
        </SettingsGroup>
      </div>
    </div>
  )
}
