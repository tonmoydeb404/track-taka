"use client"

import { createContext, useContext, useMemo } from "react"

import type { AccountDoc } from "@/lib/db"

import { useAccounts } from "./use-accounts"

const AccountsContext = createContext<Map<string, AccountDoc>>(new Map())

/**
 * One shared subscription to every account (archived too), so list rows can
 * look up names without each opening its own query.
 */
export function AccountsProvider({ children }: { children: React.ReactNode }) {
  const { data } = useAccounts({ includeArchived: true })
  const byId = useMemo(() => new Map(data.map((a) => [a.id, a])), [data])
  return <AccountsContext value={byId}>{children}</AccountsContext>
}

/** Accounts by id, archived included. Empty until loaded. */
export function useAccountLookup(): Map<string, AccountDoc> {
  return useContext(AccountsContext)
}
