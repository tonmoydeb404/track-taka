"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
  useNoteActions,
  useNotes,
  type NoteDraft,
} from "@/hooks/data/use-notes"
import type { NoteDoc } from "@/lib/db"
import { parseMoneyInput } from "@/lib/domain"

/**
 * State for the khata sheet. Typed values live in a local overlay so
 * keystrokes never wait on the database (writes are debounced); the live
 * query stays the source of truth for which rows exist. The last row is a
 * local draft that is written to disk only once it has content — so an
 * abandoned sheet never collects empty rows. Recording a row hands it to
 * the quick-entry dialog (see KhataPage); this hook never writes
 * transactions itself.
 */

export type KhataRow = {
  id: string
  note: string
  amount: string
}

/** Sentinel id of the trailing, not-yet-saved row. */
export const DRAFT_ID = "draft"

type RowField = keyof NoteDraft

function toRow(doc: NoteDoc): KhataRow {
  return { id: doc.id, note: doc.note, amount: doc.amount }
}

/** Paisa a row records as, or null while it isn't eligible yet. */
export function eligiblePaisa(row: KhataRow): number | null {
  const paisa = parseMoneyInput(row.amount)
  return paisa !== null && paisa > 0 ? paisa : null
}

function hasContent(row: KhataRow): boolean {
  return row.note.trim() !== "" || row.amount.trim() !== ""
}

export function useKhata() {
  const notesQuery = useNotes()
  const { add, patch, remove, clearAll, restore } = useNoteActions()

  const [overlay, setOverlay] = useState<Record<string, KhataRow>>({})
  const overlayRef = useRef<Record<string, KhataRow>>({})
  const draftFlight = useRef<Promise<NoteDoc | null> | null>(null)

  const patchTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>())
  const dirtyRows = useRef(new Set<string>())

  /** Overlay is kept in a ref too, so event handlers read fresh values. */
  const setRow = useCallback((id: string, row: KhataRow | null) => {
    const next = { ...overlayRef.current }
    if (row) next[id] = row
    else delete next[id]
    overlayRef.current = next
    setOverlay(next)
  }, [])

  const resetOverlay = useCallback(() => {
    overlayRef.current = {}
    setOverlay({})
  }, [])

  const docs = notesQuery.data

  /** Persisted rows with local edits on top, plus the trailing draft row. */
  const rows = useMemo<KhataRow[]>(
    () => [
      ...docs.map((d) => overlay[d.id] ?? toRow(d)),
      overlay[DRAFT_ID] ?? { id: DRAFT_ID, note: "", amount: "" },
    ],
    [docs, overlay]
  )

  const changeRow = useCallback(
    (id: string, field: RowField, value: string) => {
      const base = overlayRef.current[id] ?? { id, note: "", amount: "" }
      setRow(id, { ...base, [field]: value })
      if (id === DRAFT_ID) return // the draft line is written on commit
      const timers = patchTimers.current
      const pending = timers.get(id)
      if (pending) clearTimeout(pending)
      dirtyRows.current.add(id)
      timers.set(
        id,
        setTimeout(() => {
          timers.delete(id)
          dirtyRows.current.delete(id)
          // Both fields, from the overlay: whichever was typed last, the
          // latest values are what get written.
          const row = overlayRef.current[id]
          if (row) void patch(id, { note: row.note, amount: row.amount })
        }, 250)
      )
    },
    [patch, setRow]
  )

  // Leaving the page writes pending edits straight away.
  useEffect(() => {
    const timers = patchTimers.current
    const dirty = dirtyRows.current
    return () => {
      for (const timer of timers.values()) clearTimeout(timer)
      timers.clear()
      for (const id of dirty) {
        const row = overlayRef.current[id]
        if (row) void patch(id, { note: row.note, amount: row.amount })
      }
      dirty.clear()
    }
  }, [patch])

  /**
   * Persists the draft row once it has content and returns the new
   * document (null when there was nothing to save). The row leaves the
   * sheet optimistically so Enter feels instant, and comes back if the
   * write fails. Concurrent calls share one write, so blur + record can
   * never double-create a row.
   */
  const flushDraft = useCallback((): Promise<NoteDoc | null> => {
    if (draftFlight.current) return draftFlight.current
    const draft = overlayRef.current[DRAFT_ID]
    if (!draft || !hasContent(draft)) return Promise.resolve(null)
    setRow(DRAFT_ID, null)
    const flight = (async () => {
      try {
        return await add({ note: draft.note, amount: draft.amount })
      } catch (error) {
        // Hand the line back — unless a new one is already being written.
        const current = overlayRef.current[DRAFT_ID]
        if (!current || !hasContent(current)) setRow(DRAFT_ID, draft)
        throw error
      }
    })()
    // Forget the flight once it settles, or every later commit would be
    // swallowed by this resolved promise and the line would never save.
    const tracked = flight.finally(() => {
      if (draftFlight.current === tracked) draftFlight.current = null
    })
    tracked.catch(() => {}) // fire-and-forget callers must not warn globally
    draftFlight.current = tracked
    return tracked
  }, [add, setRow])

  // Pocketing the phone or switching tabs saves the half-written line too.
  useEffect(() => {
    const stash = () => {
      void flushDraft().catch(() => {})
    }
    const onVisibility = () => {
      if (document.hidden) stash()
    }
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("pagehide", stash)
    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("pagehide", stash)
    }
  }, [flushDraft])

  /** Deletes one row (the draft just clears). Returns the undo snapshot. */
  const deleteRow = useCallback(
    async (id: string): Promise<NoteDoc | null> => {
      if (id === DRAFT_ID) {
        setRow(DRAFT_ID, null)
        return null
      }
      const pending = patchTimers.current.get(id)
      if (pending) {
        clearTimeout(pending)
        patchTimers.current.delete(id)
      }
      dirtyRows.current.delete(id)
      return remove(id)
    },
    [remove, setRow]
  )

  /** Wipes the whole paper; returns snapshots for Undo. */
  const clearPaper = useCallback(async (): Promise<NoteDoc[]> => {
    // A half-written line is content too — save it so Undo brings it back.
    await flushDraft()
    const snapshots = await clearAll()
    resetOverlay()
    return snapshots
  }, [clearAll, flushDraft, resetOverlay])

  const eligible = useMemo(
    () => rows.filter((row) => eligiblePaisa(row) !== null),
    [rows]
  )
  const eligibleTotal = useMemo(
    () =>
      eligible.reduce((sum, row) => sum + (eligiblePaisa(row) ?? 0), 0),
    [eligible]
  )

  return {
    isLoading: notesQuery.isLoading,
    error: notesQuery.error,
    rows,
    changeRow,
    flushDraft,
    deleteRow,
    clearPaper,
    restore,
    eligibleCount: eligible.length,
    eligibleTotal,
  }
}
