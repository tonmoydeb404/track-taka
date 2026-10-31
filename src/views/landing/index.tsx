import type { ReactNode } from "react"

import { TAGLINE } from "./content"
import { Benefits } from "./components/benefits"
import { Faq } from "./components/faq"
import { FinalCta } from "./components/final-cta"
import { Hero } from "./components/hero"
import { HowItWorks } from "./components/how-it-works"
import { LandingFooter } from "./components/landing-footer"
import { LandingNav } from "./components/landing-nav"
import { ProblemSolution } from "./components/problem-solution"
import { TaglineReveal } from "./components/tagline-reveal"

/** Shared chrome for the public pages: skip link, floating nav, footer. */
export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <div className="landing flex min-h-dvh flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only rounded-lg bg-primary px-3 py-2 button-sm text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60]"
      >
        Skip to content
      </a>
      <LandingNav />
      <main id="main" className="flex-1">
        {children}
      </main>
      <LandingFooter />
    </div>
  )
}

/** Public landing page at "/". The app itself lives under /dashboard. */
export function LandingPage() {
  return (
    <LandingShell>
      <Hero />
      <ProblemSolution />
      <TaglineReveal lines={TAGLINE} />
      <Benefits />
      <HowItWorks />
      <Faq />
      <FinalCta />
    </LandingShell>
  )
}
