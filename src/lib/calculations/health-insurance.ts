import {
  CARE_INSURANCE_AGE_MAX,
  CARE_INSURANCE_AGE_MIN,
  HEALTH_INSURANCE_BASIC_DEDUCTION,
} from "./constants";
import type { HealthInsuranceSettings, InsuranceComponent } from "./types";

function capComponent(
  taxableBasis: number,
  { incomeRate, perCapita, household, limit }: InsuranceComponent,
): number {
  return Math.min(
    taxableBasis * (incomeRate / 100) + perCapita + household,
    limit,
  );
}

export interface HealthInsuranceResult {
  healthInsurance: number;
  careInsurance: number;
}

// 算定基礎額 = 総所得金額等（事業所得は青色申告特別控除後）− 基礎控除相当額43万円
export function calcHealthInsurance(
  businessIncome: number,
  age: number,
  isEnrolled: boolean,
  settings: HealthInsuranceSettings,
): HealthInsuranceResult {
  if (!isEnrolled) return { healthInsurance: 0, careInsurance: 0 };

  const taxableBasis = Math.max(
    0,
    businessIncome - HEALTH_INSURANCE_BASIC_DEDUCTION,
  );

  const medical = capComponent(taxableBasis, settings.medical);
  const support = capComponent(taxableBasis, settings.support);
  const eligibleForCare =
    age >= CARE_INSURANCE_AGE_MIN && age < CARE_INSURANCE_AGE_MAX;
  const care = eligibleForCare ? capComponent(taxableBasis, settings.care) : 0;

  return {
    healthInsurance: medical + support,
    careInsurance: care,
  };
}
