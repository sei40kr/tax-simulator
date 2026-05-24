export type TaxReturnType = "blue" | "white";

export interface IncomeTaxSettings {
  lifeInsuranceDeduction: number;
  medicalExpenseDeduction: number;
  donationDeduction: number;
  otherDeduction: number;
  disabilityDeduction: number;
  widowDeduction: number;
  studentDeduction: number;
}

export interface ResidentTaxSettings {
  cityIncomeRate: number;
  cityPerCapita: number;
  prefIncomeRate: number;
  prefPerCapita: number;
  forestTax: number;
}

export interface InsuranceComponent {
  incomeRate: number;
  perCapita: number;
  household: number;
  limit: number;
}

export interface HealthInsuranceSettings {
  medical: InsuranceComponent;
  support: InsuranceComponent;
  care: InsuranceComponent;
}

// 個人事業税は法定業種70業種を3区分に分類し、税率3% / 4% / 5%（または非課税）。
// 業種そのものは計算に不要なので、税率ブラケットのみ保持する。
export type BusinessTaxBracket =
  | "exempt"
  | "rate3"
  | "rate4"
  | "rate5"
  | "custom";

export interface BusinessTaxSettings {
  bracket: BusinessTaxBracket;
  customRate: number;
  minimumTaxableIncome: number;
}

export interface ConsumptionTaxSettings {
  isSubjectToTax: boolean;
  rate: number;
  simplifiedRate: number;
  useSimplifiedMethod: boolean;
}

export interface TaxSettings {
  income: number;
  expenses: number;
  grayExpenses: number;
  dependents: number;
  age: number;
  hasSpouse: boolean;
  spouseIncome: number;
  isFirstYear: boolean;

  nationalHealthInsurance: boolean;
  nationalPension: boolean;
  nationalPensionFund: boolean;
  nationalPensionFundMonthly: number;
  additionalPension: boolean;
  ideco: boolean;
  idecoMonthly: number;
  smallBusinessMutualAid: boolean;
  smallBusinessMutualAidMonthly: number;

  taxReturnType: TaxReturnType;

  incomeTaxSettings: IncomeTaxSettings;
  residentTaxSettings: ResidentTaxSettings;
  healthInsuranceSettings: HealthInsuranceSettings;
  businessTaxSettings: BusinessTaxSettings;
  consumptionTaxSettings: ConsumptionTaxSettings;
}

export interface TaxResults {
  netIncome: number;
  taxableIncome: number;
  incomeTax: number;
  residentTax: number;
  healthInsurance: number;
  careInsurance: number;
  pension: number;
  nationalPensionFund: number;
  additionalPension: number;
  ideco: number;
  smallBusinessMutualAid: number;
  businessTax: number;
  consumptionTax: number;
  totalTax: number;
  totalDeduction: number;
  takeHome: number;
  taxRate: number;
}
