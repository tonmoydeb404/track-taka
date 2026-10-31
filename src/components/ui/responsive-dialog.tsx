"use client"

import * as React from "react"

import { useIsMobile } from "@/hooks"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// ─── Types ────────────────────────────────────────────────────────────────────

type Side = "top" | "right" | "bottom" | "left"

/**
 * Desktop shell for every ResponsiveDialog that doesn't set `mode` itself:
 * "sheet" docks to the side, "dialog" centres a modal. Phones always get a
 * bottom drawer. Change this one value to switch the whole app.
 */
export const DEFAULT_DESKTOP_MODE: "dialog" | "sheet" = "sheet"

type ResponsiveDialogVariant = "dialog" | "sheet" | "drawer"

interface ResponsiveDialogConfig {
  /** Active shell for the current viewport / mode. */
  variant: ResponsiveDialogVariant
  /** Side the Sheet docks to when the active shell is "sheet". */
  sheetSide: Side
}

const ResponsiveDialogContext =
  React.createContext<ResponsiveDialogConfig | null>(null)

/**
 * Returns the shell currently rendered by the enclosing
 * `<ResponsiveDialog>` — lets consumers fork styling/logic
 * (e.g. render a full-width list in the drawer).
 */
export function useResponsiveDialogVariant(): ResponsiveDialogVariant {
  const config = React.useContext(ResponsiveDialogContext)
  if (!config) {
    throw new Error(
      "useResponsiveDialogVariant must be used within <ResponsiveDialog>"
    )
  }
  return config.variant
}

// ─── Shared prop types ────────────────────────────────────────────────────────

export interface ResponsiveDialogRootProps extends React.ComponentProps<
  typeof Dialog
> {
  /**
   * Desktop shell: centered Dialog or edge Sheet. Mobile always renders
   * the Drawer (vaul) shell.
   * @default "sheet"
   */
  mode?: "dialog" | "sheet"
  /** Side the Sheet docks to when `mode="sheet"` (default: right). */
  sheetSide?: Side
  /** Edge the Drawer slides from on mobile (default: bottom). */
  drawerDirection?: "top" | "right" | "bottom" | "left"
  /** Render the Drawer shell regardless of viewport (mainly for testing). */
  forceDrawer?: boolean
  /**
   * Whether the mobile Drawer can be dismissed by swiping down / tapping the
   * overlay. Set `false` for blocking dialogs (confirms, time-up, etc.).
   * @default true
   */
  dismissible?: boolean
}

export interface ResponsiveDialogContentProps extends React.ComponentProps<
  typeof DialogContent
> {
  /** Classes applied only to the desktop Dialog shell. */
  dialogClassName?: string
  /** Classes applied only to the desktop Sheet shell. */
  sheetClassName?: string
  /** Classes applied only to the mobile Drawer shell. */
  drawerClassName?: string
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function ResponsiveDialog({
  mode = DEFAULT_DESKTOP_MODE,
  sheetSide = "right",
  drawerDirection = "bottom",
  forceDrawer = false,
  dismissible = true,
  children,
  ...props
}: ResponsiveDialogRootProps) {
  const isMobile = useIsMobile()
  const useDrawer = forceDrawer || isMobile

  const config = React.useMemo<ResponsiveDialogConfig>(
    () => ({
      variant: useDrawer ? "drawer" : mode,
      sheetSide,
    }),
    [useDrawer, mode, sheetSide]
  )

  return (
    <ResponsiveDialogContext.Provider value={config}>
      {useDrawer ? (
        <Drawer
          direction={drawerDirection}
          dismissible={dismissible}
          {...props}
        >
          {children}
        </Drawer>
      ) : mode === "sheet" ? (
        <Sheet {...props}>{children}</Sheet>
      ) : (
        <Dialog {...props}>{children}</Dialog>
      )}
    </ResponsiveDialogContext.Provider>
  )
}

// ─── Shell primitives ─────────────────────────────────────────────────────────

/**
 * Per-variant sub-primitives. Each shell's Header/Footer carry their own
 * layout defaults (e.g. Sheet's baked-in `p-4`), so consumers migrate from
 * Sheet → ResponsiveDialog without re-adding padding classes.
 */
const SHELL = {
  dialog: {
    Trigger: DialogTrigger,
    Close: DialogClose,
    Header: DialogHeader,
    Footer: DialogFooter,
    Title: DialogTitle,
    Description: DialogDescription,
  },
  sheet: {
    Trigger: SheetTrigger,
    Close: SheetClose,
    Header: SheetHeader,
    Footer: SheetFooter,
    Title: SheetTitle,
    Description: SheetDescription,
  },
  drawer: {
    Trigger: DrawerTrigger,
    Close: DrawerClose,
    Header: DrawerHeader,
    Footer: DrawerFooter,
    Title: DrawerTitle,
    Description: DrawerDescription,
  },
} as const

// ─── Trigger / Close ──────────────────────────────────────────────────────────

function ResponsiveDialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogTrigger>) {
  const { variant } = React.useContext(ResponsiveDialogContext)!
  const Primitive = SHELL[variant].Trigger
  return <Primitive data-slot="responsive-dialog-trigger" {...props} />
}

function ResponsiveDialogClose({
  ...props
}: React.ComponentProps<typeof DialogClose>) {
  const { variant } = React.useContext(ResponsiveDialogContext)!
  const Primitive = SHELL[variant].Close
  return <Primitive data-slot="responsive-dialog-close" {...props} />
}

// ─── Content ──────────────────────────────────────────────────────────────────

function ResponsiveDialogContent({
  className,
  dialogClassName,
  sheetClassName,
  drawerClassName,
  children,
  ...props
}: ResponsiveDialogContentProps) {
  const { variant, sheetSide } = React.useContext(ResponsiveDialogContext)!

  if (variant === "drawer") {
    return (
      <DrawerContent
        data-slot="responsive-dialog-content"
        className={cn(
          "max-h-[92dvh] gap-0 overflow-hidden",
          className,
          drawerClassName
        )}
        {...props}
        // A sheet opening should not summon the keyboard on a phone
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          props.onOpenAutoFocus?.(e)
        }}
      >
        {children}
      </DrawerContent>
    )
  }

  if (variant === "sheet") {
    return (
      <SheetContent
        data-slot="responsive-dialog-content"
        side={sheetSide}
        className={cn(
          "gap-0",
          (sheetSide === "left" || sheetSide === "right") && "sm:max-w-lg",
          className,
          sheetClassName
        )}
        {...props}
      >
        {children}
      </SheetContent>
    )
  }

  return (
    <DialogContent
      data-slot="responsive-dialog-content"
      showCloseButton
      className={cn(
        "flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0",
        className,
        dialogClassName
      )}
      {...props}
    >
      {children}
    </DialogContent>
  )
}

// ─── Header / Footer ──────────────────────────────────────────────────────────

function ResponsiveDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { variant } = React.useContext(ResponsiveDialogContext)!
  const Primitive = SHELL[variant].Header
  return (
    <Primitive
      data-slot="responsive-dialog-header"
      className={cn(
        "shrink-0 text-left group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left",
        variant !== "drawer" && "px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4",
        className
      )}
      {...props}
    />
  )
}

function ResponsiveDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { variant } = React.useContext(ResponsiveDialogContext)!
  const Primitive = SHELL[variant].Footer
  return (
    <Primitive
      data-slot="responsive-dialog-footer"
      className={cn(
        "shrink-0 flex-row items-center justify-end gap-2 border-t bg-background",
        variant === "drawer" ? "px-4 py-3" : "px-4 py-3 sm:px-6 sm:py-4",
        variant === "drawer" && "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        className
      )}
      {...props}
    />
  )
}

// ─── Body ─────────────────────────────────────────────────────────────────────

/**
 * Scrollable region between Header and Footer. Header/Footer stay pinned
 * while only the body scrolls. `data-vaul-no-drag` stops the mobile drawer
 * from hijacking scroll gestures as drag-to-dismiss.
 */
function ResponsiveDialogBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="responsive-dialog-body"
      data-vaul-no-drag
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6 sm:py-4",
        className
      )}
      {...props}
    />
  )
}

// ─── Title / Description ──────────────────────────────────────────────────────

function ResponsiveDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  const { variant } = React.useContext(ResponsiveDialogContext)!
  const Primitive = SHELL[variant].Title
  return (
    <Primitive
      data-slot="responsive-dialog-title"
      className={className}
      {...props}
    />
  )
}

function ResponsiveDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) {
  const { variant } = React.useContext(ResponsiveDialogContext)!
  const Primitive = SHELL[variant].Description
  return (
    <Primitive
      data-slot="responsive-dialog-description"
      className={className}
      {...props}
    />
  )
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
}
