"use client"

import { useEffect } from "react"
import { toast } from "sonner"

const UPDATE_TOAST_ID = "sw-update"

/**
 * Registers public/sw.js and keeps the app current. Renders nothing.
 *
 * - Never registered in development (it would cache dev/HMR responses).
 * - A waiting service worker (a new deploy) raises one toast; the update is
 *   applied only when the person taps Reload, so a background deploy can
 *   never mix versions in an open session.
 * - controllerchange → one reload after the waiting worker takes over.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (!("serviceWorker" in navigator)) return

    let reloading = false
    const onControllerChange = () => {
      if (reloading) return
      reloading = true
      window.location.reload()
    }
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange
    )

    async function register() {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      })

      const announce = (worker: ServiceWorker | null) => {
        if (!worker || !navigator.serviceWorker.controller) return
        if (toast.getToasts().some((item) => item.id === UPDATE_TOAST_ID))
          return
        toast("A new version of Track Taka is ready", {
          id: UPDATE_TOAST_ID,
          description: "Reload to pick it up. Your data is not affected.",
          duration: Infinity,
          action: {
            label: "Reload",
            onClick: () => worker.postMessage({ type: "SKIP_WAITING" }),
          },
        })
      }

      announce(registration.waiting)

      registration.addEventListener("updatefound", () => {
        const installing = registration.installing
        installing?.addEventListener("statechange", () => {
          if (installing.state === "installed") announce(installing)
        })
      })
    }

    void register()

    return () =>
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange
      )
  }, [])

  return null
}
