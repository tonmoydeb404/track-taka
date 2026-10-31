#!/usr/bin/env node
// Syncs everything brand-owned from its sources:
//
//   brand.json            -> package.json version
//   public/brand/mark.svg -> every icon and lockup in the repo:
//     src/app/icon.svg                 Next.js metadata copy of the tile
//     public/icons/icon.svg            static copy at a stable path
//     public/icons/icon-maskable.svg   full-bleed mark, glyph in safe zone
//     public/icons/icon-192.png        PWA manifest (any)
//     public/icons/icon-512.png        PWA manifest (any)
//     public/icons/icon-maskable-512.png  Android adaptive launcher
//     public/icons/apple-touch-icon.png   iOS home screen (safe zone, 180)
//     public/brand/logo.svg            horizontal lockup, light surfaces
//     public/brand/logo-dark.svg       horizontal lockup, dark surfaces
//     public/offline.html              inline mark in the SW fallback page
//     src/app/favicon.ico              browser tabs (16/32/48)
//
// The lockups keep their outlined "Track Taka" wordmark (Manrope Bold
// converted to outlines, so no font is needed); only the embedded mark is
// swapped. The wordmark path data is preserved verbatim from the current
// files, which is also what makes re-runs idempotent.
//
// Needs a rasterizer on PATH: rsvg-convert (brew install librsvg) or
// ImageMagick (magick). Run with --check to verify everything is fresh
// (exit 1 when stale) without writing.

import { execFile } from "node:child_process"
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { resolve } from "node:path"
import { promisify } from "node:util"

const run = promisify(execFile)

const ROOT = resolve(process.cwd())
const CHECK = process.argv.includes("--check")

const BRAND = resolve(ROOT, "brand.json")
const PKG = resolve(ROOT, "package.json")

// The single hand-made source: the standalone brand tile.
const MARK = resolve(ROOT, "public/brand/mark.svg")

const APP_ICON = "src/app/icon.svg"
const PUBLIC_SVG = "public/icons/icon.svg"
const MASKABLE_SVG = "public/icons/icon-maskable.svg"
const LOGO_LIGHT = "public/brand/logo.svg"
const LOGO_DARK = "public/brand/logo-dark.svg"
const OFFLINE_HTML = "public/offline.html"
const FAVICON = "src/app/favicon.ico"

// Raster targets: [source svg (absolute input or generated relative output),
// size, output path]. Relative sources resolve inside the output root so
// --check renders the freshly generated SVGs, not stale repo copies.
const RASTER = [
  [MARK, 192, "public/icons/icon-192.png"],
  [MARK, 512, "public/icons/icon-512.png"],
  [MASKABLE_SVG, 512, "public/icons/icon-maskable-512.png"],
  [MASKABLE_SVG, 180, "public/icons/apple-touch-icon.png"],
]

// Favicon sizes are classic tab resolutions; 48 is the largest lossless entry
// most desktop browsers pick.
const FAVICON_SIZES = [16, 32, 48]

// The lockup embeds the 512-tile at 100px: scale = 100 / 512.
const LOGO_SCALE = 0.1953125

// --- SVG surgery -----------------------------------------------------------

// Content between the <svg> tags of the source mark.
function markInner() {
  const svg = readFileSync(MARK, "utf8")
  const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")
  if (!/<rect\b[^>]*\/>/.test(inner)) {
    console.error(`${MARK} has no background <rect>; cannot derive assets.`)
    process.exit(1)
  }
  return inner
}

// The mark's background tile, verbatim.
function backgroundRect(inner) {
  return inner.match(/<rect\b[^>]*\/>/)[0]
}

// The mark without <title> and background tile: dots, route, today marker.
function glyphOnly(inner) {
  return inner.replace(/<title>.*?<\/title>/, "").replace(/<rect\b[^>]*\/>/, "")
}

function fillOf(rect) {
  return rect.match(/fill="([^"]+)"/)?.[1]
}

// Maskable variant: full-bleed square (adaptive launchers crop to a mask, so
// no rounded corners) with the glyph scaled into the safe zone (inner ~80%).
function buildMaskable(rect, glyph) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">` +
    `<title>Track Taka</title>` +
    `<rect width="512" height="512" fill="${fillOf(rect)}"/>` +
    `<g transform="translate(256 256) scale(0.8) translate(-256 -256)">${glyph}</g>` +
    `</svg>`
  )
}

// Swap the embedded mark inside a lockup, keeping title, wordmark outlines
// and their fill (light uses ink, dark uses white). The lookahead anchors on
// the wordmark path so the old mark block — including its closing tags — is
// replaced in one shot, and the match stays stable across re-runs.
function rebuildLogo(svg, inner) {
  const mark = `<g transform="scale(${LOGO_SCALE})">${
    inner.replace(/<title>.*?<\/title>/, "")
  }</g>`
  const wordmark = /<path fill="[^"]+" transform="translate\(124 86\)"/
  const pattern = new RegExp(
    `<g transform="scale\\(${LOGO_SCALE}\\)">[\\s\\S]*?(?=${wordmark.source})`,
  )
  if (!pattern.test(svg)) {
    console.error("Lockup is missing the embedded mark group or wordmark.")
    process.exit(1)
  }
  return svg.replace(pattern, mark)
}

// offline.html must stay self-contained (the SW fallback can't fetch
// assets), so its brand mark is inlined. Replace the children of that SVG
// with the mark's, keeping the hand-written tag with its class and aria
// attributes. Function replacement so `$` in markup stays literal.
function rebuildOffline(html, inner) {
  const pattern = /(<svg class="mark"[^>]*>)[\s\S]*?(<\/svg>)/
  if (!pattern.test(html)) {
    console.error("offline.html is missing the inline brand mark SVG.")
    process.exit(1)
  }
  return html.replace(pattern, (_, open, close) => open + inner + close)
}

// --- raster + ico ----------------------------------------------------------

async function findRenderer() {
  for (const tool of ["rsvg-convert", "magick"]) {
    try {
      await run(tool, ["--version"], { stdio: "ignore" })
      return tool
    } catch {
      // not installed, try the next one
    }
  }
  console.error(
    "No SVG rasterizer found. Install one with:\n" +
      "  brew install librsvg   # rsvg-convert\n" +
      "  brew install imagemagick   # magick",
  )
  process.exit(1)
}

async function renderPng(renderer, svg, size, out) {
  if (renderer === "rsvg-convert") {
    await run(renderer, ["-w", String(size), "-h", String(size), svg, "-o", out])
  } else {
    await run(renderer, [
      "-background",
      "none",
      "-resize",
      `${size}x${size}!`,
      svg,
      out,
    ])
  }
}

// Pack PNG buffers into an .ico (PNG-compressed entries, Vista+; every modern
// browser accepts these). Entry widths of 256 are encoded as 0.
function buildIco(pngs) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(pngs.length, 4)

  const entries = []
  let offset = header.length + 16 * pngs.length
  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0)
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt16LE(1, 4) // planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    entries.push(entry)
    offset += data.length
  }
  return Buffer.concat([
    header,
    ...entries,
    ...pngs.map(({ data }) => data),
  ])
}

// --- pipeline --------------------------------------------------------------

// Renders every target into `dir` (relative paths preserved) and returns the
// map of relative path -> absolute file. Used both to write the real outputs
// and, in --check mode, to produce candidates for a byte comparison.
async function generate(dir) {
  const renderer = await findRenderer()
  const files = new Map()

  // Every output's parent must exist (the scratch dir in --check mode is
  // empty, so relative paths are not enough).
  const ensureParent = (rel) => {
    mkdirSync(resolve(dir, rel, ".."), { recursive: true })
  }
  const put = (rel, content) => {
    ensureParent(rel)
    writeFileSync(resolve(dir, rel), content)
    files.set(rel, resolve(dir, rel))
  }

  const inner = markInner()
  const rect = backgroundRect(inner)
  const glyph = glyphOnly(inner)

  put(APP_ICON, readFileSync(MARK))
  put(PUBLIC_SVG, readFileSync(MARK))
  put(MASKABLE_SVG, buildMaskable(rect, glyph))

  for (const rel of [LOGO_LIGHT, LOGO_DARK]) {
    const current = readFileSync(resolve(ROOT, rel), "utf8")
    put(rel, rebuildLogo(current, inner))
  }

  put(OFFLINE_HTML, rebuildOffline(readFileSync(resolve(ROOT, OFFLINE_HTML), "utf8"), inner))

  for (const [svgRel, size, out] of RASTER) {
    const outAbs = resolve(dir, out)
    ensureParent(out)
    await renderPng(renderer, resolve(dir, svgRel), size, outAbs)
    files.set(out, outAbs)
  }

  const pngs = []
  // Favicon source PNGs are intermediates; keep them out of the output tree.
  const scratch = mkdtempSync(resolve(tmpdir(), "sync-brand-"))
  try {
    for (const size of FAVICON_SIZES) {
      const outAbs = resolve(scratch, `favicon-${size}.png`)
      await renderPng(renderer, MARK, size, outAbs)
      pngs.push({ size, data: readFileSync(outAbs) })
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true })
  }
  put(FAVICON, buildIco(pngs))

  return files
}

async function main() {
  const brand = JSON.parse(readFileSync(BRAND, "utf8"))
  const pkg = JSON.parse(readFileSync(PKG, "utf8"))

  if (!CHECK) {
    if (pkg.version !== brand.version) {
      pkg.version = brand.version
      writeFileSync(PKG, JSON.stringify(pkg, null, 2) + "\n")
      console.log("synced brand version", brand.version)
    }
    const files = await generate(ROOT)
    for (const rel of files.keys()) console.log("wrote", rel)
    console.log("brand synced")
    return
  }

  // --check: version plus a full regenerate-and-compare of every asset.
  const stale = []
  if (pkg.version !== brand.version) stale.push("package.json (version)")

  const scratch = mkdtempSync(resolve(tmpdir(), "sync-brand-"))
  try {
    const generated = await generate(scratch)
    for (const [rel, genAbs] of generated) {
      const current = readFileSync(resolve(ROOT, rel))
      if (!current.equals(readFileSync(genAbs))) stale.push(rel)
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true })
  }

  if (stale.length > 0) {
    console.error(
      `Stale brand outputs (run \`npm run sync-brand\`):\n  ${stale.join("\n  ")}`,
    )
    process.exit(1)
  }
  console.log("brand up to date")
}

main()
