import { createAction, createSlice } from "@reduxjs/toolkit";
import FilingMethod from "../../domain/model/FilingMethod";
import { RootState } from "../store";

export const changeFilingMethod = createAction<FilingMethod>(
  "changeFilingMethod"
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    filingMethod: FilingMethod.WHITE
  },
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(changeFilingMethod, (state, { payload }) => {
        state.filingMethod = payload;
      })
      .addDefaultCase((_state, _action) => {})
});

export const selectFilingMethod = ({ settings: { filingMethod } }: RootState) =>
  filingMethod;

const settingsReducer = settingsSlice.reducer;
export default settingsReducer;
