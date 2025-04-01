import { calcBusinessTax } from "./business-tax";
import {
  ADDITIONAL_PENSION_MONTHLY,
  DEFAULT_TAX_SETTINGS,
  MONTHS_PER_YEAR,
  NATIONAL_PENSION_MONTHLY,
} from "./constants";
import { calcConsumptionTax } from "./consumption-tax";
import {
  calcBaseDeduction,
  calcBaseDeductionResident,
  calcBlueReturnDeduction,
  calcDependentDeduction,
  calcDependentDeductionResident,
  calcSpouseDeduction,
  calcSpouseDeductionResident,
  sumIncomeTaxDeductions,
  sumResidentTaxDeductions,
} from "./deductions";
import { calcHealthInsurance } from "./health-insurance";
import { calcIncomeTax } from "./income-tax";
import { calcResidentTax } from "./resident-tax";
import type { TaxResults, TaxSettings } from "./types";

export type {
  BusinessTaxSettings,
  ConsumptionTaxSettings,
  HealthInsuranceSettings,
  IncomeTaxSettings,
  InsuranceComponent,
  ResidentTaxSettings,
  TaxResults,
  TaxReturnType,
  TaxSettings,
} from "./types";

export function calculateTaxes(settings: TaxSettings): TaxResults {
  // 入力は税込（税込経理）。納付消費税は租税公課として事業所得から控除する。
  const consumptionTax = calcConsumptionTax(
    settings.income,
    settings.expenses,
    settings.consumptionTaxSettings,
  );

  const grossIncome = Math.max(0, settings.income - settings.expenses);
  const netIncome = Math.max(0, grossIncome - consumptionTax);

  const blueReturnDeduction = calcBlueReturnDeduction(
    settings.taxReturnType,
    settings.isFirstYear,
  );
  // 事業所得 = 売上 − 経費 − 納付消費税 − 青色申告特別控除（= 合計所得金額）
  const businessIncome = Math.max(0, netIncome - blueReturnDeduction);

  const { healthInsurance, careInsurance } = calcHealthInsurance(
    businessIncome,
    settings.age,
    settings.nationalHealthInsurance,
    settings.healthInsuranceSettings,
  );
  const pension = settings.nationalPension
    ? NATIONAL_PENSION_MONTHLY * MONTHS_PER_YEAR
    : 0;
  const nationalPensionFund = settings.nationalPensionFund
    ? settings.nationalPensionFundMonthly * MONTHS_PER_YEAR
    : 0;
  const additionalPension = settings.additionalPension
    ? ADDITIONAL_PENSION_MONTHLY * MONTHS_PER_YEAR
    : 0;
  const ideco = settings.ideco ? settings.idecoMonthly * MONTHS_PER_YEAR : 0;
  const smallBusinessMutualAid = settings.smallBusinessMutualAid
    ? settings.smallBusinessMutualAidMonthly * MONTHS_PER_YEAR
    : 0;
  const socialInsuranceDeduction =
    healthInsurance +
    careInsurance +
    pension +
    nationalPensionFund +
    additionalPension +
    ideco +
    smallBusinessMutualAid;

  const totalDeduction =
    calcBaseDeduction(businessIncome) +
    calcSpouseDeduction(settings.hasSpouse, settings.spouseIncome) +
    calcDependentDeduction(settings.dependents) +
    sumIncomeTaxDeductions(settings.incomeTaxSettings) +
    socialInsuranceDeduction;

  const residentTotalDeduction =
    calcBaseDeductionResident(businessIncome) +
    calcSpouseDeductionResident(settings.hasSpouse, settings.spouseIncome) +
    calcDependentDeductionResident(settings.dependents) +
    sumResidentTaxDeductions(settings.incomeTaxSettings) +
    socialInsuranceDeduction;

  // 課税所得は千円未満切り捨て
  const taxableIncome =
    Math.floor(Math.max(0, businessIncome - totalDeduction) / 1000) * 1000;
  const residentTaxableIncome =
    Math.floor(Math.max(0, businessIncome - residentTotalDeduction) / 1000) *
    1000;

  const incomeTax = calcIncomeTax(taxableIncome);
  const residentTax = calcResidentTax(
    residentTaxableIncome,
    settings.residentTaxSettings,
  );
  const businessTax = calcBusinessTax(netIncome, settings.businessTaxSettings);

  const totalTax =
    incomeTax +
    residentTax +
    healthInsurance +
    careInsurance +
    pension +
    nationalPensionFund +
    additionalPension +
    ideco +
    smallBusinessMutualAid +
    businessTax +
    consumptionTax;

  // 消費税は netIncome の計算時に租税公課として控除済みのため takeHome から重複控除しない
  const takeHome = netIncome - (totalTax - consumptionTax);
  const taxRate = grossIncome > 0 ? totalTax / grossIncome : 0;

  return {
    netIncome,
    taxableIncome,
    incomeTax,
    residentTax,
    healthInsurance,
    careInsurance,
    pension,
    nationalPensionFund,
    additionalPension,
    ideco,
    smallBusinessMutualAid,
    businessTax,
    consumptionTax,
    totalTax,
    totalDeduction,
    takeHome,
    taxRate,
  };
}

export function getDefaultTaxSettings(): TaxSettings {
  return structuredClone(DEFAULT_TAX_SETTINGS);
}

export { DEFAULT_TAX_SETTINGS } from "./constants";
