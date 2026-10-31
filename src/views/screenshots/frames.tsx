import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import {
  MockBalance,
  MockBudgets,
  MockMonthSummary,
  MockQuickEntry,
  MockRecent,
  MockSidebar,
  MockTable,
  MockUnbudgeted,
} from "./mocks"

/* Frames are laid out at CSS pixel sizes and exported at 2x: narrow frames
   are 540x960 (1080x1920 PNG), wide frames 1280x720 (2560x1440 PNG). The
   `force-light` class pins the light theme tokens so exports never pick up
   the viewer's dark mode. */

function Frame({
  width,
  height,
  children,
  className,
}: {
  width: number
  height: number
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "force-light relative flex flex-col overflow-hidden bg-background font-sans text-foreground antialiased",
        className
      )}
      style={{ width, height }}
    >
      {children}
    </div>
  )
}

/** Short caption at the top of a phone frame: what this screen is for. */
function Caption({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="px-8 pt-12 pb-8 text-center">
      <p className="heading-4 text-balance">{title}</p>
      <p className="mt-2 title-2 text-pretty text-muted-foreground">{sub}</p>
    </div>
  )
}

/** The phone itself: a flat device surface with a status bar strip. */
function Phone({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-[420px] flex-1 flex-col overflow-hidden rounded-t-[2.5rem] border border-b-0 bg-background shadow-lg",
        className
      )}
    >
      <div className="tnum flex h-11 items-center justify-between px-7 caption-1">
        <span>9:41</span>
        <span className="flex gap-1">
          <span className="h-2.5 w-4 rounded-sm bg-foreground" />
          <span className="h-2.5 w-2.5 rounded-sm bg-foreground" />
        </span>
      </div>
      {children}
    </div>
  )
}

export function OverviewNarrow() {
  return (
    <Frame width={540} height={960}>
      <Caption
        title="See the whole month"
        sub="Balances, totals and recent spending on one screen."
      />
      <Phone>
        <div className="app-gutter flex items-center justify-between py-3">
          <p className="heading-6">Overview</p>
          <p className="rounded-lg bg-muted px-3 py-1.5 caption-1">
            October 2026
          </p>
        </div>
        <div className="app-gutter flex flex-col gap-4">
          <MockBalance />
          <MockMonthSummary />
          <MockRecent limit={3} />
        </div>
      </Phone>
    </Frame>
  )
}

export function QuickEntryNarrow() {
  return (
    <Frame width={540} height={960}>
      <Caption
        title="Add an expense in seconds"
        sub="Type the amount, sums included, tap a category, save."
      />
      <Phone className="justify-end bg-foreground/5">
        <div className="app-gutter mb-4 opacity-40">
          <MockBalance />
        </div>
        <MockQuickEntry className="mt-auto" />
      </Phone>
    </Frame>
  )
}

export function BudgetsNarrow() {
  return (
    <Frame width={540} height={960}>
      <Caption
        title="Budgets that show how far over"
        sub="A limit per category, and the bar keeps going past it."
      />
      <Phone>
        <div className="app-gutter flex items-center justify-between py-3">
          <p className="heading-6">Budgets</p>
          <p className="rounded-lg bg-muted px-3 py-1.5 caption-1">
            October 2026
          </p>
        </div>
        <div className="app-gutter flex flex-col gap-4">
          <div className="rounded-2xl bg-primary px-5 py-5 text-primary-foreground">
            <p className="caption-1 opacity-80">Budgeted this month</p>
            <p className="tnum mt-1 text-display">৳18,500</p>
            <p className="mt-2 caption-1 opacity-80">
              ৳14,524 spent, 11 days left
            </p>
          </div>
          <MockBudgets count={5} />
          <MockUnbudgeted />
        </div>
      </Phone>
    </Frame>
  )
}

function Desktop({
  children,
  active,
}: {
  children: ReactNode
  active: string
}) {
  return (
    <div className="flex flex-1">
      <MockSidebar active={active} />
      <main className="flex-1 overflow-hidden px-8 py-8">{children}</main>
    </div>
  )
}

export function OverviewWide() {
  return (
    <Frame width={1280} height={720}>
      <Desktop active="Overview">
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3 flex flex-col gap-6">
            <MockBalance />
            <MockRecent limit={4} />
          </div>
          <div className="col-span-2 flex flex-col gap-6">
            <MockMonthSummary />
            <MockBudgets count={4} />
          </div>
        </div>
      </Desktop>
    </Frame>
  )
}

export function TransactionsWide() {
  return (
    <Frame width={1280} height={720}>
      <Desktop active="Transactions">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="heading-5">Transactions</p>
            <p className="mt-1 caption-2 text-muted-foreground">
              October 2026, 31 entries
            </p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-lg border bg-card px-3 py-2 caption-1">
              All accounts
            </span>
            <span className="rounded-lg border bg-card px-3 py-2 caption-1">
              All types
            </span>
            <span className="rounded-lg border bg-card px-3 py-2 caption-1">
              Newest first
            </span>
          </div>
        </div>
        <MockTable />
      </Desktop>
    </Frame>
  )
}
