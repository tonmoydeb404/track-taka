"use client"

import Link from "next/link"
import { List, X } from "@phosphor-icons/react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"

import { BrandMark } from "@/components/common"

import { GITHUB_URL, NAV_ITEMS } from "../content"
import { LANDING_EASE } from "./reveal"

const base = { duration: 0.5, ease: LANDING_EASE }

/**
 * Compact bar floating off the top edge, sized to its content. On phones the
 * menu opens as a full height blurred panel with links arriving in order.
 */
export function LandingNav() {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
        initial={{ opacity: 0, y: reduce ? 0 : -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={base}
      >
        <nav
          aria-label="Site"
          className="flex items-center gap-2 rounded-full border bg-background/70 p-2 pl-3 shadow-sm backdrop-blur-xl"
        >
          <Link
            href="/"
            aria-current="page"
            className="flex items-center gap-2 rounded-full pr-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <BrandMark className="size-8 shrink-0" label="" />
            <span className="title-3">Track Taka</span>
          </Link>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full px-3 py-2 button-sm text-muted-foreground transition-colors duration-300 ease-landing hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring active:scale-[0.98] sm:inline-flex"
          >
            GitHub
          </a>
          <Link
            href="/dashboard"
            className="hidden rounded-full bg-primary px-3 py-2 button-sm text-primary-foreground transition-[background-color,transform] duration-300 ease-landing hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] sm:inline-flex"
          >
            Open the app
          </Link>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="landing-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="flex size-10 items-center justify-center rounded-full transition-colors duration-300 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring active:scale-[0.98] sm:hidden"
          >
            <span className="relative block size-5">
              <motion.span
                className="absolute inset-0"
                animate={
                  open
                    ? { opacity: 0, rotate: 90, scale: 0.75 }
                    : { opacity: 1, rotate: 0, scale: 1 }
                }
                transition={base}
              >
                <List weight="bold" className="size-5" />
              </motion.span>
              <motion.span
                className="absolute inset-0"
                initial={false}
                animate={
                  open
                    ? { opacity: 1, rotate: 0, scale: 1 }
                    : { opacity: 0, rotate: -90, scale: 0.75 }
                }
                transition={base}
              >
                <X weight="bold" className="size-5" />
              </motion.span>
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="landing-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col justify-center bg-background/95 px-6 backdrop-blur-2xl sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={base}
          >
            <motion.ul
              className="flex flex-col gap-2"
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.06 } },
                closed: {},
              }}
            >
              {NAV_ITEMS.map((item) => (
                <motion.li
                  key={item.href}
                  variants={{
                    closed: { opacity: 0, y: reduce ? 0 : 24 },
                    open: { opacity: 1, y: 0 },
                  }}
                  transition={base}
                >
                  {"external" in item ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-lg py-3 heading-5 focus-visible:outline-2 focus-visible:outline-ring"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="block rounded-lg py-3 heading-5 focus-visible:outline-2 focus-visible:outline-ring"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
