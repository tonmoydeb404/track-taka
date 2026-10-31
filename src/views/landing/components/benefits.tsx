import type { Icon } from "@phosphor-icons/react"
import {
  Calculator,
  ChartBar,
  LockKey,
  Wallet,
} from "@phosphor-icons/react/dist/ssr"

import { BENEFITS } from "../content"
import { Reveal } from "./reveal"

const ICONS: Record<(typeof BENEFITS)[number]["icon"], Icon> = {
  calculator: Calculator,
  wallet: Wallet,
  chart: ChartBar,
  lock: LockKey,
}

export function Benefits() {
  return (
    <section
      aria-labelledby="benefits-heading"
      className="app-gutter py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-content">
        <Reveal>
          <h2
            id="benefits-heading"
            className="max-w-[680px] heading-4 text-balance sm:heading-3"
          >
            What you get from writing it down.
          </h2>
        </Reveal>
        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {BENEFITS.map((b, i) => {
            const Icon = ICONS[b.icon]
            return (
              <Reveal
                key={b.title}
                as="li"
                delay={i * 0.08}
                className="flex h-full flex-col gap-6 rounded-2xl border bg-card p-6 text-card-foreground"
              >
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground"
                >
                  <Icon weight="duotone" className="size-6" />
                </span>
                <div>
                  <h3 className="heading-6">{b.title}</h3>
                  <p className="mt-2 body-6 text-pretty text-muted-foreground">
                    {b.body}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
