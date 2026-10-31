"use client"

import { CheckCircle } from "@phosphor-icons/react"
import { motion, useReducedMotion } from "motion/react"

import { HERO } from "../content"
import { CtaButton } from "./cta-button"
import { KhataLedger } from "./khata-ledger"
import { LANDING_EASE } from "./reveal"

export function Hero() {
  const reduce = useReducedMotion()
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    shown: { opacity: 1, y: 0 },
  }
  const transition = { duration: 0.7, ease: LANDING_EASE }

  return (
    <section className="app-gutter pt-24">
      <motion.div
        className="mx-auto mt-16 flex w-full max-w-content flex-col items-center text-center lg:mt-20"
        initial="hidden"
        animate="shown"
        variants={{ shown: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.h1
          variants={item}
          transition={transition}
          className="hero-heading max-w-[680px] heading-3 text-balance sm:heading-2"
        >
          {HERO.headlineA}
          <br className="hidden sm:block" /> {HERO.headlineB}
        </motion.h1>
        <motion.p
          variants={item}
          transition={transition}
          className="mt-6 max-w-[680px] title-2 text-pretty text-muted-foreground"
        >
          {HERO.sub}
        </motion.p>
        <motion.div
          variants={item}
          transition={transition}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <CtaButton>{HERO.cta}</CtaButton>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 caption-1 text-muted-foreground">
            {HERO.proof.map((p) => (
              <li key={p} className="flex items-center gap-1">
                <CheckCircle
                  weight="fill"
                  className="size-4 text-income"
                  aria-hidden="true"
                />
                {p}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={item}
          transition={transition}
          className="mt-16 w-full max-w-2xl rounded-3xl bg-accent p-3 sm:p-6"
        >
          <KhataLedger />
        </motion.div>
      </motion.div>
    </section>
  )
}
