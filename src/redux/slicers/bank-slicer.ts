import { ActionReducerMapBuilder, createSlice, SerializedError } from "@reduxjs/toolkit";
import { MainBanksAccount } from "../../models/bank-model";
import { connectBankAccount, fetchBankAccounts, refreshBankData, setBankAsMainAccount } from "../actions/bank-actions";

interface BanksAccountState {
  account: MainBanksAccount;
  loading: boolean;
  mainAccountLoading?: boolean;
  error: SerializedError | null;
};

const initialState: BanksAccountState = {
  account: {
    _id: null,
    userId: null,
    banks: [],
  },
  loading: false,
  mainAccountLoading: false,
  error: null
};

const extraReducers = (builder: ActionReducerMapBuilder<BanksAccountState>) => {
  builder.addCase(fetchBankAccounts.pending, (state) => ({
    ...state,
    loading: true,
    error: null
  }))
  .addCase(fetchBankAccounts.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  .addCase(fetchBankAccounts.fulfilled, (state, action) => ({
    ...state,
    loading: false,
    error: null,
    account: {
      _id: action.payload?._id || null,
      userId: action.payload?.userId || null,
      banks: action.payload?.banks || [],
    }
  }));

  builder.addCase(connectBankAccount.pending, (state) => ({
    ...state,
    loading: true,
    error: null
  }))
  .addCase(connectBankAccount.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.payload
  }))
  .addCase(connectBankAccount.fulfilled, (state, action) => ({
    ...state,
    loading: false,
    error: null,
    account: {
      _id: action.payload.bank._id,
      userId: action.payload.bank.userId,
      banks: [...state.account.banks, action.payload.bank],
    }
  }));

  builder.addCase(refreshBankData.pending, (state) => ({
    ...state,
    loading: true,
    error: null
  }))
  .addCase(refreshBankData.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  .addCase(refreshBankData.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;
    const bankIndex = state.account.banks.findIndex((bank) => bank._id === action.payload.bank?._id);
    state.account.banks[bankIndex] = action.payload.bank;
  });

  builder.addCase(setBankAsMainAccount.pending, (state) => ({
    ...state,
    mainAccountLoading: true
  }))
  .addCase(setBankAsMainAccount.rejected, (state, action) => ({
    ...state,
    mainAccountLoading: false,
    error: action.error
  }))
  .addCase(setBankAsMainAccount.fulfilled, (state, action) => {

    const banks = state.account.banks.map((bank) => ({
      ...bank,
      isMainAccount: bank._id === action.meta.arg.bank_id,
    }));

    return {
      ...state,
      mainAccountLoading: false,
      error: null,
      account: {
        ...state.account,
        banks,
      }
    }
  })
};

const bankSlicer = createSlice({
  initialState,
  name: 'banks',
  reducers: {
    banksHandleLogout() {
      return {
        account: null,
        error: null,
        loading: false,
      };
    }
  },
  extraReducers
});

export const { banksHandleLogout } = bankSlicer.actions;
export default bankSlicer.reducer;