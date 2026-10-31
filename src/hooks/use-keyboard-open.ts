"use client"

import { useEffect, useState } from "react"

/**
 * True while the on-screen keyboard is likely open. Detected as the visual
 * viewport shrinking well below the layout viewport.
 */
export function useKeyboardOpen(): boolean {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const update = () => setOpen(window.innerHeight - vv.height > 150)
    update()
    vv.addEventListener("resize", update)
    return () => vv.removeEventListener("resize", update)
  }, [])

  return open
}
