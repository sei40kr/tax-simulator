import { INCOME_TAX_BRACKETS, RECONSTRUCTION_TAX_RATE } from "./constants";

export const HOMETOWN_TAX_SELF_BURDEN = 2_000;

function getMarginalIncomeTaxRate(taxableIncome: number): number {
  const bracket = INCOME_TAX_BRACKETS.find((b) => taxableIncome <= b.threshold);
  return bracket?.rate ?? 0;
}

// ふるさと納税の控除上限額（自己負担2,000円で済む寄附額の上限）
// 上限額 = (住民税所得割額 × 20%) ÷ (90% − 所得税率 × 1.021) + 2,000
export function calcHometownTaxDonationLimit(
  residentIncomeRateTax: number,
  incomeTaxTaxableIncome: number,
): number {
  if (residentIncomeRateTax <= 0) return 0;
  const incomeTaxRate = getMarginalIncomeTaxRate(incomeTaxTaxableIncome);
  const denominator = 0.9 - incomeTaxRate * (1 + RECONSTRUCTION_TAX_RATE);
  if (denominator <= 0) return 0;
  return Math.floor(
    (residentIncomeRateTax * 0.2) / denominator + HOMETOWN_TAX_SELF_BURDEN,
  );
}
