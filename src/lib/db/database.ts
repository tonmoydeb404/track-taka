import {
  addRxPlugin,
  createRxDatabase,
  type RxCollection,
  type RxDatabase,
} from "rxdb/plugins/core"
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie"
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv"

import {
  accountSchema,
  budgetSchema,
  settingsSchema,
  transactionSchema,
} from "./schemas"
import {
  DEFAULT_SETTINGS,
  SETTINGS_ID,
  type AccountDoc,
  type BudgetDoc,
  type SettingsDoc,
  type TransactionDoc,
} from "./types"

export type AppCollections = {
  accounts: RxCollection<AccountDoc>
  transactions: RxCollection<TransactionDoc>
  budgets: RxCollection<BudgetDoc>
  settings: RxCollection<SettingsDoc>
}

export type AppDatabase = RxDatabase<AppCollections>

const DB_NAME =
  process.env.NODE_ENV === "production" ? "track-taka" : "track-taka-dev"

// Keep one instance across React strict-mode double effects and HMR reloads.
const globalRef = globalThis as typeof globalThis & {
  __trackTakaDb?: Promise<AppDatabase>
}

async function create(): Promise<AppDatabase> {
  if (process.env.NODE_ENV !== "production") {
    const { RxDBDevModePlugin, disableWarnings } =
      await import("rxdb/plugins/dev-mode")
    // Must come first: the banner is printed while the plugin initialises.
    disableWarnings()
    addRxPlugin(RxDBDevModePlugin)
  }

  const storage = wrappedValidateAjvStorage({ storage: getRxStorageDexie() })

  const db = await createRxDatabase<AppCollections>({
    name: DB_NAME,
    storage,
    // Multiple tabs share one database; RxDB elects a leader tab.
    multiInstance: true,
    ignoreDuplicate: process.env.NODE_ENV !== "production",
  })

  await db.addCollections({
    accounts: { schema: accountSchema },
    transactions: { schema: transactionSchema },
    budgets: { schema: budgetSchema },
    settings: { schema: settingsSchema },
  })

  // Ask the browser not to evict our data under storage pressure.
  void navigator.storage?.persist?.()

  // The settings document always exists.
  if (!(await db.settings.findOne(SETTINGS_ID).exec())) {
    await db.settings.insert({
      ...DEFAULT_SETTINGS,
      updatedAt: new Date().toISOString(),
    })
  }

  return db
}

/** Browser only. Resolves to the singleton database. */
export function getDatabase(): Promise<AppDatabase> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("The database is only available in the browser")
    )
  }
  globalRef.__trackTakaDb ??= create().catch((error) => {
    globalRef.__trackTakaDb = undefined
    throw error
  })
  return globalRef.__trackTakaDb
}
