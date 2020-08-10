import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import calculationInputReducer from "./modules/calculationInput";

export const store = configureStore({
  reducer: {
    calculationInput: calculationInputReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
