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

export interface BusinessTaxSettings {
  isSubjectToTax: boolean;
  rate: number;
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
