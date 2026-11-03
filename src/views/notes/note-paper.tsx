"use client"

import { Check, Eraser, MoreVertical, Trash2 } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useKeyboardOpen } from "@/hooks/use-keyboard-open"
import {
  formatMoney,
  hasOperator,
  parseMoneyInput,
  sanitizeMoneyExpression,
} from "@/lib/domain"
import { cn } from "@/lib/utils"

import { DRAFT_ID, eligiblePaisa, type KhataRow } from "./use-khata"

interface NotePaperProps {
  rows: KhataRow[]
  eligibleCount: number
  eligibleTotal: number
  /** The sheet holds something (drives the Clear button). */
  hasAnyContent: boolean
  onChangeRow: (id: string, field: "note" | "amount", value: string) => void
  onDeleteRow: (id: string) => void
  /** Hands a priced row to the quick-entry dialog, pre-filled. */
  onRecordRow: (id: string) => void
  onClear: () => void
  /** Persists the draft row when it has content (blur / Enter). */
  onCommitDraft: () => void
}

/** Item | Price | ⋯ menu. Fixed widths, so the price keeps its room. */
const COLUMNS =
  "grid-cols-[minmax(0,1fr)_7rem_3rem] sm:grid-cols-[minmax(0,1fr)_9rem_3rem]"
const ROW_HEIGHT = "h-14 sm:h-11"
/** 44px on phones (a thumb), compact on desktop. */
const ACTION =
  "flex size-11 touch-manipulation items-center justify-center rounded-xl text-muted-foreground transition-colors active:bg-accent sm:size-8 sm:rounded-lg sm:hover:bg-accent"
/** The sheet always shows at least this many rows, blank ones included. */
const MIN_ROWS = 9

/**
 * The khata sheet: an edge-to-edge two-column grid — thin rules, a column
 * line between Item and Price, frozen header and total. Built for thumbs:
 * every cell is a big tap target (the whole cell focuses its input), the
 * actions have their own 44px column, and a screenful of blank rows makes
 * it read as a sheet you can just start writing in. Enter walks Item →
 * Price → next row, and the last row is always a fresh one. Recording is
 * per row: ✓ hands the row to the quick-entry dialog pre-filled; only
 * priced rows offer it.
 */
export function NotePaper({
  rows,
  eligibleCount,
  eligibleTotal,
  hasAnyContent,
  onChangeRow,
  onDeleteRow,
  onRecordRow,
  onClear,
  onCommitDraft,
}: NotePaperProps) {
  const noteRefs = React.useRef(new Map<string, HTMLInputElement | null>())
  const priceRefs = React.useRef(new Map<string, HTMLInputElement | null>())
  const keyboardOpen = useKeyboardOpen()

  const focusNote = (id: string) => noteRefs.current.get(id)?.focus()
  const focusPrice = (id: string) => priceRefs.current.get(id)?.focus()

  /** Blank rows drawn under the last line so the page reads as a sheet. */
  const fillerCount = Math.max(0, MIN_ROWS - rows.length)

  /**
   * Enter walks the sheet the way you fill it in: Item → Price → the next
   * row's Item (committing the draft on the way).
   */
  const handleLineKeyDown = (
    row: KhataRow,
    index: number,
    field: "note" | "amount",
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== "Enter") return
    e.preventDefault()
    if (field === "note") {
      focusPrice(row.id)
      return
    }
    if (row.id === DRAFT_ID) {
      onCommitDraft()
      // This input is the next fresh row now — put the caret back on it.
      focusNote(DRAFT_ID)
      return
    }
    const next = rows[index + 1]
    if (next) focusNote(next.id)
  }

  /** Blur commits the draft row — unless focus moved within the row. */
  const handleDraftBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const next = e.relatedTarget
    const line = e.currentTarget.closest("[data-line]")
    if (next instanceof HTMLElement && line && line.contains(next)) return
    onCommitDraft()
  }

  return (
    <div>
      {/* Column header — frozen, like a sheet's top pane */}
      <div
        className={cn(
          "sticky top-[env(safe-area-inset-top)] z-10 grid h-10 items-center border-y border-border/70",
          COLUMNS,
          "bg-muted/70 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur-md backdrop-saturate-150"
        )}
      >
        <span className="pl-4">Item</span>
        <span className="border-l border-border/70 py-2 pl-3 text-left">
          Price · ৳
        </span>
        <span aria-hidden="true" />
      </div>

      <ol className="divide-y divide-border/60" aria-label="Khata rows">
        {rows.map((row, index) => {
          const isDraft = row.id === DRAFT_ID
          const paisa = parseMoneyInput(row.amount)
          const invalid = row.amount.trim() !== "" && paisa === null
          const eligible = eligiblePaisa(row) !== null
          const expression = paisa !== null && hasOperator(row.amount)
          const name = row.note.trim() || `row ${index + 1}`

          return (
            <li
              key={row.id}
              className="group relative transition-colors focus-within:bg-muted/40"
            >
              <div
                data-line={row.id}
                className={cn("grid", ROW_HEIGHT, COLUMNS)}
              >
                <input
                  ref={(el) => {
                    noteRefs.current.set(row.id, el)
                  }}
                  value={row.note}
                  onChange={(e) => onChangeRow(row.id, "note", e.target.value)}
                  onKeyDown={(e) => handleLineKeyDown(row, index, "note", e)}
                  onBlur={isDraft ? handleDraftBlur : undefined}
                  placeholder={isDraft ? "Write an item…" : undefined}
                  aria-label={`Item ${index + 1}`}
                  enterKeyHint="next"
                  maxLength={120}
                  autoComplete="off"
                  spellCheck={false}
                  className="h-full min-w-0 touch-manipulation bg-transparent pl-4 text-base text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground/50"
                />

                {/* A label, so a tap anywhere in the cell lands in the price */}
                <label
                  className={cn(
                    "relative flex h-full min-w-0 touch-manipulation items-center border-l border-border/60 pl-3",
                    invalid && "bg-expense/5"
                  )}
                >
                  <input
                    ref={(el) => {
                      priceRefs.current.set(row.id, el)
                    }}
                    value={row.amount}
                    onChange={(e) =>
                      onChangeRow(
                        row.id,
                        "amount",
                        sanitizeMoneyExpression(e.target.value)
                      )
                    }
                    onKeyDown={(e) =>
                      handleLineKeyDown(row, index, "amount", e)
                    }
                    onBlur={isDraft ? handleDraftBlur : undefined}
                    placeholder="—"
                    aria-label={`Price for row ${index + 1}`}
                    inputMode="decimal"
                    enterKeyHint="next"
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={24}
                    className={cn(
                      "tnum h-full min-w-0 flex-1 bg-transparent text-left text-base outline-none placeholder:font-normal placeholder:text-muted-foreground/40",
                      expression && "pb-3",
                      invalid ? "text-expense" : "text-foreground"
                    )}
                  />
                  {expression ? (
                    <span
                      aria-hidden="true"
                      className="tnum pointer-events-none absolute bottom-1 left-3 text-[11px] leading-none text-muted-foreground"
                    >
                      = {formatMoney(paisa)}
                    </span>
                  ) : null}
                </label>

                {/* One ⋯ menu per row: a single big tap target, and the item
                    and price keep the room two buttons used to take. Record
                    exists for priced rows only. */}
                <div className="flex items-center justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Actions for ${name}`}
                        className={ACTION}
                      >
                        <MoreVertical
                          className="size-5 sm:size-4"
                          aria-hidden="true"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-40">
                      {eligible ? (
                        <DropdownMenuItem
                          className="text-base sm:text-sm"
                          onSelect={() => onRecordRow(row.id)}
                        >
                          <Check className="text-income" aria-hidden="true" />
                          Record
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem
                        variant="destructive"
                        className="text-base sm:text-sm"
                        onSelect={() => onDeleteRow(row.id)}
                      >
                        <Trash2 aria-hidden="true" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </li>
          )
        })}

        {/* Empty sheet rows: purely visual — a tap starts a new line */}
        {Array.from({ length: fillerCount }, (_, i) => (
          <li key={`filler-${i}`} aria-hidden="true">
            <button
              type="button"
              tabIndex={-1}
              onClick={() => focusNote(DRAFT_ID)}
              className={cn(
                "grid w-full touch-manipulation text-left",
                ROW_HEIGHT,
                COLUMNS
              )}
            >
              <span />
              <span className="border-l border-border/60" />
              <span />
            </button>
          </li>
        ))}
      </ol>

      {/* Total row — frozen to the bottom, the way a sheet closes a column */}
      <div
        className={cn(
          "sticky z-10 flex h-12 items-center justify-between gap-2 border-t-2 border-t-border px-3 pt-2 sm:h-11 sm:px-4",
          "bg-background/85 backdrop-blur-md backdrop-saturate-150",
          // The tab bar slides away with the keyboard — drop to the edge.
          keyboardOpen
            ? "bottom-0"
            : "bottom-[calc(var(--spacing-bottomnav)+max(env(safe-area-inset-bottom),0.75rem))] lg:bottom-0"
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onClear}
          disabled={!hasAnyContent}
        >
          <Eraser className="size-4" aria-hidden="true" />
          Clear
        </Button>
        <p className="truncate caption-1 text-muted-foreground">
          {eligibleCount > 0
            ? `To record · ${eligibleCount} row${eligibleCount === 1 ? "" : "s"}`
            : "To record"}
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <p className="tnum heading-6" aria-live="polite">
            {formatMoney(eligibleTotal)}
          </p>
        </div>
      </div>
    </div>
  )
}
