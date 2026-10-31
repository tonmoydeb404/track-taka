"use client"

import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation"

/**
 * `useSearchParams` that never triggers the prerender-time Suspense bailout.
 *
 * During prerendering / server rendering there is no `window`, so the real
 * hook would force every page that reads a query param behind a `<Suspense>`
 * boundary (the build fails without one). There the shim hands back an empty
 * param set instead: modals render closed and filters render at their
 * defaults, exactly like the static HTML promises.
 *
 * In the browser the real hook takes over and reads the live URL, so deep
 * links like `?tx=…` open the right sheet after hydration.
 */
export const useSearchQueries =
  typeof window !== "undefined"
    ? useSearchParams
    : () => new ReadonlyURLSearchParams()
