import { CheckCircle, Package } from "@phosphor-icons/react/dist/ssr"

import { LATEST_VERSION, RELEASE_NOTES } from "@/lib/release-notes"
import { cn } from "@/lib/utils"
import { Reveal } from "@/views/landing/components/reveal"

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

/** Vertical timeline of releases, latest marked. */
export function ReleaseTimeline() {
  return (
    <ol className="relative flex flex-col gap-12">
      <div
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-5 w-px bg-border"
      />
      {RELEASE_NOTES.map((note, i) => {
        const latest = note.version === LATEST_VERSION
        return (
          <Reveal
            key={note.version}
            as="li"
            delay={Math.min(i, 3) * 0.06}
            className="relative grid grid-cols-[2.5rem_1fr] gap-x-4 sm:gap-x-6 lg:grid-cols-[2.5rem_14rem_1fr]"
          >
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 flex size-10 items-center justify-center rounded-full border bg-background",
                latest
                  ? "border-primary bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Package
                weight={latest ? "fill" : "regular"}
                className="size-5"
              />
            </span>

            <div className="pt-2">
              <p className="tnum title-3">Version {note.version}</p>
              <time
                dateTime={note.date}
                className="caption-2 text-muted-foreground"
              >
                {formatDate(note.date)}
              </time>
              <div className="mt-2 flex flex-wrap gap-2">
                {latest && (
                  <span className="caption-4 rounded-full bg-accent px-2 py-0.5 text-accent-foreground">
                    Latest
                  </span>
                )}
                {note.breaking && (
                  <span className="caption-4 rounded-full bg-expense/10 px-2 py-0.5 text-expense">
                    Data does not carry over
                  </span>
                )}
              </div>
            </div>

            <div className="col-start-2 mt-6 rounded-2xl border bg-card p-6 text-card-foreground lg:col-start-3 lg:mt-0">
              <h2 className="heading-6 text-balance">{note.title}</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {note.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-3 body-6 text-pretty text-muted-foreground"
                  >
                    <CheckCircle
                      weight="fill"
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-primary"
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )
      })}
    </ol>
  )
}
