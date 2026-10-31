import type { RxJsonSchema } from "rxdb/plugins/core"

import type {
  AccountDoc,
  BudgetDoc,
  SettingsDoc,
  TransactionDoc,
} from "./types"

// Indexed strings need maxLength; fields used in an index must be required.
const ISO = { type: "string", maxLength: 32 } as const
const ID = { type: "string", maxLength: 64 } as const
const PAISA = {
  type: "integer",
  minimum: 0,
  maximum: 1_000_000_000_000,
} as const

export const accountSchema: RxJsonSchema<AccountDoc> = {
  title: "account",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: ID,
    name: { type: "string", maxLength: 40 },
    type: { type: "string", enum: ["cash", "mobile", "bank", "card"] },
    color: { type: "string", maxLength: 32 },
    openingBalance: {
      type: "integer",
      minimum: -1_000_000_000_000,
      maximum: 1_000_000_000_000,
    },
    archived: { type: "boolean" },
    createdAt: ISO,
    updatedAt: ISO,
  },
  required: [
    "id",
    "name",
    "type",
    "color",
    "openingBalance",
    "archived",
    "createdAt",
    "updatedAt",
  ],
  indexes: ["createdAt"],
}

export const transactionSchema: RxJsonSchema<TransactionDoc> = {
  title: "transaction",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: ID,
    type: { type: "string", enum: ["expense", "income", "transfer"] },
    amount: { type: "integer", minimum: 1, maximum: 1_000_000_000_000 },
    categoryId: { type: ["string", "null"], maxLength: 32 },
    accountId: ID,
    toAccountId: { type: ["string", "null"], maxLength: 64 },
    description: { type: "string", maxLength: 120 },
    date: ISO,
    createdAt: ISO,
    updatedAt: ISO,
  },
  required: [
    "id",
    "type",
    "amount",
    "categoryId",
    "accountId",
    "toAccountId",
    "description",
    "date",
    "createdAt",
    "updatedAt",
  ],
  indexes: ["date", ["accountId", "date"]],
}

export const budgetSchema: RxJsonSchema<BudgetDoc> = {
  title: "budget",
  version: 0,
  // One budget per category and month: RxDB builds the id from these fields,
  // so two devices creating the same budget converge on a single document.
  primaryKey: {
    key: "id",
    fields: ["categoryId", "month"],
    separator: "|",
  },
  type: "object",
  properties: {
    id: { type: "string", maxLength: 64 },
    categoryId: { type: "string", maxLength: 32 },
    month: { type: "string", maxLength: 7 },
    limit: PAISA,
    updatedAt: ISO,
  },
  required: ["id", "categoryId", "month", "limit", "updatedAt"],
  indexes: ["month"],
}

export const settingsSchema: RxJsonSchema<SettingsDoc> = {
  title: "settings",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string", maxLength: 16 },
    dateFormat: {
      type: "string",
      enum: ["dd MMM yyyy", "dd/MM/yyyy", "MMM dd, yyyy"],
    },
    weekStart: { type: "string", enum: ["saturday", "sunday", "monday"] },
    theme: { type: "string", enum: ["light", "dark", "system"] },
    lastBackupAt: { type: ["string", "null"], maxLength: 32 },
    schemaVersion: { type: "integer", minimum: 1, maximum: 1000 },
    updatedAt: ISO,
  },
  required: [
    "id",
    "dateFormat",
    "weekStart",
    "theme",
    "lastBackupAt",
    "schemaVersion",
    "updatedAt",
  ],
}
