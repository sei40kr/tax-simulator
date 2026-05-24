import type { BusinessTaxBracket, BusinessTaxSettings } from "./types";

const BRACKET_RATES: Record<Exclude<BusinessTaxBracket, "custom">, number> = {
  exempt: 0,
  rate3: 3,
  rate4: 4,
  rate5: 5,
};

export function getBusinessTaxRate(settings: BusinessTaxSettings): number {
  return settings.bracket === "custom"
    ? settings.customRate
    : BRACKET_RATES[settings.bracket];
}

export function calcBusinessTax(
  netIncome: number,
  settings: BusinessTaxSettings,
): number {
  if (settings.bracket === "exempt") return 0;
  if (netIncome <= settings.minimumTaxableIncome) return 0;
  const rate = getBusinessTaxRate(settings);
  return (netIncome - settings.minimumTaxableIncome) * (rate / 100);
}
