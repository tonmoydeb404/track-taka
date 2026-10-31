// Categories are fixed in code: no per-user customization. Transactions and
// budgets reference them by id. `icon` is a key into the CategoryIcon registry.

export type CategoryKind = "expense" | "income"

export type Category = {
  id: string
  name: string
  kind: CategoryKind
  icon: string
  color: string
}

export const CATEGORIES: readonly Category[] = [
  {
    id: "food",
    name: "Food",
    kind: "expense",
    icon: "utensils",
    color: "#d97706",
  },
  {
    id: "transport",
    name: "Transport",
    kind: "expense",
    icon: "bus",
    color: "#0d9488",
  },
  {
    id: "shopping",
    name: "Shopping",
    kind: "expense",
    icon: "shopping-bag",
    color: "#be123c",
  },
  {
    id: "bills",
    name: "Bills",
    kind: "expense",
    icon: "receipt",
    color: "#64748b",
  },
  {
    id: "health",
    name: "Health",
    kind: "expense",
    icon: "heart-pulse",
    color: "#dc2626",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    kind: "expense",
    icon: "clapperboard",
    color: "#7e22ce",
  },
  {
    id: "education",
    name: "Education",
    kind: "expense",
    icon: "book-open",
    color: "#65a30d",
  },
  {
    id: "other",
    name: "Other",
    kind: "expense",
    icon: "package",
    color: "#78716c",
  },
  {
    id: "salary",
    name: "Salary",
    kind: "income",
    icon: "briefcase",
    color: "#0d9488",
  },
  {
    id: "freelance",
    name: "Freelance",
    kind: "income",
    icon: "laptop",
    color: "#65a30d",
  },
  {
    id: "business",
    name: "Business",
    kind: "income",
    icon: "building-2",
    color: "#d97706",
  },
  { id: "gift", name: "Gift", kind: "income", icon: "gift", color: "#be123c" },
  {
    id: "other-income",
    name: "Other",
    kind: "income",
    icon: "wallet",
    color: "#78716c",
  },
]

export const EXPENSE_CATEGORIES = CATEGORIES.filter((c) => c.kind === "expense")
export const INCOME_CATEGORIES = CATEGORIES.filter((c) => c.kind === "income")

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]))

export function getCategory(
  id: string | null | undefined
): Category | undefined {
  return id ? BY_ID.get(id) : undefined
}

export function isCategoryId(id: string): boolean {
  return BY_ID.has(id)
}

export function categoriesFor(kind: CategoryKind): readonly Category[] {
  return kind === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
}
