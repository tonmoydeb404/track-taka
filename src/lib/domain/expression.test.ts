import { describe, expect, it } from "vitest"

import {
  hasOperator,
  parseMoneyInput,
  sanitizeMoneyExpression,
} from "./expression"

describe("parseMoneyInput", () => {
  it("keeps plain numbers working", () => {
    expect(parseMoneyInput("250")).toBe(25000)
    expect(parseMoneyInput("1,250.50")).toBe(125050)
    expect(parseMoneyInput("৳ 99")).toBe(9900)
    expect(parseMoneyInput("0")).toBe(0)
  })

  it("evaluates with the usual precedence", () => {
    expect(parseMoneyInput("120+80*2")).toBe(28000)
    expect(parseMoneyInput("(120+80)*2")).toBe(40000)
    expect(parseMoneyInput("1500/3")).toBe(50000)
    expect(parseMoneyInput("100-30-20")).toBe(5000)
    expect(parseMoneyInput("2*3*4")).toBe(2400)
  })

  it("accepts x, × and ÷ as operators", () => {
    expect(parseMoneyInput("12x5")).toBe(6000)
    expect(parseMoneyInput("12×5")).toBe(6000)
    expect(parseMoneyInput("90÷4")).toBe(2250)
  })

  it("does not drift on decimals", () => {
    expect(parseMoneyInput("0.1+0.2")).toBe(30)
    expect(parseMoneyInput("10/3")).toBe(333)
  })

  it("supports unary minus inside a calculation", () => {
    expect(parseMoneyInput("(-5)+10")).toBe(500)
    expect(parseMoneyInput("10+-5")).toBe(500)
  })

  it("rejects anything that is not a valid non-negative amount", () => {
    expect(parseMoneyInput("")).toBeNull()
    expect(parseMoneyInput("abc")).toBeNull()
    expect(parseMoneyInput("5/0")).toBeNull()
    expect(parseMoneyInput("5-10")).toBeNull()
    expect(parseMoneyInput("(1+2")).toBeNull()
    expect(parseMoneyInput("1+")).toBeNull()
    expect(parseMoneyInput("*5")).toBeNull()
    expect(parseMoneyInput("1..2")).toBeNull()
    expect(parseMoneyInput("12.345")).toBeNull()
    expect(parseMoneyInput("999999999*10")).toBeNull()
  })
})

describe("sanitizeMoneyExpression", () => {
  it("drops unsupported characters and limits decimals per number", () => {
    expect(sanitizeMoneyExpression("12a+3b")).toBe("12+3")
    expect(sanitizeMoneyExpression("1.234+5.678")).toBe("1.23+5.67")
    expect(sanitizeMoneyExpression("1.2.3")).toBe("1.23")
    expect(sanitizeMoneyExpression("3 x 4")).toBe("3*4")
    expect(sanitizeMoneyExpression("8÷2")).toBe("8/2")
  })

  it("never lets the field grow without bound", () => {
    expect(
      sanitizeMoneyExpression("1+".repeat(200)).length
    ).toBeLessThanOrEqual(80)
  })
})

describe("hasOperator", () => {
  it("tells a calculation from a plain number", () => {
    expect(hasOperator("250")).toBe(false)
    expect(hasOperator("12.50")).toBe(false)
    expect(hasOperator("-5")).toBe(false)
    expect(hasOperator("120+80")).toBe(true)
    expect(hasOperator("5-3")).toBe(true)
    expect(hasOperator("(5)")).toBe(true)
  })
})
