// Money is stored as integer paisa (1 taka = 100 paisa) so sums are exact.
// Everything user-facing goes through these helpers.

export const PAISA_PER_TAKA = 100

export function takaToPaisa(taka: number): number {
  return Math.round(taka * PAISA_PER_TAKA)
}

export function paisaToTaka(paisa: number): number {
  return paisa / PAISA_PER_TAKA
}

/**
 * Parse what a person typed in an amount field (taka, e.g. "1,250.50") into
 * paisa. Returns null if it is not a valid non-negative number.
 */
export function parseTakaInput(input: string): number | null {
  const cleaned = input.replace(/[,\s৳]/g, "")
  if (!/^\d*\.?\d{0,2}$/.test(cleaned) || cleaned === "" || cleaned === ".") {
    return null
  }
  return takaToPaisa(Number(cleaned))
}

/** ৳1,250 — paisa are shown only when there are any: ৳1,250.50 */
export function formatMoney(
  paisa: number,
  opts?: { decimals?: boolean }
): string {
  const abs = Math.abs(paisa)
  const hasFraction = abs % PAISA_PER_TAKA !== 0
  const showDecimals = opts?.decimals ?? hasFraction
  const formatted = paisaToTaka(abs).toLocaleString("en-US", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })
  return `৳${formatted}`
}

/** A value that may be below zero, such as a balance: ৳1,250 or −৳1,250 */
export function formatBalance(paisa: number): string {
  return `${paisa < 0 ? "−" : ""}${formatMoney(paisa)}`
}

/** Compact for chart labels: ৳12k, ৳1.2L */
export function compactMoney(paisa: number): string {
  const taka = Math.abs(paisaToTaka(paisa))
  const sign = paisa < 0 ? "−" : ""
  if (taka >= 100000)
    return `${sign}৳${(taka / 100000).toFixed(taka >= 1000000 ? 0 : 1)}L`
  if (taka >= 1000)
    return `${sign}৳${(taka / 1000).toFixed(taka >= 10000 ? 0 : 1)}k`
  return `${sign}৳${Math.round(taka)}`
}

/** Signed amount with an explicit +/−, so type never relies on color alone. */
export function signedMoney(tx: {
  type: "expense" | "income" | "transfer"
  amount: number
}): string {
  if (tx.type === "income") return `+${formatMoney(tx.amount)}`
  if (tx.type === "expense") return `−${formatMoney(tx.amount)}`
  return formatMoney(tx.amount)
}
