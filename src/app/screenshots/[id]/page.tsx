import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SCREENSHOT_ASSETS } from "@/views/screenshots/registry"

// One frame, bare, at its exact CSS size in the top left corner. Point a
// browser with a viewport of that size at it and a screenshot at device
// pixel ratio 2 is the finished 2x PNG. Used to generate public/screenshots.

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export function generateStaticParams() {
  return SCREENSHOT_ASSETS.map((a) => ({ id: a.id }))
}

export default async function RawFramePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const asset = SCREENSHOT_ASSETS.find((a) => a.id === id)
  if (!asset) notFound()
  const { Component, width, height } = asset
  return (
    <div
      className="fixed top-0 left-0 overflow-hidden"
      style={{ width, height }}
    >
      <Component />
    </div>
  )
}
