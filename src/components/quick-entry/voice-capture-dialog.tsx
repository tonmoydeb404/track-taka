"use client"

import Link from "next/link"
import * as React from "react"
import { ArrowLeft, Check, LoaderCircle, Mic } from "lucide-react"
import { toast } from "sonner"

import { AccountPicker } from "@/components/quick-entry/account-picker"
import { AmountInput } from "@/components/quick-entry/amount-input"
import { CategoryPicker } from "@/components/quick-entry/category-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { useAccounts, useTransactionActions } from "@/hooks"
import { EXPENSE_CATEGORIES, formatMoney, parseMoneyInput } from "@/lib/domain"
import { useUIStore } from "@/lib/ui-store"

type VoiceState = "ready" | "listening" | "processing" | "review" | "done"

// Fake waveform bar heights + stagger delays (CSS only, honest visual metaphor).
const WAVE_BARS = [
  { h: 10, delay: 0 },
  { h: 22, delay: 120 },
  { h: 14, delay: 60 },
  { h: 26, delay: 180 },
  { h: 12, delay: 90 },
  { h: 18, delay: 240 },
  { h: 9, delay: 30 },
]

/**
 * Voice entry — a UI prototype. It NEVER touches a microphone or any speech
 * API; the "parse" is a hard-coded simulation that the user can edit before
 * saving. Captions are deliberately honest about this.
 */
export function VoiceCaptureDialog() {
  const voiceOpen = useUIStore((s) => s.voiceOpen)
  const closeVoice = useUIStore((s) => s.closeVoice)

  const { data: accounts } = useAccounts()
  const { create, remove } = useTransactionActions()

  const [state, setState] = React.useState<VoiceState>("ready")

  // Review form state (pre-filled from the simulated parse)
  const [amount, setAmount] = React.useState("")
  const [categoryId, setCategoryId] = React.useState<string | null>(null)
  const [accountId, setAccountId] = React.useState<string | null>(null)
  const [description, setDescription] = React.useState("")
  const [date] = React.useState<Date>(() => new Date())

  const processingTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const doneTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset the flow whenever the dialog transitions open → closed, using the
  // render-phase state-adjustment pattern (no effect needed).
  const [prevOpen, setPrevOpen] = React.useState(voiceOpen)
  if (prevOpen !== voiceOpen) {
    setPrevOpen(voiceOpen)
    if (!voiceOpen) {
      setState("ready")
      setAmount("")
      setCategoryId(null)
      setAccountId(null)
      setDescription("")
    }
  }

  // Clear pending timers on unmount.
  React.useEffect(() => {
    return () => {
      if (processingTimer.current) clearTimeout(processingTimer.current)
      if (doneTimer.current) clearTimeout(doneTimer.current)
    }
  }, [])

  const stopTimers = () => {
    if (processingTimer.current) clearTimeout(processingTimer.current)
    if (doneTimer.current) clearTimeout(doneTimer.current)
  }

  const startListening = () => {
    // Honest prototype: no microphone, no SpeechRecognition — just the flow.
    setState("listening")
  }

  const finishListening = () => {
    setState("processing")
    // Simulated "understanding" delay, then pre-fill the review form.
    processingTimer.current = setTimeout(() => {
      const cat =
        EXPENSE_CATEGORIES.find((c) => c.icon === "utensils") ??
        EXPENSE_CATEGORIES[0]
      const acct = accounts.find((a) => /bkash/i.test(a.name)) ?? accounts[0]
      setAmount("250")
      setCategoryId(cat?.id ?? null)
      setAccountId(acct?.id ?? null)
      setDescription("Lunch")
      setState("review")
    }, 1400)
  }

  const amountPaisa = parseMoneyInput(amount) ?? 0

  const saveParsed = async () => {
    if (amountPaisa <= 0 || !accountId) return
    try {
      const tx = await create({
        type: "expense",
        amount: amountPaisa,
        categoryId,
        accountId,
        toAccountId: null,
        description: description.trim(),
        date: date.toISOString(),
      })
      setState("done")
      toast(
        `Expense saved — ${formatMoney(amountPaisa)}${description.trim() ? ` · ${description.trim()}` : ""}`,
        {
          action: {
            label: "Undo",
            onClick: async () => {
              try {
                await remove(tx.id)
                toast("Transaction removed")
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "Could not undo")
              }
            },
          },
        }
      )
      doneTimer.current = setTimeout(() => {
        closeVoice()
      }, 800)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save")
    }
  }

  const cancel = () => {
    stopTimers()
    setState("ready")
  }

  const handleClose = (o: boolean) => {
    if (!o) {
      stopTimers()
      closeVoice()
    }
  }

  return (
    <ResponsiveDialog open={voiceOpen} onOpenChange={handleClose} mode="dialog">
      <ResponsiveDialogContent
        dialogClassName="sm:max-w-sm gap-0"
        className="flex flex-col"
      >
        <ResponsiveDialogHeader className="gap-1">
          <ResponsiveDialogTitle className="text-base">
            Voice entry
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="text-xs">
            Add an expense by speaking — prototype flow.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="flex flex-col gap-4">
          {/* READY */}
          {state === "ready" && accounts.length === 0 && (
            <div className="flex flex-col items-start gap-3 py-2">
              <p className="text-sm text-muted-foreground">
                Create an account first, then you can record transactions.
              </p>
              <Button asChild onClick={closeVoice}>
                <Link href="/dashboard/accounts">Create an account</Link>
              </Button>
            </div>
          )}
          {state === "ready" && accounts.length > 0 && (
            <div
              className="flex flex-col items-center gap-4 py-2"
              role="status"
            >
              <button
                type="button"
                onClick={startListening}
                aria-label="Start voice capture"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95"
              >
                <Mic className="h-7 w-7" aria-hidden="true" />
              </button>
              <p className="text-sm font-medium">Tap and say your expense</p>
              <p className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground">
                “Lunch 250 taka from bKash”
              </p>
              <p className="text-center text-[11px] text-muted-foreground">
                Prototype — simulated parsing, no real speech recognition yet.
              </p>
            </div>
          )}

          {/* LISTENING */}
          {state === "listening" && (
            <div
              className="flex flex-col items-center gap-5 py-2"
              role="status"
            >
              <div className="relative flex h-16 w-16 items-center justify-center">
                <span
                  className="absolute inset-0 animate-ping rounded-full bg-primary/25 motion-reduce:animate-none"
                  aria-hidden="true"
                />
                <span
                  className="absolute inset-0 animate-ping rounded-full bg-primary/15 [animation-delay:300ms] motion-reduce:animate-none"
                  aria-hidden="true"
                />
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Mic className="h-7 w-7" aria-hidden="true" />
                </span>
              </div>
              <div
                className="flex h-8 items-center justify-center gap-1"
                aria-hidden="true"
              >
                {WAVE_BARS.map((bar, i) => (
                  <span
                    key={i}
                    className="w-1.5 animate-pulse rounded-full bg-primary/70 motion-reduce:animate-none"
                    style={{ height: bar.h, animationDelay: `${bar.delay}ms` }}
                  />
                ))}
              </div>
              <span className="sr-only">Recording audio level</span>
              <div className="flex w-full gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11 flex-1"
                  onClick={cancel}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="min-h-11 flex-1"
                  onClick={finishListening}
                >
                  Done speaking
                </Button>
              </div>
            </div>
          )}

          {/* PROCESSING */}
          {state === "processing" && (
            <div
              className="flex flex-col items-center gap-4 py-8"
              role="status"
            >
              <LoaderCircle
                className="h-8 w-8 animate-spin text-primary"
                aria-hidden="true"
              />
              <p className="text-sm font-medium">Understanding…</p>
              <Button type="button" variant="ghost" size="sm" onClick={cancel}>
                Cancel
              </Button>
            </div>
          )}

          {/* REVIEW */}
          {state === "review" && (
            <div className="flex flex-col gap-4">
              <p className="rounded-lg bg-accent px-3 py-2 text-[11px] text-muted-foreground">
                Simulated result — edit anything before saving.
              </p>
              <div className="space-y-1">
                <Label
                  htmlFor="voice-amount"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Amount
                </Label>
                <div className="rounded-xl border border-input py-1.5">
                  <AmountInput
                    id="voice-amount"
                    size="md"
                    value={amount}
                    onChange={setAmount}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Category
                </Label>
                <CategoryPicker
                  type="expense"
                  compact
                  value={categoryId}
                  onChange={setCategoryId}
                />
              </div>
              <AccountPicker value={accountId} onChange={setAccountId} />
              <div className="space-y-1.5">
                <Label
                  htmlFor="voice-note"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Note <span className="font-normal">(optional)</span>
                </Label>
                <Input
                  id="voice-note"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Lunch at office"
                  maxLength={120}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11 flex-1"
                  onClick={() => setState("ready")}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back
                </Button>
                <Button
                  type="button"
                  className="min-h-11 flex-1 font-semibold"
                  disabled={amountPaisa <= 0 || !accountId}
                  onClick={saveParsed}
                >
                  Save expense
                </Button>
              </div>
            </div>
          )}

          {/* DONE */}
          {state === "done" && (
            <div
              className="flex flex-col items-center gap-3 py-8"
              role="status"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="text-sm font-medium">Saved on this device</p>
            </div>
          )}
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
