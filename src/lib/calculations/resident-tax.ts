import type { ResidentTaxSettings } from "./types";

export function calcResidentIncomeRateTax(
  taxableIncome: number,
  settings: ResidentTaxSettings,
): number {
  // 所得割は市・県それぞれ百円未満切り捨て
  const cityIncomeTax =
    Math.floor((taxableIncome * (settings.cityIncomeRate / 100)) / 100) * 100;
  const prefIncomeTax =
    Math.floor((taxableIncome * (settings.prefIncomeRate / 100)) / 100) * 100;
  return cityIncomeTax + prefIncomeTax;
}

export function calcResidentTax(
  taxableIncome: number,
  settings: ResidentTaxSettings,
): number {
  return (
    calcResidentIncomeRateTax(taxableIncome, settings) +
    settings.cityPerCapita +
    settings.prefPerCapita +
    settings.forestTax
  );
}
