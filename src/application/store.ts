import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import calculationReducer from "./modules/calculation";
import settingsReducer from "./modules/settings";

export const store = configureStore({
  reducer: {
    calculation: calculationReducer,
    settings: settingsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
