import type { ReactNode } from "react"

import { STEPS } from "../content"
import {
  AccountsFragment,
  BudgetsFragment,
  QuickEntryFragment,
} from "./fragments"
import { Reveal } from "./reveal"

const VISUALS: ReactNode[] = [
  <AccountsFragment key="accounts" />,
  <QuickEntryFragment key="entry" />,
  <BudgetsFragment key="budgets" />,
]

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-heading"
      className="app-gutter py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-content">
        <Reveal>
          <h2
            id="how-heading"
            className="max-w-[680px] heading-4 text-balance sm:heading-3"
          >
            Three steps, then it runs itself.
          </h2>
        </Reveal>
        <ol className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal
              key={s.title}
              as="li"
              delay={i * 0.08}
              className="flex h-full flex-col gap-6 rounded-2xl border bg-card p-4 text-card-foreground sm:p-6"
            >
              <div className="flex-1">{VISUALS[i]}</div>
              <div className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="tnum flex size-10 shrink-0 items-center justify-center rounded-full bg-primary title-3 text-primary-foreground"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="heading-6">{s.title}</h3>
                  <p className="mt-2 body-6 text-pretty text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
