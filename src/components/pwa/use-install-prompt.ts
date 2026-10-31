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
 * Every install surface funnels through installWithFeedback(), which picks
 * the best path the current browser offers:
 *
 * 1. a captured `beforeinstallprompt` → trigger the native install dialog
 *    directly;
 * 2. no captured prompt but a guided path exists (Apple walkthrough,
 *    Chromium Web Install) → open the @khmyznikov/pwa-install guide dialog
 *    via showInstallGuide() (see pwa-install-dialog.tsx), which keeps its
 *    own copy of the event;
 * 3. no install support at all (Firefox, in-app webviews, older Safari) →
 *    open the manual-instructions modal (see unsupported-install-dialog.tsx).
 *
 * The global BeforeInstallPromptEvent type comes from
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

// ─── Guide-dialog hookup ──────────────────────────────────────────────────────

/** Registered by pwa-install-dialog.tsx: opens the shared <pwa-install>
 * dialog. Lives behind a setter so use-install-prompt never imports the
 * dialog module back (the dialog already imports this one — a circular
 * import would be fragile with lazy chunks). */
let openGuideDialog: (() => Promise<void> | void) | null = null

export function registerInstallGuideOpener(
  opener: () => Promise<void> | void
): void {
  openGuideDialog = opener
}

// ─── Unsupported-browser dialog state ─────────────────────────────────────────

let unsupportedDialogOpen = false
const unsupportedListeners = new Set<() => void>()

function subscribeUnsupported(listener: () => void): () => void {
  unsupportedListeners.add(listener)
  return () => unsupportedListeners.delete(listener)
}

/** Opens/closes the manual-instructions modal. Called from install flow
 * code that runs outside React, so the state lives here, mirroring the
 * install store above (see unsupported-install-dialog.tsx). */
export function setUnsupportedInstallDialogOpen(open: boolean): void {
  if (open === unsupportedDialogOpen) return
  unsupportedDialogOpen = open
  for (const listener of unsupportedListeners) listener()
}

export function useUnsupportedInstallDialog(): boolean {
  return useSyncExternalStore(
    subscribeUnsupported,
    () => unsupportedDialogOpen,
    () => false
  )
}

function isIos(): boolean {
  // iPadOS 13+ reports itself as a Mac; touch points give it away.
  const isMacWithTouch =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || isMacWithTouch
}

/** Desktop Safari 17+ installs PWAs from File → Add to Dock; the guide
 * dialog walks it through. Any touch points mean iPadOS-as-Mac, which
 * isIos() already claims. */
function isMacSafari(): boolean {
  if (navigator.maxTouchPoints > 0) return false
  if (!/macintosh/i.test(navigator.userAgent)) return false
  const version = /version[ /](\d+)/.exec(navigator.userAgent)
  return Number.parseInt(version?.[1] ?? "0", 10) >= 17
}

/** True when the guide dialog has a real install path here even without a
 * captured `beforeinstallprompt`: Safari, whose walkthrough is the only way
 * to install on iOS/macOS, and browsers exposing the Web Install API.
 *
 * Deliberately NOT "any Chromium": Electron shells and in-app webviews are
 * Chromium engines that never fire the event — the library's dialog renders
 * invisibly there and its Install button fails silently. Real Chrome/Edge
 * reach the native prompt (path 1) via the captured event, so they don't
 * need this check; everything else gets the manual-install guide. */
function hasGuidedInstallSupport(): boolean {
  const extendedNavigator = navigator as Navigator & { install?: unknown }
  return (
    typeof extendedNavigator.install === "function" || isIos() || isMacSafari()
  )
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

/**
 * The install action behind every surface (sidebar footer, More sheet,
 * Settings, landing). Picks the best path the browser offers:
 *
 * 1. captured `beforeinstallprompt` → trigger the native install dialog
 *    directly;
 * 2. no captured prompt but a guided path (Apple walkthrough, Chromium) →
 *    open the shared <pwa-install> guide dialog;
 * 3. no install support at all → open the manual-instructions modal.
 *
 * Dismissing the native prompt stays silent.
 */
export async function installWithFeedback(): Promise<InstallOutcome> {
  // 1) Native prompt available: trigger it directly — the browser's own
  // dialog beats any custom UI.
  if (deferredEvent) {
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

  // 2) Guided install: hand off to the guide dialog (opener registered by
  // pwa-install-dialog.tsx, which every install surface imports). If that
  // module somehow hasn't loaded, the modal below still gives the user a
  // path — so no recursion either way.
  if (openGuideDialog && hasGuidedInstallSupport()) {
    await openGuideDialog()
    return "unavailable"
  }

  // 3) Nothing this browser can install programmatically (Firefox, in-app
  // webviews, older Safari): explain the manual menu steps instead of
  // dead-ending in an error toast.
  setUnsupportedInstallDialogOpen(true)
  return "unavailable"
}
