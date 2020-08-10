import ConsumptionTax from "../model/ConsumptionTax";
import DeemedPurchaseRate from "../model/DeemedPurchaseRate";
import GrossIncome from "../model/GrossIncome";

const calculateConsumptionTax = (
  deemedPurchaseRate: DeemedPurchaseRate,
  grossIncome: GrossIncome
) =>
  new ConsumptionTax(
    Math.floor(grossIncome.getValue() * (1 - deemedPurchaseRate.getRate()) * 0.1)
  );
export default calculateConsumptionTax;
