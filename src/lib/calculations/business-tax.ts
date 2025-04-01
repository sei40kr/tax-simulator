import type { BusinessTaxSettings } from "./types";

export function calcBusinessTax(
  netIncome: number,
  settings: BusinessTaxSettings,
): number {
  if (!settings.isSubjectToTax) return 0;
  if (netIncome <= settings.minimumTaxableIncome) return 0;
  return (netIncome - settings.minimumTaxableIncome) * (settings.rate / 100);
}
