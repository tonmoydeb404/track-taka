"use client"

import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

/**
 * False during SSR and the very first client render, true afterwards.
 * Use it to gate time-dependent or localStorage-derived output so the
 * server HTML and the first client render always match.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}
