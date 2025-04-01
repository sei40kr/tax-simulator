import {
  BASE_DEDUCTION_BRACKETS,
  BASE_DEDUCTION_BRACKETS_RESIDENT,
  BLUE_RETURN_DEDUCTION,
  BLUE_RETURN_DEDUCTION_FIRST_YEAR,
  DEPENDENT_DEDUCTION_PER_PERSON,
  DEPENDENT_DEDUCTION_PER_PERSON_RESIDENT,
  LIFE_INSURANCE_DEDUCTION_LIMIT_RESIDENT,
  SPOUSE_DEDUCTION,
  SPOUSE_DEDUCTION_RESIDENT,
  SPOUSE_INCOME_LIMIT,
} from "./constants";
import type { IncomeTaxSettings, TaxReturnType } from "./types";

export function calcBaseDeduction(grossIncome: number): number {
  const bracket = BASE_DEDUCTION_BRACKETS.find(
    (b) => grossIncome <= b.threshold,
  );
  return bracket ? bracket.amount : 0;
}

export function calcBaseDeductionResident(grossIncome: number): number {
  const bracket = BASE_DEDUCTION_BRACKETS_RESIDENT.find(
    (b) => grossIncome <= b.threshold,
  );
  return bracket ? bracket.amount : 0;
}

export function calcSpouseDeduction(
  hasSpouse: boolean,
  spouseIncome: number,
): number {
  return hasSpouse && spouseIncome <= SPOUSE_INCOME_LIMIT
    ? SPOUSE_DEDUCTION
    : 0;
}

export function calcSpouseDeductionResident(
  hasSpouse: boolean,
  spouseIncome: number,
): number {
  return hasSpouse && spouseIncome <= SPOUSE_INCOME_LIMIT
    ? SPOUSE_DEDUCTION_RESIDENT
    : 0;
}

export function calcDependentDeduction(dependents: number): number {
  return dependents * DEPENDENT_DEDUCTION_PER_PERSON;
}

export function calcDependentDeductionResident(dependents: number): number {
  return dependents * DEPENDENT_DEDUCTION_PER_PERSON_RESIDENT;
}

export function sumIncomeTaxDeductions(settings: IncomeTaxSettings): number {
  return (
    settings.lifeInsuranceDeduction +
    settings.medicalExpenseDeduction +
    settings.donationDeduction +
    settings.otherDeduction +
    settings.disabilityDeduction +
    settings.widowDeduction +
    settings.studentDeduction
  );
}

// 住民税側の所得控除合計。生命保険料控除のみ住民税上限（7万円）を適用。
export function sumResidentTaxDeductions(settings: IncomeTaxSettings): number {
  const lifeInsurance = Math.min(
    settings.lifeInsuranceDeduction,
    LIFE_INSURANCE_DEDUCTION_LIMIT_RESIDENT,
  );
  return (
    lifeInsurance +
    settings.medicalExpenseDeduction +
    settings.donationDeduction +
    settings.otherDeduction +
    settings.disabilityDeduction +
    settings.widowDeduction +
    settings.studentDeduction
  );
}

export function calcBlueReturnDeduction(
  taxReturnType: TaxReturnType,
  isFirstYear: boolean,
): number {
  if (taxReturnType !== "blue") return 0;
  return isFirstYear ? BLUE_RETURN_DEDUCTION_FIRST_YEAR : BLUE_RETURN_DEDUCTION;
}
