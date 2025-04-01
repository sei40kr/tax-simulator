import type { ConsumptionTaxSettings } from "./types";

// 入力（income, expenses）は税込前提。内部で税抜換算してから計算する。
// 課税事業者・簡易課税の選択はチェックボックスでユーザー任せ。
export function calcConsumptionTax(
  income: number,
  expenses: number,
  settings: ConsumptionTaxSettings,
): number {
  if (!settings.isSubjectToTax) return 0;

  const factor = 1 + settings.rate / 100;
  const incomeExcl = income / factor;
  const expensesExcl = expenses / factor;

  const outputTax = incomeExcl * (settings.rate / 100);
  if (settings.useSimplifiedMethod) {
    const deemedDeduction = outputTax * (settings.simplifiedRate / 100);
    return outputTax - deemedDeduction;
  }
  const inputTax = expensesExcl * (settings.rate / 100);
  return outputTax - inputTax;
}
