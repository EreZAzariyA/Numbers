import { configureStore } from "@reduxjs/toolkit";
import authSlicer from "./slicers/authentication";
import transactionsSlicer from "./slicers/transactions";
import categoriesSlicer from "./slicers/categories";
import bankSlicer from "./slicers/banks";
import authMiddleWare from "./middlewares/auth.mw";
import userConfigSlicer from "./slicers/user-config";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    auth: authSlicer,
    categories: categoriesSlicer,
    transactions: transactionsSlicer,
    userBanks: bankSlicer,
    config: userConfigSlicer,
  },
  middleware: (defaultMiddleware) => (defaultMiddleware().concat(authMiddleWare)),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export default store;