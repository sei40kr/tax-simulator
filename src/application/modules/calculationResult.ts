import calculateConsumptionTax from '../../domain/service/calculateConsumptionTax';
import calculateGrossIncome from '../../domain/service/calculateGrossIncome';
import { RootState } from '../store';
import {
  selectDeemedPurchaseRate,
  selectExpense,
  selectRevenue,
} from './calculationInput';

export const selectGrossIncome = (state: RootState) => {
  const revenue = selectRevenue(state);
  const expense = selectExpense(state);
  return calculateGrossIncome(revenue, expense);
};

export const selectConsumptionTax = (state: RootState) => {
  const deemedPurchaseRate = selectDeemedPurchaseRate(state);
  const grossIncome = selectGrossIncome(state);
  return calculateConsumptionTax(deemedPurchaseRate, grossIncome);
};
