import { MONTHS_PER_YEAR } from "./constants";

export type PensionSchemeKey =
  | "ideco"
  | "nationalPensionFund"
  | "additionalPension"
  | "smallBusinessMutualAid";

export interface PensionSchemeMeta {
  key: PensionSchemeKey;
  label: string;
}

export const PENSION_SCHEME_META: readonly PensionSchemeMeta[] = [
  { key: "ideco", label: "iDeCo" },
  { key: "nationalPensionFund", label: "国民年金基金" },
  { key: "additionalPension", label: "付加年金" },
  { key: "smallBusinessMutualAid", label: "小規模企業共済" },
];

export const DEFAULT_PENSION_RETURN_RATES: Record<PensionSchemeKey, number> = {
  ideco: 3.0,
  nationalPensionFund: 1.5,
  additionalPension: 0,
  smallBusinessMutualAid: 1.0,
};

export interface PensionScheme {
  key: PensionSchemeKey;
  label: string;
  monthlyAmount: number;
  annualReturnRate: number;
}

export interface AccumulationYearPoint {
  year: number;
  contribution: number;
  gain: number;
  total: number;
}

export function calculatePensionAccumulation(
  schemes: readonly PensionScheme[],
  years: number,
): AccumulationYearPoint[] {
  const balances = new Map<PensionSchemeKey, number>();
  for (const s of schemes) balances.set(s.key, 0);

  const points: AccumulationYearPoint[] = [
    { year: 0, contribution: 0, gain: 0, total: 0 },
  ];

  const span = Math.max(0, Math.floor(years));
  for (let y = 1; y <= span; y++) {
    for (const s of schemes) {
      const monthlyRate = s.annualReturnRate / 100 / MONTHS_PER_YEAR;
      let b = balances.get(s.key) ?? 0;
      for (let m = 0; m < MONTHS_PER_YEAR; m++) {
        b = b * (1 + monthlyRate) + s.monthlyAmount;
      }
      balances.set(s.key, b);
    }
    const contribution = schemes.reduce(
      (acc, s) => acc + s.monthlyAmount * MONTHS_PER_YEAR * y,
      0,
    );
    const total = Array.from(balances.values()).reduce(
      (acc, v) => acc + v,
      0,
    );
    const gain = Math.max(0, total - contribution);
    points.push({ year: y, contribution, gain, total });
  }
  return points;
}

export function pickMilestonePoints(
  points: readonly AccumulationYearPoint[],
  stride: number,
): AccumulationYearPoint[] {
  const result: AccumulationYearPoint[] = [];
  for (const p of points) {
    if (p.year === 0) continue;
    if (p.year % stride === 0) result.push(p);
  }
  const last = points[points.length - 1];
  if (
    last &&
    last.year !== 0 &&
    (result.length === 0 || result[result.length - 1].year !== last.year)
  ) {
    result.push(last);
  }
  return result;
}
