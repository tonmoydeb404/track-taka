import type { Metadata, Viewport } from "next"
import { Manrope, Noto_Sans_Bengali } from "next/font/google"

import { Toaster } from "@/components/ui/sonner"
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
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b121a" },
  ],
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
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
