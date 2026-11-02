"use client"

import * as React from "react"
import { toast } from "sonner"

import { Skeleton } from "@/components/ui/skeleton"
import { useQuickEntryParams } from "@/hooks"
import { haptic } from "@/lib/haptics"

import { NotePaper } from "./note-paper"
import { RecordPanel } from "./record-panel"
import { DRAFT_ID, useKhata } from "./use-khata"

/**
 * The khata sheet: jot now, price later. Recording is per row — ✓ hands a
 * priced row to the quick-entry dialog pre-filled (note → description,
 * price → amount); the row leaves the sheet once that transaction saves.
 * Unpriced notes stay. There is no batch recording and no account gate on
 * the sheet itself; the dialog handles account and category.
 */
export function KhataPage() {
  const khata = useKhata()
  const quickEntry = useQuickEntryParams()

  const hasAnyContent = khata.rows.some(
    (row) =>
      row.id !== DRAFT_ID || row.note.trim() !== "" || row.amount.trim() !== ""
  )

  const errorMessage = (err: unknown, fallback: string) =>
    err instanceof Error ? err.message : fallback

  /** Hands one row to the quick-entry dialog, pre-filled from the row. */
  const handleRecord = (rowId: string) => {
    haptic()
    quickEntry.openAdd("expense", { set: { from: rowId } })
  }

  const handleDelete = async (id: string) => {
    try {
      const snapshot = await khata.deleteRow(id)
      if (!snapshot) return
      toast("Row removed", {
        action: {
          label: "Undo",
          onClick: () => {
            void khata
              .restore([snapshot])
              .catch((err) => toast.error(errorMessage(err, "Could not undo")))
          },
        },
      })
    } catch (err) {
      toast.error(errorMessage(err, "Could not remove the row"))
    }
  }

  const handleClear = async () => {
    try {
      const snapshots = await khata.clearPaper()
      toast(
        snapshots.length > 0
          ? `Sheet cleared · ${snapshots.length} row${snapshots.length === 1 ? "" : "s"}`
          : "Sheet cleared",
        {
          action:
            snapshots.length > 0
              ? {
                  label: "Undo",
                  onClick: () => {
                    void khata
                      .restore(snapshots)
                      .catch((err) =>
                        toast.error(errorMessage(err, "Could not undo"))
                      )
                  },
                }
              : undefined,
        }
      )
    } catch (err) {
      toast.error(errorMessage(err, "Could not clear the sheet"))
    }
  }

  const handleCommitDraft = () => {
    void khata
      .flushDraft()
      .catch((err) => toast.error(errorMessage(err, "Could not save the row")))
  }

  return (
    <div className="page-stack">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Khata
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Jot now, add prices later — ✓ a priced row to record it.
        </p>
      </header>

      {khata.error ? (
        <p role="alert" className="text-sm text-destructive">
          {khata.error.message}
        </p>
      ) : khata.isLoading ? (
        <Skeleton className="h-80 rounded-2xl" />
      ) : (
        <>
          {/* Full bleed on phones and tablets; on desktop the sheet shares
              the row with the summary panel instead of the page gutter. */}
          <div className="-mx-5 sm:-mx-6 lg:mx-0 lg:grid lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start lg:gap-8">
            <NotePaper
              rows={khata.rows}
              eligibleCount={khata.eligibleCount}
              eligibleTotal={khata.eligibleTotal}
              hasAnyContent={hasAnyContent}
              onChangeRow={khata.changeRow}
              onDeleteRow={(id) => void handleDelete(id)}
              onRecordRow={handleRecord}
              onClear={() => void handleClear()}
              onCommitDraft={handleCommitDraft}
            />
            <RecordPanel
              eligibleCount={khata.eligibleCount}
              stayingCount={khata.rows.length - khata.eligibleCount}
              eligibleTotal={khata.eligibleTotal}
            />
          </div>
        </>
      )}
    </div>
  )
}
