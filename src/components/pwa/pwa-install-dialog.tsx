"use client"

import { useEffect } from "react"
import type { PWAInstallElement } from "@khmyznikov/pwa-install"

import {
  getCapturedPromptEvent,
  installWithFeedback,
  registerInstallGuideOpener,
  setUnsupportedInstallDialogOpen,
} from "./use-install-prompt"

let loader: Promise<unknown> | null = null

async function ensureElement(): Promise<PWAInstallElement | null> {
  if (!customElements.get("pwa-install")) {
    loader ??= import("@khmyznikov/pwa-install")
    await loader
  }
  const element = document.querySelector<PWAInstallElement>("pwa-install")
  if (element) {
    await customElements.whenDefined("pwa-install")
    // The module loads after hydration, so the browser's early
    // beforeinstallprompt (captured by use-install-prompt) fired before the
    // component could listen for it. Hand ours over unless the component
    // already caught one itself (the library's async mode).
    if (!element.externalPromptEvent) {
      element.externalPromptEvent = getCapturedPromptEvent()
    }
  }
  return element
}

/**
 * Opens the shared <pwa-install> dialog: the native install flow on
 * Chromium (Web Install API, or the beforeinstallprompt it intercepts
 * itself) and a screenshot walkthrough on iOS/iPadOS. If the web component
 * never became ready (the lazy chunk failed to load), fall back to the
 * manual-instructions modal — its steps are valid in every browser.
 */
async function openInstallDialog(): Promise<void> {
  try {
    const element = await ensureElement()
    if (element && typeof element.showDialog === "function") {
      element.showDialog()
      return
    }
  } catch {
    // fall through to the manual instructions
  }
  setUnsupportedInstallDialogOpen(true)
}

// installWithFeedback() (use-install-prompt.ts) opens the guide through this
// registration instead of importing this module, which would create a
// circular import.
registerInstallGuideOpener(openInstallDialog)

/**
 * The install action every surface calls. The path decision (native prompt
 * → guide dialog → unsupported-browser modal) lives in
 * installWithFeedback(); this stays a stable name at the boundary.
 */
export async function showInstallGuide(): Promise<void> {
  await installWithFeedback()
}

/**
 * Mounts the shared <pwa-install> dialog once, in the root layout. The
 * module is imported on demand; until then the custom element renders as an
 * empty unknown tag, which is harmless. `manual-apple` + `manual-chrome`
 * disable every auto-prompt: the dialog only opens from our install
 * buttons. The component intercepts and retains beforeinstallprompt itself
 * for its Chromium install path.
 */
export function PwaInstallDialog() {
  useEffect(() => {
    void import("@khmyznikov/pwa-install")
  }, [])

  return (
    <pwa-install
      manual-apple="true"
      manual-chrome="true"
      manifest-url="/manifest.webmanifest"
    ></pwa-install>
  )
}
