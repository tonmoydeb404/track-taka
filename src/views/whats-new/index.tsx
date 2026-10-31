import { LandingShell } from "@/views/landing"

import { ReleaseTimeline } from "./release-timeline"

export function WhatsNewPage() {
  return (
    <LandingShell>
      <section className="app-gutter pt-24 pb-20 lg:pb-24">
        <div className="mx-auto mt-16 w-full max-w-content">
          <h1 className="max-w-[680px] heading-3 text-balance sm:heading-2">
            What&apos;s new
          </h1>
          <p className="mt-4 max-w-[680px] title-2 text-pretty text-muted-foreground">
            Every release of Track Taka, newest first, with what changed and
            when.
          </p>
          <div className="mt-12 lg:mt-16">
            <ReleaseTimeline />
          </div>
        </div>
      </section>
    </LandingShell>
  )
}
