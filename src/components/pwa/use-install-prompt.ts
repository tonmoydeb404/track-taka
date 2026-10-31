"use client"

import { toast } from "sonner"

import { useSyncExternalStore } from "react"

/**
 * Custom install flow. Chrome fires `beforeinstallprompt` once and only when
 * the install criteria are met; Safari (iOS) and Firefox never fire it. The
 * browser's own passive prompts (Android mini-infobar, desktop omnibox) stay
 * available — this module just adds a button we control.
 *
 * The listener attaches at module load, before React hydrates, so the one
 * early event is never missed. The service worker registrar imports this
 * module on every page for exactly that reason.
 *
 * The native prompt is only a fallback these days: the install surfaces open
 * the @khmyznikov/pwa-install dialog via showInstallGuide() (see
 * pwa-install-dialog.tsx), which keeps its own copy of the event. The
 * global BeforeInstallPromptEvent type comes from
 * @types/dom-chromium-installation-events.
 */

export interface InstallState {
  /** The browser lets us trigger the native install dialog. */
  canPrompt: boolean
  /** The app already runs as an installed app (any platform). */
  installed: boolean
  /** iOS Safari: no programmatic install; show manual instructions instead. */
  needsManualInstall: boolean
}

export type InstallOutcome = "accepted" | "dismissed" | "unavailable"

const INITIAL_STATE: InstallState = {
  canPrompt: false,
  installed: false,
  needsManualInstall: false,
}

let deferredEvent: BeforeInstallPromptEvent | null = null
let snapshot = INITIAL_STATE
const listeners = new Set<() => void>()

/** The prompt event this module intercepted, if any. The install dialog
 * loads lazily and can miss the early event, so showInstallGuide() hands
 * this to its externalPromptEvent (see pwa-install-dialog.tsx). */
export function getCapturedPromptEvent(): BeforeInstallPromptEvent | null {
  return deferredEvent
}

function isIos(): boolean {
  // iPadOS 13+ reports itself as a Mac; touch points give it away.
  const isMacWithTouch =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || isMacWithTouch
}

function isStandalone(): boolean {
  const extended = window.navigator as Navigator & { standalone?: boolean }
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    extended.standalone === true
  )
}

function recompute(): void {
  const installed = isStandalone()
  snapshot = {
    installed,
    canPrompt: deferredEvent !== null && !installed,
    needsManualInstall: isIos() && !installed,
  }
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    // Taking ownership suppresses Chrome's own mini-infobar; the omnibox
    // install icon on desktop keeps working.
    event.preventDefault()
    deferredEvent = event as BeforeInstallPromptEvent
    recompute()
  })
  window.addEventListener("appinstalled", () => {
    deferredEvent = null
    recompute()
  })
  // Desktop browsers let people install from a menu without the event;
  // this keeps the state truthful when that happens.
  window
    .matchMedia("(display-mode: standalone)")
    .addEventListener("change", recompute)
  recompute()
}

/** Show the browser's install dialog. Returns "unavailable" when there is
 * nothing to trigger (event never fired, or the app is installed already).
 * Chrome allows one prompt per captured event; the reference is dropped
 * either way so a dismissed dialog can be re-offered on a later visit. */
export async function promptInstall(): Promise<InstallOutcome> {
  if (!deferredEvent) return "unavailable"
  const event = deferredEvent
  deferredEvent = null
  recompute()
  try {
    await event.prompt()
    const { outcome } = await event.userChoice
    recompute()
    return outcome
  } catch {
    return "unavailable"
  }
}

export function useInstallPrompt(): InstallState {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => INITIAL_STATE
  )
}

/** `promptInstall` plus user feedback, shared by every install surface
 * (sidebar footer, More sheet, Settings, landing). Dismissing stays silent. */
export async function installWithFeedback(): Promise<InstallOutcome> {
  const outcome = await promptInstall()
  if (outcome === "accepted") {
    toast.success("Track Taka is installed", {
      description: "Find it on your home screen or in your apps.",
    })
  } else if (outcome === "unavailable") {
    toast.error("Couldn't start the install", {
      description: "Try again, or use your browser's install option.",
    })
  }
  return outcome
}
