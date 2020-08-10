import { createAction, createSlice } from "@reduxjs/toolkit";
import DeemedPurchaseRate, {
  DeemedPurchaseRateId
} from "../../domain/model/DeemedPurchaseRate";
import Expense from "../../domain/model/Expense";
import FilingMethod, { FilingMethodId } from "../../domain/model/FilingMethod";
import Revenue from "../../domain/model/Revenue";
import { RootState } from "../store";

export const update = createAction<{
  revenue: number;
  expense: number;
  filingMethodId: FilingMethodId;
  deemedPurchaseRateId: DeemedPurchaseRateId;
}>("update");

const formSlice = createSlice({
  name: "form",
  initialState: {
    revenue: 0,
    expense: 0,
    filingMethodId: FilingMethod.WHITE.getId(),
    deemedPurchaseRateId: DeemedPurchaseRate.RATE_90.getId()
  },
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(update, (_state, { payload }) => payload)
      .addDefaultCase((_state, _action) => {})
});

export const selectRevenue = ({ calculationInput: { revenue } }: RootState) =>
  new Revenue(revenue);

export const selectExpense = ({ calculationInput: { expense } }: RootState) =>
  new Expense(expense);

export const selectFilingMethod = ({
  calculationInput: { filingMethodId }
}: RootState) => FilingMethod.fromId(filingMethodId);

export const selectDeemedPurchaseRate = ({
  calculationInput: { deemedPurchaseRateId }
}: RootState) => DeemedPurchaseRate.fromId(deemedPurchaseRateId);

const calculationInputReducer = formSlice.reducer;
export default calculationInputReducer;
