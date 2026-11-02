"use client"

import { useRef, useState } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

import { ExpressionHint } from "@/components/common/expression-hint"
import { BrandMark } from "@/components/common/brand-mark"
import { SegmentedControl } from "@/components/common/segmented-control"
import { ThemePicker } from "@/components/common/theme-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { useAccountActions, useSettings, useSettingsActions } from "@/hooks"
import type { AccountType, ThemeMode, WeekStart } from "@/lib/db"
import {
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_LABELS,
  PRESET_COLORS,
  parseMoneyInput,
  sanitizeMoneyExpression,
} from "@/lib/domain"
import { cn } from "@/lib/utils"

// Mirrors WEEK_STARTS in the settings view; kept local so components don't
// reach into views.
const WEEK_OPTIONS: { value: WeekStart; label: string }[] = [
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
  { value: "monday", label: "Monday" },
]

const STEPS = 2

type Prefs = { theme: ThemeMode; weekStart: WeekStart }
type AccountForm = { name: string; type: AccountType; openingBalance: string }

/**
 * First-run onboarding wizard: appearance preferences, then the user's first
 * account (mandatory — no skip). The dialog is blocking: dismissible={false}
 * stops swipe/backdrop on mobile, the controlled open state ignores esc on
 * desktop, and the close button is hidden via dialogClassName. When finished
 * it stamps `onboardedAt` on the settings document so it never opens again.
 */
export function OnboardingDialog() {
  const settings = useSettings()
  const { update } = useSettingsActions()
  const { create: createAccount } = useAccountActions()
  const { setTheme } = useTheme()

  const [step, setStep] = useState(0)
  // Draft preferences; mirrors the stored settings until the user picks one.
  const [draft, setDraft] = useState<Prefs | null>(null)
  const [account, setAccount] = useState<AccountForm>({
    name: "",
    type: "cash",
    openingBalance: "0",
  })
  const [errors, setErrors] = useState<{
    name?: string
    openingBalance?: string
  }>({})
  const [saving, setSaving] = useState(false)
  // Flips once the account insert succeeds, so retrying a failed preferences
  // write can't create the account twice.
  const accountCreated = useRef(false)

  const prefs = draft ?? {
    theme: settings.theme,
    weekStart: settings.weekStart,
  }
  const open = !settings.isLoading && settings.onboardedAt === null

  function pick(patch: Partial<Prefs>) {
    setDraft({ ...prefs, ...patch })
  }

  function pickTheme(theme: ThemeMode) {
    pick({ theme })
    // Preview the choice while the dialog is open; ThemeSync keeps the
    // stored setting in step with next-themes.
    setTheme(theme)
  }

  async function finish() {
    const name = account.name.trim()
    const openingBalance = parseMoneyInput(account.openingBalance)
    const nextErrors: typeof errors = {}
    if (!name) nextErrors.name = "Give this account a name."
    if (openingBalance === null) {
      nextErrors.openingBalance = "Enter a valid amount, 0 or more."
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || openingBalance === null) return

    setSaving(true)
    try {
      // Account first: if it fails nothing is saved and the user can retry.
      if (!accountCreated.current) {
        await createAccount({
          name,
          type: account.type,
          color: PRESET_COLORS[0],
          openingBalance,
        })
        accountCreated.current = true
      }
      // The onboarding flag lands last so a failure keeps the wizard open.
      await update({
        ...prefs,
        onboardedAt: new Date().toISOString(),
      })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't finish the setup"
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <ResponsiveDialog mode="dialog" open={open} dismissible={false}>
      <ResponsiveDialogContent
        dialogClassName="sm:max-w-md [&_[data-slot=dialog-close]]:hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <ResponsiveDialogHeader>
          {/* The mobile drawer already shows a drag handle at the top, so the
              dots only appear on the desktop dialog. */}
          <div
            aria-hidden="true"
            className="flex items-center gap-2 group-data-[vaul-drawer-direction=bottom]/drawer-content:hidden"
          >
            {Array.from({ length: STEPS }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-6 rounded-full transition-colors",
                  i === step ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <span className="sr-only">{`Step ${step + 1} of ${STEPS}`}</span>

          {step === 0 ? (
            <div className="flex items-center gap-3 pt-1">
              <BrandMark className="size-10 shrink-0" label="" />
              <div className="flex flex-col gap-1.5 text-left">
                <ResponsiveDialogTitle>
                  Welcome to Track Taka
                </ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Two quick steps before you start — you can change these
                  anytime in Settings.
                </ResponsiveDialogDescription>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 pt-1 text-left">
              <ResponsiveDialogTitle>
                Add your first account
              </ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                Wallets, mobile money, bank — where your money lives. You can
                add more accounts anytime.
              </ResponsiveDialogDescription>
            </div>
          )}
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="flex flex-col gap-5">
          {step === 0 ? (
            <>
              <div className="flex flex-col gap-2">
                <p className="px-1 text-sm font-medium">Theme</p>
                <ThemePicker value={prefs.theme} onChange={pickTheme} />
                <p className="px-1 text-sm text-muted-foreground">
                  System follows your phone or computer&rsquo;s light and dark
                  setting.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="px-1 text-sm font-medium">Week starts on</p>
                <SegmentedControl
                  aria-label="Week starts on"
                  value={prefs.weekStart}
                  onChange={(weekStart) => pick({ weekStart })}
                  options={WEEK_OPTIONS}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="onboarding-account-name">Name</Label>
                <Input
                  id="onboarding-account-name"
                  placeholder="e.g. bKash, Cash wallet"
                  value={account.name}
                  onChange={(e) =>
                    setAccount((f) => ({ ...f, name: e.target.value }))
                  }
                  aria-invalid={!!errors.name}
                />
                {errors.name ? (
                  <p className="text-xs text-destructive">{errors.name}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="onboarding-account-type">Type</Label>
                <Select
                  value={account.type}
                  onValueChange={(v) =>
                    setAccount((f) => ({ ...f, type: v as AccountType }))
                  }
                >
                  <SelectTrigger
                    id="onboarding-account-type"
                    className="w-full"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {ACCOUNT_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="onboarding-account-balance">
                  Opening balance
                </Label>
                <div className="relative">
                  <span
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    ৳
                  </span>
                  <Input
                    id="onboarding-account-balance"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    value={account.openingBalance}
                    onChange={(e) =>
                      setAccount((f) => ({
                        ...f,
                        openingBalance: sanitizeMoneyExpression(e.target.value),
                      }))
                    }
                    aria-invalid={!!errors.openingBalance}
                    className="pl-8"
                  />
                </div>
                <ExpressionHint value={account.openingBalance} />
                {errors.openingBalance ? (
                  <p className="text-xs text-destructive">
                    {errors.openingBalance}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    What the account holds right now.
                  </p>
                )}
              </div>
            </>
          )}
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          {step === 0 ? (
            <Button className="w-full sm:w-auto" onClick={() => setStep(1)}>
              Next
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => setStep(0)}
                disabled={saving}
              >
                Back
              </Button>
              <Button
                className="flex-1 sm:flex-none"
                onClick={() => void finish()}
                disabled={saving}
              >
                {saving ? "Setting up…" : "Get started"}
              </Button>
            </>
          )}
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
