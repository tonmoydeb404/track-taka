"use client"

import { useEffect, useState } from "react"
import type { Observable } from "rxjs"

import type { AppDatabase } from "./database"
import { useDatabaseState } from "./provider"

/** The part of an RxDB query these hooks rely on. */
type LiveQuery<T> = {
  $: Observable<
    Array<{ toJSON: () => unknown }> | { toJSON: () => unknown } | null
  >
  __type?: T
}

export type QueryResult<T> = {
  data: T[]
  /** True until the database is open and the first result has arrived. */
  isLoading: boolean
  error: Error | null
}

type Snapshot<T> = { source: unknown; data: T[]; error: Error | null }

/**
 * Subscribe to a live RxDB query and get plain JSON documents back.
 *
 * `factory` builds the query from the database. Wrap it in `useCallback` with
 * the query's inputs as dependencies: a new function identity re-subscribes.
 * Return null to skip the query (for example, while an input is missing).
 */
export function useRxQuery<T>(
  factory: (db: AppDatabase) => LiveQuery<T> | null
): QueryResult<T> {
  const { db, error: dbError } = useDatabaseState()
  const [snapshot, setSnapshot] = useState<Snapshot<T>>({
    source: null,
    data: [],
    error: null,
  })

  useEffect(() => {
    if (!db) return
    const query = factory(db)
    if (!query) return

    const subscription = query.$.subscribe({
      next: (result) => {
        const docs = Array.isArray(result) ? result : result ? [result] : []
        setSnapshot({
          source: query,
          data: docs.map((doc) => doc.toJSON() as T),
          error: null,
        })
      },
      error: (error: unknown) =>
        setSnapshot({
          source: query,
          data: [],
          error: error instanceof Error ? error : new Error(String(error)),
        }),
    })
    return () => subscription.unsubscribe()
  }, [db, factory])

  return {
    data: snapshot.data,
    isLoading: !dbError && snapshot.source === null,
    error: dbError ?? snapshot.error,
  }
}
