import type { Metadata } from "next"

import { KhataPage } from "@/views/notes"

export const metadata: Metadata = { title: "Khata" }

export default function Page() {
  return <KhataPage />
}
