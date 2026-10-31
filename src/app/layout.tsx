import type { Metadata, Viewport } from "next"
import { Manrope, Noto_Sans_Bengali } from "next/font/google"
import NextTopLoader from "nextjs-toploader"

import { ThemeProvider } from "@/components/layout/theme-provider"
import { BRAND_BLUE } from "@/lib/brand"
import { Toaster } from "@/components/ui/sonner"
// Mounted in the root layout so the module loads on every route: it must be
// listening before the browser fires `beforeinstallprompt` (see the module
// comment in use-install-prompt.ts).
import { PwaInstallDialog, ServiceWorkerRegistrar } from "@/components/pwa"
import "@/components/pwa/use-install-prompt"
import "./globals.css"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
})

// Fallback for Bengali text and the ৳ sign, which Manrope does not include
const bengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Track Taka — Personal Finance Tracker",
    template: "%s · Track Taka",
  },
  description:
    "Record expenses in seconds and understand where your money goes. A calm, fast personal finance tracker for everyday use.",
  applicationName: "Track Taka",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Track Taka",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // The browser chrome, status bar and installed-app title bar take the
  // mark's own blue in both themes, so the product reads the same everywhere.
  themeColor: BRAND_BLUE,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${bengali.variable} bg-background font-sans text-foreground antialiased`}
      >
        <NextTopLoader
          color={BRAND_BLUE}
          height={2}
          showSpinner={false}
          shadow={false}
        />
        <ThemeProvider>
          {children}
          <Toaster position="top-center" />
          <PwaInstallDialog />
          <ServiceWorkerRegistrar />
        </ThemeProvider>
      </body>
    </html>
  )
}
