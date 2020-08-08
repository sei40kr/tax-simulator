import { createAction, createSlice } from "@reduxjs/toolkit";
import Expense from "../../domain/model/Expense";
import GrossIncome from "../../domain/model/GrossIncome";
import Revenue from "../../domain/model/Revenue";
import { RootState } from "../store";

export const calculate = createAction<{
  revenue: Revenue;
  expense: Expense;
}>("calculate");

const calculationSlice = createSlice({
  name: "form",
  initialState: {
    revenue: null as Revenue | null,
    expense: null as Expense | null,
    grossIncome: null as GrossIncome | null
  },
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(calculate, (_state, { payload: { revenue, expense } }) => ({
        revenue,
        expense,
        grossIncome:
          revenue !== null && expense !== null
            ? new GrossIncome(revenue, expense)
            : null
      }))
      .addDefaultCase((_state, _action) => {})
});

export const selectRevenue = ({ calculation: { revenue } }: RootState) =>
  revenue;

export const selectExpense = ({ calculation: { expense } }: RootState) =>
  expense;

export const selectGrossIncome = ({
  calculation: { grossIncome }
}: RootState) => grossIncome;

const calculationReducer = calculationSlice.reducer;
export default calculationReducer;
