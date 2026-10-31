import type { Metadata } from "next"

import { LandingPage } from "@/views/landing"
import { FAQS } from "@/views/landing/content"

const title =
  "Track Taka: free expense tracker that keeps your data on your phone"
const description =
  "Record cash, bKash, Nagad and bank spending in seconds. Open source, works offline, no account. Everything is saved on your device."

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Track Taka",
  },
  twitter: { card: "summary_large_image", title, description },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <LandingPage />
    </>
  )
}
