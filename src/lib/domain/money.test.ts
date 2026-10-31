import { describe, expect, it } from "vitest"

import {
  compactMoney,
  formatBalance,
  formatMoney,
  parseTakaInput,
  takaToPaisa,
} from "./money"

describe("money", () => {
  it("converts without float drift", () => {
    expect(takaToPaisa(0.1 + 0.2)).toBe(30)
    expect(takaToPaisa(1250.5)).toBe(125050)
  })

  it("formats whole and fractional amounts", () => {
    expect(formatMoney(125000)).toBe("৳1,250")
    expect(formatMoney(125050)).toBe("৳1,250.50")
    expect(formatMoney(125000, { decimals: true })).toBe("৳1,250.00")
    expect(formatBalance(-125000)).toBe("−৳1,250")
  })

  it("formats compact amounts", () => {
    expect(compactMoney(1200000)).toBe("৳12k")
    expect(compactMoney(15000000)).toBe("৳1.5L")
    expect(compactMoney(50000)).toBe("৳500")
  })

  it("parses typed amounts", () => {
    expect(parseTakaInput("1,250.5")).toBe(125050)
    expect(parseTakaInput("৳ 99")).toBe(9900)
    expect(parseTakaInput("")).toBeNull()
    expect(parseTakaInput("12.345")).toBeNull()
    expect(parseTakaInput("abc")).toBeNull()
  })
})
