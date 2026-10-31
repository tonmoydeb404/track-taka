import { PROBLEM } from "../content"
import { Reveal } from "./reveal"

export function ProblemSolution() {
  return (
    <section
      aria-labelledby="problem-heading"
      className="app-gutter py-20 lg:py-24"
    >
      <div className="mx-auto grid w-full max-w-content grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <h2
            id="problem-heading"
            className="heading-4 text-balance sm:heading-3"
          >
            {PROBLEM.heading}
          </h2>
        </Reveal>
        <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.08}>
            <p className="body-3 text-pretty text-muted-foreground">
              {PROBLEM.problem}
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="body-2 text-pretty">{PROBLEM.solution}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
