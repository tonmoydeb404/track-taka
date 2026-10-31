"use client"

import { toPng } from "html-to-image"
import { useCallback, useState } from "react"

const FONT_URL_RE = /url\((['"]?)([^'")]+)\1\)/g

async function fetchAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const blob = await res.blob()
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

/**
 * Collect every @font-face rule in the document. cssRules can throw for
 * cross origin or dev server sheets, so fall back to fetching the sheet.
 */
async function collectFontFaceBlocks(): Promise<
  { css: string; base: string }[]
> {
  const blocks: { css: string; base: string }[] = []
  for (const sheet of Array.from(document.styleSheets)) {
    const base = sheet.href ?? document.baseURI
    let readable = true
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        if (rule instanceof CSSFontFaceRule)
          blocks.push({ css: rule.cssText, base })
      }
    } catch {
      readable = false
    }
    if (readable || !sheet.href) continue
    try {
      const text = await (await fetch(sheet.href)).text()
      for (const match of text.matchAll(/@font-face\s*{[^}]*}/g)) {
        blocks.push({ css: match[0], base })
      }
    } catch {
      // Neither readable nor fetchable: skip.
    }
  }
  return blocks
}

async function inlineFontUrls(css: string, base: string): Promise<string> {
  let out = css
  for (const match of css.matchAll(FONT_URL_RE)) {
    const raw = match[2]
    if (!raw) continue
    let absolute: string
    try {
      absolute = new URL(raw, base).href
    } catch {
      continue
    }
    const dataUrl = await fetchAsDataUrl(absolute)
    if (dataUrl) out = out.replace(match[0], `url("${dataUrl}")`)
  }
  return out
}

let fontEmbedCache: Promise<string> | null = null

/** Self contained @font-face CSS with every font file inlined. */
function getFontEmbedCSS(): Promise<string> {
  if (!fontEmbedCache) {
    fontEmbedCache = (async () => {
      const blocks = await collectFontFaceBlocks()
      const inlined = await Promise.all(
        blocks.map((b) => inlineFontUrls(b.css, b.base))
      )
      return inlined.join("\n")
    })()
    fontEmbedCache.catch(() => {
      fontEmbedCache = null
    })
  }
  return fontEmbedCache
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Render a frame node to a PNG at its layout size times `scale`. The preview
 * wraps frames in a CSS scale transform, which is neutralised during export
 * so the PNG is pixel exact.
 */
export async function renderNodeToPng(
  node: HTMLElement,
  scale: number
): Promise<string> {
  const prevTransform = node.style.transform
  const prevVisibility = node.style.visibility
  node.style.transform = "none"
  node.style.visibility = "visible"
  try {
    await document.fonts.ready
    const fontEmbedCSS = await getFontEmbedCSS()
    return await toPng(node, {
      pixelRatio: scale,
      fontEmbedCSS,
      cacheBust: true,
    })
  } finally {
    node.style.transform = prevTransform
    node.style.visibility = prevVisibility
  }
}

export function usePngExport() {
  const [busyId, setBusyId] = useState<string | null>(null)
  const [progress, setProgress] = useState<string | null>(null)

  const exportNode = useCallback(
    async (id: string, node: HTMLElement, scale: number, filename: string) => {
      setBusyId(id)
      try {
        const dataUrl = await renderNodeToPng(node, scale)
        const link = document.createElement("a")
        link.download = filename
        link.href = dataUrl
        link.click()
      } finally {
        setBusyId(null)
      }
    },
    []
  )

  const exportAll = useCallback(
    async (
      assets: { id: string; filename: string }[],
      getNode: (id: string) => HTMLElement | undefined,
      scale: number
    ) => {
      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i]!
        const node = getNode(asset.id)
        if (!node) continue
        setProgress(`${i + 1} of ${assets.length}`)
        await exportNode(asset.id, node, scale, asset.filename)
        await delay(400)
      }
      setProgress(null)
    },
    [exportNode]
  )

  return { busyId, progress, exportNode, exportAll }
}
