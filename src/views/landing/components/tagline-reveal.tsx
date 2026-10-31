"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import { useRef } from "react"

/**
 * The tagline moment: large type that starts muted and lights up one word at
 * a time as the block scrolls through the lower part of the viewport. The
 * progress is spring smoothed so words settle rather than snap. Reduced
 * motion shows the final state right away.
 */
export function TaglineReveal({ lines }: { lines: readonly string[] }) {
  const words = lines.flatMap((line) => line.split(" "))
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    // Starts when the block's top reaches 85% down the viewport and finishes
    // when its bottom passes the 40% line.
    offset: ["start 0.85", "end 0.4"],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  })

  let index = 0
  return (
    <section aria-label="Tagline" className="app-gutter py-20 lg:py-24">
      <p
        ref={ref}
        className="mx-auto max-w-[680px] text-center heading-3 text-balance sm:heading-2"
      >
        {lines.map((line, l) => (
          <span key={l} className="block">
            {line.split(" ").map((w, i, arr) => (
              <Word
                key={i}
                word={w}
                index={index++}
                total={words.length}
                progress={progress}
                reduce={!!reduce}
                last={i === arr.length - 1}
              />
            ))}
          </span>
        ))}
      </p>
    </section>
  )
}

function Word({
  word,
  index,
  total,
  progress,
  reduce,
  last,
}: {
  word: string
  index: number
  total: number
  progress: MotionValue<number>
  reduce: boolean
  last: boolean
}) {
  // Each word owns an equal slice of the progress range.
  const start = index / total
  const end = (index + 1) / total
  const opacity = useTransform(progress, [start, end], [0.3, 1])
  return (
    <>
      <motion.span
        className="inline-block"
        style={{ opacity: reduce ? 1 : opacity }}
      >
        {word}
      </motion.span>
      {!last && " "}
    </>
  )
}
