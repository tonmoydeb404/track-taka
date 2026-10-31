// Copy and sample data for the landing page. Amounts are integer paisa, like
// everywhere else in the app, so the ledger demo can reuse the money helpers.
// Facts here are verifiable from the code: nothing is invented.

export const GITHUB_URL = "https://github.com/tonmoydeb404/track-taka"

export const NAV_ITEMS = [
  { label: "Open the app", href: "/dashboard" },
  { label: "What's new", href: "/whats-new" },
  { label: "GitHub", href: GITHUB_URL, external: true },
  { label: "Privacy and terms", href: "/privacy" },
] as const

export const HERO = {
  headlineA: "Track every taka.",
  headlineB: "Nothing leaves your phone.",
  sub: "A free expense tracker for cash, bKash, Nagad and bank. Record a purchase in a few seconds and everything stays on your phone.",
  cta: "Open the app",
  proof: ["Open source", "Works offline", "No account needed"],
} as const

export const PROBLEM = {
  heading: "The month disappears one small payment at a time.",
  problem:
    "Rickshaw fare, a recharge, lunch, a bKash send. None of it feels worth writing down, and by the twentieth nobody can say where the month went. Most apps that promise to help want a login, a subscription and a copy of your spending.",
  solution:
    "Track Taka is a notebook on your phone. Open it, write the amount, pick a category, done. It needs no login, sends nothing anywhere, and still gives you budgets, balances and a clear view of the month.",
} as const

export const TAGLINE = ["Every taka written down.", "None of it sent anywhere."]

export const BENEFITS = [
  {
    icon: "calculator",
    title: "Done in seconds",
    body: "Type the amount, tap a category, saved. The amount field does arithmetic, so a shared dinner is 1500/3 and a split fare is 40+40.",
  },
  {
    icon: "wallet",
    title: "Your accounts, kept apart",
    body: "Cash, bKash, Nagad and bank each keep their own balance. Moving money between them is a transfer and never counts as spending.",
  },
  {
    icon: "chart",
    title: "The month at a glance",
    body: "Set a limit per category and watch it fill. When you go over, the bar keeps going so you can see by how much.",
  },
  {
    icon: "lock",
    title: "Stored on your phone only",
    body: "Entries are stored in your browser, not on a server. Export a JSON backup whenever you want and import it anywhere.",
  },
] as const

export const STEPS = [
  {
    title: "Add an account",
    body: "Cash, bKash, Nagad or your bank, with the balance it has right now. Add as many as you use.",
  },
  {
    title: "Record what you spend",
    body: "Amount, category, done. Edit or delete anything later. Sums are allowed for split costs.",
  },
  {
    title: "Check the month",
    body: "Balances, budgets and category totals update from what you recorded. Nothing to sync, nothing to wait for.",
  },
] as const

export interface LedgerEntry {
  time: string
  description: string
  /** Shown faintly before the amount when the entry was typed as a sum. */
  expression?: string
  /** Integer paisa. */
  amount: number
}

export const LEDGER_ENTRIES: LedgerEntry[] = [
  {
    time: "8:40",
    description: "Rickshaw, 2 trips",
    expression: "40+40",
    amount: 8000,
  },
  { time: "1:15", description: "Lunch at the mess", amount: 12500 },
  { time: "3:05", description: "Mobile recharge", amount: 9900 },
  {
    time: "7:30",
    description: "Groceries",
    expression: "650+185",
    amount: 83500,
  },
]

export interface Faq {
  question: string
  answer: string
}

export const FAQS: Faq[] = [
  {
    question: "Is it free?",
    answer:
      "Yes. Track Taka is open source, with no ads, no subscription and no account to create.",
  },
  {
    question: "Do I need to sign up?",
    answer:
      "No. Open the app, add an account such as cash or bKash, and record your first expense. That is the whole setup.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "In your browser's storage on this device. Nothing is sent to a server. You can export everything as one JSON file from Settings and import it again on another device.",
  },
  {
    question: "What if I lose or change my phone?",
    answer:
      "Your data lives on that device only, so export a backup now and then. Optional sync between devices is planned for a later release.",
  },
  {
    question: "What happens if I clear my browser data?",
    answer:
      "Clearing site data for Track Taka deletes your entries, because they live in the browser. Keep a backup file somewhere safe and import it to restore everything.",
  },
  {
    question: "Can I install it like an app?",
    answer:
      "Yes. Add it to your home screen on Android or iPhone and it opens full screen, with its own icon, and keeps working without a connection.",
  },
  {
    question: "Does it work on a computer too?",
    answer:
      "Yes. The same page works in a desktop browser with a wider layout, including a sortable table of transactions.",
  },
  {
    question: "Which accounts can I track?",
    answer:
      "Cash, mobile money such as bKash and Nagad, bank accounts and cards. Moving money between your own accounts is a transfer and is never counted as spending.",
  },
]
