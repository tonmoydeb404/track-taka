"use client"

import { RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

import { haptic } from "@/lib/haptics"
import { cn } from "@/lib/utils"

/** Finger travel (px) that arms a refresh, after damping. */
const THRESHOLD = 64
const MAX_PULL = 110
/** The finger moves further than the page does — it feels weighty. */
const DAMPING = 0.5

/**
 * Pull down from the top of any page to reload it. The shell turns off the
 * browser's own gesture (`overscroll-behavior-y: none` in base.css, to kill
 * the rubber-band flash), and installed iOS apps never had one — so this is
 * the single implementation for every phone. It only starts when the page
 * is scrolled to the very top, the drag is mostly vertical, and no sheet or
 * dialog is open, so it never competes with scrolling or a bottom drawer.
 */
export function PullToRefresh() {
  const [pull, setPull] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return

    let start: { x: number; y: number } | null = null
    let current = 0
    let armed = false

    const update = (value: number) => {
      current = value
      setPull(value)
    }
    const reset = () => {
      start = null
      armed = false
      setDragging(false)
      update(0)
    }

    const onStart = (e: TouchEvent) => {
      const blocked =
        window.scrollY > 0 ||
        e.touches.length !== 1 ||
        document.querySelector('[role="dialog"]') !== null
      if (blocked) {
        start = null
        return
      }
      start = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }

    const onMove = (e: TouchEvent) => {
      if (!start) return
      const dx = e.touches[0].clientX - start.x
      const dy = e.touches[0].clientY - start.y
      // Scrolled away, dragged up or mostly sideways: not a pull.
      if (window.scrollY > 0 || dy <= 0 || Math.abs(dx) > dy) {
        if (current > 0) reset()
        return
      }
      setDragging(true)
      const value = Math.min(MAX_PULL, dy * DAMPING)
      update(value)
      if (!armed && value >= THRESHOLD) {
        armed = true
        haptic(12)
      } else if (armed && value < THRESHOLD) {
        armed = false
      }
    }

    const onEnd = () => {
      if (!start) return
      if (current >= THRESHOLD) {
        start = null
        setDragging(false)
        setRefreshing(true)
        update(THRESHOLD)
        // Let the spinner paint before the page goes away.
        window.setTimeout(() => window.location.reload(), 150)
        return
      }
      reset()
    }

    window.addEventListener("touchstart", onStart, { passive: true })
    window.addEventListener("touchmove", onMove, { passive: true })
    window.addEventListener("touchend", onEnd)
    window.addEventListener("touchcancel", reset)
    return () => {
      window.removeEventListener("touchstart", onStart)
      window.removeEventListener("touchmove", onMove)
      window.removeEventListener("touchend", onEnd)
      window.removeEventListener("touchcancel", reset)
    }
  }, [])

  if (pull === 0 && !refreshing) return null

  const ready = pull >= THRESHOLD

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-[env(safe-area-inset-top)] lg:hidden"
    >
      <div
        style={{
          transform: `translateY(${pull - 8}px)`,
          opacity: Math.min(1, pull / (THRESHOLD * 0.6)),
        }}
        className={cn(
          "flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md",
          !dragging && "transition-[transform,opacity] duration-200",
          ready && "text-primary"
        )}
      >
        <RefreshCw
          style={{
            transform: refreshing ? undefined : `rotate(${pull * 3}deg)`,
          }}
          className={cn("size-5", refreshing && "animate-spin")}
        />
      </div>
    </div>
  )
}
