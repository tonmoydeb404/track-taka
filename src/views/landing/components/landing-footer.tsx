import Link from "next/link"

import { GITHUB_URL } from "../content"

const link =
  "ease-landing rounded-sm transition-colors duration-300 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

export function LandingFooter() {
  return (
    <footer className="app-gutter border-t py-8">
      <div className="mx-auto flex w-full max-w-content flex-col gap-4 caption-2 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="caption-1 text-foreground">Track Taka</span> is a
          free, open source personal finance tracker.
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-4">
          <Link href="/dashboard" className={link}>
            Open the app
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className={link}
          >
            GitHub
          </a>
          <Link href="/whats-new" className={link}>
            What&apos;s new
          </Link>
          <Link href="/privacy" className={link}>
            Privacy and terms
          </Link>
        </nav>
      </div>
    </footer>
  )
}
