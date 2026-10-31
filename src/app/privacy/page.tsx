import type { Metadata } from "next"

import { LandingShell } from "@/views/landing"

export const metadata: Metadata = {
  title: "Privacy and terms",
  description:
    "Track Taka stores your data in your own browser and sends nothing to a server. The short privacy notice and terms of use.",
}

export default function PrivacyPage() {
  return (
    <LandingShell>
      <article className="app-gutter pt-24 pb-20 lg:pb-24">
        <div className="mx-auto mt-16 w-full max-w-reading">
          <h1 className="heading-3 text-balance sm:heading-2">
            Privacy and terms
          </h1>
          <p className="mt-4 caption-2 text-muted-foreground">
            Last updated 31 October 2026
          </p>

          <section aria-labelledby="privacy" className="mt-12">
            <h2 id="privacy" className="heading-6">
              Privacy
            </h2>
            <div className="mt-4 flex flex-col gap-4 body-3 text-pretty text-muted-foreground">
              <p>
                Track Taka runs entirely in your browser. Accounts,
                transactions, budgets and settings are stored in your browser's
                own storage on the device you use. They are not sent to a server
                and nobody else can see them.
              </p>
              <p>
                There is no account, no analytics and no tracking on this site
                or in the app. Backups you export are plain files that you keep;
                importing one reads it on your device only.
              </p>
              <p>
                Clearing site data for this address deletes everything the app
                has stored. Keep a backup if you want to be able to restore it.
              </p>
            </div>
          </section>

          <section aria-labelledby="terms" className="mt-12">
            <h2 id="terms" className="heading-6">
              Terms of use
            </h2>
            <div className="mt-4 flex flex-col gap-4 body-3 text-pretty text-muted-foreground">
              <p>
                Track Taka is free and open source. It is provided as is,
                without warranty of any kind. You are responsible for keeping
                backups of your own data.
              </p>
              <p>
                The app is a personal record keeping tool. It does not connect
                to bKash, Nagad, any bank or any payment service, and it gives
                no financial advice.
              </p>
            </div>
          </section>
        </div>
      </article>
    </LandingShell>
  )
}
