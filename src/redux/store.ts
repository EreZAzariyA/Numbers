import { configureStore } from "@reduxjs/toolkit";
import authSlicer from "./slicers/auth-slicer";
import themeSlicer from "./slicers/theme-slicer";
import invoicesSlicer from "./slicers/invoices";
import categoriesSlicer from "./slicers/categories";
import langSlicer from "./slicers/lang-slicer";
import bankSlicer from "./slicers/bank-slicer";
import authMiddleWare from "./middlewares/auth.mw";

const store = configureStore({
  reducer: {
    auth: authSlicer,
    theme: themeSlicer,
    categories: categoriesSlicer,
    invoices: invoicesSlicer,
    language: langSlicer,
    userBanks: bankSlicer
  },
  middleware: (defaultMiddleware) => (defaultMiddleware().concat(authMiddleWare)),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;