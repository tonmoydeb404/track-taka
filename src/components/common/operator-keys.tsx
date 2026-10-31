"use client"

import { Button } from "@/components/ui/button"

const KEYS = [
  { label: "+", text: "+", name: "plus" },
  { label: "−", text: "-", name: "minus" },
  { label: "×", text: "*", name: "times" },
  { label: "÷", text: "/", name: "divided by" },
  { label: "(", text: "(", name: "open bracket" },
  { label: ")", text: ")", name: "close bracket" },
] as const

/**
 * Operator keys for phones, whose decimal keypad has none. They append to the
 * amount text without taking focus, so the keyboard stays open.
 */
export function OperatorKeys({
  onInsert,
}: {
  onInsert: (text: string) => void
}) {
  return (
    <div className="grid grid-cols-6 gap-1.5" role="group" aria-label="Math">
      {KEYS.map((key) => (
        <Button
          key={key.name}
          type="button"
          variant="outline"
          className="h-11 text-lg font-medium"
          aria-label={key.name}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onInsert(key.text)}
        >
          {key.label}
        </Button>
      ))}
    </div>
  )
}
