"use client"

import { useEffect } from "react"

import { useSettings } from "@/hooks"

/**
 * Applies the theme stored in the settings document to <html>. Renders nothing.
 * 'light' → removes .dark, 'dark' → adds .dark,
 * 'system' → follows prefers-color-scheme with a live change listener.
 */
export function ThemeSync() {
  const { theme } = useSettings()

  useEffect(() => {
    const root = document.documentElement

    if (theme !== "system") {
      root.classList.toggle("dark", theme === "dark")
      return
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = () => root.classList.toggle("dark", media.matches)
    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [theme])

  return null
}
