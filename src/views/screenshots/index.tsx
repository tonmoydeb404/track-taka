"use client"

import { CircleNotchIcon, DownloadSimpleIcon } from "@phosphor-icons/react"
import { useCallback, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { LandingShell } from "@/views/landing"

import { FrameCard } from "./frame-card"
import { DEFAULT_SCALE, SCREENSHOT_ASSETS, assetFilename } from "./registry"
import { usePngExport } from "./use-png-export"

const SCALES = [1, 2, 3] as const

export function ScreenshotsPage() {
  const { busyId, progress, exportNode, exportAll } = usePngExport()
  const [scale, setScale] = useState<number>(DEFAULT_SCALE)
  const nodes = useRef(new Map<string, HTMLDivElement>())

  const registerNode = useCallback(
    (id: string) => (node: HTMLDivElement | null) => {
      if (node) nodes.current.set(id, node)
      else nodes.current.delete(id)
    },
    []
  )

  const narrow = SCREENSHOT_ASSETS.filter((a) => a.formFactor === "narrow")
  const wide = SCREENSHOT_ASSETS.filter((a) => a.formFactor === "wide")
  const exporting = progress !== null

  const handleExportAll = () =>
    void exportAll(
      SCREENSHOT_ASSETS.map((a) => ({
        id: a.id,
        filename: assetFilename(a, scale),
      })),
      (id) => nodes.current.get(id),
      scale
    )

  const renderGroup = (
    title: string,
    body: string,
    assets: typeof SCREENSHOT_ASSETS
  ) => (
    <section aria-label={title} className="pt-12">
      <h2 className="heading-6">{title}</h2>
      <p className="mt-1 max-w-reading body-6 text-pretty text-muted-foreground">
        {body}
      </p>
      <div className="mt-6 grid gap-6">
        {assets.map((asset) => (
          <FrameCard
            key={asset.id}
            asset={asset}
            scale={scale}
            busy={busyId === asset.id}
            onExport={() => {
              const node = nodes.current.get(asset.id)
              if (node)
                void exportNode(
                  asset.id,
                  node,
                  scale,
                  assetFilename(asset, scale)
                )
            }}
            registerNode={registerNode(asset.id)}
          />
        ))}
      </div>
    </section>
  )

  return (
    <LandingShell>
      <section className="app-gutter pt-24 pb-20 lg:pb-24">
        <div className="mx-auto mt-16 w-full max-w-content">
          <h1 className="max-w-[680px] heading-3 text-balance sm:heading-2">
            App screenshots
          </h1>
          <p className="mt-4 max-w-[680px] title-2 text-pretty text-muted-foreground">
            The frames behind the install prompt and store listings. Each one
            exports at its exact size; the files go in public/screenshots and
            the manifest points at them.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3 border-b pb-6">
            <p className="caption-2 text-muted-foreground">
              <span className="caption-1 text-foreground">
                {SCREENSHOT_ASSETS.length} frames
              </span>
              , PNG at {scale}×
            </p>
            <div
              role="group"
              aria-label="Export scale"
              className="ml-auto flex items-center gap-2"
            >
              <div className="flex items-center gap-1 rounded-full border bg-card p-1">
                {SCALES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={s === scale}
                    onClick={() => setScale(s)}
                    className={cn(
                      "rounded-full px-3 py-1 button-sm transition-colors duration-300 ease-landing focus-visible:outline-2 focus-visible:outline-ring",
                      s === scale
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleExportAll}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 button-sm text-primary-foreground transition-[background-color,transform] duration-300 ease-landing hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98] disabled:opacity-60"
              >
                {exporting ? (
                  <CircleNotchIcon
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <DownloadSimpleIcon className="size-4" aria-hidden="true" />
                )}
                {exporting ? `Exporting ${progress}` : "Download all"}
              </button>
            </div>
          </div>

          {renderGroup(
            "Phone",
            "Narrow form factor for the Android and desktop install prompts. All three share the 9:16 ratio Chrome requires within a form factor.",
            narrow
          )}
          {renderGroup(
            "Desktop",
            "Wide form factor, 16:9, shown by Chrome and Edge on desktop when the app is installed.",
            wide
          )}
        </div>
      </section>
    </LandingShell>
  )
}
