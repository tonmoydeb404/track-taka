"use client"

import { useMemo, useState } from "react"

import type { TransactionDoc } from "@/lib/db"
import {
  accountBalances,
  categoryTotals,
  dailyExpenseRange,
  dayKey,
  getCategory,
  monthKey,
  monthLabelShort,
  periodTotals,
} from "@/lib/domain"
import { useAccounts, useDateRange, useTransactions } from "@/hooks"

import { customPeriod, pctChange } from "./utils"

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
  const dr = useDateRange()
  const [now] = useState(() => new Date())

  return useMemo(() => {
    const period = customPeriod(dr)
    const txs = transactions.filter((t) => dr.inRange(t.date))
    const prevTxs = transactions.filter((t) => dr.prev.inRange(t.date))
    const totals = totalsFor(txs)
    const prevTotals = prevTxs ? totalsFor(prevTxs) : null

    // Up to ~2 months reads better day by day, longer spans month by month
    const single = period.days <= 62
    const dailySeries = single ? dailyExpenseRange(txs, dr.from, dr.to) : []
    const monthlySeries = period.months.map((m) => {
      const t = totalsFor(txs.filter((x) => monthKey(x.date) === m))
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
    dr,
    now,
  ])
}
