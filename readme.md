<p align="center"><img src="public/brand/logo.svg" alt="Track Taka" width="320"></p>

# Track Taka

A calm, fast personal finance tracker — record expenses in seconds and understand
where your money goes. Local-first by design: every entry saves on the device
instantly, with cloud sync arriving in a later phase.

**Stack**: Next.js (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
shadcn/ui (Radix) · Zustand (persisted local store) · Recharts · Sonner.

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

| Script           | Purpose                  |
| ---------------- | ------------------------ |
| `pnpm dev`       | Development server       |
| `pnpm build`     | Production build         |
| `pnpm start`     | Serve the production app |
| `pnpm lint`      | ESLint                   |
| `pnpm typecheck` | TypeScript, no emit      |
| `pnpm format`    | Prettier                 |

## Project structure

Conventions: kebab-case file names, named exports, barrel `index.ts` per module,
feature modules under `views/`.

```
src/
  app/            # Next.js entry — layout, page, global styles
  components/
    ui/           # shadcn/ui primitives (Radix-based)
    common/       # shared building blocks (page header, empty state, icons…)
    layout/       # app shell, sidebars, bottom nav, sync/theme sync
    quick-entry/  # amount input, category/account pickers, sheets
    transactions/ # rows, type badge, detail sheet
  views/          # one module per screen: index + components/ + utils
    landing/      # public landing page at /, shared chrome for /privacy and the 404
    whats-new/    # release history from lib/release-notes.ts
    screenshots/  # frames for the PWA install prompt screenshots
    overview/  transactions/  budgets/  analytics/
    accounts/  imports/  reconciliation/  settings/
  lib/
    finance/      # domain: types, format, calc, seed data, stores
    utils.ts      # cn() class helper
  hooks/          # use-mounted, use-mobile
```

### Data flow

- `useFinanceStore` (Zustand + localStorage persistence) is the single
  source of truth for accounts, categories, transactions, budgets, presets,
  imports, reviewed days and settings.
- `useUIStore` drives navigation (`view`) and the global overlays
  (quick entry, voice capture, transaction detail).
- Derived numbers (balances, budgets, analytics) are computed from the store —
  never stored — via `lib/finance/calc.ts`. Transfers are excluded from
  income/expense everywhere.
- Cloud sync is intentionally a simulated prototype for now (see the honest
  disclosures in Settings); the IndexedDB + Firebase sync engine is the next
  milestone.

### Design

The approved UI prototype lives in `design/` (archived alongside this app). The
theme — warm off-white surfaces, teal primary, `text-income` / `text-expense`
semantics, tabular figures — is defined in `src/app/globals.css`.

### Legacy

The original Vite/React app is archived under `backup/` for reference.
