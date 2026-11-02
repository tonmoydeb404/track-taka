"use client"

import { Check, Eraser, Trash2 } from "lucide-react"
import * as React from "react"

import { SwipeActions } from "@/components/common/swipe-actions"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks"
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

/**
 * The khata sheet: an edge-to-edge two-column grid — thin rules, a column
 * line between Item and Price, frozen header and total. Enter works down
 * the rows (Tab or a tap reaches the price cell) and the last row is always
 * a fresh one. Recording is per row: ✓ hands the row to the quick-entry
 * dialog pre-filled; only priced rows offer it.
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
  const isMobile = useIsMobile()
  const noteRefs = React.useRef(new Map<string, HTMLInputElement | null>())

  const focusNote = (id: string) => noteRefs.current.get(id)?.focus()

  /** Enter works down the sheet: next row below, committing the draft. */
  const handleLineKeyDown = (
    row: KhataRow,
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== "Enter") return
    e.preventDefault()
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
          "sticky top-[env(safe-area-inset-top)] z-10 grid h-10 grid-cols-[minmax(0,1fr)_6.5rem] items-center border-y border-border/70",
          "bg-muted/70 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur-md backdrop-saturate-150",
          "sm:grid-cols-[minmax(0,1fr)_9rem_5rem]"
        )}
      >
        <span className="pl-3 sm:pl-4">Item</span>
        <span className="border-l border-border/70 py-2 pr-3 pl-2 text-right sm:pr-4">
          Price · ৳
        </span>
      </div>

      <ol className="divide-y divide-border/60" aria-label="Khata rows">
        {rows.map((row, index) => {
          const isDraft = row.id === DRAFT_ID
          const paisa = parseMoneyInput(row.amount)
          const invalid = row.amount.trim() !== "" && paisa === null
          const eligible = eligiblePaisa(row) !== null
          const expression = paisa !== null && hasOperator(row.amount)

          const rowBody = (
            <div
              data-line={row.id}
              className="grid h-11 grid-cols-[minmax(0,1fr)_6.5rem] sm:grid-cols-[minmax(0,1fr)_9rem_5rem]"
            >
              <input
                ref={(el) => {
                  noteRefs.current.set(row.id, el)
                }}
                value={row.note}
                onChange={(e) => onChangeRow(row.id, "note", e.target.value)}
                onKeyDown={(e) => handleLineKeyDown(row, index, e)}
                onBlur={isDraft ? handleDraftBlur : undefined}
                placeholder={isDraft ? "Write an item…" : undefined}
                aria-label={`Item ${index + 1}`}
                maxLength={120}
                autoComplete="off"
                spellCheck={false}
                className="h-full min-w-0 bg-transparent pl-3 body-2 text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground/50 focus:bg-muted/40 sm:pl-4"
              />
              <div
                onClick={(e) => {
                  // Clicks on the cell padding still reach the price field.
                  if ((e.target as HTMLElement).tagName !== "INPUT") {
                    e.currentTarget.querySelector("input")?.focus()
                  }
                }}
                className={cn(
                  "flex h-full min-w-0 items-center gap-1.5 border-l border-border/60 pr-3 pl-2 sm:pr-4",
                  invalid && "bg-expense/5"
                )}
              >
                {expression ? (
                  <span
                    aria-hidden="true"
                    className="tnum shrink-0 caption-5 text-muted-foreground"
                  >
                    = {formatMoney(paisa)}
                  </span>
                ) : null}
                <input
                  value={row.amount}
                  onChange={(e) =>
                    onChangeRow(
                      row.id,
                      "amount",
                      sanitizeMoneyExpression(e.target.value)
                    )
                  }
                  onKeyDown={(e) => handleLineKeyDown(row, index, e)}
                  onBlur={isDraft ? handleDraftBlur : undefined}
                  placeholder="—"
                  aria-label={`Price for row ${index + 1}`}
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={24}
                  className={cn(
                    "tnum h-full min-w-0 flex-1 bg-transparent text-right body-1 outline-none placeholder:font-normal placeholder:text-muted-foreground/40 focus:bg-muted/40",
                    invalid ? "text-expense" : "text-foreground"
                  )}
                />
              </div>

              {/* Per-row actions in their own column, so the price field is
                  never covered. Record exists for priced rows only. */}
              <div className="hidden h-full items-center justify-end gap-1 pr-2 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 has-[:focus-visible]:opacity-100 sm:flex">
                {eligible ? (
                  <button
                    type="button"
                    onClick={() => onRecordRow(row.id)}
                    aria-label={`Record ${row.note.trim() || `row ${index + 1}`}`}
                    className="flex size-8 items-center justify-center rounded-lg text-income transition-colors hover:bg-accent"
                  >
                    <Check className="size-4" aria-hidden="true" />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => onDeleteRow(row.id)}
                  aria-label={`Delete ${row.note.trim() || `row ${index + 1}`}`}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-expense"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )

          const swipeActions = [
            ...(eligible
              ? [
                  {
                    label: "Record",
                    icon: Check,
                    onSelect: () => onRecordRow(row.id),
                    className: "bg-income text-white",
                  },
                ]
              : []),
            {
              label: "Delete",
              icon: Trash2,
              onSelect: () => onDeleteRow(row.id),
              className: "bg-destructive text-white",
            },
          ]

          return (
            <li key={row.id} className="group relative">
              {isMobile ? (
                <SwipeActions actions={swipeActions}>{rowBody}</SwipeActions>
              ) : (
                rowBody
              )}
            </li>
          )
        })}
      </ol>

      {/* Total row — frozen to the bottom, the way a sheet closes a column */}
      <div
        className={cn(
          "sticky z-10 flex h-11 items-center justify-between gap-2 border-t-2 border-t-border px-3 pt-2 sm:px-4",
          "bg-background/85 backdrop-blur-md backdrop-saturate-150",
          "bottom-[calc(var(--spacing-bottomnav)+max(env(safe-area-inset-bottom),0.75rem))] lg:bottom-0"
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
