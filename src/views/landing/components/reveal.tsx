"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

export const LANDING_EASE = [0.22, 1, 0.36, 1] as const

interface RevealProps {
  children: ReactNode
  className?: string
  /** Stagger within a group, in seconds. */
  delay?: number
  /** Render as a list item when the parent is a list, to keep the DOM valid. */
  as?: "div" | "li"
}

/**
 * Rises 32px and fades in once, when it enters the viewport. Only transform
 * and opacity are animated. With reduced motion it only fades.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion()
  const Tag = as === "li" ? motion.li : motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: LANDING_EASE, delay }}
    >
      {children}
    </Tag>
  )
}
