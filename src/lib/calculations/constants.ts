import type { TaxSettings } from "./types";

// 配偶者控除（一般）— 令和7年度改正で給与収入123万円以下に引き上げ
// （給与所得控除最低保障 55→65万、合計所得要件 48→58万に伴う改正）
export const SPOUSE_INCOME_LIMIT = 1_230_000;
export const SPOUSE_DEDUCTION = 380_000;
// 住民税の配偶者控除
export const SPOUSE_DEDUCTION_RESIDENT = 330_000;

// 扶養控除（一般）— 1人あたり38万円
export const DEPENDENT_DEDUCTION_PER_PERSON = 380_000;
// 住民税の扶養控除
export const DEPENDENT_DEDUCTION_PER_PERSON_RESIDENT = 330_000;

// 青色申告特別控除
export const BLUE_RETURN_DEDUCTION = 650_000;
export const BLUE_RETURN_DEDUCTION_FIRST_YEAR = 550_000;

// 基礎控除（所得税）— 令和7年度税制改正による段階控除
// 恒久措置: 2350万円以下は58万円（旧48万円から引き上げ）
// 令和7・8年分のみの時限加算: 合計所得655万円以下は更に引き上げ
export interface BaseDeductionBracket {
  threshold: number;
  amount: number;
}
export const BASE_DEDUCTION_BRACKETS: readonly BaseDeductionBracket[] = [
  { threshold: 1_320_000, amount: 950_000 },
  { threshold: 3_360_000, amount: 880_000 },
  { threshold: 4_890_000, amount: 680_000 },
  { threshold: 6_550_000, amount: 630_000 },
  { threshold: 23_500_000, amount: 580_000 },
  { threshold: 24_000_000, amount: 480_000 },
  { threshold: 24_500_000, amount: 320_000 },
  { threshold: 25_000_000, amount: 160_000 },
  { threshold: Infinity, amount: 0 },
];

// 基礎控除（住民税）— 所得税より低く据置（合計所得2400万円以下は43万円）
export const BASE_DEDUCTION_BRACKETS_RESIDENT: readonly BaseDeductionBracket[] = [
  { threshold: 24_000_000, amount: 430_000 },
  { threshold: 24_500_000, amount: 290_000 },
  { threshold: 25_000_000, amount: 150_000 },
  { threshold: Infinity, amount: 0 },
];

// 生命保険料控除の上限（住民税）— 各項目2.8万、合計7万
export const LIFE_INSURANCE_DEDUCTION_LIMIT_RESIDENT = 70_000;

// 復興特別所得税（所得税額の2.1%）
export const RECONSTRUCTION_TAX_RATE = 0.021;

// 国民健康保険の所得割算定基礎額の控除（旧ただし書き方式の基礎控除相当額）
export const HEALTH_INSURANCE_BASIC_DEDUCTION = 430_000;

// 国民年金（令和7年度・2025年度）
export const NATIONAL_PENSION_MONTHLY = 17_510;
export const MONTHS_PER_YEAR = 12;

// 付加年金（月額固定）
export const ADDITIONAL_PENSION_MONTHLY = 400;

// iDeCo（個人型確定拠出年金）— 第1号被保険者
// 月額拠出は 1,000 円単位、最低 5,000 円、合算上限 68,000 円
export const IDECO_MONTHLY_MIN = 5_000;
export const IDECO_MONTHLY_STEP = 1_000;

// iDeCo + 国民年金基金 + 付加年金（400円）の合算月額上限
export const PENSION_COMBINED_MONTHLY_LIMIT = 68_000;

// 小規模企業共済 — 月額 1,000〜70,000 円（500 円単位）
export const SMALL_BUSINESS_MUTUAL_AID_MIN = 1_000;
export const SMALL_BUSINESS_MUTUAL_AID_MAX = 70_000;
export const SMALL_BUSINESS_MUTUAL_AID_STEP = 500;

// 介護分が課される年齢範囲
export const CARE_INSURANCE_AGE_MIN = 40;
export const CARE_INSURANCE_AGE_MAX = 65;

// 所得税の累進ブラケット（2024年度）
export interface IncomeTaxBracket {
  threshold: number;
  rate: number;
  deduction: number;
}
export const INCOME_TAX_BRACKETS: readonly IncomeTaxBracket[] = [
  { threshold: 1_950_000, rate: 0.05, deduction: 0 },
  { threshold: 3_300_000, rate: 0.1, deduction: 97_500 },
  { threshold: 6_950_000, rate: 0.2, deduction: 427_500 },
  { threshold: 9_000_000, rate: 0.23, deduction: 636_000 },
  { threshold: 18_000_000, rate: 0.33, deduction: 1_536_000 },
  { threshold: 40_000_000, rate: 0.4, deduction: 2_796_000 },
  { threshold: Infinity, rate: 0.45, deduction: 4_796_000 },
];

export const DEFAULT_TAX_SETTINGS: TaxSettings = {
  income: 5_000_000,
  expenses: 1_500_000,
  dependents: 0,
  age: 35,
  hasSpouse: false,
  spouseIncome: 0,
  isFirstYear: false,

  nationalHealthInsurance: true,
  nationalPension: true,
  nationalPensionFund: false,
  nationalPensionFundMonthly: 0,
  additionalPension: false,
  ideco: false,
  idecoMonthly: 0,
  smallBusinessMutualAid: false,
  smallBusinessMutualAidMonthly: 0,

  taxReturnType: "blue",

  incomeTaxSettings: {
    lifeInsuranceDeduction: 50_000,
    medicalExpenseDeduction: 0,
    donationDeduction: 0,
    otherDeduction: 0,
    disabilityDeduction: 0,
    widowDeduction: 0,
    studentDeduction: 0,
  },

  residentTaxSettings: {
    cityIncomeRate: 6,
    cityPerCapita: 3_500,
    prefIncomeRate: 4,
    prefPerCapita: 1_500,
    forestTax: 1_000,
  },

  // 国民健康保険料（令和7年度・2025年度の賦課限度額）
  healthInsuranceSettings: {
    medical: {
      incomeRate: 7.0,
      perCapita: 25_000,
      household: 20_000,
      limit: 660_000,
    },
    support: {
      incomeRate: 2.5,
      perCapita: 10_000,
      household: 5_000,
      limit: 260_000,
    },
    care: {
      incomeRate: 2.1,
      perCapita: 10_000,
      household: 5_000,
      limit: 170_000,
    },
  },

  businessTaxSettings: {
    isSubjectToTax: false,
    rate: 5,
    minimumTaxableIncome: 2_900_000,
  },

  consumptionTaxSettings: {
    isSubjectToTax: false,
    rate: 10,
    simplifiedRate: 60,
    useSimplifiedMethod: true,
  },
};
