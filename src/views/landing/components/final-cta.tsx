import { HERO } from "../content"

import { InstallButton } from "@/components/pwa"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Reveal } from "./reveal"

export function FinalCta() {
  return (
    <section
      aria-labelledby="final-heading"
      className="app-gutter pb-20 lg:pb-24"
    >
      <Reveal className="mx-auto w-full max-w-content">
        <div className="flex flex-col items-center rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12 lg:py-24">
          <h2
            id="final-heading"
            className="max-w-[680px] heading-3 text-balance lg:heading-2"
          >
            Start with what you spent today.
          </h2>
          <p className="mt-6 max-w-[680px] title-2 text-pretty opacity-80">
            One account, one expense, and the month starts adding up. Free, no
            account, and your data stays yours. Export it any time and leave
            whenever you like.
          </p>
          <div className="mt-8 flex flex-row flex-wrap items-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link href="/dashboard">{HERO.cta}</Link>
            </Button>
            <InstallButton />
          </div>
        </div>
      </Reveal>
    </section>
  )
}
