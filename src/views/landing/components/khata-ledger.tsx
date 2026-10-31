"use client"

import { motion, useReducedMotion } from "motion/react"
import { useId, useState } from "react"

import { ExpressionHint } from "@/components/common/expression-hint"
import {
  formatMoney,
  hasOperator,
  parseMoneyInput,
  sanitizeMoneyExpression,
} from "@/lib/domain"
import { cn } from "@/lib/utils"

import { LEDGER_ENTRIES } from "../content"
import { LANDING_EASE } from "./reveal"

/**
 * The hero visual: a khata page with today's entries written onto its lines.
 * The last line is a real amount field wired to the app's expression parser,
 * so visitors can try "120+80*2" and watch it resolve.
 */
export function KhataLedger({ className }: { className?: string }) {
  const [draft, setDraft] = useState("")
  const inputId = useId()
  const reduce = useReducedMotion()
  const row = (i: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: LANDING_EASE, delay: 0.5 + i * 0.12 },
  })

  const base = LEDGER_ENTRIES.reduce((sum, e) => sum + e.amount, 0)
  const typed = draft ? parseMoneyInput(draft) : null
  const total = base + (typed ?? 0)
  const invalid = draft !== "" && typed === null

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm",
        className
      )}
    >
      <div className="flex items-baseline justify-between px-4 pt-4 pb-3 sm:px-6 sm:pt-6">
        <p className="title-2">Today</p>
        <p className="caption-2 text-muted-foreground">Expenses</p>
      </div>

      <div className="relative">
        {/* The red margin line every khata has */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-14 w-px bg-expense/40 sm:left-20"
        />

        <ol className="relative divide-y" aria-label="Today's expenses">
          {LEDGER_ENTRIES.map((e, i) => (
            <motion.li
              key={e.description}
              className="grid h-12 grid-cols-[2rem_1fr_auto] items-center gap-x-3 px-4 sm:grid-cols-[2.5rem_1fr_auto] sm:gap-x-4 sm:px-6"
              {...row(i)}
            >
              <span className="tnum caption-2 text-muted-foreground">
                {e.time}
              </span>
              <span className="truncate body-5 sm:body-2">{e.description}</span>
              <span className="tnum flex items-baseline gap-2 body-4 sm:body-1">
                {e.expression && (
                  <span className="caption-5 text-muted-foreground">
                    {e.expression} =
                  </span>
                )}
                {formatMoney(e.amount)}
              </span>
            </motion.li>
          ))}

          <motion.li
            className="grid h-12 grid-cols-[2rem_1fr] items-center gap-x-3 px-4 sm:grid-cols-[2.5rem_1fr] sm:gap-x-4 sm:px-6"
            {...row(LEDGER_ENTRIES.length)}
          >
            <label
              htmlFor={inputId}
              className="tnum caption-2 text-muted-foreground"
            >
              now
            </label>
            <div className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden="true"
                className="tnum body-2 text-muted-foreground"
              >
                ৳
              </span>
              <input
                id={inputId}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                placeholder="Try 120+80*2"
                value={draft}
                aria-label="Try an amount, sums are allowed"
                aria-invalid={invalid || undefined}
                onChange={(ev) =>
                  setDraft(sanitizeMoneyExpression(ev.target.value))
                }
                className={cn(
                  "tnum min-w-0 flex-1 rounded-sm bg-transparent body-1 outline-none placeholder:font-normal placeholder:text-muted-foreground/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                  invalid && "text-expense"
                )}
              />
              {hasOperator(draft) && (
                <ExpressionHint value={draft} className="shrink-0" />
              )}
            </div>
          </motion.li>
        </ol>
      </div>

      {/* Running total, double ruled like the foot of a ledger page */}
      <div className="flex items-baseline justify-between border-t-[3px] border-double px-4 py-4 sm:px-6">
        <p className="caption-1 text-muted-foreground">Spent today</p>
        <p className="tnum heading-6" aria-live="polite">
          {formatMoney(total)}
        </p>
      </div>
    </div>
  )
}
