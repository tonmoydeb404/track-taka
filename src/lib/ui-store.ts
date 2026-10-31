"use client"

import { create } from "zustand"

import type { TransactionType } from "@/lib/db"

// UI-only state: nothing here is persisted or part of the data model.
interface UIState {
  /** The month every month-based screen shows; null means the current month. */
  month: string | null
  setMonth: (month: string | null) => void
  /** A custom span as inclusive day keys; null means "the selected month". */
  range: { from: string; to: string } | null
  setRange: (range: { from: string; to: string } | null) => void

  quickEntryOpen: boolean
  quickEntryType: TransactionType
  editingTxId: string | null
  /** Increments on every open so consumers can remount per session. */
  quickEntrySession: number
  openQuickEntry: (type?: TransactionType) => void
  openQuickEntryForEdit: (txId: string) => void
  closeQuickEntry: () => void

  voiceOpen: boolean
  openVoice: () => void
  closeVoice: () => void

  detailTxId: string | null
  openDetail: (txId: string) => void
  closeDetail: () => void
}

export const useUIStore = create<UIState>((set) => ({
  month: null,
  // Choosing a month leaves any custom range behind
  setMonth: (month) => set({ month, range: null }),
  range: null,
  setRange: (range) => set({ range }),

  quickEntryOpen: false,
  quickEntryType: "expense",
  editingTxId: null,
  quickEntrySession: 0,
  openQuickEntry: (type = "expense") =>
    set((s) => ({
      quickEntryOpen: true,
      quickEntryType: type,
      editingTxId: null,
      quickEntrySession: s.quickEntrySession + 1,
    })),
  openQuickEntryForEdit: (txId) =>
    set((s) => ({
      quickEntryOpen: true,
      editingTxId: txId,
      quickEntrySession: s.quickEntrySession + 1,
    })),
  closeQuickEntry: () => set({ quickEntryOpen: false, editingTxId: null }),

  voiceOpen: false,
  openVoice: () => set({ voiceOpen: true }),
  closeVoice: () => set({ voiceOpen: false }),

  detailTxId: null,
  openDetail: (txId) => set({ detailTxId: txId }),
  closeDetail: () => set({ detailTxId: null }),
}))
