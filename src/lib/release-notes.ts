// Release history shown on /whats-new. Newest first. Dates are ISO and come
// from the git history; keep highlights to what actually shipped.

export interface ReleaseNote {
  version: string
  /** ISO date, e.g. "2026-10-31". */
  date: string
  title: string
  /** Data or behaviour from the previous version does not carry over. */
  breaking?: boolean
  highlights: string[]
}

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "3.3.1",
    date: "2026-10-31",
    title: "Modals in the URL, offline from first launch",
    highlights: [
      "Every dialog and sheet now lives in the URL, so the back button closes it instead of leaving the app, and any screen can be bookmarked or shared.",
      "Installing the app now saves its pages up front, so the app works offline on first launch, and cached pages refresh on their own when a new version ships.",
      "The bottom tab bar keeps a clear gap above the Android system navigation bar.",
      "Refreshed brand marks with smaller app icons, updated screenshots, and a ledger-style closing section with a short FAQ intro on the landing page.",
    ],
  },
  {
    version: "3.3.0",
    date: "2026-10-31",
    title: "An install path for every browser",
    highlights: [
      "Install app now picks the best path for your browser: the browser's own install dialog when there is one, the guided install dialog otherwise.",
      "Browsers with no install support, such as Firefox and in-app browsers, get a short guide pointing to the browser menu instead of a dead-end error.",
      "If the install guide fails to load, the same guide opens in its place, so an install attempt never ends in nothing.",
    ],
  },
  {
    version: "3.2.0",
    date: "2026-10-31",
    title: "Branding and release tooling",
    highlights: [
      "Single source of truth for app name, version and copy via brand.json.",
      "sync-brand propagates brand values to package.json and generated files.",
      "release:tag bumps version, syncs, commits, tags and pushes.",
    ],
  },
  {
    version: "3.1.0",
    date: "2026-10-31",
    title: "Works with no connection, fully",
    highlights: [
      "The app now opens without a connection. After one visit online, the app shell is saved on the device and pages you have visited keep working offline.",
      "A calm branded screen appears if you open a page that hasn't been saved yet, with a retry button.",
      "When a new version ships you get a Reload prompt instead of a forced refresh, so an update never interrupts what you are doing.",
      "An always-available Install app entry in the desktop sidebar, the phone's More menu and in Settings opens a proper install guide: the native install dialog on Android and desktop Chrome, a step-by-step walkthrough with screenshots on iPhone and iPad.",
      "New app icons in the sizes Android and iPhone home screens expect, including a maskable icon for Android adaptive launchers.",
    ],
  },
  {
    version: "3.0.0",
    date: "2026-10-31",
    title: "Rebuilt to keep everything on your phone",
    breaking: true,
    highlights: [
      "Everything is stored on the device. There is no account and no server, and the app works with no connection.",
      "Accounts for cash, bKash, Nagad, bank and cards, with balances worked out from what you record. Transfers between your accounts never count as spending.",
      "Quick entry for expenses, income and transfers. The amount field does arithmetic, so 40+40 or 1500/3 is fine.",
      "Monthly budgets per category. When a category goes over, the bar keeps going so you can see by how much.",
      "Overview and analytics for the month: totals, comparison with last month, spending by category and by weekday.",
      "Settings with a JSON backup you can export and import on another device.",
      "Installable as an app on Android, iPhone and desktop, with a new public home page, privacy notice and this release history.",
      "Data from version 2 is not carried over. Export from the old app if you still need it; an import is planned.",
    ],
  },
  {
    version: "2.0.0",
    date: "2023-06-17",
    title: "Feedback and settings",
    highlights: [
      "Added a feedback page, reachable from settings, that sends a message by email.",
      "Added a settings page and a proper not found page.",
      "Transactions and the dashboard were stored in the cloud through a Firebase account.",
    ],
  },
  {
    version: "1.0.0",
    date: "2023-06-14",
    title: "First version",
    highlights: [
      "A Vite and React app with sign in, a transactions list, a dashboard and a home page that opened straight into the app.",
    ],
  },
]

export const LATEST_VERSION = RELEASE_NOTES[0]?.version ?? ""
