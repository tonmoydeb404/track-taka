"use client"

import { useCallback, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { useSearchQueries } from "./use-search-queries"
import type { TransactionType } from "@/lib/db"

// ─── useModalParam ────────────────────────────────────────────────────────────

interface ModalParamChanges {
  /** Param keys to drop in the same navigation. */
  clear?: string[]
  /** Param keys to set in the same navigation. */
  set?: Record<string, string>
}

export interface ModalParam {
  /** Live value from the URL; null means the modal is closed. */
  raw: string | null
  /**
   * Value that lingers through the close navigation so a sheet can play its
   * exit animation (and resolve its data) after the URL is already clean.
   */
  value: string | null
  /** True while the param is in the URL. */
  isOpen: boolean
  /** Increments every time the modal opens, for remounting forms fresh. */
  session: number
  /** Pushes a history entry with the param set; the back button then closes it. */
  open: (value?: string, changes?: ModalParamChanges) => void
  /** Replaces the URL without the param, keeping every other param intact. */
  close: (changes?: ModalParamChanges) => void
}

/**
 * Drives one modal / sheet through a URL query param, e.g. `?tx=<id>`.
 *
 * Opening pushes a history entry, so the browser back button closes the
 * modal. Closing replaces the URL (never re-opens on back) while preserving
 * unrelated params such as the transaction filters.
 */
export function useModalParam(key: string): ModalParam {
  const router = useRouter()
  const pathname = usePathname()
  const searchQueries = useSearchQueries()

  const raw = searchQueries.get(key)

  // Render-phase bookkeeping: remember the last open value (so data survives
  // the exit animation) and count opens (so forms can remount per session).
  const [prevRaw, setPrevRaw] = useState(raw)
  const [lingering, setLingering] = useState(raw)
  const [session, setSession] = useState(0)
  if (raw !== prevRaw) {
    setPrevRaw(raw)
    if (raw !== null) {
      setLingering(raw)
      setSession((s) => s + 1)
    }
  }

  const open = useCallback(
    (value?: string, changes?: ModalParamChanges) => {
      const params = new URLSearchParams(searchQueries.toString())
      for (const k of changes?.clear ?? []) params.delete(k)
      for (const [k, v] of Object.entries(changes?.set ?? {})) params.set(k, v)
      params.set(key, value ?? "1")
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [key, pathname, router, searchQueries]
  )

  const close = useCallback(
    (changes?: ModalParamChanges) => {
      const params = new URLSearchParams(searchQueries.toString())
      params.delete(key)
      for (const k of changes?.clear ?? []) params.delete(k)
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [key, pathname, router, searchQueries]
  )

  return {
    raw,
    value: raw ?? lingering,
    isOpen: raw !== null,
    session,
    open,
    close,
  }
}

// ─── Quick entry (add / edit transaction) ─────────────────────────────────────

/**
 * The global add/edit transaction sheet, as two params: `?add=<type>` for a
 * new transaction and `?edit=<txId>` to change an existing one. Both work on
 * every page because the sheet itself is mounted by the app shell.
 */
export function useQuickEntryParams() {
  const add = useModalParam("add")
  const edit = useModalParam("edit")

  return {
    isOpen: add.isOpen || edit.isOpen,
    /** Entry type for a new transaction; the form ignores it when editing. */
    type: (add.value as TransactionType | null) ?? "expense",
    /** Transaction to load when editing; null means "create". */
    editingTxId: edit.isOpen ? edit.value : null,
    /** Changes on every open; use as a React key to reset the form. */
    session: `${add.session}:${edit.session}`,
    openAdd: (type: TransactionType = "expense") =>
      add.open(type, { clear: ["edit"] }),
    // Also drops `?tx` so editing from the detail sheet replaces it in one
    // navigation — back then returns to the detail sheet.
    openEdit: (txId: string) => edit.open(txId, { clear: ["add", "tx"] }),
    close: () => (add.isOpen ? add.close() : edit.close()),
  }
}
