import { takaToPaisa } from "./money"

// Amount fields accept inline math, e.g. "120+80*2" or "(1500-300)/3".
// This is a small hand-written parser; user text is never passed to eval().

const MAX_TAKA = 99_999_999.99

/**
 * Keep only what an amount expression can contain, and tidy it as it is
 * typed: digits, one dot per number (max 2 decimals), + - * / and brackets.
 * "x" and "×" mean multiply, "÷" means divide, commas and ৳ are dropped.
 */
export function sanitizeMoneyExpression(raw: string): string {
  const cleaned = raw
    .replace(/[x×]/gi, "*")
    .replace(/÷/g, "/")
    .replace(/[^0-9.+\-*/()]/g, "")
  // Within each number: at most one dot and two decimals.
  return cleaned
    .split(/([+\-*/()])/)
    .map((part) => {
      if (!/[0-9.]/.test(part)) return part
      const [int = "", ...rest] = part.split(".")
      if (rest.length === 0) return int
      return `${int}.${rest.join("").slice(0, 2)}`
    })
    .join("")
    .slice(0, 80)
}

/** True when the text is more than a plain number (has a calculation in it). */
export function hasOperator(text: string): boolean {
  // A leading minus alone is not a calculation.
  return /[+*/()]|(?<=[0-9.)])-/.test(text)
}

type Token = { kind: "num"; value: number } | { kind: "op"; value: string }

function tokenize(text: string): Token[] | null {
  const tokens: Token[] = []
  const re = /\s*(?:(\d+\.?\d*|\.\d+)|([+\-*/()]))/y
  let pos = 0
  while (pos < text.length) {
    re.lastIndex = pos
    const m = re.exec(text)
    if (!m) return text.slice(pos).trim() === "" ? tokens : null
    if (m[1] !== undefined) {
      // Paisa are the smallest unit: more than two decimals is a typo.
      if ((m[1].split(".")[1] ?? "").length > 2) return null
      tokens.push({ kind: "num", value: Number(m[1]) })
    } else {
      tokens.push({ kind: "op", value: m[2] })
    }
    pos = re.lastIndex
  }
  return tokens
}

/** expr := term (('+'|'-') term)* ; term := factor (('*'|'/') factor)* */
function evaluate(tokens: Token[]): number | null {
  let i = 0
  const peek = () => tokens[i]
  const isOp = (t: Token | undefined, ...ops: string[]) =>
    t?.kind === "op" && ops.includes(t.value)

  const factor = (): number | null => {
    const t = peek()
    if (!t) return null
    if (t.kind === "num") {
      i++
      return t.value
    }
    if (isOp(t, "-")) {
      i++
      const v = factor()
      return v === null ? null : -v
    }
    if (isOp(t, "(")) {
      i++
      const v = expr()
      if (v === null || !isOp(peek(), ")")) return null
      i++
      return v
    }
    return null
  }
  const term = (): number | null => {
    let left = factor()
    while (left !== null && isOp(peek(), "*", "/")) {
      const op = (peek() as { value: string }).value
      i++
      const right = factor()
      if (right === null) return null
      left = op === "*" ? left * right : left / right
    }
    return left
  }
  const expr = (): number | null => {
    let left = term()
    while (left !== null && isOp(peek(), "+", "-")) {
      const op = (peek() as { value: string }).value
      i++
      const right = term()
      if (right === null) return null
      left = op === "+" ? left + right : left - right
    }
    return left
  }

  const result = expr()
  return result !== null && i === tokens.length ? result : null
}

/**
 * Turn what a person typed into paisa. Plain numbers ("1,250.50") and
 * calculations ("120+80*2") both work. Returns null for anything that is not
 * a finite, non-negative amount within range (including divide by zero).
 */
export function parseMoneyInput(input: string): number | null {
  const text = input
    .replace(/[,৳\s]/g, "")
    .replace(/[x×]/gi, "*")
    .replace(/÷/g, "/")
  if (text === "") return null
  const tokens = tokenize(text)
  if (!tokens || tokens.length === 0) return null
  const taka = evaluate(tokens)
  if (taka === null || !Number.isFinite(taka)) return null
  const paisa = takaToPaisa(taka)
  if (paisa < 0 || taka > MAX_TAKA) return null
  return paisa
}
