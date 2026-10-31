#!/usr/bin/env node
// Generates public/sw-precache.json — the route list the service worker
// precaches at install so every page works offline on first launch, without
// the person having to visit each one first.
//
//   .next/BUILD_ID                        -> buildId (deploy marker)
//   .next/app-path-routes-manifest.json   -> pages (file -> route)
//
// Routes are filtered to what an installed app should serve offline:
//   - pages only (route handlers like /manifest.webmanifest stay out)
//   - no internal routes (/_not-found, /_global-error)
//   - no parameterized routes (a [id] route cannot be enumerated; those
//     fall back to /offline.html when offline)
//   - no design tools (the /screenshots gallery exists only to render the
//     manifest screenshots; the PNGs themselves ship in public/)
//
// Everything else (the JS/CSS/font graph each page needs) is discovered by
// the service worker itself from the page HTML and RSC payloads — it does
// not need a build step. Run with --check to verify the manifest is fresh
// (exit 1 when stale) without writing, same contract as sync-brand.mjs.

import { readFile, writeFile } from "node:fs/promises"
import process from "node:process"

const EXCLUDED_ROUTES = new Set(["/screenshots"])
const OUTPUT = "public/sw-precache.json"

const buildId = (await readFile(".next/BUILD_ID", "utf8")).trim()

const routeMap = JSON.parse(
  await readFile(".next/app-path-routes-manifest.json", "utf8")
)
const pages = Object.entries(routeMap)
  .filter(([file]) => file.endsWith("/page"))
  .map(([, route]) => route)
  .filter((route) => !route.startsWith("/_"))
  .filter((route) => !route.includes("["))
  .filter((route) => !EXCLUDED_ROUTES.has(route))
  .sort()

if (pages.length === 0) {
  console.error("generate-sw-precache: no pages found — run `next build` first")
  process.exit(1)
}

const json = JSON.stringify({ buildId, pages }, null, 2) + "\n"

if (process.argv.includes("--check")) {
  const current = await readFile(OUTPUT, "utf8").catch(() => null)
  if (current !== json) {
    console.error(
      `generate-sw-precache: ${OUTPUT} is stale — run \`pnpm build\``
    )
    process.exit(1)
  }
  console.log(
    `generate-sw-precache: ${OUTPUT} is fresh (${pages.length} pages, build ${buildId})`
  )
  process.exit(0)
}

// Write only on change so rebuilds that keep the manifest identical do not
// touch mtimes (keeps the sync-brand:check-style tooling and editors quiet).
const current = await readFile(OUTPUT, "utf8").catch(() => null)
if (current === json) {
  console.log(
    `generate-sw-precache: ${OUTPUT} unchanged (${pages.length} pages, build ${buildId})`
  )
} else {
  await writeFile(OUTPUT, json)
  console.log(
    `generate-sw-precache: wrote ${OUTPUT} (${pages.length} pages, build ${buildId})`
  )
}
