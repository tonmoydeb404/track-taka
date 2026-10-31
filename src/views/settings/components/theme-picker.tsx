"use client"

import { Check } from "lucide-react"

import type { ThemeMode } from "@/lib/db"
import { cn } from "@/lib/utils"

import { THEME_LABELS } from "../utils"

type Theme = ThemeMode

const TONES = {
  light: { bg: "#f3f7fb", card: "#ffffff", line: "#d3deea", accent: "#0069a8" },
  dark: { bg: "#0b121a", card: "#16222f", line: "#2c3e52", accent: "#5aaee6" },
} as const

/** A miniature of the app in one tone: page, a card with two lines, a brand-colored pill. */
function Mini({ tone }: { tone: keyof typeof TONES }) {
  const t = TONES[tone]
  return (
    <div className="absolute inset-0 p-2" style={{ backgroundColor: t.bg }}>
      <div
        className="flex h-full flex-col justify-between rounded-md p-1.5"
        style={{ backgroundColor: t.card }}
      >
        <div className="flex flex-col gap-1">
          <span
            className="h-1 w-2/3 rounded-full"
            style={{ backgroundColor: t.line }}
          />
          <span
            className="h-1 w-1/3 rounded-full"
            style={{ backgroundColor: t.line }}
          />
        </div>
        <span
          className="h-2 w-1/2 rounded-full"
          style={{ backgroundColor: t.accent }}
        />
      </div>
    </div>
  )
}

function Preview({ theme }: { theme: Theme }) {
  return (
    <span className="relative block h-20 overflow-hidden rounded-lg border">
      {theme === "system" ? (
        <>
          <Mini tone="light" />
          {/* The dark half is clipped to a diagonal so you see both at once */}
          <span
            className="absolute inset-0"
            style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
          >
            <Mini tone="dark" />
          </span>
        </>
      ) : (
        <Mini tone={theme} />
      )}
    </span>
  )
}

export function ThemePicker({
  value,
  onChange,
}: {
  value: Theme
  onChange: (theme: Theme) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="grid grid-cols-3 gap-3"
    >
      {(["light", "dark", "system"] as const).map((theme) => {
        const on = value === theme
        return (
          <button
            key={theme}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(theme)}
            className={cn(
              "flex touch-manipulation flex-col gap-2 rounded-xl border bg-card p-2 text-left transition-colors select-none active:scale-[0.97]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              on && "border-primary ring-1 ring-primary"
            )}
          >
            <Preview theme={theme} />
            <span className="flex items-center justify-between gap-1 px-1 pb-0.5 text-sm font-semibold">
              {THEME_LABELS[theme]}
              {on ? (
                <Check className="size-4 text-primary" aria-hidden="true" />
              ) : null}
            </span>
          </button>
        )
      })}
    </div>
  )
}
