import type { Metadata } from "next"

import { KhataPage } from "@/views/notes"

export const metadata: Metadata = { title: "Khata notes" }

export default function Page() {
  return <KhataPage />
}
