"use client"

import { createContext, useContext, useEffect, useState } from "react"

import { getDatabase, type AppDatabase } from "./database"

type DatabaseState = {
  db: AppDatabase | null
  error: Error | null
}

const DatabaseContext = createContext<DatabaseState>({ db: null, error: null })

/**
 * Opens the local database once in the browser and shares it with hooks.
 * `db` is null until it is ready (and always during server rendering), so
 * data hooks report `isLoading` until then.
 */
export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DatabaseState>({ db: null, error: null })

  useEffect(() => {
    let cancelled = false
    getDatabase().then(
      (db) => !cancelled && setState({ db, error: null }),
      (error: unknown) =>
        !cancelled &&
        setState({
          db: null,
          error: error instanceof Error ? error : new Error(String(error)),
        })
    )
    return () => {
      cancelled = true
    }
  }, [])

  return <DatabaseContext value={state}>{children}</DatabaseContext>
}

export function useDatabaseState(): DatabaseState {
  return useContext(DatabaseContext)
}

/** The ready database, or null while it is still opening. */
export function useDatabase(): AppDatabase | null {
  return useContext(DatabaseContext).db
}
