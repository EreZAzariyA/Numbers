import { configureStore } from "@reduxjs/toolkit";
import authSlicer from "./slicers/auth-slicer";
import transactionsSlicer from "./slicers/transaction-slicer";
import categoriesSlicer from "./slicers/category-slicer";
import bankSlicer from "./slicers/bank-slicer";
import authMiddleWare from "./middlewares/auth.mw";
import userConfigSlicer from "./slicers/user-config-slicer";
import { useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    auth: authSlicer,
    categories: categoriesSlicer,
    transactions: transactionsSlicer,
    userBanks: bankSlicer,
    config: userConfigSlicer,
  },
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(authMiddleWare),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>()

export default store;