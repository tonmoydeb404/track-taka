import { CaretDown } from "@phosphor-icons/react/dist/ssr"

import { FAQS } from "../content"
import { Reveal } from "./reveal"

export function Faq() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="app-gutter py-20 lg:py-24"
    >
      <div className="mx-auto grid w-full max-w-content grid-cols-1 gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 id="faq-heading" className="heading-4 text-balance sm:heading-3">
            Questions people ask first.
          </h2>
          <p className="mt-4 max-w-[480px] body-2 text-muted-foreground">
            Here are some of the most common questions people have when getting
            started.
          </p>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-7 lg:col-start-6">
          <div className="divide-y rounded-2xl border bg-card px-6 text-card-foreground">
            {FAQS.map((f) => (
              <details key={f.question} className="group py-2">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-3 title-2 transition-colors duration-300 ease-landing select-none hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <CaretDown
                    weight="bold"
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground transition-transform duration-500 ease-landing group-open:rotate-180"
                  />
                </summary>
                <p className="max-w-reading pb-4 body-3 text-pretty text-muted-foreground">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
