"use client"

import { CircleNotchIcon, DownloadSimpleIcon } from "@phosphor-icons/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

import type { ScreenshotAsset } from "./registry"

/** Scales a fixed size frame down to fit its container; exports stay exact. */
function ScaledPreview({
  width,
  height,
  innerRef,
  children,
}: {
  width: number
  height: number
  innerRef: (node: HTMLDivElement | null) => void
  children: ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setScale(Math.min(1, el.clientWidth / width))
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [width])

  return (
    <div
      ref={containerRef}
      className="flex justify-center overflow-hidden"
      style={{ height: scale > 0 ? height * scale : undefined }}
    >
      <div
        className="shrink-0 overflow-hidden"
        style={{ width: width * (scale || 1), height: height * (scale || 1) }}
      >
        <div
          ref={innerRef}
          data-frame
          style={{
            width,
            height,
            transform: `scale(${scale || 1})`,
            transformOrigin: "top left",
            visibility: scale > 0 ? "visible" : "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export function FrameCard({
  asset,
  scale,
  busy,
  onExport,
  registerNode,
}: {
  asset: ScreenshotAsset
  scale: number
  busy: boolean
  onExport: () => void
  registerNode: (node: HTMLDivElement | null) => void
}) {
  const { Component } = asset
  return (
    <figure className="overflow-hidden rounded-2xl border bg-card text-card-foreground">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <figcaption>
          <p className="title-3">{asset.name}</p>
          <p className="tnum mt-0.5 caption-2 text-muted-foreground">
            {asset.width * scale}×{asset.height * scale} PNG, {asset.formFactor}
            . {asset.note}.
          </p>
        </figcaption>
        <button
          type="button"
          onClick={onExport}
          disabled={busy}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-lg border bg-background px-3 py-2 button-sm transition-[background-color,transform] duration-300 ease-landing hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] disabled:opacity-60"
          )}
        >
          {busy ? (
            <CircleNotchIcon
              className="size-4 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <DownloadSimpleIcon className="size-4" aria-hidden="true" />
          )}
          {busy ? "Rendering" : "Download PNG"}
        </button>
      </div>
      <div className="border-t bg-muted/40 p-6">
        <div className="overflow-hidden rounded-lg shadow-md ring-1 ring-black/5">
          <ScaledPreview
            width={asset.width}
            height={asset.height}
            innerRef={registerNode}
          >
            <Component />
          </ScaledPreview>
        </div>
      </div>
    </figure>
  )
}
