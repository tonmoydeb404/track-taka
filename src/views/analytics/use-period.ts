"use client"

import { create } from "zustand"

import type { RangeKey } from "./utils"

interface PeriodState {
  range: RangeKey
  setRange: (range: RangeKey) => void
}

/** How long the analytics period is. Its end month is the app-wide month. */
export const usePeriod = create<PeriodState>((set) => ({
  range: "month",
  setRange: (range) => set({ range }),
}))
