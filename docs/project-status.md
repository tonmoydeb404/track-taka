# Track Taka — Project Status & Worklog

> Personal finance tracker ("track your taka"). Rebuilt from the approved prototype in
> `design/` as a production-quality Next.js app. This document captures the full state
> of the work: architecture, migrations, fixes, verification results, and open items.
>
> Last updated: 2026-10-31 · Committed on branch `feat/rxdb-local-first-rebuild`; open as PR #12.

---

## 1. Overview

Track Taka is a mobile-first personal finance tracker for the Bangladeshi context
(bKash/Nagad/cash/bank accounts, ৳ amounts). The UI was prototyped in `design/` and has
been rebuilt as a real app in `src/`, following the coding conventions of the monorepo
`/Users/tonmoydeb/Works/ielts-prepx/ielts-prepx-frontend` (mainly the organization app
and its `packages/ui`).

### Tech stack

| Layer      | Choice                                                        |
| ---------- | ------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router) + React 19 + TypeScript               |
| Data       | RxDB (local-first, Dexie storage), integer paisa amounts      |
| UI state   | Zustand (`useUIStore`, UI-only: sheets, month)                |
| Table      | `@tanstack/react-table` **v8.21.3** (pinned to match org app) |
| Charts     | Recharts 3 via shadcn `ChartContainer`                        |
| UI         | shadcn/ui default components (custom primitives removed)      |
| Dialogs    | `ResponsiveDialog` (dialog on desktop, drawer/sheet on mobile)|
| Icons      | lucide-react                                                  |
| Toasts     | sonner                                                        |
| Package mgr | pnpm                                                         |

### Conventions

- Kebab-case file naming, modular pattern, **named exports** (barrel exports per domain).
- Prettier: `semi: false`, `printWidth: 80` — run
  `pnpm exec prettier --write "src/**/*.{ts,tsx}"` after edits.
- Strict lint, **no blanket disables**. `design/` and `backup/` are excluded from
  tsc/eslint and must **never be edited** (archived prototype / legacy Vite app).
- Next.js 16 has breaking changes vs. training data — consult
  `node_modules/next/dist/docs/` before writing framework code (see `AGENTS.md`).

---

## 2. Architecture

```
src/
├── app/                          # Next.js App Router (real routes)
│   ├── layout.tsx                # root layout
│   ├── page.tsx                  # public landing page (views/landing, Framer Motion)
│   ├── privacy/ not-found.tsx    # privacy and terms page, branded 404
│   ├── opengraph-image.tsx       # generated social image
│   ├── whats-new/                # release history (src/lib/release-notes.ts)
│   ├── screenshots/              # install prompt frames + /screenshots/[id] bare capture route
│   ├── manifest.ts               # PWA manifest (explains manifest.webmanifest reqs)
│   └── dashboard/                # one route per view + settings sub-pages
│       ├── layout.tsx            # app shell (header, nav, quick-entry, save status)
│       ├── page.tsx              # Overview
│       ├── transactions/ budgets/ analytics/ accounts/
│       ├── imports/ reconciliation/
│       └── settings/             # general, categories, presets, data sub-pages
├── components/
│   ├── common/                   # page-header, confirm-dialog, empty-state, category-icon…
│   ├── transactions/             # transaction-row, transaction-icon, type-badge,
│   │                             # transaction-detail-sheet (+ barrel index.ts)
│   └── ui/                       # shadcn primitives incl. responsive-dialog.tsx, chart.tsx
├── views/                        # one folder per view; each has components/ + utils
│   ├── overview/ analytics/ budgets/ accounts/
│   ├── transactions/             # incl. TanStack table + column factory
│   ├── imports/ reconciliation/ settings/
│   └── …
├── lib/db/                       # RxDB database, schemas, provider, useRxQuery
└── lib/domain/                   # static categories, money, dates, calc, validation (pure)
```

- **Data**: views only use hooks from `src/hooks` (`data/` reads, `actions/` writes); nothing
  outside `lib/db` touches the database. Pure logic lives in `lib/domain` (unit-tested).

---

## 3. Work completed

### 3.1 Full frontend port from prototype

- All 8 views rebuilt: overview, transactions, budgets, analytics, accounts, imports,
  reconciliation, settings.
- Layout shell, quick-entry (add/edit expense·income·transfer), voice capture,
  transactions feature module, shared common components.
- Old Vite prototype archived into `backup/` (untouched since).

### 3.2 ResponsiveDialog migration (11 surfaces)

Ported from the reference repo
(`ielts-prepx-frontend/packages/ui/src/components/core/responsive-dialog.tsx`) nearly 1:1
into `src/components/ui/responsive-dialog.tsx`. All 11 dialog/sheet surfaces migrated:

edit dialogs (transaction, account, budget, transfer, category), confirm dialogs,
detail sheets, the "More destinations" sheet, settings sub-page sheets, etc.
Browser-verified on mobile (375×812) and desktop (1280×800).

> Known quirk: vaul drawers don't dismiss from **synthetic** overlay clicks — use a CDP
> keypress (Escape) with focus inside the drawer, or real clicks, when verifying.

### 3.3 Shadcn-everywhere migration

Every UI surface now uses shadcn default components. Custom card/panel markup
(`rounded-xl border bg-card …`) was replaced by `Card` primitives across all views.

**New/ported primitives**

- `src/components/ui/chart.tsx` — shadcn `ChartContainer` / `ChartTooltip` /
  `ChartLegend`, ported 1:1 from the reference repo's proven recharts-3 implementation
  (import rewired to `@/lib/utils`). Replaced the custom chart tooltip module.
- `@tanstack/react-table` **v8.21.3** — same version as the org app. v9 was installed
  first by accident; it is a **breaking rewrite** (`useTable` + explicit features, no
  `useReactTable`/`getCoreRowModel`), so it was downgraded to match the org-app pattern.

**Per-view changes**

| View            | What changed                                                                              |
| --------------- | ----------------------------------------------------------------------------------------- |
| Transactions    | Desktop table is a real TanStack DataTable: column defs in `transactions-table-columns.tsx` (org-app factory pattern `createTransactionColumns`), sortable Date/Description/Type/Amount headers with click-to-sort; sort dropdown **two-way synced** with header clicks via `sortOptionToSorting` / `sortingToSortOption` in `views/transactions/utils.ts`. Filter bar is a `Card`. Mobile day-grouped list reuses shared `sortTransactions` so both surfaces sort identically. |
| PageHeader      | Thin wrapper over `Card`/`CardHeader`/`CardTitle`/`CardAction`.                           |
| Settings        | `SectionCard` rebuilt as `Card` wrappers.                                                 |
| Overview        | Balance card, metrics row, reconciliation reminder, spending chart (ChartContainer), category breakdown, recent activity, budget snapshot — all Card + chart primitives. |
| Analytics       | All six sections on Cards with ChartContainer bar/line charts.                            |
| Accounts        | Account tiles use `Card`/`CardHeader`/`CardAction` (dropdown)/`CardContent`/`CardFooter`. |
| Budgets         | Overview card and per-budget cards restructured onto Card sections with `Progress`.       |
| Reconciliation  | Summary, per-account groups, and reminders panels are Cards. *(Removed from the product in §3.6.)* |
| Imports         | Receipt, statement, and history panels are Cards with `CardHeader`/`CardDescription`. *(Removed in §3.6.)* |

### 3.4 Fixes discovered during browser verification

1. **`CardAction` hard-positions row 1 / col 2** of the Card grid. PageHeader's action
   buttons rendered *above* the title on mobile → added
   `max-sm:col-start-1 max-sm:row-start-2` overrides in `page-header.tsx`.
2. **shadcn Button `whitespace-nowrap` clipped labels** at 375px in the Overview
   quick-action grid → quick-action buttons use `whitespace-normal` on mobile,
   `sm:whitespace-nowrap` restored on desktop.
3. **`pnpm add @tanstack/react-table` ran in the monorepo** (wrong workdir) — reinstalled
   inside track-taka; then pinned to `^8.21.3` after discovering v9's breaking API.
4. **Unused column-context prop** — `onOpenDetail` removed from the column factory
   (row clicks are handled at the table level) to clear the lint warning.

### 3.5 Verification results (final state)

- `pnpm exec tsc --noEmit` — ✅ pass
- `pnpm run lint` — ✅ 0 errors, 1 benign warning
  (`react-hooks/incompatible-library` on the controlled TanStack table — React Compiler
  just skips optimizing that component; standard v8 controlled pattern)
- `pnpm exec prettier --write` — ✅ applied
- `pnpm exec next build` — ✅ pass (static prerender)
- **Browser-verified** at 375×812 and 1280×800: all views, header-sort ↔ select sync,
  day-grouped mobile list, all dialog surfaces.

### 3.6 RxDB migration (local-first data layer)

Decisions: RxDB + free Dexie storage (not Firestore persistence, not Supabase); amounts are
**integer paisa**; categories are **static in code** (no CRUD); Imports, Reconciliation and
Presets were **removed**; account balances are **derived** from the opening balance plus
transactions (never stored, so they cannot drift and need no cross-device merge).

- Collections: `accounts`, `transactions`, `budgets` (compound key `categoryId|month`),
  `settings` (single doc `main`). Schemas in `src/lib/db/schemas.ts`.
- Reads: `useTransactions(month|"all")`, `useTransaction(id)`, `useAccounts`,
  `useAccountLookup`, `useAccountBalances`, `useBudgets`, `useBudgetProgress`, `useSettings`.
- Writes: `useTransactionActions` (create/update/remove/restore, validates transfer rules),
  `useAccountActions`, `useBudgetActions`, `useSettingsActions`. They throw user-safe errors.
- Archived accounts can be the source of a transfer (to empty them) but never the
  destination; they are hidden from pickers by default.
- Settings has General and Data only; Data does JSON backup export/import and delete-all.
- All screens migrated; old `lib/finance` store, mock data and prototype sync removed.
- **Schema changes need a version bump** plus a migration strategy (RxDB error DB6
  otherwise). Dev databases can be cleared in DevTools > Application > IndexedDB.
- Amount fields accept inline math (`120+80*2`, `(1500-300)/3`, `x`/`×`/`÷`): safe parser in
  `lib/domain/expression.ts` (no `eval`), live "= ৳280" hint, operator keys on phones.
  Used by quick-entry, voice capture, transfer, account opening balance and budget limit.
- Fixed on the way: amount `pattern` blocked decimals; `count()` queries need an index (QU14).
- Verified: `tsc` 0 errors, lint 0 errors (1 benign TanStack warning), 16 unit tests,
  `next build` passes; browser flow on a clean database (create account, add expense,
  derived balance, budget, backup export, reload persistence, 375px layout).

---

## 4. Routing & dev-server findings (2026-10-31)

Earlier confusion about port 3000 is resolved:

- The listener on port 3000 **is track-taka's own dev server** (`next-server` v16.4.2,
  cwd = this project).
- The `/dashboard/*` and `manifest.webmanifest` log lines in the dev terminal were
  **this app all along** — the app has real routes (`src/app/dashboard/*`) and a PWA
  manifest (`src/app/manifest.ts`). The old "different project's server" hypothesis was
  wrong.
- `curl http://localhost:3000` → `200`: `/` is the public landing page (it used to
  be a `307` redirect to `/dashboard`). The PWA `start_url` still points at `/dashboard`.
- All 11 dashboard routes verified `200`: transactions, budgets, analytics, accounts,
  imports, reconciliation, settings (+ `general`, `categories`, `presets`, `data`).

---

## 5. Git state

- Branch `feat/rxdb-local-first-rebuild` (12 commits on `main`), open as
  [PR #12](https://github.com/tonmoydeb404/track-taka/pull/12). Not merged yet.
- One commit per piece, in dependency order: legacy removal and scaffold, `lib/db`,
  `lib/domain`, hooks, app shell, then each screen (transactions, accounts, budgets,
  overview and analytics, settings), docs, and the agent skills (separate, easy to drop).
- Intermediate commits do not build on their own; the final state does.

---

## 6. Open items / next steps

1. **Merge PR #12** (see §5), then continue on follow-up branches.
2. **PWA offline shell** (install prompt screenshots are done, see `public/screenshots/README.md`): data works offline, but a full page reload offline needs a service
   worker to cache the app shell.
3. **Cloud sync (later)**: Firebase Auth + RxDB `replicateFirestore` per collection under
   `users/{uid}/…`, security rules, real sync status. Keep documents plain JSON.
4. **Migration of old Vite-app data (later)**: old store `transections` (title, category key,
   ms date, no accounts) needs mapping into accounts/transactions.
5. **Polish**: lint warning on the TanStack table (`useReactTable` vs React Compiler).
   RxDB's Dexie "Open Core" console notice stays: it is a licensing message that only a
   premium flag removes.

### Product invariants to preserve

- **Transfers are excluded from income/expense totals everywhere** (they're internal
  movement between own accounts).
- Type badges never rely on color alone (income/expense/transfer are labeled).
- Mobile-first: every surface verified at 375×812 before desktop.
