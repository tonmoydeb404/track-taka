"use client"

import { create } from "zustand"

// UI-only state: nothing here is persisted or part of the data model.
//
// Modals and sheets are not here any more — they live in the URL as query
// params (see `useModalParam` in hooks) so the back button closes them and
// any view can be deep-linked.
interface UIState {
  /** The month every month-based screen shows; null means the current month. */
  month: string | null
  setMonth: (month: string | null) => void
  /** A custom span as inclusive day keys; null means "the selected month". */
  range: { from: string; to: string } | null
  setRange: (range: { from: string; to: string } | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  month: null,
  // Choosing a month leaves any custom range behind
  setMonth: (month) => set({ month, range: null }),
  range: null,
  setRange: (range) => set({ range }),
}))
