import type { ComponentType } from "react"

import {
  BudgetsNarrow,
  OverviewNarrow,
  OverviewWide,
  QuickEntryNarrow,
  TransactionsWide,
} from "./frames"

export type ScreenshotAsset = {
  id: string
  name: string
  /** PWA manifest form factor: narrow for phones, wide for desktop. */
  formFactor: "narrow" | "wide"
  /** CSS pixel size of the frame; the PNG is this times the export scale. */
  width: number
  height: number
  note: string
  Component: ComponentType
}

/**
 * Install prompt screenshots. Within a form factor every frame shares one
 * aspect ratio, which Chrome requires. Exported at 2x they are 1080x1920
 * (narrow) and 2560x1440 (wide), inside the 320 to 3840 pixel limits.
 */
export const SCREENSHOT_ASSETS: ScreenshotAsset[] = [
  {
    id: "overview",
    name: "Overview",
    formFactor: "narrow",
    width: 540,
    height: 960,
    note: "Balance, month summary and recent activity",
    Component: OverviewNarrow,
  },
  {
    id: "quick-entry",
    name: "Quick entry",
    formFactor: "narrow",
    width: 540,
    height: 960,
    note: "Amount with arithmetic, category and account",
    Component: QuickEntryNarrow,
  },
  {
    id: "budgets",
    name: "Budgets",
    formFactor: "narrow",
    width: 540,
    height: 960,
    note: "Per category limits with overspend visible",
    Component: BudgetsNarrow,
  },
  {
    id: "desktop-overview",
    name: "Overview on desktop",
    formFactor: "wide",
    width: 1280,
    height: 720,
    note: "Sidebar and the overview grid",
    Component: OverviewWide,
  },
  {
    id: "desktop-transactions",
    name: "Transactions on desktop",
    formFactor: "wide",
    width: 1280,
    height: 720,
    note: "Sortable table with filters",
    Component: TransactionsWide,
  },
]

export const DEFAULT_SCALE = 2

export function assetFilename(asset: ScreenshotAsset, scale: number) {
  return `${asset.id}-${asset.width * scale}x${asset.height * scale}.png`
}
