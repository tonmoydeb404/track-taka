import { CheckCircle } from "@phosphor-icons/react/dist/ssr"

import { HERO } from "../content"

import { InstallButton } from "@/components/pwa"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Reveal } from "./reveal"

// Terms written as ledger lines, so the closing pitch reads like the khata
// page in the hero. Every line restates something the app already does.
const TERMS = [
  { label: "Price", value: "Free" },
  { label: "Account", value: "None needed" },
  { label: "Your data", value: "Stays on your phone" },
  { label: "Leaving", value: "Export a backup any time" },
] as const

// Dot grid tinted with the theme's primary colour; faded out by the mask below.
const DOTS = {
  backgroundImage:
    "radial-gradient(color-mix(in oklab, var(--primary) 35%, transparent) 1px, transparent 1px)",
  backgroundSize: "20px 20px",
  maskImage: "radial-gradient(ellipse 75% 85% at 70% 50%, black, transparent)",
  WebkitMaskImage:
    "radial-gradient(ellipse 75% 85% at 70% 50%, black, transparent)",
} as const

export function FinalCta() {
  return (
    <section
      aria-labelledby="final-heading"
      className="app-gutter pb-20 lg:pb-24"
    >
      <Reveal className="mx-auto w-full max-w-content">
        <div className="relative isolate overflow-hidden rounded-3xl bg-accent">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute inset-0" style={DOTS} />
            <div className="absolute -top-32 right-[8%] size-96 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute -bottom-40 -left-24 size-96 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-12 p-6 sm:p-12 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16 lg:p-16">
            <div className="flex flex-col items-start">
              <p className="caption-1 text-accent-foreground">
                Your first entry
              </p>
              <h2
                id="final-heading"
                className="mt-4 max-w-[680px] heading-3 text-balance lg:heading-2"
              >
                Start with what you spent today.
              </h2>
              <p className="mt-6 max-w-[680px] title-2 text-pretty text-muted-foreground">
                One account, one expense, and the month starts adding up. Your
                data stays yours, and you can leave whenever you like.
              </p>
              <div className="mt-8 flex flex-row flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/dashboard">{HERO.cta}</Link>
                </Button>
                <InstallButton className="bg-card/60 backdrop-blur-md hover:bg-card/90" />
              </div>
            </div>

            <Reveal delay={0.12}>
              <div className="relative overflow-hidden rounded-2xl border border-card/70 bg-card/60 text-card-foreground shadow-lg backdrop-blur-xl">
                <div className="flex items-baseline justify-between px-6 pt-6 pb-3">
                  <p className="title-2">Before you start</p>
                  <p className="caption-2 text-muted-foreground">Terms</p>
                </div>
                <div className="relative">
                  {/* The red margin line every khata has */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-[7.5rem] w-px bg-expense/40"
                  />
                  <ul className="relative divide-y border-t">
                    {TERMS.map((t) => (
                      <li
                        key={t.label}
                        className="grid min-h-12 grid-cols-[6rem_minmax(0,1fr)] items-center gap-x-6 px-6 py-2"
                      >
                        <span className="caption-2 text-muted-foreground">
                          {t.label}
                        </span>
                        <span className="flex items-center justify-between gap-2 body-5">
                          <span>{t.value}</span>
                          <CheckCircle
                            weight="fill"
                            className="size-4 shrink-0 text-income"
                            aria-hidden="true"
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Double rule, like the foot of a ledger page */}
                <div className="flex items-baseline justify-between border-t-[3px] border-double px-6 py-4">
                  <p className="caption-1 text-muted-foreground">
                    Cost to start
                  </p>
                  <p className="tnum heading-6">৳0</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
