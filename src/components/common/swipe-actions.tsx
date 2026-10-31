"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface SwipeAction {
  label: string
  icon: LucideIcon
  onSelect: () => void
  /** Tailwind classes for the action's background and text. */
  className: string
}

const ACTION_WIDTH = 76
const DRAG_START = 8

// Only one row stays open at a time
let closeOpenRow: (() => void) | null = null

/**
 * Swipe a row left to reveal actions (touch or mouse). Vertical scrolling is
 * untouched; the content must paint its own background so the actions stay
 * hidden behind it. Taps on the content still work, and a tap while open
 * just closes the row.
 */
export function SwipeActions({
  actions,
  children,
  className,
}: {
  actions: SwipeAction[]
  children: ReactNode
  className?: string
}) {
  const width = ACTION_WIDTH * actions.length
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{
    x: number
    y: number
    from: number
    active: boolean
    decided: boolean
  } | null>(null)
  const moved = useRef(false)
  const offsetRef = useRef(0)

  const set = useCallback((v: number) => {
    offsetRef.current = v
    setOffset(v)
  }, [])

  const close = useCallback(() => set(0), [set])

  // Tapping anywhere else closes an open row
  useEffect(() => {
    if (offset === 0) return
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest("[data-swipe-row='open']")) close()
    }
    document.addEventListener("pointerdown", onDown)
    return () => document.removeEventListener("pointerdown", onDown)
  }, [offset, close])

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      from: offsetRef.current,
      active: false,
      decided: false,
    }
    moved.current = false
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.decided) {
      if (Math.abs(dx) < DRAG_START && Math.abs(dy) < DRAG_START) return
      d.decided = true
      // A mostly vertical gesture is a scroll: leave it alone
      d.active = Math.abs(dx) > Math.abs(dy)
      if (d.active) {
        e.currentTarget.setPointerCapture(e.pointerId)
        setDragging(true)
        if (closeOpenRow && closeOpenRow !== close) closeOpenRow()
        closeOpenRow = close
      }
    }
    if (!d.active) return
    moved.current = true
    set(Math.max(-width - 24, Math.min(0, d.from + dx)))
  }

  const onPointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    drag.current = null
    if (!d?.active) return
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    setDragging(false)
    set(offsetRef.current < -width / 2 ? -width : 0)
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="absolute inset-y-0 right-0 flex"
        style={{ width }}
        aria-hidden={offset === 0}
      >
        {actions.map(({ label, icon: Icon, onSelect, className: tone }) => (
          <button
            key={label}
            type="button"
            tabIndex={offset === 0 ? -1 : 0}
            onClick={() => {
              close()
              onSelect()
            }}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium",
              tone
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      <div
        data-swipe-row={offset === 0 ? "closed" : "open"}
        className={cn(
          "relative touch-pan-y bg-card",
          !dragging && "transition-transform duration-200 ease-out"
        )}
        style={{ transform: `translateX(${offset}px)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        // A drag or a tap-to-close must not also open the row's detail
        onClickCapture={(e) => {
          if (moved.current || offsetRef.current !== 0) {
            e.preventDefault()
            e.stopPropagation()
            moved.current = false
            if (offsetRef.current !== 0) close()
          }
        }}
      >
        {children}
      </div>
    </div>
  )
}
