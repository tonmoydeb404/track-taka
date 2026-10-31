"use client"

import { useMemo, useState } from "react"

import type { TransactionDoc } from "@/lib/db"
import {
  accountBalances,
  categoryTotals,
  dailyExpenseSeries,
  dayKey,
  getCategory,
  monthKey,
  monthLabelShort,
  periodTotals,
} from "@/lib/domain"
import { useAccounts, useSelectedMonth, useTransactions } from "@/hooks"

import { usePeriod } from "./use-period"
import { pctChange, resolvePeriod } from "./utils"

function totalsFor(txs: TransactionDoc[]) {
  const { income, expense, transferVolume, net } = periodTotals(txs)
  return { income, expense, transferVolume, net }
}

/** Everything the four analytics tabs read, for the chosen period and the one before it. */
export function useAnalytics() {
  const txQuery = useTransactions("all")
  const accountQuery = useAccounts()
  const transactions = txQuery.data
  const accounts = accountQuery.data
  const range = usePeriod((s) => s.range)
  const { month: endMonth } = useSelectedMonth()
  const [now] = useState(() => new Date())

  return useMemo(() => {
    const earliest = transactions.reduce<string | null>((min, t) => {
      const mk = monthKey(t.date)
      return min === null || mk < min ? mk : min
    }, null)
    const period = resolvePeriod(range, endMonth, earliest, now)

    const inMonths = (months: string[]) => {
      const set = new Set(months)
      return transactions.filter((t) => set.has(monthKey(t.date)))
    }
    const txs = inMonths(period.months)
    const prevTxs = period.prevMonths ? inMonths(period.prevMonths) : null
    const totals = totalsFor(txs)
    const prevTotals = prevTxs ? totalsFor(prevTxs) : null

    const single = period.months.length === 1
    const dailySeries = single
      ? dailyExpenseSeries(transactions, period.months[0])
      : []
    const monthlySeries = period.months.map((m) => {
      const t = totalsFor(transactions.filter((x) => monthKey(x.date) === m))
      return { label: monthLabelShort(m), income: t.income, expense: t.expense }
    })

    const prevByCat = prevTxs
      ? new Map(
          categoryTotals(prevTxs, "expense").map((r) => [r.categoryId, r.total])
        )
      : null
    const categoryRows = categoryTotals(txs, "expense")
      .map((r) => ({
        ...r,
        category: getCategory(r.categoryId),
        prev: prevByCat ? (prevByCat.get(r.categoryId) ?? 0) : null,
      }))
      .filter((r) => r.category)

    // Per day: total expense, for busiest day, spend days and weekday pattern
    const byDay = new Map<string, number>()
    for (const t of txs) {
      if (t.type !== "expense") continue
      const key = dayKey(t.date)
      byDay.set(key, (byDay.get(key) ?? 0) + t.amount)
    }
    let busiest: { key: string; amount: number } | null = null
    for (const [key, amount] of byDay) {
      if (!busiest || amount > busiest.amount) busiest = { key, amount }
    }
    const weekday = [0, 0, 0, 0, 0, 0, 0] // Sunday = 0
    for (const [key, amount] of byDay) {
      weekday[new Date(`${key}T12:00:00`).getDay()] += amount
    }

    const balances = accountBalances(accounts, transactions)
    const accountRows = accounts.map((a) => {
      let spent = 0
      let received = 0
      for (const t of txs) {
        if (t.accountId !== a.id) continue
        if (t.type === "expense") spent += t.amount
        else if (t.type === "income") received += t.amount
      }
      return {
        account: a,
        balance: balances.get(a.id) ?? 0,
        spent,
        received,
      }
    })

    return {
      now,
      period,
      single,
      txs,
      totals,
      prevTotals,
      changes: prevTotals
        ? {
            expense: pctChange(totals.expense, prevTotals.expense),
            income: pctChange(totals.income, prevTotals.income),
          }
        : null,
      avgPerDay: totals.expense / period.days,
      dailySeries,
      monthlySeries,
      categoryRows,
      busiest,
      spendDays: byDay.size,
      weekday,
      biggest: txs
        .filter((t) => t.type === "expense")
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5),
      accountRows,
      hasExpense: totals.expense > 0,
      hasAny: txs.length > 0,
      isLoading: txQuery.isLoading || accountQuery.isLoading,
    }
  }, [
    transactions,
    accounts,
    txQuery.isLoading,
    accountQuery.isLoading,
    range,
    endMonth,
    now,
  ])
}
