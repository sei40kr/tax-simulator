import { INCOME_TAX_BRACKETS, RECONSTRUCTION_TAX_RATE } from "./constants";

export function calcIncomeTax(taxableIncome: number): number {
  const bracket = INCOME_TAX_BRACKETS.find((b) => taxableIncome <= b.threshold);
  if (!bracket) return 0;
  const baseTax = Math.max(0, taxableIncome * bracket.rate - bracket.deduction);
  // 所得税＋復興特別所得税の合計を百円未満切り捨て
  return Math.floor((baseTax * (1 + RECONSTRUCTION_TAX_RATE)) / 100) * 100;
}
