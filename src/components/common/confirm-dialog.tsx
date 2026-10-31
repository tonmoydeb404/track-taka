"use client"

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { Trash2, TriangleAlert, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  useResponsiveDialogVariant,
} from "@/components/ui/responsive-dialog"
import { cn } from "@/lib/utils"

export interface ConfirmOptions {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  /** Red confirm button and a warning icon: use for anything that can't be undone. */
  destructive?: boolean
  /** Overrides the default icon (a trash can for destructive, an alert otherwise). */
  icon?: LucideIcon
}

interface ConfirmDialogProps extends ConfirmOptions {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

/**
 * The one confirmation UI. Always a centred alert on desktop (a confirmation
 * should interrupt, so it ignores the app-wide modal/sheet switch) and an
 * action-sheet-style drawer on phones: centred text, full-width stacked
 * buttons with the main action on top. Dismissing counts as cancelling.
 *
 * Prefer `useConfirm()` over rendering this directly.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  ...options
}: ConfirmDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange} mode="dialog">
      <ConfirmBody
        {...options}
        onCancel={() => onOpenChange(false)}
        onConfirm={() => {
          onConfirm()
          onOpenChange(false)
        }}
      />
    </ResponsiveDialog>
  )
}

function ConfirmBody({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  icon,
  onCancel,
  onConfirm,
}: ConfirmOptions & { onCancel: () => void; onConfirm: () => void }) {
  const drawer = useResponsiveDialogVariant() === "drawer"
  const cancelRef = useRef<HTMLButtonElement>(null)
  const Icon = icon ?? (destructive ? Trash2 : TriangleAlert)

  return (
    <ResponsiveDialogContent
      role="alertdialog"
      dialogClassName="sm:max-w-md"
      // Land on the safe choice so a stray Enter can't delete anything
      onOpenAutoFocus={(e) => {
        e.preventDefault()
        cancelRef.current?.focus()
      }}
    >
      <ResponsiveDialogHeader
        className={cn(
          "flex gap-4",
          drawer ? "flex-col items-center pt-4 text-center" : "flex-row"
        )}
      >
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full",
            drawer ? "size-14" : "size-11",
            destructive
              ? "bg-destructive/10 text-destructive"
              : "bg-accent text-accent-foreground"
          )}
          aria-hidden="true"
        >
          <Icon className={drawer ? "size-6" : "size-5"} />
        </span>
        <div
          className={cn(
            "flex min-w-0 flex-col gap-1.5",
            drawer && "text-center"
          )}
        >
          <ResponsiveDialogTitle className="text-lg font-semibold">
            {title}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="text-sm text-muted-foreground">
            {description}
          </ResponsiveDialogDescription>
        </div>
      </ResponsiveDialogHeader>

      <ResponsiveDialogFooter
        className={cn(
          "border-t-0",
          drawer ? "flex-col-reverse items-stretch gap-2 px-4 pb-4" : "pt-2"
        )}
      >
        <Button
          ref={cancelRef}
          variant="outline"
          size={drawer ? "lg" : "default"}
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={destructive ? "destructive" : "default"}
          size={drawer ? "lg" : "default"}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </ResponsiveDialogFooter>
    </ResponsiveDialogContent>
  )
}

// ─── Imperative API ───────────────────────────────────────────────────────────

type Confirm = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<Confirm | null>(null)

/**
 * Mount once near the app root. Renders the single confirmation dialog that
 * every `useConfirm()` call shares.
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    open: boolean
    options: ConfirmOptions
  } | null>(null)
  const resolver = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback<Confirm>((options) => {
    // A second request while one is open cancels the first
    resolver.current?.(false)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
      setState({ open: true, options })
    })
  }, [])

  const settle = (value: boolean) => {
    resolver.current?.(value)
    resolver.current = null
    // Keep the options so the content doesn't blank out mid close-animation
    setState((s) => (s ? { ...s, open: false } : s))
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state ? (
        <ConfirmDialog
          {...state.options}
          open={state.open}
          onOpenChange={(open) => {
            if (!open) settle(false)
          }}
          onConfirm={() => settle(true)}
        />
      ) : null}
    </ConfirmContext.Provider>
  )
}

/**
 * Ask the user to confirm. Resolves `true` on confirm, `false` on cancel or dismiss.
 *
 *   if (!(await confirm({ title: "Delete?", description: "…", destructive: true }))) return
 */
export function useConfirm(): Confirm {
  const confirm = useContext(ConfirmContext)
  if (!confirm)
    throw new Error("useConfirm must be used within <ConfirmProvider>")
  return confirm
}
