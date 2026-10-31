"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { MotionConfig, motion } from "motion/react"

/**
 * Fades and lifts each dashboard page in when the route changes. Enter-only:
 * App Router unmounts the old page before the new one renders, so an exit
 * animation would need a frozen-router workaround for very little gain.
 * `reducedMotion="user"` drops the movement for people who ask for less.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  )
}
