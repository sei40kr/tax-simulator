import {
  DEFAULT_TAX_SETTINGS,
  type TaxSettings,
} from "@/lib/calculations/calculator";
import {
  DEFAULT_PENSION_RETURN_RATES,
  type PensionSchemeKey,
} from "@/lib/calculations/pension-accumulation";

export const SIMULATION_STORAGE_KEY = "tax-simulator:inputs:v1";

export interface SimulationInputs {
  settings: TaxSettings;
  pensionYears: number;
  returnRates: Record<PensionSchemeKey, number>;
}

export function loadSimulationInputs(): SimulationInputs | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SIMULATION_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<SimulationInputs>;
    if (!parsed.settings || typeof parsed.settings !== "object") return null;
    return {
      settings: { ...DEFAULT_TAX_SETTINGS, ...parsed.settings } as TaxSettings,
      pensionYears:
        typeof parsed.pensionYears === "number" ? parsed.pensionYears : 30,
      returnRates: {
        ...DEFAULT_PENSION_RETURN_RATES,
        ...(parsed.returnRates ?? {}),
      },
    };
  } catch {
    return null;
  }
}

export function saveSimulationInputs(inputs: SimulationInputs): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      SIMULATION_STORAGE_KEY,
      JSON.stringify(inputs),
    );
  } catch {
    // ignore quota/serialization errors
  }
}
