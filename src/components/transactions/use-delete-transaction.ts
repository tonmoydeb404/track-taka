"use client"

import { useCallback } from "react"
import { toast } from "sonner"

import { useConfirm } from "@/components/common/confirm-dialog"
import { useTransactionActions } from "@/hooks"
import type { TransactionDoc } from "@/lib/db"
import { formatMoney, getCategory } from "@/lib/domain"

/**
 * Delete a transaction the same way everywhere: confirm, delete, then offer
 * Undo. Resolves `true` if it was deleted, `false` if the user backed out.
 */
export function useDeleteTransaction() {
  const confirm = useConfirm()
  const { remove, restore } = useTransactionActions()

  return useCallback(
    async (tx: TransactionDoc): Promise<boolean> => {
      const name =
        tx.description ||
        getCategory(tx.categoryId)?.name ||
        (tx.type === "transfer" ? "Transfer" : "Transaction")

      const ok = await confirm({
        title: "Delete this transaction?",
        description: `“${name}” (${formatMoney(tx.amount)}) will be removed from your history and your balances will update.`,
        confirmLabel: "Delete",
        destructive: true,
      })
      if (!ok) return false

      try {
        const snapshot = await remove(tx.id)
        if (!snapshot) return false
        toast("Transaction deleted", {
          action: {
            label: "Undo",
            onClick: async () => {
              try {
                await restore(snapshot)
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "Could not undo")
              }
            },
          },
        })
        return true
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not delete")
        return false
      }
    },
    [confirm, remove, restore]
  )
}
