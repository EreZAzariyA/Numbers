import { ActionReducerMapBuilder, createSlice, SerializedError } from "@reduxjs/toolkit";
import { MainBanksAccount } from "../../models/bank-model";
import { connectBankAccount, fetchBankAccounts, refreshBankData } from "../actions/banks";

interface BanksAccountState {
  account: MainBanksAccount;
  loading: boolean;
  error: SerializedError | null;
};

const initialState: BanksAccountState = {
  account: {
    _id: null,
    userId: null,
    banks: [],
  },
  loading: false,
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
    account: action.payload
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
      banks: action.payload.bank.banks
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
};

const bankSlicer = createSlice({
  initialState,
  name: 'banks',
  reducers: null,
  extraReducers
});


export default bankSlicer.reducer;