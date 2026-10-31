import Link from "next/link"

import { LandingShell } from "@/views/landing"

export default function NotFound() {
  return (
    <LandingShell>
      <section className="app-gutter flex flex-1 items-center pt-24 pb-20">
        <div className="mx-auto flex w-full max-w-reading flex-col items-start">
          <p className="caption-1 text-muted-foreground">Page not found</p>
          <h1 className="mt-4 heading-3 text-balance sm:heading-2">
            That page is not in the khata.
          </h1>
          <p className="mt-6 body-3 text-pretty text-muted-foreground">
            The address may have changed or never existed. The app and the home
            page are still where they were.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-lg bg-primary px-3 py-2 button-md text-primary-foreground transition-[background-color,transform] duration-300 ease-landing hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]"
            >
              Open the app
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border bg-card px-3 py-2 button-md transition-[background-color,transform] duration-300 ease-landing hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]"
            >
              Back to the home page
            </Link>
          </div>
        </div>
      </section>
    </LandingShell>
  )
}
